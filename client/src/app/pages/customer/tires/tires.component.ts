import { TireService } from './../../../services/tire.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-tires',
  templateUrl: './tires.component.html',
  styleUrls: ['./tires.component.css']
})
export class TiresComponent implements OnInit {
  private tires = [];
  private customers = [];
  selectedTire: any;

  notificationSuccessfull: boolean;
  notificationMessage: string;

  user: any;


  constructor(private userService: UserService, private tireService: TireService, private router: Router) {
  }

  ngOnInit() {
    this.user = this.userService.loggedInUser;
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    this.reloadTires();
    this.userService.getCustomers().subscribe(results => {
      this.customers = results.filter(c => {
        if (this.user.role == 'Manufacturer') {
          return c.role == 'Distributor';
        }
        if (this.user.role == 'Distributor') {
          return c.role == 'Retailer';
        }

        return false;
      });
    });
  }

  reloadTires() {
    this.tires = [];
    this.tireService.getTiresForUser(this.user.customerId)
      .subscribe(results => this.tires = results.sort((a, b) => {
        if (this.user.role == 'Manufacturer') {
          return new Date(a.creationDate).valueOf() - new Date(b.creationDate).valueOf();
        } else if (this.user.role == 'Recycling') {
          return new Date(a.recycleDate).valueOf() - new Date(b.recycleDate).valueOf();
        } else {
          return new Date(a.sellDate).valueOf() - new Date(b.sellDate).valueOf();
        }
      }));
  }

  onRowAction(tire: any) {
    this.selectedTire = tire;
  }

  showHideNotification(spinner: any, message: string, success: boolean = true) {
    //Could use a clear way, but for now it's enough
    let notification = document.getElementById('alert-success-trade');

    this.notificationSuccessfull = success;
    this.notificationMessage = message;


    setTimeout(() => {
      if (spinner) {
        spinner.style.display = "none";
      }
      if (notification && notification.style) {
        notification.style.display = 'block';
      }      
    }, 2000);

    setTimeout(() => {
      if (notification && notification.style) {
        notification.style.display = 'none';
      }
    }, 7000);
  }

  createTires(tireCount: number) {
    var spinner = document.getElementById("spinner-trade");
    spinner.style.display = "block";

    this.tireService.import(this.user.customerId, tireCount).subscribe(() => {
      this.reloadTires();
      this.showHideNotification(spinner, `You successfully registered ${tireCount} new ${tireCount == 1 ? 'tire' : 'tires'}`);
    }, (err) => {
      console.error(err);
      this.showHideNotification(spinner, `Failed to register new ${tireCount == 1 ? 'tire' : 'tires'}`, false);
    });
  }

  recycle(vinNumber: string) {
    var spinner = document.getElementById("spinner-trade");
    spinner.style.display = "block";

    this.tireService.recycle(this.user.customerId, vinNumber).subscribe(() => {
      this.reloadTires();
      this.showHideNotification(spinner, `Succesfull recycled tires on car`);
    }, (err) => {
      console.error(err);
      this.showHideNotification(spinner, `Failed to recycle tires`, false);
    });
  }

  sell(tireId: string, newOwnerId: string) {
    var spinner = document.getElementById("spinner-trade");
    spinner.style.display = "block";

    this.tireService.sell(tireId, this.user.customerId, newOwnerId).subscribe(() => {
      this.reloadTires();

      this.showHideNotification(spinner, "Tire sold");
    }, (err) => {
      console.error(err);
      this.showHideNotification(spinner, `Failed to sell tire`, false);
    });
  }

  sellToCustomer(tireId: string, vinNumber: string) {
    var spinner = document.getElementById("spinner-trade");
    spinner.style.display = "block";    

    this.tireService.sellToEndCustomer(tireId, this.user.customerId, vinNumber).subscribe(() => {
      this.reloadTires();

      this.showHideNotification(spinner, `Tire sold to customer's car ${vinNumber}`);
    }, (err) => {
      console.error(err);
      this.showHideNotification(spinner, `Failed to sell tire to customer`, false);
    });
  }
}
