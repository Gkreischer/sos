import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartsPage } from './parts.page';

const routes: Routes = [
  {
    path: '',
    component: PartsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartsPageRoutingModule {}
