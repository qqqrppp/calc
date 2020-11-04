/**
 * @param {string} x
 * @returns {boolean}
 */
const isNumber = (x) => !!~x.search(/^\-?(?:0|[1-9]\d*)(?:\.\d+)?$/);
const isOperator = (x) => !!~x.search(/^[\*\+\-\/\^]$/);

/**
 * @param list Array
 */
const top = (list) => list[list.length - 1];

/**
 * Stream reading a string for extracting operators and numbers
 * @param {string} str
 *
 * @returns {Generator<string>}
 */
export function* tokenizer(str) {
  let number = "";
  let operator = "";

  for (const val of str) {
    if (isNumber(val)) {
      number += val;
      operator = "";
    } else if (val == ".") {
      number += val;
    } else if (val == "-" && operator == "(") {
      number += "-";
    } else if (isOperator(val) || val == "(" || val == ")") {
      if (number) {
        yield number;
        number = "";
      }

      operator = val;
      yield val;
    }
  }

  if (number) {
    yield number;
  }

  return;
}

/**
 * The definition of operator precedence
 * @param {string} operator 
 *
 * @returns {number} priority
 */
function precedence(operator) {
  switch (operator) {
    case "+":
      return 1;
    case "-":
      return 1;
    case "*":
      return 2;
    case "/":
      return 2;
    case "^":
      return 3;
  }
}

/**
 * Operation on numbers
 * 
 * @param {number} arg1 - first argument
 * @param {number} arg2 - last argument
 * @param {string} operator 
 *
 * @return {number}
 */
function singleCalc(arg1, arg2, operator) {
  const a = Number(arg1);
  const b = Number(arg2);

  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return a / b;
    case "^":
      return a ** b;
  }
}

/**
 * To calculate the response from the token
 * The similarity https://en.wikipedia.org/wiki/Shunting-yard_algorithm
 * @param {string[]} tokens
 *
 * @returns {number}
 */
export function evaluate(tokens) {
  let operators = [];
  let numbers = [];

  function currentCalc() {
    const operator = operators.pop();
    const num1 = numbers.pop();
    const num2 = numbers.pop();

    numbers.push(singleCalc(num2, num1, operator));
  }

  for (const token of tokens) {
    if (isOperator(token)) {
      while (precedence(top(operators)) >= precedence(token)) {
        currentCalc();
      }

      operators.push(token);
    } else if (isNumber(token)) {
      numbers.push(token);
    } else if (token == "(") {
      operators.push(token);
    } else if (token == ")") {
      while (top(operators) != "(") {
        currentCalc();
      }

      operators.pop();
    }
  }

  while (operators.length > 0) {
    currentCalc();
  }

  const solution = numbers.pop();

  return solution;
}

/**
 * 
 * @param {string} str
 * 
 * @returns {number}
 */
export const calc = (str) => evaluate(tokenizer(str));
