'use strict';

let money,
    income,
    addExpenses,
    deposit,
    mission,
    period,
    budgetDay; 

money = 50000;
console.log('money:', typeof money);
income = 'Фриланс';
console.log('income:', typeof income);
addExpenses = 'Бензин, Интернет, Ресторан';
console.log('Длина строки addExpenses:', addExpenses.length);
deposit = true;
console.log('deposit:', typeof deposit);
mission = 2e5;
period = 6;
console.log('Период равен', period, 'месяцев и Цель заработать', mission, 'рублей');

addExpenses = addExpenses.toLowerCase(); 
addExpenses = addExpenses.split(', ');
console.log('Результат: ', addExpenses);

budgetDay = money / 30;
console.log('budgetDay: ', budgetDay);