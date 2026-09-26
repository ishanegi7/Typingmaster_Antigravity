const App = {
    screens: ['login', 'settings', 'instructions', 'game', 'result', 'records'],
    currentScreen: '',
    game: null,

    init() {
        this.game = new Game('game-canvas');
        
        const callsign = Storage.getCallsign();
        if (callsign) {
            document.getElementById('callsign-input').value = callsign;
            this.updateHeaderCallsign(callsign);
            this.showScreen('settings');
        } else {
            this.showScreen('login');
        }

        this.applySettings();
        this.bindEvents();
    },

    bindEvents() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        document.getElementById('btn-login-submit').addEventListener('click', () => this.submitLogin());
        
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', () => {
                const mode = parseInt(card.dataset.mode);
                this.startGamePrep(mode);
            });
        });

        document.getElementById('btn-crt').addEventListener('click', () => {
            const s = Storage.getSettings();
            s.crt = !s.crt;
            Storage.saveSettings(s);
            this.applySettings();
        });
        
        document.getElementById('btn-mute').addEventListener('click', () => {
            const s = Storage.getSettings();
            s.muted = !s.muted;
            Storage.saveSettings(s);
            this.applySettings();
            Audio.muted = s.muted;
            Audio.init(); 
        });

        document.getElementById('btn-aspect').addEventListener('click', () => {
            const s = Storage.getSettings();
            const aspects = ['AUTO', '16:9', '4:3'];
            s.aspect = aspects[(aspects.indexOf(s.aspect) + 1) % aspects.length];
            Storage.saveSettings(s);
            this.applySettings();
            if (this.game) setTimeout(() => this.game.resize(), 350);
        });

        document.getElementById('btn-callsign').addEventListener('click', () => {
            this.showScreen('login');
        });
        
        document.querySelectorAll('button, .mode-card').forEach(el => {
            el.addEventListener('click', () => Audio.playClick());
        });
    },

    handleKeyDown(e) {
        if (this.currentScreen === 'login') {
            if (e.key === 'Enter') this.submitLogin();
        } else if (this.currentScreen === 'settings') {
            if (['1', '2', '3', '4'].includes(e.key)) {
                this.startGamePrep(parseInt(e.key));
            }
        } else if (this.currentScreen === 'instructions') {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.showScreen('game');
                this.game.start(this.selectedMode);
            }
        } else if (this.currentScreen === 'game') {
            if (e.key === 'Escape') {
                this.game.stop();
                this.showScreen('settings');
            } else if (!e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1) {
                if (e.key === ' ') e.preventDefault();
                this.game.handleInput(e.key);
            }
        } else if (this.currentScreen === 'result') {
            if (e.key === 'Enter' || e.key === ' ') {
                this.showScreen('settings');
            } else if (e.key.toLowerCase() === 'r') {
                this.showScreen('records');
            }
        } else if (this.currentScreen === 'records') {
            if (e.key === 'Escape') {
                this.showScreen('settings');
            }
        }
    },

    submitLogin() {
        const val = document.getElementById('callsign-input').value.trim();
        if (val) {
            Storage.setCallsign(val);
            this.updateHeaderCallsign(val);
            Audio.init(); 
            this.showScreen('settings');
        }
    },

    updateHeaderCallsign(name) {
        document.getElementById('header-callsign').innerText = `OP: ${name.toUpperCase()}`;
    },

    startGamePrep(mode) {
        this.selectedMode = mode;
        this.showScreen('instructions');
    },

    showScreen(id) {
        this.screens.forEach(s => {
            document.getElementById(`screen-${s}`).classList.add('hidden');
        });
        document.getElementById(`screen-${id}`).classList.remove('hidden');
        this.currentScreen = id;
        
        if (id === 'records') {
            document.getElementById('record-filter').value = 'ALL';
            this.renderRecords();
        }
        if (id !== 'game') {
            document.getElementById('game-hud').style.display = 'none';
        } else {
            document.getElementById('game-hud').style.display = 'flex';
        }
    },

    applySettings() {
        const s = Storage.getSettings();
        if (s.crt) document.body.classList.add('crt-enabled');
        else document.body.classList.remove('crt-enabled');
        document.getElementById('btn-crt').innerText = `CRT:${s.crt ? 'ON' : 'OFF'}`;
        
        Audio.muted = s.muted;
        document.getElementById('btn-mute').innerText = `SND:${s.muted ? 'OFF' : 'ON'}`;
        
        const app = document.getElementById('app');
        app.classList.remove('aspect-auto', 'aspect-16-9', 'aspect-4-3');
        if (s.aspect === '16:9') app.classList.add('aspect-16-9');
        else if (s.aspect === '4:3') app.classList.add('aspect-4-3');
        else app.classList.add('aspect-auto');
        document.getElementById('btn-aspect').innerText = `ASP:${s.aspect}`;
    },

    showResult() {
        this.showScreen('result');
        const stats = this.game.lastStats;
        const prevBest = Storage.getBest(this.selectedMode);
        
        document.getElementById('res-score').innerText = stats.score;
        document.getElementById('res-wpm').innerText = stats.wpm;
        document.getElementById('res-acc').innerText = stats.accuracy + '%';
        document.getElementById('res-words').innerText = stats.wordsDestroyed;
        document.getElementById('res-combo').innerText = stats.maxCombo;
        document.getElementById('res-mode').innerText = `MODE ${this.selectedMode}`;

        const isNewBest = stats.score > prevBest;
        const msgEl = document.getElementById('res-msg');
        
        if (isNewBest) {
            msgEl.innerHTML = '<span class="glow-red blink">★ NEW PERSONAL BEST! ★</span>';
            Audio.playVictory();
            this.spawnConfetti();
        } else {
            msgEl.innerText = `PREV BEST: ${prevBest} (-${prevBest - stats.score})`;
        }

        Storage.addRecord({
            date: new Date().toISOString(),
            mode: this.selectedMode,
            score: stats.score,
            wpm: stats.wpm,
            accuracy: stats.accuracy,
            combo: stats.maxCombo,
            isPB: isNewBest
        });
    },

    spawnConfetti() {
        const resultScreen = document.getElementById('screen-result');
        const colors = ['#ff3333', '#33ff33', '#3333ff', '#ffff33', '#ff33ff', '#33ffff'];
        for (let i = 0; i < 60; i++) {
            const conf = document.createElement('div');
            conf.style.position = 'absolute';
            conf.style.width = '12px';
            conf.style.height = '12px';
            conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            conf.style.left = Math.random() * 100 + '%';
            conf.style.top = '-20px';
            conf.style.zIndex = 999;
            const animTime = Math.random() * 2 + 1.5;
            conf.style.transition = `top ${animTime}s cubic-bezier(.37,0,.63,1), transform ${animTime}s linear`;
            resultScreen.appendChild(conf);
            
            setTimeout(() => {
                conf.style.top = '110%';
                conf.style.transform = `rotate(${Math.random() * 720}deg) translateX(${Math.random() * 100 - 50}px)`;
            }, 50);
            
            setTimeout(() => {
                conf.remove();
            }, animTime * 1000 + 100);
        }
    },
    
    renderRecords() {
        const filterVal = document.getElementById('record-filter').value;
        let recs = Storage.getRecords().reverse();
        if (filterVal !== 'ALL') {
            recs = recs.filter(r => r.mode === parseInt(filterVal));
        }
        
        const tbody = document.getElementById('records-tbody');
        tbody.innerHTML = '';
        recs.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${new Date(r.date).toLocaleDateString()}</td>
                <td>MODE ${r.mode}</td>
                <td>${r.score} ${r.isPB ? '<span class="glow-red">★</span>' : ''}</td>
                <td>${r.wpm}</td>
                <td>${r.accuracy}%</td>
                <td>${r.combo}</td>
            `;
            tbody.appendChild(tr);
        });
        
        for(let i=1; i<=4; i++) {
            const best = Storage.getBest(i);
            document.getElementById(`pb-m${i}`).innerText = best;
        }
    }
};

window.onload = () => App.init();
