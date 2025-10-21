import { MenuService } from 'src/app/shared/services/menu.service';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { formatDistanceStrict } from 'date-fns';
import { NotificationDto } from 'src/app/api/dto-models';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../../../api/services';
import { AuthService } from '../../services/auth.service';
import { DynamicDialogComponent } from '../dynamic-dialog/dynamic-dialog.component';
import { PatientComponent } from './../../../features-modules/patient/patient.component';
@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss'],
})
export class DashboardHeaderComponent {
  authInfo: any;
  isVisible!: boolean;
  notificationCount!: any;
  messageList: NotificationDto[] = [];
  @ViewChild(PatientComponent, { static: false })
  PatientComponent!: PatientComponent;

  constructor(
    private NormalAuth: AuthService,
    private Router: Router,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private MenuService: MenuService
  ) {}

  onClickMobileMenu(status: boolean) {
    this.MenuService.visible(!status);
  }

  ngOnInit(): void {
    this.authInfo = this.NormalAuth.authInfo();

    // this.getNotification();
    // this.getNotification();
    // const connection = new signalR.HubConnectionBuilder()
    //   .configureLogging(signalR.LogLevel.Information)
    //   .withUrl(environment.apis.default.url + '/notify')
    //   .build();

    // connection
    //   .start()
    //   .then(function () {
    //     console.log('SignalR Connected!');
    //   })
    //   .catch(function (err) {
    //     console.log(err);
    //     //return console.error(err.toString());
    //   });

    // connection.on('BroadcastMessage', () => {
    //   console.log('notif');
    //   this.getNotification();
    // });
    // this.MenuService.menuVisibility$.subscribe((res) => {
    //   this.isVisible = res;
    //   console.log(res);
    // });
  }
  signOut(): void {
    // this.NormalAuth.signOut();
    this.NormalAuth.signOut();
  }
  goHome() {
    this.Router.navigate(['/']);
  }
  onClickModal(component: string) {
    this.dialog.open(DynamicDialogComponent, {
      maxWidth: 600,
      minWidth: 450,
      data: component,
    });
  }

  //getNotificationCount() {
  //  this.notificationService.getCount().subscribe(
  //    (notification) => {
  //      console.log(notification);

  //      this.notificationCount = notification;
  //      this.getNotificationMessage();
  //    }
  //    //,      error => this.errorMessage = <any>error
  //  );
  //}

  getNotification() {
    console.log(this.authInfo.userType);
    this.notificationService
      .getListByUserId(this.authInfo.id, this.authInfo.userType)
      .subscribe((messages) => {
        console.log(messages);
        this.messageList = messages;
        this.notificationCount = this.messageList.length;
      });
  }

  getNotificationTime = (createAt: any) => {
    return formatDistanceStrict(new Date(createAt), new Date());
  };
}
