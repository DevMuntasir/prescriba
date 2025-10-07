import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog-header',
  templateUrl: './dialog-header.component.html',
  styleUrls: ['./dialog-header.component.scss']
})
export class DialogHeaderComponent {
  @Input() headingText: any;
  @Input() buttonText: any;
  @Input() iconClass: any;
  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();

  closeDialogs():void{
    this.closeDialog.emit()
  }
  
}
