import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, ApplicationRole } from '../../../services/user.service';
import 'rxjs/add/operator/toPromise';
import { DialogService } from "ng2-bootstrap-modal";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private roles = [ ApplicationRole.Manufacturer, ApplicationRole.Distributor, ApplicationRole.Retailer, ApplicationRole.Recycling];
  private customers = [];
  ApplicationRole = ApplicationRole;
  private userCopy: any = {};

  constructor(private userService: UserService, private router: Router, private dialogService: DialogService) {
  }

  ngOnInit() {
    if (!this.userService.loggedInUser) {
      this.router.navigate(['/login']);
      
    }

    this.userService.getCustomers().subscribe(results => this.customers = results);
  }

  createCustomer(customerId: string, firstName: string, lastName: string, password: string, role:string) {
    var spinner = document.getElementById("spinner1");
    spinner.style.display = "block"; 
    this.userService.createCustomer(customerId, firstName, lastName, password, role).subscribe(() => {
    this.userService.getCustomers().subscribe(results => this.customers = results);
      setTimeout( () => { 
        spinner.style.display = "none";
        document.getElementById('alert-success').style.display = 'block';
      }, 2000 );
      setTimeout( () => { 
        document.getElementById('alert-success').style.display = 'none';
      }, 7000 );
    });
  }

  updateCustomer(id: string, firstName: string, lastName: string, password: string, role: string) {
    var spinner = document.getElementById("spinner");
    spinner.style.display = "block"; 
    this.userService.updateCustomer(id, firstName, lastName, password, role).subscribe(() => {
      this.userService.getCustomers().subscribe(results => this.customers = results);

      setTimeout( () => { 
        spinner.style.display = "none";
        document.getElementById('alert-update').style.display = 'block';
      }, 2000 );
      setTimeout( () => { 
        document.getElementById('alert-update').style.display = 'none';
      }, 7000 );
    });
  }

  deleteCustomer(id: string) {
    var spinner = document.getElementById("spinner");
    spinner.style.display = "block"; 
    this.userService.deleteCustomer(id).subscribe(() => {
      this.userService.getCustomers().subscribe(results => this.customers = results);
      setTimeout( () => { 
        spinner.style.display = "none";
        document.getElementById('alert-delete').style.display = 'block';
      }, 2000 );
      setTimeout( () => { 
        document.getElementById('alert-delete').style.display = 'none';
      }, 7000 );
    });
  }

  copyUserData(user: any) {
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
}
