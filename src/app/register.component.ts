import { Component }        from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import "rxjs/add/operator/map";

@Component({
	    templateUrl: './register.component.html'
})
export class RegisterComponent {

    constructor(private http: Http, private router: Router) { }

    signup(formValue) {
        if (formValue) { console.log(formValue); }

        this.http.post("/signup", JSON.stringify(formValue), new RequestOptions({
                headers: new Headers({ "Content-Type": "application/json" })
            }))
            .map((res: Response) => res.json())
            .subscribe(
                (data: any) => {
                    console.log(data);

                    //localStorage.setItem("id_token", data.jwt);
                    // this.myPopup.hide();
                    // this.isLogged = true;
                    // location.reload();
                },
                (error: Error) => {
                    console.log(error);
                    //this.error = JSON.stringify(error);
                }
            );
    }

}
