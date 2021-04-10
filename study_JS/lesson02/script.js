'use strict';

function isNumber(n) { 
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isString(str) {
  return (typeof str !== 'string' || isNumber(str) || str.trim() === '');
}

let money,
    start = function() {
      do {
        money = prompt('Ваш месячный доход?', 50000);
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
  percentDeposit: 0,
  moneyDeposit: 0,
  mission: 200000,
  period: 6,
  budget: money,
  budgetDay: 0,
  budgetMonth: 0,
  expensesMonth: 0,

  getExpensesMonth: function() {
    for (let key in appData.expenses) {
      appData.expenses[key] = +appData.expenses[key];
      appData.expensesMonth += appData.expenses[key];
    }
  },

  getBudget: function() {
    appData.budgetMonth = money - appData.expensesMonth;
    appData.budgetDay = Math.round(appData.budgetMonth / 30);
  },

  getTargetMonth: function() {
    if (appData.budgetMonth <= 0) {
      return ('Цель не будет достигнута');
    }
    let result = Math.round(appData.mission / appData.budgetMonth);
    return (`Цель будет достигнута за ${result} месяцев(-а)`);
  },

  getStatusIncome: function() {
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

    if ((confirm('Есть ли у вас дополнительный источник заработка?'))) {
      let itemIncome = prompt('Какой у вас дополнительный заработок?', 'Таксую');
      while (isString(itemIncome)) {
        itemIncome = prompt('Какой у вас дополнительный заработок?', 'Таксую');
      }
      let cashIncome = prompt('Сколько в месяц вы на этом зарабатываете?', 10000);
      while (!isNumber(cashIncome)) {
        cashIncome = prompt('Сколько в месяц вы на этом зарабатываете?', 10000);
      } 
      appData.income[itemIncome] = cashIncome;
    } 

    let addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую', 'Бензин');
    let arr = [];
    arr = addExpenses.toLowerCase().split(',');
    arr.forEach(function(item) {
      item = item.trim();
      appData.addExpenses.push(item);
    });
    appData.deposit = confirm('Есть ли у вас депозит в банке?');
        
    for (let i = 0; i < 2; i++) {
      let amount = 0,
          question = '';
      question = prompt('Введите обязательную статью расходов:', 'Кино');
      while (isString(question) || isNumber(question)) {
        question = prompt('Введите обязательную статью расходов:', 'Кино');
        console.log('Отработал while01');
      }
      amount = prompt('Во сколько это обойдется?', 2000);
      while (!isNumber(amount)) {
        amount = prompt('Во сколько это обойдется?', 2000);
        console.log('Отработал while02');
      } 
      appData.expenses[question] = amount;
    }
  },

  getInfoDeposit: function() {
    if (appData.deposit) {
      appData.percentDeposit = prompt('Какой годовой процент?', '10');
      while (!isNumber(appData.percentDeposit)) {
        appData.percentDeposit = prompt('Какой годовой процент?', '10');
      }
      appData.percentDeposit = +appData.percentDeposit;
      appData.moneyDeposit = prompt('Какая сумма заложена?', 10000);
      while (!isNumber(appData.moneyDeposit)) {
        appData.moneyDeposit = prompt('Какая сумма заложена?', 10000);
      }
      appData.moneyDeposit = +appData.moneyDeposit;
    }
  },

  calcSavedMoney: function() {
    return appData.budgetMonth * appData.period;
  }
};

appData.asking();
appData.getExpensesMonth();
appData.getBudget();
appData.getInfoDeposit(); 

console.log('Расходы за месяц', appData.expensesMonth);
console.log(appData.getTargetMonth());
console.log(appData.getStatusIncome());

function arrToStr(arr) {
  let resultArr = [];
  arr.forEach(function(item) {
    item = item[0].toUpperCase() + item.substring(1);
    resultArr.push(item);
  });
  return resultArr.join(', ');
}

console.log(arrToStr(appData.addExpenses));

for (let key in appData) {
  console.log('Наша программа включает в себя данные:', key, appData[key]);
}
