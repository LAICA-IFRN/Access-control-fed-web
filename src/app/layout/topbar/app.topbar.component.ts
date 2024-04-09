import { UserAuthenticatedModel } from './../../models/users/user-authenticated.model';
import { AuthService } from './../../services/auth.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "../service/app.layout.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {
    items!: MenuItem[];
    userAuthenticated: UserAuthenticatedModel;
    
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, public authService: AuthService) { }

    ngOnInit(): void {
        this.userAuthenticated = this.getUserDetail();
        this.items = [
            { label: `Nome: ${this.userAuthenticated.name}`, icon: 'pi pi-user' },
            { label: `E-mail: ${this.userAuthenticated.email}`, icon: 'pi pi-send' },
            { label: `Matricula: ${this.userAuthenticated.document}`, icon: 'pi pi-id-card' }
        ];

    }

    public logout(): void {
        this.authService.logout();
    }

    public getUserDetail(): UserAuthenticatedModel {
        const userDetail: UserAuthenticatedModel = JSON.parse(sessionStorage.getItem("USER_DETAIL"));
        return userDetail;
    }
}
