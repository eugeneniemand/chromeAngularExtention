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
  }
  authToken: string
  email: string
  password: string
  loginError: boolean = false
  userAddressDetails: Object
  userDocuments: Object[]

  activePage: string = "user"
  activePageCss(page: string): string {
    if (this.activePage == page)
      return "nav-link active"
    else
      return "nav-link"
  }

  selectActivePage(page: string) {
    this.activePage = page
  }

  ngOnInit() {
    if (this.authenticated) {
      this.getAddress()
      this.getDocuments()
    }
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
        this.getAddress()
        this.getDocuments()
      })
      .catch(
      (ex) => {
        this.loginError = true
      })
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Accept', 'application/json')
    headers.append('Authorization', this.authToken) //+ btoa('username:password'));
    headers.append('Cache-Control', 'no-cache')
  }

  getDocuments() {
    // this.userDocuments = [
    //   new Object({ siteTitle: "Barclays", address: "123 High Street, Code Town, AB12CD", match: "Full", cssClass: "fa fa-lg fa-check-square" }),
    //   new Object({ siteTitle: "Sky", address: "123 AB12CD", match: "Partial", cssClass: "fa fa-lg fa-exclamation-triangle" }),
    //   new Object({ siteTitle: "Lebara", address: "123", match: "None", cssClass: "fa fa-lg fa-times-circle" })
    // ]
    let headers: Headers = new Headers()
    this.createAuthorizationHeader(headers)
    console.log(headers)
    this.http
      .get("http://10.44.4.57:5000/api/v1/files", { headers: headers })
      .toPromise()
      .then(
      response => {
        this.userDocuments = response.json()
        console.log(response.json())
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
