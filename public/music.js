const Music = (() => {
    //const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    
    const intervals = {
        m2: 1, M2: 2, m3: 3, M3: 4, P4: 5, 
        P5: 7, m6: 8, M6: 9, m7: 10, M7: 11, m: 3, M: 4
    };
    
    // TODO: find a way to put fitting octaves per instrument - and maybe a range of octaves where fitting
    const constructInterval = (root, interval) => {
        console.log(root, interval);
        const rootIndex = notes.indexOf(root);
        const nextNote = notes[(rootIndex + intervals[interval]) % notes.length];
        const tones = [root + '3', nextNote + '3'];
        return {tones, interval};
    };
    
    const constructTriad = (root, interval) => {
        const rootIndex = notes.indexOf(root);
        const third = notes[(rootIndex + intervals[interval]) % notes.length];
        const fifth = notes[(rootIndex + intervals['P5']) % notes.length];
        const tones = [root + '3', third + '3', fifth + '3'];
        return {tones, interval};
    }

    const constructIntervalOrTriad = (chord, root, interval) => {
        if (chord.toLowerCase() == 'm') {
            return constructTriad(root, interval);
        } else {
            return constructInterval(root, interval);
        }
    }

    return {
        notes, constructIntervalOrTriad
    }
})();