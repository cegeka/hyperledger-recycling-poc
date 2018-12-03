import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, UserRole } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error: string;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userService.cleanup();
  }

  login(user: string, password: string) {
    this.error = '';
    this.userService.login(user, password).subscribe((role) => {
        if (role === UserRole.Customer) {
          this.router.navigate(['/customer']);
        } else if (role === UserRole.Admin) {
          this.router.navigate(['/admin']);
        }
      },
      (error) => {
        if (typeof(error) == 'string') {
          this.error = error
        } else {
          this.error = "Login failed";
        }
        console.error('Login failed', error);
    });
  }

}
