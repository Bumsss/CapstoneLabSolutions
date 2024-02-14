import { NgModule } from '@angular/core';
import { ManageUsersComponent } from './manage-users.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [ManageUsersComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  exports: [ManageUsersComponent],
  providers: [],
})
export class ManageUsersComponentModule {}
