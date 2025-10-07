import { DegreeService } from '../../../../proxy/services/degree.service';
import { DegreeDialogComponentnt } from '../degree-dialog/degree-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DoctorDegreeService } from 'src/app/proxy/services';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DegreeDto, DoctorDegreeDto } from 'src/app/proxy/dto-models';

@Component({
  selector: 'app-education-info',
  templateUrl: './education-info.component.html',
  styleUrls: ['./education-info.component.scss'],
})
export class EducationInfoComponent implements OnInit {
  isLoading: boolean = false;
  doctorId: any;
  educationList: any = [];
  degreeData: any;
  selectedDegree: DoctorDegreeDto[] = [];

  constructor(
    public dialog: MatDialog,
    private doctorDegreeService: DoctorDegreeService,
    private normalAuth: AuthService
  ) {}

  ngOnInit(): void {
    let doctorId = this.normalAuth.authInfo().id;

    this.doctorId = doctorId;
    if (doctorId) {
      this.getDegreeDataList(doctorId);
    }
  }

  getDegreeDataList(id: any): void {
    this.doctorDegreeService
      .getDoctorDegreeListByDoctorId(id)
      .subscribe((res) => {
        this.educationList = res;
      });
  }
  handleDegreeEdit(row: any) {
    this.dialog
      .open(DegreeDialogComponentnt, {
        data: {
          data: row,
          educationList: this.educationList,
        },

        maxWidth: '500px',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === true) {
          this.getDegreeDataList(this.doctorId);
        }
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DegreeDialogComponentnt, {
      maxWidth: '500px',
      data: {
        educationList: this.educationList,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getDegreeDataList(this.doctorId);
    });
  }
  onSelectDegree(checked: boolean, item: DoctorDegreeDto) {
    if (checked) {
      if (this.selectedDegree.length < 2) {
        this.selectedDegree.push(item);
        console.log(item);
      }
    } else {
      this.selectedDegree = this.selectedDegree.filter(
        (degree) => degree.degreeName !== item.degreeName
      );
    }
  }
}
