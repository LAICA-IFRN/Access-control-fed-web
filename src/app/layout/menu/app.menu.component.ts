import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    styleUrls: ['./app.menu.component.scss']
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Inicio',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Sistema',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Usuários',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/app/users']
                    },
                    {
                        label: 'Dispositivos',
                        icon: 'pi pi-fw pi-desktop',
                        routerLink: ['/app/devices']
                    },
                    {
                        label: 'Ambientes',
                        icon: 'pi pi-fw pi-building',
                        routerLink: ['/app/environments']
                    },
                    {
                        label: 'Logs',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/app/logs']
                    },
                ]
            },
        ];
    }
}
