import { LogsResponse } from '../../../models/logs/logs.response';
import { LogsFilter } from '../../../models/logs/logs.filter';
import { LogsService } from '../../../services/logs.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, map, timer } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { UsersDashboardDataModel } from 'src/app/models/users/users-dashboard-data.model';
import { DevicesDashboardDataModel } from 'src/app/models/devices/device-dashboard-data.model';
import { DevicesService } from 'src/app/services/devices.service';
import { EnvironmentsService } from 'src/app/services/environments.service';
import { EnvironmentsDashboardDataModel } from 'src/app/models/environments/environments-dashboard-data.model';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;
    filter: LogsFilter;
    logs: LogsResponse;

    usersDashboardData: UsersDashboardDataModel;
    devicesDashboardData: DevicesDashboardDataModel;
    environmentsDashboardData: EnvironmentsDashboardDataModel;

    timerSubscription: Subscription; 

    constructor(
        private accessLogService: LogsService,
        private usersService: UsersService,
        private devicesService: DevicesService,
        private environmentsService: EnvironmentsService
    ) { }

    async ngOnInit(): Promise<void> {
        this.filter = new LogsFilter();
        this.filter.previous = 0;
        this.filter.next = 1;
        this.filter.pageSize = 5;
        this.filter.where = this.formatLogFilter();
        this.filter.orderBy = {created_at: "desc"};
        this.logs = new LogsResponse();
        //this.logs = await this.getAccessLogs();
        //this.resolveLogMetdaData();

        this.timerSubscription = timer(0, 5000).pipe(
            map(async () => {
                this.usersDashboardData = await this.getUsersDashboardData();
                this.devicesDashboardData = await this.getDevicesDashboardData();
                this.environmentsDashboardData = await this.getEnvironmentsDashboardData();
                this.logs = await this.getAccessLogs();
            })
        ).subscribe();
    }

    formatLogFilter() {
        const today = new Date();
        today.setHours(0,0,0,0);

        return {
            OR: [
                {message: {contains: 'acessou'}}, 
                {message: {contains: 'acesso'}}
            ], 
            AND: {
                created_at: {
                    gte: today.toISOString()
                }
            }
        };
    }

    formatMetaData(meta: string) {
        return JSON.parse(meta); 
    }

    async onPageChange(event: any) {
        this.filter.pageSize = event.rows;
        this.filter.previous = event.page;
        this.logs = await this.getAccessLogs();
    }

    private async getUsersDashboardData(): Promise<UsersDashboardDataModel> {
        return new Promise((resolve) => {
            this.usersService.getDataForDashboard().subscribe({
                next: (response: UsersDashboardDataModel) => {
                    resolve(response);
                },
                error: () => {
                    resolve(null);
                }
            })
        });
    }

    private async getDevicesDashboardData(): Promise<DevicesDashboardDataModel> {
        return new Promise((resolve) => {
            this.devicesService.getDataForDashboard().subscribe({
                next: (response: DevicesDashboardDataModel) => {
                    resolve(response);
                },
                error: () => {
                    resolve(null);
                }
            })
        });
    }

    private async getEnvironmentsDashboardData(): Promise<EnvironmentsDashboardDataModel> {
        return new Promise((resolve) => {
            this.environmentsService.getDashboardData().subscribe({
                next: (response: EnvironmentsDashboardDataModel) => {
                    resolve(response);
                },
                error: () => {
                    resolve(null);
                }
            })
        });
    }

    private async getAccessLogs(): Promise<LogsResponse> {
        return new Promise((resolve) => {
            this.accessLogService.getAccessLogs(this.filter).subscribe({
                next: (response: LogsResponse) => {
                    resolve(response);
                },
                error: () => {
                    resolve(null);
                }
            })
        });
    }

    private resolveLogMetdaData(): void {
        if (this.logs && this.logs.data) {
            this.logs.data.forEach(meta => {
                meta.metaData = JSON.parse(meta.meta);
            });
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
