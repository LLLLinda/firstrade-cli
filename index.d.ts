declare class Firstrade {
    login(credential: Firstrade.LoginContext): Promise<Firstrade.Cookie | Firstrade.LoginReason>
    getBalance(credential: Firstrade.LoginContext): Promise<Firstrade.Balance>
    getTradeHistory(credential: Firstrade.LoginContext): Promise<Firstrade.TradeRecord[]>
    getPosition(credential: Firstrade.LoginContext): Promise<Firstrade.Position[]>
    getSessionTimeLeft(credential: Firstrade.LoginContext): Promise<number>
    getContact(credential: Firstrade.LoginContext): Promise<Firstrade.Contact>
}
declare namespace Firstrade {
    export const firstrade: Firstrade

    export type Contact = {
        phoneNumbers: PhoneNumber[];
        mailing: Mailing;
        residential: Mailing;
        isForeign: boolean;
        bResidentAddress: string;
        dob: string;
        name: string;
        countries: Country[];
        isPrimary: boolean;
        accountType: string;
    }

    export type Cookie = {
        key: string
        value: string
    }
    export type Order = {
        symbol: string
        quantity: number
        price?: number
    }

    export type LoginContext = Credential | { cookies: Cookie[] };

    export type Balance = {
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
    export type TradeRecord = {
        transaction: string
        duration: string
        status: string
        statusCode: string
        quantity: number
        price: number
    }
    export type Position = {
        symbol: string
        quantity: number
        price: number
        color: string
        change: number
        changepercent: number
        vol: number
        type: string
    }
    export enum LoginReason {
        "This user has logged in from another computer",
        "Session has timed out",
        "Trader has already been disabled",
        "Trader Id invalid",
        "Please login first",
        "Trader data not complete, please try later",
        "Invalid session. Please log in again."
    }

    type Credential = {
        username: string;
        password: string;
        pin: string;
    };

    type PhoneNumber = {
        phoneNumber: string;
        phoneNumberType: string;
        extension?: any;
    };

    type Mailing = {
        streetAddress: string[];
        city: string;
        state?: any;
        postalCode?: any;
        country: string;
        alpha2: string;
        country_name: string;
    };

    type Country = {
        alpha3: string;
        label: string;
        name: string;
    };

}

export = Firstrade;