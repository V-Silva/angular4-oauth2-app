import { Product } from '../product';
import { Component, OnInit, OnChanges } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  httpStatus: number = undefined;

  products: Array<Product> = [];

  constructor(private _service: AppService) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this._service.getProducts()
      .then((products) => {
        this.products = products;
        this.httpStatus = 200;
      })
      .catch((error: Response) => {
        console.log(error.status);
        this.httpStatus = error.status;
      });
  }

}
