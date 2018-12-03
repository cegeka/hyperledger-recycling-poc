import { Router } from '@angular/router';
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BaseResourceService, HTTP_VERB } from './base-resource.service';

@Injectable()
export class HistoryService extends BaseResourceService {

  getBlockchainOverview(): Observable<any> {
    return this.jsonRequest('system/historian', HTTP_VERB.GET);
  }

  getTx(transactionId: string): Observable<any> {
    return this.jsonRequest(`system/historian/${transactionId}`, HTTP_VERB.GET);
  }

  getAssetTransferredTx(transactionId: string): Observable<any> {
    return this.jsonRequest(`Trade/${transactionId}`, HTTP_VERB.GET);
  }


}
