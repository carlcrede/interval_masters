
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const majorScales = {
    'C': ['C', 'D', 'E', 'F', 'G', 'A'],
    'C#': ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'B'],
    'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
    'D#': ['D#', 'F', 'G', 'G#', 'A#', 'C', 'D'],
    'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
    'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
    'F#': ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'F'],
    'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F'],
    'G#': ['G#', 'A#', 'C', 'C#', 'D#', 'F', 'F#'],
    'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
    'A#': ['A#', 'C', 'D', 'D#', 'F', 'G', 'A'],
    'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#']
};

const intervals = {
    m2: 1, M2: 2, m3: 3, M3: 4, P4: 5, 
    P5: 7, m6: 8, M6: 9, m7: 10, M7: 11
};

// TODO: find a way to put fitting octaves per instrument - and maybe a range of octaves where fitting
const constructInterval = (root, interval) => {
    const rootIndex = notes.indexOf(root);
    const nextNote = notes[(rootIndex + intervals[interval]) % notes.length];
    const tones = [root + '3', nextNote + '4'];
    return {tones, interval};
};

const constructTriad = (root, interval) => {
    const rootIndex = notes.indexOf(root);
    const third = notes[(rootIndex + intervals[interval]) % notes.length];
    const fifth = notes[(rootIndex + intervals['P5']) % notes.length];
    const tones = [root + '3', third + '3', fifth + '3'];
    return {tones, interval};
}

/* const constructMajorTriad = (root) => {
    const scale = majorScales[root];
    const third = scale[2];
    const fifth = scale[4];
    let triad = [root, third, fifth];
    triad = triad.map((value, index) => value + '4');
    return {triad, type: 'majorChord'};
};

const constructMinorTriad = (root) => {
    const scale = majorScales[root];
    const index = (root != 'G#') ? notes.indexOf(scale[2]) - 1: notes.indexOf('B');
    const third = notes[index];
    const fifth = scale[4];
    let triad = [root, third, fifth];
    triad = triad.map((value, index) => value + '2');
    return {triad, type: 'minorChord'};
}; */