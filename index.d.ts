
declare class Firstrade {
    async login(credential: Firstrade.Credential): Firstrade.StorageSnapshot
    async getBalance(credential: Firstrade.Credential): Firstrade.Balance
    async getTradeHistory(credential: Firstrade.Credential): Firstrade.TradeRecord[]
}
declare namespace Firstrade {
    type StorageSnapshot = {
        cookies: Object[];
        origins: Object[];
    };
    type Credential = {
        username: string;
        password: string;
        pin: string;
    } | StorageSnapshot;
    type Balance = {
        totalValue: number;
        buyingPower: number;
        cashBuyingPower: number;
        settledFunds: number;
        nonMarginFunds: number;
        totalAccountValue: number;
        totalNetchangeValue: number;
        cashMoneyLock: number;
        cashBalance: number;
        moneyMarketFund: number;
    }
    type TradeRecord = {
        date: Date
        transaction: string | "DEPOSIT"
        quantity: string
        description: string
        symbol: string
        acctType: string
        price: number
        amount: number
    }
}

export = Firstrade;