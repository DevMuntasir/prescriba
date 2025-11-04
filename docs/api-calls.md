# API Calls Reference

This document lists every HTTP request made through Angular `HttpClient` instances in the project. Base URLs come from `src/environments/environment.ts` unless otherwise noted:

- `environment.apis.default.url`
- `authenticationApi`
- `prescriptionApi`

## Shared Services

### `src/app/shared/services/prescription/prescription.service.ts`

| Method | HTTP | Endpoint (relative to `prescriptionApi`) | Notes |
| --- | --- | --- | --- |
| `getPrescriptionByPatientIdDoctorId` | GET | `/api/2025-02/get-pdf-prescriptions-by-patient-doctor-id` | Query params: `patientId`, `doctorId`. |
| `getPreHandPrescriptionByDoctorId` | GET | `/api/2025-02/get-pdf-prescriptions-by-doctor-prehand-id` | Query param: `doctorId`. |
| `getPrescriptionByPatientId` | GET | `/api/2025-02/get-pdf-prescriptions-by-patient-doctor-id` | Query param: `patientId`. |
| `getPrescriptionByAppointmentId` | GET | `/api/2025-02/get-prescription-pdf-by-appointment-id` | Query param: `appointmentId`. |

## Core Auth Module Services

### `src/app/core-modules/auth/auth-service/auth.service.ts`

| Method | HTTP | Endpoint (relative to `authenticationApi`) | Notes |
| --- | --- | --- | --- |
| `loginApiByRequest` | POST | `/api/app/auth/login-api` | Body: `UserSignInRequestDto`. |
| `refreshTokenByInput` | POST | `/api/app/auth/refresh-token` | Body: `RefreshTokenInput`. |
| `verifyAccessTokenByInput` | POST | `/api/app/auth/verify-access-token` | Body: `VerifyAccessTokenInput`. |

### `src/app/core-modules/auth/auth-service/user-manage-accounts.service.ts`

| Method | HTTP | Endpoint | Notes |
| --- | --- | --- | --- |
| `checkUserExistByUserNameByMobileNo` | POST | `${authenticationApi}/api/app/user-manage-accounts/check-user-exist-by-user-name` | Query param: `mobileNo`. Empty body. |
| `getUserRoles` | GET | `${authenticationApi}/api/app/user-manage-accounts/user-roles/{userId}` | — |
| `resetPasswordByInputDto` | POST | `${authenticationApi}/api/app/user-manage-accounts/reset-password` | Body: `ResetPasswordInputDto`. |
| `sendOtpByRequest` | POST | `${authenticationApi}/api/app/user-manage-accounts/send-otp` | Body: `SendOtpModel`. |
| `signupUserByRequest` | POST | `${authenticationApi}/api/app/user-manage-accounts/signup-user` | Body: `UserSingupRequestDto`. |
| `verifyOtpByRequest` | POST | `${authenticationApi}/api/app/user-manage-accounts/verify-otp` | Body: `OtpRequestDto`. |
| `validateOrganizationById` | POST | `${environment.apis.default.url}/api/app/user-manage-accounts/validate-origanization-by-id` | Query params: `organizationId`, `userId`. Null body. |

## API Client Services (`src/app/api/services`)

### `appointment.service.ts`

| Method | HTTP | Endpoint (relative to `environment.apis.default.url`) | Notes |
| --- | --- | --- | --- |
| `getPatientsByDoctorId` | GET | `/api/app/appointment/patient-list-by-doctor-id/{doctorId}` | Optional query params: `name`, `pageNumber`, `pageSize`. |

### `auth.service.ts`

| Method | HTTP | Endpoint (relative to `authenticationApi`) | Notes |
| --- | --- | --- | --- |
| `loginApiByRequest` | POST | `/api/app/auth/login-api` | Body: `UserSignInRequestDto`. |
| `refreshTokenByInput` | POST | `/api/app/auth/refresh-token` | Body: `RefreshTokenInput`. |
| `verifyAccessTokenByInput` | POST | `/api/app/auth/verify-access-token` | Body: `VerifyAccessTokenInput`. |

