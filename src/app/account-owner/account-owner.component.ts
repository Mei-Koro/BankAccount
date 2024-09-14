import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountOwner } from '../account-owner';
import { MenuComponent } from '../menu/menu.component';
import { UserManager } from '../user-manager';

const ACCOUNT_OWNER_KEY: string = "ACCOUNT_OWNER";

@Component({
  selector: 'app-account-owner',
  templateUrl: './account-owner.component.html',
  styleUrls: ['./account-owner.component.css']
})
export class AccountOwnerComponent implements OnInit {
  owner:AccountOwner;
  static ownerDetails: AccountOwner = new AccountOwner ("Shlomit Cohen", "Tel Aviv", 129387465);
  edit?:boolean = false;
  constructor(private router_srv: Router) { 
    MenuComponent.setmenuShouldAppear(true);
    AccountOwnerComponent.loadFillOwner();
    this.owner = AccountOwnerComponent.ownerDetails;
  }

  checkInput(){
    if (this.owner.name == "null" || this.owner.name.trim() ==""){
      showErrorFocus("יש למלא שדה שם","shem");
      return;
    }
    if (this.owner.address == "null" || this.owner.address.trim() ==""){
      showErrorFocus("יש למלא שדה כתובת","adrs");
      return;
    }
    let nameArray:string[] = this.owner.name.trim().split(" ");
    for (let i = 0; i< nameArray.length; i++)
      for (let j = 0; j< nameArray[i].length; j++){
        if (!isNaN(parseFloat(nameArray[i][j]))){
          showErrorFocus("שדה שם לא יכול להיות מספרי","shem");
          return;
        }
      }
    let addressArray:string[] = this.owner.address.trim().split(" ");
    for (let i = 0; i< addressArray.length; i++)
      for (let j = 0; j< addressArray[i].length; j++){
        if (!isNaN(parseFloat(addressArray[i][j]))){
          showErrorFocus("שדה כתובת לא יכול להיות מספרי","adrs");
          return;
        }
      }
    if (nameArray.length  != 2){
      showErrorFocus("יש לכתוב שם פרטי ושם משפחה עם רווח אחד ביניהם","shem");
      return;
    }
    if (nameArray[0].length < 2 || nameArray[1].length < 2){
      showErrorFocus("שם ושם משפחה צריכים להיות 2 תווים כל אחד לפחות","shem");
      return;
    }
    if (nameArray[0].length + nameArray[1].length > 30){
      showErrorFocus("שם ושם משפחה צריכים להיות עד 30 תווים ","shem");
      return;
    }
    if (this.owner.address.trim().length  <  2){
      showErrorFocus("כתובת צריכה להיות 2 תווים לפחות","adrs");
      return;
    }
    if (this.owner.address.trim().length  >  60){
      showErrorFocus("כתובת צריכה להיות עד 60 תווים","adrs");
      return;
    }

this.edit = !this.edit;
this.getOwnerDetails();
  }

  getOwnerDetails():void{
    AccountOwnerComponent.ownerDetails = this.owner;
    localStorage.setItem(ACCOUNT_OWNER_KEY, JSON.stringify(AccountOwnerComponent.ownerDetails));
  }

  static passOwnerDetails():string{
    AccountOwnerComponent.loadFillOwner();
    return AccountOwnerComponent.ownerDetails.name;
  }

  ngOnInit(): void {
    if (!UserManager.isUserSignedIn())
      this.router_srv.navigateByUrl('/AccountLogin');
  }

  private static loadFillOwner():void{
    if (localStorage.getItem(ACCOUNT_OWNER_KEY) == null){
        localStorage.setItem(ACCOUNT_OWNER_KEY, JSON.stringify(AccountOwnerComponent.ownerDetails));
    }
    else{
        try {
            let t: any = localStorage.getItem(ACCOUNT_OWNER_KEY);
            AccountOwnerComponent.ownerDetails = JSON.parse(t);
            
        } catch (problem: any) {
            localStorage.setItem(ACCOUNT_OWNER_KEY, JSON.stringify(AccountOwnerComponent.ownerDetails));
            console.log("JSON problem Account Owner: " + problem.message);   
        }
    }
  }

  static updateAccountOwner():void{
    AccountOwnerComponent.loadFillOwner();
  }

}
function showErrorFocus(msg: string, id: string): void {
  alert(msg);
  document.getElementById(id)?.focus();
}