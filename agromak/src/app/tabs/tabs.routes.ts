import {Routes} from '@angular/router';
import {TabsPage} from './tabs.page';

export const routes: Routes = [
  {
    path: 'app',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children:[
          {
            path: '',
            loadComponent: () => import('../pages/home/home.page').then((m) => m.HomePage),
          },
          {
            path: 'ad/:id/details',
            loadComponent: () => import('../pages/home/ad-details/ad-details.page').then(m => m.AdDetailsPage)
          },
        ]
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../pages/ai/ai.page').then((m) => m.AiPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../pages/profile/profile.page').then((m) => m.ProfilePage),
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
