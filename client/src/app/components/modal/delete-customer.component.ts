import { Component, ViewChild } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { UserService, UserRole } from '../../services/user.service';

export interface DeleteCustomerModel {
  title:string;
  message:string;
}
@Component({  
 
    selector: 'confirm',
    template: `<div class="modal-dialog">
                <div class="modal-content">
                   <div class="modal-header">
                     <button type="button" class="close" (click)="close()" >&times;</button>
                     <h4 class="modal-title">Delete user</h4>
                   </div>
                   <div class="modal-body">
                            <form>
                                <div class="form-group">
                                    <p>Do you really want to delete this user?</p>
                                </div>
                                <div class="form-group">
                                    <label for="id">Customer ID</label>
                                    <input id="deleteId" type="text" class="form-control" #deleteId>
                                </div>
                            </form>     
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button (click) = "deleteCustomer(deleteId.value)" type="button" class="btn btn-danger" data-dismiss="modal">Delete</button>
                        </div>
              </div>`
})
export class DeleteCustomerComponent extends DialogComponent<DeleteCustomerModel, boolean> implements DeleteCustomerModel {
  title: string;
  message: string;
  private customers = [];

  constructor(private userService: UserService, dialogService: DialogService) {
    super(dialogService);
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
  

  
    this.close();

  }

  


}