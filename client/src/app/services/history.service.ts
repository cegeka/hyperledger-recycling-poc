import { Observable } from "rxjs/Observable";
import { Injectable } from '@angular/core';
import { BaseResourceService, HTTP_VERB } from './base-resource.service';

@Injectable()
export class HistoryService extends BaseResourceService {

  getBlockchainOverview(): Observable<any> {
    return this.jsonRequest('system/historian', HTTP_VERB.GET);
  }

  getTx(transactionId: string): Observable<any> {
    return this.jsonRequest(`system/historian/${transactionId}`, HTTP_VERB.GET);
  }

  getImportTiresTx(transactionId: string): Observable<any> {
    return this.jsonRequest(`ImportTires/${transactionId}`, HTTP_VERB.GET);
  }

  getSellTx(transactionId: string): Observable<any> {
    return this.jsonRequest(`Sell/${transactionId}`, HTTP_VERB.GET);
  }

  getSellToEndCustomerTx(transactionId: string): Observable<any> {
    return this.jsonRequest(`SellToEndCustomer/${transactionId}`, HTTP_VERB.GET);
  }

  getRecycleTx(transactionId: string): Observable<any> {
    return this.jsonRequest(`Recycle/${transactionId}`, HTTP_VERB.GET);
  }
}
