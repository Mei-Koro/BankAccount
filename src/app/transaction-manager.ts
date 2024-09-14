import { BankAccountDetails } from "./bank-account-details";
import { BankTransaction, TransactionType } from "./bank-transaction";

const TRANSACTION_KEY: string = "TRANSACTIONS";
const TRANSACTION_COUNTER_KEY: string = "TRANSACTION_COUNTER";

export class TransactionManager {
    static allValidTransactions: BankTransaction[] = [];
    static transactionCounter: number = 1;
    static currentBalance: number;
    transactionTypeNames: string[] = [];
    static limit = BankAccountDetails.transactionManagerLimit;

    constructor(){
        for (let optn in TransactionType)
        if (isNaN(Number(optn)))
        this.transactionTypeNames.push(optn);
    }
    private static loadFillTransaction():void{
        if (localStorage.getItem(TRANSACTION_KEY) == null){
            localStorage.setItem(TRANSACTION_KEY, JSON.stringify(TransactionManager.allValidTransactions))
        }
        else{
            try {
                let t: any = localStorage.getItem(TRANSACTION_KEY);
                TransactionManager.allValidTransactions = JSON.parse(t);
                
            } catch (problem: any) {
                localStorage.setItem(TRANSACTION_KEY, JSON.stringify(TransactionManager.allValidTransactions));
                console.log("JSON problem All Transactions: " + problem.message);   
            }
        }
    }

    private static loadFillTransactionCounter():void{
        if (localStorage.getItem(TRANSACTION_COUNTER_KEY) == null){
            localStorage.setItem(TRANSACTION_COUNTER_KEY, JSON.stringify(TransactionManager.transactionCounter))
        }
        else{
            try {
                let t: any = localStorage.getItem(TRANSACTION_COUNTER_KEY);
                TransactionManager.transactionCounter = JSON.parse(t);
                
            } catch (problem: any) {
                localStorage.setItem(TRANSACTION_COUNTER_KEY, JSON.stringify(TransactionManager.transactionCounter));
                console.log("JSON problem Transaction Counter: " + problem.message);   
            }
        }
    }

    static updateTransactionAndCounter():void{
        localStorage.setItem(TRANSACTION_KEY, JSON.stringify(TransactionManager.allValidTransactions));
        localStorage.setItem(TRANSACTION_COUNTER_KEY, JSON.stringify(TransactionManager.transactionCounter));
    }


    static deleteTransaction(transaction:BankTransaction):boolean{
        if (confirm("האם ברצונך למחוק רשומה זו?")){
            if(transaction.trnTyp == TransactionType.openAccount){
                alert("אין אפשרות למחוק שורת פתיחת החשבון");
                return false;
            }
            else{
                let startPoint = TransactionManager.arrangeTransactions(transaction);
                TransactionManager.allValidTransactions.splice(startPoint,1);
                localStorage.setItem(TRANSACTION_KEY, JSON.stringify(TransactionManager.allValidTransactions));
                TransactionManager.updateTransactionBalance();
                return true;
            }
        }
        else{
            return false;
        }
    }

    static arrangeTransactions(transaction:BankTransaction):number{
        for (let i = 0; i<TransactionManager.allValidTransactions.length; i++){
            if (TransactionManager.allValidTransactions[i].counter == transaction.counter)
                return i;
        }
        return 0;
    }

    static updateTransactionBalance():void{
        TransactionManager.loadFillTransaction();
        for (let i = 0; i < TransactionManager.allValidTransactions.length; i++)
        {
            switch (TransactionManager.allValidTransactions[i].trnTyp * 1)
            {
                case TransactionType.openAccount: TransactionManager.allValidTransactions[i].balance = TransactionManager.allValidTransactions[i].amount;
                //console.log("inside open");
                    break;
                case TransactionType.deposit: TransactionManager.allValidTransactions[i].balance = TransactionManager.allValidTransactions[i].amount+TransactionManager.allValidTransactions[i-1].balance;
                //console.log("inside deposit");
                    break;
                case TransactionType.withdraw: TransactionManager.allValidTransactions[i].balance = TransactionManager.allValidTransactions[i-1].balance-TransactionManager.allValidTransactions[i].amount;
                //console.log("inside withdraw");
                    break;
            }
        }
        localStorage.setItem(TRANSACTION_KEY, JSON.stringify(TransactionManager.allValidTransactions));
    }

  static getTransactionById(id: string): BankTransaction | undefined {
    for (let i = 0; i < TransactionManager.allValidTransactions.length ; i++){
        if (TransactionManager.allValidTransactions[i].counter.toString() == id){
            return TransactionManager.allValidTransactions[i];
        }
    }
    return undefined;
  }

static getBalance(currentAmount:number):void{
    let currentTransaction = TransactionManager.allValidTransactions.length-1;
        if (TransactionManager.allValidTransactions.length<2)
            TransactionManager.allValidTransactions[currentTransaction].balance = currentAmount;
        else{
            let previousBalance = TransactionManager.allValidTransactions[currentTransaction-1].balance;
            if(TransactionManager.allValidTransactions[currentTransaction].trnTyp == TransactionType.deposit)
                TransactionManager.allValidTransactions[currentTransaction].balance = previousBalance + currentAmount;
            if(TransactionManager.allValidTransactions[currentTransaction].trnTyp == TransactionType.withdraw)
                TransactionManager.allValidTransactions[currentTransaction].balance = previousBalance - currentAmount;
        }  
        this.currentBalance = TransactionManager.allValidTransactions[currentTransaction].balance;
    }

  static returnBalance():number{
    TransactionManager.loadFillTransaction();
    TransactionManager.loadFillTransactionCounter();
    if (TransactionManager.transactionCounter>1){
        TransactionManager.currentBalance = TransactionManager.allValidTransactions[TransactionManager.allValidTransactions.length-1].balance;
        return TransactionManager.currentBalance;
    }
    return 0;
  }
 }
