import { Injectable, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import {
  Advice,
  Complaint,
  Diagnosis,
  Followup,
  History,
  Medicine,
  OnExam,
  Test,
} from './model/model';
import { prescriptionApi } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionService {
  private baseUrl = `${prescriptionApi}/api/2025-02`;

  prescribeForm = signal<FormGroup>(this.createPrescribeForm());

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  private createPrescribeForm(): FormGroup {
    return this.fb.group({
      isPreHand: [false],
      patient: this.fb.group({
        patientName: ['', Validators.required],
        patientAge: [''],
        patientGender: [''],
        patientBloodGroup: [''],
        patientProfileId: [0, Validators.required],
        patientCode: ['', Validators.required],
        patientPhoneNo: [''],
      }),
      appointmentId: [null],
      appointmentCode: [null],
      isHeader: true,
      doctor: this.fb.group({
        doctorName: [''],
        doctorProfileId: [''],
        specializationName: [''],
        doctorCode: [''],
        degree: [''],
        areaOfExperties: [''],
        qualification: [''],
        chamber: [''],
        schedule: [''],
        bmdc: [''],
        signature: [''],
        expertise: [''],
      }),
      chiefComplaints: this.fb.array([]),
      history: this.fb.array([]),
      examination: this.fb.array([]),
      diagnosis: this.fb.array([]),
      medications: this.fb.array([]),
      test: this.fb.array([]),
      advice: this.fb.array([]),
      followUp: '',
      uploadImage: [''],
    });
  }

  addComplaint(complaint: Complaint): void {
    this.prescribeForm.update((form) => {
      const chiefComplaints = form.get('chiefComplaints') as FormArray;
      chiefComplaints.push(
        this.fb.group({
          name: [complaint.name, Validators.required],
          duration: [complaint.duration, Validators.required],
          days: [complaint.duration, Validators.required],
          notes: [complaint.notes, Validators.required],
          id: [complaint.id, Validators.required],
        })
      );
      return form;
    });
    this.printForm();
  }

  addHistory(history: History): void {
    console.log(history);

    this.prescribeForm.update((form) => {
      const chiefComplaints = form.get('history') as FormArray;
      chiefComplaints.push(
        this.fb.group({
          name: [history.name, Validators.required],
          pastHistory: [history.pastHistory, Validators.required],
          presentHistory: [history.presentHistory, Validators.required],
          id: [history.id, Validators.required],
        })
      );
      console.log(history, form);

      return form;
    });
    this.printForm();
  }
  addDiagnosis(diagnosis: Diagnosis): void {
    this.prescribeForm.update((form) => {
      const formDiagnosis = form.get('diagnosis') as FormArray;
      formDiagnosis.push(
        this.fb.group({
          name: [diagnosis.name, Validators.required],
          pastDiagnosis: [diagnosis.pastDiagnosis, Validators.required],
          presentDiagnosis: [diagnosis.presentDiagnosis, Validators.required],
          id: [diagnosis.id, Validators.required],
        })
      );
      return form;
    });
    this.printForm();
  }
  addAdvice(advice: Advice): void {
    this.prescribeForm.update((form) => {
      const formDiagnosis = form.get('advice') as FormArray;
      formDiagnosis.push(
        this.fb.group({
          name: [advice.name, Validators.required],
          notes: [advice.notes, Validators.required],
          id: [advice.id, Validators.required],
        })
      );
      console.log(history, form);

      return form;
    });
    this.printForm();
  }
  addTest(test: Test): void {
    this.prescribeForm.update((form) => {
      const formTest = form.get('test') as FormArray;
      formTest.push(
        this.fb.group({
          name: [test.name, Validators.required],
          notes: [test.notes, Validators.required],
          id: [test.id, Validators.required],
        })
      );
      return form;
    });
    this.printForm();
  }
  addMedicine(medicine: Medicine): void {
    console.log(medicine);
    this.prescribeForm.update((form) => {
      const formMedications = form.get('medications') as FormArray;
      formMedications.push(
        this.fb.group({
          name: [medicine.name, Validators.required],
          notes: [medicine.notes, Validators.required],
          id: [medicine.id, Validators.required],
          duration: [medicine.duration, Validators.required],
          timming: [medicine.timming, Validators.required],
          mealTime: [medicine.mealTime, Validators.required],
        })
      );
      return form;
    });
    this.printForm();
  }
  addOnExam(onExam: FormGroup) {
    this.prescribeForm.update((form) => {
      const formExam = form.get('examination') as FormArray;

      if (formExam.length > 0) {
        formExam.at(0).patchValue(onExam.value);
      } else {
        formExam.push(onExam);
      }

      return form;
    });

    this.printForm();
  }
  addPatient(patient: FormGroup) {
    this.prescribeForm.update((form) => {
      form.setControl('patient', patient);
      return form;
    });
    this.printForm();
  }
  setFollowUp(date: string) {
    this.prescribeForm.update((form) => {
      form.patchValue({ followUp: date });
      return form;
    });
  }
  setPatientInfo(patient: {
    patientName: string;
    patientAge: string;
    patientGender: string | null;
    patientProfileId: number | null;
    patientCode: string | null;
    patientPhoneNo: string | null;
    patientBloodGroup: string | null;
  }) {
    this.prescribeForm.update((form) => {
      form.patchValue({ patient });
      return form;
    });
  }
  setPreHand(status: boolean) {
    this.prescribeForm.update((form) => {
      form.patchValue({ isPreHand: status });
      return form;
    });
  }
  setIsHeader(status: boolean) {
    this.prescribeForm.update((form) => {
      form.patchValue({ isHeader: status });
      return form;
    });
  }
  setIsTemplate(status: boolean) {
    this.prescribeForm.update((form) => {
      form.patchValue({ isTemplate: status });
      return form;
    });
  }
  setAppointmentId(id: number) {
    this.prescribeForm.update((form) => {
      form.patchValue({ appointmentId: id });
      return form;
    });
  }
  setAppointmentCode(code?: string) {
    this.prescribeForm.update((form) => {
      form.patchValue({ appointmentCode: code });
      return form;
    });
  }
  setUploadImage(url: string) {
    this.prescribeForm.update((form) => {
      form.patchValue({ uploadImage: url });
      return form;
    });
    this.printForm();
  }
  setDoctorInfo(doctor: {
    doctorName?: string;
    doctorProfileId?: number | null;
    doctorCode?: string | null;
    areaOfExperties?: string | null;
    qualification?: string | null;
    bmdc?: string | null;
    degree?: any[];
    chamber?: any[];
    schedule?: any[];
    signature?: string | null;
    expertise?: string | null;
  }) {
    this.prescribeForm.update((form) => {
      form.patchValue({ doctor });
      return form;
    });
  }

  submitPrescription(): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/create-prescription`,
      this.prescribeForm().value
    );
  }
  saveAsTemplate(name: string) {
    return this.http.post<any>(`${this.baseUrl}/create-prescription`, {
      ...this.prescribeForm().value,
      templateName: name,
      isTemplate: true,
    });
  }

  removeComplaint(index: number): void {
    this.prescribeForm.update((form) => {
      const chiefComplaints = form.get('chiefComplaints') as FormArray;

      // Ensure the index is valid before attempting to remove
      if (index >= 0 && index < chiefComplaints.length) {
        chiefComplaints.removeAt(index);
      }

      return form;
    });

    // Print the updated form state after removal
    this.printForm();
  }
  resetForm(): void {
   
    this.prescribeForm.update((form) => {
      const currentDoctor = form.get('doctor')?.value;
      const appointmentCode = form.get('appointmentCode')?.value;
      const isPreHand = form.get('isPreHand')?.value;
      const isHeader = form.get('isHeader')?.value;
      const appointmentId = form.get('appointmentId')?.value;
      const patient = form.get('patient')?.value;
      // const followUp = form.get('followUp')?.value;
      // const uploadImage = form.get('uploadImage')?.value;

      form.patchValue({
        doctor: currentDoctor,
        //  appointmentCode:'',
        isPreHand: false,
        isHeader: true,
        // appointmentId,

        followUp: '',
        uploadImage: '',
        // appointmentCode: '',
        // appointmentId: 0,
        // isPreHand: '',
      });

      form.get('patient')?.patchValue({
        patientName: '',
        patientAge: '',
        patientGender: '',
        patientProfileId: 0,
        patientCode: '',
        patientPhoneNo: '',
        patientBloodGroup: '',
      });

      // form.patchValue({
      //   doctor: currentDoctor,
      //   isHeader,
      //   followUp: '',
      //   uploadImage: '',
      // });

      const arraysToClear = [
        'chiefComplaints',
        'history',
        'examination',
        'diagnosis',
        'medications',
        'test',
        'advice',
      ];
      arraysToClear.forEach((key) => {
        const array = form.get(key) as FormArray;
        while (array.length > 0) {
          array.removeAt(0);
        }
      });

      return form;
    });
  }

  printForm(): void {
    console.log(this.prescribeForm().value);
  }

  resetArrayField() {}

  getPrescriptionTemplate(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/get-template-prescription-by-id?templateId=${id}`
    );
  }
  populateFormFromApiData(data: any) {
    this.setFollowUp(data.followUp);

    data.chiefComplaints?.forEach((complaint: Complaint) => {
      this.addComplaint(complaint);
    });

    data.history?.forEach((history: History) => {
      this.addHistory(history);
    });

    data.diagnosis?.forEach((diagnosis: Diagnosis) => {
      this.addDiagnosis(diagnosis);
    });

    data.advice?.forEach((advice: Advice) => {
      this.addAdvice(advice);
    });

    data.test?.forEach((test: Test) => {
      this.addTest(test);
    });

    data.medications?.forEach((medicine: Medicine) => {
      this.addMedicine(medicine);
    });

    data.examination?.forEach((exam: OnExam) => {
      const examGroup = this.fb.group({
        systolic: [exam.systolic],
        diastolic: [exam.diastolic],
        pulse: [exam.pulse],
        temperature: [exam.temperature],
        weight: [exam.weight],
        heightFeet: [exam.heightFeet],
        heightInches: [exam.heightInches],
      });
      this.addOnExam(examGroup);
    });

    this.printForm();
  }

  getPrescriptionTemplates(doctorId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/gets-all-prescription-template-by-doctor-id?DoctorId=${doctorId}`
    );
  }
}
