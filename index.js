const maxLength = 12;

function round(operationResult) {
    const len = maxLength - (parseInt(operationResult) + "").length - 1;
    return Math.round(operationResult * Math.pow(10, len)) / Math.pow(10, len);
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return round(a - b);
}

function multiply(a, b) {
    return a * b;
}


function divide(a, b) {
    return round(a / b);
}

function operate(operator, a, b) {
    switch (operator) {
        case 'add':
            return add(a, b);
            break;
        case 'subtract':
            return subtract(a, b);
            break;
        case 'multiply':
            return multiply(a, b);
            break;
        case 'divide':
            return divide(a, b);
            break;

        default:
            console.warn('Wrong operator:' + operator);
            break;
    }
}



const status = {
    leftOperand: null,
    operator: null,
    wait: 'operator',
    input: true,
}
document.querySelectorAll('button').forEach((btn) =>
    btn.addEventListener('click', userPressButton));

const screen = document.querySelector('#screen');


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
    } else if (event.target.value === "add" ||
        event.target.value === "subtract" ||
        event.target.value === "multiply" ||
        event.target.value === "divide") {
        if (status.wait === 'operator') {
            status.operator = event.target.value;
            status.input = false;
            status.wait = 'calculate';
        } else if (status.wait === 'calculate') {
            status.leftOperand = operate(status.operator, status.leftOperand,
                parseFloat(screen.innerText));
            status.input = false;
            if (!status.leftOperand == Infinity || !status.leftOperand) {
                status.operator = null;
                status.wait = 'operator';
                screen.innerText = "Really?";
            } else {
                status.operator = event.target.value;
                screen.innerText = status.leftOperand;
            }
        }
    } else if (event.target.value == "calculate") {
        if (status.wait === 'calculate') {
            status.leftOperand = operate(status.operator, status.leftOperand,
                parseFloat(screen.innerText));
            status.input = false;
            status.operator = null;
            status.wait = 'operator';
            if (status.leftOperand == Infinity || !status.leftOperand) {
                screen.innerText = "Really?";
            } else {
                screen.innerText = status.leftOperand;
            }
        }
    } else if (event.target.value == "reset") {
        screen.innerText = "0";
        status.wait = 'operator';
        status.leftOperand = null;
        status.operator = null;
        status.input = true;
    } else if (event.target.value == "float" && status.input) {
        addOnScreen('.');
    }
}

/*
TODO:
1)min/max input
2)key binds
*/