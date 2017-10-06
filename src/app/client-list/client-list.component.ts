import { Client } from '../client';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {

  httpStatus: number = undefined;

  clients: Array<Client> = [];

  constructor(private _service: AppService) { }

  ngOnInit() {
    this.getClients();
  }

  getClients() {
    this._service.getClients()
      .then((clients) => {
        this.clients = clients;
        this.httpStatus = 200;
      })
      .catch((error: Response) => {
        console.log(error.status);
        this.httpStatus = error.status;
      });
  }

}
