import { NgModule, Injectable } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsumableReportsComponent } from './consumable-reports.component';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
@NgModule({
  declarations: [ConsumableReportsComponent],
  imports: [FormsModule, ReactiveFormsModule],
  exports: [ConsumableReportsComponent],
  providers: [],
})
export class ConsumableReportsComponentModule {
  private baseUrl = 'http://localhost:8085/api';

  constructor(private http: HttpClient) {}

  getConsumables(): Observable<any> {
    return this.http.get('http://localhost:8085/api/consumableTrans');
  }
}
