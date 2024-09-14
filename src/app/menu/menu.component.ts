import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountOwnerComponent } from '../account-owner/account-owner.component';
import { TransactionManager } from '../transaction-manager';
import { UserManager } from '../user-manager';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  private static menuShouldAppear: boolean = true;
  static owner: string;
  static balance: number;

  constructor(private router_srv: Router) { 
  }

  ngOnInit(): void {
  }

  logOut():void
  {
    UserManager.byeUser();
    this.router_srv.navigateByUrl('/AccountLogin');
  }

  getmenuShouldAppear():boolean{
    return MenuComponent.menuShouldAppear;
  }

  static setmenuShouldAppear(shouldAppear:boolean):void{
    MenuComponent.menuShouldAppear = shouldAppear;
  }

  getOwnerName():string{
    return AccountOwnerComponent.passOwnerDetails();
  }
  
  getBalance():number{
    MenuComponent.setBalance(TransactionManager.returnBalance())
    return MenuComponent.balance;
  }

  static setBalance(balance:number):void{
    MenuComponent.balance = balance;
  }
}
