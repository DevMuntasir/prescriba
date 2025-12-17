import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  BehaviorSubject,
  Observable,
  of,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
  catchError,
  finalize,
  startWith,
  shareReplay,
  filter as rxFilter,
  Subject,
} from 'rxjs';

import { MedicineService } from '../../../services/medicine.service';
import { PrescriptionService } from '../../../services/prescription.service';
import { Medicine } from '../../../services/model/model';
import { BinComponent } from '../../shared/dynamic-modal/icons/bin/bin.component';
import { SkeltonComponent } from '../../others/skelton/skelton.component';
import { TosterService } from 'src/app/shared/services/toster.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import {
  AiSuggestionService,
  AiSuggestedItem,
} from '../../../services/ai-suggestion.service';

type MedicineOption = {
  label: string;
  value: number;
  genericName: string;
  manufacturer: string;
};

type MedicineRow = {
  id: number;
  name: string;
  duration: string;
  timming: string;
  mealTime: string;
  notes: string;
};

@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatDialogModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatListModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatOptionModule,
    FormsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    BinComponent,
    SkeltonComponent,
  ],
})
export class MedicineComponent {
  @Input() data: any;

  private medicineService = inject(MedicineService);
  private prescriptionService = inject(PrescriptionService);
  private toaster = inject(TosterService);
  private auth = inject(AuthService);
  private aiSuggestionService = inject(AiSuggestionService);

  constructor(public dialogRef: MatDialogRef<MedicineComponent>) {}

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  @ViewChildren('durationInput') durationInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('timingInput') timingInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('mealSelect') mealInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('notesInput') notesInputs!: QueryList<ElementRef<HTMLInputElement>>;

  // UI lists
  mealTimes = ['Before Meal', 'After Meal'];
  mealCombinations = ['1+1+0', '1+0+1', '0+1+1'];

  durationOptions = [
    { value: '5 days', label: '5 Days' },
    { value: '7 days', label: '7 Days' },
    { value: '14 days', label: '14 Days' },
    { value: '21 days', label: '21 Days' },
    { value: '28 days', label: '28 Days' },
    { value: '1 month', label: '1 Month' },
    { value: '2 months', label: '2 Months' },
    { value: '3 months', label: '3 Months' },
    { value: '6 months', label: '6 Months' },
  ];

  bookmarked: { label: string; value: number }[] = [];

  loading = {
    isSpinner: false,
    isSkelton: false,
    noDataFound: false,
  };

  // Modes
  suggestionMode: 'search' | 'context' = 'search';
  private suggestionMode$ = new BehaviorSubject<'search' | 'context'>(this.suggestionMode);

  // Search
  searchControl = new FormControl<string>('');
  private searchLoadingSubject = new BehaviorSubject<boolean>(false);
  searchLoading$ = this.searchLoadingSubject.asObservable();

  private searchHintSubject = new BehaviorSubject<string>('Type at least 2 characters');
  searchHint$ = this.searchHintSubject.asObservable();

  filteredMedicines$!: Observable<MedicineOption[]>;

  // AI
  private aiRefresh$ = new Subject<void>();
  private aiLoadingSubject = new BehaviorSubject<boolean>(false);
  aiLoading$ = this.aiLoadingSubject.asObservable();

  private aiErrorSubject = new BehaviorSubject<boolean>(false);
  aiError$ = this.aiErrorSubject.asObservable();

  aiSuggestions$!: Observable<AiSuggestedItem[]>;
  aiEmptyMessage = 'No AI suggestions (add diagnosis/complaints/age/gender for better results)';

  // FormArray for selected meds
  medicineFormArray = new FormArray<FormGroup>([]);

  // Undo remove
  private lastRemoved: { index: number; row: MedicineRow } | null = null;
  private undoTimer: any = null;

  // Focus scheduling
  private pendingFocusIndex: number | null = null;

