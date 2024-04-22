import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationRoutingModule } from './registration-routing.module';
import { RegistrationComponent } from './registration.component';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { WebcamModule } from 'ngx-webcam';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
    imports: [
        CommonModule,
        RegistrationRoutingModule,
        StyleClassModule,
        ButtonModule,
        WebcamModule,
        InputTextModule,
        InputMaskModule,
        FormsModule,
        InputNumberModule
    ],
    declarations: [RegistrationComponent]
})
export class RegistrationModule { }
