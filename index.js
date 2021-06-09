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

function displayTutorial() {
    tutorialBtn.style.display = 'none';
    intervals.classList.remove('active');
    tutorial.classList.add('active');
}

function goBack(target) {
    const menu = target.dataset.menu;
    if (menu == 'tutorial') {
        tutorial.classList.remove('active');
        intervals.classList.add('active');
        tutorialBtn.style.display = 'block';
    } else if (menu == 'melodicOrHarmonic') {
        melodicOrHarmonic.classList.remove('active');
        intervals.classList.add('active');
        tutorialBtn.style.display = 'block';
    } else if (menu == 'instrument') {
        instrumentElement.classList.remove('active');
        melodicOrHarmonic.classList.add('active');
    }
}

function setPlayerInterval(target) {
    const chosenInterval = target.dataset.interval;
    playerGoal = chosenInterval;
}

function displayInstrumentsMenu() {
    melodicOrHarmonic.classList.remove('active');
    instrumentElement.classList.add('active');
}

function displayChoicesMenu() {
    console.log('You have chosen to practice:', intervalAbbreviationSchema[playerGoal]);
    console.log('Melodic or harmonic mode:', playerPlaybackMode);
    console.log('Instrument:', playerInstrument);
    document.getElementById('intervalChoice').innerText = intervalAbbreviationSchema[playerGoal];
    document.getElementById('intervalModeChoice').innerText = playerPlaybackMode;
    document.getElementById('instrument').innerText = playerInstrument;
    instrumentElement.classList.remove('active');
    reviewChoices.classList.add('active');
}

function displayMelodicOrHarmonicMenu() {
    tutorialBtn.style.display = 'none';
    intervals.classList.remove('active');
    melodicOrHarmonic.classList.add('active');
}

function setMelodicOrHarmonic(target) {
    const choice = target.dataset.melodicorharmonic;
    playerPlaybackMode = choice;
}

function setInstrument(target) {
    const instrument = target.dataset.instrument;
    setPlayerInstrument(instrument);
}

tutorialBtn.onclick = displayTutorial;
backBtns.onclick = goBack;

backBtns.forEach(btn => {
    btn.addEventListener('click', ({target}) => goBack(target));
});

intervalBtns.forEach(btn => { 
    btn.addEventListener('click', ({target}) => {
        setPlayerInterval(target);
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
    btn.addEventListener('click', ({target}) => {
        setInstrument(target);
        displayChoicesMenu();
    });
});

