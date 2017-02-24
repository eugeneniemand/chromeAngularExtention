import { stringify } from '@angular/compiler/testing/facade/lang';
import { Http, Headers } from '@angular/http';
import { Component } from '@angular/core';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: Http) {

  }

  get passwordMatch(): boolean {
    return this.password == this.password_conf
  }

  email: string
  password: string
  password_conf: string

  fullname: string
  street_number: string
  route: string
  postal_town: string
  administrative_area_level_2: string
  administrative_area_level_1: string
  locality: string
  postal_code: string

  

  async register() {
    if (!this.passwordMatch) {
      return
    }

    let payLoad = new Object({
      "fullname": this.fullname,
      "email": this.email,
      "password": this.password,
      "password_conf": this.password_conf,
      "street_number": this.street_number,
      "route": this.route,
      "locality": this.locality,
      "postal_town": this.postal_town,
      "administrative_area_level_2": this.administrative_area_level_2,
      "administrative_area_level_1": this.administrative_area_level_1,
      "postal_code": this.postal_code,
      "country": "United Kingdom"
    })

    console.log("payload", payLoad)
    let headers = new Headers({ 'content-type': 'application/json' })
    let postResp = await this.http
      .post("http://10.44.4.57:5000/api/v1/auth/register", payLoad, headers)
      .toPromise()
    console.log(postResp)

    // let headers = new Headers({ 'Access-Control-Allow-Origin': '*' })
    // console.log("Test Get", headers)
    // let response = await this.http
    //   .get("http://demo7238467.mockable.io")
    //   .toPromise()
    // console.log(response.json())
    // let users = response.json()
  }
}
