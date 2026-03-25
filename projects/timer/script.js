document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const display = document.getElementById('display');
    const startStopBtn = document.getElementById('start-stop');
    const resetBtn = document.getElementById('reset');
    const playIcon = document.getElementById('play-icon');
    const startText = document.getElementById('start-text');
    const switchModeBtn = document.getElementById('switch-mode');
    const timerControls = document.getElementById('timer-controls');
    const appTitle = document.getElementById('app-title');
    const displayWrapper = document.getElementById('display-wrapper');
    const alarmSound = document.getElementById('alarm');
    const presets = document.querySelectorAll('.preset');
    const manualInput = document.getElementById('minutes');
    const setManualBtn = document.getElementById('set-manual');

    // State
    let isTimerMode = true;
    let isRunning = false;
    let interval;
    let timeRemaining = 25 * 60; // default 25 mins
    let stopwatchTime = 0;
    let initialTimerValue = 25 * 60;

    // Formatting Time
    function formatTime(seconds) {
        let mins = Math.floor(Math.abs(seconds) / 60);
        let secs = Math.abs(seconds) % 60;
        
        let formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        // Handle hours if over 60 mins
        if (mins >= 60) {
            let hrs = Math.floor(mins / 60);
            mins = mins % 60;
            formatted = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        
        return formatted;
    }

    function updateDisplay(time) {
        display.textContent = formatTime(time);
    }

    // Controls
    function toggleTimer() {
        if (isRunning) {
            clearInterval(interval);
            isRunning = false;
            displayWrapper.classList.remove('running');
            playIcon.className = 'fas fa-play';
            startText.textContent = 'Resume';
            startStopBtn.classList.remove('running');
        } else {
            isRunning = true;
            displayWrapper.classList.remove('ended');
            displayWrapper.classList.add('running');
            playIcon.className = 'fas fa-pause';
            startText.textContent = 'Pause';
            startStopBtn.classList.add('running');

            interval = setInterval(() => {
                if (isTimerMode) {
                    timeRemaining--;
                    updateDisplay(timeRemaining);
                    if (timeRemaining <= 0) {
                        timerEnded();
                    }
                } else {
                    stopwatchTime++;
                    updateDisplay(stopwatchTime);
                }
            }, 1000);
        }
    }

    function timerEnded() {
        clearInterval(interval);
        isRunning = false;
        updateDisplay(0);
        displayWrapper.classList.remove('running');
        displayWrapper.classList.add('ended');
        playIcon.className = 'fas fa-undo';
        startText.textContent = 'Restart';
        startStopBtn.classList.remove('running');
        
        // Play sound
        alarmSound.currentTime = 0;
        alarmSound.play().catch(e => console.log('Audio play failed: ', e));
    }

    function resetTimer() {
        clearInterval(interval);
        isRunning = false;
        displayWrapper.classList.remove('running');
        displayWrapper.classList.remove('ended');
        playIcon.className = 'fas fa-play';
        startText.textContent = 'Start';
        startStopBtn.classList.remove('running');
        
        alarmSound.pause();
        alarmSound.currentTime = 0;

        if (isTimerMode) {
            timeRemaining = initialTimerValue;
            updateDisplay(timeRemaining);
        } else {
            stopwatchTime = 0;
            updateDisplay(stopwatchTime);
        }
    }

    function switchMode() {
        resetTimer();
        isTimerMode = !isTimerMode;
        
        if (isTimerMode) {
            appTitle.textContent = 'Countdown Timer';
            timerControls.classList.remove('hidden');
            displayWrapper.classList.remove('stopwatch-mode');
            updateDisplay(timeRemaining);
        } else {
            appTitle.textContent = 'Stopwatch';
            timerControls.classList.add('hidden');
            displayWrapper.classList.add('stopwatch-mode');
            updateDisplay(stopwatchTime);
        }
    }

    // Set Presets
    presets.forEach(btn => {
        btn.addEventListener('click', (e) => {
            presets.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            let mins = parseInt(btn.getAttribute('data-minutes'));
            initialTimerValue = mins * 60;
            resetTimer();
            manualInput.value = '';
        });
    });

    // Manual Input
    setManualBtn.addEventListener('click', () => {
        let val = parseInt(manualInput.value);
        if (val && val > 0) {
            presets.forEach(p => p.classList.remove('active'));
            initialTimerValue = val * 60;
            resetTimer();
        }
    });

    // Events
    startStopBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);
    switchModeBtn.addEventListener('click', switchMode);

    // Initial Display
    updateDisplay(timeRemaining);
});
