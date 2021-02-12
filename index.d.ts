
declare class Firstrade {
    login(credential: Firstrade.Credential): Promise<Firstrade.StorageSnapshot | Firstrade.LoginReason>
    getBalance(credential: Firstrade.Credential): Promise<Firstrade.Balance>
    getTradeHistory(credential: Firstrade.Credential): Promise<Firstrade.TradeRecord[]>
    getPosition(credential: Firstrade.Credential): Promise<Firstrade.PositionRecord[]>
    placeOrder(params: Firstrade.Credential & Firstrade.Order): Promise<void>
}
declare namespace Firstrade {
    type StorageSnapshot = {
        cookies: Object[];
        origins: Object[];
    };
    type Order = {
        symbol: string
        quantity: number
        price?: number
    }
    type Credential = {
        username: string;
        password: string;
        pin: string;
    } | StorageSnapshot;
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
        date: Date
        transaction: string | "DEPOSIT" | "Bought"
        quantity: number
        description: string
        symbol: string
        acctType: string
        price: number
        amount: number
    }
    type PositionRecord = {
        symbol: string
        quantity: number
        last: number
        "change($)": number
        "change(%)": number
        "market value": number
        "unit cost": number
        "total cost": number
        "gain/loss($)": number
        "gain/loss(%)": number
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