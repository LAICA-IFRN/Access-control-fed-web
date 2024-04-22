import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './components/screens/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { authGuard } from './guards/auth.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent, canActivate: [authGuard],
                children: [
                    { path: '', loadChildren: () => import('./components/screens/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'app', loadChildren: () => import('./components/screens/screens.module').then(m => m.ScreensModule) },
                    { path: 'profile', loadChildren: () => import('./components/screens/profile/profile.module').then(m => m.ProfileModule) },
                ]
            },
            { path: 'auth', loadChildren: () => import('./components/screens/auth/auth.module').then(m => m.AuthModule) },
            { path: 'registration', loadChildren: () => import('./components/screens/registration/registration.module').then(m => m.RegistrationModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
