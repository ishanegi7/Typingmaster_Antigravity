class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.words = [];
        this.bullets = [];
        this.particles = [];
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.hits = 0;
        this.misses = 0;
        this.wordsDestroyed = 0;
        this.health = 100;
        this.mode = 1;
        this.running = false;
        this.lockedWord = null;
        this.turretAngle = -Math.PI / 2;
        this.startTime = 0;
        this.lastSpawnTime = 0;
        this.spawnInterval = 2000;
        this.baseSpeed = 1;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        if (this.running) {
             this.baseSpeed = this.height * 0.05;
        }
    }

    get fontSize() { return Math.max(16, Math.floor(this.height * 0.035)); }
    get fontString() { return `${this.fontSize}px "Share Tech Mono", monospace`; }

    start(mode) {
        this.mode = mode;
        this.words = [];
        this.bullets = [];
        this.particles = [];
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.hits = 0;
        this.misses = 0;
        this.wordsDestroyed = 0;
        this.health = 100;
        this.running = true;
        this.lockedWord = null;
        this.turretAngle = -Math.PI / 2;
        this.startTime = Date.now();
        this.lastSpawnTime = Date.now();
        this.spawnInterval = 2500;
        this.baseSpeed = this.height * 0.05; 
        this.resize();
        this.loop();
    }

    stop() {
        this.running = false;
    }

    handleInput(key) {
        if (!this.running || key.length !== 1) return;
        
        if (this.lockedWord) {
            const expected = this.lockedWord.text[this.lockedWord.progress];
            if (key === expected) {
                this.fireBullet(this.lockedWord);
            } else {
                this.combo = 0; 
                this.misses++;
            }
        } else {
            let bestWord = null;
            let maxY = -1;
            for (const w of this.words) {
                if (w.text[w.progress] === key) {
                    if (w.y > maxY) {
                        maxY = w.y;
                        bestWord = w;
                    }
                }
            }
            if (bestWord) {
                this.lockedWord = bestWord;
                this.fireBullet(this.lockedWord);
            } else {
                this.combo = 0;
                this.misses++;
            }
        }
        this.updateHUD();
    }

    fireBullet(word) {
        Audio.playShoot();
        this.hits++;
        
        this.ctx.font = this.fontString;
        const prefixWidth = this.ctx.measureText(word.text.substring(0, word.progress)).width;
        const charWidth = this.ctx.measureText(word.text[word.progress]).width;
        const targetX = word.x + prefixWidth + charWidth / 2;
        const targetY = word.y;
        
        word.progress++;
        
        const tx = this.width / 2;
        const ty = this.height;
        this.turretAngle = Math.atan2(targetY - ty, targetX - tx);
        
        this.bullets.push({
            x: tx, y: ty,
            targetX: targetX, targetY: targetY,
            speed: this.height * 2.5,
            word: word,
            distTotal: Math.hypot(targetX - tx, targetY - ty),
            distTraveled: 0
        });

        this.spawnParticles(tx + Math.cos(this.turretAngle)*40, ty + Math.sin(this.turretAngle)*40, 5, '#fff');

        if (word.progress === word.text.length) {
            word.completed = true;
            this.lockedWord = null;
        }
    }

    spawnParticles(x, y, count, color) {
        for(let i=0; i<count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 80 + 50;
            this.particles.push({
                x, y,
                vx: Math.cos(angle)*speed,
                vy: Math.sin(angle)*speed,
                life: 1.0,
                color: color
            });
        }
    }

    loop() {
        if (!this.running) return;
        const now = Date.now();
        const dt = (now - (this.lastTime || now)) / 1000;
        this.lastTime = now;

        this.update(dt);
        this.draw();

        requestAnimationFrame(() => this.loop());
    }

    update(dt) {
        const elapsed = (Date.now() - this.startTime) / 1000;
        this.spawnInterval = Math.max(600, 2500 - elapsed * 20);
        const currentSpeed = this.baseSpeed * (1 + elapsed * 0.03);

        for (const w of this.words) {
            if (w.isRed && !w.completed) {
                Words.setExclusion(w.text[0], 3000);
            }
        }

        if (Date.now() - this.lastSpawnTime > this.spawnInterval) {
            this.lastSpawnTime = Date.now();
            const isRed = Math.random() < 0.15; 
            const wordText = Words.getRandomWord(this.mode);
            this.ctx.font = this.fontString;
            const wordWidth = this.ctx.measureText(wordText).width;
            
            const x = Math.max(10, Math.min(this.width - wordWidth - 10, Math.random() * this.width));
            
            if (isRed) {
                Audio.playBonusSpawn();
                Words.setExclusion(wordText[0], 3000);
            }

            this.words.push({
                text: wordText,
                x: x,
                y: -this.fontSize,
                progress: 0,
                isRed: isRed,
                speedMultiplier: isRed ? 1.8 : 1,
                completed: false
            });
        }

        for (let i = this.words.length - 1; i >= 0; i--) {
            const w = this.words[i];
            if (!w.completed) {
                w.y += currentSpeed * w.speedMultiplier * dt;
            }
            if (w.y > this.height) {
                this.damage(w.isRed ? 30 : 20);
                Audio.playDamage();
                this.spawnParticles(w.x, this.height, 20, '#ff3333');
                if (this.lockedWord === w) this.lockedWord = null;
                this.words.splice(i, 1);
                this.combo = 0;
            }
        }

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            const dist = b.speed * dt;
            b.distTraveled += dist;
            b.x = b.x + (b.targetX - b.x) * (dist / (b.distTotal - b.distTraveled + 1));
            b.y = b.y + (b.targetY - b.y) * (dist / (b.distTotal - b.distTraveled + 1));
            
            if (b.distTraveled >= b.distTotal) {
                this.spawnParticles(b.targetX, b.targetY, 5, b.word.isRed ? '#ff3333' : '#33ff33');
                this.bullets.splice(i, 1);
                
                if (b.word.completed && b.word.progress === b.word.text.length) {
                    const bulletsLeft = this.bullets.filter(bl => bl.word === b.word).length;
                    if (bulletsLeft === 0) {
                        this.destroyWord(b.word);
                    }
                }
            }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt * 2;
            if (p.life <= 0) this.particles.splice(i, 1);
        }

        this.updateHUD();
    }

    destroyWord(word) {
        const idx = this.words.indexOf(word);
        if (idx > -1) {
            this.words.splice(idx, 1);
            Audio.playExplosion();
            this.spawnParticles(word.x, word.y, 25, word.isRed ? '#ff3333' : '#fff');
            
            this.combo++;
            if (this.combo > this.maxCombo) this.maxCombo = this.combo;
            
            const multiplier = word.isRed ? 3.5 : 1;
            const points = Math.floor(word.text.length * 10 * multiplier * (1 + this.combo * 0.1));
            this.score += points;
            this.wordsDestroyed++;
        }
    }

    damage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.gameOver();
        }
        document.body.classList.add('shake');
        setTimeout(() => document.body.classList.remove('shake'), 200);
    }

    gameOver() {
        this.running = false;
        Audio.playExplosion();
        setTimeout(() => {
            if (window.App) window.App.showResult();
        }, 1500);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.strokeStyle = '#33ff33';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height - 2);
        this.ctx.lineTo(this.width, this.height - 2);
        this.ctx.stroke();

        for (const w of this.words) {
            this.ctx.font = this.fontString;
            const textWidth = this.ctx.measureText(w.text).width;
            
            if (this.lockedWord === w) {
                this.ctx.fillStyle = 'rgba(51, 255, 51, 0.15)';
                this.ctx.fillRect(w.x - 4, w.y - this.fontSize, textWidth + 8, this.fontSize + 8);
            }

            for (let i = 0; i < w.text.length; i++) {
                const char = w.text[i];
                const charWidth = this.ctx.measureText(char).width;
                const prevWidth = this.ctx.measureText(w.text.substring(0, i)).width;
                
                this.ctx.fillStyle = w.isRed ? '#ff3333' : '#33ff33';
                
                if (i < w.progress) {
                    this.ctx.globalAlpha = 0.35;
                } else {
                    this.ctx.globalAlpha = 1.0;
                }
                
                this.ctx.fillText(char, w.x + prevWidth, w.y);
                
                if (this.lockedWord === w && i === w.progress) {
                    this.ctx.globalAlpha = 1.0;
                    this.ctx.fillRect(w.x + prevWidth, w.y + 4, charWidth, 3);
                }
            }
            this.ctx.globalAlpha = 1.0;
        }

        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        for (const b of this.bullets) {
            const tailLength = Math.min(25, b.distTraveled);
            const angle = Math.atan2(b.targetY - b.y, b.targetX - b.x);
            this.ctx.beginPath();
            this.ctx.moveTo(b.x, b.y);
            this.ctx.lineTo(b.x - Math.cos(angle)*tailLength, b.y - Math.sin(angle)*tailLength);
            this.ctx.stroke();
        }

        for (const p of this.particles) {
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1.0;

        const tx = this.width / 2;
        const ty = this.height;
        this.ctx.save();
        this.ctx.translate(tx, ty);
        
        this.ctx.fillStyle = '#060a06';
        this.ctx.strokeStyle = '#33ff33';
        this.ctx.lineWidth = 2;
        this.ctx.fillRect(-30, -20, 60, 20);
        this.ctx.strokeRect(-30, -20, 60, 20);
        
        this.ctx.beginPath();
        this.ctx.arc(0, -20, 20, Math.PI, 0);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.rotate(this.turretAngle);
        this.ctx.fillStyle = '#33ff33';
        this.ctx.fillRect(0, -3, 40, 6);
        this.ctx.restore();
    }

    updateHUD() {
        if (!window.App) return;
        const wpm = this.startTime === Date.now() ? 0 : Math.round((this.wordsDestroyed / ((Date.now() - this.startTime) / 60000)));
        const accuracy = this.hits + this.misses === 0 ? 100 : Math.round((this.hits / (this.hits + this.misses)) * 100);
        
        document.getElementById('hud-score').innerText = String(this.score).padStart(6, '0');
        document.getElementById('hud-combo').innerText = this.combo;
        document.getElementById('hud-wpm').innerText = wpm;
        document.getElementById('hud-acc').innerText = accuracy + '%';
        
        const healthBar = document.getElementById('hud-health');
        healthBar.style.width = this.health + '%';
        if (this.health > 50) healthBar.style.backgroundColor = '#33ff33';
        else if (this.health > 25) healthBar.style.backgroundColor = '#ffaa00';
        else healthBar.style.backgroundColor = '#ff3333';
        
        this.lastStats = { score: this.score, wpm, accuracy, wordsDestroyed: this.wordsDestroyed, maxCombo: this.maxCombo };
    }
}
