'use strict';

function isNumber(n) { 
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isString(str) {
  return (typeof str !== 'string' || isNumber(str) || str.trim() === '');
}

const ruAlphabet = 'абвгдежзийклмнопрстуфхцчшщъыьэюя',
      symbols = ' .,?"!\'-';
      
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
    buttonReset = document.getElementById('cancel'),
    buttonsPlus = document.querySelectorAll('.btn_plus'),
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
    expensesAmount = document.querySelector('.expenses-amount'),
    expensesItems = document.querySelectorAll('.expenses-items'),
    additionalExpensesItem = document.querySelector('.additional_expenses-item'),
    targetAmount = document.querySelector('.target-amount'),
    periodSelect = document.querySelector('.period-select'),
    periodAmount = document.querySelector('.period-amount'),
    incomeItems = document.querySelectorAll('.income-items'),
    placeholdersNomination = document.querySelectorAll('input[placeholder="Наименование"'),
    placeholdersSum = document.querySelectorAll('input[placeholder="Сумма"'),
    inputsText = document.querySelectorAll('input[type="text"]');

inputsText = Array.prototype.slice.call(inputsText);
let newArr = inputsText.slice(0, 11);

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
    this.budget = +salaryAmount.value;
    this.getExpenses();
    this.getIncome();
    this.getExpensesMonth();
    this.getAddExpenses();
    this.getAddIncome();
    this.getBudget();
    this.getInfoDeposit(); 

    this.showResult();
    this.blocked();
  },

  showResult: function() {
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = this.getTargetMonth();
    incomePeriodValue.value = this.calcSavedMoney();
    
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
          return alert('Допустимые значения: буквы русского алфавита и знаки препинания');
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
        return alert('Допустимые значения: буквы русского алфавита и знаки препинания');
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
    expensesItems.forEach(function(item) {
      let itemExpenses = item.querySelector('.expenses-title').value;
      let cashExpenses = item.querySelector('.expenses-amount').value;
      appData.expenses[itemExpenses] = cashExpenses;
  });
},

  getIncome: function() {
    incomeItems.forEach(function(item) {
      let itemIncomes = item.querySelector('.income-title').value;
      let cashIncomes = item.querySelector('.income-amount').value;
      appData.income[itemIncomes] = +cashIncomes;    
    });
    for (let key in this.income) {
      this.incomeMonth += +this.income[key];
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
    for (let key in this.expenses) {
      this.expenses[key] = +this.expenses[key];
      this.expensesMonth += this.expenses[key];
    }
  },

  getBudget: function() {
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
    this.budgetDay = Math.round(this.budgetMonth / 30);
  },

  getTargetMonth: function() {
    if (this.budgetMonth <= 0) {
      return ('Цель не будет достигнута');
    }
    let result = Math.ceil(targetAmount.value / this.budgetMonth);
    return result;
  },

  getStatusIncome: function() {
      if (this.budgetDay > 1200) {
      return ('У вас высокий уровень дохода');
    } else if (600 <= this.budgetDay && this.budgetDay <= 1200) {
      return ('У вас средний уровень дохода');
    } else if (0 <= this.budgetDay && this.budgetDay < 600) {
      return ('К сожалению у вас уровень дохода ниже среднего');
    } else {
      return ('Что то пошло не так');
    }
  }, 

  getInfoDeposit: function() {
    if (this.deposit) {
      this.percentDeposit = prompt('Какой годовой процент?', '10');
      while (!isNumber(this.percentDeposit)) {
        this.percentDeposit = prompt('Какой годовой процент?', '10');
      }
      this.percentDeposit = +this.percentDeposit;
      this.moneyDeposit = prompt('Какая сумма заложена?', 10000);
      while (!isNumber(this.moneyDeposit)) {
        this.moneyDeposit = prompt('Какая сумма заложена?', 10000);
      }
      this.moneyDeposit = +this.moneyDeposit;
    }
  },

  calcSavedMoney: function() {
    return this.budgetMonth * periodSelect.value;
  },

  blocked: function() {
    let inputsText = document.querySelectorAll('input[type="text"]');
    inputsText.forEach(function(item) {
      item.disabled = true;
    });
    buttonCount.style = 'display: none';
    buttonReset.style = 'display: block';
    buttonsPlus.forEach(function(item) {
      item.disabled = true;
    });
    buttonReset.addEventListener('click', function() {
      appData.reset();
    });
  },

  reset: function() {
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0;
    let inputsText = document.querySelectorAll('input[type="text"]');
    inputsText = Array.prototype.slice.call(inputsText); 
    inputsText.forEach(function(item) {
      item.value = '';  
    });
    newArr.forEach(function(item) {
      item.disabled = false;
    });
    buttonCount.style = 'display: block';
    buttonCount.disabled = true;
    buttonReset.style = 'display: none';
    buttonsPlus.forEach(function(item) {
      item.disabled = false;
    });

    let newExpensesArr = document.querySelectorAll('.expenses-items');
    newExpensesArr = Array.prototype.slice.call(newExpensesArr);

    if (newExpensesArr.length === 3) {
      newExpensesArr[1].remove();
      newExpensesArr[2].remove();
    }
    if (newExpensesArr.length === 2) {
      newExpensesArr[1].remove();
    }
    buttonPlusExpenses.style = "display: block";

    let newIncomeArr = document.querySelectorAll('.income-items');
    newIncomeArr = Array.prototype.slice.call(newIncomeArr);

    if (newIncomeArr.length === 3) {
      newIncomeArr[1].remove();
      newIncomeArr[2].remove();
    }
    if (newIncomeArr.length === 2) {
      newIncomeArr[1].remove();
    }
    buttonPlusIncome.style = "display: block";
  },
};

buttonCount.disabled = true;
buttonsPlus.forEach(function(item) {
  item.disabled = false;
});

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
      return alert('Допустимые значения: буквы русского алфавита и знаки препинания');
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
