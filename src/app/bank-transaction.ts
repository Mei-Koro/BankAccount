import { TransactionManager } from "./transaction-manager";

export enum TransactionType {
    choose, //0
    openAccount, // 1
    deposit,  // 2
    withdraw } // 3

// this class dictates how to create the transaction object.

export class BankTransaction {
    constructor(public amount: number,
                public trnDate: Date = new Date(),
                public asmachta: string, 
                public trnTyp: TransactionType,
                public comment?: string,
                public counter: number = TransactionManager.transactionCounter,
                public balance: number = 0) { } 
    toString(): string {
        return `on ${this.trnDate.toDateString()} a ${TransactionType[this.trnTyp]} of ${this.amount} NIS`;
    }
}