  ngOnInit(): void {
    const id = this.auth.authInfo()?.id;
    if (id) this.getBookmarked(id);

    this.initFromInputData();

    // Focus reliability: whenever inputs re-render, apply pending focus.
    this.durationInputs?.changes?.subscribe(() => this.applyPendingFocus());

    // Search pipeline (only in search mode)
    this.filteredMedicines$ = combineLatest([
      this.suggestionMode$,
      this.searchControl.valueChanges.pipe(
        startWith(''),
        map((v) => (v ?? '').trim()),
        debounceTime(250),
        distinctUntilChanged()
      ),
    ]).pipe(
      switchMap(([mode, query]) => {
        if (mode !== 'search') {
          this.searchLoadingSubject.next(false);
          this.searchHintSubject.next('');
          return of([] as MedicineOption[]);
        }

        if (!query || query.length < 2) {
          this.searchLoadingSubject.next(false);
          this.searchHintSubject.next('Type at least 2 characters');
          return of([] as MedicineOption[]);
        }

        this.searchHintSubject.next('');
        this.searchLoadingSubject.next(true);

        return this.filter(query).pipe(
          finalize(() => this.searchLoadingSubject.next(false)),
          catchError(() => {
            this.searchHintSubject.next('Search failed. Try again.');
            return of([] as MedicineOption[]);
          })
        );
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    // AI pipeline (only in context mode)
    this.aiSuggestions$ = combineLatest([
      this.suggestionMode$.pipe(distinctUntilChanged()),
      this.aiRefresh$.pipe(startWith(void 0)),
    ]).pipe(
      switchMap(([mode]) => {
        if (mode !== 'context') {
          this.aiLoadingSubject.next(false);
          this.aiErrorSubject.next(false);
          return of([] as AiSuggestedItem[]);
        }

        this.aiLoadingSubject.next(true);
        this.aiErrorSubject.next(false);

        return this.aiSuggestionService
          .suggest({
            query: '',
            context: this.buildAiContext(),
          })
          .pipe(
            catchError(() => {
              this.aiErrorSubject.next(true);
              return of([] as AiSuggestedItem[]);
            }),
            finalize(() => this.aiLoadingSubject.next(false))
          );
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  // ---------- Mode ----------
  setSuggestionMode(mode: 'search' | 'context') {
    this.suggestionMode = mode;
    this.suggestionMode$.next(mode);

    if (mode === 'search') {
      // small UX: focus search when switching back
      setTimeout(() => this.focusSearch(), 0);
    }
  }

  refreshAiSuggestions() {
    this.aiRefresh$.next();
  }

  // ---------- Search + add ----------
  displayWith = (c: MedicineOption | null): string => c?.label ?? '';

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const option = event.option.value as MedicineOption | null;
    if (!option?.label) return;

    this.addMedicineOption(option);
  }

  handleAddFromInput() {
    const raw = (this.searchControl.value ?? '').trim();
    if (!raw) return;

    // Doctor typed a brand-new name, create it
    // (same behavior as your old code)
    this.addTypedMedicine(raw);
  }

  private addMedicineOption(medicine: MedicineOption) {
    if (!medicine.value) return;
    if (this.existsByIdOrName(medicine.value, medicine.label)) {
      this.searchControl.setValue('');
      return;
    }

    this.medicineFormArray.push(
      this.createRowGroup({
        id: medicine.value,
        name: medicine.label,
        duration: '',
        timming: '',
        mealTime: '',
        notes: '',
      })
    );

    this.searchControl.setValue('');
    this.focusDuration(this.medicineFormArray.length - 1);
  }

  private addTypedMedicine(label: string) {
    // If already exists by name, do nothing
    if (this.existsByIdOrName(0, label)) {
      this.searchControl.setValue('');
      return;
    }

    this.loading.isSpinner = true;

    this.medicineService.createMedicine(label).subscribe({
      next: (res: any) => {
        const newId = Number(res?.results || 0);

        this.medicineFormArray.push(
          this.createRowGroup({
            id: newId,
            name: label,
            duration: '',
            timming: '',
            mealTime: '',
            notes: '',
          })
        );

        // add to quick picks
        if (newId) {
          this.bookmarked = [
            { label, value: newId },
            ...this.bookmarked.filter((b) => b.value !== newId),
          ];
        }

        this.toaster.customToast(res?.message || 'Medicine created', 'success');
        this.searchControl.setValue('');
        this.focusDuration(this.medicineFormArray.length - 1);
      },
      error: () => {
        this.toaster.customToast('Failed to create medicine. Try again.', 'error');
      },
      complete: () => {
        this.loading.isSpinner = false;
      },
    });
  }

  private filter(query: string): Observable<MedicineOption[]> {
    return this.medicineService.searchMedicine(query).pipe(
      map((res: any) => {
        const results = res?.results ?? [];
        return results.map((item: any) => ({
          label: item.medicationName,
          value: item.medicationId,
          genericName: item.genericName || '',
          manufacturer: item.manufacturer || '',
        })) as MedicineOption[];
      })
    );
  }

  // ---------- Quick picks ----------
  toggleMedicine(event: any, medicine: { label: string; value: number }): void {
    if (!event?.isUserInput) return;

    const existingIndex = this.findIndexByNameOrId(medicine.label, medicine.value);

    if (existingIndex === -1) {
      this.medicineFormArray.push(
        this.createRowGroup({
          id: medicine.value,
          name: medicine.label,
          duration: '',
          timming: '',
          mealTime: '',
          notes: '',
        })
      );
      this.focusDuration(this.medicineFormArray.length - 1);
    } else {
      this.removeMedicineAt(existingIndex);
    }
  }

  isMedicineSelected(label: string): boolean {
    return this.findIndexByNameOrId(label, 0) !== -1;
  }

  // ---------- AI add ----------
  addAiSuggestion(suggestion: AiSuggestedItem): void {
    const id = Number(suggestion.value || 0);
    const name = (suggestion.label || '').trim();
    if (!name) return;

    if (this.existsByIdOrName(id, name)) return;

    this.medicineFormArray.push(
      this.createRowGroup({
        id,
        name,
        duration: suggestion.defaultDuration || '',
        timming: suggestion.defaultDose || '',
        notes: suggestion.reason || '',
        mealTime: suggestion.defaultMeal || '',
      })
    );

    this.focusDuration(this.medicineFormArray.length - 1);
  }

  acceptAllAiSuggestions() {
    this.aiSuggestions$.pipe(takeOne()).subscribe((items) => {
      items.forEach((s) => this.addAiSuggestion(s));
    });
  }

  // ---------- Remove + Undo ----------
  removeMedicineAt(index: number): void {
    const row = this.medicineFormArray.at(index)?.value as MedicineRow | undefined;
    if (!row) return;

    this.medicineFormArray.removeAt(index);

    // Undo support
    this.lastRemoved = { index, row };

    if (this.undoTimer) clearTimeout(this.undoTimer);
    this.undoTimer = setTimeout(() => {
      this.lastRemoved = null;
    }, 4500);

    this.toaster.customToast('Medicine removed. (Undo available)', 'warning');
  }

  undoRemove(): void {
    if (!this.lastRemoved) return;
    const { index, row } = this.lastRemoved;

    const safeIndex = Math.min(Math.max(index, 0), this.medicineFormArray.length);
    this.medicineFormArray.insert(safeIndex, this.createRowGroup(row));

    this.lastRemoved = null;
    if (this.undoTimer) clearTimeout(this.undoTimer);

    this.toaster.customToast('Undo successful', 'success');
    this.focusDuration(safeIndex);
  }

  // ---------- Save ----------
  save() {
    const medicationForm = this.prescriptionService.prescribeForm().get('medications') as FormArray;
    medicationForm.clear();

    const rows = this.medicineFormArray.getRawValue() as MedicineRow[];

    rows.forEach((r) => {
      const item: Medicine = {
        id: r.id || 0,
        name: r.name || '',
        duration: r.duration || '',
        timming: r.timming || '',
        mealTime: r.mealTime || '',
        notes: r.notes || '',
      } as Medicine;

      this.prescriptionService.addMedicine(item);
    });

    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  // ---------- Focus helpers ----------
  focusSearch() {
    setTimeout(() => this.searchInput?.nativeElement?.focus(), 0);
  }

  focusDuration(index: number) {
    this.pendingFocusIndex = index;
    // the QueryList might not have updated yet; applyPendingFocus will try too.
    setTimeout(() => this.applyPendingFocus(), 0);
  }

  focusTiming(index: number) {
    setTimeout(() => this.timingInputs?.get(index)?.nativeElement?.focus(), 0);
  }

  focusMeal(index: number) {
    setTimeout(() => this.mealInputs?.get(index)?.nativeElement?.focus(), 0);
  }

  focusNotes(index: number) {
    setTimeout(() => this.notesInputs?.get(index)?.nativeElement?.focus(), 0);
  }

  private applyPendingFocus() {
    if (this.pendingFocusIndex === null) return;
    const el = this.durationInputs?.get(this.pendingFocusIndex)?.nativeElement;
    if (el) {
      el.focus();
      this.pendingFocusIndex = null;
    }
  }

  // ---------- Keyboard shortcuts ----------
  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    // Esc: close
    if (e.key === 'Escape') {
      e.preventDefault();
      this.closeDialog();
      return;
    }

    // Alt + A: focus search
    if (e.altKey && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      this.setSuggestionMode('search');
      this.focusSearch();
      return;
    }

    // Ctrl + Enter: save
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      this.save();
      return;
    }

    // Ctrl + Z: undo remove (optional but useful)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
      if (this.lastRemoved) {
        e.preventDefault();
        this.undoRemove();
      }
    }
  }

  // ---------- Utilities ----------
  timingLabel(combo: string): string {
    switch (combo) {
      case '1+1+0':
        return '(Morning + Noon)';
      case '1+0+1':
        return '(Morning + Night)';
      case '0+1+1':
        return '(Noon + Night)';
      default:
        return '';
    }
  }

  trackByOption = (_: number, item: MedicineOption) => item.value || item.label;
  trackByAiSuggestion = (_: number, item: AiSuggestedItem) => item.value || item.label;
  trackByRowIndex = (i: number) => i;

  private existsByIdOrName(id: number, name: string): boolean {
    const n = (name || '').trim().toLowerCase();
    const rows = this.medicineFormArray.getRawValue() as MedicineRow[];
    return rows.some((r) => (id && r.id === id) || r.name.trim().toLowerCase() === n);
  }

  private findIndexByNameOrId(name: string, id: number): number {
    const n = (name || '').trim().toLowerCase();
    const rows = this.medicineFormArray.getRawValue() as MedicineRow[];
    return rows.findIndex((r) => (id && r.id === id) || r.name.trim().toLowerCase() === n);
  }

  private createRowGroup(row: MedicineRow): FormGroup {
    return new FormGroup({
      id: new FormControl<number>(row.id || 0),
      name: new FormControl<string>(row.name || ''),
      duration: new FormControl<string>(row.duration || ''),
      timming: new FormControl<string>(row.timming || ''),
      mealTime: new FormControl<string>(row.mealTime || ''),
      notes: new FormControl<string>(row.notes || ''),
    });
  }

  private initFromInputData() {
    // deep copy your incoming data; normalize to MedicineRow
    const initial: Medicine[] = Array.isArray(this.data) ? JSON.parse(JSON.stringify(this.data)) : [];
    this.medicineFormArray.clear();

    initial.forEach((m) => {
      this.medicineFormArray.push(
        this.createRowGroup({
          id: Number((m as any).id || 0),
          name: String((m as any).name || ''),
          duration: String((m as any).duration || ''),
          timming: String((m as any).timming || ''),
          mealTime: String((m as any).mealTime || ''),
          notes: String((m as any).notes || ''),
        })
      );
    });
  }

  private getBookmarked(id: number) {
    this.loading.isSkelton = true;

    this.medicineService.getBookmarkedMedicines(id).subscribe({
      next: (res: any) => {
        if (res?.isSuccess) {
          this.bookmarked =
            (res?.results ?? []).map((r: any) => ({
              label: r.medicationName,
              value: r.medicationId,
            })) || [];
          this.loading.isSkelton = false;
        } else {
          this.loading.isSkelton = false;
          this.loading.noDataFound = true;
        }
      },
      error: () => {
        this.loading.isSkelton = false;
        this.loading.noDataFound = true;
      },
    });
  }

  private buildAiContext(): Record<string, unknown> {
    const form = this.prescriptionService.prescribeForm();
    const diagnosisForm = form.get('diagnosis') as FormArray;
    const complaintsForm = form.get('chiefComplaints') as FormArray;

    const diagnosis = (diagnosisForm?.value as any[] | undefined)?.map((item) => item?.name).filter(Boolean) || [];
    const complaints = (complaintsForm?.value as any[] | undefined)?.map((item) => item?.name).filter(Boolean) || [];

    const patientGroup = form.get('patient');
    const patient = patientGroup?.value as { patientAge?: string; patientGender?: string };

    // helpful empty message for AI mode
    const hasContext = diagnosis.length || complaints.length || patient?.patientAge || patient?.patientGender;
    this.aiEmptyMessage = hasContext
      ? 'No AI suggestions'
      : 'No AI suggestions (add diagnosis/complaints/age/gender for better results)';

    const rows = this.medicineFormArray.getRawValue() as MedicineRow[];

    return {
      diagnosis,
      complaints,
      patient: {
        age: patient?.patientAge,
        gender: patient?.patientGender,
      },
      medications: rows.map((med) => ({
        id: med.id,
        name: med.name,
      })),
    };
  }
}

// tiny helper: take one value from observable without importing rxjs/operators separately
function takeOne<T>() {
  return (source: Observable<T>) =>
    new Observable<T>((subscriber) => {
      const sub = source.subscribe({
        next: (v) => {
          subscriber.next(v);
          subscriber.complete();
        },
        error: (e) => subscriber.error(e),
      });
      return () => sub.unsubscribe();
    });
}
