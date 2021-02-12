# Firstrade CLI tool

### An unofficial CLI tool for Firstrade

The CLI operates your Firstrade account.

## Installation and Usage

To get a global install of the latest CLI release:

```shell
npm install -g firstrade
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
    placeOrder
    crawlPosition
    crawlTradeHistory

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
* firstrade crawlPosition
* firstrade crawlTradeHistory

## Debugging

To debug an invocation of the CLI, build and install the CLI, then run the desired `firstrade` command as:

```shell
node --inspect-brk node_modules/.bin/firstrade ...
```

This will trigger a breakpoint as the CLI starts up. You can connect to this using the supported mechanisms for your IDE, but the simplest option is to open Chrome to chrome://inspect and then click on the `inspect` link for the `node_modules/.bin/firstrade` Node target.

## Testing

1. Create your environment file from the template
1. Run: `npm test`
