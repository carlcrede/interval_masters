// canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// start game button & score + lives counters
const startBtn = document.getElementById('startGameBtn');

// player should choose what to practice - defaulting to minor
let playerGoal, instrument;

// player and note icons
const playerIcon = new Image();
const quarterNoteIcon = new Image();
playerIcon.src = './img/playerIcon.png'
quarterNoteIcon.src = './img/quarter_note.png';

// synth
//const synth = new Tone.PolySynth().toDestination();
const noteSpeed = 1;
const noteLength = '2n';
const nextNoteInterval = 3000; 

// player settings
const MOVEMENT_SPEED = 3;
const PLAYER_WIDTH = 43;
const PLAYER_HEIGHT = 70;
const PLAYER_LIVES = 3;
let player = {};

// object holding keypresses
let keyPresses = {};

const synth = SampleLibrary.load({
    instruments: 'piano',
    minify: true
});
synth.toDestination();
Tone.Master.volume.value = '-6';

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

startBtn.addEventListener('click', () => {
    document.getElementById('game').style.visibility = 'visible';
    requestAnimationFrame(gameLoop);
    startBtn.style.visibility = 'hidden';
    nextChord(Tone.now());
    setInterval(() => nextChord(Tone.now()), nextNoteInterval);
});

let chords = [];
const nextChord = (now) => {
    const randomRoot = notes[getRandomIntInclusive(0, 11)];
    const randomChord = (Math.round(Math.random())) ? constructMajorTriad(randomRoot) : constructMinorTriad(randomRoot);
    console.log(randomChord);
    synth.triggerAttack(randomChord.triad, now);
    synth.triggerRelease(now + 1);
    //synth.triggerAttackRelease(randomChord.triad, noteLength, now);
    const note = {
        width: Math.round(quarterNoteIcon.width/30),
        height: Math.round(quarterNoteIcon.height/30),
        position: {
            x: Math.floor(Math.random() * (canvas.width - Math.round(quarterNoteIcon.height/30))),
            y: 0
        },
        speed: noteSpeed,
        type: randomChord.type
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
    ctx.drawImage(playerIcon, player.position.x, canvas.height - PLAYER_HEIGHT);
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