### `degree.service.ts`

| Method | HTTP | Endpoint | Notes |
| --- | --- | --- | --- |
| `create` | POST | `${environment.apis.default.url}/api/app/degree` | Body: `DegreeInputDto`. |
| `get` | GET | `${environment.apis.default.url}/api/app/degree/{id}` | — |
| `getList` | GET | `${environment.apis.default.url}/api/app/degree` | — |
| `update` | PUT | `${environment.apis.default.url}/api/app/degree` | Body: `DegreeInputDto`. |

### `doctor-chamber.service.ts`

| Method | HTTP | Endpoint | Notes |
| --- | --- | --- | --- |
| `create` | POST | `${environment.apis.default.url}/api/app/doctor-chamber` | Body: `DoctorChamberInputDto`. |
| `update` | PUT | `${environment.apis.default.url}/api/app/doctor-chamber/{id}` | Body: `DoctorChamberInputDto`. |
| `delete` | DELETE | `${environment.apis.default.url}/api/app/doctor-chamber/{id}` | — |
| `get` | GET | `${environment.apis.default.url}/api/app/doctor-chamber/{id}` | — |
| `getListByDoctorId` | GET | `${environment.apis.default.url}/api/app/doctor-chamber/by-doctor/{doctorProfileId}` | — |

### `doctor-degree.service.ts`

| Method | HTTP | Endpoint | Notes |
| --- | --- | --- | --- |
| `create` | POST | `${environment.apis.default.url}/api/app/doctor-degree` | Body: `DoctorDegreeInputDto`. |
| `delete` | DELETE | `${environment.apis.default.url}/api/app/doctor-degree/{id}` | — |
| `get` | GET | `${environment.apis.default.url}/api/app/doctor-degree/{id}` | — |
| `getDoctorDegreeListByDoctorId` | GET | `${environment.apis.default.url}/api/app/doctor-degree/doctor-degree-list-by-doctor-id/{doctorId}` | — |
| `getList` | GET | `${environment.apis.default.url}/api/app/doctor-degree` | — |
| `getListByDoctorId` | GET | `${environment.apis.default.url}/api/app/doctor-degree/by-doctor-id/{doctorId}` | — |
| `update` | PUT | `${environment.apis.default.url}/api/app/doctor-degree` | Body: `DoctorDegreeInputDto`. |

### `doctor-profile.service.ts`

| Method | HTTP | Endpoint | Notes |
| --- | --- | --- | --- |
| `create` | POST | `${environment.apis.default.url}/api/app/doctor-profile` | Body: `DoctorProfileInputDto`. |
| `get` | GET | `${environment.apis.default.url}/api/app/doctor-profile/{id}` | — |
| `getAllActiveDoctorList` | GET | `${environment.apis.default.url}/api/app/doctor-profile/active-doctor-list` | — |
| `getByUserId` | GET | `${environment.apis.default.url}/api/app/doctor-profile/by-user-id/{userId}` | — |
| `getByUserName` | GET | `${environment.apis.default.url}/api/app/doctor-profile/by-user-name` | Query param: `userName`. |
| `getCurrentlyOnlineDoctorList` | GET | `${environment.apis.default.url}/api/app/doctor-profile/currently-online-doctor-list` | — |
| `getDoctorDetailsByAdmin` | GET | `${environment.apis.default.url}/api/app/doctor-profile/{id}/doctor-details-by-admin` | — |
| `getDoctorListFilter` | GET | `${environment.apis.default.url}/api/app/doctor-profile/doctor-list-filter` | Query params built from `DataFilterModel` & `FilterModel`. |
| `getDoctorListFilterByAdmin` | GET | `${environment.apis.default.url}/api/app/doctor-profile/doctor-list-filter-by-admin` | Filter params. |
| `getDoctorListFilterMobileApp` | GET | `${environment.apis.default.url}/api/app/doctor-profile/doctor-list-filter-mobile-app` | Filter params. |
| `getDoctorsCountByFilters` | GET | `${environment.apis.default.url}/api/app/doctor-profile/doctors-count-by-filters` | Filter params. |
| `getList` | GET | `${environment.apis.default.url}/api/app/doctor-profile` | — |
| `getListDoctorListByAdmin` | GET | `${environment.apis.default.url}/api/app/doctor-profile/doctor-list-by-admin` | — |
| `getLiveOnlineDoctorList` | GET | `${environment.apis.default.url}/api/app/doctor-profile/live-online-doctor-list` | Paging params. |
| `update` | PUT | `${environment.apis.default.url}/api/app/doctor-profile` | Body: `DoctorProfileInputDto`. |
| `updateActiveStatusByAdminByIdAndActiveStatus` | PUT | `${environment.apis.default.url}/api/app/doctor-profile/active-status-by-admin/{id}` | Query param: `activeStatus`. |
| `updateDoctorProfile` | PUT | `${environment.apis.default.url}/api/app/doctor-profile/doctor-profile` | Body: `DoctorProfileInputDto`. |
| `updateDoctorsOnlineStatusByIdAndOnlineStatus` | PUT | `${environment.apis.default.url}/api/app/doctor-profile/doctors-online-status/{id}` | Query param: `onlineStatus`. |
| `updateExpertiseByIdAndExpertise` | PUT | `${environment.apis.default.url}/api/app/doctor-profile/expertise/{id}` | Query param: `expertise`. |
| `updateProfileStep` | PUT | `${environment.apis.default.url}/api/app/doctor-profile/profile-step/{profileId}` | Query param: `step`. |

