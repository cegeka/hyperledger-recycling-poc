import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  user: any;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    this.user = this.userService.loggedInUser;
    if (!this.user) {
      this.router.navigate(['/login']);
      window.location.reload();
    }  
  }

}
