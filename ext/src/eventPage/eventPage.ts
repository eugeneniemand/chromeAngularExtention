import { Headers, Http } from '@angular/http';
///<reference path="../scripts/chrome/chrome.d.ts" />
import { Injectable } from '@angular/core'

@Injectable()

export class EventPage {
    chromeBrowserActionsAvailable: boolean = false
    constructor(private http: Http) {
        if (typeof chrome.browserAction !== 'undefined') {
            this.chromeBrowserActionsAvailable = true
            chrome.browserAction.onClicked.addListener((tab) => {
                if (this.authToken == "")
                    alert("Please login first by going to options")
                this.getSelectedTab(tab)
            });
        } else {
            console.log('EventPage initialized');
        }
    }

    get authToken(): string {
        return localStorage.getItem("authToken")
    }

    set authToken(value: string) {
        localStorage.setItem("authToken", value)
    }

    get email(): string {
        return localStorage.getItem("email")
    }

    set email(value: string) {
        localStorage.setItem("email", value)
    }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Accept', 'application/json')
        headers.append('Authorization', this.authToken) //+ btoa('username:password'));
        headers.append('Cache-Control', 'no-cache')
    }

    getSelectedTab(tab) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);

        chrome.tabs.captureVisibleTab(null, { format: "png" }, (image) => {
            chrome.tabs.getSelected(null, (tab) => {
                let newDoc: Object = {
                    site_name: tab.title,
                    url: tab.url,
                    image_data: image
                };
                console.log(newDoc)            
                this.http
                    .post("http://10.44.4.57:5000/api/v1/upload", newDoc, { headers: headers })
                    .toPromise()
                    .then(result => { 
                        alert("Success")
                        console.log(result) 
                    })
                    .catch(error => { console.log(error) })
            });
        });
    }
}