### `doctor-schedule.service.ts`

| Method | HTTP | Endpoint | Notes |
| --- | --- | --- | --- |
| `create` | POST | `${environment.apis.default.url}/api/app/doctor-schedule` | Body: `DoctorScheduleInputDto`. |
| `get` | GET | `${environment.apis.default.url}/api/app/doctor-schedule/{id}` | — |
| `getListByDoctorIdList` | GET | `${environment.apis.default.url}/api/app/doctor-schedule/by-doctor-id-list/{doctorId}` | — |
| `update` | PUT | `${environment.apis.default.url}/api/app/doctor-schedule/{id}` | Body: `DoctorScheduleInputDto`. |
| `delete` | DELETE | `${environment.apis.default.url}/api/app/doctor-schedule/{id}` | — |

### `doctor-specialization.service.ts`

| Method | HTTP | Endpoint | Notes |
| --- | --- | --- | --- |
| `create` | POST | `${environment.apis.default.url}/api/app/doctor-specialization` | Body: `DoctorSpecializationInputDto`. |
| `delete` | DELETE | `${environment.apis.default.url}/api/app/doctor-specialization/{id}` | — |
| `get` | GET | `${environment.apis.default.url}/api/app/doctor-specialization/{id}` | — |
| `getBySpecialityId` | GET | `${environment.apis.default.url}/api/app/doctor-specialization/by-speciality-id/{specialityId}` | — |
| `getDoctorSpecializationListByDoctorId` | GET | `${environment.apis.default.url}/api/app/doctor-specialization/doctor-specialization-list-by-doctor-id/{doctorId}` | — |
| `getDoctorSpecializationListByDoctorIdSpecialityId` | GET | `${environment.apis.default.url}/api/app/doctor-specialization/doctor-specialization-list-by-doctor-id-speciality-id` | Query params: `doctorId`, `specialityId`. |
| `getDoctorSpecializationListBySpecialityId` | GET | `${environment.apis.default.url}/api/app/doctor-specialization/doctor-specialization-list-by-speciality-id/{specialityId}` | — |
| `getList` | GET | `${environment.apis.default.url}/api/app/doctor-specialization` | — |
| `getListByDoctorIdSpId` | GET | `${environment.apis.default.url}/api/app/doctor-specialization/by-doctor-id-sp-id` | Query params: `doctorId`, `specialityId`. |
| `update` | PUT | `${environment.apis.default.url}/api/app/doctor-specialization` | Body: `DoctorSpecializationInputDto`. |

### `documents-attachment.service.ts`

