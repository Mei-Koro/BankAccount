import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountLoginComponent } from './account-login/account-login.component';
import { AccountOwnerComponent } from './account-owner/account-owner.component';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditBankDeatilsComponent } from './edit-bank-deatils/edit-bank-deatils.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { TransactionTableComponent } from './transaction-table/transaction-table.component';

const routes: Routes = [
  { path: 'AccountLogin', component: AccountLoginComponent },
  { path: 'BankAccount', component: BankAccountComponent },
  { path: 'ChangePassword', component:ChangePasswordComponent },
  { path: 'AccountOwner', component:AccountOwnerComponent },
  { path: 'TransactionTable', component:TransactionTableComponent },
  { path: 'EditBankDetails', component:EditBankDeatilsComponent },
  { path: 'TransactionDetails/:id', component:TransactionDetailsComponent },
  { path: '', component: AccountLoginComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
