'use strict';

function isNumber(n) { 
  return !isNaN(parseFloat(n)) && isFinite(n);
}


let money, 
    income = 'Фриланс',
    addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую'),
    deposit = confirm('Есть ли у вас депозит в банке?'),
    mission = 2e5,
    period = 6;
    

function showTypeOf(data) {
  console.log(data, typeof(data));
}

let start = function() {
  do {
    money = prompt('Ваш месячный доход?');
  }

  while (!isNumber(money));
  money = +money;
};

start();


showTypeOf(money);
showTypeOf(income);
showTypeOf(deposit);


let expenses = [];

function getExpensesMonth() {
  let sum = 0;
  
  for (let i = 0; i < 2; i++) {
    expenses[i] = prompt('Введите обязательную статью расходов:');
    let amount = prompt('Во сколько это обойдется?');

    while (!isNumber(amount)) {
      amount = prompt('Во сколько это обойдется?');
    } 
    sum += +amount;
  }

  return sum;
}


function getTargetMonth(value1, value2) {
  if (value2 <= 0) {
    return ('Цель не будет достигнута');
  }
  let result = Math.round(value1 / value2);
  return (`Цель будет достигнута за ${result} месяцев(-а)`);
}


function getAccumulatedMonth(income, sum) {
  let result = income - sum;
  return result;
}


function getStatusIncome(data) {
  if (data > 1200) {
  return ('У вас высокий уровень дохода');
} else if (600 <= data && data <= 1200) {
  return ('У вас средний уровень дохода');
} else if (0 <= data && data < 600) {
  return ('К сожалению у вас уровень дохода ниже среднего');
} else {
  return ('Что то пошло не так');
}
}


let expensesAmount = getExpensesMonth(),
    accumulatedMonth = getAccumulatedMonth(money, expensesAmount),
    budgetDay = Math.round(accumulatedMonth / 30);
    


console.log('Расходы за месяц', expensesAmount);
console.log('Возможные расходы: ', addExpenses.toLowerCase().split(','));
console.log(getTargetMonth(mission, accumulatedMonth));
console.log('Бюджет на день', budgetDay);
console.log('Бюджет на месяц', accumulatedMonth);
console.log(getStatusIncome(budgetDay));

















