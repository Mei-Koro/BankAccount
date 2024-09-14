import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { UserManager } from '../user-manager';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  crntPwd: string = "";
  nwPwd: string = "";
  nw2Pwd: string = "";
  jobDone: boolean = false;
  constructor(private router_srv: Router) {
    MenuComponent.setmenuShouldAppear(false);
   }

  ngOnInit(): void {
    if (!UserManager.isUserSignedIn())
      this.router_srv.navigateByUrl('/AccountLogin');
  }
  updIt() {
    this.jobDone = false;
    if (this.crntPwd.trim() == "" || this.nwPwd.trim() == "" || this.nw2Pwd.trim() == "") {
      alert("אחד או יותר משדות הסיסמא ריק");
      return;
    }
    if (!UserManager.isPwdOk(this.crntPwd.trim())) {
      alert("סיסמא נוכחית שגויה");
      return;
    }
    if (this.nwPwd.trim().length < 4 || this.nwPwd.trim().length > 10 || this.nw2Pwd.trim().length < 4 || this.nw2Pwd.trim().length > 10){
      alert("סיסמא צריכה להיות בין 4 ל-10 תווים");
      return;
    }
    if ((this.nwPwd.trim() != this.nw2Pwd.trim())) {
      alert("סיסמא חדשה ווידוא סיסמא צריכות להיות זהות");
      return;
    }
    if ((this.crntPwd.trim() == this.nwPwd.trim())) {
      alert(" סיסמא מבוקשת  חייבת להיות שונה מנוכחית");
      return;
    }
    this.jobDone = true;
    UserManager.changePwd(this.nwPwd.trim());
  }
}
