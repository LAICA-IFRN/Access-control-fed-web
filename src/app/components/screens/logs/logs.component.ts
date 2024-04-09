import { Component, OnInit } from '@angular/core';
import { LogsFilter } from 'src/app/models/logs/logs.filter';
import { LogsResponse } from 'src/app/models/logs/logs.response';
import { LogsService } from 'src/app/services/logs.service';
import { CommonSearchSelection } from './utils/search-log.type';
import { EnvironmentsService } from 'src/app/services/environments.service';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {

  environments: CommonSearchSelection[] = [];
  selectedEnvironment: CommonSearchSelection;
  logTypes: CommonSearchSelection[] = [];
  selectedLogType: CommonSearchSelection;
  commonUsers: CommonSearchSelection[] = [];
  selectedCommonUser: CommonSearchSelection;
  
  accessLogs: LogsResponse;
  accessesTypes: CommonSearchSelection[] = [];
  selectedAccessesType: CommonSearchSelection;

  auditLogs: LogsResponse;
  auditTopics: CommonSearchSelection[] = [];
  selectedAuditTopic: CommonSearchSelection;
  authorUsers: CommonSearchSelection[] = [];
  selectedAuthorUser: CommonSearchSelection;

  filter: LogsFilter;

  constructor(
    private logsService: LogsService,
    private environmentsService: EnvironmentsService,
    private usersService: UsersService,
  ) { }

  async ngOnInit() {
    this.filter = new LogsFilter();
    this.filter.previous = 0;
    this.filter.next = 1;
    this.filter.pageSize = 10;
    this.filter.where = {};
    this.filter.orderBy = {created_at: "desc"};

    this.logTypes = [
      {id: 'info', name: 'Info'},
      {id: 'warn', name: 'Warn'},
      {id: 'error', name: 'Error'}
    ]

    this.accessLogs = new LogsResponse();
    this.accessLogs = await this.getAccessLogs().then(data => data);
    this.accessesTypes = [
      {id:'dispositivo móvel', name:'Dispositivo Móvel'},
      {id:'acesso remoto', name:'Acesso Remoto'},
      {id:'tag RFID', name:'RFID'},
      {id: 'PIN', name: 'PIN'}
    ]
    console.log(this.accessLogs);

    this.auditLogs = new LogsResponse();
    this.auditLogs = await this.getAuditLogs().then(data => data);
    console.log(this.auditLogs);

    this.environments = await this.handleEnvironments();
    console.log(this.environments);
    
    this.commonUsers = await this.handleCommonUsers();
    console.log(this.commonUsers);

    this.authorUsers = await this.handleAuthorUsers();
    console.log(this.authorUsers);
  }

  async getAccessLogs(): Promise<LogsResponse> {
    return new Promise((resolve) => {
      this.logsService.getAccessLogs(this.filter).subscribe({
        next: (response: LogsResponse) => {
          resolve(response);
        },
        error: (error) => {
          console.log(error);
          resolve(null);
        }
      });
    });
  }

  async getAuditLogs(): Promise<LogsResponse> {
    return new Promise((resolve) => {
      this.logsService.getAuditLogs(this.filter).subscribe({
        next: (response: LogsResponse) => {
          resolve(response);
        },
        error: (error) => {
          console.log(error);
          resolve(null);
        }
      });
    });
  }

  async handleEnvironments() {
    const body = {
      previous: 0,
      next: 1,
      pageSize: 10000,
      select: {
        id: true,
        name: true
      },
      where: {
        active: true
      },
      orderBy: {created_at: "desc"}
    };

    const environments: any = await new Promise((resolve) => {
      this.environmentsService.getEnvironments(body).subscribe({
        next: (response: any) => {
          resolve(response);
        },
        error: (error) => {
          console.log(error);
          resolve(null);
        }
      });
    });
    
    if (environments) {
      return environments.data;
    } else {
      return [];
    }
  }

  async handleAuthorUsers() {
    const body = {
      previous: 0,
      next: 1,
      pageSize: 10000,
      // select: {
      //   id: true,
      //   name: true
      // },
      where: {
        OR: [
          {
            user_role: {
              some: {
                active: true,
                role_id: 1
              }
            }
          },
          {
            user_role: {
              some: {
                active: true,
                role_id: 3
              }
            }
          }
        ]
      },
      orderBy: {created_at: "desc"}
    };

    const users: any = await new Promise((resolve) => {
      this.usersService.getUsers(body).subscribe({
        next: (response: any) => {
          resolve(response);
        },
        error: (error) => {
          resolve(null);
        }
      });
    });
    
    if (users) {
      return users.data;
    } else {
      return [];
    }
  }

  async handleCommonUsers() {
    const body = {
      previous: 0,
      next: 1,
      pageSize: 10000,
      // select: {
      //   id: true,
      //   name: true
      // },
      where: {
        active: true
      },
      orderBy: {created_at: "desc"}
    };

    const users: any = await new Promise((resolve) => {
      this.usersService.getUsers(body).subscribe({
        next: (response: any) => {
          resolve(response);
        },
        error: (error) => {
          resolve(null);
        }
      });
    });
    
    if (users) {
      return users.data;
    } else {
      return [];
    }
  }

  handleEnvironmentSelect() {
    if (this.selectedEnvironment) {
      if (!this.filter.where.message) {
        this.filter.where.message = {
          contains: this.selectedEnvironment.name
        }
      } else {
        this.filter.where.AND = {
          message: {
            contains: this.selectedEnvironment.name
          }
        }
      }
    }
  }

  handleAccessUserSelect() {
    if (this.selectedCommonUser) {
      if (!this.filter.where.message) {
        this.filter.where.message = {
          contains: this.selectedCommonUser.name
        }
      } else {
        this.filter.where.AND = {
          message: {
            contains: this.selectedCommonUser.name
          }
        }
      }
    }
  }

  handleAccessLogTypeSelect() {
    if (this.selectedAccessesType) {
      if (!this.filter.where.message) {
        this.filter.where.message = {
          contains: this.selectedAccessesType.id
        }
      } else if (!this.filter.where.AND) {
        this.filter.where.AND = {
          message: {
            contains: this.selectedAccessesType.id
          }
        }
      } else {
        const aux = {
          message: this.filter.where.AND.message,
          AND: {
            message: {
              contains: this.selectedAccessesType.id
            }
          }
        };
        
        this.filter.where.AND = aux;
      }
    }
  }

  handleLogTypeSelect() {
    if (this.selectedLogType) {
      this.filter.where.type = this.selectedLogType.id;
    }
  }

  handleAuditTopicSelect() {
    if (this.selectedAuditTopic) {
      this.filter.where.topic = {
        contains: this.selectedAuditTopic.id
      }
    }
  }

  handleAuthorUserSelect() {
    if (this.selectedAuthorUser) {
      if (!this.filter.where.message) {
        this.filter.where.message = {
          contains: this.selectedAuthorUser.name
        }
      } else {
        this.filter.where.AND = {
          message: {
            contains: this.selectedAuthorUser.name
          }
        }
      }
    }
  }

  handleInvolvedUserSelect() {
    if (this.selectedCommonUser) {
      if (!this.filter.where.message) {
        this.filter.where.message = {
          contains: this.selectedCommonUser.name
        }
      } else if (!this.filter.where.AND) {
        this.filter.where.AND = {
          message: {
            contains: this.selectedCommonUser.name
          }
        }
      } else {
        const aux = {
          message: this.filter.where.AND.message,
          AND: {
            message: {
              contains: this.selectedCommonUser.name
            }
          }
        };

        this.filter.where.AND = aux;
      }
    }
  }

  async handleAccessLogSearch() {
    this.filter.where = {};
    this.handleLogTypeSelect();
    this.handleEnvironmentSelect();
    this.handleAccessUserSelect();
    this.handleAccessLogTypeSelect();
    this.accessLogs = await this.getAccessLogs();
  }

  async handleAuditLogSearch() {
    this.filter.where = {};
    this.handleLogTypeSelect();
    this.handleEnvironmentSelect();
    this.handleAuditTopicSelect();
    this.handleAuthorUserSelect();
    this.handleInvolvedUserSelect();
    this.auditLogs = await this.getAuditLogs();
  }

  async onAccessLogPageChange(event: any) {
    this.filter.pageSize = event.rows;
    this.filter.previous = event.page;
    this.accessLogs = await this.getAccessLogs();
  }

  async onAuditLogPageChange(event: any) {
    this.filter.pageSize = event.rows;
    this.filter.previous = event.page;
    this.auditLogs = await this.getAuditLogs();
  }
}