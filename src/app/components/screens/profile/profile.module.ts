import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { Base64ToImagePipe } from './base64-to-img.pipe';
@NgModule({
    imports: [
        CommonModule,
        ProfileRoutingModule,
        FieldsetModule,
        InputTextModule,
        AvatarModule
    ],
    declarations: [ProfileComponent, Base64ToImagePipe],
})
export class ProfileModule { }
