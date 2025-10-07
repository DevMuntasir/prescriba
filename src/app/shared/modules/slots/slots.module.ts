import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlotsComponent } from './slots.component';
import { SlotItemComponent } from '../../components/slot-item/slot-item.component';




@NgModule({
  declarations: [SlotsComponent,SlotItemComponent],
  imports: [
    CommonModule,
  ],

  exports:[SlotsComponent]
})
export class SlotsModule { }
