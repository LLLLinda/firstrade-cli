# Firstrade CLI tool

### An unofficial CLI tool for Firstrade

An unofficial CLI tool for Firstrade. The CLI manages your stocks on Firstrade.

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage percentage][coveralls-image]][coveralls-url]


> DISCLAIMER: We disclaim any and all responsibility for losses incurred through the use of this information. By using this information, you are deemed to have accepted these conditions of use, and you agree NOT to sue us.
>
> CLARIFICATION: The above disclaimer states as plainly as possible that if you decide to make use of any of the information contained within this document that you do so at your own risk.

## Installation and Usage

To get a global install of the latest CLI release:

```sh
npm install -g firstrade-cli
```

Then the following commands can be run globally:

* firstrade

```

usage: firstrade [command]

command:
    login
    getBalance
    getTradeHistory
    getPosition
    getSessionTimeLeft


argument:
    --username=username             (required)
    --password=password             (required)
    --pin=pin                       (required)
    --cookies=cookies               (optional)
  
```

* firstrade login
  1. You can save the generated cookies for short-term use
  2. then run other commands that require authorization with the option to use cookies instead of account logins.
* firstrade getBalance
* firstrade getTradeHistory
* firstrade getPosition
* firstrade getSessionTimeLeft

## Debugging

To debug an invocation of the CLI, build and install the CLI, then run the desired `firstrade` command as:

```shell
node --inspect-brk node_modules/.bin/firstrade ...
```

This will trigger a breakpoint as the CLI starts up. You can connect to this using the supported mechanisms for your IDE, but the simplest option is to open Chrome to chrome://inspect and then click on the `inspect` link for the `node_modules/.bin/firstrade` Node target.

## Testing

1. Create your environment file from the template
2. Run: `npm test`

## License

Apache-2.0

[npm-image]: https://badge.fury.io/js/firstrade-cli.svg
[npm-url]: https://npmjs.org/package/firstrade-cli
[travis-image]: https://travis-ci.com/LLLLinda/firstrade-cli.svg
[travis-url]: https://travis-ci.com/github/LLLLinda/firstrade-cli
[coveralls-image]: https://coveralls.io/repos/github/LLLLinda/firstrade-cli/badge.svg
[coveralls-url]: https://coveralls.io/github/LLLLinda/firstrade-cli
