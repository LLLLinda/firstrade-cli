'use strict';
(() => {
    const { chromium } = require('playwright');
    const xml2js = require('xml2js');
    const { PAGE, PIN_NUMBER } = require("./const");
    const browserOptions = {
        headless: process.env.DEV_HEADLESS_BROWSER != null ? process.env.DEV_HEADLESS_BROWSER === 'true' : true
    };
    module.exports = class Firstrade {
        /** @param {{username,password,pin:number[]}} credential **/
        login = async (credential) => {
            const storage = await exchangeCredential(credential);
            return storage
        }

        /** @param {{username,password,pin:number[]}} credential **/
        getBalance = async (credential) => {
            const { page, context, browser } = await open(credential);
            let [_, res] = await Promise.all([page.goto(PAGE.accountBalancePage), getCurrentXml(page)]);
            await close(page, context, browser);
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

    /** @param {Page} page  @returns {{response:{balances:{[key:string]:string[]}[], timestamp}}}**/
    async function getCurrentXml(page) {
        const requestUrl = "https://invest.firstrade.com/cgi-bin/getxml";
        const requestResponse = await page.waitForResponse(response => response.url() == requestUrl && response.status() === 200);
        const requestBody = await requestResponse.text();
        const res = await parseXml(requestBody);
        return res;
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

    async function exchangeCredential(credential) {
        if (credential.hasOwnProperty("cookies") && credential.hasOwnProperty("origins"))
            return credential
        const { page, context, browser } = await initPage();
        await page.goto(PAGE.loginPage);
        await page.click('input[name="username"]');
        await page.fill('input[name="username"]', credential.username || process.env.FIRSTRADE_USERNAME);
        await page.click('input[name="password"]');
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

function parseMoney(value) {
    if (null == value)
        return undefined
    return parseFloat(value.replace(/\$/, '').replace(/,/, '')) || 0;
}

