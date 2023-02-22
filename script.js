let display = document.querySelector(".display p");
let buttons = document.querySelectorAll("button");
let tempValue = "";
let firstNumber = "";
let secondNumber = "";
let firstOperator = false;
let operator;

buttons.forEach(button => {
  button.addEventListener("click", () => {    
    updateCalculator(button.value);
  });
})

function updateCalculator(value) {
  checkError(display.textContent);  
  if (value == "clear") {
    clear();
    return;
  }
  if (value == "=" && firstNumber === ""){
    return;
  }
  if (value == "+" || value == "-" || value == "/" || value == "*" || value == "="){
    if(firstNumber !== "" && secondNumber !== "" && firstOperator) {
      firstNumber = formatNumber(operate(firstNumber, secondNumber, operator));
      //firstNumber = formatNumber(firstNumber);
      display.textContent = `${firstNumber} ${operator}`;
      secondNumber = "";
      return;
    };
  };
  if (value == "=" && secondNumber === "") {
    return;
  }
  if (value == "+" || value == "-" || value == "/" || value == "*"){
    if(tempValue !== "" ) {
      firstNumber = formatNumber(display.textContent.replace(/[&\/\\#,+\-()$~%'":*?<>{}]/g, ''));
      //firstNumber = formatNumber(firstNumber);
      firstOperator = true;
      operator = value;
      display.textContent = `${firstNumber} ${operator}`;
      return;
    };
    if(firstNumber !== "" && firstOperator && secondNumber === "") {
      operator = value;
      display.textContent = `${firstNumber} ${operator}`;
      return;
    }
  } else if (firstNumber === "") {
    tempValue = formatNumber(tempValue + value);
    display.textContent = tempValue;
  } else {
    secondNumber = formatNumber(secondNumber + value);
    display.textContent = `${firstNumber} ${operator} ${secondNumber}`;
  }  
}

function operate(first, second, operator) {
  if(operator == "+") {
    return first + second;
  }
  if(operator == "-") {
    return first - second;
  }
  if(operator == "/") {
    let result = first / second;
    if (!isFinite(result) || isNaN(result)){
      return "Error";
    } else {
      return first / second;
    }
    
  }
  if(operator == "*") {
    return first * second;
  }
}

function clear() {
  tempValue = "";
  firstNumber = "";
  secondNumber = "";
  firstOperator = false;
  operator = "";
  display.textContent = "0";
}

function checkError(value) {
  if (value.trim() == "Error") {
    clear();
  };
}

function formatNumber(number) {
  if (isNaN(number)) {
    clear();
    return number;
  } else {
    return Math.round(number * 100) / 100
  };
}

