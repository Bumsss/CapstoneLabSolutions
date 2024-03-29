import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    NgxPaginationModule,
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css',
})
export class ManageUsersComponent {
  users: any[] = [];
  AccessLevels: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;
  p: number = 1;
  itemsPerPage: number = 7;

  searchStudentNum: string = '';
  filteredUsers: any[] = [];

  currentUser: any = {
    UserName: '',
    Password: '',
    LastName: '',
    FirstName: '',
    Birthdate: '',
    StudentNum: '',
    AccessLevelID: '',
    isActive: false,
    AccountID: '',
  };

  constructor(private http: HttpClient) {
    this.getAllUsers();
    this.loadAccessLevels();
  }

  getAllUsers() {
    this.http
      .get('http://localhost:8085/api/users')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;

        this.users = resultData.data;
      });
  }

  addUser() {
    this.http
      .post('http://localhost:8085/api/users/add', this.currentUser)
      .subscribe((resultData: any) => {
        alert('User Added Successfully!');
        this.getAllUsers();
      });
  }

  setUpdate(user: any) {
    this.currentUser = { ...user };
    this.currentUser.AccountID = user.AccountID;
    this.isUpdateFormActive = true;
  }

  toggleActive(currentUser: any) {
    if (currentUser && currentUser.isActive !== undefined) {
      currentUser.isActive = currentUser.isActive === 1 ? 0 : 1;
      currentUser.AccountID = currentUser.AccountID;
      this.UpdateRecords(currentUser);
    } else {
      console.error(
        'currentUser is undefined or does not have an isActive property'
      );
    }
  }

  UpdateRecords(currentUser: any) {
    let bodyData = {
      UserName: currentUser.UserName,
      Password: currentUser.Password,
      LastName: currentUser.LastName,
      FirstName: currentUser.FirstName,
      Birthdate: currentUser.Birthdate,
      StudentNum: currentUser.StudentNum,
      isActive: currentUser.isActive,
      AccessLevelID: currentUser.AccessLevelID,
    };

    this.http
      .put(
        `http://localhost:8085/api/users/update/${currentUser.AccountID}`,
        bodyData
      )
      .subscribe((resultData: any) => {
        alert('User Updated Successfully!');
        this.getAllUsers();
      });
  }

  save(user: any) {
    if (!user.AccountID) {
      this.addUser();
    } else {
      this.UpdateRecords(user);
    }
  }

  deleteUser(user: any) {
    this.http
      .delete(`http://localhost:8085/api/users/delete/${user.AccountID}`)
      .subscribe(
        () => {
          this.getAllUsers();
        },
        (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user. Please try again later.');
        }
      );
  }

  setCurrentUser(user: any) {
    this.currentUser = { ...user };
    this.currentUser.AccountID = user.AccountID;
    this.isUpdateFormActive = true;
  }

  cancelUpdate() {
    this.currentUser = {
      UserName: '',
      Password: '',
      LastName: '',
      FirstName: '',
      Birthdate: '',
      StudentNum: '',
      isActive: false,
      AccountID: '',
    };
    this.isUpdateFormActive = false;
  }

  loadAccessLevels() {
    this.http
      .get('http://localhost:8085/api/access')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;

        this.AccessLevels = resultData.data;
      });
  }

  updateAccessLevel(currentUser: any) {
    this.UpdateRecords(currentUser);
  }

  searchUserByStudentNum() {
    if (this.searchStudentNum.trim() !== '') {
      const searchTerm = this.searchStudentNum.trim();
      this.http
        .get(`http://localhost:8085/api/users/search/${searchTerm}`)
        .subscribe(
          (resultData: any) => {
            if (resultData.status && resultData.user) {
              // Update the filteredUsers array with the search result
              this.filteredUsers = [resultData.user];
            } else {
              alert(resultData.message);
              this.filteredUsers = []; // Clear the filtered users array if no user found
            }
            // Reset pagination to display the searched user if found
            this.p = 1;
          },
          (error) => {
            console.error('Error searching user by StudentNum:', error);
            alert(
              'Error searching user by StudentNum. Please try again later.'
            );
          }
        );
    } else {
      alert('Please enter a Student Number to search.');
    }
  }

  clearSearch() {
    this.searchStudentNum = ''; // Clear the search input
    this.filteredUsers = []; // Clear the filtered users array
    this.p = 1; // Reset pagination to the first page
  }

  sortLastNameAsc() {
    this.users.sort((a, b) =>
      a.LastName > b.LastName ? 1 : b.LastName > a.LastName ? -1 : 0
    );
  }

  // Add sorting function for last name alphabetically descending
  sortLastNameDesc() {
    this.users.sort((a, b) =>
      a.LastName < b.LastName ? 1 : b.LastName < a.LastName ? -1 : 0
    );
  }
}
