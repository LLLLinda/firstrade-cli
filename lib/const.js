"use strict";
const { stringifyCookies } = require("./utils");

exports.URL = {
  xmlApi: "https://invest.firstrade.com/cgi-bin/getxml",
  loginApi: "https://invest.firstrade.com/cgi-bin/login",
  enterPinApi: "https://invest.firstrade.com/cgi-bin/enter_pin",
  getTimeLeftApi: 'https://invest.firstrade.com/scripts/util/get_tm_left.php',
  getTotalValueApi: 'https://invest.firstrade.com/scripts/charts/tvs.php'
};

exports.DATA = {
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

exports.HEADERS = {
  xmlApi: cookies => ({
    Connection: "keep-alive",
    "sec-ch-ua":
      '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
    Accept: "*/*",
    "X-Requested-With": "XMLHttpRequest",
    "sec-ch-ua-mobile": "?0",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    Origin: "https://invest.firstrade.com",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Dest": "empty",
    Referer: "https://invest.firstrade.com/cgi-bin/main",
    "Accept-Language":
      "en-GB,en-US;q=0.9,en;q=0.8,zh-TW;q=0.7,zh;q=0.6,es;q=0.5",
    Cookie: stringifyCookies(cookies)
  }),
  loginApi: () => ({
    Connection: "keep-alive",
    "Cache-Control": "max-age=0",
    "sec-ch-ua":
      '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "Upgrade-Insecure-Requests": "1",
    Origin: "https://www.firstrade.com",
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "Sec-Fetch-Site": "same-site",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-User": "?1",
    "Sec-Fetch-Dest": "document",
    Referer: "https://www.firstrade.com/",
    "Accept-Language":
      "en-GB,en-US;q=0.9,en;q=0.8,zh-TW;q=0.7,zh;q=0.6,es;q=0.5"
  }),
  enterPinApi: () => ({
    Connection: "keep-alive",
    "Cache-Control": "max-age=0",
    "sec-ch-ua":
      '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "Upgrade-Insecure-Requests": "1",
    Origin: "https://invest.firstrade.com",
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-User": "?1",
    "Sec-Fetch-Dest": "document",
    Referer: "https://invest.firstrade.com/cgi-bin/enter_pin",
    "Accept-Language":
      "en-GB,en-US;q=0.9,en;q=0.8,zh-TW;q=0.7,zh;q=0.6,es;q=0.5"
  }),
  getTotalValueApi: cookies => ({
    'Connection': 'keep-alive',
    'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'X-Requested-With': 'XMLHttpRequest',
    'sec-ch-ua-mobile': '?0',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Origin': 'https://invest.firstrade.com',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Referer': 'https://invest.firstrade.com/cgi-bin/main',
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,zh-TW;q=0.7,zh;q=0.6,es;q=0.5',
    Cookie: stringifyCookies(cookies)
  }),
  getTimeLeftApi: cookies => ({
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0',
    'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-User': '?1',
    'Sec-Fetch-Dest': 'document',
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,zh-TW;q=0.7,zh;q=0.6,es;q=0.5',
    Cookie: stringifyCookies(cookies)
  })
};