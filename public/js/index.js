const Index = (() => {
    const game = document.getElementById('game');
    const tutorial = document.getElementById('tutorial');
    const tutorialBtn = document.getElementById('tutorialBtn');
    const intervals = document.getElementById('intervals');
    const melodicOrHarmonic = document.getElementById('melodicOrHarmonic');
    const backBtns = document.querySelectorAll('.backBtn');
    const instrumentElement = document.getElementById('instrumentChoice');
    const reviewChoices = document.getElementById('reviewChoices');
    const intervalBtns = document.querySelectorAll('.interval');
    const instrumentElementBtns = document.querySelectorAll('.instrument');
    const melodicOrHarmonicBtns = document.querySelectorAll('.melodicOrHarmonic');
    const startBtn = document.getElementById('startGameBtn');
    const gameOverElement = document.getElementById('game-over');
    const playAgainBtn = document.getElementById('play-again');
    const changeOptionsBtn = document.getElementById('change-options');
    const submitScoreForm = document.getElementById('submitScoreForm');
    const submitMessage = document.getElementById('submitMessage');
    const highscoreBtn = document.getElementById('highscoreBtn');
    const highscoreDiv = document.getElementById('highscoreDiv');
    const highscoreMenu = document.getElementById('highscoreMenu');

    const intervalAbbreviationSchema = {
        M: 'Major chord',
        m: 'Minor chord',
        m2: 'Minor 2nd',
        M2: 'Major 2nd',
        m3: 'Minor 3rd',
        M3: 'Major 3rd',
        P4: 'Perfect 4th',
        P5: 'Perfect 5th',
        m6: 'Minor 6th',
        M6: 'Major 6th',
        m7: 'Minor 7th',
        M7: 'Major 7th'
    }
    
    function startGame () {
        reviewChoices.classList.remove('active');
        document.getElementById('game').style.display = 'block';
        Game.startGame();
    }

    function gameOver (ctx) {
        ctx.fillStyle = 'black';
        ctx.font = '50px Libre Baskerville';
        ctx.fillText('Game Over', canvas.width/2 - 145, 125);

        setTimeout(() => {
            game.style.display = 'none';
            document.getElementById('game-over-score').innerText = Game.getPlayer().score;
            document.getElementById('correctNotes').innerText = Game.getPlayer().correctNotes;
            document.getElementById('avoidedNotes').innerText = Game.getPlayer().avoidedNotes;
            gameOverElement.classList.add('active');
        }, 2500);
    }

    function restartGame () {
        gameOverElement.classList.remove('active');
        document.getElementById('game').style.display = 'block';
        startGame();
    }
    
    function displayTutorial() {
        tutorialBtn.style.display = 'none';
        highscoreBtn.style.display = 'none';
        intervals.classList.remove('active');
        tutorial.classList.add('active');
    }
    
    function goBack(target) {
        const menu = target.dataset.menu;
        if (menu == 'tutorial') {
            tutorial.classList.remove('active');
            intervals.classList.add('active');
            tutorialBtn.style.display = 'block';
            highscoreBtn.style.display = 'block';
        } else if (menu == 'melodicOrHarmonic') {
            melodicOrHarmonic.classList.remove('active');
            intervals.classList.add('active');
            tutorialBtn.style.display = 'block';
            highscoreBtn.style.display = 'block';
        } else if (menu == 'instrument') {
            instrumentElement.classList.remove('active');
            melodicOrHarmonic.classList.add('active');
        } else if (menu == 'review') {
            reviewChoices.classList.remove('active');
            instrumentElement.classList.add('active');
        } else if (menu == 'highscore') {
            highscoreMenu.style.display = 'none';
            intervals.classList.add('active');
            tutorialBtn.style.display = 'block';
            highscoreBtn.style.display = 'block';
        }
    }
    
    function setPlayerGoal(target) {
        const chosenInterval = target.dataset.interval;
        document.getElementById('display-interval').innerText = intervalAbbreviationSchema[chosenInterval];
        Game.getPlayer().goal = chosenInterval;
    }
    
    function displayInstrumentsMenu() {
        melodicOrHarmonic.classList.remove('active');
        instrumentElement.classList.add('active');
    }
    
    function displayChoicesMenu() {
        document.getElementById('intervalChoice').innerText = intervalAbbreviationSchema[Game.getPlayer().goal];
        document.getElementById('intervalModeChoice').innerText = Game.getPlayer().playBackMode;
        instrumentElement.classList.remove('active');
        reviewChoices.classList.add('active');
    }
    
    function displayMelodicOrHarmonicMenu() {
        tutorialBtn.style.display = 'none';
        highscoreBtn.style.display = 'none';
        intervals.classList.remove('active');
        melodicOrHarmonic.classList.add('active');
    }
    
    function setMelodicOrHarmonic(target) {
        const mode = target.dataset.melodicorharmonic;
        Game.getPlayer().playBackMode = mode;
    }

    function displayHighscores(highscores) {
        Object.values(highscores).forEach((key, index) => {
            const { id, player, score, goal, collected, avoided, date } = key;
            if (!$('#' + id).length) {
                $(highscoreDiv).append(
                    `<div id=${id} class="score">
                        ${index+1}. ${player}<br>
                        ${score} points<br>
                        ${intervalAbbreviationSchema[goal]}<br>
                        ${date.split('T')[0]}
                    </div>`
                );
            }
        });
        intervals.classList.remove('active');
        tutorialBtn.style.display = 'none';
        highscoreBtn.style.display = 'none';
        highscoreMenu.style.display = 'block';
    }
    
    async function setInstrument(target) {
        const instrument = target.dataset.instrument;
        document.getElementById('instrument').innerText = instrument;
        await Game.setPlayerInstrument(instrument, displayChoicesMenu);
    }
    
    tutorialBtn.onclick = displayTutorial;
    
    backBtns.forEach(btn => {
        btn.addEventListener('click', ({target}) => goBack(target));
    });
    
    intervalBtns.forEach(btn => { 
        btn.addEventListener('click', ({target}) => {
            setPlayerGoal(target);
            displayMelodicOrHarmonicMenu();
        });
    });
    
    melodicOrHarmonicBtns.forEach(btn => {
        btn.addEventListener('click', ({target}) => {
            setMelodicOrHarmonic(target);
            displayInstrumentsMenu();
        });
    });
    
    instrumentElementBtns.forEach(btn => {
        btn.style.backgroundImage = `url('./img/${btn.dataset.instrument}.svg')`;
        btn.addEventListener('click', async ({target}) => {
            await setInstrument(target);
        });
    });
    
    startBtn.addEventListener('click', async() => {
        startGame();
    });

    playAgainBtn.onclick = restartGame;

    changeOptionsBtn.onclick = () => {
        gameOverElement.classList.remove('active');
        intervals.classList.add('active');
        tutorialBtn.style.display = 'block';
    }

    highscoreBtn.onclick = async () => {
        const highscores = await Game.getHighScores();
        displayHighscores(highscores);
    }

    submitScoreForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        submitScoreForm.style.display = 'none';
        const playerName = document.getElementById('player').value;
        const response = await Game.submitScore(playerName);
        if (response == 200) { 
            submitMessage.innerText = 'Result submitted';
            submitMessage.style.display = 'block';
        }
    });

    return {
        gameOver
    }
})();