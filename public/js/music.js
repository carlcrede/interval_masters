const Music = (() => {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    const intervals = {
        m2: 1, M2: 2, m3: 3, M3: 4, P4: 5, 
        P5: 7, m6: 8, M6: 9, m7: 10, M7: 11, m: 3, M: 4
    };
    
    // TODO: find a way to put fitting octaves per instrument - and maybe a range of octaves where fitting
    const constructInterval = (root, interval) => {
        let lowOctave = 3, highOctave = 3;
        console.log(root, interval);
        const rootIndex = notes.indexOf(root);
        let nextNote = notes[(rootIndex + intervals[interval]) % notes.length];
        if (notes.indexOf(nextNote) < rootIndex) {
            highOctave++;
        }
        const tones = [root + lowOctave, nextNote + highOctave];
        return {tones, interval};
    };
    
    const constructTriad = (root, interval) => {
        let lowOctave = 3, middleOctave = 3, highOctave = 3;
        const rootIndex = notes.indexOf(root);
        const third = notes[(rootIndex + intervals[interval]) % notes.length];
        const fifth = notes[(rootIndex + intervals['P5']) % notes.length];

        if (notes.indexOf(third) < rootIndex) { middleOctave++; }
        if (notes.indexOf(fifth) < rootIndex) { highOctave++; }
        
        const tones = [root + lowOctave, third + middleOctave, fifth + highOctave];
        return {tones, interval};
    }

    const constructIntervalOrTriad = (playerGoal) => {
        const root = notes[Util.randomInt(0, 11)];
        const interval = nextRandomInterval(playerGoal);
        if (playerGoal.toLowerCase() == 'm') {
            return constructTriad(root, interval);
        } else {
            return constructInterval(root, interval);
        }
    }

    const nextRandomInterval = (playerGoal) => {
        switch (playerGoal) {
            case 'm':
            case 'M':
                return ['m', 'M'][Util.randomInt(0, 1)];
            case 'm2':    
            case 'M2':
                return ['m2', 'M2'][Util.randomInt(0, 1)];
            case 'm3':
            case 'M3':
                return ['m3', 'M3'][Util.randomInt(0, 1)];
            case 'P4':
            case 'P5':
                return ['P4', 'P5'][Util.randomInt(0, 1)];
            case 'm6':
            case 'M6':
                return ['m6', 'M6'][Util.randomInt(0, 1)];
            case 'm7':
            case 'M7':
                return ['m7', 'M7'][Util.randomInt(0, 1)];
        }
    }

    return {
        notes, constructIntervalOrTriad
    }
})();