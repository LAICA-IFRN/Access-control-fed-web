import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { SelectButtonModule } from 'primeng/selectbutton';
import { HttpClientModule } from '@angular/common/http';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { ChipModule } from 'primeng/chip';
import { LogsRoutingModule } from './logs-routing.module';
import { LogsComponent } from './logs.component';
import { LogsService } from 'src/app/services/logs.service';

@NgModule({
  declarations: [
    LogsComponent
  ],
  imports: [
    CommonModule,
    LogsRoutingModule,
    TableModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    MultiSelectModule,
    PaginatorModule,
    SelectButtonModule,
    HttpClientModule,
    TabViewModule,
    BadgeModule,
    InputTextModule,
    DialogModule,
    DataViewModule,
    ChipModule
  ],
  providers: [
    LogsService
  ]
})
export class LogsModule { }
