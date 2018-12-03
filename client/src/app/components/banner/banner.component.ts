import { Component, OnInit } from '@angular/core';
import { UserService, UserRole } from '../../services/user.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  reduction: any;
  UserRole = UserRole; // used in the HTML ngIf conditions
  monitorUrl: string;

  constructor(private userService: UserService) {
    this.monitorUrl = environment.MonitorUrl;
  }

  ngOnInit() {    
  }
}
