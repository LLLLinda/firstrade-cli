
declare class Firstrade {
    login(credential: Firstrade.Credential): Promise<Firstrade.Cookie | Firstrade.LoginReason>
    getBalance(credential: Firstrade.Credential): Promise<Firstrade.Balance>
    getTradeHistory(credential: Firstrade.Credential): Promise<Firstrade.TradeRecord[]>
    getPosition(credential: Firstrade.Credential): Promise<Firstrade.Position[]>
    crawlTradeHistory(credential: Firstrade.Credential): Promise<Firstrade.DetailedTradeRecord[]>
    crawlPosition(credential: Firstrade.Credential): Promise<Firstrade.DetailedPosition[]>
    placeOrder(params: Firstrade.Credential & Firstrade.Order): Promise<void>
}
declare namespace Firstrade {
    type Cookie = {
        name: string
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
    } | Cookie[];
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
    type DetailedTradeRecord = {
        date: Date
        transaction: string | "DEPOSIT" | "Bought"
        quantity: number
        description: string
        symbol: string
        acctType: string
        price: number
        amount: number
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
    type DetailedPosition = {
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