import { Component, Inject, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserAuthenticatedModel } from 'src/app/models/users/user-authenticated.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {
    valCheck: string[] = ['remember'];
    password: string;
    email: string;

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router
    ) { }

    login() {
        sessionStorage.removeItem("AUTH_TOKE");
        this.authService.login(this.email, this.password).subscribe({
            next: (res) => {
                if (res?.accessToken) {
                    sessionStorage.setItem("AUTH_TOKE", res.accessToken);
                    this.authService.token = res.accessToken;
                    const helper = new JwtHelperService();
                    const decodedToken = helper.decodeToken(res.accessToken);
                    console.log(decodedToken);
                    // Other functions
                    const expirationDate = helper.getTokenExpirationDate(res.accessToken);
                    console.log(expirationDate);
                    const isExpired = helper.isTokenExpired(res.accessToken);
                    console.log(isExpired);
                    this.authService.userDatail(decodedToken.sub).subscribe({
                        next: (res) => {
                            if (res && res?.id) {
                                const userDetail: UserAuthenticatedModel = new UserAuthenticatedModel(res);
                                sessionStorage.setItem("USER_DETAIL", JSON.stringify(userDetail));
                                this.router.navigate([""]);
                            }
                        }
                    })
                }
            }
        });
    }
}
