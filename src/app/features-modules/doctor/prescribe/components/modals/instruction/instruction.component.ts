import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
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
  tap,
} from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TosterService } from '../../../../../../shared/services/toster.service';
import { PrescriptionService } from '../../../services/prescription.service';
import { SkeltonComponent } from '../../others/skelton/skelton.component';
import { BinComponent } from '../../shared/dynamic-modal/icons/bin/bin.component';
import { ChiefComplaintsService } from './../../../services/chief-complaints.service';
import { AdviceService } from '../../../services/advice.service';

interface Complaint {
  name: string;
  duration: string;
  days: number;
  notes: string;
  id: number;
}

@Component({
  selector: 'app-instruction',
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
  templateUrl: './instruction.component.html',
})
export class InstructionComponent implements OnInit {
  @Input() data: any;

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

  loading = {
    isSpinner: false,
    isSkelton: false,
    noDataFound: false,
  };
  isAddComplients = false;

  constructor(
    public dialogRef: MatDialogRef<InstructionComponent>,
    private prescriptionService: PrescriptionService,
    private AdviceService: AdviceService,
    private TosterService: TosterService,
    private NormalAuth: AuthService
  ) {}

  profileId!: number;

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

  isSelectedItem(complaint: string): boolean {
    return this.selectedItem.some((c) => c.name === complaint);
  }

  toggleItem(event: any, complaint: any) {
    setTimeout(() => {
      const lastInput = this.durationInputs.last;
      lastInput?.nativeElement.focus();
    }, 0);
    if (!event.selected) {
      this.selectedItem = this.selectedItem.filter(
        (c) => c.name !== complaint.label
      );
    } else {
      const exists = this.selectedItem.some((c) => c.name === complaint.label);
      if (!exists) {
        this.selectedItem.push({
          name: complaint.label,
          notes: '',
          id: complaint.value,
        });
      }
    }
  }

  removeItem(i: number) {
    this.selectedItem = this.selectedItem.filter((_, index) => index !== i);
  }
  addItem(complaint: { label: string; value: number }): void {
    this.isAddComplients = true;
    if (
      !this.selectedItem.some((c) => c.id === complaint.value) &&
      complaint.value
    ) {
      this.selectedItem.push({
        name: complaint.label,

        notes: '',
        id: complaint.value || 0,
      });
      this.bookmarked.push({
        label: complaint.label,
        value: complaint.value || 0,
      });
      this.isAddComplients = false;
    }
    if (!complaint.value) {
      this.AdviceService.createAdvice(complaint.label).subscribe((res) => {
        this.isAddComplients = false;

        this.selectedItem.push({
          name: complaint.label,

          notes: '',
          id: res.results,
        });
        this.bookmarked.push({
          label: complaint.label,
          value: res.results,
        });
        this.TosterService.customToast(res.message, 'success');
      });
    }
  }
  @ViewChildren('advice') durationInputs!: QueryList<ElementRef>;
  onselect(complaint: MatAutocompleteSelectedEvent) {
    setTimeout(() => {
      const lastInput = this.durationInputs.last;
      lastInput?.nativeElement.focus();
    }, 0);
    if (complaint.option.value.label.length > 3) {
      this.addItem(complaint.option.value);
      this.displayWith(complaint.option.value);
    }
  }
  displayWith(c: { label: string; value: number }): string {
    return c.label;
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
    const adviceForm = this.prescriptionService
      .prescribeForm()
      .get('advice') as FormArray;
    adviceForm.clear();
    this.selectedItem.forEach((item) =>
      this.prescriptionService.addAdvice(item)
    );
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
