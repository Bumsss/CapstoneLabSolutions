
import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Data, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../app.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EquipmentCrudComponent } from '../equipment-crud/equipment-crud.component';
// ===================
import { CourseCrudComponent } from '../course-crud/course-crud.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataService } from '../data.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-consumable-crud',
  standalone: true,
  imports: [
    HttpClientModule, 
    RouterOutlet, 
    CommonModule,
    AppComponent, 
    FormsModule, 
    RouterModule, 
    EquipmentCrudComponent, 
    CourseCrudComponent, 
    NgxPaginationModule],
  templateUrl: './consumable-crud.component.html',
  styleUrl: './consumable-crud.component.css',
  providers: [
    DatePipe
  ]
})
export class ConsumableCrudComponent {

  ConsumableArray : any[] = [];
  CourseArray : any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;

  currentID = "";
  CourseID! :number;
  ConsumableName : string = "";
  Quantity ?: number;
  ConsumableStat: string = "";
  ExpirationDate : Date = new Date;

  SelectedCourseID: number | null = null;

  minDate: string;

  p:number = 1;
  itemsPerPage: number = 7;

  constructor(private http: HttpClient, private dataService: DataService, private datePipe: DatePipe){
    this.getAllConsumables();

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit() : void{
    this.loadCourses();

  }

  getAllConsumables() {
    this.http.get("http://localhost:8085/api/consumables")
    .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        console.log(resultData.data);
        this.ConsumableArray = resultData.data;
    });
  }

  register(){
    let bodyData = {
      "ConsumableName" : this.ConsumableName,
      "Quantity" : this.Quantity,
      "ExpirationDate" : this.datePipe.transform(this.ExpirationDate, 'yyyy-MM-dd'),
      "CourseID" : this.CourseID
    };

    this.http.post("http://localhost:8085/api/consumables/add", bodyData)
    .subscribe((resultData: any) => {
      console.log(resultData);
      alert("Consumable Added Successfully!")
      this.getAllConsumables();
    });
  }
//-------------------------------------------------
  // search(){
  //   this.http.get("/api/equipments/:id"+ "/" + this.currentID)
  //   .subscribe((resultData:any) => {
  //     console.log(resultData);
  //     this.getAllEquipments();
  //   });
  // }
//---------------------------------------------------
  setUpdate (data: any){
    this.ConsumableName = data.ConsumableName;
    this.Quantity = data.Quantity;
    this.ExpirationDate = data.ExpirationDate;
    this.CourseID = data.CourseID;
    this.currentID = data.ConsumableID;
  }

  UpdateRecords(){
    let bodyData = {
      "ConsumableName" : this.ConsumableName,
      "Quantity" : this.Quantity,
      "ExpirationDate" : this.datePipe.transform(this.ExpirationDate, 'yyyy-MM-dd'),
      "CourseID" : this.CourseID

    };

    this.http.put("http://localhost:8085/api/consumables/update" + "/" + this.currentID, bodyData)
    .subscribe((resultData: any) =>{
      console.log(resultData);
      alert("Consumable Updated Successfully!")
      this.getAllConsumables();
    });
  }

  save(){
    if(this.currentID == ''){
      this.register();
    } else{
      this.UpdateRecords();
    }
  }

  setDelete (data: any){
    this.http.delete("http://localhost:8085/api/consumables/delete" + "/" + data.ConsumableID)
    .subscribe((resultData:any) =>{
      console.log(resultData);
      alert("Record Deleted")
      this.getAllConsumables();
    });
  }

  getStatusClass(Quantity: number): string{
    if (Quantity <= 0){
      return 'Not-Available';
    } else if (Quantity < 5){
      return 'Low-on-Stock'
    } else {
      return 'Available';
    }
  }
  loadCourses(): void {
    this.dataService.getCourses().subscribe(
      (response: any) => {
        this.CourseArray = response.data;
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  filterConsumables(): void{
    if (this.SelectedCourseID !== null){
      this.dataService.getConsumablesByCourseId(this.SelectedCourseID)
      .subscribe((response: any) => {
        console.log(response);
        this.ConsumableArray = response.data;
      },
      (error) => {
        console.error('Error connecting to API: ', error)
      }
      )
    }
  }

  assignCourse(): void{
    if (this.SelectedCourseID !== null) {
      this.dataService.getConsumablesByCourseId(this.SelectedCourseID)
        .subscribe((response: any) => {
          console.log(response);
          this.ConsumableArray = response.data;
        },
        (error) => {
          console.error('Error connecting to API: ', error);
        }
      );
    }
  }
}
