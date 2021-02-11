require('dotenv').config();

(async () => {
    'use strict'
    const Firstrade = require('./index.js')
    const firstrade = new Firstrade()

    console.log("login", "Should login and print session cookies")
    const loginRes = await firstrade.login({})
    console.log(JSON.stringify(loginRes))

    console.log("getBalance by credential", "Should print balance using previous session")
    const balanceRes = await firstrade.getBalance(loginRes)
    console.log(JSON.stringify(balanceRes))

    console.log("getTradeHistory by credential", "Should print history using previous session")
    const historyRes = await firstrade.getTradeHistory(loginRes)
    console.log(JSON.stringify(historyRes))

    console.log("getBalance by credential", "Should print balance after login")
    const balanceRes2 = await firstrade.getBalance({})
    console.log(JSON.stringify(balanceRes2))

    console.log("getTradeHistory", "Should print history after login")
    const historyRes2 = await firstrade.getTradeHistory({})
    console.log(JSON.stringify(historyRes2))

})();