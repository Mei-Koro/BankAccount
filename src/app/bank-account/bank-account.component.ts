import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BankAccountDetails } from '../bank-account-details';
import { TransactionType, BankTransaction } from '../bank-transaction';
import { MenuComponent } from '../menu/menu.component';
import { TransactionManager } from '../transaction-manager';
import { UserManager } from '../user-manager';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.css']
})

export class BankAccountComponent implements OnInit {
  //the current amount,trasaction type, asmachta, comment, date the user typed and the balance:
  currentAmount: number = 0; // amount of money
  currentBalance: number = TransactionManager.currentBalance; // balance
  currentTransactionAsmachta: string = ""; //asmachta
  currentTransactionComment?: string = ""; //comment
  currentTransactionDateS: string = ""; //date
  currentTransactionType: TransactionType = TransactionType.choose; // when the user doesn't choose a transcation type, the default is "choose".
  // the object of the tranaction we create in the doTransaction() bellow:
  transaction?: BankTransaction = undefined;
  // the object of the account details: limit -2000, bank name, branch name and number, and account number.  
  accountDetails: BankAccountDetails; 
  // Array of objects that stores the values of the TransactionType enum inside of it. 
  transactionTypeNames: {name:string,num:string}[] = [];
  transactionHebrewName?: string; // used to translate the transactions to Hebrew
  lastActionFail: boolean = false; // check if the transaction failed. Used in *ngIf. 
  // next attribute is used to check if we're on the first transaction to know what view to show - open account VS deposit and withdraw.
  firstTransaction: boolean = TransactionManager.allValidTransactions.length == 0;
  currentDate: Date = new Date(); // used for the max date in the html file

  constructor(private router_srv:Router) {
    this.accountDetails = new BankAccountDetails("Rimonim Givataim", 762, 113344); //that's how we bring the limit here.
    MenuComponent.setmenuShouldAppear(true);
    this.loadTransactionTypeNames();
  }

// method below is used to push into the array objects of enum values, depending on the view we want to show.
  loadTransactionTypeNames():void{
    this.transactionTypeNames = [];
    for(let optn in TransactionType)
    { if(this.firstTransaction){
        if(isNaN(Number(optn)) && optn != "withdraw")
          this.transactionTypeNames.push({name: optn, num: TransactionType[optn]});
      }
      else{
        if(isNaN(Number(optn)) && optn != "openAccount")
          this.transactionTypeNames.push({name: optn, num: TransactionType[optn]});
      }
    }
  }

  // the main method in this class - here we validate the user input, and create the transaction object.
  doTransaction(): void {
    this.lastActionFail = false;
    if (this.currentAmount == null || this.currentAmount < 0) {
      showErrorFocus("סכום חייב להיות מספר לא שלילי", "amount");
      return;
    }
    if (!this.firstTransaction && this.currentAmount == 0) {
      showErrorFocus('לא ניתן להפקיד או למשוך סכום על סך 0 ש"ח', "amount");
      return;
    }
    if (this.currentTransactionDateS == "" || this.currentTransactionDateS == null) {
      showErrorFocus("תאריך חובה", "taarich");
      return;
    }

    let typedDt:Date=new Date(this.currentTransactionDateS);
    if (typedDt>this.currentDate)
    {
      showErrorFocus("תאריך מאוחר מהיום אסור", "taarich");
      return;
    }
    // check whether current transaction date is later to previous
    if (!this.firstTransaction){
      let lastDt:Date = new Date (TransactionManager.allValidTransactions[TransactionManager.allValidTransactions.length-1].trnDate);
      if (typedDt<lastDt){
        showErrorFocus("תנועה חדשה לא יכולה להיות מוקדמת לתנועה שלפניה", "taarich");
        return;
      }
    }
    switch (this.currentTransactionType * 1) {
      case TransactionType.openAccount:
        this.currentBalance = this.currentAmount;
        this.transactionHebrewName = "פתיחת חשבון";
        break;
      case TransactionType.deposit:
         this.currentBalance += this.currentAmount;
         this.transactionHebrewName = "הפקדה";
        break;
      case TransactionType.withdraw:
        if ((this.currentBalance - this.currentAmount) < this.accountDetails.limit) {
          this.lastActionFail = true;
          return;
      }
        this.currentBalance -= this.currentAmount;
        this.transactionHebrewName = "משיכה";
        break;
      default: alert('לא בחרת סוג פעולה');
        return;
    }
    if (this.currentTransactionComment != null && this.currentTransactionComment.trim()!= "")
      if (this.currentTransactionComment.trim().length<4){
        showErrorFocus("הערה לפחות 4 תוים", "comment");
        return;
      }

    if (this.currentTransactionAsmachta == null || this.currentTransactionAsmachta.trim() == "")
      this.currentTransactionAsmachta = `#${TransactionManager.transactionCounter}`
    //Asmachta could be empty, so we only check if the user typed enough characters into it 
    else if (this.currentTransactionAsmachta.trim().length<4){
    showErrorFocus("אסמכתא לפחות 4 תוים", "asmachta");
    return;
    }
    // passed all checks, input is valid - can create transaction object
    this.transaction = new BankTransaction(this.currentAmount, new Date(this.currentTransactionDateS), this.currentTransactionAsmachta.trim(), this.currentTransactionType, this.currentTransactionComment, TransactionManager.transactionCounter);
    // push transaction object into static array allValidTransactions (stored in class TransactionManager)
    TransactionManager.allValidTransactions.push(this.transaction);
    // access getBalance method to get current balance
    TransactionManager.getBalance(this.currentAmount);
    // with every succeful transaction, we add +1 to the transaction counter
    TransactionManager.transactionCounter++;
    if (this.firstTransaction){
        // here we check wether the user tried to deposit before opening account.
        // if they did, we change manually the transaction type to open account,
        // and we add a comment, to let the user know what happened. 
        if (TransactionManager.allValidTransactions[0].trnTyp != TransactionType.openAccount){
          TransactionManager.allValidTransactions[0].trnTyp = TransactionType.openAccount;
          TransactionManager.allValidTransactions[0].comment += " תנועת הפקדה שונתה לפתיחת חשבון ";
          }
      }
    // if we came so far, it's safe to say that the user made one transaction
    // so we change the flag to false -> from now on, the view changes to deposit/withdraw.
    // unless the user of course erases all their local storage. 
    this.firstTransaction = false;
    //we call the array loading method to change the view to deposit/withdraw.
    this.loadTransactionTypeNames();
    //the method below updates the local storage about the transactions and the counter. 
    TransactionManager.updateTransactionAndCounter();

    // it's better to let the user start from scratch every time. 
    this.currentTransactionType = TransactionType.choose;

    //this.currentTransactionType = -1;
    this.currentAmount = 0;
    this.currentBalance = TransactionManager.currentBalance;
    this.currentTransactionDateS = "";
    this.currentTransactionAsmachta = "";
    this.currentTransactionComment = "";
  }

  toString(): string {
    let ezer = `${this.transaction} into ${this.accountDetails}`;
    return ezer;
  }

  ngOnInit(): void {
    if (!UserManager.isUserSignedIn())
      this.router_srv.navigateByUrl('/AccountLogin');
  }
}

// used to put focus on the element with the error in it.
// This function can be found in other componenents where we have user input too. 
function showErrorFocus(msg: string, id: string): void {
  alert(msg);
  document.getElementById(id)?.focus();
}
