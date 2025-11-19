import { CoreModule } from '@abp/ng.core';
import { registerLocale } from '@abp/ng.core/locale';
import { AbpOAuthModule } from '@abp/ng.oauth';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HotToastModule } from '@ngneat/hot-toast';
import { NgOtpInputModule } from 'ng-otp-input';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';

import {
  FullscreenOverlayContainer,
  OverlayContainer,
} from '@angular/cdk/overlay';
import { authInterceptor } from './helper/auth.interceptor';
import { MaterialModulesModule } from './shared/modules/material-modules/material-modules.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    MatNativeDateModule,
    NgOtpInputModule,
    MatNativeDateModule,
    CoreModule.forRoot({
      environment,
      registerLocaleFn: registerLocale(),
    }),
    BrowserAnimationsModule,
    MaterialModulesModule,
    AppRouting,
    HotToastModule.forRoot({
      position: 'bottom-right',
    }),
    MatSidenavModule,
    ReactiveFormsModule,
    FormsModule,
    AbpOAuthModule.forRoot(),
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer }, // Override default OverlayContainer
  ],
  bootstrap: [AppComponent],
  exports: [MatDialogModule, ReactiveFormsModule, FormsModule],
})
export class AppModule { }
