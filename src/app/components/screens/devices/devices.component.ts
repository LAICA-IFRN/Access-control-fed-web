import { Component, OnInit } from '@angular/core';
import { DevicePaginateResponse } from 'src/app/models/devices/device-paginate-response.model';
import { DevicePaginateModel } from 'src/app/models/devices/device-paginate.model';
import { DevicesService } from 'src/app/services/devices.service';
import { SearchMicrocontrollerType, SearchStatus } from './utils/search-element.type';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  microcontrollers: DevicePaginateResponse;
  pendingMicrocontrollers: DevicePaginateResponse;
  microcontrollerTypes: SearchMicrocontrollerType[] = [];
  selectedMicrocontrollerType: SearchMicrocontrollerType;
  microcontrollerStatus: SearchStatus[] = [];
  selectedMicrocontrollerStatus: SearchStatus;
  microcontrollerMacInput: string;
  microcontrollerIpInput: string;
  activeMicrocontrollerDialog: boolean = false;
  environmentsForPendingMicrocontrollers: DevicePaginateResponse;
  environmentsForPendingMicrocontrollersType: SearchMicrocontrollerType[] = [];

  rfids: DevicePaginateResponse;
  rfidStatus: SearchStatus[] = [];
  selectedRfidStatus: SearchStatus;
  rfidTagInput: string;

  mobiles: DevicePaginateResponse;
  mobileStatus: SearchStatus[] = [];
  selectedMobileStatus: SearchStatus;
  mobileMacInput: string;
  mobileNumberInput: string;

  filter: DevicePaginateModel;

  constructor(
    private deviceService: DevicesService,
  ) { }

  async ngOnInit() {
    this.filter = new DevicePaginateModel();
    this.filter.previous = 0;
    this.filter.next = 1;
    this.filter.pageSize = 10;
    this.filter.where = {active: true};
    this.filter.orderBy = {created_at: "desc"};

    this.microcontrollers = new DevicePaginateResponse();
    this.microcontrollers = await this.getMicrocontrollers().then(data => data);
    this.pendingMicrocontrollers = new DevicePaginateResponse();
    this.pendingMicrocontrollers = await this.getPendingMicrocontrollers().then(data => data);
    this.environmentsForPendingMicrocontrollers = new DevicePaginateResponse();
    this.environmentsForPendingMicrocontrollers = await this.getEnvironmentsForPendingMicrocontrollers().then(data => data);
    this.environmentsForPendingMicrocontrollersType = this.environmentsForPendingMicrocontrollers.data.map((environment) => {
      return {id: environment.id, name: environment.name};
    });
    this.microcontrollerTypes = [
      {id: 1, name: "ESP32"},
      {id: 2, name: "ESP8266"},
    ];
    this.microcontrollerStatus = [
      {id: true, name: "Ativo"},
      {id: false, name: "Inativo"},
    ];

    this.rfids = new DevicePaginateResponse();
    this.rfids = await this.getRFIDs().then(data => data);
    this.rfidStatus = [
      {id: true, name: "Ativo"},
      {id: false, name: "Inativo"},
    ];

    this.mobiles = new DevicePaginateResponse();
    this.mobiles = await this.getMobiles().then(data => data);
    this.mobileStatus = [
      {id: true, name: "Ativo"},
      {id: false, name: "Inativo"},
    ];
    
  }

  handleActiveMicrocontrollerDialog() {
    this.activeMicrocontrollerDialog = true;
  }

  hideActiveMicrocontrolerDialog() {
    this.activeMicrocontrollerDialog = false;
  }

  handleMicrocontrollerTypeChange() {
    if (this.selectedMicrocontrollerType?.id === 1) {
      this.filter.where.microcontroller_type = { name: "ESP32" };
    } else if (this.selectedMicrocontrollerType?.id === 2) {
      this.filter.where.microcontroller_type = { name: "ESP8266" };
    }
  }

  handleMicrocontrollerStatusChange() {
    if (this.selectedMicrocontrollerStatus?.id === true) {
      this.filter.where.active = true;
    } else if (this.selectedMicrocontrollerStatus?.id === false) {
      this.filter.where.active = false;
    }
  }

  handleMicrocontrollerMacInput() {
    if (this.microcontrollerMacInput) {
      this.filter.where.mac = {
        contains: this.microcontrollerMacInput
      }
    }
  }

  handleMicrocontrollerIpInput() {
    if (this.microcontrollerIpInput) {
      this.filter.where.ip = {
        contains: this.microcontrollerIpInput
      }
    }
  }

  async handleMicroncontrollerSearch() {
    this.filter.where = {};
    this.handleMicrocontrollerTypeChange();
    this.handleMicrocontrollerStatusChange();
    this.handleMicrocontrollerMacInput();
    this.handleMicrocontrollerIpInput();
    this.microcontrollers = await this.getMicrocontrollers();
  }

  handleRfidStatusChange() {
    if (this.selectedRfidStatus?.id === true) {
      this.filter.where.active = true;
    } else if (this.selectedRfidStatus?.id === false) {
      this.filter.where.active = false;
    }
  }

  handleRfidTagInput() {
    if (this.rfidTagInput) {
      this.filter.where.tag = {
        contains: this.rfidTagInput
      }
    }
  }

  async handleRfidSearch() {
    this.filter.where = {};
    this.handleRfidStatusChange();
    this.handleRfidTagInput();
    this.rfids = await this.getRFIDs();
  }

  handleMobileStatusChange() {
    if (this.selectedMobileStatus?.id === true) {
      this.filter.where.active = true;
    } else if (this.selectedMobileStatus?.id === false) {
      this.filter.where.active = false;
    }
  }

  handleMobileMacInput() {
    if (this.mobileMacInput) {
      this.filter.where.mac = {
        contains: this.mobileMacInput
      }
    }
  }

  handleMobileNumberInput() {
    if (this.mobileNumberInput) {
      this.filter.where.number = {
        contains: this.mobileNumberInput
      }
    }
  }

  async handleMobileSearch() {
    this.filter.where = {};
    this.handleMobileStatusChange();
    this.handleMobileMacInput();
    this.handleMobileNumberInput();
    this.mobiles = await this.getMobiles();
  }

  async activeMicrocontrollers() {
    const microcontrollers: any[] = this.pendingMicrocontrollers.data;

    for (let index = 0; index < microcontrollers.length; index++) {
      if (microcontrollers[index].selectedEnvironment) {
        await this.deviceService.activateMicrocontroller(microcontrollers[index].id, microcontrollers[index].selectedEnvironment.id).toPromise();
      }
    }
  }

  private async getPendingMicrocontrollers(): Promise<DevicePaginateResponse> {
    const filter = new DevicePaginateModel();
    filter.previous = 0;
    filter.next = 1;
    filter.pageSize = 10;
    filter.where = {pending: true};
    filter.orderBy = {created_at: "desc"};
    
    return new Promise((resolve) => {
      this.deviceService.getMicrocontrollers(filter).subscribe({
        next: (response: DevicePaginateResponse) => {
          resolve(response);
        },
        error: () => {
          resolve(null);
        }
      })
    });
  }

  private async getMicrocontrollers(): Promise<DevicePaginateResponse> {
    return new Promise((resolve) => {
      this.deviceService.getMicrocontrollers(this.filter).subscribe({
        next: (response: DevicePaginateResponse) => {
          resolve(response);
        },
        error: () => {
          resolve(null);
        }
      })
    });
  }

  private async getRFIDs(): Promise<DevicePaginateResponse> {
    return new Promise((resolve) => {
      this.deviceService.getRFIDs(this.filter).subscribe({
        next: (response: DevicePaginateResponse) => {
          resolve(response);
        },
        error: () => {
          resolve(null);
        }
      })
    });
  }

  private async getMobiles(): Promise<DevicePaginateResponse> {
    return new Promise((resolve) => {
      this.deviceService.getMobiles(this.filter).subscribe({
        next: (response: DevicePaginateResponse) => {
          resolve(response);
        },
        error: () => {
          resolve(null);
        }
      })
    });
  }

  private async getEnvironmentsForPendingMicrocontrollers(): Promise<DevicePaginateResponse> {
    const body = {
      previous: 0,
      next: 1,
      pageSize: 10000,
      where: { active: true },
      select: {
        id: true,
        name: true
      },
      orderBy: { created_at: 'desc' }
    };

    return new Promise((resolve) => {
      this.deviceService.getEnvironmentsForPendingMicrocontrollers(body).subscribe({
        next: (response: DevicePaginateResponse) => {
          resolve(response);
        },
        error: () => {
          resolve(null);
        }
      })
    });
  }
}