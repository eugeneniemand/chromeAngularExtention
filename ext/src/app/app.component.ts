import { Headers, Http } from '@angular/http';
///<reference path="../scripts/chrome/chrome.d.ts" />
import { EventPage } from '../eventPage/eventPage';
import { Component } from '@angular/core';

import 'rxjs/add/operator/toPromise';

interface User {
  address: string
  email: string
  fullname: string
  id: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  /**
   *
   */

  constructor(private eventPage: EventPage, private http: Http) {
    this.authToken = this.eventPage.authToken
    this.email = this.eventPage.email
    this.getAddress()
  }
  authToken: string
  email: string
  password: string
  loginError: boolean = false
  userAddressDetails: Object

  ngOnInit() {
    this.getAddress()
  }

  get authenticated(): boolean {
    return this.authToken != ""
  }

  login() {
    console.log("Login")
    this.loginError = false
    let payLoad = new Object(
      {
        "email": this.email,
        "password": this.password
      }
    )
    console.log("payload", payLoad)
    let postResp;
    this.http
      .post("http://10.44.4.57:5000/api/v1/auth/login", payLoad)
      .toPromise()
      .then(postResp => {
        this.authToken = postResp.json().token
        this.eventPage.authToken = this.authToken
        this.eventPage.email = this.email
      })
      .catch(
      (ex) => {
        this.loginError = true
      })
  }

  getAddress() {
    this.http
      .get("http://10.44.4.57:5000/api/v1/users")
      .toPromise()
      .then(
      response => {
        let users = response.json()
        for (let user of users) {
          if (user.email == this.email) {
            console.log(user.address)
            this.userAddressDetails = user.address
          }
        }
      })

  }

  logout() {
    console.log("logout")
    this.authToken = ""
    this.eventPage.authToken = ""
    this.loginError = false
  }
}
