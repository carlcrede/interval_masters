const Game = (() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
     
    const playerIcon = new Image();
    const quarterNoteIcon = new Image();
    const background = new Image();
    background.src = './img/background.png';
    quarterNoteIcon.src = './img/quarter_note.png';

    const sounds = {
        correct: new Howl({
            src: ['./sound/coin.wav'],
            volume: 0.4
        }),
        wrong: new Howl({
            src: ['./sound/wrong.mp3'],
            volume: 0.4
        })
    };
    
    Tone.Master.volume.value = '-6';
    
    let noteSpeed = 1;
    let noteLength = 1.5;
    let nextNoteInterval = 5000;
    let levelUp = false;
    
    // player settings
    const MOVEMENT_SPEED = 3;
    const PLAYER_WIDTH = 43;
    const PLAYER_HEIGHT = 70;
    const PLAYER_LIVES = 1;
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
    
    
    /*////////////////////////////////
    // Event listeners / Key events //
    ////////////////////////////////*/
    
    window.onload = init;
    
    window.onresize = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

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
    }

    /* --------------------- */
    
    const startGame = async () => {
        resetGame();
        await Tone.Buffer.loaded();
        await Tone.start();

        drawBackground();
        drawText('Get ready!');
        drawPlayer();

        setTimeout(() => {
            requestAnimationFrame(gameLoop);
            nextChord(Tone.now());
            intervalId = setInterval(() => nextChord(Tone.now()), nextNoteInterval);
        }, 3000);
    }

    const resetGame = () => {
        player.score = 0;
        player.lives = PLAYER_LIVES;
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
        // make sure player cant move out of canvas
        if (player.position.x + dx > 0 && player.position.x + PLAYER_WIDTH + dx < canvas.width) {
            player.position.x += dx;
        }
    }

    const checkCollision = () => {
        notes.forEach((note, index) => {
            // check if player and note collides
            if (note.position.x < player.position.x + player.width && note.position.x + note.width > player.position.x &&
                note.position.y < player.position.y + player.height && note.position.y + note.height > player.position.y) {
                // The objects are touching
                notes.splice(index, 1);

                if (note.type == player.goal) { 
                    player.correctNotes++;
                    sounds.correct.play();
                } else { 
                    player.lives--;
                    sounds.wrong.play();
                }
            }
            // check if note collides with ground
            if ((note.position.y + note.height) >= canvas.height) { 
                notes.splice(index, 1); 
                if (note.type == player.goal) { 
                    player.lives--;
                    sounds.wrong.play();
                } else {
                    player.avoidedNotes++;
                    sounds.correct.play();
                }
            }
        });
    }

    const updateScore = () => {
        player.score++;

        // every 2000 points increase difficulty
        if (player.score % 2000 == 0) {
            levelUp = true;
            setTimeout(() => levelUp = false, 2000);

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
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'green';
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    }

    const drawText = (text) => {
        ctx.fillStyle = 'black';
        ctx.font = '50px Libre Baskerville';
        ctx.fillText(text, canvas.width/2 - 130, 125, canvas.width);
    }

    const drawScoreAndLives = () => {
        document.getElementById('score').innerText = player.score;
        document.getElementById('lives').innerText = player.lives;
        document.getElementById('display-collected').innerText = player.correctNotes;
        document.getElementById('display-avoided').innerText = player.avoidedNotes;

        if (levelUp) {
            drawText('LEVEL UP');
        }
    }

    /* -------------------------- */

    /*////////////
    //    DB    //
    ////////////*/

    const submitScore = async (playerName) => {
        player.name = playerName;
        const data = player;
        const response = await fetch('/scores', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        return response.status;
    }

    const getHighScores = async () => {
        const response = await fetch('/scores');
        const data = await response.json();
        return data;
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
        startGame, resetGame, setPlayerInstrument,
        getPlayer, drawScoreAndLives, submitScore, getHighScores
    }
})();