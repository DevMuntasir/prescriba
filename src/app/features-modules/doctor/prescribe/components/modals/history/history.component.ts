import { TosterService } from './../../../../../../shared/services/toster.service';
import { HistoryService } from './../../../services/history.service';
import { PrescriptionService } from './../../../services/prescription.service';
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
import { BinComponent } from '../../shared/dynamic-modal/icons/bin/bin.component';
import { SkeltonComponent } from '../../others/skelton/skelton.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-history',
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
  templateUrl: './history.component.html',
})
export class HistoryComponent implements OnInit {
  @Input() data: any;
  searchControl = new FormControl('');
  loading = {
    isSpinner: false,
    isSkelton: false,
    noDataFound: false,
  };
  bookmarkedHistory: {
    label: string;
    value: number;
  }[] = [];
  filteredHistory!: Observable<
    {
      label: string;
      value: number;
    }[]
  >;
  selectedHistory: {
    presentHistory: string;
    pastHistory: string;
    id: number;
    name: string;
  }[] = [];
  constructor(
    private PrescriptionService: PrescriptionService,
    private HistoryService: HistoryService,
    public dialogRef: MatDialogRef<HistoryComponent>,
    private TosterService: TosterService,
    private NormalAuth: AuthService
  ) {}

  ngOnInit(): void {
    let id = this.NormalAuth.authInfo()?.id;
    if (id) {
      this.getBookmarkedHistory(id);
    }
    this.filteredHistory = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        return this.filterHistory(value || '');
      })
    );

    this.selectedHistory = JSON.parse(JSON.stringify(this.data));
  }
  @ViewChildren('past') past!: QueryList<ElementRef>;
  onselect(diagnosis: MatAutocompleteSelectedEvent) {
    setTimeout(() => {
      const lastInput = this.past.last;
      lastInput?.nativeElement.focus();
    }, 0);
    if (diagnosis.option.value.label.length > 3) {
      this.addHistory(diagnosis.option.value);
      this.displayWith(diagnosis.option.value);
    }
  }
  private filterHistory(value: string): Observable<
    {
      label: string;
      value: number;
    }[]
  > {
    console.log(value);

    const filterValue = value;

    return this.HistoryService.searchHistoryName(filterValue).pipe(
      tap(() => console.log(filterValue)),
      map((res) => {
        return res.results && res.results.length > 0
          ? res.results.map((history: any) => {
              return {
                label: history.name,
                value: history.commonHistoryId,
              };
            })
          : [];
      })
    );
  }

  addHistory(item: any): void {
    setTimeout(() => {
      const lastInput = this.past.last;
      lastInput?.nativeElement.focus();
    }, 0);
    if (!this.selectedHistory.find((c) => c.id === item.value) && item.value) {
      this.selectedHistory.push({
        name: item.label,
        presentHistory: '',
        pastHistory: '',
        id: item.value || 0,
      });
    }
    if (!item.value) {
      this.HistoryService.createHistory(item.label).subscribe((res) => {
        this.selectedHistory.push({
          name: item.label,
          presentHistory: '',
          pastHistory: '',
          id: res.results,
        });
        this.bookmarkedHistory.push({
          label: item.label,
          value: res.results || 0,
        });
        this.TosterService.customToast(res.message, 'success');
      });
    }
  }
  isHistorySelected(history: string): boolean {
    return this.selectedHistory.some((c) => c.name === history);
  }

  toggleComplaint(event: any, history: any) {
    setTimeout(() => {
      const lastInput = this.past.last;
      lastInput?.nativeElement.focus();
    }, 0);
    if (!event.selected) {
      this.selectedHistory = this.selectedHistory.filter(
        (c) => c.name !== history.label
      );
    } else {
      const exists = this.selectedHistory.some((c) => c.name === history.label);
      if (!exists) {
        this.selectedHistory.push({
          name: history.label,
          presentHistory: '',
          pastHistory: '',
          id: history.value,
        });
      }
    }
  }

  removeHistory(i: number) {
    this.selectedHistory.splice(i, 1);
  }
  getBookmarkedHistory(id: number) {
    this.loading.isSkelton = true;
    console.log(id);
    this.HistoryService.getBookmarkedHistory(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          let bookmark = res.results.map(
            (res: { name: string; commonHistoryId: number }) => {
              return {
                label: res.name,
                value: res.commonHistoryId,
              };
            }
          );
          this.bookmarkedHistory = bookmark;
          this.loading.isSkelton = false;
        } else {
          this.loading.isSkelton = false;
          this.loading.noDataFound = true;
        }
      },
    });
  }
  saveHistory() {
    const history = this.PrescriptionService.prescribeForm().get(
      'history'
    ) as FormArray;
    history.clear();
    this.selectedHistory.forEach((history) => {
      this.PrescriptionService.addHistory(history);
    });
    this.dialogRef.close();
  }
  displayWith(c: { label: string; value: number }): string {
    return c.label;
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
