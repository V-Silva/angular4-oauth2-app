import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Product } from './product';
import { Client } from './client';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs';

@Injectable()
export class AppService {
  
  private prodsUrl = 'http://localhost:8082/spring-oauth2-ws/prods/';
  private clientsUrl = 'http://localhost:8082/spring-oauth2-ws/clients/';
  private authUrl = 'http://localhost:8081/spring-oauth2-server/oauth/token';

  constructor(private _router: Router, private _http: Http) { }

  receiveAccessToken(loginData) {
    const params = new URLSearchParams();
    params.append('username', loginData.username);
    params.append('password', loginData.password);
    params.append('grant_type', 'password');
    params.append('client_id', loginData.client+'ClientIdPassword');

    const headers = new Headers({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization': 'Basic ' + btoa(loginData.client+"ClientIdPassword:secret")
    });
    const options = new RequestOptions({ headers: headers });
    console.log(params.toString());
    this._http.post(this.authUrl, params.toString(), options)
      .map(res => res.json())
      .subscribe(
      data => this.saveToken(data),
      err => alert('Invalid Credentials')
      );
  }

  saveToken(token) {
    const expireDate = new Date().getTime() + (1000 * token.expires_in);
    Cookie.set("access_token", token.access_token, expireDate);
    Cookie.set("scope", token.scope, expireDate);
    this._router.navigate(['/']);
  }


  getScope(el: string) {
    const scope: String = String(Cookie.get('scope'));
    if (scope != undefined && scope.split(' ').indexOf(el) >= 0) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    Cookie.delete('access_token');
    Cookie.delete('scope');
    this._router.navigate(['/login']);
  }

  checkCredentials() {
    if (!Cookie.check('access_token')) {
      this._router.navigate(['/login']);
    }
  }

  getRequestOptions(json: boolean): RequestOptions {
    let contentType = 'application/x-www-form-urlencoded; charset=utf-8';

    if (json) {
      contentType = 'application/json';
    }

    const headers = new Headers({
      'Content-type': contentType,
      'Authorization': 'Bearer ' + Cookie.get('access_token')
    });

    return new RequestOptions({ headers: headers });
  }


  // Products
  getProducts() {
    return this._http.get(this.prodsUrl, this.getRequestOptions(false))
      .map((res: Response) => res.json()).toPromise();
  }

  createProduct(product: Product) {
    const prod = new Product(Math.floor(Math.random() * 100), product.name, product.price, product.status);
    return this._http.post(this.prodsUrl, JSON.stringify(prod), this.getRequestOptions(true))
      .map((res: Response) => res.json()).toPromise();
  }


  // Clients
  getClients() {
    return this._http.get(this.clientsUrl, this.getRequestOptions(false))
      .map((res: Response) => res.json()).toPromise();
  }

  createClient(client: Client) {
    const cli = new Client(Math.floor(Math.random() * 100), client.name, client.status);
    return this._http.post(this.clientsUrl, JSON.stringify(cli), this.getRequestOptions(true))
      .map((res: Response) => res.json()).toPromise();
  }

}
