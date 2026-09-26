const Words = {
    baseLists: {
        lower: ['radar', 'tank', 'artillery', 'missile', 'drone', 'laser', 'shield', 'base', 'armor', 'hull', 'turret', 'bomb', 'gun', 'ammo', 'medic', 'scout', 'pilot', 'squad', 'troop', 'flank', 'strike', 'combat', 'patrol', 'guard', 'recon'],
        upper: ['Radar', 'Tank', 'Artillery', 'Missile', 'Drone', 'Laser', 'Shield', 'Base', 'Armor', 'Hull', 'Turret', 'Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet', 'Kilo', 'Lima', 'Mike'],
        numbers: ['Tank99', 'Base0', 'Squad5', 'Unit7', 'v2.0', 'c4', 'm16', 'ak47', 'f22', 'b52', 'Sector9', 'Area51', 'Zone3', 'Base8', 'Talon1', 'Viper2', 'Ghost3', 'Nova4', 'Echo5', '007', '101', '404'],
        specials: ['[tank]', '{radar}', '(base)', '<hull>', '!alert!', 'sys.cmd', 'v-2.0', 'a+b=c', 'x*y', 'init()', 'run_cmd', 'usr_id', 'pwr_up', '#00ff00', '100%', '$cost', '@home', 'ip:192', 'x,y,z', '[]', '{}', '()', '<>', '!!', '&&', '||', '===']
    },
    redExclusions: {},
    
    getWordList(mode) {
        let list = [...this.baseLists.lower];
        if (mode >= 2) list = list.concat(this.baseLists.upper);
        if (mode >= 3) list = list.concat(this.baseLists.numbers);
        if (mode >= 4) list = list.concat(this.baseLists.specials);
        return list;
    },
    
    getRandomWord(mode) {
        const list = this.getWordList(mode);
        let attempts = 0;
        while (attempts < 50) {
            const word = list[Math.floor(Math.random() * list.length)];
            const firstChar = word[0].toLowerCase();
            const now = Date.now();
            if (!this.redExclusions[firstChar] || now > this.redExclusions[firstChar]) {
                return word;
            }
            attempts++;
        }
        return list[Math.floor(Math.random() * list.length)]; // Fallback
    },
    
    setExclusion(char, durationMs) {
        this.redExclusions[char.toLowerCase()] = Date.now() + durationMs;
    }
};
