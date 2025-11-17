import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-urls';
import type {
  DataFilterModel,
  DoctorProfileDto,
  FilterModel,
} from '../dto-models/models';
import type { DoctorProfileInputDto } from '../input-dto/models';

function createFilterParams(
  doctorFilterModel: DataFilterModel,
  filterModel?: FilterModel
): HttpParams {
  let params = new HttpParams();

  const setIfPresent = (key: string, value: unknown) => {
    if (value !== undefined && value !== null && value !== '') {
      params = params.set(key, String(value));
    }
  };

  setIfPresent('name', doctorFilterModel.name);
  setIfPresent('consultancyType', doctorFilterModel.consultancyType);
  setIfPresent('specialityId', doctorFilterModel.specialityId);
  setIfPresent('specializationId', doctorFilterModel.specializationId);
  setIfPresent('appointmentStatus', doctorFilterModel.appointmentStatus);
  setIfPresent('fromDate', doctorFilterModel.fromDate);
  setIfPresent('toDate', doctorFilterModel.toDate);
  setIfPresent('isCurrentOnline', doctorFilterModel.isCurrentOnline);
  setIfPresent('isActive', doctorFilterModel.isActive);

  if (filterModel) {
    setIfPresent('offset', filterModel.offset);
    setIfPresent('limit', filterModel.limit);
    setIfPresent('pageNo', filterModel.pageNo);
    setIfPresent('pageSize', filterModel.pageSize);
    setIfPresent('sortBy', filterModel.sortBy);
    setIfPresent('sortOrder', filterModel.sortOrder);
    setIfPresent('isDesc', filterModel.isDesc);
  }

  return params;
}

