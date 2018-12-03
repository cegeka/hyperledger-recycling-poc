import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, UserRole } from '../../../services/user.service';

import { DialogService } from "ng2-bootstrap-modal";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  private userCopy: any = {};

  constructor(private userService: UserService, private router: Router, private dialogService: DialogService) {
  }

  ngOnInit() {
    if (!this.userService.loggedInUser) {
      this.router.navigate(['/login']);
      window.location.reload();
    }        
  } 

  copyUserData() {
    let user = this.userService.loggedInUser;
    if (!user) {
      return;
    }

    this.userCopy = {
      customerId: user.customerId,
      firstName: user.firstName,
      lastName: user.lastName
    };
  }
  
  updateAccount(id: string, firstName: string, lastName: string) {
    var spinner = document.getElementById("spinner1");
    spinner.style.display = "block"; 
    this.userService.updateAccount(id, firstName, lastName).subscribe(() => {
      //TODO: refresh current user settings
      setTimeout( () => { 
        spinner.style.display = "none";
        document.getElementById('alert-success1').style.display = 'block';
      }, 2000 );
      setTimeout( () => { 
        document.getElementById('alert-success').style.display = 'none';
      }, 7000 );
    });
  }
}
