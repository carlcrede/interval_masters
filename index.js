const tutorial = document.getElementById('tutorial');
const tutorialBtn = document.getElementById('tutorialBtn');
const intervals = document.getElementById('intervals');
const backBtns = document.querySelectorAll('.backBtn');
const options = document.getElementById('options');
const intervalBtns = document.querySelectorAll('.interval');
const instrumentBtns = document.querySelectorAll('.instrument');

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
    } else if (menu == 'options') {
        options.classList.remove('active');
        intervals.classList.add('active');
        tutorialBtn.style.display = 'block';
    }
}

function setPlayerInterval(target) {
    const chosenInterval = target.dataset.interval;
    playerGoal = chosenInterval;
}

function displayOptionsMenu() {
    tutorialBtn.style.display = 'none';
    intervals.classList.remove('active');
    options.classList.add('active');
}

function setInstrument(target) {
    const instrument = target.dataset.instrument;
    console.log(instrument);
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
        displayOptionsMenu();
    });
});

instrumentBtns.forEach(btn => {
    btn.style.background = `gold url('./img/${btn.dataset.instrument}.svg') no-repeat`;
    btn.addEventListener('click', ({target}) => {
        setInstrument(target);
        
    });
});

