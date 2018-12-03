import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, UserRole } from '../../../services/user.service';
import 'rxjs/add/operator/toPromise';

import { UpdateCustomerComponent } from '../../../components/modal/update-customer.component';
import { DeleteCustomerComponent } from '../../../components/modal/delete-customer.component';

import { DialogService } from "ng2-bootstrap-modal";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private customers = [];

  constructor(private userService: UserService, private router: Router, private dialogService: DialogService) {
  }

  ngOnInit() {
    if (!this.userService.loggedInUser) {
      this.router.navigate(['/login']);
      
    }

    this.userService.getCustomers().subscribe(results => this.customers = results);
  }

  createCustomer(customerId: string, password: string, firstName: string, lastName: string) {
    var spinner = document.getElementById("spinner1");
    spinner.style.display = "block"; 
    this.userService.createCustomer(customerId, password, firstName, lastName).subscribe(() => {
    this.userService.getCustomers().subscribe(results => this.customers = results);
      setTimeout( () => { 
        spinner.style.display = "none";
        document.getElementById('alert-success1').style.display = 'block';
      }, 2000 );
      setTimeout( () => { 
        document.getElementById('alert-success1').style.display = 'none';
      }, 7000 );
    });
  }

  public updateCustomer(id: string, firstName: string, lastName: string) {
    var spinner = document.getElementById("spinner1");
    spinner.style.display = "block"; 
    this.userService.updateCustomer(id, firstName, lastName).subscribe(() => {
    this.userService.getCustomers().subscribe(results => this.customers = results);
      setTimeout( () => { 
        spinner.style.display = "none";
        document.getElementById('alert-update1').style.display = 'block';
      }, 2000 );
      setTimeout( () => { 
        document.getElementById('alert-update1').style.display = 'none';
      }, 7000 );
    });
  }

  deleteCustomer(id: string) {
    var spinner = document.getElementById("spinner1");
    spinner.style.display = "block"; 
    this.userService.deleteCustomer(id).subscribe(() => {
    this.userService.getCustomers().subscribe(results => this.customers = results);
      setTimeout( () => { 
        spinner.style.display = "none";
        document.getElementById('alert-delete1').style.display = 'block';
      }, 2000 );
      setTimeout( () => { 
        document.getElementById('alert-delete1').style.display = 'none';
      }, 7000 );
    });
  }

  // Update user modal
  showUpdateCustomerModal() {
    let disposable = this.dialogService.addDialog(UpdateCustomerComponent, {
      title:'Confirm title', 
      message:'Confirm message'})
      .subscribe((isConfirmed)=>{
        //Get dialog result
        
      });
      //We can close dialog calling disposable.unsubscribe();
      //If dialog was not closed manually close it by timeout
      setTimeout(()=>{
        disposable.unsubscribe();
      },10000);
  }

  // Update user modal
  showDeleteCustomerModal() {
    let disposable = this.dialogService.addDialog(DeleteCustomerComponent, {
      title:'Confirm title', 
      message:'Confirm message'})
      .subscribe((isConfirmed)=>{
        //Get dialog result
        
      });
      //We can close dialog calling disposable.unsubscribe();
      //If dialog was not closed manually close it by timeout
      setTimeout(()=>{
        disposable.unsubscribe();
      },10000);
  }



}
