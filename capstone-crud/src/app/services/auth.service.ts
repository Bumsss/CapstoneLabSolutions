import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser: any = null;
  private isAuthenticated: boolean = false;

  constructor(private dataService: DataService, private http: HttpClient) {}

  login(UserName: string, Password: string): Observable<any | null> {
    return this.dataService.getUsers().pipe(
      tap((response) =>
        console.log('Users received in AuthService:', response)
      ),
      map((response: any[]) => {
        if (Array.isArray(response) && response.length >= 2) {
          const users = response[1];
          const user = users.find(
            (u: any) => u.UserName === UserName && u.Password === Password
          );
          if (user && user.isActive === 1) {
            this.currentUser = { ...user, AccountID: user.AccountID };
            this.isAuthenticated = true;
            console.log('User logged in:', {
              UserName: user.UserName,
            });
            return user;
          } else if (user && user.isActive === 0) {
            console.log('User found but not active. Cannot login.');
            return 'not_approved';
          } else {
            console.log('User not found or invalid credentials');
            return null;
          }
        } else {
          console.error('Invalid response from DataService:', response);
          return null;
        }
      }),
      catchError((error) => {
        console.error('Error fetching users:', error);
        return of(null);
      })
    );
  }

  logout(): void {
    const confirmLogout = confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      this.currentUser = null;
      this.isAuthenticated = false;
    }
  }

  getCurrentUser(AccountID?: number): Observable<any> {
    if (this.currentUser && this.currentUser.AccountID) {
      return of(this.currentUser);
    } else {
      const userID =
        AccountID || (this.currentUser && this.currentUser.AccountID);
      if (!userID) {
        console.error('No valid current user or AccountID');
        return throwError('No valid current user or AccountID');
      }
      return this.dataService.getUsersByAccountID(userID).pipe(
        tap((user) => {
          this.currentUser = user;
        }),
        catchError((error) => {
          console.error('Error fetching current user:', error);
          return throwError(error);
        })
      );
    }
  }

  // getUserByAccountID(AccountID: number): Observable<any> {
  //   return this.dataService.getUsersByAccountID(AccountID).pipe(
  //     map(users => users[0]) // Assuming there's only one user for a given AccountID
  //   );
  // }
  getUserByAccountID(AccountID: number): Observable<any> {
    return this.dataService.getUsersByAccountID(AccountID).pipe(
      map((users) => {
        if (Array.isArray(users) && users.length > 0) {
          return users[0]; // Return the first user if the array is not empty
        } else {
          throw new Error('No user found for the given AccountID');
        }
      }),
      catchError((error) => {
        console.error('Error fetching user data:', error);
        throw error; // Re-throw the error to propagate it to the caller
      })
    );
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  updateCurrentUser(updatedUserData: any): void {
    // Update the currentUser property with the updated user data
    this.currentUser = { ...this.currentUser, ...updatedUserData };
  }

  private beforeUnloadListener: EventListenerOrEventListenerObject | null =
    null;
  confirmLogoutOnRefresh(): void {
    this.beforeUnloadListener = (event: BeforeUnloadEvent) => {
      // Prompt the user with a confirmation dialog
      const confirmationMessage =
        'Are you sure you want to refresh? You will be logged out.';
      (event || window.event).returnValue = confirmationMessage;
      return confirmationMessage;
    };
    window.addEventListener('beforeunload', this.beforeUnloadListener);
  }

  // Call this method to remove the event listener
  removeLogoutConfirmation(): void {
    if (this.beforeUnloadListener) {
      window.removeEventListener('beforeunload', this.beforeUnloadListener);
      this.beforeUnloadListener = null;
    }
  }
}
