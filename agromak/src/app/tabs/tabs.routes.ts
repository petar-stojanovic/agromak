import {Routes} from '@angular/router';
import {TabsPage} from './tabs.page';

export const routes: Routes = [
  {
    path: 'app',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadComponent: () => import('../pages/home/home.page').then((m) => m.HomePage),
          }
        ]
      },
      {
        path: 'chat',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../pages/chat/chat.page').then((m) => m.ChatPage),
          },
          {
            path: 'ai/:id',
            loadComponent: () => import('../pages/chat/ai/ai.page').then(m => m.AiPage)
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadComponent: () => import('../pages/profile/profile.page').then((m) => m.ProfilePage),
          },
          {
            path: 'edit',
            loadComponent: () => import('../pages/profile/edit-profile/edit-profile.page').then(m => m.EditProfilePage)
          }
        ]
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
