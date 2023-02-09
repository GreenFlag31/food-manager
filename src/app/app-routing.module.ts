import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataComponent } from './data/data.component';
import { ItemViewComponent } from './item-view/item-view.component';
import { GettingStartedComponent } from './getting-started/getting-started.component';
import { LoginComponent } from './login/login.component';
import { DataResolverService } from './data-resolver.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/my-list',
    pathMatch: 'full',
    data: { animation: 'myList' },
  },
  {
    path: 'my-list',
    component: DataComponent,
    data: { animation: 'myList' },
  },
  {
    path: 'my-list/item',
    component: ItemViewComponent,
    resolve: {
      items: DataResolverService,
    },
    data: { animation: 'id' },
  },
  {
    path: 'getting-started',
    component: GettingStartedComponent,
    data: { animation: 'started' },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { animation: 'login' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
