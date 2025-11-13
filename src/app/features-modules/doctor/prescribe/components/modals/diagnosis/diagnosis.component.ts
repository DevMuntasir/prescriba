import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
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
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { SkeletonModule } from '../../../../../../shared/modules/skeleton/skeleton.module';
import { DiagnosisService } from '../../../services/diagnosis.service';
import { SkeltonComponent } from '../../others/skelton/skelton.component';
import { BinComponent } from '../../shared/dynamic-modal/icons/bin/bin.component';
import { TosterService } from './../../../../../../shared/services/toster.service';
import { PrescriptionService } from './../../../services/prescription.service';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-diagnosis',
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
    SkeltonComponent,
    SkeletonModule,
    BinComponent,
  ],
  templateUrl: './diagnosis.component.html',
})
export class DiagnosisComponent implements OnInit {
  @Input() data: any;
  private DiagnosisService = inject(DiagnosisService);
  private PrescriptionService = inject(PrescriptionService);
  public dialogRef = inject(MatDialogRef<DiagnosisComponent>);
  private TosterService = inject(TosterService);
  private NormalAuth = inject(AuthService);
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
    let id = this.NormalAuth.authInfo()?.id;
    if (id) {
      this.getBookmarked(id);
    }

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
  @ViewChildren('past') past!: QueryList<ElementRef>;
  onselect(diagnosis: MatAutocompleteSelectedEvent) {
    setTimeout(() => {
      const lastInput = this.past.last;
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
    return this.DiagnosisService.searchDiagnosis(filterValue).pipe(
      map((res) => {
        return res.results && res.results.length > 0
          ? res.results.map((item: any) => {
              return {
                label: item.name,
                value: item.diagonosisID,
              };
            })
          : [];
      })
    );
  }

  addItem(item: any): void {
    setTimeout(() => {
      const lastInput = this.past.last;
      lastInput?.nativeElement.focus();
    }, 0);
    if (!this.selectedItem.some((c) => c.id === item.value) && item.value) {
      this.selectedItem.push({
        name: item.label,
        pastDiagnosis: '',
        presentDiagnosis: '',
        id: item.value || 0,
      });
    }
    if (!item.value) {
      this.DiagnosisService.createDiagnosis(item.label).subscribe((res) => {
        this.selectedItem.push({
          name: item.label,
          pastDiagnosis: '',
          presentDiagnosis: '',
          id: res.results,
        });
        this.TosterService.customToast(res.message, 'success');
        this.bookmarked.push({
          label: item.label,
          value: res.results || 0,
        });
      });
    }
  }
  isSelectedItem(item: string): boolean {
    return this.selectedItem.some((c) => c.name === item);
  }

  toggleItem(event: any, diagnosis: any) {
    setTimeout(() => {
      const lastInput = this.past.last;
      lastInput?.nativeElement.focus();
    }, 0);
    if (!event.selected) {
      this.selectedItem = this.selectedItem.filter(
        (c) => c.name !== diagnosis.label
      );
    } else {
      const exists = this.selectedItem.some((c) => c.name === diagnosis.label);
      if (!exists) {
        this.selectedItem.push({
          name: diagnosis.label,
          pastDiagnosis: '',
          presentDiagnosis: '',
          id: diagnosis.value,
        });
      }
    }
  }

  removeItem(i: number) {
    this.selectedItem.splice(i, 1);
  }
  getBookmarked(id: number) {
    this.loading.isSkelton = true;
    this.DiagnosisService.getBookmarkedDiagnoses(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          let bookmark = res.results.map(
            (res: { name: string; diagonosisID: number }) => {
              return {
                label: res.name,
                value: res.diagonosisID,
              };
            }
          );
          this.bookmarked = bookmark;
          this.loading.isSkelton = false;
        } else {
          this.loading.noDataFound = true;
          this.loading.isSkelton = false;
        }
      },
    });
  }
  save() {
    const diagnosis = this.PrescriptionService.prescribeForm().get(
      'diagnosis'
    ) as FormArray;
    diagnosis.clear();
    this.selectedItem.forEach((item) =>
      this.PrescriptionService.addDiagnosis(item)
    );
    this.dialogRef.close();
  }
  displayWith(c: { label: string; value: number }): string {
    return c.label;
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
