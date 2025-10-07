import {
  Component,
  inject,
  Inject,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { PrescriptionService } from '../../../services/prescription.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormControl, FormControlName, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss',
})
export class TemplatesComponent implements OnInit, OnChanges {
  templates: any[] = [];
  blur = false;
  selectedTemplate = {
    templateLoad: false,
    id: 0,
  };
  searchTempalte!: FormControl;
  public dialogRef = inject(MatDialogRef<TemplatesComponent>);
  constructor(
    private prescriptionService: PrescriptionService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.data);
  }
  ngOnInit(): void {
    this.templates = this.data;
    // this.searchTempalte.valueChanges.subscribe({
    //   next: (res) => {
    //     console.log(res);
    //   },
    // });
  }
  show(id: number) {
    this.selectedTemplate = {
      ...this.selectedTemplate,
      id,
    };
    this.prescriptionService.resetForm();
  }
  submitTemplate() {
    this.selectedTemplate = {
      ...this.selectedTemplate,
      templateLoad: true,
    };
    this.prescriptionService
      .getPrescriptionTemplate(this.selectedTemplate.id)
      .subscribe((res) => {
        this.selectedTemplate = {
          ...this.selectedTemplate,
          templateLoad: !this.selectedTemplate.templateLoad,
        };
        this.prescriptionService.populateFormFromApiData(res);
        this.dialogRef.close();
        this.selectedTemplate = {
          ...this.selectedTemplate,
          templateLoad: false,
        };
      });
  }
}
