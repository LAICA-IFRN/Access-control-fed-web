import { Component, OnInit } from '@angular/core';
import { AddFrequenterModel, DayOptions, TimeOptions } from 'src/app/models/environments/add-frequenter.model';
import { EnvironmentsFilter } from 'src/app/models/environments/environments.filter';
import { EnvironmentsResponse } from 'src/app/models/environments/environments.response';
import { EnvironmentsService } from 'src/app/services/environments.service';
import { UsersService } from 'src/app/services/users.service';

const FREQUENTER = 2, MANAGER = 3, TEMPORARY = 4;
const PERMANENT = 1, DAY = 2, TIME = 3;

export const MONDAY = 1;
export const TUESDAY = 2;
export const WEDNESDAY = 3;
export const THURSDAY = 4;
export const FRIDAY = 5;
export const SATURDAY = 6;
export const SUNDAY = 0;


@Component({
  selector: 'app-environments',
  templateUrl: './environments.component.html',
  styleUrls: ['./environments.component.scss']
})
export class EnvironmentsComponent implements OnInit {

  dayOptions;
  timeOptions;
  selectedTimeAccess: any[] = [];

  firstTimeOption: boolean = true;

  addUserOptions: any[] = [{ label: 'FREQUENTADOR', value: FREQUENTER }, { label: 'SUPERVISOR', value: MANAGER }, { label: 'TEMPORÁRIO', value: TEMPORARY }];
  addUserOptionSelected: number = FREQUENTER | MANAGER | TEMPORARY;
  addUserDialog: boolean = false;
  addFrequenterModel: AddFrequenterModel;
  selectedEnvironmentToAddUser: any;
  
  addTimeOptions: any[] = [{ label: 'Permanente', value: PERMANENT}, { label: 'Por Turno', value: DAY }, { label: 'Por Horário', value: TIME }]
  addTimeOptionsSelected: number = PERMANENT | DAY | TIME
  
  addDayOptions: any[] = [{ day: "Segunda", value1: MONDAY }, { day: "Terça", value1: TUESDAY }, { day: "Quarta", value1: WEDNESDAY }, { day: "Quinta", value1: THURSDAY }, { day: "Sexta", value1: FRIDAY }, { day: "Sábado", value1: SATURDAY }, { day: "Domingo", value1: SUNDAY}];
  addDayOptionsSelected: number = MONDAY || TUESDAY || WEDNESDAY || THURSDAY || FRIDAY || SATURDAY || SUNDAY;

  addDayOptions2: any[] = [{ day: 'Segunda', value1: MONDAY }, { day: 'Terça', value1: TUESDAY }, { day: 'Quarta', value1: WEDNESDAY }, { day: 'Quinta', value1: THURSDAY }, { day: 'Sexta', value1: FRIDAY }, { day: 'Sábado', value1: SATURDAY }, { day: 'Domingo', value1: SUNDAY}];
  addDayOptionsSelected2: number = MONDAY || TUESDAY || WEDNESDAY || THURSDAY || FRIDAY || SATURDAY || SUNDAY

  addMorningTurn: any[] = [{ label: 'Manhã', value: 1 }];
  addAfternoonTurn: any[] = [{ label: 'Tarde', value: 1 }];
  addNightTurn: any[] = [{ label: 'Noite', value: 1 }];

