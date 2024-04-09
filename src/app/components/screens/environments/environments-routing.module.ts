import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnvironmentsComponent } from './environments.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: EnvironmentsComponent }
  ])],
  exports: [RouterModule]
})
export class EnvironmentsRoutingModule {}
