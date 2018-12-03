import { Component, ViewChild } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { UserService, UserRole } from '../../services/user.service';

export interface UpdateAccountModel {
  title:string;
  message:string;
}
@Component({  
 
    selector: 'confirm',
    template: `<div class="modal-dialog">
                <div class="modal-content">
                   <div class="modal-header">
                     <button type="button" class="close" (click)="close()" >&times;</button>
                     <h4 class="modal-title">Update user</h4>
                   </div>
                   <div class="modal-body">
                            <form>
                                <div class="form-group">
                                    <label for="customerId">Customer ID</label>
                                    <input id="id1" type="text" class="form-control" #id1>
                                </div>
                                <div class="form-group">
                                    <label for="firstName">First Name</label>
                                    <input id="firstName1" type="text" class="form-control" #firstName1>
                                </div>
                                <div class="form-group">
                                    <label for="lastName">Last Name</label>
                                    <input id="lastName1" type="text" class="form-control" #lastName1>
                                </div>  
                            </form>     
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button (click) = "updateCustomer(id1.value, firstName1.value, lastName1.value)" type="button" class="btn btn-primary" data-dismiss="modal" >Update</button>
                        </div>
                 </div>
              </div>`
})
export class UpdateAccountComponent extends DialogComponent<UpdateAccountModel, boolean> implements UpdateAccountModel {
  title: string;
  message: string;
  private customers = [];

  constructor(private userService: UserService, dialogService: DialogService) {
    super(dialogService);
  }


  updateCustomer(id: string, firstName: string, lastName: string) {
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

  
    this.close();

  }

  
  


}