
declare class Firstrade {
    async login(credential: Firstrade.Credential): boolean
    async getBalance(credential: Firstrade.Credential): Firstrade.Balance
}
declare namespace Firstrade {
    type Credential = {
        username: string;
        password: string;
        pin: string;
    };
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
}

export = Firstrade;