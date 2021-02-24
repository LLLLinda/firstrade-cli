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

const USER_AGENT = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36 Edge/12.246';
const HEADERS = {
  xmlApi: cookies => ({
    "User-Agent": USER_AGENT,
    Referer: URL.home,
    Cookie: stringifyCookies(cookies)
  }),
  loginApi: () => ({
    "User-Agent": USER_AGENT,
    Referer: URL.loginApi
  }),
  enterPinApi: () => ({
    "User-Agent": USER_AGENT,
    Referer: URL.enterPinApi,
  }),
  getTotalValueApi: cookies => ({
    'User-Agent': USER_AGENT,
    'Referer': URL.home,
    Cookie: stringifyCookies(cookies)
  }),
  getTimeLeftApi: cookies => ({
    'User-Agent': USER_AGENT,
    Cookie: stringifyCookies(cookies)
  })
};

module.exports = {
  URL,
  DATA,
  HEADERS,
}