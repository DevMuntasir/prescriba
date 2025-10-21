import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
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

  startWith,

} from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AdviceService } from '../../../services/advice.service';
import { PrescriptionService } from '../../../services/prescription.service';
import { BinComponent } from '../../shared/dynamic-modal/icons/bin/bin.component';
import { SkeltonComponent } from './../../others/skelton/skelton.component';
import { Observable,  switchMap,map } from 'rxjs';

@Component({
  selector: 'app-advice',
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
    SkeltonComponent,
  ],
  templateUrl: './advice.component.html',
})
export class AdviceComponent {
  @Input() data: any;
  private AdviceService = inject(AdviceService);
  private PrescriptionService = inject(PrescriptionService);
  public dialogRef = inject(MatDialogRef<AdviceComponent>);
  private NormalAuth = inject(AuthService);


  loading = {
    isSpinner: false,
    isSkelton: false,
    noDataFound: false,
  };
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
  selectedItem: {
    id: number;
    notes: string;
    name: string;
  }[] = [];

  // if (changes['data'] && changes['data'].currentValue) {
  //   this.selectedItem = JSON.parse(JSON.stringify(this.data));
  // }

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
  @ViewChildren('advice') durationInputs!: QueryList<ElementRef>;
  onselect(advice: MatAutocompleteSelectedEvent) {
    setTimeout(() => {
      const lastInput = this.durationInputs.last;
      lastInput?.nativeElement.focus();
    }, 0);
    if (advice.option.value.label.length > 3) {
      this.addItem(advice.option.value);
      this.displayWith(advice.option.value);
    }
  }
  private filter(value: string): Observable<
    {
      label: string;
      value: number;
    }[]
  > {
    const filterValue = value;
    return this.AdviceService.searchAdvice(filterValue).pipe(
      map((res) => {
        return res.results && res.results.length > 0
          ? res.results.map((item: any) => {
              return {
                label: item.advice,
                value: item.commonAdviceID,
              };
            })
          : [];
      })
    );
  }

  addItem(item: any): void {
    if (!this.selectedItem.some((c) => c.id === item.value) && item.value) {
      this.selectedItem.push({
        name: item.label,
        notes: '',
        id: item.value || 0,
      });
    }
    if (!item.value) {
      this.AdviceService.createAdvice(item.label).subscribe((res) => {
        this.selectedItem.push({
          name: item.label,
          notes: '',
          id: res.results,
        });
        this.bookmarked.push({
          label: item.label,
          value: res.results,
        });
      });
    }
  }
  isSelectedItem(item: string): boolean {
    return this.selectedItem.some((c) => c.name === item);
  }
  toggleItem(
    event: any,
    advice: {
      label: string;
      value: number;
    }
  ): void {
    setTimeout(() => {
      const lastInput = this.durationInputs.last;
      lastInput?.nativeElement.focus();
    }, 0);

    if (event.isUserInput) {
      const index = this.selectedItem.findIndex((c) => c.name === advice.label);
      if (index === -1) {
        this.selectedItem.push({
          name: advice.label,
          notes: '',
          id: advice.value,
        });
      } else {
        this.selectedItem.splice(index, 1);
      }
    } else {
      const index = this.selectedItem.findIndex((c) => c.name === advice.label);
      if (index === -1) {
        this.selectedItem.push({
          name: advice.label,
          notes: '',
          id: advice.value,
        });
      }
    }
  }
  removeItem(i: number) {
    this.selectedItem = this.selectedItem.filter((_, index) => index !== i);
  }
  getBookmarked(id: number) {
    this.loading.isSkelton = true;
    this.AdviceService.getBookmarkedAdvice(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          let bookmark = res.results.map(
            (res: { advice: string; commonAdviceID: number }) => {
              return {
                label: res.advice,
                value: res.commonAdviceID,
              };
            }
          );
          this.bookmarked = bookmark;
          this.loading.isSkelton = false;
        } else {
          this.loading.isSkelton = false;
          this.loading.noDataFound = true;
        }
      },
    });
  }
  save() {
    const adviceForm = this.PrescriptionService.prescribeForm().get(
      'advice'
    ) as FormArray;
    adviceForm.clear();
    this.selectedItem.forEach((item) =>
      this.PrescriptionService.addAdvice(item)
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