| Method | HTTP | Endpoint | Notes |
| --- | --- | --- | --- |
| `create` | POST | `${environment.apis.default.url}/api/app/documents-attachment` | Body: `DocumentsAttachmentDto`. |
| `delete` | DELETE | `${environment.apis.default.url}/api/app/documents-attachment/{id}` | — |
| `get` | GET | `${environment.apis.default.url}/api/app/documents-attachment/{id}` | — |
| `getAttachmentInfoByEntityTypeAndEntityIdAndAttachmentType` | GET | `${environment.apis.default.url}/api/app/documents-attachment/attachment-info/{entityId}` | Query params: `entityType`, `attachmentType`, optional `relatedEntityid`. |
| `getDocumentInfoByEntityTypeAndEntityIdAndAttachmentType` | GET | `${environment.apis.default.url}/api/app/documents-attachment/document-info/{entityId}` | Query params: `entityType`, `attachmentType`. |
| `getList` | GET | `${environment.apis.default.url}/api/app/documents-attachment` | Query params: `sorting`, `skipCount`, `maxResultCount`. |
| `update` | PUT | `${environment.apis.default.url}/api/app/documents-attachment/{id}` | Body: `DocumentsAttachmentDto`. |

### `notification.service.ts`

| Method | HTTP | Endpoint | Notes |
| --- | --- | --- | --- |
| `getListByUserId` | GET | `${environment.apis.default.url}/api/app/notification/by-user-id/{userId}` | Query param: `role`. |

### `patient-profile.service.ts`

| Method | HTTP | Endpoint | Notes |
| --- | --- | --- | --- |
| `create` | POST | `${environment.apis.default.url}/api/app/patient-profile` | Body: `PatientProfileInputDto`. |
| `get` | GET | `${environment.apis.default.url}/api/app/patient-profile/{id}` | — |
| `getByPhoneAndCode` | GET | `${environment.apis.default.url}/api/app/patient-profile/by-phone-and-code` | Query params: `pCode`, `pPhone`. |
| `getByUserId` | GET | `${environment.apis.default.url}/api/app/patient-profile/by-user-id/{userId}` | — |
| `getByUserName` | GET | `${environment.apis.default.url}/api/app/patient-profile/by-user-name` | Query param: `userName`. |
| `getDoctorListByCreatorIdFilter` | GET | `${environment.apis.default.url}/api/app/patient-profile/doctor-list-by-creator-id-filter/{profileId}` | Filter params. |
| `getDoctorListFilter` | GET | `${environment.apis.default.url}/api/app/patient-profile/doctor-list-filter` | Filter params. |
| `getList` | GET | `${environment.apis.default.url}/api/app/patient-profile` | — |
| `getListPatientListByAdmin` | GET | `${environment.apis.default.url}/api/app/patient-profile/patient-list-by-admin` | — |
| `getListPatientListByAgentMaster` | GET | `${environment.apis.default.url}/api/app/patient-profile/patient-list-by-agent-master/{masterId}` | — |
| `getListPatientListByAgentSuperVisor` | GET | `${environment.apis.default.url}/api/app/patient-profile/patient-list-by-agent-super-visor/{supervisorId}` | — |
| `getPatientListBySearchUserProfileId` | GET | `${environment.apis.default.url}/api/app/patient-profile/patient-list-by-search-user-profile-id/{profileId}` | Query params: `role`, `name`. |
| `getPatientListByUserProfileId` | GET | `${environment.apis.default.url}/api/app/patient-profile/patient-list-by-user-profile-id/{profileId}` | Query param: `role`. |
| `getPatientListFilterByAdmin` | GET | `${environment.apis.default.url}/api/app/patient-profile/patient-list-filter-by-admin/{userId}` | Filter params plus `role`. |
| `update` | PUT | `${environment.apis.default.url}/api/app/patient-profile` | Body: `PatientProfileInputDto`. |

### `prescription-master.service.ts`

