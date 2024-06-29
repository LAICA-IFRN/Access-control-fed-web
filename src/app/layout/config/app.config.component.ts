
import { Component, Input, OnInit } from '@angular/core';
import { LayoutService } from "../service/app.layout.service";
import { MenuService } from "../service/app.menu.service";
 
@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html'
})
export class AppConfigComponent implements OnInit {

    @Input() minimal: boolean = false;
    
    scales: number[] = [12, 13, 14, 15, 16];
    private storage: Storage;
    themes: { light: string, dark: string };
    theme: string;

    constructor(public layoutService: LayoutService, public menuService: MenuService) {
        this.storage = window.localStorage;
        this.themes = { light: 'mdc-light-indigo', dark: 'mdc-dark-indigo' };
    }
    
    ngOnInit() {
        this.theme = this.storage.getItem('theme') ?? 'light';
        this.changeTheme(this.theme);
    }
    
    get visible(): boolean {
        return this.layoutService.state.configSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.configSidebarVisible = _val;
    }

    get scale(): number {
        return this.layoutService.config.scale;
    }

    set scale(_val: number) {
        this.layoutService.config.scale = _val;
    }

    get menuMode(): string {
        return this.layoutService.config.menuMode;
    }

    set menuMode(_val: string) {
        this.layoutService.config.menuMode = _val;
    }

    get inputStyle(): string {
        return this.layoutService.config.inputStyle;
    }

    set inputStyle(_val: string) {
        this.layoutService.config.inputStyle = _val;
    }

    get ripple(): boolean {
        return this.layoutService.config.ripple;
    }

    set ripple(_val: boolean) {
        this.layoutService.config.ripple = _val;
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    changeTheme(theme: string) {
        console.log(this.themes[theme]);
        
        const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
        // const newHref = themeLink.getAttribute('href')!.replace(this.layoutService.config.theme, theme);
        // this.layoutService.config.colorScheme
        // this.replaceThemeLink(newHref, () => {
        //     this.layoutService.config.theme = theme;
        //     this.layoutService.config.colorScheme = colorScheme;
        //     this.layoutService.onConfigUpdate();
        // });
        const newHref = 'assets/layout/styles/theme/' + this.themes[theme] + '/theme.css';
        themeLink.setAttribute('href', newHref);

        this.storage.setItem('theme', theme);
    }

    replaceThemeLink(href: string, onComplete: Function) {
        const id = 'theme-css';
        const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
        const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

        cloneLinkElement.setAttribute('href', href);
        cloneLinkElement.setAttribute('id', id + '-clone');

        themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);

        cloneLinkElement.addEventListener('load', () => {
            themeLink.remove();
            cloneLinkElement.setAttribute('id', id);
            onComplete();
        });
    }

    decrementScale() {
        this.scale--;
        this.applyScale();
    }

    incrementScale() {
        this.scale++;
        this.applyScale();
    }

    applyScale() {
        document.documentElement.style.fontSize = this.scale + 'px';
    }
}
