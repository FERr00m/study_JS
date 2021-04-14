'use strict';

function isNumber(n) { 
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isString(str) {
  return (typeof str !== 'string' || isNumber(str) || str.trim() === '');
}

const ruAlphabet = 'абвгдежзийклмнопрстуфхцчшщъыьэюя',
      symbols = '1234567890 .,?"!\'-';
      
//Функция проверки на ввод русских букв и знаков препинаний
function checkLetter(str) {
  str = str.toLowerCase();
  for (let i = 0; i < str.length; i++) {
    if (ruAlphabet.includes(str[i]) || symbols.includes(str[i])) {
      continue;
    } else {
      return false;
    }
  }
  return true;
}

let buttonCount = document.getElementById('start'),
    buttonPlusIncome = document.getElementsByTagName('button')[0],
    buttonPlusExpenses = document.getElementsByTagName('button')[1],
    checkBoxDeposit = document.querySelector('#deposit-check'),
    fieldsAdditional = document.querySelectorAll('.additional_income-item'),
    budgetMonthValue = document.getElementsByClassName('budget_month-value')[0],
    budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
    expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
    additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
    additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
    incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
    targetMonthValue = document.getElementsByClassName('target_month-value')[0];

let salaryAmount = document.querySelector('.salary-amount'),
    incomeTitle = document.querySelector('input[class="income-title"]'),
    incomeAmount = document.querySelector('input[class="income-amount"]'),
    additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
    expensesTitle = document.querySelector('input[class="expenses-title"]'),
    expensesItems = document.querySelectorAll('.expenses-items'),
    additionalExpensesItem = document.querySelector('.additional_expenses-item'),
    targetAmount = document.querySelector('.target-amount'),
    periodSelect = document.querySelector('.period-select'),
    periodAmount = document.querySelector('.period-amount'),
    incomeItems = document.querySelectorAll('.income-items'),
    placeholdersNomination = document.querySelectorAll('input[placeholder="Наименование"'),
    placeholdersSum = document.querySelectorAll('input[placeholder="Сумма"');

let appData = {
    income: {},
    incomeMonth: 0,
    addIncome: [],
    expenses: {},
    addExpenses: [],
    deposit: false,
    percentDeposit: 0,
    moneyDeposit: 0,
    budget: 0,
    budgetDay: 0,
    budgetMonth: 0,
    expensesMonth: 0,

  start: function() {
    if (appData.getExpenses()) {
    appData.budget = +salaryAmount.value;
    
    appData.getIncome();
    appData.getExpensesMonth();
    appData.getAddExpenses();
    appData.getAddIncome();
    appData.getBudget();
    appData.getInfoDeposit(); 

    appData.showResult();
    } 
    
  },

  showResult: function() {
    budgetMonthValue.value = appData.budgetMonth;
    budgetDayValue.value = appData.budgetDay;
    expensesMonthValue.value = appData.expensesMonth;
    additionalExpensesValue.value = appData.addExpenses.join(', ');
    additionalIncomeValue.value = appData.addIncome.join(', ');
    targetMonthValue.value = appData.getTargetMonth();
    incomePeriodValue.value = appData.calcSavedMoney();
    
    periodSelect.addEventListener('change', function() {
      incomePeriodValue.value = appData.budgetMonth * periodSelect.value;
    });
    
  },

  addExpensesBlock: function() { 
    let cloneExpensesItem = expensesItems[0].cloneNode(true);
    let cloneExpensesItemArr = cloneExpensesItem.children;
    
    cloneExpensesItemArr[0].addEventListener('input', function() {
        if (checkLetter(cloneExpensesItemArr[0].value)) {
          return true;
        } else {
          cloneExpensesItemArr[0].value = '';
          return alert('Выберите русский язык');
        }
      });

      cloneExpensesItemArr[1].addEventListener('input', function() {
      if (isNumber(cloneExpensesItemArr[1].value)) {
        return true;
      } else if (cloneExpensesItemArr[1].value === '') {
        return true;
      } else {
        cloneExpensesItemArr[1].value = '';
        return alert('В поле "Сумма" введите цифры');
      }
    });  
    
    for (let item of cloneExpensesItemArr) {
      item.value = '';
    }
    expensesItems[0].parentNode.insertBefore(cloneExpensesItem, buttonPlusExpenses);
    expensesItems = document.querySelectorAll('.expenses-items');
    if(expensesItems.length === 3) {
      buttonPlusExpenses.style.display = 'none';
    }
  },

  addIncomeBlock: function() {
    let cloneIncomeItem = incomeItems[0].cloneNode(true);
    let cloneIncomeItemArr = cloneIncomeItem.children;

    cloneIncomeItemArr[0].addEventListener('input', function() {
      if (checkLetter(cloneIncomeItemArr[0].value)) {
        return true;
      } else {
        cloneIncomeItemArr[0].value = '';
        return alert('Выберите русский язык');
      }
    });

    cloneIncomeItemArr[1].addEventListener('input', function() {
      if (isNumber(cloneIncomeItemArr[1].value)) {
        return true;
      } else if (cloneIncomeItemArr[1].value === '') {
        return true;
      } else {
        cloneIncomeItemArr[1].value = '';
        return alert('В поле "Сумма" введите цифры');
      }
    });

    for (let item of cloneIncomeItemArr) {
      item.value = '';
    }

    incomeItems[0].parentNode.insertBefore(cloneIncomeItem, buttonPlusIncome);
    incomeItems = document.querySelectorAll('.income-items');
    if(incomeItems.length === 3) {
      buttonPlusIncome.style.display = 'none';
    }
  },

  getExpenses: function() {
    let flag = false;
    expensesItems.forEach(function(item) {
      let itemExpenses = item.querySelector('.expenses-title').value;
      let cashExpenses = item.querySelector('.expenses-amount').value;
      if(!isString(itemExpenses) && isNumber(cashExpenses)) {
        appData.expenses[itemExpenses] = cashExpenses;
        flag = true;
      } else {
          alert('Ошибка в поле "Обязательный расход"');
        flag = false;
      }
    
    });
    return flag;
  },

  getIncome: function() {
    incomeItems.forEach(function(item) {
      let itemIncomes = item.querySelector('.income-title').value;
      let cashIncomes = item.querySelector('.income-amount').value;
      if (itemIncomes.length > 1 || cashIncomes.length > 1) {
        if(!isString(itemIncomes) && isNumber(cashIncomes)) {
          appData.income[itemIncomes] = +cashIncomes;
        } else {
            alert('Ошибка в поле "Дополнительный доход"');
          return;
        }
      }
      
    });
    for (let key in appData.income) {
      appData.incomeMonth += +appData.income[key];
    }
  },

  getAddExpenses: function() {
    let addExpenses = additionalExpensesItem.value.split(',');
    addExpenses.forEach(function(item) {
      item = item.trim();
      if (item !== '') {
        appData.addExpenses.push(item);
      }
    });
  },

  getAddIncome: function() {
    additionalIncomeItem.forEach(function(item) {
      let itemValue = item.value.trim();
      if (itemValue !== '') {
        appData.addIncome.push(itemValue);
      }
    });
  },

  getExpensesMonth: function() {
    for (let key in appData.expenses) {
      appData.expenses[key] = +appData.expenses[key];
      appData.expensesMonth += appData.expenses[key];
    }
  },

  getBudget: function() {
    appData.budgetMonth = appData.budget + appData.incomeMonth - appData.expensesMonth;
    appData.budgetDay = Math.round(appData.budgetMonth / 30);
  },

  getTargetMonth: function() {
    if (appData.budgetMonth <= 0) {
      return ('Цель не будет достигнута');
    }
    let result = Math.ceil(targetAmount.value / appData.budgetMonth);
    return result;
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
    return appData.budgetMonth * periodSelect.value;
  }
};

buttonCount.disabled = true;

salaryAmount.addEventListener('input', function() {
  if (salaryAmount.value.length >= 1) {
    buttonCount.disabled = false;
  } else {
    buttonCount.disabled = true;
  }
});

buttonCount.addEventListener('click', function() {
  appData.start();
});
buttonPlusExpenses.addEventListener('click', appData.addExpensesBlock);
buttonPlusIncome.addEventListener('click', appData.addIncomeBlock);
periodSelect.addEventListener('input', function() {
  periodAmount.textContent = periodSelect.value;
});

placeholdersNomination.forEach(function(item) {
  item.addEventListener('input', function() {
    if (checkLetter(item.value)) {
      return true;
    } else {
      item.value = '';
      return alert('Выберите русский язык');
    }
  });
});

placeholdersSum.forEach(function(item) {
  item.addEventListener('input', function() {
    if (isNumber(item.value)) {
      return true;
    } else if (item.value === '') {
      return true;
    } else {
      item.value = '';
      return alert('В поле "Сумма" введите цифры');
    }
  });
});
