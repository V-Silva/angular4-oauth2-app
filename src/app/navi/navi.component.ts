import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.css']
})
export class NaviComponent implements OnInit {

  activateProduct = false;
  activateClient = false;

  constructor(private _service: AppService) { }

  ngOnInit() {
    this._service.checkCredentials();
    this.activateProduct = this._service.getScope("product");
    this.activateClient = this._service.getScope("client");
  }

  logout() {
    this._service.logout();
  }

}
