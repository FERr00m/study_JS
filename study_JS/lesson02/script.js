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
      placeholdersSum = document.querySelectorAll('input[placeholder="Сумма"'),
      depositBank = document.querySelector('.deposit-bank'),
      depositAmount = document.querySelector('.deposit-amount'),
      depositPercent = document.querySelector('.deposit-percent'),
      currentDate = new Date(),
      arrOfInputs = document.getElementsByTagName('input');
      
  
let expensesItems = document.querySelectorAll('.expenses-items'),
    incomeItems = document.querySelectorAll('.income-items'),
    storage = localStorage.getItem('rightSide');

let count = 0;    
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
    budgetMonthValue.value = Math.round(this.budgetMonth);
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = this.getTargetMonth();
    incomePeriodValue.value = Math.round(this.calcSavedMoney());

    periodSelect.addEventListener('change', () => {
      incomePeriodValue.value = this.budgetMonth * periodSelect.value;
    });
    
  }

  start() {
    this.budget = +salaryAmount.value;
    this.getExpInc();
    this.getExpensesMonth();
    this.getAddExpInc();
    this.getInfoDeposit();
    this.getBudget();

    this.showResult();
    this.blocked();
    this.setLocalStorageRightSide();
    this.setCookie('isLoad', 'true', 2022, 5, 5);
  }

  addExpIncBlock(str, btn, classEl) {
    const cloneExpIncItem = str[0].cloneNode(true);
    const cloneExpIncItemArr = cloneExpIncItem.children;
    cloneExpIncItemArr[0].classList.add(`new-item${count}`);
    cloneExpIncItemArr[1].classList.add(`new-item${count}`);
    count++;

    cloneExpIncItemArr[0].addEventListener('input', () => {
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

    this.activeInputs().forEach(item => {
      item.removeEventListener('input', () =>{
        this.leftSide();
      });
    })
    this.activeInputs().forEach(item => {
      item.addEventListener('input', () =>{
        this.leftSide();
      });
    })
  }

  getExpInc() {
    const count = (item) => {
      const startStr = item.className.split('-')[0];
      const itemTitle = item.querySelector(`.${startStr}-title`).value;
      const itemAmount = item.querySelector(`.${startStr}-amount`).value;
      this[startStr][itemTitle] = itemAmount;
    };
    let expensesItems = document.querySelectorAll('.expenses-items'),
      incomeItems = document.querySelectorAll('.income-items');
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
      if (item === '') {
        return;
      } else {
        this.addIncome.push(func(item));
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
    const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposit;
    this.budgetDay = Math.floor(this.budgetMonth / 30);
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
      this.percentDeposit = depositPercent.value;
      this.moneyDeposit = depositAmount.value;
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
    buttonReset.addEventListener('click', () => {
      this.reset();
    });
    checkBoxDeposit.disabled = true;
    depositBank.disabled = true;
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
    inputsText = Array.from(inputsText);
    inputsText.forEach((item) => {
      item.value = '';
    });
    
    buttonCount.style = 'display: block';
    buttonCount.disabled = true;
    buttonReset.style = 'display: none';
    buttonsPlus.forEach((item) => {
      item.disabled = false;
    });
    checkBoxDeposit.disabled = false;
    periodSelect.value = 1;
    periodAmount.textContent = periodSelect.value;
    
    let newExpensesArr = document.querySelectorAll('.expenses-items');
    newExpensesArr = Array.from(newExpensesArr);

    if (newExpensesArr.length === 3) {
      newExpensesArr[1].remove();
      newExpensesArr[2].remove();
    }

    if (newExpensesArr.length === 2) {
      newExpensesArr[1].remove();
    }

    buttonPlusExpenses.style = "display: block";

    let newIncomeArr = document.querySelectorAll('.income-items');
    newIncomeArr = Array.from(newIncomeArr);

    if (newIncomeArr.length === 3) {
      newIncomeArr[1].remove();
      newIncomeArr[2].remove();
    }

    if (newIncomeArr.length === 2) {
      newIncomeArr[1].remove();
    }

    buttonPlusIncome.style = "display: block";
    depositBank.disabled = false;
    depositBank.value = '';
    depositPercent.style.display = 'none';
    checkBoxDeposit.checked = false;
    this.depositHandler();
    periodSelect.disabled = false;
    const inputsTexts = document.querySelectorAll('input[type="text"]');
    inputsTexts.forEach((item) => {
      item.disabled = false;
    });
    
    localStorage.clear();
    this.deleteCookie();
    count = 0;
  }

  changePercent() {
    const valueSelect = this.value;
    if (valueSelect === 'other') {
      depositPercent.style.display = 'inline-block';
      depositPercent.addEventListener('input', () => {
        buttonCount.disabled = false;
      }); 

    } else {
      depositPercent.style.display = 'none';
      depositPercent.value = valueSelect;
    }
  }

  depositHandler() {
    if (checkBoxDeposit.checked) {
      depositBank.style.display = 'inline-block';
      depositAmount.style.display = 'inline-block';
      this.deposit = true;
      depositBank.addEventListener('change', this.changePercent);
    } else {
      depositBank.style.display = 'none';
      depositAmount.style.display = 'none';
      depositBank.value = '';
      depositAmount.value = '';
      this.deposit = false;
      depositBank.removeEventListener('change', this.changePercent);
    }
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
    
    buttonCount.addEventListener('click', () => {
      if (!this.deposit) {
        this.start();
      } else {
        if (+depositPercent.value < 0 || +depositPercent.value > 100 || isNaN(+depositPercent.value)) {
          alert('Введите корректное значение в поле проценты от 0 до 100');
          buttonCount.disabled = true;
        } else {
          buttonCount.disabled = false;
          this.start();
        }
      }
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

    checkBoxDeposit.addEventListener('change', this.depositHandler.bind(this));

    this.activeInputs().forEach(item => {
      item.addEventListener('input', () =>{
        this.leftSide();
      });
    })
  }

  activeInputs() {
    let inputsText = document.querySelectorAll('input');
    let activeInputs = [];
    inputsText.forEach(item => {
      if (item.disabled === false && !item.classList.contains('period-select')) {
        activeInputs.push(item);
      }
    });
    return activeInputs;
  }
  
  setCookie(key, value, year, month, day, path, domain, secure) {
    let cookieStr = key + '=' + value;
    if (year) {
      const expires = new Date(year, month-1, day);
      cookieStr += '; expires=' + expires.toGMTString();
    }
    
    cookieStr += path ? '; path=' + path : '';
    cookieStr += domain ? '; domain=' + domain : '';
    cookieStr += secure ? '; secure' : '';

    document.cookie = cookieStr;
  }

  сookieGo(obj) {
    for (let key in obj) {
      this.setCookie(key, obj[key], 2022, 5, 5);
    }
  }

  deleteCookie() {
    let data = Object.assign({}, this);
    data.targetMonthValue = targetMonthValue.value;
    data.incomePeriodValue = incomePeriodValue.value;
    data.periodAmountText = periodAmount.textContent;
    data.periodSelectValue = periodSelect.value;
    for (let key in data) {
      this.setCookie(key, '', -1, -1, -1)
    }
    this.setCookie('isLoad', '', -1, -1, -1);
  }

  checkCookie() {
    let cookie = document.cookie;
    let flag = true;
    let dataLocalStorage = this.getLocalStorageRightSide();
    if (cookie) {
      Object.keys(dataLocalStorage).forEach(item => {
        if (cookie.indexOf(item) === -1) {
          flag = false
      }
    })
    }
    
    return flag
  };

  setLocalStorageRightSide() {
    let data = Object.assign({}, this);
    data.targetMonthValue = targetMonthValue.value;
    data.incomePeriodValue = incomePeriodValue.value;
    data.periodAmountText = periodAmount.textContent;
    data.periodSelectValue = periodSelect.value;
    this.сookieGo(data);
    let jsonArr = JSON.stringify(data);
    localStorage.setItem('rightSide', jsonArr);
  }

  getLocalStorageRightSide() {
    let storage = localStorage.getItem('rightSide');
    let arr = JSON.parse(storage);
    Object.assign(this, arr);
    return arr;
  }

  renderRightSide() {
    let data = this.getLocalStorageRightSide();
    budgetMonthValue.value = data.budgetMonth;
    budgetDayValue.value = data.budgetDay;
    expensesMonthValue.value = data.expensesMonth;
    additionalExpensesValue.value = data.addExpenses.join(', ');
    additionalIncomeValue.value = data.addIncome.join(', ');
    targetMonthValue.value = data.targetMonthValue;
    incomePeriodValue.value = data.incomePeriodValue;
    periodAmount.textContent = data.periodAmountText;
    periodSelect.value = data.periodSelectValue;
    periodSelect.disabled = true;
    this.blocked();
  }

  leftSide() {
    let obj = {};
    this.activeInputs().forEach((item, i, arr) => {
      obj[item.className] = item.value;
    });
    let countOfIncome = document.querySelectorAll('.income>div').length;
    obj['countOfIncome'] = countOfIncome - 1;
    let countOfExpense = document.querySelectorAll('.expenses>div').length;
    obj['countOfExpense'] = countOfExpense - 1;
    let checkBox = checkBoxDeposit.checked;
    obj['checkBox'] = checkBox;
    let depositValue = depositBank.selectedIndex;
    obj['depositValue'] = depositValue;
    let jsonArr = JSON.stringify(obj);
    localStorage.setItem('leftSide', jsonArr);
  }

  getLocalStorageLeft() {
    let storage = localStorage.getItem('leftSide');
    let arr = JSON.parse(storage);
    return arr;
  }

  renderLeftSide() {
    let data2 = this.getLocalStorageLeft();
    if (data2['countOfIncome'] === 2) {
      this.addExpIncBlock(incomeItems, buttonPlusIncome, '.income-items');
    } else if (data2['countOfIncome'] === 3) {
      this.addExpIncBlock(incomeItems, buttonPlusIncome, '.income-items');
      this.addExpIncBlock(incomeItems, buttonPlusIncome, '.income-items');
    }

    if (data2['countOfExpense'] === 2) {
      this.addExpIncBlock(expensesItems, buttonPlusExpenses, '.expenses-items')
    } else if (data2['countOfExpense'] === 3) {
      this.addExpIncBlock(expensesItems, buttonPlusExpenses, '.expenses-items')
      this.addExpIncBlock(expensesItems, buttonPlusExpenses, '.expenses-items')
    }

    if (data2['checkBox']) {
      checkBoxDeposit.checked = true;
      this.depositHandler();
      for (let i = 0; i < depositBank.length; i++) {
        if(i === data2['depositValue']) {
          depositBank[i].selected = true;
        }
        if (data2['depositValue'] === 6) {
          depositPercent.style.display = 'inline-block';
        }
      }
    }

    let data3 = this.activeInputs();
    for (let i = 0; i < data3.length; i++) {
      for (let key in data2) {
        if (data3[i].className === key) {
          data3[i].value = data2[key];
          break;
        }
      }
    }
    buttonCount.disabled = false;
  }
}

const appData = new AppData();
appData.eventsListeners();

if (appData.checkCookie()) {
  if (localStorage.getItem('rightSide') !== null) {
    appData.renderLeftSide();
    appData.renderRightSide();
  } else if (localStorage.getItem('leftSide') !== null) {
    appData.renderLeftSide();
  }
} else {
  appData.deleteCookie();
  appData.reset();
}
