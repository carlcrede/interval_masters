
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
}

const constructMajorTriad = (root) => {
    const scale = majorScales[root];
    const third = scale[2];
    const fifth = scale[4];
    let triad = [root, third, fifth];
    triad = triad.map((value, index) => value + '4');
    return {triad, type: 'majorChord'};
}

const constructMinorTriad = (root) => {
    const scale = majorScales[root];
    const index = (root != 'G#') ? notes.indexOf(scale[2]) - 1: notes.indexOf('B');
    const third = notes[index];
    const fifth = scale[4];
    let triad = [root, third, fifth];
    triad = triad.map((value, index) => value + '4');
    return {triad, type: 'minorChord'};
}