  MorningOption = { id: 1, options: ['Morning']};
  AfternoonOption = { id: 2, options: ['Afternoon']};
  NightOption = { id: 3, options: ['Night']};
  selectDay = { id: true, options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']};

  environments: EnvironmentsResponse;
  selectedEnvironment: any;

  startPeriod: Date;
  endPeriod: Date;
  date3: Date
  date4: Date

  environmentsToSelect: any;
  usersCount: any;
  environmentFrequenters: any;
  environmentsManagers: any;
  selectedFrequenter: any;
  selectedManager: any;
  selectedShift: any;

  frequenters: any;
  managers: any;

  submitted: boolean = false;

  filter: EnvironmentsFilter;

  constructor(
    private environmentService: EnvironmentsService,
    private userService: UsersService,
  ) {}
  
  async ngOnInit() {
    this.filter = new EnvironmentsFilter();
    this.filter.previous = 0;
    this.filter.next = 1;
    this.filter.pageSize = 10;
    this.filter.select = {
      id: true,
      name: true,
      description: true,
      active: true,
      created_at: true,
      updated_at: true,
      user_name: true,
      environment_user: {
        select: {
          user_id: true,
          user_name: true
        }
      },
      environment_manager: {
        select: {
          user_id: true,
          user_name: true
        }
      }
    };
    this.filter.where = {active: true};
    this.filter.orderBy = {created_at: "desc"};

    this.environments = new EnvironmentsResponse();
    await this.handleEnvironments();

    this.addUserOptionSelected = FREQUENTER;
    this.addFrequenterModel = new AddFrequenterModel();
    this.addFrequenterModel.access = [];
    
    this.addTimeOptionsSelected = 0
    this.addDayOptionsSelected = 0

    this.frequenters = await this.getFrequenters().then(data => {
      return data.map(frequenter => {
        return {
          label: frequenter.name,
          value: frequenter.id
        }
      })
    });
    //console.log(this.frequenters);

    this.selectedEnvironmentToAddUser = null;
    this.selectedFrequenter = null;

    this.dayOptions = new DayOptions();
    this.dayOptions.monday = {morning: null, afternoon: null, night: null, selected: false};
    this.dayOptions.tuesday = {morning: null, afternoon: null, night: null, selected: false};
    this.dayOptions.wednesday = {morning: null, afternoon: null, night: null, selected: false};
    this.dayOptions.thursday = {morning: null, afternoon: null, night: null, selected: false};
    this.dayOptions.friday = {morning: null, afternoon: null, night: null, selected: false};
    this.dayOptions.saturday = {morning: null, afternoon: null, night: null, selected: false};
    this.dayOptions.sunday = {morning: null, afternoon: null, night: null, selected: false};

    this.timeOptions = new TimeOptions();
    this.selectedTimeAccess.push({
      dias: "Sem horários selecionados"
    })
  }

  requiredField(field: any): boolean {
    if (this.submitted && !field) {
      return true;
    }

    return false;
}

  async createEnvironment() {
    console.log("create environment");
  }

  async searchEnvironments() {
    console.log("search environments");
  }

  async editEnvironment(id: string) {
    this.selectedEnvironment = this.environments.data.find(environment => environment.id === id);
    //
    console.log(this.selectedEnvironment);
  }

  get frequenter(): number {
    return FREQUENTER;
  }

  get manager(): number {
    return MANAGER;
  }

  get temporary(): number {
    return TEMPORARY;
  }

  hideEnvironmentDialog() {
    this.selectedEnvironment = null;
  }

  hideAddUserDialog() {
    this.addUserDialog = false;
  }

  selectIntDay(dia: string){
    if (dia === "monday"){
      return 1;
    } else if (dia === 'tuesday'){
      return 2;
    } else if (dia === "wednesday"){
      return 3;
    } else if (dia === "thursday"){
      return 4;
    } else if (dia === "friday"){
      return 5;
    } else if (dia === "Saturday"){
      return 6;
    } else if (dia === "Sunday"){
      return 7;
    } else {
      return 0;
    }
  }

  selectDayString(dia: string){
    if (dia === "Segunda"){
      return "Seg";
    } else if (dia === 'Terça'){
      return "Ter";
    } else if (dia === "Quarta"){
      return "Qua";
    } else if (dia === "Quinta"){
      return "Qui";
    } else if (dia === "Sexta"){
      return "Sex";
    } else if (dia === "Sábado"){
      return "Sáb";
    } else {
      return "Dom";
    }
  }

  async handleEnvironmentDialog() {

    if (this.addTimeOptionsSelected  === PERMANENT) {
      this.addFrequenterModel.permanent = true;
      delete this.addFrequenterModel.access
      console.log(this.addFrequenterModel);
    } else if (this.addTimeOptionsSelected === DAY) {
    //iterar sobre dayOptions
    for (const key in this.dayOptions) {
      if (this.dayOptions.hasOwnProperty(key)) {
        if (this.dayOptions[key].morning){
          const element = {
            startTime: '00:00:00',
            endTime: '12:00:00',
            days: [
              this.selectIntDay(key)
            ]
          }
          this.addFrequenterModel.access.push(element);
        }
          if (this.dayOptions[key].afternoon){
            const element = {
              startTime: '12:00:00',
              endTime: '18:00:00',
              days: [
                this.selectIntDay(key)
              ]
            }
            this.addFrequenterModel.access.push(element);
          }
            if (this.dayOptions[key].night){
              const element = {
                startTime: '18:00:00',
                endTime: '23:59:59',
                days: [
                  this.selectIntDay(key)
                ]
              }
              this.addFrequenterModel.access.push(element);
            } 
      }
    } 

  } else {
    this.addTimeOptionsTurn()
  }

    this.addFrequenterModel.environmentId = this.selectedEnvironmentToAddUser.id
    this.addFrequenterModel.userId = this.selectedFrequenter.label
    this.addFrequenterModel.userName = this.selectedFrequenter.value
    this.addFrequenterModel.startPeriod = this.startPeriod.toLocaleDateString().split("/").reverse().join("/")
    this.addFrequenterModel.endPeriod = this.endPeriod.toLocaleDateString().split("/").reverse().join("/")

    console.log(this.addFrequenterModel);

    const response = await this.addFrequenter()
    console.log(response)
    
  }

  addTimeOptionsTurn(){
    console.log(this.timeOptions);
    //console.log(typeof this.timeOptions.horarioEntrada);
    const entrada: string = this.timeOptions.horarioEntrada.toLocaleTimeString()
    const saida: string = this.timeOptions.horarioSaida.toLocaleTimeString()
    this.timeOptions.horarioEntrada = entrada.substring(0, entrada.lastIndexOf(":"))
    this.timeOptions.horarioSaida = saida.substring(0, saida.lastIndexOf(":"))
    let temp = this.timeOptions.horarioEntrada + ' - ' + this.timeOptions.horarioSaida
    this.timeOptions.dias.forEach((element, index) => {
      if (index == 0) {
        temp += ' ' + this.selectDayString(element.day)
      } else {
        temp += ', ' + this.selectDayString(element.day)
      }
    });
    this.timeOptions.dias = temp;
    if (this.selectedTimeAccess[0].dias == "Sem horários selecionados") {
      this.firstTimeOption = false
      this.selectedTimeAccess = [this.timeOptions]

    } else {
      this.selectedTimeAccess = [
        ...this.selectedTimeAccess,
        this.timeOptions
      ]
    }
    this.timeOptions = new TimeOptions()
    console.log(this.selectedTimeAccess);
    
  }

  removeTimeOptionsTurn(item){
    //adicione a funcionalidade de remover um horário
    const index = this.selectedTimeAccess.indexOf(item);
    this.selectedTimeAccess.splice(index, 1);
    if (this.selectedTimeAccess.length == 0){
      this.firstTimeOption = true
      this.selectedTimeAccess.push({
        dias: "Sem horários selecionados"
      })
    }
    console.log(item);
  }
  
  
  changeUserAddOptions(event: any): void {
    console.log('change user ddd options');
  }

  changeTimeAddOptions(event: any) {
    console.log(this.addDayOptionsSelected);
  }
  
  addUser() {
    this.addUserDialog = true;
  }
  
  onEnvironmentSelected() {
    console.log("on environment selected: ", this.selectedEnvironmentToAddUser);
  }
  
  private countEnvironmentUsers() {
    const usersCount = {};
    this.environments.data.forEach(environment => {
      usersCount[environment.id] = environment.environment_user.length + environment.environment_manager.length;
    });
    return usersCount;
  }
  
  private extratcEnvironmentFrequenters() {
    const frequenters = {};
    this.environments.data.forEach(environment => {
      frequenters[environment.id] = environment.environment_user.map(user => {
        return {
          name: user.user_name,
          id: user.user_id
        }
      });
    });
    return frequenters;
  }
  
  private extractEnvironmentManagers() {
    const managers = {};
    this.environments.data.forEach(environment => {
      managers[environment.id] = environment.environment_manager.map(user => {
        return {
          name: user.user_name,
          id: user.user_id
        }
      });
    });
    return managers;
  }
  
  private getFrequenters() {
    const frequenters: any = new Promise((resolve) => {
      this.userService.getFrequenterUser().subscribe({
        next: (response: any) => {
          resolve(response);
        },
        error: () => {
          resolve(null);
        }
      })
    });
    return frequenters;
  }

  private async getEnvironments(): Promise<EnvironmentsResponse> {
    return new Promise((resolve) => {
      this.environmentService.getEnvironments(this.filter).subscribe({
        next: (response: EnvironmentsResponse) => {
          resolve(response);
        },
        error: () => {
          resolve(null);
        }
      })
    });
  }

  private async addFrequenter(): Promise<any> {
    return new Promise((resolve) => {
      this.environmentService.createAddFrequenter(this.addFrequenterModel).subscribe({
        next: (response: any) => {
          console.log(response)
          resolve(response);
        },
        error: (error) => {
          console.log(error)
          resolve(null);
        }
      })
    });
  }

  private async handleEnvironments() {
    this.environments = await this.getEnvironments().then(data => data);
    this.environmentsToSelect = [
      {id: 'empty', name: 'Selecione um ambiente'},
      ...this.environments.data
    ];
    this.usersCount = this.countEnvironmentUsers();
    this.environmentFrequenters = this.extratcEnvironmentFrequenters();
    this.environmentsManagers = this.extractEnvironmentManagers();
  }
}