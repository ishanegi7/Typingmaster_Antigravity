const Storage = {
    get(key, def) {
        const v = localStorage.getItem(`typetank_${key}`);
        return v ? JSON.parse(v) : def;
    },
    
    set(key, val) {
        localStorage.setItem(`typetank_${key}`, JSON.stringify(val));
    },
    
    getCallsign() { return this.get('callsign', ''); },
    
    setCallsign(c) { this.set('callsign', c); },
    
    getSettings() {
        return this.get('settings', { aspect: 'AUTO', crt: true, muted: false });
    },
    
    saveSettings(s) { this.set('settings', s); },
    
    getRecords() { return this.get('records', []); },
    
    addRecord(rec) {
        const r = this.getRecords();
        r.push(rec);
        this.set('records', r);
    },
    
    getBest(mode) {
        const r = this.getRecords().filter(x => x.mode === mode);
        return r.length ? Math.max(...r.map(x => x.score)) : 0;
    },
    
    clearRecords() { 
        this.set('records', []); 
    }
};
