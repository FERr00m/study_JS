'use strict';

let money,
    income,
    addExpenses,
    deposit,
    mission,
    period,
    budgetDay,
    budgetMonth,
    expenses1,
    expenses2,
    amount1,
    amount2;

money = +prompt('Ваш месячный доход?');
console.log('money: ', typeof money);
income = 'Фриланс';
console.log('income: ', typeof income);
addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую');
deposit = confirm('Есть ли у вас депозит в банке?');
console.log('deposit: ', typeof deposit);
expenses1 = prompt('Введите обязательную статью расходов:');
amount1 = +prompt('Во сколько это обойдется?');
expenses2 = prompt('Введите ещё одну обязательную статью расходов:');
amount2 = +prompt('Во сколько это обойдется?');
mission = 2e5;
period = 6;
console.log('Период равен', period, 'месяцев');
console.log('Цель заработать', mission, 'рублей');

addExpenses = addExpenses.toLowerCase(); 
addExpenses = addExpenses.split(', ');
console.log('Результат: ', addExpenses);

budgetMonth = money - amount1 - amount2;
console.log('Бюджет на месяц', budgetMonth);

console.log('Цель будет достигнута за', Math.round(mission / budgetMonth), 'месяцев(-а)');

budgetDay = Math.round(budgetMonth / 30);
console.log('Бюджет на день', budgetDay);

// Вариант 1
// if (budgetDay > 1200) {
//   console.log('У вас высокий уровень дохода');
// } else if (600 <= budgetDay && budgetDay <= 1200) {
//   console.log('У вас средний уровень дохода');
// } else if (0 <= budgetDay && budgetDay < 600) {
//   console.log('К сожалению у вас уровень дохода ниже среднего');
// } else {
//   console.log('Что то пошло не так');
// }

// Вариант 2
console.log((budgetDay > 1200) ? 'У вас высокий уровень дохода' :
  (600 <= budgetDay && budgetDay <= 1200) ? 'У вас средний уровень дохода' :
  (0 <= budgetDay && budgetDay < 600) ? 'К сожалению у вас уровень дохода ниже среднего' :
  'Что то пошло не так');

