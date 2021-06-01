const tutorial = document.getElementById('tutorial');
const nextBtn = document.getElementById('nextBtn');
const intervals = document.getElementById('intervals');

function next() {
    tutorial.style.display = 'none';
    intervals.style.display = 'block';
}

nextBtn.onclick = next;

