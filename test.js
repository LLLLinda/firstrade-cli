require('dotenv').config();

(async () => {
    'use strict'
    const Firstrade = require('./index.js')
    const firstrade = new Firstrade()
    let result = await firstrade.login({})
    console.log(result)
})();