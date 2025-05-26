
function calculate(operator) {
    const num1Input = document.getElementById('num1');
    const num2Input = document.getElementById('num2');
    const resultDiv = document.getElementById('result');

    const num1 = parseFloat(num1Input.value);
    const num2 = parseFloat(num2Input.value);

    if (isNaN(num1) || isNaN(num2)) {
        resultDiv.textContent = '結果: 請輸入有效的數字';
        return;
    }

    let result;
    switch (operator) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            if (num2 === 0) {
                resultDiv.textContent = '結果: 除數不能為零';
                return;
        case '^':
            result = Math.pow(num1, num2);
            break;
            }
            result = num1 / num2;
            break;
        default:
            resultDiv.textContent = '結果: 無效的操作符';
            return;
    }

    resultDiv.textContent = '結果: ' + result;
}
