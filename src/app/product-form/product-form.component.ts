import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Product } from '../product';
import { AppService } from '../app.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

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
        this.forbiddenNameValidator(/product/i)
      ]),
      price: new FormControl("", [
        Validators.required,
        Validators.min(0.01),
        Validators.max(9999.99)
      ]),
      status: new FormControl("Active")
    });

  }

  onSubmit(product) {
    console.log(product);
    this._service.createProduct(product)
      .then((response: Response) => {
        this.httpStatus = 200;
      }
      )
      .catch((error: Response) => {
        console.log(error.status);
        this.httpStatus = error.status;
      });

    this.form.reset();
    // this._router.navigate(['productList']);
  }




  forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { 'forbiddenName': { value: control.value } } : null;
    };
  }

}