| Method | HTTP | Endpoint | Notes |
| --- | --- | --- | --- |
| `create` | POST | `${environment.apis.default.url}/api/app/prescription-master` | Body: `PrescriptionMasterInputDto`. |
| `get` | GET | `${environment.apis.default.url}/api/app/prescription-master/{id}` | — |
| `getList` | GET | `${environment.apis.default.url}/api/app/prescription-master` | — |
| `getPatientDiseaseList` | GET | `${environment.apis.default.url}/api/app/prescription-master/patient-disease-list/{patientId}` | — |
| `getPrescription` | GET | `${prescriptionApi}/api/app/prescription-master/{id}/prescription` | — |
| `getPrescriptionByAppointmentId` | GET | `${prescriptionApi}/api/app/prescription-master/prescription-by-appointment-id/{appointmentId}` | — |
| `getPrescriptionCount` | GET | `${environment.apis.default.url}/api/app/prescription-master/prescription-count` | — |
| `getPrescriptionListByAppointmentCreatorId` | GET | `${environment.apis.default.url}/api/app/prescription-master/prescription-list-by-appointment-creator-id/{patientId}` | — |
| `getPrescriptionMasterListByDoctorId` | GET | `${environment.apis.default.url}/api/app/prescription-master/prescription-master-list-by-doctor-id/{doctorId}` | — |
| `getPrescriptionMasterListByDoctorIdPatientId` | GET | `${environment.apis.default.url}/api/app/prescription-master/prescription-master-list-by-doctor-id-patient-id` | Query params: `doctorId`, `patientId`. |
| `getPrescriptionMasterListByPatientId` | GET | `${environment.apis.default.url}/api/app/prescription-master/prescription-master-list-by-patient-id/{patientId}` | — |
| `update` | PUT | `${environment.apis.default.url}/api/app/prescription-master` | Body: `PrescriptionMasterInputDto`. |

### `speciality.service.ts`

| Method | HTTP | Endpoint | Notes |
| --- | --- | --- | --- |
| `create` | POST | `${environment.apis.default.url}/api/app/speciality` | Body: `SpecialityInputDto`. |
| `get` | GET | `${environment.apis.default.url}/api/app/speciality/{id}` | — |
| `getList` | GET | `${environment.apis.default.url}/api/app/speciality` | — |
| `update` | PUT | `${environment.apis.default.url}/api/app/speciality` | Body: `SpecialityInputDto`. |

### `specialization.service.ts`

| Method | HTTP | Endpoint | Notes |
| --- | --- | --- | --- |
| `create` | POST | `${environment.apis.default.url}/api/app/specialization` | Body: `SpecializationInputDto`. |
| `get` | GET | `${environment.apis.default.url}/api/app/specialization/{id}` | — |
| `getBySpecialityId` | GET | `${environment.apis.default.url}/api/app/specialization/by-speciality-id/{specialityId}` | — |
| `getList` | GET | `${environment.apis.default.url}/api/app/specialization` | — |
| `getListBySpecialtyId` | GET | `${environment.apis.default.url}/api/app/specialization/by-specialty-id/{specialityId}` | — |
| `getListFiltering` | GET | `${environment.apis.default.url}/api/app/specialization/filtering` | — |
| `update` | PUT | `${environment.apis.default.url}/api/app/specialization` | Body: `SpecializationInputDto`. |

### `user-accounts.service.ts`

| Method | HTTP | Endpoint | Notes |
| --- | --- | --- | --- |
| `decodeJwt` | POST | `${environment.apis.default.url}/api/app/user-accounts/decode-jwt` | Body: `JAccessToken`. |
| `isUserExists` | POST | `${environment.apis.default.url}/api/app/user-accounts/is-user-exists` | Query param: `userName`. Null body. |
| `login` | POST | `${environment.apis.default.url}/api/app/user-accounts/login` | Body: `LoginDto`. |
| `refreshAccessToken` | POST | `${environment.apis.default.url}/api/app/user-accounts/refresh-access-token` | Body: `IdentityUser`. |
| `resetPassword` | POST | `${environment.apis.default.url}/api/app/user-accounts/reset-password` | Body: `ResetPasswordInputDto`. |
| `resetPasswordApp` | POST | `${environment.apis.default.url}/api/app/user-accounts/reset-password_App` | Body: `ResetPasswordInputDto`. |
| `signupUser` | POST | `${environment.apis.default.url}/api/app/user-accounts/signup-user` | Query params: `password`, `role`; body: `UserInfoDto`. |
| `userDataRemove` | POST | `${environment.apis.default.url}/api/app/user-accounts/user-data-remove` | Query param: `role`; body: `DeleteUserDataDto`. |

