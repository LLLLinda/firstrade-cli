require('dotenv').config();

(async () => {
    'use strict'
    const Firstrade = require('./index.js')
    const firstrade = new Firstrade()
    let result = await firstrade.getBalance({})
    console.log(result)
})();