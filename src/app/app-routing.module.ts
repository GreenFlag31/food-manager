import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ItemViewComponent } from './item-view/item-view.component';
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
    loadChildren: () => import('./data/data.module').then((m) => m.DataModule),
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
    path: 'contact',
    loadChildren: () =>
      import('./contact/contact.module').then((m) => m.ContactModule),
    resolve: {
      items: DataResolverService,
    },
    data: { animation: 'contact' },
  },
  {
    path: 'getting-started',
    loadChildren: () =>
      import('./getting-started/getting-started.module').then(
        (m) => m.GettingStartedModule
      ),
    data: { animation: 'started' },
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
    data: { animation: 'login' },
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./notifications/notifications.module').then(
        (m) => m.NotificationsModule
      ),
    data: { animation: 'notifications' },
  },
  {
    path: '**',
    loadChildren: () =>
      import('./page-not-found/page-not-found.module').then(
        (m) => m.PageNotFoundModule
      ),
    data: { animation: 'lost' },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
