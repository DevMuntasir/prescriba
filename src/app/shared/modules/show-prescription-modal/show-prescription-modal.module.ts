import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ShowPrescriptionModalComponent } from './show-prescription-modal.component';

@NgModule({
  declarations: [ShowPrescriptionModalComponent],
  imports: [CommonModule, NgOptimizedImage],
  exports: [ShowPrescriptionModalComponent],
})
export class ShowPrescriptionModalModule {}
