# Firstrade CLI tool

###### An unofficial CLI tool for Firstrade

## The Goal of Firstrade CLI

The CLI operates your Firstrade account.

## Installation

To get a global install of the latest CLI release:

```shell
npm install -g firstrade
```

## Usage

* firstrade login
  1. You can save the generated cookies for short-term use(a json composed of cookies and origins),
  2. then run other commands that require authorization with the option to use cookies instead of account logins.
* firstrade getBalance
* firstrade getTradeHistory
* firstrade getPosition

## Debugging

To debug an invocation of the CLI, build and install the CLI, then run the desired `firstrade` command as:

```shell
node --inspect-brk node_modules/.bin/firstrade ...
```

This will trigger a breakpoint as the CLI starts up. You can connect to this using the supported mechanisms for your IDE, but the simplest option is to open Chrome to chrome://inspect and then click on the `inspect` link for the `node_modules/.bin/firstrade` Node target.

## Testing

* Run: `npm test`

---

## Notes

1. Run: `npx firstrade -- login --username=... --password=... --pin=... > profile.json`
2. Run: `npx playwright codegen --load-storage=profile.json https://invest.firstrade.com/cgi-bin/main#/cgi-bin/home`