@Injectable({ providedIn: 'root' })
export class DoctorProfileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  create(input: DoctorProfileInputDto): Observable<DoctorProfileDto> {
    return this.http.post<DoctorProfileDto>(
      `${this.baseUrl}/api/app/doctor-profile`,
      input
    );
  }

  get(id: number): Observable<DoctorProfileDto> {
    return this.http.get<DoctorProfileDto>(
      `${this.baseUrl}/api/app/doctor-profile/${id}`
    );
  }

  getAllActiveDoctorList(): Observable<DoctorProfileDto[]> {
    return this.http.get<DoctorProfileDto[]>(
      `${this.baseUrl}/api/app/doctor-profile/active-doctor-list`
    );
  }

  getByUserId(userId: string): Observable<DoctorProfileDto> {
    return this.http.get<DoctorProfileDto>(
      `${this.baseUrl}/api/app/doctor-profile/by-user-id/${userId}`
    );
  }

  getByUserName(userName: string): Observable<DoctorProfileDto> {
    return this.http.get<DoctorProfileDto>(
      `${this.baseUrl}/api/app/doctor-profile/by-user-name`,
      {
        params: new HttpParams().set('userName', userName),
      }
    );
  }
   getByUserEmail(email: string): Observable<DoctorProfileDto> {
    return this.http.get<DoctorProfileDto>(
      `${this.baseUrl}/api/app/doctor-profile/by-user-email`,
      {
        params: new HttpParams().set('userEmail', email),
      }
    );
  }

  getCurrentlyOnlineDoctorList(): Observable<DoctorProfileDto[]> {
    return this.http.get<DoctorProfileDto[]>(
      `${this.baseUrl}/api/app/doctor-profile/currently-online-doctor-list`
    );
  }

  getDoctorByProfileId(id: number): Observable<DoctorProfileDto> {
    return this.http.get<DoctorProfileDto>(`/assets/doctorById.json`);
  }

  getDoctorDetailsByAdmin(id: number): Observable<DoctorProfileDto> {
    return this.http.get<DoctorProfileDto>(
      `${this.baseUrl}/api/app/doctor-profile/${id}/doctor-details-by-admin`
    );
  }

  getDoctorListFilter(
    doctorFilterModel: DataFilterModel,
    filterModel: FilterModel
  ): Observable<DoctorProfileDto[]> {
    return this.http.get<DoctorProfileDto[]>(
      `${this.baseUrl}/api/app/doctor-profile/doctor-list-filter`,
      {
        params: createFilterParams(doctorFilterModel, filterModel),
      }
    );
  }

  getDoctorListFilterByAdmin(
    doctorFilterModel: DataFilterModel,
    filterModel: FilterModel
  ): Observable<DoctorProfileDto[]> {
    return this.http.get<DoctorProfileDto[]>(
      `${this.baseUrl}/api/app/doctor-profile/doctor-list-filter-by-admin`,
      {
        params: createFilterParams(doctorFilterModel, filterModel),
      }
    );
  }

  getDoctorListFilterMobileApp(
    doctorFilterModel: DataFilterModel,
    filterModel: FilterModel
  ): Observable<DoctorProfileDto[]> {
    return this.http.get<DoctorProfileDto[]>(
      `${this.baseUrl}/api/app/doctor-profile/doctor-list-filter-mobile-app`,
      {
        params: createFilterParams(doctorFilterModel, filterModel),
      }
    );
  }

  getDoctorsCountByFilters(
    doctorFilterModel: DataFilterModel
  ): Observable<number> {
    return this.http.get<number>(
      `${this.baseUrl}/api/app/doctor-profile/doctors-count-by-filters`,
      {
        params: createFilterParams(doctorFilterModel),
      }
    );
  }

  getList(): Observable<DoctorProfileDto[]> {
    return this.http.get<DoctorProfileDto[]>(
      `${this.baseUrl}/api/app/doctor-profile`
    );
  }

  getListDoctorListByAdmin(): Observable<DoctorProfileDto[]> {
    return this.http.get<DoctorProfileDto[]>(
      `${this.baseUrl}/api/app/doctor-profile/doctor-list-by-admin`
    );
  }

  getLiveOnlineDoctorList(
    filterModel: FilterModel
  ): Observable<DoctorProfileDto[]> {
    const params = new HttpParams({
      fromObject: {
        offset: String(filterModel.offset ?? ''),
        limit: String(filterModel.limit ?? ''),
        pageNo: String(filterModel.pageNo ?? ''),
        pageSize: String(filterModel.pageSize ?? ''),
        sortBy: filterModel.sortBy ?? '',
        sortOrder: filterModel.sortOrder ?? '',
        isDesc: String(filterModel.isDesc ?? ''),
      },
    });

    return this.http.get<DoctorProfileDto[]>(
      `${this.baseUrl}/api/app/doctor-profile/live-online-doctor-list`,
      { params }
    );
  }

  update(input: DoctorProfileInputDto): Observable<DoctorProfileDto> {
    return this.http.put<DoctorProfileDto>(
      `${this.baseUrl}/api/app/doctor-profile`,
      input
    );
  }

  updateActiveStatusByAdminByIdAndActiveStatus(
    id: number,
    activeStatus: boolean
  ): Observable<DoctorProfileDto> {
    return this.http.put<DoctorProfileDto>(
      `${this.baseUrl}/api/app/doctor-profile/active-status-by-admin/${id}`,
      null,
      {
        params: new HttpParams().set('activeStatus', String(activeStatus)),
      }
    );
  }

  updateDoctorProfile(
    input: DoctorProfileInputDto
  ): Observable<DoctorProfileDto> {
    return this.http.put<DoctorProfileDto>(
      `${this.baseUrl}/api/app/doctor-profile/doctor-profile`,
      input
    );
  }

  updateDoctorsOnlineStatusByIdAndOnlineStatus(
    id: number,
    onlineStatus: boolean
  ): Observable<DoctorProfileDto> {
    return this.http.put<DoctorProfileDto>(
      `${this.baseUrl}/api/app/doctor-profile/doctors-online-status/${id}`,
      null,
      {
        params: new HttpParams().set('onlineStatus', String(onlineStatus)),
      }
    );
  }

  updateExpertiseByIdAndExpertise(
    id: number,
    expertise: string
  ): Observable<DoctorProfileDto> {
    return this.http.put<DoctorProfileDto>(
      `${this.baseUrl}/api/app/doctor-profile/expertise/${id}`,
      null,
      {
        params: new HttpParams().set('expertise', expertise),
      }
    );
  }

  updateProfileStep(
    profileId: number,
    step: number
  ): Observable<DoctorProfileDto> {
    return this.http.put<DoctorProfileDto>(
      `${this.baseUrl}/api/app/doctor-profile/profile-step/${profileId}`,
      null,
      {
        params: new HttpParams().set('step', String(step)),
      }
    );
  }
}
