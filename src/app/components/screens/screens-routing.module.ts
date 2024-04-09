import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
        { path: 'devices', loadChildren: () => import('./devices/devices.module').then(m => m.DevicesModule) },
        { path: 'environments', loadChildren: () => import('./environments/environments.module').then(m => m.EnvironmentsModule) },
        { path: 'logs', loadChildren: () => import('./logs/logs.module').then(m => m.LogsModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class ScreensRoutingModule { }
