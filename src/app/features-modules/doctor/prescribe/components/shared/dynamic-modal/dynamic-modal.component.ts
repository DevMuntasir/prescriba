import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ChiefComplainComponent } from '../../modals/chief-complain/chief-complain.component';
import { OnExaminationComponent } from '../../modals/on-examination/on-examination.component';
import { MedicineComponent } from '../../modals/medicine/medicine.component';
import { AdviceComponent } from '../../modals/advice/advice.component';
import { FollowUpComponent } from '../../modals/follow-up/follow-up.component';
import { HistoryComponent } from '../../modals/history/history.component';
import { DiagnosisComponent } from '../../modals/diagnosis/diagnosis.component';
import { InvestigationComponent } from '../../modals/investigation/investigation.component';
import { SelectChamberComponent } from '../../others/doctor-info/select-chamber/select-chamber.component';
import {
  FullscreenOverlayContainer,
  OverlayContainer,
} from '@angular/cdk/overlay';
import { InstructionComponent } from '../../modals/instruction/instruction.component';

@Component({
  selector: 'app-dynamic-modal',
  standalone: true,
  imports: [
    CommonModule,
    ChiefComplainComponent,
    OnExaminationComponent,
    HistoryComponent,
    MedicineComponent,
    AdviceComponent,
    FollowUpComponent,
    HistoryComponent,
    DiagnosisComponent,
    InvestigationComponent,
    SelectChamberComponent,
    InstructionComponent,
  ],
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.scss'],
})
export class DynamicModalComponent {
  constructor(
    public dialogRef: MatDialogRef<DynamicModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
