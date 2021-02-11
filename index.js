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
            let [_, ret] = await Promise.all([page.goto(PAGE.accountBalancePage), getCurrentXml(page)]);
            await this.close(page, context, browser);
            return ret
        }

        getTradeHistory = async (credential) => {
            const { page, context, browser } = await open(credential);
            let [_, ret] = await Promise.all([page.goto(PAGE.historyPage), getAccountHistory(page)]);
            await this.close(page, context, browser);
            return ret
        }


        async close(page, context, browser) {
            await page.close();
            await context.close();
            await browser.close();
        }
    }

    /** @param {Page} page **/
    async function getAccountHistory(page) {
        const requestUrl = /https:\/\/invest.firstrade.com\/scripts\/achistory\/ac_io.php/g;
        const jsonRes = await page.waitForResponse(response => requestUrl.test(response.url()) && response.status() === 200);
        return await jsonRes.text();
    }

    /** @param {Page} page **/
    async function getCurrentXml(page) {
        const requestUrl = "https://invest.firstrade.com/cgi-bin/getxml";
        const xmlRes = await page.waitForResponse(response => response.url() == requestUrl && response.status() === 200);
        const res = await xmlRes.text();
        return await parseXml(res);
    }

    async function open(credential) {
        const storageState = await exchangeCredential(credential);
        const browser = await chromium.launch(browserOptions);
        const context = await browser.newContext({ storageState });
        const page = await context.newPage();
        return { page, context, browser };
    }

    async function exchangeCredential(credential) {
        if (credential.hasOwnProperty("cookies") && credential.hasOwnProperty("origins"))
            return credential
        const browser = await chromium.launch(browserOptions);
        const context = await browser.newContext();
        const page = await context.newPage();
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

})();
