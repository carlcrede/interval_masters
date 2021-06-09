// canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// start game button & score + lives counters
const startBtn = document.getElementById('startGameBtn');
let isRunning = true;

// player should choose what interval to practice - or maj/min 
let playerGoal;
let playerInstrument;
let playerPlaybackMode;
Tone.Master.volume.value = '-6';

// player and note icons
const playerIcon = new Image();
const quarterNoteIcon = new Image();
//playerIcon.src = './img/playerIcon.png'
quarterNoteIcon.src = './img/quarter_note.png';

// synth
//const synth = new Tone.PolySynth().toDestination();
const noteSpeed = 1;
const noteLength = 3;
const nextNoteInterval = 5000;

// player settings
const MOVEMENT_SPEED = 3;
const PLAYER_WIDTH = 43;
const PLAYER_HEIGHT = 70;
const PLAYER_LIVES = 3;
let player = {};

// object holding keypresses
let keyPresses = {};

/* const instruments = SampleLibrary.load({
    instruments: ['piano', 'violin', 'guitar-acoustic', 'guitar-electric', 'saxophone', 'flute', 'harp', ''],
    minify: false
}); */
let instruments;

function setPlayerInstrument(instrument) {
    playerIcon.src = `./img/${instrument}.svg`;
    console.log(playerIcon);
    instruments = SampleLibrary.load({
        instruments: [instrument],
        minify: false
    });
    playerInstrument = instrument; 
    instruments[instrument].toDestination();
}

const init = () => {
    canvas.width = window.innerWidth * 0.4;
    canvas.height = canvas.width * 0.6;

    player = { 
        width: PLAYER_WIDTH, 
        height: PLAYER_HEIGHT, 
        position: { 
            x: canvas.width/2, 
            y: canvas.height - PLAYER_HEIGHT 
        },
        speed: MOVEMENT_SPEED,
        lives: PLAYER_LIVES,
        score: 0
    };
}

window.onload = init;

window.onresize = () => {
    canvas.width = window.innerWidth * 0.4;
    canvas.height = canvas.width * 0.6;
}

startBtn.addEventListener('click', async() => {
    await Tone.start();
    startBtn.style.display = 'none';
    document.getElementById('game').style.display = 'block';
    requestAnimationFrame(gameLoop);
    startBtn.style.visibility = 'hidden';
    nextChord(Tone.now());
    let intervalId = setInterval(() => nextChord(Tone.now()), nextNoteInterval);
});

const nextRandomInterval = () => {
    const x = Object.keys(intervals);

    switch (playerGoal) {
        case 'm2':    
        case 'M2':
            return ['m2', 'M2'][Math.round(Math.random())];
        case 'm3':
        case 'M3':
            return x[getRandomIntInclusive(2, 3)];
        case 'P4':
        case 'P5':
            return x[getRandomIntInclusive(4, 5)];
        case 'm6':
        case 'M6':
            return x[getRandomIntInclusive(6, 7)];
        case 'm7':
        case 'M7':
            return x[getRandomIntInclusive(8, 9)];
    }
}

const nextRandomTriad = () => {
    return ['m3', 'M3'][getRandomIntInclusive(0, 1)];
}

let chords = [];
const nextChord = (now) => {
    const randomRoot = notes[getRandomIntInclusive(0, 11)];
    const randomIntervalOrTriad = (playerGoal.toLowerCase() == 'm') ? nextRandomTriad() : nextRandomInterval();
    const randomChord = (playerGoal.toLowerCase() == 'm') ? constructTriad(randomRoot, randomIntervalOrTriad) : constructInterval(randomRoot, randomIntervalOrTriad);
    console.log('Chord:', randomChord.tones, randomChord.interval);

    if (playerPlaybackMode == 'harmonic') {
        instruments[playerInstrument].triggerAttackRelease(randomChord.tones, noteLength, now);
    } else {
        if (randomChord.tones.length == 3) {
            console.log('Melodic, minor/major');
            instruments[playerInstrument].triggerAttackRelease(randomChord.tones[0], noteLength, now);
            instruments[playerInstrument].triggerAttackRelease(randomChord.tones[1], noteLength, now + 0.5);
            instruments[playerInstrument].triggerAttackRelease(randomChord.tones[2], noteLength, now + 1);
        } else {
            instruments[playerInstrument].triggerAttackRelease(randomChord.tones[0], noteLength, now);
            instruments[playerInstrument].triggerAttackRelease(randomChord.tones[1], noteLength, now + 0.5);
        }
    }

    const note = {
        width: Math.round(quarterNoteIcon.width/30),
        height: Math.round(quarterNoteIcon.height/30),
        position: {
            x: Math.floor(Math.random() * (canvas.width - Math.round(quarterNoteIcon.height/30))),
            y: 0
        },
        speed: noteSpeed,
        type: randomChord.interval
    }
    chords.unshift(note);
}

window.addEventListener('keydown', (event) => {
    keyPresses[event.key] = true;
}, false);

window.addEventListener('keyup', (event) => {
    keyPresses[event.key] = false;
}, false);

const moveSprite = (dx) => {
    if (player.position.x + dx > 0 && player.position.x + PLAYER_WIDTH + dx < canvas.width) {
        player.position.x += dx;
    }
}

const moveNotes = () => {
    chords.forEach((note, index) => {
        note.position.y += note.speed;
    });
}

const draw = () => {
    ctx.drawImage(playerIcon, player.position.x, canvas.height - PLAYER_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT);
    chords.forEach((note, index) => {
        if ((note.position.y + note.height) >= canvas.height) { 
            chords.splice(index, 1); 
            if (note.type == playerGoal) { player.lives--; }
            console.log('lives:', player.lives, 'score:', player.score);
            document.getElementById('lives').innerText = player.lives;
        }
        ctx.drawImage(quarterNoteIcon, note.position.x, note.position.y, note.width, note.height);
    });
}

const checkCollision = () => {
    chords.forEach((note, index) => {
        if (note.position.x < player.position.x + player.width  && note.position.x + note.width  > player.position.x &&
            note.position.y < player.position.y + player.height && note.position.y + note.height > player.position.y) {
            // The objects are touching
            chords.splice(index, 1);
            if (note.type == playerGoal) { 
                player.score++;
                document.getElementById('score').innerText = player.score;
            } else { 
                player.lives--;
                document.getElementById('lives').innerText = player.lives;
            }
            console.log('lives:', player.lives, 'score:', player.score);
        }
    });
}

const handleUserInput = () => {
    if (keyPresses.a || keyPresses.ArrowLeft) {
        moveSprite(-MOVEMENT_SPEED);
    } else if (keyPresses.d || keyPresses.ArrowRight) {
        moveSprite(MOVEMENT_SPEED);
    }
    if (keyPresses[" "]) {
        // shoot
    }
}

const gameLoop = () => {
    clearCanvas();

    handleUserInput();

    moveNotes();
    
    checkCollision();

    draw();

    requestAnimationFrame(gameLoop);
}

const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}