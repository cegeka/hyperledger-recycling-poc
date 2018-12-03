import { UserService } from './../../services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort, MatTableDataSource, MatSortable, Sort } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-blockchain',
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.css']
})
export class BlockchainComponent implements OnInit {
  blockchainRecords: Array<any>;
  displayedColumns = ['transactionType', 'transactionTimestamp', 'transactionId', 'details'];
  dataSource: any

  @ViewChild(MatSort) sort: MatSort;

  constructor(private historyService: HistoryService, private userService: UserService, private router: Router) {
    this.blockchainRecords = [];
  }

  ngOnInit() {
    if (!this.userService.loggedInUser) {
      this.router.navigate(['/login']);
    }

    this.historyService.getBlockchainOverview().subscribe((response) => {
      this.blockchainRecords = Array.of(response)[0];
      this.dataSource = new MatTableDataSource(this.blockchainRecords);
      this.dataSource.sort = this.sort;
    })
  }

  getInvoker(id: string) {
    console.log(id)
    return this.historyService.getTx(id);
  }
}

export interface Element {
  transactionId: string;
  transactionType: string;
  transactionTimestamp: string;
  participantInvoking: string
}
