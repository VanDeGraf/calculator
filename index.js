const maxLength = 12;

const status = {
    leftOperand: null,
    operator: null,
    wait: 'operator',
    input: true,
}

const screen = document.querySelector('#screen');

function round(operationResult) {
    const len = maxLength - (parseInt(operationResult) + "").length - 1;
    return Math.round(operationResult * Math.pow(10, len)) / Math.pow(10, len);
}

function operate(operator, a, b) {
    switch (operator) {
        case 'add':
            return a + b;
            break;
        case 'subtract':
            return round(a - b);
            break;
        case 'multiply':
            return a * b;
            break;
        case 'divide':
            return round(a / b);
            break;
    }
}

function addOnScreen(value) {
    if (value == '-' && screen.innerText !== "0") {
        if (screen.innerText.indexOf('-') == -1) {
            screen.innerText = '-' + screen.innerText;
        } else {
            screen.innerText = screen.innerText.substr(1);
        }
    } else if (value == '.' && screen.innerText.indexOf('.') == -1) {
        if (screen.innerText.length - (screen.innerText.indexOf('-') == -1 ? 0 : 1) + 2
            <= maxLength) {
            screen.innerText += '.';
        }
    } else {
        if (screen.innerText === "0") {
            if (value !== "0") {
                screen.innerText = value;
            }
        } else if (screen.innerText.length - (screen.innerText.indexOf('-') == -1 ? 0 : 1) + 1
            <= maxLength) {
            screen.innerText += value;
        }
    }
}

function checkResultException(result) {
    if (result == Infinity || !result) {
        reset(false, "Really?");
        return false;
    } else {
        return true;
    }
}

function reset(input = true, screenText = "0") {
    screen.innerText = screenText;
    status.wait = 'operator';
    status.leftOperand = null;
    status.operator = null;
    status.input = input;
}

function userPressButton(event) {

    if (event.target.classList.contains('btn-number')) {
        if (!status.input) {
            if (screen.innerText !== "Really?") status.leftOperand = parseFloat(screen.innerText);
            screen.innerText = "0";
            status.input = true;
        }
        addOnScreen(event.target.value);
    } else if (event.target.value == "clear") {
        let len = screen.innerText.length;
        if (screen.innerText.indexOf('-') != -1) len--;
        if (len < 2) {
            screen.innerText = "0";
        } else {
            screen.innerText = screen.innerText.substr(0, screen.innerText.length - 1);
        }
    } else if (event.target.value == "negative" && status.input) {
        addOnScreen('-');
    } else if (["add", "subtract", "multiply", "divide"].includes(event.target.value)) {
        if (status.wait === 'operator') {
            status.operator = event.target.value;
            status.input = false;
            status.wait = 'calculate';
        } else if (status.wait === 'calculate') {
            status.leftOperand = operate(status.operator, status.leftOperand,
                parseFloat(screen.innerText));
            if (checkResultException(status.leftOperand)) {
                status.input = false;
                status.operator = event.target.value;
                screen.innerText = status.leftOperand;
            }
        }
    } else if (event.target.value == "calculate" && status.wait === 'calculate') {
        status.leftOperand = operate(status.operator, status.leftOperand,
            parseFloat(screen.innerText));
        if (checkResultException(status.leftOperand)) {
            reset(false, status.leftOperand);
        }
    } else if (event.target.value == "reset") {
        reset();
    } else if (event.target.value == "float" && status.input) {
        addOnScreen('.');
    }
}


document.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', userPressButton);
});
document.addEventListener('keydown', (e) => {
    const btn = document.querySelector(`button[data-key="${e.keyCode}"]`)
    if (btn) btn.click();
});