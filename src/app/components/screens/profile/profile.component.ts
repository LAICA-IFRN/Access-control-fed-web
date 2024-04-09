import { Component, OnInit } from '@angular/core';
import { UserAuthenticatedModel } from 'src/app/models/users/user-authenticated.model';
import { Base64ToImagePipe } from './base64-to-img.pipe';

@Component({
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit { 

    userAuthenticated: UserAuthenticatedModel;
    userType: string;
    documentType: string;

    constructor() { }

    ngOnInit() {
        this.userAuthenticated = this.getUserDetail();
        console.log(this.userAuthenticated); // TODO: encodedImage está undefined, resolva
        if (this.userAuthenticated.documentType === 1) {
            this.userType = "Interno";
            this.documentType = "Mátricula"
        } else {
            this.userType = "Externo";
            if (this.userAuthenticated.documentType === 2) {
                this.documentType = "CPF";
            } else if (this.userAuthenticated.documentType === 3) {
                this.documentType = "CNPJ";
            } else {
                this.documentType = "Passaporte";
            }
        }
    }

    public getUserDetail(): UserAuthenticatedModel {
        const userDetail: UserAuthenticatedModel = JSON.parse(sessionStorage.getItem("USER_DETAIL"));
        return userDetail;
    }
}