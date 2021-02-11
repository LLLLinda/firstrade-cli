'use strict'
const { chromium } = require('playwright');
const xml2js = require('xml2js');
const { browserOptions, PAGE, PIN_NUMBER } = require("./const");
const browserOptions = {
    headless: process.env.DEV_HEADLESS_BROWSER != null ? process.env.DEV_HEADLESS_BROWSER === 'true' : true
};
module.exports = class Firstrade {
    /** @param {{username,password,pin:number[]}} credential **/
    login = async (credential) => {
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
        return storage
    }

    /** @param {{username,password,pin:number[]}} credential **/
    getBalance = async (credential) => {
        const storageState = await this.login(credential)
        const browser = await chromium.launch(browserOptions);
        const context = await browser.newContext({ storageState });
        const page = await context.newPage();
        let [_, ret] = await Promise.all([page.goto(PAGE.accountBalancePage), this.getCurrentXml(page)]);
        await page.close();
        await context.close();
        await browser.close();
        return ret
    }


    /** @param {Page} page **/
    getCurrentXml = async (page) => {
        var xmlParser = new xml2js.Parser();
        const xmlRes = await page.waitForResponse(response => response.url() == "https://invest.firstrade.com/cgi-bin/getxml" && response.status() === 200);
        const res = await xmlRes.text();
        const ret = await new Promise((resolve, reject) =>
            xmlParser.parseString(res, function (err, res) {
                if (err)
                    reject(err);
                else
                    resolve(res);
            })
        );
        return ret;
    }
}