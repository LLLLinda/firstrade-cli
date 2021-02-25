'use strict';
const { parseMoney } = require('./utils.js');
const { renewCookies, getCurrentXml, getTimeLeft } = require('./core');

class Firstrade {
  async login(credential) {
    return renewCookies(credential);
  }

  async getBalance(credential) {
    let cookies = await renewCookies(credential);
    const res = await getCurrentXml(cookies, 'page=bal');
    if (res.response == null || res.response.balances == null) return [];
    const balance = res.response.balances[0];
    return {
      totalValue: parseMoney(balance.total_value[0]),
      buyingpower: parseMoney(balance.buyingpower[0]),
      cashBuyingpower: parseMoney(balance.cash_buyingpower[0]),
      settledFunds: parseMoney(balance.settled_funds[0]),
      nonMarginFunds: parseMoney(balance.non_margin_funds[0]),
      totalAccountValue: parseMoney(balance.total_account_value[0]),
      totalNetchangeValue: parseMoney(balance.total_netchange_value[0]),
      totalNetchangePercentValue: parseMoney(balance.total_netchange_percent_value[0]),
      cashMoneyLock: parseMoney(balance.cash_money_lock[0]),
      cashBalance: parseMoney(balance.cash_balance[0]),
      moneyMarketFund: parseMoney(balance.money_market_fund[0])
    };
  }

  async getTradeHistory(credential) {
    let cookies = await renewCookies(credential);
    const res = await getCurrentXml(cookies);
    if (res.response == null || res.response.orderstatus == null) return [];
    return res.response.orderstatus.map(record => ({
      transaction: record.trantype[0],
      quantity: parseMoney(record.quantity[0]),
      duration: record.duration[0],
      status: record.status[0],
      statusCode: record.status_code[0],
      price: parseMoney(record.price[0])
    }));
  }

  async getPosition(credential) {
    let cookies = await renewCookies(credential);
    const res = await getCurrentXml(cookies, 'page=pos');
    if (res.response == null || res.response.position == null) return [];
    return res.response.position.map(record => ({
      symbol: record.symbol[0],
      quantity: parseMoney(record.quantity[0]),
      price: parseMoney(record.price[0]),
      color: record.color[0],
      change: parseMoney(record.change[0]),
      changepercent: parseMoney(record.changepercent[0]),
      vol: parseMoney(record.vol[0]),
      type: record.type[0]
    }));
  }

  async getSessionTimeLeft(credential) {
    let cookies = await renewCookies(credential);
    const res = await getTimeLeft(cookies)
    return res.data || 0
  }
}

const firstrade = new Firstrade();

module.exports = firstrade;