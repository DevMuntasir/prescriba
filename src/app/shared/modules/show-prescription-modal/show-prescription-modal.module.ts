import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ShowPrescriptionModalComponent } from './show-prescription-modal.component';
import { LoaderModule } from '../loader/loader.module';

@NgModule({
  declarations: [ShowPrescriptionModalComponent],
  imports: [CommonModule, LoaderModule, NgOptimizedImage],
  exports: [ShowPrescriptionModalComponent],
})
export class ShowPrescriptionModalModule {}
