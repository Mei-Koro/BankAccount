import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BankAccountDetails } from '../bank-account-details';
import { MenuComponent } from '../menu/menu.component';
import { UserManager } from '../user-manager';

const BANK_DETAILS_KEY: string = "BANK_DETAILS";

@Component({
  selector: 'app-edit-bank-deatils',
  templateUrl: './edit-bank-deatils.component.html',
  styleUrls: ['./edit-bank-deatils.component.css']
})
export class EditBankDeatilsComponent implements OnInit {
  bankDetails: BankAccountDetails;
  edit?: boolean = false;
  static bankDetails: BankAccountDetails = new BankAccountDetails("Rimonim Givataim", 762, 113344);

  constructor(private router_srv: Router) {
    MenuComponent.setmenuShouldAppear(true);
    EditBankDeatilsComponent.loadFillBankDetails();
    this.bankDetails = EditBankDeatilsComponent.bankDetails;
   }

  ngOnInit(): void {
    if (!UserManager.isUserSignedIn())
      this.router_srv.navigateByUrl('/AccountLogin');
  }

  checkInput(){
    if (this.bankDetails.branchName == null || this.bankDetails.branchName.trim() == ""){
      showErrorFocus("יש למלא שדה שם סניף","branchName");
      return;
    }
    if (this.bankDetails.branchNumber == null || this.bankDetails.branchNumber.toString().trim() == ""){
      showErrorFocus("יש למלא שדה מספר סניף","branchNumber");
      return;
    }
    if (this.bankDetails.accountNumber == null || this.bankDetails.accountNumber.toString().trim() == ""){
      showErrorFocus("יש למלא שדה מספר חשבון","accountNumber");
      return;
    }

    let nameArray:string[] = this.bankDetails.branchName.trim().split(" ");
    for (let i = 0; i< nameArray.length; i++)
      for (let j = 0; j< nameArray[i].length; j++){
        if (!isNaN(parseFloat(nameArray[i][j]))){
          showErrorFocus("שדה שם סניף לא יכול להיות מספרי","branchName");
          return;
        }
      }
    for (let j = 0; j< this.bankDetails.branchNumber.toString().trim().length; j++)
      if (isNaN(parseFloat(this.bankDetails.branchNumber.toString().trim()[j]))){
      showErrorFocus("שדה מספר סניף צריך להיות מספרי","branchNumber");
      return;
    }
    for (let j = 0; j< this.bankDetails.accountNumber.toString().trim().length; j++)
    if (isNaN(parseFloat(this.bankDetails.accountNumber.toString().trim()[j]))){
    showErrorFocus("שדה מספר חשבון צריך להיות מספרי","accountNumber");
    return;
  }
    if (this.bankDetails.accountNumber.toString().trim().length < 6 || this.bankDetails.accountNumber.toString().trim().length > 10){
      showErrorFocus("שדה מספר חשבון צריך להיות בין 6 ל-10 תווים ","accountNumber");
      return;
    }
    if (this.bankDetails.branchName.trim().length < 2 || this.bankDetails.branchName.trim().length > 30){
      showErrorFocus("שדה שם סניף צריך להיות בין 2 תווים ל-30","branchName");
      return;
    }
    if (this.bankDetails.branchNumber.toString().trim().length != 3){
      showErrorFocus("שדה מספר סניף צריך להיות 3 תווים ","branchNumber");
      return;
    }
    this.edit = !this.edit;
    this.getBankDetails();
  }

  getBankDetails():void{
    EditBankDeatilsComponent.bankDetails = this.bankDetails;
    localStorage.setItem(BANK_DETAILS_KEY, JSON.stringify(EditBankDeatilsComponent.bankDetails));
  }

  private static loadFillBankDetails():void{
    if (localStorage.getItem(BANK_DETAILS_KEY) == null){
        localStorage.setItem(BANK_DETAILS_KEY, JSON.stringify(this.bankDetails));
    }
    else{
        try {
            let t: any = localStorage.getItem(BANK_DETAILS_KEY);
            EditBankDeatilsComponent.bankDetails = JSON.parse(t);
            
        } catch (problem: any) {
            localStorage.setItem(BANK_DETAILS_KEY, JSON.stringify(EditBankDeatilsComponent.bankDetails));
            console.log("JSON problem Bank Details: " + problem.message);   
        }
    }
  }

}
function showErrorFocus(msg: string, id: string): void {
  alert(msg);
  document.getElementById(id)?.focus();
}
