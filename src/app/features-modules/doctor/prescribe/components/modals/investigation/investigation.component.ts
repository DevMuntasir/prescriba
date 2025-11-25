import { TosterService } from './../../../../../../shared/services/toster.service';
import {
  Component,
  ElementRef,
  inject,
  Input,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { InvestigationService } from '../../../services/investigation.service';
import { PrescriptionService } from '../../../services/prescription.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { BinComponent } from '../../shared/dynamic-modal/icons/bin/bin.component';

@Component({
  selector: 'app-findings',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatOptionModule,
    FormsModule,
    BinComponent,
  ],
  templateUrl: './investigation.component.html',
})
export class InvestigationComponent {
  @Input() data: any;
  private InvestigationService = inject(InvestigationService);
  private PrescriptionService = inject(PrescriptionService);
  private TosterService = inject(TosterService);
  public dialogRef = inject(MatDialogRef<InvestigationComponent>);

  searchControl = new FormControl('');
  bookmarked: {
    label: string;
    value: number;
  }[] = [];
  filteredResult!: Observable<
    {
      label: string;
      value: number;
    }[]
  >;
  selectedItem: any[] = [];

  loading = {
    isSpinner: false,
    isSkelton: false,
    noDataFound: false,
  };

  ngOnInit(): void {
    this.filteredResult = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        return this.filter(value || '');
      })
    );

    this.selectedItem = JSON.parse(JSON.stringify(this.data));
  }
  @ViewChildren('investigation') investigation!: QueryList<ElementRef>;
  onselect(diagnosis: MatAutocompleteSelectedEvent) {
    setTimeout(() => {
      const lastInput = this.investigation.last;
      lastInput?.nativeElement.focus();
    }, 0);
    if (diagnosis.option.value.label.length > 3) {
      this.addItem(diagnosis.option.value);
      this.displayWith(diagnosis.option.value);
    }
  }
  private filter(value: string): Observable<
    {
      label: string;
      value: number;
    }[]
  > {
    console.log(value);
    const filterValue = value;
    return this.InvestigationService.getInvestigationByName(filterValue).pipe(
      map((res) => {
        return res.results && res.results.length > 0
          ? res.results.map((item: any) => {
              return {
                label: item.name,
                value: item.investigationId,
              };
            })
          : [];
      })
    );
  }

  addItem(item: any): void {
    if (!this.selectedItem.find((c) => console.log(c)) && item.value) {
      this.selectedItem.push({
        name: item.label,
        notes: '',
        id: item.value || 0,
      });
      setTimeout(() => {
        const lastInput = this.investigation.last;
        lastInput?.nativeElement.focus();
      }, 0);
    }
    if (!item.value) {
      this.InvestigationService.createInvestigation(item.label).subscribe(
        (res) => {
          this.selectedItem.push({
            name: item.label,
            notes: '',
            id: res.results,
          });
          this.bookmarked.push({
            label: item.label,
            value: res.results || 0,
          });
          setTimeout(() => {
            const lastInput = this.investigation.last;
            lastInput?.nativeElement.focus();
          }, 0);

          this.TosterService.customToast(res.message, 'success');
        }
      );
    }
  }
  isSelectedItem(item: string): boolean {
    return this.selectedItem.some((c) => c.name === item);
  }
  toggleItem(
    event: any,
    test: {
      label: string;
      value: number;
    }
  ): void {
    setTimeout(() => {
      const lastInput = this.investigation.last;
      lastInput?.nativeElement.focus();
    }, 0);

    if (event.isUserInput) {
      const index = this.selectedItem.findIndex((c) => c.name === test.label);
      if (index === -1) {
        this.selectedItem.push({
          name: test.label,
          notes: '',
          id: test.value,
        });
      } else {
        this.selectedItem.splice(index, 1);
      }
    } else {
      const index = this.selectedItem.findIndex((c) => c.name === test.label);
      if (index === -1) {
        this.selectedItem.push({
          name: test.label,
          notes: '',
          id: test.value,
        });
      }
    }
  }
  removeItem(i: number) {
    this.selectedItem.splice(i, 1);
  }

  save() {
    const testForm = this.PrescriptionService.prescribeForm().get(
      'test'
    ) as FormArray;
    testForm.clear();
    this.selectedItem.forEach((item) => this.PrescriptionService.addTest(item));
    this.dialogRef.close();
  }
  displayWith(c: { label: string; value: number }): string {
    return c.label;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

