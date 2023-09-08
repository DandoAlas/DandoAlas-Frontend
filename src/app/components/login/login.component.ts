import { Component } from '@angular/core';
import { VuelosService } from 'src/app/services/vuelo.service';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserI } from 'src/app/models/user';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [VuelosService],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onLogin(form: any): void {
    this.authService.login(form.value).subscribe( res => {
      this.router.navigateByUrl('guardar-vuelo');
    });
  }
}
