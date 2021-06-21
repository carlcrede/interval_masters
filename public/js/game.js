const Game = (() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
     
    const playerIcon = new Image();
    const quarterNoteIcon = new Image();
    const background = new Image();
    background.src = './img/background.png';
    quarterNoteIcon.src = './img/quarter_note.png';
    
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
    
    let instrument;
    let chords = [];
    let intervalId;
    
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
            score: 0,
            goal: '',
            instrument: '',
            playBackMode: ''
        };
    }
    
    window.onload = init;
    
    window.onresize = () => {
        canvas.width = window.innerWidth * 0.4;
        canvas.height = canvas.width * 0.6;
    }
    
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
    }

    const updateScoreAndLives = () => {
        document.getElementById('score').innerText = player.score;
        document.getElementById('lives').innerText = player.lives;
    }
    
    const nextChord = (now) => {
        const randomChord = Music.constructIntervalOrTriad(player.goal);
        console.log('Chord:', randomChord.tones, randomChord.interval);
        if (player.playBackMode == 'harmonic') {
            instrument.triggerAttackRelease(randomChord.tones, noteLength, now);
        } else {
            randomChord.tones.forEach((tone, index) => {
                instrument.triggerAttackRelease(tone, noteLength, now);
                now += 0.5;
            });
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
        updateScoreAndLives();
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
                if (note.type == player.goal) { 
                    player.score++;
                } else { 
                    player.lives--;
                }
            }

            if ((note.position.y + note.height) >= canvas.height) { 
                chords.splice(index, 1); 
                if (note.type == player.goal) { 
                    player.lives--; 
                } else {
                    player.score++;
                }
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
            Index.gameOver(ctx);
        } else {
            requestAnimationFrame(gameLoop);
        }
    }
    
    const clearCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    async function setPlayerInstrument(playerInstrument, callback) {
        playerIcon.src = `./img/${playerInstrument}.svg`;
        player.instrument = playerInstrument;
        instrument = await SampleLibrary.load({
            instruments: playerInstrument,
            minify: true
        });
        Tone.Buffer.loaded().then(callback());
        instrument.toDestination();
    }

    function getPlayer () {
        return player;
    }

    return {
        startGame, gameOver, setPlayerInstrument,
        getPlayer, updateScoreAndLives
    }
})();