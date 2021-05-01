function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
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


function userPressButton(event) {

    if (event.target.classList.contains('btn-number')) {
        if (!status.input) {
            status.leftOperand = parseInt(screen.innerText);
            screen.innerText = "0";
        }
        if (screen.innerText === "0") {
            screen.innerText = event.target.value;
        } else if (event.target.value !== "0" || screen.innerText !== "0") {
            screen.innerText += event.target.value;
        }
    } else if (event.target.value == "clear") {
        let len = screen.innerText.length;
        if (screen.innerText.indexOf('-') != -1) len--;
        if (len < 2) {
            screen.innerText = "0";
        } else {
            screen.innerText = screen.innerText.substr(0, screen.innerText.length - 1);
        }
    } else if (event.target.value == "negative") {
        if (screen.innerText !== "0") {
            if (screen.innerText.indexOf('-') == -1) {
                screen.innerText = '-' + screen.innerText;
            } else {
                screen.innerText = screen.innerText.substr(1);
            }
        }
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
                parseInt(screen.innerText));
            status.operator = event.target.value;
            screen.innerText = status.leftOperand;
            status.input = false;
        }
    } else if (event.target.value == "calculate") {
        if (status.wait === 'calculate') {
            status.leftOperand = operate(status.operator, status.leftOperand,
                parseInt(screen.innerText));
            status.operator = null;
            screen.innerText = status.leftOperand;
            status.input = false;
            status.wait = 'operator';
        }
    } else if (event.target.value == "reset") {
        screen.innerText = "0";
        status.wait = 'operator';
        status.leftOperand = null;
        status.operator = null;
        status.input = true;
    }
}

/*
TODO:
1)Division by zero
2)float numbers
3)round calculated result, min/max input
*/