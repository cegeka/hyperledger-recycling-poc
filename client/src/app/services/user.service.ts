import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map'
import { Injectable } from '@angular/core';
import { BaseResourceService, HTTP_VERB } from './base-resource.service';

@Injectable()
export class UserService extends BaseResourceService {
  public loggedInUser: any;
  public loggedInUserName: string;
  public loggedInRole: UserRole;

  public cleanup() {
    this.loggedInUser = null;
    this.loggedInRole = null;
    this.loggedInUserName = null;
  }

  // retrieve customers
  getCustomers(): Observable<any> {
    return this.jsonRequest(`Customer`, HTTP_VERB.GET);
  }

  // create customer
  createCustomer(customerId: string, password: string, firstName: string, lastName: string): Observable<any> {    
    return this.jsonRequest(`Customer`, HTTP_VERB.POST, {
      customerId: customerId,
      password: password,
      firstName: firstName,
      lastName: lastName
    });
  }

  // update customer
  updateCustomer(id: string, firstName: string, lastName: string): Observable<any> {    
    return this.jsonRequest(`Customer/${id}`, HTTP_VERB.PUT, {
      id: id,
      firstName: firstName,
      lastName: lastName
    });
  }

   // update customer
  updateAccount(id: string, firstName: string, lastName: string): Observable<any> {    
    return this.jsonRequest(`Customer/${id}`, HTTP_VERB.PUT, {
      id: id,
      firstName: firstName,
      lastName: lastName
    });
  }

  // delete customer
  deleteCustomer(id: string): Observable<any> {    
    return this.jsonRequest(`Customer/${id}`, HTTP_VERB.DELETE, {
      id: id
    });
  }

  // log in with role
  public loginWithRole(userName: string, userRole: UserRole, password: string): Observable<UserRole> {
    
    // clean up state
    this.cleanup();

    if (!userName) {
      return new Observable<UserRole>(observer => observer.error('Missing user name'));
    }
    if (!userRole) {
      return new Observable<UserRole>(observer => observer.error('User role cannot be determined'));
    }

    return this.jsonRequest(`${userRole.toString()}/${userName}`, HTTP_VERB.GET)
      .map((res) => {

        
        if (res.password && password != res.password) {
          throw 'Invalid password';
        }
        
       
        this.loggedInUser = res;
        this.loggedInUserName = res.role ? res.role : userRole;
        this.loggedInRole = userRole;
        return userRole;
      });
  }

  public login(userName: string, password: string): Observable<UserRole> {
    const userRole = this.getUserRole(userName);

    return this.loginWithRole(userName, userRole, password);
  }

  private getUserRole(userName): UserRole {
    if (!userName) {
      return null;
    }
    // TODO: figure out on which user class to check, based on user name

    if (userName.indexOf('admin') !== -1) {
      return UserRole.Admin;
    }

    return UserRole.Customer;
  }
}

//
//  Enum with the types of user classes supported by the application.
//  The string value maps to the URL generated by the composer rest API tool
export enum UserRole {
  Admin = 'Admin',
  Customer = 'Customer',
  Manufacturer = 'Manufacturer',
  Distributor = "Distributor",
  Retailer = "Retailer",
  Recycling = "Recycling"
};
