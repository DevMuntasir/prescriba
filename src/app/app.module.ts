import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';

import {
  FullscreenOverlayContainer,
  OverlayContainer,
} from '@angular/cdk/overlay';
import { AuthInterceptor } from './helper/auth.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    MatNativeDateModule,
    HttpClientModule,
    // NgOtpInputModule,
    BrowserAnimationsModule,
    AppRouting,
    MatSnackBarModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer }, 
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