### `user-manage-accounts.service.ts`

| Method | HTTP | Endpoint | Notes |
| --- | --- | --- | --- |
| `checkUserExistByUserName` | POST | `${environment.apis.default.url}/api/app/user-manage-accounts/check-user-exist-by-user-name` | Query param: `mobileNo`. Null body. |
| `getUserRoles` | GET | `${environment.apis.default.url}/api/app/user-manage-accounts/user-roles/{userId}` | — |
| `resetPassword` | POST | `${environment.apis.default.url}/api/app/user-manage-accounts/reset-password` | Body: `ResetPasswordInputDto`. |
| `saveOtpForVerifyUserLater` | POST | `${environment.apis.default.url}/api/app/user-manage-accounts/save-otp-for-verify-user-later` | Body: `SaveSendOtpModel`. |
| `sendOtp` | POST | `${environment.apis.default.url}/api/app/user-manage-accounts/send-otp` | Body: `SendOtpModel`. |
| `signupUser` | POST | `${environment.apis.default.url}/api/app/user-manage-accounts/signup-user` | Body: `UserSingupRequestDto`. |
| `userPasswordChangesScript` | POST | `${environment.apis.default.url}/api/app/user-manage-accounts/user-password-changes-script` | Body: `ResetPasswordRoleWiseInputDto`. |
| `verifyOtp` | POST | `${environment.apis.default.url}/api/app/user-manage-accounts/verify-otp` | Body: `OtpRequestDto`. |

## Feature Module Services

### Admin – `src/app/features-modules/admin/services/admin.prescription.service.ts`

| Method | HTTP | Endpoint (relative to `prescriptionApi`) | Notes |
| --- | --- | --- | --- |
| `getPrescriptionAnalytics` | GET | `/api/2025-02/get-prescription-analytics` | — |
| `getMostUsedMedications` | GET | `/api/2025-02/gets-most-used-medication` | Query params: `pageNumber`, `pageSize`. |
| `getMedicationDivisionUsage` | GET | `/api/2025-02/get-medication-division-usage` | Query param: `medicationId`. |
| `getPatientAgeDistribution` | GET | `/api/2025-02/get-age-distribution` | — |

### Doctor – Prescription Module Services (`src/app/features-modules/doctor/prescribe/services`)

