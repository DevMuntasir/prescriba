import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from './skeleton.component';
import { TextSkeltonComponent } from './text-skelton/text-skelton.component';

@NgModule({
  declarations: [SkeletonComponent, TextSkeltonComponent],
  imports: [CommonModule],
  exports: [SkeletonComponent, TextSkeltonComponent],
})
export class SkeletonModule {}
