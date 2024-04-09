import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInternalCreateModel } from '../models/users/user-internal-create.model';
import { Observable, catchError } from 'rxjs';
import { UsersInternalResponseModel } from '../models/users/users-internal-response.model';
import { UserExternalCreateModel } from '../models/users/user-external-create.model';
import { UserFilertResponse } from '../models/users/user-filert.response';
import { UserFilertModel } from '../models/users/user-filert.model';
import { UsersDashboardDataModel } from '../models/users/users-dashboard-data.model';
import { InvitationModel } from '../models/users/invitation.model';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private api: string;

    constructor(public httpClient: HttpClient) {
        this.api = environment.api + 'users';
        //this.api = 'http://localhost:8000/users';
    }

    public createInternalUser(request: UserInternalCreateModel): Observable<UsersInternalResponseModel> {
        return this.httpClient.post<UsersInternalResponseModel>(this.api + "/invite", request);
    }

    public createExternalUser(request: UserExternalCreateModel): Observable<any> {
        return this.httpClient.post<any>(this.api, request).pipe(
            catchError((err) => {
                console.log(err);
                return err;
            }
        ));
    }
    
    public getUsers(request: UserFilertModel): Observable<UserFilertResponse> {
        return this.httpClient.post<UserFilertResponse>(this.api + '/paginate', request);
    }
    
    public getDataForDashboard(): Observable<UsersDashboardDataModel> {
        return this.httpClient.get<any>(this.api + '/dashboard');
    }

    public createUserAfterInvitation(request: InvitationModel): Observable<InvitationModel> {
        return this.httpClient.post<any>(this.api + '/frequenter/invited', request);
    }

    public getFrequenterUser(): Observable<any[]> {
        return this.httpClient.get<any>(this.api + '/frequenter');
    }
}
