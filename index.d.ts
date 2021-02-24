
declare class Firstrade {
    login(credential: Firstrade.Credential): Promise<Firstrade.Cookie | Firstrade.LoginReason>
    getBalance(credential: Firstrade.Credential): Promise<Firstrade.Balance>
    getTradeHistory(credential: Firstrade.Credential): Promise<Firstrade.TradeRecord[]>
    getPosition(credential: Firstrade.Credential): Promise<Firstrade.Position[]>
}
declare namespace Firstrade {
    type Cookie = {
        key: string
        value: string
    }
    type Order = {
        symbol: string
        quantity: number
        price?: number
    }
    type Credential = {
        username: string;
        password: string;
        pin: string;
    } | { cookies: Cookie[] };
    type Balance = {
        totalValue: number;
        buyingpower: number;
        cashBuyingpower: number;
        settledFunds: number;
        nonMarginFunds: number;
        totalAccountValue: number;
        totalNetchangeValue: number;
        totalNetchangePercentValue: number;
        cashMoneyLock: number;
        cashBalance: number;
        moneyMarketFund: number;
    }
    type TradeRecord = {
        transaction: string
        duration: string
        status: string
        statusCode: string
        quantity: number
        price: number
    }
    type Position = {
        symbol: string
        quantity: number
        price: number
        color: string
        change: number
        changepercent: number
        vol: number
        type: string
    }
    enum LoginReason {
        "This user has logged in from another computer",
        "Session has timed out",
        "Trader has already been disabled",
        "Trader Id invalid",
        "Please login first",
        "Trader data not complete, please try later",
        "Invalid session. Please log in again."
    }
}

export = Firstrade;