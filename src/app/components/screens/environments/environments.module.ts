import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { EnvironmentsRoutingModule } from './environments-routing.module';
import { EnvironmentsComponent } from './environments.component';
import { ListboxModule } from 'primeng/listbox';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar'; 
@NgModule({
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    MultiSelectModule,
    PaginatorModule,
    HttpClientModule,
    EnvironmentsRoutingModule,
    ListboxModule,
    DialogModule,
    SelectButtonModule,
    CalendarModule
  ],
  declarations: [EnvironmentsComponent]
})
export class EnvironmentsModule { }
