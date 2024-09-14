import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserManager } from '../user-manager';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-account-login',
  templateUrl: './account-login.component.html',
  styleUrls: ['./account-login.component.css']
})
export class AccountLoginComponent implements OnInit {
  doel?: string;
  sisma?: string;
  constructor(private router_srv: Router) {
    MenuComponent.setmenuShouldAppear(false);
   }

  ngOnInit(): void {
  }

  logIn(): void {
    if (this.doel == null || this.doel.trim() == ""){
      showErrorFocus("יש למלא שדה דואר אלקטרוני","uid");
      return;
    }
    if (this.sisma== null || this.sisma.trim() == ""){
      showErrorFocus("יש למלא שדה סיסמא","pwd");
      return;
    }
    if (UserManager.validateUser(this.doel?.trim(), this.sisma?.trim())) 
    {
      UserManager.userSignedIn();
      this.router_srv.navigateByUrl('/BankAccount');
    }
    else {
      alert("שם המשתמש או הסיסמא שגויים");
      return;
    }
  }

}
function showErrorFocus(msg: string, id: string): void {
  alert(msg);
  document.getElementById(id)?.focus();
}
