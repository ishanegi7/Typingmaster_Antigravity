const Audio = {
    ctx: null,
    muted: false,
    
    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            this.masterGain.gain.value = this.muted ? 0 : 0.2;
        }
    },
    
    toggleMute() {
        this.muted = !this.muted;
        if (this.masterGain) {
            this.masterGain.gain.value = this.muted ? 0 : 0.2;
        }
        return this.muted;
    },
    
    playOscillator(type, freqStart, freqEnd, duration, type2, freq2Start, freq2End) {
        if (!this.ctx || this.muted) return;
        
        // Ensure context is running if suspended
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(freqStart, now);
        if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, now + duration);
        
        gain.gain.setValueAtTime(1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        osc.start(now);
        osc.stop(now + duration);
        
        if (type2) {
            const osc2 = this.ctx.createOscillator();
            osc2.type = type2;
            osc2.connect(gain);
            osc2.frequency.setValueAtTime(freq2Start, now);
            if (freq2End) osc2.frequency.exponentialRampToValueAtTime(freq2End, now + duration);
            osc2.start(now);
            osc2.stop(now + duration);
        }
    },
    
    playShoot() {
        this.playOscillator('square', 1200, 400, 0.1);
    },
    
    playExplosion() {
        this.playOscillator('sawtooth', 100, 20, 0.4, 'square', 80, 10);
    },
    
    playBonusSpawn() {
        this.playOscillator('sine', 800, 1200, 0.2, 'sine', 1200, 1600);
    },
    
    playDamage() {
        this.playOscillator('sawtooth', 150, 40, 0.5, 'square', 100, 30);
    },
    
    playClick() {
        this.playOscillator('square', 1000, 1000, 0.05);
    },
    
    playVictory() {
        if (!this.ctx || this.muted) return;
        const now = this.ctx.currentTime;
        const notes = [440, 554, 659, 880];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;
            osc.connect(gain);
            gain.connect(this.masterGain);
            gain.gain.setValueAtTime(0, now + i * 0.15);
            gain.gain.linearRampToValueAtTime(0.5, now + i * 0.15 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.3);
            osc.start(now + i * 0.15);
            osc.stop(now + i * 0.15 + 0.3);
        });
    }
};
