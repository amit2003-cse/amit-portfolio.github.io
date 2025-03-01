const display = document.querySelector('.display');
const buttons = document.querySelectorAll('button');
let currentValue = '0';
let shouldResetDisplay = false;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (value === 'AC') {
            currentValue = '0';
            shouldResetDisplay = false;
        } else if (value === 'Del') {
            currentValue = currentValue.slice(0, -1) || '0';
        } else if (value === '=') {
            try {
                currentValue = eval(currentValue.replace('×', '*').replace('÷', '/')).toString();
                shouldResetDisplay = true;
            } catch (error) {
                currentValue = 'Error';
            }
        } else {
            if (shouldResetDisplay) {
                currentValue = '0';
                shouldResetDisplay = false;
            }
            if (currentValue === '0' && value !== '.') {
                currentValue = value;
            } else {
                currentValue += value;
            }
        }

        if (currentValue === '') currentValue = '0';
        display.textContent = currentValue;
    });
});
