import { Component } from '@angular/core';
import { VuelosService } from 'src/app/services/vuelo.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [VuelosService]
})
export class LoginComponent {

}
