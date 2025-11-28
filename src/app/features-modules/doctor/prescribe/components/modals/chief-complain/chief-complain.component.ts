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

interface Complaint {
  name: string;
  duration: string;
  days: number;
  notes: string;
  id: number;
}

@Component({
  selector: 'app-chief-complain',
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
  templateUrl: './chief-complain.component.html',
})
export class ChiefComplainComponent implements OnInit {
  @Input() data: any;
  searchControl = new FormControl('');
  selectedComplaints: Complaint[] = [];
  durationOptions = [
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' },
  ];
  parentForm!: FormGroup;
  bookmarkedComplaints: {
    label: string;
    value: number;
  }[] = [];
  allComplaints: {
    label: string;
    value: number;
  }[] = [];
  filteredChiefComplaints!: Observable<
    {
      label: string;
      value: number;
    }[]
  >;
  loading = {
    isSpinner: false,
    isSkelton: false,
    noDataFound: false,
  };
  isAddComplients = false;

  get isAddButtonDisabled(): boolean {
    const value = this.searchControl.value ?? '';
    return this.isAddComplients || !value.trim();
  }

  constructor(
    public dialogRef: MatDialogRef<ChiefComplainComponent>,
    private prescriptionService: PrescriptionService,
    private ChiefComplaintsService: ChiefComplaintsService,
    private TosterService: TosterService,
    private NormalAuth: AuthService
  ) {}

  profileId!: number;

  ngOnInit(): void {
    let id = this.NormalAuth.authInfo()?.id;
    if (id) {
      this.getBookmarkChiefComplaints(id);
    }
    this.filteredChiefComplaints = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        return this.filterChiefComplaints(value || '');
      })
    );

    this.selectedComplaints = JSON.parse(JSON.stringify(this.data));
  }

  private filterChiefComplaints(value: string): Observable<
    {
      label: string;
      value: number;
    }[]
  > {
    const filterValue = value;

    return this.ChiefComplaintsService.searchChiefComplaints(filterValue).pipe(
      tap(() => console.log(filterValue)),
      map((res) => {
        return res.results && res.results.length > 0
          ? res.results.map((complaint: any) => {
              return {
                label: complaint.symptomName,
                value: complaint.symptomId,
              };
            })
          : [];
      })
    );
  }

  isComplaintSelected(complaint: string): boolean {
    return this.selectedComplaints.some((c) => c.name === complaint);
  }

  toggleComplaint(event: any, complaint: any) {
    setTimeout(() => {
      const lastInput = this.durationInputs.last;
      lastInput?.nativeElement.focus();
    }, 0);
    if (!event.selected) {
      this.selectedComplaints = this.selectedComplaints.filter(
        (c) => c.name !== complaint.label
      );
    } else {
      const exists = this.selectedComplaints.some(
        (c) => c.name === complaint.label
      );
      if (!exists) {
        this.selectedComplaints.push({
          name: complaint.label,
          duration: '',
          notes: '',
          days: 0,
          id: complaint.value,
        });
      }
    }
  }

  addComplaint(complaint: { label: string; value: number }): void {
    const label = (complaint.label ?? '').trim();
    if (!label) {
      return;
    }

    const value = complaint.value ?? 0;
    this.searchControl.setValue('');

    if (value && this.selectedComplaints.some((c) => c.id === value)) {
      return;
    }

    this.isAddComplients = true;

    if (value) {
      this.selectedComplaints.push({
        name: label,
        duration: '',
        days: 0,
        notes: '',
        id: value,
      });

      if (!this.bookmarkedComplaints.some((item) => item.value === value)) {
        this.bookmarkedComplaints.push({
          label,
          value,
        });
      }

      this.isAddComplients = false;
      return;
    }

    this.ChiefComplaintsService.createChiefComplaints(label).subscribe({
      next: (res) => {
        this.selectedComplaints.push({
          name: label,
          duration: '',
          days: 0,
          notes: '',
          id: res.results,
        });
        this.bookmarkedComplaints.push({
          label,
          value: res.results,
        });
        this.TosterService.customToast(res.message, 'success');
        this.isAddComplients = false;
      },
      error: () => {
        this.isAddComplients = false;
      },
    });
  }
  @ViewChildren('durationInput') durationInputs!: QueryList<ElementRef>;
  onselect(complaint: MatAutocompleteSelectedEvent) {
    setTimeout(() => {
      const lastInput = this.durationInputs.last;
      lastInput?.nativeElement.focus();
    }, 0);
    const selected = complaint.option.value;
    if ((selected.label ?? '').trim().length > 3) {
      this.addComplaint(selected);
    }
  }
  displayWith(c: { label: string; value: number }): string {
    return c.label;
  }

  getBookmarkChiefComplaints(id: number) {
    this.loading.isSkelton = true;
    this.ChiefComplaintsService.getBookmarkedChiefComplaints(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          let bookmark = res.results.map(
            (res: { symptomName: string; symptomId: number }) => {
              return {
                label: res.symptomName,
                value: res.symptomId,
              };
            }
          );
          this.bookmarkedComplaints = bookmark;
          this.loading.isSkelton = false;
        } else {
          this.loading.noDataFound = true;
          this.loading.isSkelton = false;
        }
      },
    });
  }
  removeComplaint(index: number) {
    this.selectedComplaints.splice(index, 1);
  }

  saveComplaints(): void {
    const chiefComplaints = this.prescriptionService
      .prescribeForm()
      .get('chiefComplaints') as FormArray;
    chiefComplaints.clear();

    this.selectedComplaints.forEach((complaint) =>
      this.prescriptionService.addComplaint(complaint)
    );
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

