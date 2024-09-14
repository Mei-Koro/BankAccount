import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BankTransaction, TransactionType } from '../bank-transaction';
import { TransactionManager } from '../transaction-manager';
import { ActivatedRoute } from '@angular/router';
import { UserManager } from '../user-manager';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent implements OnInit {
  allTransactionDetails: BankTransaction[] = TransactionManager.allValidTransactions;
  transactionTypeNames: string[] = [];
  TransactionById?: BankTransaction;
  transactionHebrewName: string = "";

  constructor(private router_srv: Router, private route:ActivatedRoute) { 
    MenuComponent.setmenuShouldAppear(false);
    for (let optn in TransactionType)
      if (isNaN(Number(optn)))
      this.transactionTypeNames.push(optn);
  }

  ngOnInit(): void {
    if (!UserManager.isUserSignedIn())
      this.router_srv.navigateByUrl('/AccountLogin');
    const id = this.route.snapshot.paramMap.get('id');
    if (id)
      this.TransactionById = TransactionManager.getTransactionById(id);
  }

  delete():void{
    if (this.TransactionById)
      if (TransactionManager.deleteTransaction(this.TransactionById)){
        this.router_srv.navigateByUrl("/TransactionTable");
    }
  }

  changeTransactionNameToHebrew():string{
    if(this.TransactionById)
    switch (this.TransactionById?.trnTyp * 1) {
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
    return this.transactionHebrewName;
  }

}
