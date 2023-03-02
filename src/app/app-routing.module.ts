import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './login/auth-guard.service';
import { DataResolverService } from './shared/data-resolver.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/my-list',
    pathMatch: 'full',
    data: { animation: 'myList' },
  },
  {
    path: 'my-list',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./data/data.module').then((m) => m.DataModule),
    data: { animation: 'myList' },
  },
  {
    path: 'my-list/item',
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import('./item-view/item-view.module').then((m) => m.ItemViewModule),
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
    canActivate: [AuthGuardService],
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
