let display = document.querySelector(".display p");
let buttonsContainer = document.querySelector(".container");
let tempValue = "";
let firstNumber = "";
let secondNumber = "";
let firstOperator = false;
let operator;
let lastValue = "";
let clearAnimationsInterval;

const NUM_KEY_PRESSED_EVENT_NAME = 'numPadKeyPressed';
const allOperations = ['+', '-', '*', '/'];
const allOperators = [...allOperations, '='];
const allValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
const keyCodeMapper = new Map([
  ['Escape', { val: "clear", desc: "clear"}],
  ['0', {val: "0", desc: "zero"}],
  ['1', {val: "1", desc: "one"}],
  ['2', {val: "2", desc: "two"}],
  ['3', {val: "3", desc: "three"}],
  ['4', {val: "4", desc: "four"}],
  ['5', {val: "5", desc: "five"}],
  ['6', {val: "6", desc: "six"}],
  ['7', {val: "7", desc: "seven"}],
  ['8', {val: "8", desc: "eight"}],
  ['9', {val: "9", desc: "nine"}],
  ['+', {val: "+", desc: "add"}],
  ['-', {val: "-", desc: "subtract"}],
  ['*', {val: "*", desc: "multiply"}],
  ['/', {val: "/", desc: "divide"}],
  ['.', {val: ".", desc: "decimal"}],
  ['Enter', {val: "=", desc: "operate"}],

]);

// document.addEventListener("keydown", (e) => {  
//   keyCodeMapper.get(e.key) !== undefined ? activateKey(keyCodeMapper.get(e.key).val) : -1  
// });

// buttonsContainer.addEventListener("click", (e) => {
//   e.target.value != undefined ? updateCalculator(e.target.value) : -1  
// });

// function activateKey(key) {
//   clearInterval(clearAnimationsInterval);    
//   let element = document.querySelector(`button[value="${key}"]`);
//   element.classList.add('active');
//   let elCli = element.getBoundingClientRect();
//   let clickEvent = new MouseEvent('click', {
//     bubbles: true,
//     cancelable: false,
//     clientX: elCli.x,
//     clientY: elCli.y
//   });
//   element.dispatchEvent(clickEvent);
//     clearAnimationsInterval = setTimeout(() => {
//       document.querySelectorAll('button').forEach((element) => {
//         element.classList.remove('active');
//         });
//       }, 50);  
// }

const dispatchNumKeyPressed = (value) => {
  if (value) {
    document.dispatchEvent(new CustomEvent(NUM_KEY_PRESSED_EVENT_NAME, {
      detail: { value }
    }));
  }
};

document.addEventListener(NUM_KEY_PRESSED_EVENT_NAME, (e) => {
  clearInterval(clearAnimationsInterval);  
  const key = e.detail.value;
  const button = document.querySelector(`button[value="${key}"]`); 
  button.classList.add('active');
  clearAnimationsInterval = setTimeout(() => {
    document.querySelectorAll('button').forEach((element) => {
      element.classList.remove('active');
    });
  }, 50);
  updateCalculator(button.value);
});

document.addEventListener("keydown", (e) => {
  const keyCode = keyCodeMapper.get(e.key);

  if (keyCode) {
    dispatchNumKeyPressed(keyCode.val);
  }
});

buttonsContainer.addEventListener("click", (e) => {
  if (e.target.value) {
    dispatchNumKeyPressed(e.target.value);
  }
});

function updateCalculator(value) {  
    //check for reset conditions
    checkForReset(value);
    // check for on display errors  
    checkError(display.textContent);    
    if (checkClear(value)) {      
      return;
    }
    // checks Equal operator special cases    
    if (checkEqualsOperator(value)) {
      return;
    }
    // check for operate command
    if (checkForOperate(value)){
      return;
    }    
    // check decimals
    if(checkDecimal(value)) {
      return;
    };
    // updates display
    if (checkForDisplayUpdates(value)){
      return;
    }    
  }


function operate(first, second, operator) {
  first = formatNumber(first);
  second = formatNumber(second);
  if (operator === "+") {
    return first + second;
  } else if (operator === "-") {
    return first - second;
  } else if (operator === "/") {
    let result = first / second;
    if (!isFinite(result) || isNaN(result)) {
      return "Error";
    } else {
      return first / second;
    }
  } else if (operator === "*") {
    return first * second;
  }
}

function checkForOperate(value){
  if (allOperators.includes(value)) {
    if (firstNumber !== "" && secondNumber !== "" && firstOperator) {
      firstNumber = formatNumber(operate(firstNumber, secondNumber, operator));
      value === "=" ? operator = "" : operator = value;
      display.textContent = `${firstNumber} ${operator}`;
      secondNumber = "";
      return true;
    }
  }
}

function checkClear(value) {
  if (value === "clear") {
    tempValue = "";
    firstNumber = "";
    secondNumber = "";
    firstOperator = false;
    operator = "";
    display.textContent = "0";
    lastValue = "";
    return true;
  }  
}

function checkEqualsOperator(value) {
  if (value === "=" && firstNumber === "") {
    return true;
  } else if (value === "=" && secondNumber === "") {
    return true;
  }

}

function checkDecimal(value) {
  if (value === ".") {
    if (firstNumber === "") {
      if (tempValue === "") {
        tempValue = "0";
      }
      if (tempValue.indexOf(".") >= 0) {
        return true;
      }
    }
    if (secondNumber.indexOf(".") >= 0) {
      return true;
    }
  }
}

function checkForDisplayUpdates(value) {
  if (allOperations.includes(value)) {
    if (tempValue !== "") {
      firstNumber = display.textContent.replace(/[&\/\\#,+\-()$~%'":*?<>{}]/g,"");
      firstOperator = true;
      operator = value;
      display.textContent = `${firstNumber} ${operator}`;
      return true;
    }
    if (firstNumber !== "" && firstOperator && secondNumber === "") {
      operator = value;
      display.textContent = `${firstNumber} ${operator}`;
      return true;
    }
  } else if (firstNumber === "") {
    tempValue = (tempValue + value).replace(/^0+(\d)/, "$1");
    display.textContent = tempValue;
  } else {
    if (value === "." && secondNumber === "") {
      secondNumber = "0";
    }
    secondNumber = (secondNumber + value).replace(/^0+(\d)/, "$1");
    display.textContent = `${firstNumber} ${operator} ${secondNumber}`;
  }
}

function checkForReset(value) {
  if (firstNumber !== "" && firstOperator && operator === "" && allValues.includes(value)) {
    checkClear("clear");    
  }
}

function checkError(value) {
  if (value.trim() === "Error") {
    checkClear("clear");
  }
}

function formatNumber(number) {
  if (isNaN(number)) {
    checkClear("clear");
    return number;
  } else {
    return Math.round(number * 100 + Number.EPSILON) / 100;
  }
}
