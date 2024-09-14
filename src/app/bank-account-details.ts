const activeBank: string = "Big Bank Inc"; //the const with the name of the bank.

// it gives us information about the Bank details. 
//this class creates an object with the Bank Details: the branch name, number, and account number.
export class BankAccountDetails {
    bankName: string = activeBank; //gets the value of the consts above - we don't use it in the constructor.
    limit: number=-2000; // we use the limit for the max minus sum of money in the account. -2000.
    static transactionManagerLimit:number = -2000; // used in TransactionManager, similiar to above. 
    constructor(public branchName: string, public branchNumber: number, public accountNumber: number) { }

    toString(): string { return `${this.bankName} Branch: (${this.branchNumber}) ${this.branchName} Account#: ${this.accountNumber}`; }
}
