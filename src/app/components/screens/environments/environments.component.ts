import { Component, OnInit } from '@angular/core';
import { AddFrequenterModel } from 'src/app/models/environments/add-frequenter.model';
import { EnvironmentsFilter } from 'src/app/models/environments/environments.filter';
import { EnvironmentsResponse } from 'src/app/models/environments/environments.response';
import { EnvironmentsService } from 'src/app/services/environments.service';
import { UsersService } from 'src/app/services/users.service';

const FREQUENTER = 2, MANAGER = 3, TEMPORARY = 4;
const PERMANENT = 1, DAY = 2, TIME = 3;
const MONDAY = 1, TUESDAY = 2, WEDNESDAY = 3, THURSDAY = 4, FRIDAY = 5


@Component({
  selector: 'app-environments',
  templateUrl: './environments.component.html',
  styleUrls: ['./environments.component.scss']
})
export class EnvironmentsComponent implements OnInit {
  addUserOptions: any[] = [{ label: 'FREQUENTADOR', value: FREQUENTER }, { label: 'SUPERVISOR', value: MANAGER }, { label: 'TEMPORÁRIO', value: TEMPORARY }];
  addUserOptionSelected: number = FREQUENTER | MANAGER | TEMPORARY;
  addUserDialog: boolean = false;
  addFrequenterModel: AddFrequenterModel;
  selectedEnvironmentToAddUser: any;
  
  addTimeOptions: any[] = [{label: 'PERMANENTE', value: PERMANENT}, { label: 'Dia', value: DAY }, { label: 'TIME', value: TIME }]
  addTimeOptionSelected: number = PERMANENT | DAY | TIME
  
  environments: EnvironmentsResponse;
  selectedEnvironment: any;

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

  handleEnvironmentDialog() {
    console.log("handle environment dialog");
  }
  
  changeUserAddOptions(event: any): void {
    console.log('change user ddd options');
  }

  changeTimeAddOptions(event: any): void {
    console.log(this.addTimeOptionSelected);
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