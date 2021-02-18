'use strict';

(() => {
    const xml2js = require('xml2js');
    const axios = require('axios');
    const qs = require('qs');
    const { URL, HEADERS, DATA } = require("./const");
    const axiosCookieJarSupport = require('axios-cookiejar-support').default;
    axiosCookieJarSupport(axios);
    module.exports = class Firstrade {
        login = async (credential) => await exchangeCredential(credential)
        getBalance = async (credential) => {
            let cookies = await renewCookies(credential);
            const res = await getCurrentXml(cookies, "page=bal")
            if (!res.response.balances)
                return []
            const balance = res.response.balances[0]
            return {
                totalValue: parseMoney(balance.total_value[0]),
                buyingpower: parseMoney(balance.buyingpower[0]),
                cashBuyingpower: parseMoney(balance.cash_buyingpower[0]),
                settledFunds: parseMoney(balance.settled_funds[0]),
                nonMarginFunds: parseMoney(balance.non_margin_funds[0]),
                totalAccountValue: parseMoney(balance.total_account_value[0]),
                totalNetchangeValue: parseMoney(balance.total_netchange_value[0]),
                totalNetchangePercentValue: parseMoney(balance.total_netchange_percent_value[0]),
                cashMoneyLock: parseMoney(balance.cash_money_lock[0]),
                cashBalance: parseMoney(balance.cash_balance[0]),
                moneyMarketFund: parseMoney(balance.money_market_fund[0]),
            }
        }
        getTradeHistory = async (credential) => {
            let cookies = await renewCookies(credential);
            const res = await getCurrentXml(cookies)
            if (!res.response.orderstatus)
                return []
            return res.response.orderstatus.map(record => ({
                transaction: record.trantype[0],
                quantity: parseMoney(record.quantity[0]),
                duration: record.duration[0],
                status: record.status[0],
                statusCode: record.status_code[0],
                price: parseMoney(record.price[0]),
            }))
        }
        getPosition = async (credential) => {
            let cookies = await renewCookies(credential);
            const res = await getCurrentXml(cookies, "page=pos")
            if (!res.response.position)
                return []
            return res.response.position.map(record => ({
                symbol: record.symbol[0],
                quantity: parseMoney(record.quantity[0]),
                price: parseMoney(record.price[0]),
                color: record.color[0],
                change: parseMoney(record.change[0]),
                changepercent: parseMoney(record.changepercent[0]),
                vol: parseMoney(record.vol[0]),
                type: record.type[0],
            }))
        }
    }

    /** @param {Object[]} cookies @returns {Promise<{response:{balances:{[key:string]:string[]}[], orderstatus, position, watchlist, list, timestamp}}>}**/
    async function getCurrentXml(cookies, data = DATA.xmlApi()) {
        const cookieStr = cookies.map(cookie => `${cookie.key}=${cookie.value};`);
        const config = {
            method: 'post',
            url: URL.xmlApi,
            headers: HEADERS.xmlApi(cookieStr.join(' ')),
            data,
            withCredentials: true,
        };
        const req = await axios(config)
        return await parseXml(req.data);
    }

    /**  @param {*} credential @returns {Promise<Object[]>}*/
    async function exchangeCredential(credential) {
        const loginReq = await sendLoginRequest(credential);
        const request = await sendEnterPinRequest(credential, loginReq.config.jar);
        return removeExcess(request.config.jar.store.idx["invest.firstrade.com"]["/"])
    }

    async function parseXml(res) {
        const xmlParser = new xml2js.Parser();
        const ret = await new Promise((resolve, reject) => xmlParser.parseString(res, function (err, res) {
            if (err)
                reject(err);
            else
                resolve(res);
        }));
        return ret;
    }

    async function renewCookies(credential) {
        let ret;
        if (isStoredSession(credential))
            ret = credential;
        else
            ret = await exchangeCredential(credential)
        return ret;
    }

    /** @returns {axios.AxiosInstance | string}     */
    async function sendLoginRequest(credential) {
        const config = {
            method: 'post',
            url: URL.loginApi,
            headers: HEADERS.loginApi(),
            data: DATA.loginApi(credential),
            jar: true,
            withCredentials: true,
        };
        const req = await axios(config);
        const hasError = isAuthError(req);
        if (hasError.result)
            throw hasError
        if (req.config.url != URL.enterPinApi)
            throw 'unknown';
        return req;
    }

    async function sendEnterPinRequest(credential, cookieJar) {
        const config = {
            method: 'post',
            url: URL.enterPinApi,
            headers: HEADERS.enterPinApi(),
            data: qs.stringify(DATA.enterPinApi(credential)),
            withCredentials: true,
            jar: cookieJar,
        };
        return await axios(config);
    }

})();

function removeExcess(cookies) {
    return Object.values(cookies).map(cookie => ({ key: cookie.key, value: cookie.value }));
}

/** @returns {{result: false|1|2|3|4|5|6, desc}} */
function isAuthError(req) {
    const re = /<script>window.location = \"\/cgi-bin\/login\?reason=([0-9])\"<\/script>/g;
    const responseText = req.data;
    const ret = re.test(responseText);
    if (!ret)
        return { result: ret }
    const failedReason = parseInt(/[0-9]/.exec(responseText)[0]);
    return {
        result: failedReason + 1, desc: ["This user has logged in from another computer",
            "Session has timed out",
            "Trader has already been disabled",
            "Trader Id invalid",
            "Please login first",
            "Trader data not complete, please try later",
            "Invalid session. Please log in again."][failedReason]
    }
}

function parseBoolean(string) {
    return string != null ? string === 'true' : false;
}

function isStoredSession(credential) {
    return credential.length > 0 && credential[0].hasOwnProperty("key") && credential[0].hasOwnProperty("value")
}

function parseMoney(value) {
    if (null == value)
        return undefined
    return parseFloat(value.replace(/\$/, '').replace(/,/, '')) || 0;
}

