'use strict';
exports.URL = {
    xmlApi: "https://invest.firstrade.com/cgi-bin/getxml",
    loginApi: 'https://invest.firstrade.com/cgi-bin/login',
    enterPinApi: "https://invest.firstrade.com/cgi-bin/enter_pin"
};

exports.DATA = {
    xmlApi: () => "page=bal,pos,watchlist,all",
    loginApi: (credential) => ({
        'login.x': 'Log+In',
        'ft_locale': 'en-us',
        'username': credential.username || process.env.FIRSTRADE_USERNAME,
        'password': credential.password || process.env.FIRSTRADE_PASSWORD
    }),
    enterPinApi: (credential) => ({
        'destination_page': '',
        'pin': credential.pin || process.env.FIRSTRADE_PIN,
        'pin.x': '++OK++',
        'sring': '0',
        'pin': credential.pin || process.env.FIRSTRADE_PIN,
    })
}
exports.HEADERS = {
    xmlApi: cookies => ({
        'Connection': 'keep-alive',
        'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        'sec-ch-ua-mobile': '?0',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://invest.firstrade.com',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': 'https://invest.firstrade.com/cgi-bin/main',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,zh-TW;q=0.7,zh;q=0.6,es;q=0.5',
        'Cookie': cookies
    }),
    loginApi: () => ({
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'Upgrade-Insecure-Requests': '1',
        'Origin': 'https://www.firstrade.com',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Sec-Fetch-Site': 'same-site',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-User': '?1',
        'Sec-Fetch-Dest': 'document',
        'Referer': 'https://www.firstrade.com/',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,zh-TW;q=0.7,zh;q=0.6,es;q=0.5'
    }),
    enterPinApi: () => ({
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'Upgrade-Insecure-Requests': '1',
        'Origin': 'https://invest.firstrade.com',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-User': '?1',
        'Sec-Fetch-Dest': 'document',
        'Referer': 'https://invest.firstrade.com/cgi-bin/enter_pin',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,zh-TW;q=0.7,zh;q=0.6,es;q=0.5',
    })
};