import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

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
      lastName: user.lastName,
      password: user.password,
      role: user.role,
    };
  }
  
  updateAccount(id: string, firstName: string, lastName: string, password: string, role: string) {
    var spinner = document.getElementById("spinner");
    spinner.style.display = "block"; 
    this.userService.updateCustomer(id, firstName, lastName, password, role).subscribe((res) => {
      this.userService.loggedInUser = res;

      setTimeout( () => { 
        spinner.style.display = "none";
        document.getElementById('alert-success').style.display = 'block';
      }, 2000 );
      setTimeout( () => { 
        document.getElementById('alert-success').style.display = 'none';
      }, 7000 );
    });
  }
}
