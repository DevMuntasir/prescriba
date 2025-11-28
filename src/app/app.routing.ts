import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { routerGuard } from './auth-guard/router.guard';
import { LoginComponent } from './core-modules/auth/login/login.component';
import { AdminLoginComponent } from './core-modules/auth/admin-login/admin-login.component';
import { SignupComponent } from './core-modules/auth/signup/signup.component';
import { DoctorLayoutComponent } from './layout-module/doctor-layout.component';
import { isAuth } from './auth-guard/auth.service';
import { AdminUploadComponent } from './shared/components/chatbot/admin/admin-upload.component';
import { SupperAdminLoginComponent } from './core-modules/auth/supper-admin-login/supper-admin-login.component';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./features-modules/public/home/home.component').then(
        (c) => c.HomeComponent
      ),
  },
  {
    path: 'login',
    canActivate: [routerGuard],
    component: LoginComponent,
  },
  {
    path: 'chatbot-admin',
    component: AdminUploadComponent,
  },

  {
    path: 'ps-admin',
    children: [
      {
        path: '',
        canActivate: [routerGuard],
        component: AdminLoginComponent,
      },
      {
        path: 'dashboard',
        canActivate: [isAuth],
        data: { roles: ['admin'] },
        loadChildren: () =>
          import(
            './features-modules/admin/admin-dashboard/admin-dashboard.module'
          ).then((m) => m.AdminDashboardModule),
      },
    ],
  },
  {
    path: 'ps-supper-admin',
    children: [
      {
        path: '',
        canActivate: [routerGuard],
        component: SupperAdminLoginComponent,
      },
      {
        path: 'dashboard',
        // canActivate: [isAuth],
        // data: { roles: ['supperadmin'] },
        loadChildren: () =>
          import(
            './features-modules/supper-admin/supper-admin-dashboard/supper-admin-dashboard.component'
          ).then((m) => m.SupperAdminDashboardComponent),
      },
    ],
  },

  {
    path: 'signup',
    //canActivate:[routerGuard],
    component: SignupComponent,
  },
  {
    path: 'doctor',
    canActivate: [isAuth],
    data: { breadcrumb: 'Doctor', roles: ['doctor'] },
    component: DoctorLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../app/features-modules/doctor/doctor.module').then(
            (m) => m.DoctorModule
          ),
      },
    ],
  },
  // {
  //   path: '**',
  //   component: ,
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      useHash: false,
      // preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 64],
    }),
    DoctorLayoutComponent,
  ],
  exports: [RouterModule],
})
export class AppRouting { }
