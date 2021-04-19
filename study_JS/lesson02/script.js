'use strict';

const isNumber = (n) => { 
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const isString = (str) => {
  return (typeof str !== 'string' || isNumber(str) || str.trim() === '');
};

const ruAlphabet = 'абвгдежзийклмнопрстуфхцчшщъыьэюя',
      symbols = ' .,?"!\'-';
      
//Функция проверки на ввод русских букв и знаков препинаний
const checkLetter = (str) => {
  str = str.toLowerCase();
  for (let i = 0; i < str.length; i++) {
    if (ruAlphabet.includes(str[i]) || symbols.includes(str[i])) {
      continue;
    } else {
      return false;
    }
  }
  return true;
};

const buttonCount = document.getElementById('start'),
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

const salaryAmount = document.querySelector('.salary-amount'),
      incomeTitle = document.querySelector('input[class="income-title"]'),
      incomeAmount = document.querySelector('input[class="income-amount"]'),
      additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
      expensesTitle = document.querySelector('input[class="expenses-title"]'),
      expensesAmount = document.querySelector('.expenses-amount'),
      additionalExpensesItem = document.querySelector('.additional_expenses-item'),
      targetAmount = document.querySelector('.target-amount'),
      periodSelect = document.querySelector('.period-select'),
      periodAmount = document.querySelector('.period-amount'),
      placeholdersNomination = document.querySelectorAll('input[placeholder="Наименование"'),
      placeholdersSum = document.querySelectorAll('input[placeholder="Сумма"');
    
let expensesItems = document.querySelectorAll('.expenses-items'),
    incomeItems = document.querySelectorAll('.income-items'),
    inputsText = document.querySelectorAll('input[type="text"]');

inputsText = Array.prototype.slice.call(inputsText);
const newArr = inputsText.slice(0, 11);

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
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = this.getTargetMonth();
    incomePeriodValue.value = this.calcSavedMoney();

    periodSelect.addEventListener('change', () => {
      incomePeriodValue.value = this.budgetMonth * periodSelect.value;
    });
  }

  start() {
    this.budget = +salaryAmount.value;
    this.getExpInc();
    this.getExpensesMonth();
    this.getAddExpInc();
    this.getBudget();
    this.getInfoDeposit();

    this.showResult();
    this.blocked();
  }

  addExpIncBlock(str, btn, classEl) {
    const cloneExpIncItem = str[0].cloneNode(true);
    const cloneExpIncItemArr = cloneExpIncItem.children;

    cloneExpIncItemArr[0].addEventListener('input', () =>{
      if (checkLetter(cloneExpIncItemArr[0].value)) {
        return true;
      } else {
        cloneExpIncItemArr[0].value = '';
        return alert('Допустимые значения: буквы русского алфавита и знаки препинания');
      }
    });

    cloneExpIncItemArr[1].addEventListener('input', () => {
      if (isNumber(cloneExpIncItemArr[1].value)) {
        return true;
      } else if (cloneExpIncItemArr[1].value === '') {
        return true;
      } else {
        cloneExpIncItemArr[1].value = '';
        return alert('В поле "Сумма" введите цифры');
      }
    });

    for (let item of cloneExpIncItemArr) {
      item.value = '';
    }

    str[0].parentNode.insertBefore(cloneExpIncItem, btn);
    str = document.querySelectorAll(classEl);
    if (str.length === 3) {
      btn.style.display = 'none';
    }
  }

  getExpInc() {
    const count = (item) => {
      const startStr = item.className.split('-')[0];
      const itemTitle = item.querySelector(`.${startStr}-title`).value;
      const itemAmount = item.querySelector(`.${startStr}-amount`).value;
      this[startStr][itemTitle] = itemAmount;
    };

    incomeItems.forEach(count);
    expensesItems.forEach(count);

    for (const key in this.income) {
      this.incomeMonth += +this.income[key];
    }
  }

  getAddExpInc() {
    const func = (item) => {
      item = item.trim();
      if (item !== '') {
        return item;
      } else {
        return '';
      }
    };

    const addExpenses = additionalExpensesItem.value.split(', ');
    const addIncomes = (additionalIncomeItem[0].value + ', ' + additionalIncomeItem[1].value).split(', ');
    
    addExpenses.forEach((item) => {
      this.addExpenses.push(func(item));
    });
    addIncomes.forEach((item) => {
      this.addIncome.push(func(item));
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
    const result = Math.ceil(targetAmount.value / this.budgetMonth);
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
    const inputsText = document.querySelectorAll('input[type="text"]');
    inputsText.forEach((item) => {
      item.disabled = true;
    });
    buttonCount.style = 'display: none';
    buttonReset.style = 'display: block';
    buttonsPlus.forEach((item) => {
      item.disabled = true;
    });
    checkBoxDeposit.disabled = true;
    periodSelect.disabled = true;
    buttonReset.addEventListener('click', () => {
      this.reset();
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
    inputsText.forEach((item) => {
      item.value = '';
    });
    newArr.forEach((item) => {
      item.disabled = false;
    });
    buttonCount.style = 'display: block';
    buttonCount.disabled = true;
    buttonReset.style = 'display: none';
    buttonsPlus.forEach((item) => {
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
    buttonCount.disabled = true;
    buttonsPlus.forEach((item) => {
      item.disabled = false;
    });
    salaryAmount.addEventListener('input', () => {
      if (salaryAmount.value.length >= 1) {
        buttonCount.disabled = false;
      } else {
        buttonCount.disabled = true;
      }
    });
    
    buttonCount.addEventListener('click', () =>{
      this.start();
    });
    
    buttonPlusExpenses.addEventListener('click', () => {
      this.addExpIncBlock(expensesItems, buttonPlusExpenses, '.expenses-items');
    });

    buttonPlusIncome.addEventListener('click', () => {
      this.addExpIncBlock(incomeItems, buttonPlusIncome, '.income-items');
    });
    
    periodSelect.addEventListener('input', () => {
      periodAmount.textContent = periodSelect.value;
    });
    
    placeholdersNomination.forEach((item) => {
      item.addEventListener('input', () => {
        if (checkLetter(item.value)) {
          return true;
        } else {
          item.value = '';
          return alert('Допустимые значения: буквы русского алфавита и знаки препинания');
        }
      });
    });
    
    placeholdersSum.forEach((item) => {
      item.addEventListener('input', () => {
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

const appData = new AppData();
appData.eventsListeners();
