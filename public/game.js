const Game = (() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
     
    const playerIcon = new Image();
    const quarterNoteIcon = new Image();
    const background = new Image();
    background.src = './img/background.png';
    quarterNoteIcon.src = './img/quarter_note.png';
    
    let playerGoal;
    let playerInstrument;
    let playerPlaybackMode;
    Tone.Master.volume.value = '-6';
    
    const noteSpeed = 1;
    const noteLength = 1.5;
    const nextNoteInterval = 5000;
    
    // player settings
    const MOVEMENT_SPEED = 3;
    const PLAYER_WIDTH = 43;
    const PLAYER_HEIGHT = 70;
    const PLAYER_LIVES = 3;
    let player = {};
    
    // object holding keypresses
    let keyPresses = {};
    
    let instruments;
    
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
    
    let intervalId;
    
    const startGame = async () => {
        await Tone.start();
        requestAnimationFrame(gameLoop);
        nextChord(Tone.now());
        intervalId = setInterval(() => nextChord(Tone.now()), nextNoteInterval);
    }

    const gameOver = () => {
        player.score = 0;
        player.lives = 3;
        chords = [];
        
        ctx.fillStyle = 'black';
        ctx.font = '50px Libre Baskerville';
        ctx.fillText('Game Over', canvas.width/2 - 145, 125);
    }
    
    const nextRandomInterval = () => {
        switch (playerGoal) {
            case 'm':
            case 'M':
                return ['m', 'M'][getRandomIntInclusive(0, 1)];
            case 'm2':    
            case 'M2':
                return ['m2', 'M2'][getRandomIntInclusive(0, 1)];
            case 'm3':
            case 'M3':
                return ['m3', 'M3'][getRandomIntInclusive(0, 1)];
            case 'P4':
            case 'P5':
                return ['P4', 'P5'][getRandomIntInclusive(0, 1)];
            case 'm6':
            case 'M6':
                return ['m6', 'M6'][getRandomIntInclusive(0, 1)];
            case 'm7':
            case 'M7':
                return ['m7', 'M7'][getRandomIntInclusive(0, 1)];
        }
    }
    
    let chords = [];
    const nextChord = (now) => {
        const randomRoot = Music.notes[getRandomIntInclusive(0, 11)];
        const randomIntervalOrTriad = nextRandomInterval();
        //const randomChord = (playerGoal.toLowerCase() == 'm') ? constructTriad(randomRoot, randomIntervalOrTriad) : Music.constructInterval(randomRoot, randomIntervalOrTriad);
        const randomChord = Music.constructIntervalOrTriad(playerGoal, randomRoot, randomIntervalOrTriad);
        console.log('Chord:', randomChord.tones, randomChord.interval);
        if (playerPlaybackMode == 'harmonic') {
            instruments[playerInstrument].triggerAttackRelease(randomChord.tones, noteLength, now);
        } else {
            if (randomChord.tones.length == 3) {
                instruments[playerInstrument].triggerAttackRelease(randomChord.tones[0], noteLength, now);
                instruments[playerInstrument].triggerAttackRelease(randomChord.tones[1], noteLength, now + 0.5);
                instruments[playerInstrument].triggerAttackRelease(randomChord.tones[2], noteLength, now + 1);
            } else {
                instruments[playerInstrument].triggerAttackRelease(randomChord.tones[0], noteLength, now);
                instruments[playerInstrument].triggerAttackRelease(randomChord.tones[1], noteLength, now + 0.5);
            }
        }
    
        const note = buildNote(randomChord);
        chords.unshift(note);
    }
    
    const buildNote = (randomChord) => {
        return {
            width: Math.round(quarterNoteIcon.width/30),
            height: Math.round(quarterNoteIcon.height/30),
            position: {
                x: Math.floor(Math.random() * (canvas.width - Math.round(quarterNoteIcon.height/30))),
                y: 0
            },
            speed: noteSpeed,
            type: randomChord.interval
        }
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
        drawBackground();
        drawPlayer();
        drawNotes();
    }
    
    const drawNotes = () => {
        chords.forEach((note, index) => {
            ctx.drawImage(quarterNoteIcon, note.position.x, note.position.y, note.width, note.height);
        });
    }
    
    const drawPlayer = () => {
        ctx.drawImage(playerIcon, player.position.x, canvas.height - PLAYER_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT);
    }
    
    const drawBackground = () => {
        ctx.drawImage(background, 0, 0);
        ctx.fillStyle = 'green';
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
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

            if ((note.position.y + note.height) >= canvas.height) { 
                chords.splice(index, 1); 
                if (note.type == playerGoal) { 
                    player.lives--; 
                } else {
                    player.score++;
                }
                console.log('lives:', player.lives, 'score:', player.score);
                document.getElementById('lives').innerText = player.lives;
                document.getElementById('score').innerText = player.score;
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
    
        if (player.lives == 0) {
            clearInterval(intervalId);
            gameOver();
            setTimeout(() => Index.gameOver(), 2500);
        } else {
            requestAnimationFrame(gameLoop);
        }
    }
    
    const clearCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    async function setPlayerInstrument(instrument) {
        playerIcon.src = `./img/${instrument}.svg`;
        instruments = await SampleLibrary.load({
            instruments: [instrument],
            minify: false
        });
        playerInstrument = instrument; 
        instruments[instrument].toDestination();
    }

    function getPlayer () {
        return player;
    }

    function getPlayerInstrument () {
        return playerInstrument;
    }

    function setPlayerGoal (goal) {
        playerGoal = goal;
    }

    function getPlayerGoal () {
        return playerGoal;
    }

    function getPlayerMode () {
        return playerPlaybackMode;
    }

    function setPlayerMode (mode) {
        playerPlaybackMode = mode;
    }

    return {
        startGame, setPlayerInstrument, getPlayerInstrument, 
        setPlayerGoal, getPlayerGoal, getPlayerMode, setPlayerMode,
        getPlayer
    }
})();