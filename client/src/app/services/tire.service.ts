import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map'
import { Injectable } from '@angular/core';
import { BaseResourceService, HTTP_VERB } from './base-resource.service';

@Injectable()
export class TireService extends BaseResourceService {
  private static ns = "com.cegeka.";
  public static ComposerType = 'CarTire';

  getTires(): Observable<any[]> {
    return this.jsonRequest(TireService.ComposerType, HTTP_VERB.GET);
  }

  getTiresForUser(userId: string): Observable<any[]> {
    return this.jsonRequest(TireService.ComposerType, HTTP_VERB.GET)
      .map(tires => tires.filter(t => t.owner && t.owner.split('#')[1] == userId));
  }

  import(userId: string, tireCount: number): Observable<any> {
    return this.jsonRequest(`ImportTires`, HTTP_VERB.POST, {
      importer: TireService.getResource(userId, "Customer"),
      tireCount: tireCount
    });
  }

  sell(tireId: string, sellerId: string, buyerId: string): Observable<any> {
    return this.jsonRequest(`Sell`, HTTP_VERB.POST, {
      seller: TireService.getResource(sellerId, "Customer"),
      newOwner: TireService.getResource(buyerId, "Customer"),
      tire: TireService.getResource(tireId)
    });
  }

  sellToEndCustomer(tireId: string, sellerId: string, vinNumber: string): Observable<any> {
    return this.jsonRequest(`SellToEndCustomer`, HTTP_VERB.POST, {
      seller: TireService.getResource(sellerId, "Customer"),
      vinNumber: vinNumber,
      tire: TireService.getResource(tireId)
    });
  }

  recycle(recyclerId: string, vinNumber: string): Observable<any> {
    return this.jsonRequest(`Recycle`, HTTP_VERB.POST, {
      vehicle: TireService.getResource(vinNumber, "Vehicle"),
      recycling: TireService.getResource(recyclerId, "Customer"),
    });
  }

  private static getResource(name: string, type: string = TireService.ComposerType) {
    return "resource:" + TireService.ns + type + "#" + name;
  }
}
