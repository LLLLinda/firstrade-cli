'use strict';
(() => {
    const fetch = require("node-fetch");
    const { chromium } = require('playwright');
    const xml2js = require('xml2js');
    const { PAGE, PIN_NUMBER } = require("./const");
    const browserOptions = {
        headless: process.env.DEV_HEADLESS_BROWSER == null ? true : parseBoolean(process.env.DEV_HEADLESS_BROWSER)
    };
    module.exports = class Firstrade {
        /** @param {{username,password,pin:number[]}} credential **/
        login = async (credential) => {
            const storage = await exchangeCredential(credential);
            return storage
        }

        placeOrder = async (params) => {
            let credential
            if (isStoredSession(params))
                credential = {
                    cookies: params.cookies,
                    origins: params.origins
                }
            else
                credential = {
                    username: params.username,
                    password: params.password,
                    pin: params.pin,
                }
            const order = {
                symbol: params.symbol,
                quantity: params.quantity,
                price: params.price
            }
            await placeOrder(credential, order);
        }

        /** @param {{username,password,pin:number[]}} credential **/
        getBalance = async (credential) => {
            let cookie = credential.cookies
            if (!isStoredSession(credential))
                cookie = (await exchangeCredential(credential)).cookies
            const res = await getCurrentXml(cookie)
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
            const { page, context, browser } = await open(credential);
            let [_, res] = await Promise.all([page.goto(PAGE.historyPage), getAccountHistory(page)]);
            await close(page, context, browser);
            return res.aaData.filter(x => x.length > 7).map(record => ({
                date: new Date(record[0]),
                transaction: record[1],
                quantity: record[2],
                description: record[3],
                symbol: record[4],
                acctType: record[5],
                price: parseMoney(record[6]),
                amount: parseMoney(record[7]),
            }))
        }

        getPosition = async (credential) => {
            const { page, context, browser } = await open(credential);
            await page.goto(PAGE.positionPage)
            const headerElementHandle = await page.$$("#positiontable > thead > tr > th > a")
            const cellElementHandle = await page.$$("#positiontable > tbody > tr > td")
            const res = await parseTable(headerElementHandle, cellElementHandle);
            await close(page, context, browser);
            return res;
        }

    }

    async function placeOrder(credential, order) {
        const { page, context, browser } = await open(credential);
        await page.goto(PAGE.accountBalancePage);
        await page.fill('input[name="quoteSymbol"]', order.symbol);
        await page.click('text="Go"');
        await page.click("#showpacel > div.top > div.right > a");
        if (order.price)
            await page.fill('input[name="limitPrice"]', order.price + '');
        else
            await page.click("#quotedata > table.odbq > tbody > tr.dat > td:nth-child(4) > a");
        await page.fill('input[name="quantity"]', order.quantity + '');
        await page.click('input[name="transactionType"]#transactionType_Buy');
        await page.click('text="Preview"');
        if (parseBoolean(process.env.DEV_FORBIT_TRADE)) {
            console.log("Interrupted Transactions")
            await close(page, context, browser);
            return
        }
        await page.click('div[id="previe_orderbar_main"] >> text="Send Order"');
        await close(page, context, browser);
    }

    async function close(page, context, browser) {
        await page.close();
        await context.close();
        await browser.close();
    }

    /** @param {Page} page @returns {{sEcho, iTotalRecords, iTotalDisplayRecords, aaData:Object[Object[]]]}} **/
    async function getAccountHistory(page) {
        const requestUrl = /https:\/\/invest.firstrade.com\/scripts\/achistory\/ac_io.php/g;
        const jsonRes = await page.waitForResponse(response => requestUrl.test(response.url()) && response.status() === 200);
        const ret = await jsonRes.text();
        return JSON.parse(ret || "{}");
    }

    /** @param {Object[]} cookies @returns {Promise<{response:{balances:{[key:string]:string[]}[], orderStatus, position, watchlist, list, timestamp}}>}**/
    async function getCurrentXml(cookies) {
        const cookieStr = cookies.map(cookie => `${cookie.name}=${cookie.value};`);
        const headers = new fetch.Headers();
        headers.append("Connection", "keep-alive");
        headers.append("Pragma", "no-cache");
        headers.append("Cache-Control", "no-cache");
        headers.append("Accept", "*/*");
        headers.append("X-Requested-With", "XMLHttpRequest");
        headers.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36");
        headers.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        headers.append("Origin", "https://invest.firstrade.com");
        headers.append("Sec-Fetch-Site", "same-origin");
        headers.append("Sec-Fetch-Mode", "cors");
        headers.append("Sec-Fetch-Dest", "empty");
        headers.append("Referer", "https://invest.firstrade.com/cgi-bin/main");
        headers.append("Accept-Language", "en,ja;q=0.9,en-US;q=0.8,zh-CN;q=0.7,zh;q=0.6,zh-TW;q=0.5");
        headers.append("Cookie", cookieStr.join(' '));
        headers.append("Content-Type", "text/plain");
        const body = "page=bal,pos,watchlist,all";
        const requestOptions = {
            method: 'POST',
            headers,
            body,
            redirect: 'follow'
        };
        const requestResponse = await fetch(PAGE.XmlApi, requestOptions)
        const respondBody = await requestResponse.text();
        const ret = await parseXml(respondBody);
        return ret;
    }

    async function open(credential) {
        const storageState = await exchangeCredential(credential);
        return await initPage({ storageState })
    }

    async function initPage(browserContextOptions = null) {
        const browser = await chromium.launch(browserOptions);
        const context = await browser.newContext(browserContextOptions || {});
        const page = await context.newPage();
        page.route('**/*.{png,jpg,jpeg,svg,gif,woff2}', route => route.abort());
        return { page, context, browser };
    }

    /**  @param {*} credential @returns {Promise<{cookies, origins}>}*/
    async function exchangeCredential(credential) {
        if (isStoredSession(credential))
            return credential
        const { page, context, browser } = await initPage();
        await page.goto(PAGE.loginPage);
        await page.fill('input[name="username"]', credential.username || process.env.FIRSTRADE_USERNAME);
        await page.fill('input[name="password"]', credential.password || process.env.FIRSTRADE_PASSWORD);
        await page.click('input[type="submit"]');
        for (let num of (credential.pin || process.env.FIRSTRADE_PIN))
            await page.click(`div[id="${PIN_NUMBER[num]}"]`);
        await page.click('div[id="submit"]');
        // Save storage state and store as an env variable
        const storage = await context.storageState();
        process.env.STORAGE = JSON.stringify(storage);
        await page.close();
        await context.close();
        await browser.close();
        return storage;
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
    
    async function parseTable(headerElementHandle, cellElementHandle) {
        const ret = [];
        const headers = [];
        for (let elementHandle of headerElementHandle) {
            const innerHTML = await elementHandle.innerText();
            headers.push(innerHTML);
        }
        for (let [i, elementHandle] of cellElementHandle.entries()) {
            const stockID = Math.floor(i / headers.length);
            const header = headers[i % headers.length].toLowerCase();
            ret[stockID] = ret[stockID] || {};
            switch (header) {
                case "symbol":
                    ret[stockID][header] = await (await elementHandle.$("a")).innerText();
                    break;
                case "":
                    break;
                default:
                    ret[stockID][header] = parseMoney(await elementHandle.innerText());
                    break;
            }
        }
        return ret;
    }
})();

function parseBoolean(string) {
    return string != null ? string === 'true' : false;
}

function isStoredSession(credential) {
    return credential.hasOwnProperty("cookies") && credential.hasOwnProperty("origins");
}

function parseMoney(value) {
    if (null == value)
        return undefined
    return parseFloat(value.replace(/\$/, '').replace(/,/, '')) || 0;
}

