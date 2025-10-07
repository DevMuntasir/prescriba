import { TosterService } from 'src/app/shared/services/toster.service';
import { PrescriptionMasterService } from './../../../proxy/services/prescription-master.service';
import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-show-prescription-modal',
  templateUrl: './show-prescription-modal.component.html',
  styleUrls: ['./show-prescription-modal.component.scss'],
})
export class ShowPrescriptionModalComponent implements OnInit {
  @Input() isLoading!: boolean;
  @ViewChild('printableSection') printableSection!: ElementRef;
  prescriptionInfo: any;
  prescriptionLoader!: boolean;
  saveLoader: boolean = false;
  constructor(
    private TosterService: TosterService,
    private PrescriptionMasterService: PrescriptionMasterService,
    public dialogRef: MatDialogRef<ShowPrescriptionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.prescriptionLoader = true;
    try {
      if (this.data.prescriptionId) {
        this.PrescriptionMasterService.getPrescription(
          this.data.prescriptionId
        ).subscribe((res) => {
          this.prescriptionInfo = res;
          console.log(res);

          this.prescriptionLoader = false;
        });
      }
      if (this.data.appointmentId) {
        this.PrescriptionMasterService.getPrescriptionByAppointmentId(
          this.data.appointmentId
        ).subscribe((res) => {
          this.prescriptionInfo = res;
          this.prescriptionLoader = false;
        });
      }
    } catch (error) {
      this.TosterService.customToast(String(error), 'error');
      this.prescriptionLoader = true;
    }
  }

  pdfSavePrint(click: string) {
    console.log('click');

    this.saveLoader = true;
    if (click === 'print') {
      window.print();
      this.saveLoader = false;
      return;
    }
    if (click === 'save') {
      const printableContent = this.printableSection.nativeElement;
      if (printableContent) {
        const scale = 2;
        const options = {
          scale: scale,
          useCORS: true,
        };
        html2canvas(printableContent, options).then(async (canvas) => {
          const { jsPDF } = await import('jspdf');
          const pdf = new jsPDF();
          const imgData = canvas.toDataURL('image/jpeg', 0.5);
          const imgWidth = 210; // A4 size
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

          this.saveLoader = false;
          pdf.save(`${this.prescriptionInfo.patientName}-Prescription.pdf`);
          //
          // const blob = pdf.output('blob');
          // const pdfUrl = URL.createObjectURL(blob);
          // const printWindow: Window | null = window.open(pdfUrl);
          // if (printWindow) {
          //   printWindow.onload = () => {
          //     // printWindow.print();
          //     pdf.autoPrint();
          //   };
          // } else {
          //   console.error('Print window could not be opened.');
          // }
        });
      } else {
        console.error('Printable section not found');
      }
    }
  }

  convertToBanglaText(drugName: string, schedule: string): string {
    const parts = schedule.split('+');
    const isTablet =
      drugName.toLowerCase().includes('tablet') ||
      drugName.toLowerCase().includes('capsule');
    const isInjection = drugName.toLowerCase().includes('injection');
    const isDrops = drugName.toLowerCase().includes('drop');
    let medicineType: string;

    if (isTablet) {
      medicineType = 'টা';
    } else if (isInjection) {
      medicineType = 'নিবেন';
    } else if (isDrops) {
      medicineType = 'দিবেন ';
    } else {
      medicineType = 'বার';
    }

    const banglaText = parts.map((part, index) => {
      const partValue = parseInt(part, 10);
      console.log(partValue);

      let doseText = ' ';
      if (partValue === 0) {
        doseText = '___'; // No dose
      } else {
        doseText = this.getTimeText(index);
      }
      return doseText;
    });
    return banglaText.join('  +  ');
  }

  // Helper function to get Bangla time text
  getTimeText(index: number): string {
    switch (index) {
      case 0:
        return ' সকালে ';
      case 1:
        return ' দুপুরে ';
      case 2:
        return ' রাতে ';
      default:
        return ' অজানা ';
    }
  }
  getDurationEnglishToBangla(index: number): string {
    switch (index) {
      case 0:
        return ' সকালে ';
      case 1:
        return ' দুপুর ';
      case 2:
        return ' রাতে ';
      default:
        return ' অজানা ';
    }
  }

  convertToBanglaDuration(duration: string): string {
    // Split the duration into number and unit
    const [num, unit] = duration.split(' ');

    // Convert numbers to Bangla text
    const banglaNumbers: { [key: string]: string } = {
      '0': '০',
      '1': '১',
      '2': '২',
      '3': '৩',
      '4': '৪',
      '5': '৫',
      '6': '৬',
      '7': '৭',
      '8': '৮',
      '9': '৯',
    };

    const banglaNum = num
      .split('')
      .map((digit) => banglaNumbers[digit])
      .join('');

    // Convert unit to Bangla
    let banglaUnit: string;
    switch (unit) {
      case 'day':
      case 'days':
        banglaUnit = 'দিন';
        break;
      case 'week':
      case 'weeks':
        banglaUnit = 'সপ্তাহ';
        break;
      case 'month':
      case 'months':
        banglaUnit = 'মাস';
        break;
      case 'year':
      case 'years':
        banglaUnit = 'বছর';
        break;
      default:
        return duration; // If unit is not recognized, return as is
    }

    return `${banglaNum} ${banglaUnit}`;
  }

  // convertToBanglaText(drugName: string, schedule: string): string {
  //   const parts = schedule.split('+');
  //   const isTablet =
  //     drugName.toLowerCase().includes('tablet') ||
  //     drugName.toLowerCase().includes('capsule');
  //   const isInjection = drugName.toLowerCase().includes('injection');
  //   const isDrops = drugName.toLowerCase().includes('drop');
  //   let medicineType: string;

  //   if (isTablet) {
  //     medicineType = 'টা';
  //   } else if (isInjection) {
  //     medicineType = 'নিবেন';
  //   } else if (isDrops) {
  //     medicineType = 'দিবেন ';
  //   } else {
  //     medicineType = 'বার';
  //   }

  //   const banglaText = parts.map((part, index) => {
  //     const partValue = parseInt(part, 10);
  //     console.log(partValue);

  //     let doseText = '';
  //     if (partValue === 0) {
  //       doseText = ''; // No dose
  //     } else {
  //       doseText = `১ ${
  //         medicineType == 'দিবেন' || 'দিবেন' ? 'বার' : medicineType
  //       } ${this.getTimeText(index)} ${isInjection ? 'নিবেন' : ''}`;
  //     }
  //     return doseText;
  //   });
  //   return banglaText.join(' - ');
  // }
}
