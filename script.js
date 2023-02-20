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
  //console.log(value);
  if (value == "clear") {
    tempValue = "";
    firstNumber = "";
    secondNumber = "";
    firstOperator = false;
    operator = "";
    display.textContent = "0";
    return;
  }
  if (value == "+" || value == "-" || value == "/" || value == "*" || value == "="){
    if(firstNumber != "" && secondNumber != "" && firstOperator) {
      firstNumber = calculateNow(parseInt(firstNumber), parseInt(secondNumber), operator);
      //firstOperator = false;
      display.textContent = `${firstNumber} ${operator}`;
      secondNumber = "";
      return;
    };
  };
  if (value == "+" || value == "-" || value == "/" || value == "*"){
    if(tempValue != "" ) {
      firstNumber = parseInt(display.textContent);
      firstOperator = true;
      operator = value;
      display.textContent = `${firstNumber} ${operator}`;
      return;
    };
    if(firstNumber != "" && firstOperator && secondNumber == "") {
      operator = value;
      display.textContent = `${firstNumber} ${operator}`;
      return;
    }
  } else if (firstNumber == "") {
    tempValue = parseInt(tempValue + value);
    display.textContent = tempValue;
  } else {
    secondNumber = parseInt(secondNumber + value);
    display.textContent = `${firstNumber} ${operator} ${secondNumber}`;
  }  
}

function calculateNow(first, second, operator) {
  if(operator == "+") {
    return first + second;
  }
  if(operator == "-") {
    return first - second;
  }
  if(operator == "/") {
    return first / second;
  }
  if(operator == "*") {
    return first * second;
  }
}

