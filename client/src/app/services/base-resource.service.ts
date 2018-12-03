import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map'
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export abstract class BaseResourceService {

  protected apiUrl: string;

  constructor(protected http: Http) {
    this.apiUrl = environment.ApiServerUrl;
  }

  /**
   * Perform a request to a certain path at the API. If this request is userChange, you *must* pass
   * a valid loginPath parameter. If the request fails because of authentication, the user will be taken
   * to the login page, and after successful login taken back to the original page.
   */

  protected request(path: string,
    verb: HTTP_VERB,
    args?: any): Observable<any> {
    const finalPath = this.apiUrl + path;
    let response;
    switch (verb) {
      case HTTP_VERB.POST:
        response = this.http.post(finalPath, args, { withCredentials: true });
        break;
      case HTTP_VERB.GET:
        response = this.http.get(finalPath, { search: args, withCredentials: true });
        break;
      case HTTP_VERB.DELETE:
        response = this.http.delete(finalPath, { search: args, withCredentials: true });
        break;
      case HTTP_VERB.PUT:
        response = this.http.put(finalPath, args, { search: args, withCredentials: true });
        break;
    }
    return response;
  }

  protected jsonRequest(path: string,
    verb: HTTP_VERB,
    args?: any): Observable<any> {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    
    return this.request(path, verb, args).map(response => response.json());
  }

  private tryToExtractMessage(errorResponse: any) {
    try {
      const jsonBody = errorResponse.json();
      if (jsonBody.message) {
        return jsonBody.message;
      }
    } catch (e) {
      // Ignore
    }
    return errorResponse;
  }
}

export enum HTTP_VERB {
  GET,
  POST,
  DELETE,
  PUT
}