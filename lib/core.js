"use strict";
const xml2js = require("xml2js");
const axios = require("axios");
const qs = require("qs");
const { isAuthError, isStoredSession, removeExcess } = require("./utils.js");
const { URL, HEADERS, DATA } = require("./const");
const axiosCookieJarSupport = require("axios-cookiejar-support").default;
axiosCookieJarSupport(axios);

/** @param {Object[]} cookies @returns {Promise<{response:{balances:{[key:string]:string[]}[], orderstatus, position, watchlist, list, timestamp}}>}**/
async function getCurrentXml(cookies, data = DATA.xmlApi()) {
  const cookieStr = cookies.map(cookie => `${cookie.key}=${cookie.value};`);
  const config = {
    method: "post",
    url: URL.xmlApi,
    headers: HEADERS.xmlApi(cookieStr.join(" ")),
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
    xmlParser.parseString(res, function(err, res) {
      if (err) reject(err);
      else resolve(res);
    })
  );
  return ret;
}

async function renewCookies(credential) {
  let ret;
  if (isStoredSession(credential)) ret = credential;
  else ret = await exchangeCredential(credential);
  return ret;
}

/** @returns {Promise<axios.AxiosInstance | string>}     */
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

module.exports = { exchangeCredential, getCurrentXml, renewCookies };
