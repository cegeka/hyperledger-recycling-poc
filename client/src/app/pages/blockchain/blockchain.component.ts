import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-blockchain',
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.css']
})
export class BlockchainComponent implements OnInit {
  blockchainRecords: any[];

  constructor(private historyService: HistoryService, private userService: UserService, private router: Router) {
    this.blockchainRecords = [];
  }

  ngOnInit() {
    if (!this.userService.loggedInUser) {
      this.router.navigate(['/login']);
    }

    this.historyService.getBlockchainOverview().subscribe((response) => {
      this.blockchainRecords = response;
    })
  }
}
