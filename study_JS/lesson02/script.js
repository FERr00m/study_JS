'use strict';

function isNumber(n) { 
  return !isNaN(parseFloat(n)) && isFinite(n);
}

let money,
    start = function() {
      do {
        money = prompt('Ваш месячный доход?');
      }

      while (!isNumber(money));
      money = +money;
    };

start();

let appData = {
  income: {},
  addIncome: [],
  expenses: {},
  addExpenses: [],
  deposit: false,
  mission: 200000,
  period: 6,
  budget: money,
  budgetDay: 0,
  budgetMonth: 0,
  expensesMonth: 0,

  getExpensesMonth: function () {
    for (let key in appData.expenses) {
      appData.expenses[key] = +appData.expenses[key];
      appData.expensesMonth += appData.expenses[key];
    }
  },

  getBudget: function () {
    appData.budgetMonth = money - appData.expensesMonth;
    appData.budgetDay = Math.round(appData.budgetMonth / 30);
  },

  getTargetMonth: function () {
    if (appData.budgetMonth <= 0) {
      return ('Цель не будет достигнута');
    }
    let result = Math.round(appData.mission / appData.budgetMonth);
    return (`Цель будет достигнута за ${result} месяцев(-а)`);
  },

  getStatusIncome: function () {
    if (appData.budgetDay > 1200) {
    return ('У вас высокий уровень дохода');
  } else if (600 <= appData.budgetDay && appData.budgetDay <= 1200) {
    return ('У вас средний уровень дохода');
  } else if (0 <= appData.budgetDay && appData.budgetDay < 600) {
    return ('К сожалению у вас уровень дохода ниже среднего');
  } else {
    return ('Что то пошло не так');
  }
  }, 

  asking: function() {
    let addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую');
        appData.addExpenses = addExpenses.toLowerCase().split(',');
        appData.deposit = confirm('Есть ли у вас депозит в банке?');
        
    for (let i = 0; i < 2; i++) {
      let amount = 0;
      appData.expenses[prompt('Введите обязательную статью расходов:')] = amount = prompt('Во сколько это обойдется?');
      while (!isNumber(amount)) {
        amount = prompt('Во сколько это обойдется?');
      } 
    }
  },
};

appData.asking();
appData.getExpensesMonth();
appData.getBudget(); 

console.log('Расходы за месяц', appData.expensesMonth);
console.log(appData.getTargetMonth());
console.log(appData.getStatusIncome());

for (let key in appData) {
  console.log('Наша программа включает в себя данные:', key, appData[key]);
}
