const Game = (() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
     
    const playerIcon = new Image();
    const quarterNoteIcon = new Image();
    const background = new Image();
    background.src = './img/background.png';
    quarterNoteIcon.src = './img/quarter_note.png';
    
    Tone.Master.volume.value = '-6';
    
    let noteSpeed = 1;
    let noteLength = 1.5;
    let nextNoteInterval = 5000;
    
    // player settings
    const MOVEMENT_SPEED = 3;
    const PLAYER_WIDTH = 43;
    const PLAYER_HEIGHT = 70;
    const PLAYER_LIVES = 3;
    let player = {};
    
    // object holding keypresses
    let keyPresses = {};
    
    let instrument;
    let notes = [];
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
            correctNotes: 0,
            avoidedNotes: 0,
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

    /*//////////////
    // Key events //
    //////////////*/

    window.addEventListener('keydown', (event) => {
        keyPresses[event.key] = true;
    }, false);
    
    window.addEventListener('keyup', (event) => {
        keyPresses[event.key] = false;
    }, false);

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

    /* --------------------- */
    
    const startGame = async () => {
        await Tone.Buffer.loaded();
        await Tone.start();
        requestAnimationFrame(gameLoop);
        nextChord(Tone.now());
        intervalId = setInterval(() => nextChord(Tone.now()), nextNoteInterval);
    }

    const gameOver = () => {
        player.score = 0;
        player.lives = 3;
        player.correctNotes = 0;
        player.avoidedNotes = 0;
        nextNoteInterval = 5000;
        noteSpeed = 1;
        notes = [];
    }

    const gameLoop = () => {
        clearCanvas();
        handleUserInput();
        moveNotes();
        checkCollision();
        draw();
        updateScore();
    
        if (player.lives == 0) {
            clearInterval(intervalId);
            Index.gameOver(ctx);
        } else {
            requestAnimationFrame(gameLoop);
        }
    }

    /*////////////
    // updating //
    ////////////*/

    const moveNotes = () => {
        notes.forEach((note, index) => {
            note.position.y += note.speed;
        });
    }

    const moveSprite = (dx) => {
        if (player.position.x + dx > 0 && player.position.x + PLAYER_WIDTH + dx < canvas.width) {
            player.position.x += dx;
        }
    }

    const checkCollision = () => {
        notes.forEach((note, index) => {
            if (note.position.x < player.position.x + player.width  && note.position.x + note.width  > player.position.x &&
                note.position.y < player.position.y + player.height && note.position.y + note.height > player.position.y) {
                // The objects are touching
                notes.splice(index, 1);
                if (note.type == player.goal) { 
                    player.correctNotes++;
                } else { 
                    player.lives--;
                }
            }

            if ((note.position.y + note.height) >= canvas.height) { 
                notes.splice(index, 1); 
                if (note.type == player.goal) { 
                    player.lives--; 
                } else {
                    player.avoidedNotes++;
                }
            }
        });
    }

    const updateScore = () => {
        player.score++;

        if (player.score % 2000 == 0) {
            nextNoteInterval -= 250;
            noteSpeed += .05;
            clearInterval(intervalId);
            intervalId = setInterval(() => nextChord(Tone.now()), nextNoteInterval);
        }
    }

    /* ---------------------------- */

    /*////////////
    // drawing  //
    ////////////*/

    const draw = () => {
        drawBackground();
        drawPlayer();
        drawNotes();
        drawScoreAndLives();
    }

    const clearCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    const drawNotes = () => {
        notes.forEach((note, index) => {
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

    const drawScoreAndLives = () => {
        document.getElementById('score').innerText = player.score;
        document.getElementById('lives').innerText = player.lives;
    }

    /* -------------------------- */
    
    const nextChord = (now) => {
        const intervalOrTriad = Music.constructIntervalOrTriad(player.goal);

        console.log('Chord:', intervalOrTriad.tones, intervalOrTriad.interval);

        if (player.playBackMode == 'harmonic') {
            instrument.triggerAttackRelease(intervalOrTriad.tones, noteLength, now);
        } else {
            intervalOrTriad.tones.forEach((tone, index) => {
                instrument.triggerAttackRelease(tone, noteLength, now);
                now += 0.5;
            });
        }
        
        const note = buildNote(intervalOrTriad);
        notes.unshift(note);
    }

    const buildNote = (intervalOrTriad) => {
        return {
            width: Math.round(quarterNoteIcon.width/30),
            height: Math.round(quarterNoteIcon.height/30),
            position: {
                x: Math.floor(Math.random() * (canvas.width - Math.round(quarterNoteIcon.height/30))),
                y: 0
            },
            speed: noteSpeed,
            type: intervalOrTriad.interval
        }
    }

    const setPlayerInstrument = async (playerInstrument, callback) => {
        playerIcon.src = `./img/${playerInstrument}.svg`;
        player.instrument = playerInstrument;
        instrument = await SampleLibrary.load({
            instruments: playerInstrument,
            minify: true
        });
        instrument.toDestination();
        callback();
    }

    const getPlayer = () => {
        return player;
    }

    return {
        startGame, gameOver, setPlayerInstrument,
        getPlayer, drawScoreAndLives
    }
})();