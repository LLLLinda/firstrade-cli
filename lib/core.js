"use strict";
const xml2js = require("xml2js");
const axios = require("axios");
const qs = require("qs");
const { isAuthError, isCookies, removeExcess, isCredential } = require("./utils.js");
const { URL, HEADERS, DATA } = require("./const");
const axiosCookieJarSupport = require("axios-cookiejar-support").default;
axiosCookieJarSupport(axios);

/** @param {Object[]} cookies @returns {Promise<{response:{balances:{[key:string]:string[]}[], orderstatus, position, watchlist, list, timestamp}}>}**/
async function getCurrentXml(cookies, data = DATA.xmlApi()) {
  const config = {
    method: "post",
    url: URL.xmlApi,
    headers: HEADERS.xmlApi(cookies),
    data,
    withCredentials: true
  };
  const req = await axios(config);
  return parseXml(req.data);
}

/**  @param {*} credential @returns {Promise<Object[]>} */
async function exchangeCredential(credential) {
  const loginReq = await sendLoginRequest(credential);
  const request = await sendEnterPinRequest(credential, loginReq.config.jar);
  return removeExcess(
    request.config.jar.store.idx["invest.firstrade.com"]["/"]
  );
}

async function parseXml(res) {
  const xmlParser = new xml2js.Parser();
  const ret = await new Promise((resolve, reject) =>
    xmlParser.parseString(res, function (err, res) {
      if (err) reject(err);
      else resolve(res);
    })
  );
  return ret;
}

/**  @param {Firstrade.Credential} credential @returns {Promise<Object[]>} */
async function renewCookies(credential) {
  let ret;
  let error = []
  if (Array.isArray(credential) && isCookies(credential))
    ret = credential;
  else if (credential.cookies != null)
    ret = JSON.parse(credential.cookies)
  else if (isCredential(credential))
    ret = await exchangeCredential(credential);
  else {
    error = ["username", "password", "pin"].filter(x => credential[x] == null)
    throw new Error(`The required parameters are not provided: ${error.join(", ")}`)
  }
  return ret;
}

/** @returns {Promise<axios.AxiosInstance>} @throws {"unknown"}    */
async function sendLoginRequest(credential) {
  const config = {
    method: "post",
    url: URL.loginApi,
    headers: HEADERS.loginApi(),
    data: qs.stringify(DATA.loginApi(credential)),
    jar: true,
    withCredentials: true
  };
  const req = await axios(config);
  const hasError = isAuthError(req);
  if (hasError.result) throw hasError;
  if (req.config.url !== URL.enterPinApi) throw new Error("unknown");
  return req;
}

async function sendEnterPinRequest(credential, cookieJar) {
  const config = {
    method: "post",
    url: URL.enterPinApi,
    headers: HEADERS.enterPinApi(),
    data: qs.stringify(DATA.enterPinApi(credential)),
    withCredentials: true,
    jar: cookieJar
  };
  return axios(config);
}

/** @param {Object[]} cookies @returns {Promise<axios.AxiosInstance<number | "">>} **/
async function getTimeLeft(cookies) {
  let config = {
    method: 'get',
    url: URL.getTimeLeftApi,
    withCredentials: true,
    headers: HEADERS.getTimeLeftApi(cookies)
  };
  return axios(config);
}

/** @param {Object[]} cookies @returns {Promise<axios.AxiosInstance<{rc:"OK"|"FAILED", msg, data}>>} **/
async function getContact(cookies) {
  let config = {
    method: 'post',
    url: URL.getContactApi,
    withCredentials: true,
    data: DATA.getContactApi(),
    headers: HEADERS.getContactApi(cookies)
  };
  return axios(config);
}

/** @param {Object[]} cookies @returns {Promise<axios.AxiosInstance<[number,number][]>>} **/
async function getTotalValue(cookies, accountID, duration) {
  const config = {
    method: "post",
    url: URL.getTotalValueApi,
    headers: HEADERS.getTotalValueApi(cookies),
    data: qs.stringify(DATA.getTotalValueApi(accountID, duration)),
    withCredentials: true
  };
  return axios(config);
}

module.exports = { exchangeCredential, getCurrentXml, renewCookies, getTimeLeft, getTotalValue, getContact };
