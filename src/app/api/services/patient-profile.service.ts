import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL, } from '../api-urls';
import type {
  DataFilterModel,
  FilterModel,
  PatientProfileDto,
} from '../dto-models/models';
import type { PatientProfileInputDto } from '../input-dto/models';

function buildFilterParams(
  filter: DataFilterModel,
  paging?: FilterModel
): HttpParams {
  let params = new HttpParams();

  const setIfPresent = (key: string, value: unknown) => {
    if (value !== undefined && value !== null && value !== '') {
      params = params.set(key, String(value));
    }
  };

  setIfPresent('name', filter.name);
  setIfPresent('consultancyType', filter.consultancyType);
  setIfPresent('specialityId', filter.specialityId);
  setIfPresent('specializationId', filter.specializationId);
  setIfPresent('appointmentStatus', filter.appointmentStatus);
  setIfPresent('fromDate', filter.fromDate);
  setIfPresent('toDate', filter.toDate);
  setIfPresent('isCurrentOnline', filter.isCurrentOnline);
  setIfPresent('isActive', filter.isActive);

  if (paging) {
    setIfPresent('offset', paging.offset);
    setIfPresent('limit', paging.limit);
    setIfPresent('pageNo', paging.pageNo);
    setIfPresent('pageSize', paging.pageSize);
    setIfPresent('sortBy', paging.sortBy);
    setIfPresent('sortOrder', paging.sortOrder);
    setIfPresent('isDesc', paging.isDesc);
  }

  return params;
}

@Injectable({ providedIn: 'root' })
export class PatientProfileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  create(input: PatientProfileInputDto): Observable<PatientProfileDto> {
    return this.http.post<PatientProfileDto>(
      `${this.baseUrl}/api/app/patient-profile`,
      input
    );
  }

  get(id: number): Observable<PatientProfileDto> {
    return this.http.get<PatientProfileDto>(
      `${this.baseUrl}/api/app/patient-profile/${id}`
    );
  }

  getByPhoneAndCode(
    pCode: string,
    pPhone: string
  ): Observable<PatientProfileDto> {
    const params = new HttpParams().set('pCode', pCode).set('pPhone', pPhone);

    return this.http.get<PatientProfileDto>(
      `${this.baseUrl}/api/app/patient-profile/by-phone-and-code`,
      { params }
    );
  }

  getByUserId(userId: string): Observable<PatientProfileDto> {
    return this.http.get<PatientProfileDto>(
      `${this.baseUrl}/api/app/patient-profile/by-user-id/${userId}`
    );
  }

  getByUserName(userName: string): Observable<PatientProfileDto> {
    const params = new HttpParams().set('userName', userName);

    return this.http.get<PatientProfileDto>(
      `${this.baseUrl}/api/app/patient-profile/by-user-name`,
      { params }
    );
  }

  getDoctorListByCreatorIdFilter(
    profileId: number,
    patientFilterModel: DataFilterModel,
    filterModel: FilterModel
  ): Observable<PatientProfileDto[]> {
    return this.http.get<PatientProfileDto[]>(
      `${this.baseUrl}/api/app/patient-profile/doctor-list-by-creator-id-filter/${profileId}`,
      { params: buildFilterParams(patientFilterModel, filterModel) }
    );
  }

  getDoctorListFilter(
    patientFilterModel: DataFilterModel,
    filterModel: FilterModel
  ): Observable<PatientProfileDto[]> {
    return this.http.get<PatientProfileDto[]>(
      `${this.baseUrl}/api/app/patient-profile/doctor-list-filter`,
      { params: buildFilterParams(patientFilterModel, filterModel) }
    );
  }

  getList(): Observable<PatientProfileDto[]> {
    return this.http.get<PatientProfileDto[]>(
      `${this.baseUrl}/api/app/patient-profile`
    );
  }

  getListPatientListByAdmin(): Observable<PatientProfileDto[]> {
    return this.http.get<PatientProfileDto[]>(
      `${this.baseUrl}/api/app/patient-profile/patient-list-by-admin`
    );
  }

  getListPatientListByAgentMaster(
    masterId: number
  ): Observable<PatientProfileDto[]> {
    return this.http.get<PatientProfileDto[]>(
      `${this.baseUrl}/api/app/patient-profile/patient-list-by-agent-master/${masterId}`
    );
  }

  getListPatientListByAgentSuperVisor(
    supervisorId: number
  ): Observable<PatientProfileDto[]> {
    return this.http.get<PatientProfileDto[]>(
      `${this.baseUrl}/api/app/patient-profile/patient-list-by-agent-super-visor/${supervisorId}`
    );
  }

  getPatientListBySearchUserProfileId(
    profileId: number,
    role: string,
    name: string
  ): Observable<PatientProfileDto[]> {
    const params = new HttpParams().set('role', role).set('name', name);

    return this.http.get<PatientProfileDto[]>(
      `${this.baseUrl}/api/app/patient-profile/patient-list-by-search-user-profile-id/${profileId}`,
      { params }
    );
  }

  getPatientListByUserProfileId(
    profileId: number,
    role: string
  ): Observable<PatientProfileDto[]> {
    const params = new HttpParams().set('role', role);

    return this.http.get<PatientProfileDto[]>(
      `${this.baseUrl}/api/app/patient-profile/patient-list-by-user-profile-id/${profileId}`,
      { params }
    );
  }

  getPatientListFilterByAdmin(
    userId: number,
    role: string,
    patientFilterModel: DataFilterModel,
    filterModel: FilterModel
  ): Observable<PatientProfileDto[]> {
    const params = buildFilterParams(patientFilterModel, filterModel).set(
      'role',
      role
    );

    return this.http.get<PatientProfileDto[]>(
      `${this.baseUrl}/api/app/patient-profile/patient-list-filter-by-admin/${userId}`,
      { params }
    );
  }

  update(input: PatientProfileInputDto): Observable<PatientProfileDto> {
    return this.http.put<PatientProfileDto>(
      `${this.baseUrl}/api/app/patient-profile`,
      input
    );
  }
}
