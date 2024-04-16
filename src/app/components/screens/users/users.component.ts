import { DocumentType } from './../../../models/types/document.type';
import { RolesType } from './../../../models/types/roles.type';
import { GenericValues } from './../../../models/generic-values';
import { UsersInternalResponseModel } from './../../../models/users/users-internal-response.model';
import { UsersService } from './../../../services/users.service';
import { UserExternalCreateModel } from './../../../models/users/user-external-create.model';
import { UserInternalCreateModel } from './../../../models/users/user-internal-create.model';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { UserFilertResponse } from 'src/app/models/users/user-filert.response';
import { UserFilertModel } from 'src/app/models/users/user-filert.model';

const INTERNO = 1, EXTERNO = 2, LINK_AUTO_REGISTER = 'http://localhost:4200/#/landing';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    userCreateOptions: any[] = [{ label: 'INTERNO', value: INTERNO }, { label: 'EXTERNO', value: EXTERNO }];
    userCreateSelected: number = INTERNO | EXTERNO;
    userInternalCreateModel: UserInternalCreateModel;
    userExternalCreateModel: UserExternalCreateModel;
    roleTypes: GenericValues[];
    documentTypes: GenericValues[];
    password: string;
    createUserDialog: boolean = false;
    deletecreateUserDialog: boolean = false;
    emailPattern = "/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i";
    expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    private trigger: Subject<void> = new Subject();
    public webcamImage!: WebcamImage;
    private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
    public multipleWebcamsAvailable = false;
    public allowCameraSwitch = false;
    public showWebcam = true;
    public deviceId!: string;
    public facingMode: string = 'user';
    public errors: WebcamInitError[] = [];

    users: UserFilertResponse;
    filter: UserFilertModel
    userTypes: any[] = [];
    selectedUserType: any;
    status: any[] = [];
    selectedStatus: any;
    roles: any[] = [];
    selectedRoles: any[];
    searchName: string;
    submitted: boolean = false;

    constructor(
        private messageService: MessageService,
        private usersService: UsersService,
    ) { }

    async ngOnInit(): Promise<void> {
        this.filter = new UserFilertModel();
        this.filter.previous = 0;
        this.filter.next = 1;
        this.filter.pageSize = 10;
        this.filter.orderBy = {created_at: "desc"};
        this.users = new UserFilertResponse();
        this.users = await this.getUsers().then(data => data);
        this.userTypes = [
            { name: 'Interno', value: 1 },
            { name: 'Externo', value: 2 },
            { name: 'Qualquer', value: null }
        ];
        this.status = [
            { name: 'Ativo', value: true },
            { name: 'Inativo', value: false },
            { name: 'Qualquer', value: null }
        ];
        //this.selectedStatus = { value: null }
        this.roles = [
            { name: 'Admin', value: 1 },
            { name: 'Frequentador', value: 2 },
            { name: 'Supervisor', value: 3 }
        ];

        this.roleTypes = RolesType.getUserRoles();
        this.documentTypes = DocumentType.getDocumentTypes();
        this.userCreateSelected = INTERNO;
        this.changeUserCreateOptions({});
        WebcamUtil.getAvailableVideoInputs().then(
            (mediaDevices: MediaDeviceInfo[]) => {
                this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
            }
        );
    }

    changeUserCreateOptions(event: any): void {
        this.submitted = false;
        this.userInternalCreateModel = new UserInternalCreateModel();
        this.userExternalCreateModel = new UserExternalCreateModel();
        if (this.userCreateSelected === INTERNO) {
            this.userInternalCreateModel.path = LINK_AUTO_REGISTER;
        }
        if (this.userCreateSelected === EXTERNO) {
            this.userExternalCreateModel.documentType = 'CPF';
            this.userExternalCreateModel.password = null;
            this.userExternalCreateModel.encodedImage = '';
            this.userExternalCreateModel.roles = [];
        }
        this.password = null;
    }

    get interno(): number {
        return INTERNO;
    }

    get externo(): number {
        return EXTERNO;
    }

    get documentMask(): string {
        switch (this.userExternalCreateModel.documentType) {
            case 'CPF':
                return '999.999.999-99';
            case 'CNPJ':
                return '99.999.999/9999-99';
            case 'PASSPORT':
                return 'aa-999999';
            default:
                return '';
        }
    }

    get validatePassword(): boolean {
        if (this.userExternalCreateModel && this.userExternalCreateModel.password === this.password) {
            return true;
        }

        return false;
    }

    requiredField(field: any): boolean {
        if (this.submitted && !field) {
            return true;
        }

        return false;
    }

    requiredFieldArray(field: any[]): boolean {
        if (this.submitted && (!field || field.length === 0)) {
            return true;
        }

        return false;
    }

    validateExternalModel(): boolean {
        let valid = true;
        if (!this.userExternalCreateModel) {
            this.addErroMessage('Erro ao tentar criar usuário externo, favor tentar novamente.');
            valid = false;
        }
        if (!this.userExternalCreateModel.name) {
            this.addErroMessage('Nome é obrigatório.');
            valid = false;
        }
        if (!this.userExternalCreateModel.document) {
            this.addErroMessage('Documento é obrigatório.');
            valid = false;
        } else {
            switch (this.userExternalCreateModel.documentType) {
                case 'CPF':
                    if (!cpf.isValid(this.userExternalCreateModel.document)) {
                        this.addErroMessage('CPF informado não é valido.');
                        valid = false;
                    }
                    break;
                case 'CNPJ':
                    if (!cnpj.isValid(this.userExternalCreateModel.document)) {
                        this.addErroMessage('CNPJ informado não é valido.');
                        valid = false;
                    }
                    break;
                default:
                    break;
            }
        }
        if (!this.userExternalCreateModel.documentType) {
            this.addErroMessage('Tipo de documento é obrigatório.');
            valid = false;
        }
        if (!this.userExternalCreateModel.encodedImage) {
            this.addErroMessage('Foto é obrigatório.');
            valid = false;
        }
        if (!this.userExternalCreateModel.email) {
            this.addErroMessage('E-mail é obrigatório.');
            valid = false;
        } else if(!this.expression.test(this.userExternalCreateModel.email)) {
            this.addErroMessage('Formato do e-mail é valido.');
            valid = false;
        }
        if (!this.userExternalCreateModel.password) {
            this.addErroMessage('Senha é obrigatório.');
            valid = false;
        }
        if (!this.password) {
            this.addErroMessage('Confirmar senha é obrigatório.');
            valid = false;
        }
        if (this.userExternalCreateModel.password && this.password && (this.userExternalCreateModel.password != this.password)) {
            this.addErroMessage('Senhas não são iguais.');
            valid = false;
        }

        if (!this.userExternalCreateModel.roles || this.userExternalCreateModel.roles.length === 0) {
            this.addErroMessage('O(s) perfil(s) são obrigatório(s).');
            valid = false;
        }

        return valid;
    }

    public triggerSnapshot(): void {
        this.trigger.next();
    }

    public toggleWebcam(): void {
        this.showWebcam = !this.showWebcam;
    }

    public showNextWebcam(directionOrDeviceId: boolean | string): void {
        this.nextWebcam.next(directionOrDeviceId);
    }

    public handleInitError(error: WebcamInitError): void {
        this.errors.push(error);
    }

    public handleImage(webcamImage: WebcamImage): void {
        this.webcamImage = webcamImage;
        this.userExternalCreateModel.encodedImage = webcamImage!.imageAsDataUrl;
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

    openNew() {
        this.changeUserCreateOptions({});
        this.submitted = false;
        this.createUserDialog = true;
    }

    hideDialog() {
        this.createUserDialog = false;
        this.submitted = false;
    }

    handleUserTypeFiltering() {
        if (this.selectedUserType?.value === 1) {
            this.filter.where = {
                document_type_id: {
                    equals: 1
                }
            };
        } else if (this.selectedUserType?.value === 2) {
            this.filter.where = {
                OR: [
                    {
                        document_type_id: {
                            equals: 2
                        }
                    },
                    {
                        document_type_id: {
                            equals: 3
                        }
                    },
                    {
                        document_type_id: {
                            equals: 4
                        }
                    }
                ]
            };
        }
    }

    handleStatusFiltering() {
        if (this.selectedStatus && this.selectedStatus.value !== null) {
            this.filter.where.active = this.selectedStatus.value;
        }
    }

    handleRoleFiltering() {
        if (this.selectedRoles?.length > 0) {
            if (this.filter.where.OR) {
                this.filter.where.AND = {
                    OR: this.selectedRoles.map(role => {
                        return {
                            user_role: {
                                some: {
                                    role_id: role.value
                                }
                            }
                        }
                    })
                }
            } else {
                this.filter.where.OR = this.selectedRoles.map(
                    role => {
                        return {
                            user_role: {
                                some: {
                                    role_id: role.value
                                }
                            }
                        }
                    }
                )
            }
        }
    }

    handleNameFiltering() {
        if (this.searchName) {
            this.filter.where.name = {
                contains: this.searchName
            }
        }
    }

    public restart() {
        location.reload();
    }

    async searchUser() {
        this.filter.where = {};
        this.handleUserTypeFiltering();
        this.handleStatusFiltering();
        this.handleRoleFiltering();
        this.handleNameFiltering();
        this.users = await this.getUsers();
    }

    async onStatusSelected(event: any) {
        this.filter.where = {
            ...this.filter.where,
            active: event.value
        };
        this.users = await this.getUsers();
    }

    async onPageChange(event: any) {
        this.filter.pageSize = event.rows;
        this.filter.previous = event.page;
        this.users = await this.getUsers();
    }

    private async getUsers(): Promise<UserFilertResponse> {
        return new Promise((resolve) => {
            this.usersService.getUsers(this.filter).subscribe({
                next: (response: UserFilertResponse) => {
                    resolve(response);
                },
                error: () => {
                    resolve(null);
                }
            })
        });
    }

    async createUser(): Promise<void> {
        this.submitted = true;
        switch (this.userCreateSelected) {
            case INTERNO:
                const responseInternal = await this.createInternalUser();
                if (!responseInternal) {
                    this.addErroMessage('Erro ao tentar cadastrar usuário. Favor tente novamente.');
                } else {
                    this.addSuccessMessage('E-mail para cadastro de aluno/servidor da instituição enviado com sucesso');
                    this.hideDialog();
                }
                break;
            case EXTERNO:
                if (this.validateExternalModel()) {
                    const responseExternal = await this.createExternalUser();
                    if (!responseExternal) {
                        this.addErroMessage('Erro ao tentar cadastrar usuário. Favor tente novamente.');
                    } else {
                        this.addSuccessMessage('Usuário cadastrado com sucesso');
                        this.restart();
                        //this.hideDialog();
                    }
                }
                break;
            default:
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Erro ao tentar cadastrar usuário. Favor tente novamente.', life: 3000 });
                break;
        }
    }

    private async createInternalUser(): Promise<UsersInternalResponseModel> {
        return new Promise((resolve) => {
            this.usersService.createInternalUser(this.userInternalCreateModel).subscribe({
                next: (response: UsersInternalResponseModel) => {
                    resolve(response);
                },
                error: () => {
                    resolve(null);
                }
            })
        });
    }

    private async createExternalUser(): Promise<any> {
        const firstComma = this.userExternalCreateModel.encodedImage.indexOf(',');
        this.userExternalCreateModel.encodedImage = this.userExternalCreateModel.encodedImage.substring(firstComma + 1);
        return new Promise((resolve) => {
            this.usersService.createExternalUser(this.userExternalCreateModel).subscribe({
                next: (response: any) => {
                    resolve(response);
                },
                error: () => {
                    resolve(null);
                }
            })
        }).catch(error => {
            console.log(error);
        });
    }

    private addErroMessage(msg: string): void {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg, life: 3000 });
    }

    private addSuccessMessage(msg: string): void {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
    }

    private addInfoMessage(msg: string): void {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: msg, life: 3000 });
    }

    private addInfoWarn(msg: string): void {
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: msg, life: 3000 });
    }

    // TODO: verificar se é legado para remover
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
