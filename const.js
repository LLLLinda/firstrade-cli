'use strict';
const accountBalancePage = 'https://invest.firstrade.com/cgi-bin/main#/cgi-bin/acctbalance';
const loginPage = 'https://invest.firstrade.com/cgi-bin/login';
const PIN_NUMBER = ['zero', 'one', 'two', 'three', 'four',
    'five', 'six', 'seven', 'eight', 'nine'];
exports.PIN_NUMBER = PIN_NUMBER;
exports.browserOptions = browserOptions;
exports.PAGE = { loginPage, accountBalancePage };
