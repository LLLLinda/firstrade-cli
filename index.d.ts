
declare class Firstrade {
    login(credential: Firstrade.Credential): boolean
}
declare namespace Firstrade {
    type Credential = {
        username: string;
        password: string;
        pin: string;
    };
}

export = Firstrade;