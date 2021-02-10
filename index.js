'use strict'
const { chromium } = require('playwright');
const PIN_NUMBER = ['zero', 'one', 'two', 'three', 'four',
    'five', 'six', 'seven', 'eight', 'nine'];
module.exports = class Firstrade {
    /** @param {{username,password,pin:number[]}} credential **/
    login = async (credential) => {
        const browser = await chromium.launch({
            headless: process.env.DEV_HEADLESS_BROWSER === 'true'
        });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('https://invest.firstrade.com/cgi-bin/login');
        await page.click('input[name="username"]');
        await page.fill('input[name="username"]', credential.username || process.env.FIRSTRADE_USERNAME);
        await page.click('input[name="password"]');
        await page.fill('input[name="password"]', credential.password || process.env.FIRSTRADE_PASSWORD);
        await page.click('input[type="submit"]');
        for (let num of (credential.pin || process.env.FIRSTRADE_PIN))
            await page.click(`div[id="${PIN_NUMBER[num]}"]`);
        await page.click('div[id="submit"]');
        const ret = await context.cookies()
        await page.close();
        await context.close();
        await browser.close();
        return ret
    }
}