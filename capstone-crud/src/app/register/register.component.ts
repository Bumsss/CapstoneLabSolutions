import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { RegisterService } from '../services/register.service';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatIconModule
  ]
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;

  constructor(private registerService: RegisterService, private router: Router,  private snackBar: MatSnackBar
    ) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      FirstName: new FormControl('', Validators.required),
      LastName: new FormControl('', Validators.required),
      Birthdate: new FormControl('', Validators.required),
      StudentNum: new FormControl('', Validators.required)
      // Add other form controls as needed...
    });
  }

  onSubmit() {
    const FirstName = this.registerForm.get('FirstName')!.value;
    const LastName = this.registerForm.get('LastName')!.value;
    const Birthdate = this.registerForm.get('Birthdate')!.value;
    const StudentNum = this.registerForm.get('StudentNum')!.value;

    // Construct username and password
    const UserName = StudentNum;
    const Password = this.formatPassword(Birthdate);

    this.registerService.register(UserName, Password, FirstName, LastName, Birthdate, StudentNum).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        this.snackBar.open('Registration successful!', 'Close', {
          duration: 5000, // Adjust the duration as needed
          panelClass: 'success-snackbar' // You can define your CSS class for styling
        });
  
        this.router.navigate(['']);
      },
      (error) => {
        // Handle registration error
        console.error('Registration error:', error);
      }
    );
  }

  // Utility function to format password (mmddyyyy)
  private formatPassword(birthdate: string): string {
    const dateParts = birthdate.split('-');
    const month = dateParts[1];
    const day = dateParts[2];
    const year = dateParts[0];
    return month + day + year;
  }
}
