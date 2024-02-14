import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsComponent } from './reports.component';

@NgModule({
  declarations: [ReportsComponent],
  imports: [FormsModule, ReactiveFormsModule],
  exports: [ReportsComponent],
  providers: [],
})
export class ReportsComponentModule {}
