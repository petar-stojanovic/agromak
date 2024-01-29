import {Routes} from '@angular/router';
import {TabsPage} from './tabs.page';

import {redirectLoggedInTo, redirectUnauthorizedTo} from "@angular/fire/auth-guard";


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('../pages/auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../pages/auth/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'app',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../pages/tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../pages/tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/app/home',
    pathMatch: 'full',
  },
];
