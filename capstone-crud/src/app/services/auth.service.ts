// import { Injectable } from '@angular/core';
// import { DataService } from '../data.service';
// import { Observable, of } from 'rxjs';
// import { catchError, map, tap } from 'rxjs/operators';

// const AUTH_API = ''

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private isLogged: boolean = false;

//   constructor(private dataService: DataService) { }

//   // login(UserName: string, Password: string): Observable<any | null> {
//   //   return this.dataService.getUsers().pipe(
//   //     tap((response) => console.log('Users received in AuthService:', response)),
//   //     map((response: any[]) => {
//   //       if (Array.isArray(response) && response.length >= 2) {
//   //         const users = response[1];

//   //         const user = users.find((u: any) => u.UserName === UserName && u.Password === Password);

//   //         if (user) {
//   //           this.isLogged = true;
//   //           console.log('User logged in:', { UserName: user.UserName /* other necessary information */ });
//   //           return user;
//   //         } else {
//   //           this.isLogged = false;
//   //           console.log('User not found or invalid credentials');
//   //           return null;
//   //         }
//   //       } else {
//   //         console.error('Invalid response from DataService: Expected an array with at least two elements but received', response);
//   //         return null;
//   //       }
//   //     }),
//   //     catchError((error) => {
//   //       console.error('Error fetching users:', error);
//   //       return of(null);
//   //     })
//   //   );
//   // }
//   login(UserName: string, Password: string): Observable<any | null> {
//     return this.dataService.getUsers().pipe(
//       tap((response) => console.log('Users received in AuthService:', response)),
//       map((response: any[]) => {
//         // Check if the response is an array and has at least two elements
//         if (Array.isArray(response) && response.length >= 2) {
//           const users = response[1]; // Assuming users are at index 1

//           const user = users.find((u: any) => u.UserName === UserName && u.Password === Password);

//           if (user && user.isActive === 1) {
//             // User found and isActive is 1
//             this.isLogged = true;
//             console.log('User logged in:', { UserName: user.UserName /* other necessary information */ });
//             return user;
//           } else if (user && user.isActive === 0) {
//             // User found but isActive is 0, do not allow login
//             console.log('User found but not active. Cannot login.');
//             return 'not_approved'; // Return a special value to indicate not approved
//           } else {
//             // User not found or invalid credentials
//             this.isLogged = false;
//             console.log('User not found or invalid credentials');
//             return null;
//           }
//         } else {
//           console.error('Invalid response from DataService: Expected an array with at least two elements but received', response);
//           return null;
//         }
//       }),
//       catchError((error) => {
//         console.error('Error fetching users:', error);
//         return of(null);
//       })
//     );
//   }

//   logout(): void {
//     this.isLogged = false;
//   }

//   isAuthenticated(): boolean {
//     return this.isLogged;
//   }
// }
import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token'; // Key for storing token in local storage
  private currentUser: any; // Property to store the current user

  constructor(private dataService: DataService) {}

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
            // Generate token and store it
            const token = this.generateToken();
            this.storeToken(token);
            this.currentUser = user; // Store the current user
            console.log('User logged in:', {
              UserName: user.UserName /* other necessary information */,
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
          console.error(
            'Invalid response from DataService: Expected an array with at least two elements but received',
            response
          );
          return null;
        }
      }),
      catchError((error) => {
        console.error('Error fetching users:', error);
        return of(null);
      })
    );
  }

  private generateToken(): string {
    // Generate a random token (you may use a proper token generation library)
    return Math.random().toString(36).substr(2); // Example token generation
  }

  private storeToken(token: string): void {
    // Store token in local storage
    localStorage.setItem(this.tokenKey, token);
  }

  logout(): void {
    // Remove token from local storage
    localStorage.removeItem(this.tokenKey);
    this.currentUser = null; // Clear the current user on logout
  }

  getCurrentUser(): any {
    // Return the current user
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    // Check if localStorage is defined
    if (typeof localStorage !== 'undefined') {
      // Check if token exists in local storage
      return !!localStorage.getItem(this.tokenKey);
    }
    return false; // Return false if localStorage is not available
  }
}
