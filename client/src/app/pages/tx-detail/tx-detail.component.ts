import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HistoryService } from '../../services/history.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tx-detail',
  templateUrl: './tx-detail.component.html',
  styleUrls: ['./tx-detail.component.css']
})
export class TxDetailComponent implements OnInit {
  json: Array<any>;
  id: string;
  TransactionTypeKey = "transactionType";

  constructor(private historyService: HistoryService, private userService: UserService, private route: ActivatedRoute, private router: Router, private location: Location) {
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    if (!this.userService.loggedInUser) {
      this.router.navigate(['/login']);
    }
    
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.json = [];
    this.historyService.getTx(this.id).subscribe((response) => {
      for (let key in response) {
        this.json.push({ key: key, value: response[key] });
      }
      this.addSpecificTx();
    });
  }

  // Support for custom transaction types
  addSpecificTx() {
    for (let jsonItem of this.json) {
      if (jsonItem.key == this.TransactionTypeKey) {
        if(jsonItem.value.indexOf('ImportTires') != -1) {
          jsonItem.value = 'Import tires';
          this.addTiresImported();
        } else if(jsonItem.value.indexOf('SellToEndCustomer') != -1) {
          jsonItem.value = 'Sell tire to customer';
          this.addSellTireToCustomer();        
        } else if(jsonItem.value.indexOf('Sell') != -1) {
          jsonItem.value = 'Sell tire';
          this.addSellTire();
        } else if(jsonItem.value.indexOf('Recycle') != -1) {
          jsonItem.value = 'Recycle tires on car';
          this.addRecycleTiress();
        }
      } else if (jsonItem.key == 'eventsEmitted' && jsonItem.value.length > 0) {
          this.addEvents(jsonItem.value);
      }
    }
  }

  addEvents(eventsArray: any[]) {
    let flatEvents = {
      RecycledTiresList: eventsArray.filter(t => t['$class'] && t['$class'].indexOf('ObtainRecyclingFee') != -1)
        .map(event => event.tire)
    };

    this.addAllFields(flatEvents);
  }

  addTiresImported() {
    this.historyService.getImportTiresTx(this.id).subscribe(this.addAllFields.bind(this));
  }

  addSellTireToCustomer() {
    this.historyService.getSellToEndCustomerTx(this.id).subscribe(this.addAllFields.bind(this));
  }

  addSellTire() {
    this.historyService.getSellTx(this.id).subscribe(this.addAllFields.bind(this));
  }

  addRecycleTiress() {
    this.historyService.getRecycleTx(this.id).subscribe(this.addAllFields.bind(this));
  }

  private addAllFields(response) {
    for (let key in response) {
      if (!this.jsonContainsInfo(key)) {
        this.json.push({ key: key, value: response[key] });
      }
    }
  }

  private jsonContainsInfo(key: string) {
    for (let item of this.json) {
      if(item.key == key) {
        return true;
      }
    }
    return false;
  }
}
