import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { FollowupService } from '../../../services/followup.service';
import { BinComponent } from '../../shared/dynamic-modal/icons/bin/bin.component';
import { SkeltonComponent } from '../../others/skelton/skelton.component';
import { TosterService } from 'src/app/shared/services/toster.service';
import { PrescriptionService } from '../../../services/prescription.service';
import { Followup } from '../../../services/model/model';

@Component({
  selector: 'app-follow-up',
  templateUrl: './follow-up.component.html',
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
  standalone: true,
})
export class FollowUpComponent {
  @Input() data: any;
  searchControl = new FormControl('');
  selectedFollowUps: Followup[] = [];
  bookmarkedFollowup: {
    label: string;
    value: number;
  }[] = [];
  filteredFollowup!: Observable<
    {
      label: string;
      value: number;
    }[]
  >;
  loading = {
    isSpinner: false,
    isSkelton: false,
  };
  constructor(
    public dialogRef: MatDialogRef<FollowUpComponent>,
    private FollowupService: FollowupService,
    private TosterService: TosterService,
    private PrescriptionService: PrescriptionService
  ) {}
  ngOnInit(): void {
    this.getBookmarkChiefFollowup();
    this.filteredFollowup = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        return this.filterFollowup(value || '');
      })
    );

    this.selectedFollowUps = JSON.parse(JSON.stringify(this.data));
  }
  private filterFollowup(value: string): Observable<
    {
      label: string;
      value: number;
    }[]
  > {
    console.log(value);

    const filterValue = value;

    return this.FollowupService.getFollowUpByName(filterValue).pipe(
      map((res) => {
        return res.results && res.results.length > 0
          ? res.results.map((followUp: any) => {
              return {
                label: followUp.name,
                value: followUp.followUpId,
              };
            })
          : [];
      })
    );
  }

  toggleFollowUp(
    event: any,
    followup: {
      label: string;
      value: number;
    }
  ): void {
    if (event.isUserInput) {
      console.log('call');

      const index = this.selectedFollowUps.findIndex(
        (c) => c.name === followup.label
      );
      if (index === -1) {
        this.selectedFollowUps.push({
          name: followup.label,
          notes: '',
          id: followup.value,
        });
      } else {
        this.selectedFollowUps.splice(index, 1);
      }
    } else {
      const index = this.selectedFollowUps.findIndex(
        (c) => c.name === followup.label
      );
      if (index === -1) {
        this.selectedFollowUps.push({
          name: followup.label,
          notes: '',
          id: followup.value,
        });
      }
    }
  }

  addFollowUp(followup: { label: string; value: number }): void {
    if (!this.selectedFollowUps.some((c) => c.id === followup.value)) {
      this.selectedFollowUps.push({
        name: followup.label,
        notes: '',
        id: followup.value || 0,
      });
    }
    if (!followup.value) {
      this.FollowupService.createFollowUp(followup.label).subscribe((res) => {
        this.TosterService.customToast(res.message, 'success');
      });
    }
  }
  getBookmarkChiefFollowup() {
    console.log('call');

    this.loading.isSkelton = true;
    this.FollowupService.getBookmarkedFollowup().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          let bookmark = res.results.map(
            (res: { name: string; followUpId: number }) => {
              return {
                label: res.name,
                value: res.followUpId,
              };
            }
          );
          this.bookmarkedFollowup = bookmark;
          this.loading.isSkelton = false;
        }
      },
    });
  }

  removeFollowUp(followUp: Followup): void {
    this.selectedFollowUps = this.selectedFollowUps.filter(
      (c) => c !== followUp
    );
  }
  displayWith(c: { label: string; value: number }): string {
    return c.label;
  }
  save(): void {
    // Clear existing complaints in the service
    const chiefComplaints = this.PrescriptionService.prescribeForm().get(
      'followUp'
    ) as FormArray;
    chiefComplaints.clear();

    // Add the updated list of complaints
    // this.selectedFollowUps.forEach((followUp) =>
    //   this.PrescriptionService.addFollowup(followUp)
    // );

    // Close the dialog
    this.dialogRef.close();
  }

  isFollowUpSelected(followUp: string): boolean {
    return this.selectedFollowUps.some((c) => c.name === followUp);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
