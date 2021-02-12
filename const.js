'use strict';
const accountBalancePage = 'https://invest.firstrade.com/cgi-bin/main#/cgi-bin/acctbalance';
const loginPage = 'https://invest.firstrade.com/cgi-bin/login';
const historyPage = 'https://invest.firstrade.com/cgi-bin/main#/content/myaccount/history'
const positionPage = 'https://invest.firstrade.com/cgi-bin/main#/cgi-bin/acctpositions_trading'
const XmlApi = "https://invest.firstrade.com/cgi-bin/getxml";
const PIN_NUMBER = ['zero', 'one', 'two', 'three', 'four',
    'five', 'six', 'seven', 'eight', 'nine'];
exports.PIN_NUMBER = PIN_NUMBER;
exports.PAGE = { loginPage, accountBalancePage, historyPage, positionPage, XmlApi };
