import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Client } from '../client';
import { AppService } from '../app.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {

  httpStatus: number = undefined;

  form;

  constructor(private _service: AppService,
    private _router: Router) { }

  ngOnInit() {

    this.httpStatus = undefined;

    this.form = new FormGroup({
      name: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10),
        this.forbiddenNameValidator(/client/i)
      ]),
      status: new FormControl("Active")
    });

  }

  onSubmit(client) {
    console.log(client);
    this._service.createClient(client)
      .then((response: Response) => {
        this.httpStatus = 200;
      }
      )
      .catch((error: Response) => {
        console.log(error.status);
        this.httpStatus = error.status;
      });

    this.form.reset();
    // this._router.navigate(['clientList']);
  }


  forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { 'forbiddenName': { value: control.value } } : null;
    };
  }

}
