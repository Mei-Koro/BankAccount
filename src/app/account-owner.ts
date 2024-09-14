
// this class builds an object for the owner of the account.
// all members have deafault value.
// Account owner name, address, ID (tz), and whether they hava a picture. 

export class AccountOwner {
    constructor(public name:string="init name",
                public address:string="",
                public tz:number=-1){}
}
