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

class AppData {
  constructor() {
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
  }
  showResult() {
    const _this = this;
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = this.getTargetMonth();
    incomePeriodValue.value = this.calcSavedMoney();

    periodSelect.addEventListener('change', function () {
      incomePeriodValue.value = _this.budgetMonth * periodSelect.value;
    });
  }
  start() {
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
  }
  addExpensesBlock() {
    let cloneExpensesItem = expensesItems[0].cloneNode(true);
    let cloneExpensesItemArr = cloneExpensesItem.children;

    cloneExpensesItemArr[0].addEventListener('input', function () {
      if (checkLetter(cloneExpensesItemArr[0].value)) {
        return true;
      } else {
        cloneExpensesItemArr[0].value = '';
        return alert('Допустимые значения: буквы русского алфавита и знаки препинания');
      }
    });

    cloneExpensesItemArr[1].addEventListener('input', function () {
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
    if (expensesItems.length === 3) {
      buttonPlusExpenses.style.display = 'none';
    }
  }
  addIncomeBlock() {
    let cloneIncomeItem = incomeItems[0].cloneNode(true);
    let cloneIncomeItemArr = cloneIncomeItem.children;

    cloneIncomeItemArr[0].addEventListener('input', function () {
      if (checkLetter(cloneIncomeItemArr[0].value)) {
        return true;
      } else {
        cloneIncomeItemArr[0].value = '';
        return alert('Допустимые значения: буквы русского алфавита и знаки препинания');
      }
    });

    cloneIncomeItemArr[1].addEventListener('input', function () {
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
    if (incomeItems.length === 3) {
      buttonPlusIncome.style.display = 'none';
    }
  }
  getExpenses() {
    const _this = this;
    expensesItems.forEach(function (item) {
      let itemExpenses = item.querySelector('.expenses-title').value;
      let cashExpenses = item.querySelector('.expenses-amount').value;
      _this.expenses[itemExpenses] = cashExpenses;
    });
  }
  getIncome() {
    const _this = this;
    incomeItems.forEach(function (item) {
      let itemIncomes = item.querySelector('.income-title').value;
      let cashIncomes = item.querySelector('.income-amount').value;
      _this.income[itemIncomes] = +cashIncomes;
    });
    for (let key in this.income) {
      this.incomeMonth += +this.income[key];
    }
  }
  getAddExpenses() {
    const _this = this;
    let addExpenses = additionalExpensesItem.value.split(',');
    addExpenses.forEach(function (item) {
      item = item.trim();
      if (item !== '') {
        _this.addExpenses.push(item);
      }
    });
  }
  getAddIncome() {
    const _this = this;
    additionalIncomeItem.forEach(function (item) {
      let itemValue = item.value.trim();
      if (itemValue !== '') {
        _this.addIncome.push(itemValue);
      }
    });
  }
  getExpensesMonth() {
    for (let key in this.expenses) {
      this.expenses[key] = +this.expenses[key];
      this.expensesMonth += this.expenses[key];
    }
  }
  getBudget() {
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
    this.budgetDay = Math.round(this.budgetMonth / 30);
  }
  getTargetMonth() {
    if (this.budgetMonth <= 0) {
      return ('Цель не будет достигнута');
    }
    let result = Math.ceil(targetAmount.value / this.budgetMonth);
    return result;
  }
  getStatusIncome() {
    if (this.budgetDay > 1200) {
      return ('У вас высокий уровень дохода');
    } else if (600 <= this.budgetDay && this.budgetDay <= 1200) {
      return ('У вас средний уровень дохода');
    } else if (0 <= this.budgetDay && this.budgetDay < 600) {
      return ('К сожалению у вас уровень дохода ниже среднего');
    } else {
      return ('Что то пошло не так');
    }
  }
  getInfoDeposit() {
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
  }
  calcSavedMoney() {
    return this.budgetMonth * periodSelect.value;
  }
  blocked() {
    const _this = this;
    let inputsText = document.querySelectorAll('input[type="text"]');
    inputsText.forEach(function (item) {
      item.disabled = true;
    });
    buttonCount.style = 'display: none';
    buttonReset.style = 'display: block';
    buttonsPlus.forEach(function (item) {
      item.disabled = true;
    });
    checkBoxDeposit.disabled = true;
    periodSelect.disabled = true;
    buttonReset.addEventListener('click', function () {
      _this.reset();
    });
  }
  reset() {
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
    inputsText.forEach(function (item) {
      item.value = '';
    });
    newArr.forEach(function (item) {
      item.disabled = false;
    });
    buttonCount.style = 'display: block';
    buttonCount.disabled = true;
    buttonReset.style = 'display: none';
    buttonsPlus.forEach(function (item) {
      item.disabled = false;
    });
    checkBoxDeposit.disabled = false;
    periodSelect.disabled = false;
    periodSelect.value = 1;
    periodAmount.textContent = periodSelect.value;
    
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
  }
  eventsListeners() {
    const _this = this;
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
      _this.start();
    });
    buttonPlusExpenses.addEventListener('click', this.addExpensesBlock);
    buttonPlusIncome.addEventListener('click', this.addIncomeBlock);
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
  }
}

const appData2 = new AppData();
appData2.eventsListeners();