| Service | Method | HTTP | Endpoint (relative to `prescriptionApi`) | Notes |
| --- | --- | --- | --- | --- |
| `advice.service.ts` | `getAllAdvice` | GET | `/api/2025-02/gets-all-advice` | — |
|  | `getBookmarkedAdvice` | GET | `/api/2025-02/gets-bookmarks-advice` | Query param: `doctorId`. |
|  | `searchAdvice` | GET | `/api/2025-02/gets-advice-by-name` | Query param: `adviceName`. |
|  | `createAdvice` | POST | `/api/2025-02/create-advice` | Body contains `advice`, `type`, `tenantId`. |
| `chief-complaints.service.ts` | `getAllChiefComplaints` | GET | `/api/2025-02/gets-all-chief-complaint` | — |
|  | `getBookmarkedChiefComplaints` | GET | `/api/2025-02/gets-bookmarks-chief-complaints` | Query param: `doctorId`. |
|  | `searchChiefComplaints` | GET | `/api/2025-02/gets-chief-complaint-by-name` | Query param: `SymtomName`. |
|  | `createChiefComplaints` | POST | `/api/2025-02/create-chief-complaint` | Body with `symptomName`, `description`, `tenantId`. |
| `diagnosis.service.ts` | `getAllDiagnoses` | GET | `/api/2025-02/gets-all-diagnosis` | — |
|  | `getBookmarkedDiagnoses` | GET | `/api/2025-02/gets-bookmarks-diagnosis` | Query param: `doctorId`. |
|  | `searchDiagnosis` | GET | `/api/2025-02/gets-diagnosis-by-name` | Query param: `diagnosisName`. |
|  | `createDiagnosis` | POST | `/api/2025-02/create-diagnosis` | Body with `name`, `description`, `code`. |
| `followup.service.ts` | `getFollowUpByName` | GET | `/api/2025-02/gets-all-followup-by-name` | Query param: `followUpName`. |
|  | `createFollowUp` | POST | `/api/2025-02/create-followup` | Body with `tenantId`, `name`, `description`. |
|  | `getBookmarkedFollowup` | GET | `/api/2025-02/gets-bookmarks-followup` | — |
| `history.service.ts` | `getAllHistory` | GET | `/api/2025-02/gets-all-common-history` | — |
|  | `getBookmarkedHistory` | GET | `/api/2025-02/gets-bookmarks-common-histories` | Query param: `doctorId`. |
|  | `searchHistoryName` | GET | `/api/2025-02/gets-all-common-history-by-name` | Query param: `CommonHistoryName`. |
|  | `createHistory` | POST | `/api/2025-02/create-common-history` | Body with `name`, `description`, `tenantId`. |
| `investigation.service.ts` | `getAllInvestigations` | GET | `/api/2025-02/gets-all-investigation` | — |
|  | `getInvestigationByName` | GET | `/api/2025-02/gets-all-investigation-by-name` | Query param: `investigationName`. |
|  | `createInvestigation` | POST | `/api/2025-02/create-investigation` | Body with `name`, `description`, `code`. |
| `medicine.service.ts` | `getAllMedicines` | GET | `/api/2025-02/gets-all-medication` | — |
|  | `getBookmarkedMedicines` | GET | `/api/2025-02/gets-bookmarks-medication` | Query param: `doctorId`. |
|  | `searchMedicine` | GET | `/api/2025-02/get-medication-by-name` | Query param: `medicationName`. |
|  | `createMedicine` | POST | `/api/2025-02/create-medication` | Body includes medication metadata. |
| `patient-service.ts` | `getPrescriptionPatients` | GET | `/api/2025-02/gets-all-patients` | Query params: `pageNumber`, `pageSize`, optional `searchTerm`. |
| `prescription.service.ts` | `submitPrescription` | POST | `/api/2025-02/create-prescription` | Body: form payload. |
|  | `saveAsTemplate` | POST | `/api/2025-02/create-prescription` | Body: form payload with template flags. |
|  | `getPrescriptionTemplate` | GET | `/api/2025-02/get-template-prescription-by-id` | Query param: `templateId`. |
|  | `getPrescriptionTemplates` | GET | `/api/2025-02/gets-all-prescription-template-by-doctor-id` | Query param: `DoctorId`. |
| `upload-image.service.ts` | `uploadPrescriptionImage` | POST | `/api/2025-02/prescription-upload` | Body: `FormData`. |

## Doctor Profile Settings Components

### `src/app/features-modules/doctor/profile-settings/documents/documents.component.ts`

| Method | HTTP | Endpoint (relative to `environment.apis.default.url`) | Notes |
| --- | --- | --- | --- |
| `uploadNID` | POST | `/api/Common/Documents` | Body: `FormData` with identity document files. |
| `uploadSign` | POST | `/api/Common/Documents` | Body: `FormData` with signature files. |

### `src/app/features-modules/doctor/profile-settings/specialization-dialog/specialization-dialog.component.ts`

| Method | HTTP | Endpoint (relative to `environment.apis.default.url`) | Notes |
| --- | --- | --- | --- |
| `onSubmit` (file upload branch) | POST | `/api/Common/Documents` | Body: `FormData` for specialization documents. |
| `uploadDocuments` | POST | `/api/Common/Documents` | Body: `FormData` for specialization documents. |

