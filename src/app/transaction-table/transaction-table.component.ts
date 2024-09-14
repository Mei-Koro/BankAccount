import { Component, OnInit } from '@angular/core';
import { TransactionManager } from '../transaction-manager';
import { BankTransaction, TransactionType } from '../bank-transaction';
import { UserManager } from '../user-manager';
import { Router } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.css']
})
export class TransactionTableComponent implements OnInit {
  allBankTransactions: BankTransaction[] = TransactionManager.allValidTransactions;
  transactionTypeNames: string[] = [];
  transactionHebrewName: string = "";
  

  constructor(private router_srv: Router) { 
    MenuComponent.setmenuShouldAppear(true);
    for (let optn in TransactionType)
      if (isNaN(Number(optn)))
        this.transactionTypeNames.push(optn);
  }

  ngOnInit(): void {
    if (!UserManager.isUserSignedIn())
      this.router_srv.navigateByUrl('/AccountLogin');
  }

  changeTransactionNameToHebrew(index:number):string{
    for (let i = 0; i < this.allBankTransactions.length; i++){
      if (i == index){
      switch (this.allBankTransactions[i].trnTyp * 1) {
        case TransactionType.openAccount:
          this.transactionHebrewName = "פתיחת חשבון";
          break;
        case TransactionType.deposit:
           this.transactionHebrewName = "הפקדה";
            break;
        case TransactionType.withdraw:
          this.transactionHebrewName = "משיכה";
          break;
      }
        break;
      }
    }
    return this.transactionHebrewName;
  }

}
