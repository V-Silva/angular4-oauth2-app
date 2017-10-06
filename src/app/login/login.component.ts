import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginData = {
    username: "",
    password: "",
    client: ""
  };

  constructor(private _service: AppService) { }

  ngOnInit() { }

  login() {
    this._service.receiveAccessToken(this.loginData);
  }

}
