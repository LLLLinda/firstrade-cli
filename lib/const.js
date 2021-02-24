"use strict";
const { stringifyCookies } = require("./utils");

const URL = {
  home: "https://invest.firstrade.com/cgi-bin/main",
  xmlApi: "https://invest.firstrade.com/cgi-bin/getxml",
  loginApi: "https://invest.firstrade.com/cgi-bin/login",
  enterPinApi: "https://invest.firstrade.com/cgi-bin/enter_pin",
  getTimeLeftApi: 'https://invest.firstrade.com/scripts/util/get_tm_left.php',
  getTotalValueApi: 'https://invest.firstrade.com/scripts/charts/tvs.php'
};

const DATA = {
  xmlApi: () => "page=bal,pos,watchlist,all",
  loginApi: credential => ({
    "login.x": "Log+In",
    ft_locale: "en-us",
    username: credential.username,
    password: credential.password,
  }),
  enterPinApi: credential => ({
    destination_page: "",
    pin: credential.pin,
    "pin.x": "++OK++",
    sring: "0"
  }),
  /** @param {number} accountID @param {"1w"|"1m"|"3m"|"6m"|"1y"|"2y"} duration */
  getTotalValueApi: (accountID, duration) => ({ d: duration, a: accountID }),
};

const HEADERS = {
  xmlApi: cookies => ({
    Referer: URL.home,
    Cookie: stringifyCookies(cookies)
  }),
  loginApi: () => ({
    Referer: URL.loginApi
  }),
  enterPinApi: () => ({
    Referer: URL.enterPinApi,
  }),
  getTotalValueApi: cookies => ({
    'Referer': URL.home,
    Cookie: stringifyCookies(cookies)
  }),
  getTimeLeftApi: cookies => ({
    Cookie: stringifyCookies(cookies)
  })
};

module.exports = {
  URL,
  DATA,
  HEADERS,
}