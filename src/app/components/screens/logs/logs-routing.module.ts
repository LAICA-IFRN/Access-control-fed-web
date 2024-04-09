import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogsComponent } from './logs.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: LogsComponent
    }
  ])],
  exports: [RouterModule]
})
export class LogsRoutingModule { }