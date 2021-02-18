(async () => {
    'use strict'
    require('dotenv').config();
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

    console.log("getPosition by credential", "Should print position using previous session")
    const positionRes = await firstrade.getPosition(loginRes)
    console.log(JSON.stringify(positionRes))

    console.log("getBalance by credential", "Should print balance after login")
    const balanceRes2 = await firstrade.getBalance({})
    console.log(JSON.stringify(balanceRes2))

    console.log("getTradeHistory", "Should print history after login")
    const historyRes2 = await firstrade.getTradeHistory({})
    console.log(JSON.stringify(historyRes2))

    console.log("getPosition", "Should print position after login")
    const positionRes2 = await firstrade.getPosition({})
    console.log(JSON.stringify(positionRes2))

    return 0
})();