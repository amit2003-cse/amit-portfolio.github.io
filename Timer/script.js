let timer;
let timeLeft;
let isRunning = false;
let isStopwatch = false; // Mode Toggle

const display = document.getElementById('display');
const startStopButton = document.getElementById('start-stop');
const resetButton = document.getElementById('reset');
const presetButtons = document.querySelectorAll('.preset');
const manualInput = document.getElementById('minutes');
const manualSetButton = document.getElementById('set-manual');
const alarm = document.getElementById('alarm');
const switchModeButton = document.getElementById('switch-mode');

function updateDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    
    display.textContent = formattedTime;
    document.title = formattedTime + (isStopwatch ? " ⏱️ Stopwatch" : " ⏳ Timer"); // Show on Tab
}

function startTimer(duration) {
    timeLeft = duration;
    isRunning = true;
    startStopButton.textContent = 'Stop';
    display.classList.add('running');

    timer = setInterval(() => {
        if (!isStopwatch) {
            timeLeft--;
        } else {
            timeLeft++;
        }

        updateDisplay(timeLeft);

        if (!isStopwatch && timeLeft <= 0) {
            clearInterval(timer);
            isRunning = false;
            alarm.play();
            display.classList.remove('running');
            startStopButton.textContent = 'Start';
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    isRunning = false;
    startStopButton.textContent = 'Start';
    display.classList.remove('running');
}

startStopButton.addEventListener('click', () => {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer(timeLeft);
    }
});

resetButton.addEventListener('click', () => {
    stopTimer();
    timeLeft = isStopwatch ? 0 : 25 * 60;
    updateDisplay(timeLeft);
});

presetButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (isStopwatch) return; // Ignore if in stopwatch mode
        const minutes = parseInt(button.dataset.minutes);
        timeLeft = minutes * 60;
        updateDisplay(timeLeft);
        stopTimer();
    });
});

manualSetButton.addEventListener('click', () => {
    if (isStopwatch) return; // Ignore if in stopwatch mode
    const minutes = parseInt(manualInput.value);
    if (minutes > 0) {
        timeLeft = minutes * 60;
        updateDisplay(timeLeft);
        stopTimer();
        manualInput.value = '';
    } else {
        alert('Please enter a valid number of minutes');
    }
});

switchModeButton.addEventListener('click', () => {
    stopTimer();
    isStopwatch = !isStopwatch;
    timeLeft = isStopwatch ? 0 : 25 * 60;
    updateDisplay(timeLeft);
    switchModeButton.textContent = isStopwatch ? "Switch to Timer" : "Switch to Stopwatch";
});

// Initialize with 25 minutes countdown
timeLeft = 25 * 60;
updateDisplay(timeLeft);
