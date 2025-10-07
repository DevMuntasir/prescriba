import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PictureDialogComponent } from './picture-dialog.component';

@NgModule({
  declarations: [PictureDialogComponent],
  imports: [CommonModule, NgOptimizedImage],
  exports: [PictureDialogComponent],
})
export class PictureDialogModule {}
