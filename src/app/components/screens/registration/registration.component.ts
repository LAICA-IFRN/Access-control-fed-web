import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { InvitationModel } from 'src/app/models/users/invitation.model';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html'
})
export class RegistrationComponent implements OnInit {
    private trigger: Subject<void> = new Subject();
    public webcamImage!: WebcamImage;
    private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
    public multipleWebcamsAvailable = false;
    public captureImage = '';
    public allowCameraSwitch = false;
    // toggle webcam on/off
    public showWebcam = true;
    public deviceId!: string;
    public facingMode: string = 'user';
    public errors: WebcamInitError[] = [];

    invitationModel: InvitationModel;
    submitted: boolean = false;

    constructor(
        public layoutService: LayoutService, 
        public router: Router,
        private activatedRoute: ActivatedRoute,
        public usersService: UsersService
    ) {
        WebcamUtil.getAvailableVideoInputs().then(
            (mediaDevices: MediaDeviceInfo[]) => {
                this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
            }
        );
    }

    async ngOnInit(): Promise<void> {
        this.invitationModel = new InvitationModel();
        const queryParams = this.activatedRoute.queryParams;
        this.invitationModel.userId = await queryParams['_value'].id;
        this.invitationModel.token = await queryParams['_value'].token;
    }

    requiredField(field: any): boolean {
        if (this.submitted && !field) {
            return true;
        }

        return false;
    }

    async onSubmit(): Promise<void> {
        this.submitted = true;
        const firstComma = this.captureImage.indexOf(',');
        this.invitationModel.encodedUserImage = this.captureImage.substring(firstComma + 1);
        await this.createUser();
    }

    async createUser() {
        this.usersService.createUserAfterInvitation(this.invitationModel).subscribe(
            (response: any) => {
                this.router.navigate(['/app/users']);
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    // Capture Image
    public triggerSnapshot(): void {
        this.trigger.next();
    }

    // ON OFF Camera
    public toggleWebcam(): void {
        this.showWebcam = !this.showWebcam;
    }

    // Switch to next camera device if avaiable
    public showNextWebcam(directionOrDeviceId: boolean | string): void {
        this.nextWebcam.next(directionOrDeviceId);
    }

    public handleInitError(error: WebcamInitError): void {
        this.errors.push(error);
    }

    public handleImage(webcamImage: WebcamImage): void {
        this.webcamImage = webcamImage;
        this.captureImage = webcamImage!.imageAsDataUrl;
    }

    public get triggerObservable(): Observable<any> {
        return this.trigger.asObservable();
    }

    public get nextWebcamObservable(): Observable<any> {
        return this.nextWebcam.asObservable();
    }

    public get videoOptions(): MediaTrackConstraints {
        const result: MediaTrackConstraints = {};
        if (this.facingMode && this.facingMode !== '') {
            result.facingMode = { ideal: this.facingMode };
        }
        return result;
    }

}
