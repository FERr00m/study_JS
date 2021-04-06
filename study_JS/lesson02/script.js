'use strict';

let money = +prompt('Ваш месячный доход?', 50000),
    income = 'Фриланс',
    addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую'),
    deposit = confirm('Есть ли у вас депозит в банке?'),
    mission = 2e5,
    period = 6;
    

function showTypeOf(data) {
  console.log(data, typeof(data));
}


showTypeOf(money);
showTypeOf(income);
showTypeOf(deposit);


function getExpensesMonth(value1, value2) {
  let sum = value1 + value2;
  return sum;
}


function getTargetMonth(value1, value2) {
  if (value2 === 0) {
    return ('Невозможно расчитать период для достижения цели, так как бюджет на месяц равен нулю');
  }
  let result = Math.round(value1 / value2);
  return result;
}


function getAccumulatedMonth(income, value1, value2) {
  let result = income - value1 - value2;
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


let expenses1 = prompt('Введите обязательную статью расходов:', 'бензин'),
    amount1 = +prompt('Во сколько это обойдется?', 3000),
    expenses2 = prompt('Введите ещё одну обязательную статью расходов:', 'интернет'),
    amount2 = +prompt('Во сколько это обойдется?', 600),
    accumulatedMonth = getAccumulatedMonth(money, amount1, amount2),
    budgetDay = Math.round(accumulatedMonth / 30);

addExpenses = addExpenses.toLowerCase(); 
addExpenses = addExpenses.split(', ');

console.log('Расходы за месяц', getExpensesMonth(amount1, amount2));
console.log('Возможные расходы: ', addExpenses);
console.log('Cрок достижения цели в месяцах:', getTargetMonth(mission, accumulatedMonth));
console.log('Бюджет на день', budgetDay);
console.log('Бюджет на месяц', accumulatedMonth);
console.log(getStatusIncome(budgetDay));

















