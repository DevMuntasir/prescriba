import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

type Nullable<T> = T | null;

interface Complaint {
  id?: number;
  name: string;
  duration?: string;
  notes?: string;
  days?: number;
}

interface HistoryItem {
  id?: number;
  name: string;
  pastHistory?: string;
  presentHistory?: string;
}

interface OnExamItem {
  systolic?: string;
  diastolic?: string;
  pulse?: string;
  temperature?: string;
  weight?: string;
  heightFeet?: string;
  heightInches?: string;
}

interface DiagnosisItem {
  id?: number;
  name: string;
  pastDiagnosis?: string;
  presentDiagnosis?: string;
}

interface TestItem {
  id?: number;
  name: string;
  notes?: string;
  duration?: string;
}

interface AdviceItem {
  id?: number;
  name: string;
  notes?: string;
}

interface MedicationItem {
  id?: number;
  name: string;
  timming?: string;
  mealTime?: string;
  duration?: string;
  notes?: string;
}

interface DoctorInfo {
  doctorName?: string;
  doctorProfileId?: Nullable<number>;
  doctorCode?: Nullable<string>;
  degree?: Array<{
    degreeName?: string;
    instituteName?: string;
    instituteCity?: string;
    instituteCountry?: string;
  }>;
  qualification?: Nullable<string>;
  areaOfExperties?: Nullable<string>;
  bmdc?: Nullable<string>;
  chamber?: Array<{
    chamberName?: string;
    address?: string;
    city?: string;
    zipCode?: string;
  }>;
  schedule?: Array<{
    start: string;
    end: string;
    startTime: string;
    endTime: string;
  }>;
  signature?: Nullable<string>;
}

interface PatientInfo {
  patientName: string;
  patientAge: string;
  patientBloodGroup: string;
  patientProfileId: number;
  patientCode: string;
  patientPhoneNo: string;
}

interface PrescribeState {
  isPreHand: boolean;
  isHeader: boolean;
  appointmentId: Nullable<number>;
  appointmentCode: Nullable<string>;
  doctor: DoctorInfo;
  patient: PatientInfo;
  chiefComplaints: Complaint[];
  history: HistoryItem[];
  examination: OnExamItem[];
  diagnosis: DiagnosisItem[];
  medications: MedicationItem[];
  test: TestItem[];
  advice: AdviceItem[];
  followUp: string;
  uploadImage: string;
}

const initialPatient: PatientInfo = {
  patientName: '',
  patientAge: '',
  patientBloodGroup: '',
  patientProfileId: 0,
  patientCode: '',
  patientPhoneNo: '',
};

const initialDoctor: DoctorInfo = {
  doctorName: '',
  doctorProfileId: null,
  doctorCode: null,
  degree: [],
  qualification: null,
  areaOfExperties: null,
  bmdc: null,
  chamber: [],
  schedule: [],
  signature: null,
};

const initialState: PrescribeState = {
  isPreHand: false,
  isHeader: true,
  appointmentId: null,
  appointmentCode: null,
  doctor: initialDoctor,
  patient: initialPatient,
  chiefComplaints: [],
  history: [],
  examination: [],
  diagnosis: [],
  medications: [],
  test: [],
  advice: [],
  followUp: '',
  uploadImage: '',
};

type PrescribeAction =
  | { type: 'RESET'; payload?: Partial<PrescribeState> }
  | { type: 'PATCH_STATE'; payload: Partial<PrescribeState> }
  | { type: 'SET_PATIENT'; payload: Partial<PatientInfo> }
  | { type: 'SET_DOCTOR'; payload: Partial<DoctorInfo> }
  | { type: 'SET_CHIEF_COMPLAINTS'; payload: Complaint[] }
  | { type: 'SET_HISTORY'; payload: HistoryItem[] }
  | { type: 'SET_EXAMINATION'; payload: OnExamItem[] }
  | { type: 'SET_DIAGNOSIS'; payload: DiagnosisItem[] }
  | { type: 'SET_MEDICATIONS'; payload: MedicationItem[] }
  | { type: 'SET_TESTS'; payload: TestItem[] }
  | { type: 'SET_ADVICE'; payload: AdviceItem[] }
  | { type: 'SET_FOLLOW_UP'; payload: string }
  | { type: 'SET_UPLOAD_IMAGE'; payload: string };

function prescribeReducer(state: PrescribeState, action: PrescribeAction): PrescribeState {
  switch (action.type) {
    case 'RESET':
      return {
        ...initialState,
        ...action.payload,
      };
    case 'PATCH_STATE':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_PATIENT':
      return {
        ...state,
        patient: {
          ...state.patient,
          ...action.payload,
        },
      };
    case 'SET_DOCTOR':
      return {
        ...state,
        doctor: {
          ...state.doctor,
          ...action.payload,
        },
      };
    case 'SET_CHIEF_COMPLAINTS':
      return { ...state, chiefComplaints: action.payload };
    case 'SET_HISTORY':
      return { ...state, history: action.payload };
    case 'SET_EXAMINATION':
      return { ...state, examination: action.payload };
    case 'SET_DIAGNOSIS':
      return { ...state, diagnosis: action.payload };
    case 'SET_MEDICATIONS':
      return { ...state, medications: action.payload };
    case 'SET_TESTS':
      return { ...state, test: action.payload };
    case 'SET_ADVICE':
      return { ...state, advice: action.payload };
    case 'SET_FOLLOW_UP':
      return { ...state, followUp: action.payload };
    case 'SET_UPLOAD_IMAGE':
      return { ...state, uploadImage: action.payload };
    default:
      return state;
  }
}

interface AppointmentInfo {
  id?: number;
  doctorProfileId?: number;
  patientProfileId?: number;
  doctorScheduleId?: number;
  doctorChamberId?: number;
  appointmentCode?: string;
  patientName?: string;
  patientAge?: number;
  patientCode?: string;
  patientMobileNo?: string;
  bloodGroup?: string;
}

interface ApiConfig {
  defaultApiBaseUrl: string;
  prescriptionApiBaseUrl: string;
  authToken?: string;
}

interface PrescribeProps {
  appointmentId?: number;
  doctorProfileId?: number;
  isPreHand?: boolean;
  apiConfig: ApiConfig;
  onSubmitSuccess?: (response: any) => void;
  onSubmitError?: (error: unknown) => void;
  onOpenUploadImage?: () => void;
  onShowTemplates?: () => void;
  onShowPreviousDocuments?: (patientId?: number, appointmentId?: number, documents?: string[]) => void;
  className?: string;
}

interface UploadImageState {
  isUploadImage: boolean;
  image: string;
}

interface ModalState {
  type: null |
    'complaint' |
    'history' |
    'examination' |
    'diagnosis' |
    'test' |
    'medicine' |
    'advice' |
    'followUp' |
    'select-chamber';
}

const dateFormatter = new Intl.DateTimeFormat('en-GB');

function formatDateForInput(value: string): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toISOString().split('T')[0];
}

function formatDateToDisplay(value: string): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return dateFormatter.format(date);
}

async function httpGet<T>(url: string, token?: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: Bearer  } : {}),
    },
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(GET  failed with status );
  }
  return (await response.json()) as T;
}

async function httpPost<T>(url: string, body: unknown, token?: string): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: Bearer  } : {}),
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || POST  failed with status );
  }
  return (await response.json()) as T;
}

function convertTo24(time: string): string {
  if (!time) {
    return '';
  }
  const [t, modifier] = time.split(' ');
  if (!t) {
    return '';
  }
  let [hours, minutes] = t.split(':').map((value) => parseInt(value, 10));
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return '';
  }
  if (modifier === 'PM' && hours < 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }
  return ${hours.toString().padStart(2, '0')}:;
}

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function isConsecutiveDays(prevDay: string, currentDay: string): boolean {
  const prevIndex = daysOfWeek.indexOf(prevDay);
  const currentIndex = daysOfWeek.indexOf(currentDay);
  if (prevIndex === -1 || currentIndex === -1) {
    return false;
  }
  return currentIndex === (prevIndex + 1) % 7;
}

type ScheduleSession = {
  scheduleDayofWeek?: string;
  startTime?: string;
  endTime?: string;
};

type DoctorScheduleResponse = {
  doctorScheduleDaySession?: ScheduleSession[];
};

function buildOptimisedSchedule(schedule?: DoctorScheduleResponse): Array<{
  start: string;
  end: string;
  startTime: string;
  endTime: string;
}> {
  const sessions =
    schedule?.doctorScheduleDaySession?.filter((day) =>
      day.scheduleDayofWeek && day.startTime
    ) ?? [];

  const normalised = sessions.map((session) => ({
    day: session.scheduleDayofWeek as string,
    startTime: session.startTime as string,
    endTime: session.endTime || session.startTime || '',
  }));

  const groupedByDay: Record<string, { startTime: string; endTime: string }[]> = {};
  normalised.forEach(({ day, startTime, endTime }) => {
    if (!groupedByDay[day]) {
      groupedByDay[day] = [];
    }
    if (
      !groupedByDay[day].some(
        (item) => item.startTime === startTime && item.endTime === endTime
      )
    ) {
      groupedByDay[day].push({ startTime, endTime });
    }
  });

  const groupedSchedule = Object.entries(groupedByDay).map(([day, times]) => {
    const sortedTimes = times.sort((a, b) => {
      const t1 = new Date(1970-01-01T);
      const t2 = new Date(1970-01-01T);
      return t1.getTime() - t2.getTime();
    });

    return {
      day,
      startTime: sortedTimes[0].startTime,
      endTime: sortedTimes[sortedTimes.length - 1].endTime,
    };
  });

  if (groupedSchedule.length === 0) {
    return [];
  }

  const optimised: Array<{
    start: string;
    end: string;
    startTime: string;
    endTime: string;
  }> = [];
  let currentRange = {
    start: groupedSchedule[0].day,
    end: groupedSchedule[0].day,
    startTime: groupedSchedule[0].startTime,
    endTime: groupedSchedule[0].endTime,
  };

  for (let i = 1; i < groupedSchedule.length; i += 1) {
    const current = groupedSchedule[i];
    const isSequential = isConsecutiveDays(currentRange.end, current.day);
    const isSameTime =
      current.startTime === currentRange.startTime &&
      current.endTime === currentRange.endTime;

    if (isSequential && isSameTime) {
      currentRange.end = current.day;
    } else {
      optimised.push({ ...currentRange });
      currentRange = {
        start: current.day,
        end: current.day,
        startTime: current.startTime,
        endTime: current.endTime,
      };
    }
  }

  optimised.push({ ...currentRange });

  return optimised;
}

async function fetchAppointment(
  baseUrl: string,
  appointmentId: number,
  token?: string
): Promise<AppointmentInfo> {
  return httpGet<AppointmentInfo>(${baseUrl}/api/app/appointment/, token);
}

async function fetchDoctorProfile(
  baseUrl: string,
  doctorProfileId: number,
  token?: string
): Promise<any> {
  return httpGet(${baseUrl}/api/app/doctor-profile//doctor-by-profile-id, token);
}

async function fetchDoctorChamber(
  baseUrl: string,
  chamberId: number,
  token?: string
): Promise<any> {
  return httpGet(${baseUrl}/api/app/doctor-chamber/, token);
}

async function fetchDoctorSchedule(
  baseUrl: string,
  scheduleId: number,
  token?: string
): Promise<DoctorScheduleResponse> {
  return httpGet(${baseUrl}/api/app/doctor-schedule/, token);
}

async function fetchDoctorSignature(
  baseUrl: string,
  doctorProfileId: number,
  token?: string
): Promise<string | null> {
  const response = await httpGet<any[]>(
    ${baseUrl}/api/app/documents-attachment/attachment-info/?entityType=Doctor&attachmentType=DoctorSign,
    token
  );
  if (!Array.isArray(response) || response.length === 0) {
    return null;
  }
  const first = response[0];
  if (!first?.path) {
    return null;
  }
  return first.path as string;
}

async function fetchPatientDocuments(
  baseUrl: string,
  patientProfileId: number,
  appointmentId?: number,
  token?: string
): Promise<string[]> {
  const params = new URLSearchParams({
    entityType: 'Patient',
    attachmentType: 'PatientPreviousDocuments',
  });
  if (appointmentId) {
    params.append('relatedEntityid', String(appointmentId));
  }
  const response = await httpGet<any[]>(
    ${baseUrl}/api/app/documents-attachment/attachment-info/?,
    token
  );
  if (!Array.isArray(response)) {
    return [];
  }
  return response
    .map((item) => (typeof item?.path === 'string' ? (item.path as string) : ''))
    .filter(Boolean);
}

async function fetchDoctorChambersByDoctorId(
  baseUrl: string,
  doctorProfileId: number,
  token?: string
): Promise<any[]> {
  return httpGet(
    ${baseUrl}/api/app/doctor-chamber/doctor-chamber-list-by-doctor-id/,
    token
  );
}

function composeAssetUrl(baseUrl: string, path?: string): string {
  if (!path) {
    return '';
  }
  const cleaned = path.replace(/wwwroot/gi, '').replace(/^[\\/]+/, '');
  const normalisedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const sanitised = cleaned.replace(/^[\\/]+/, '');
  return `${normalisedBase}/${sanitised}`;
}

  return `${normalisedBase}/${sanitised}`;
}

const DEFAULT_MODAL_LABEL: Record<NonNullable<ModalState['type']>, string> = {
  complaint: 'Chief Complaints',
  history: 'History',
  examination: 'Examination',
  diagnosis: 'Diagnosis',
  test: 'Investigation',
  medicine: 'Medication',
  advice: 'Advice',
  followUp: 'Follow-up',
  'select-chamber': 'Select Chamber',
};

const Prescribe: React.FC<PrescribeProps> = ({
  appointmentId,
  doctorProfileId,
  isPreHand = false,
  apiConfig,
  onSubmitSuccess,
  onSubmitError,
  onOpenUploadImage,
  onShowTemplates,
  onShowPreviousDocuments,
  className,
}) => {
  const [state, dispatch] = useReducer(prescribeReducer, {
    ...initialState,
    isPreHand,
    appointmentId: appointmentId ?? null,
  });
  const [appointmentInfo, setAppointmentInfo] = useState<AppointmentInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [followUpDate, setFollowUpDate] = useState<string>('');
  const [uploadImageState, setUploadImageState] = useState<UploadImageState>({
    isUploadImage: false,
    image: '',
  });
  const [modalState, setModalState] = useState<ModalState>({ type: null });
  const [modalDraft, setModalDraft] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const fullScreenRef = useRef<HTMLDivElement | null>(null);

  const picBaseUrl = useMemo(() => ${apiConfig.defaultApiBaseUrl}/, [apiConfig.defaultApiBaseUrl]);

  useEffect(() => {
    setUploadImageState({
      isUploadImage: Boolean(state.uploadImage),
      image: state.uploadImage,
    });
  }, [state.uploadImage]);

  useEffect(() => {
    if (!state.followUp) {
      setFollowUpDate('');
    } else {
      setFollowUpDate(state.followUp);
    }
  }, [state.followUp]);

  const handleError = useCallback(
    (error: unknown) => {
      console.error('Prescribe component error:', error);
      onSubmitError?.(error);
    },
    [onSubmitError]
  );

  const loadAppointmentContext = useCallback(
    async (aptId: number, fallbackDoctorId?: number) => {
      setIsLoading(true);
      try {
        const appointment = await fetchAppointment(
          apiConfig.defaultApiBaseUrl,
          aptId,
          apiConfig.authToken
        );
        setAppointmentInfo(appointment);
        dispatch({
          type: 'PATCH_STATE',
          payload: {
            appointmentId: appointment.id ?? aptId,
            appointmentCode: appointment.appointmentCode ?? null,
          },
        });

        const resolvedDoctorId = appointment.doctorProfileId ?? fallbackDoctorId;
        if (resolvedDoctorId) {
          const [doctorDetails, signature, chamber, schedule] = await Promise.all([
            fetchDoctorProfile(apiConfig.defaultApiBaseUrl, resolvedDoctorId, apiConfig.authToken),
            fetchDoctorSignature(apiConfig.defaultApiBaseUrl, resolvedDoctorId, apiConfig.authToken),
            appointment.doctorChamberId
              ? fetchDoctorChamber(apiConfig.defaultApiBaseUrl, appointment.doctorChamberId, apiConfig.authToken).then((result) => [result])
              : Promise.resolve([]),
            appointment.doctorScheduleId
              ? fetchDoctorSchedule(apiConfig.defaultApiBaseUrl, appointment.doctorScheduleId, apiConfig.authToken)
              : Promise.resolve(undefined),
          ]);

          const optimisedSchedule = buildOptimisedSchedule(schedule);
          dispatch({
            type: 'SET_DOCTOR',
            payload: {
              doctorName: ${doctorDetails.doctorTitleName ?? ''} .trim(),
              doctorCode: doctorDetails.doctorCode ?? null,
              doctorProfileId: resolvedDoctorId,
              degree:
                doctorDetails?.degrees?.map((degree: any) => ({
                  degreeName: degree.degreeName,
                  instituteName: degree.instituteName,
                  instituteCity: degree.instituteCity,
                  instituteCountry: degree.instituteCountry,
                })) ?? [],
              qualification: doctorDetails.qualifications ?? null,
              areaOfExperties: doctorDetails.areaOfExperties ?? null,
              bmdc: doctorDetails.bmdcRegNo ?? null,
              chamber,
              schedule: optimisedSchedule,
              signature: signature ? composeAssetUrl(picBaseUrl, signature) : null,
            },
          });
        }

        if (appointment.patientName) {
          dispatch({
            type: 'SET_PATIENT',
            payload: {
              patientName: appointment.patientName ?? '',
              patientAge: appointment.patientAge ? String(appointment.patientAge) : '',
              patientProfileId: appointment.patientProfileId ?? 0,
              patientCode: appointment.patientCode ?? '',
              patientPhoneNo: appointment.patientMobileNo ?? '',
              patientBloodGroup: appointment.bloodGroup ?? '',
            },
          });
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [apiConfig.authToken, apiConfig.defaultApiBaseUrl, handleError, picBaseUrl]
  );

  const loadPrehandContext = useCallback(
    async (resolvedDoctorId?: number) => {
      if (!resolvedDoctorId) {
        return;
      }
      setIsLoading(true);
      try {
        const [doctorDetails, signature, chambers] = await Promise.all([
          fetchDoctorProfile(apiConfig.defaultApiBaseUrl, resolvedDoctorId, apiConfig.authToken),
          fetchDoctorSignature(apiConfig.defaultApiBaseUrl, resolvedDoctorId, apiConfig.authToken),
          fetchDoctorChambersByDoctorId(apiConfig.defaultApiBaseUrl, resolvedDoctorId, apiConfig.authToken),
        ]);
        dispatch({
          type: 'SET_DOCTOR',
          payload: {
            doctorName: ${doctorDetails.doctorTitleName ?? ''} .trim(),
            doctorCode: doctorDetails.doctorCode ?? null,
            doctorProfileId: resolvedDoctorId,
            degree:
              doctorDetails?.degrees?.map((degree: any) => ({
                degreeName: degree.degreeName,
                instituteName: degree.instituteName,
                instituteCity: degree.instituteCity,
                instituteCountry: degree.instituteCountry,
              })) ?? [],
            qualification: doctorDetails.qualifications ?? null,
            areaOfExperties: doctorDetails.areaOfExperties ?? null,
            bmdc: doctorDetails.bmdcRegNo ?? null,
            chamber: chambers ?? [],
            schedule: [],
            signature: signature ? composeAssetUrl(picBaseUrl, signature) : null,
          },
        });
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [apiConfig.authToken, apiConfig.defaultApiBaseUrl, handleError, picBaseUrl]
  );

  useEffect(() => {
    if (appointmentId) {
      loadAppointmentContext(appointmentId, doctorProfileId);
    } else if (isPreHand && doctorProfileId) {
      loadPrehandContext(doctorProfileId);
    }
  }, [appointmentId, doctorProfileId, isPreHand, loadAppointmentContext, loadPrehandContext]);

  const handleEnterFullScreen = useCallback(() => {
    setIsFullScreen(true);
    const element = fullScreenRef.current;
    if (!element) {
      return;
    }
    const requestFullscreen =
      element.requestFullscreen?.bind(element) ||
      (element as any).webkitRequestFullscreen?.bind(element) ||
      (element as any).mozRequestFullScreen?.bind(element) ||
      (element as any).msRequestFullscreen?.bind(element);
    requestFullscreen?.();
  }, []);

  const handleFollowUpChange = useCallback(
    (value: string) => {
      setFollowUpDate(value);
      dispatch({ type: 'SET_FOLLOW_UP', payload: value ? new Date(value).toISOString() : '' });
    },
    []
  );

  const openModal = useCallback((type: NonNullable<ModalState['type']>, payload: any[]) => {
    setModalDraft(payload);
    setModalState({ type });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null });
    setModalDraft([]);
  }, []);

  const handleModalSave = useCallback(
    (items: any[]) => {
      if (!modalState.type) {
        return;
      }
      switch (modalState.type) {
        case 'complaint':
          dispatch({ type: 'SET_CHIEF_COMPLAINTS', payload: items as Complaint[] });
          break;
        case 'history':
          dispatch({ type: 'SET_HISTORY', payload: items as HistoryItem[] });
          break;
        case 'examination':
          dispatch({ type: 'SET_EXAMINATION', payload: items as OnExamItem[] });
          break;
        case 'diagnosis':
          dispatch({ type: 'SET_DIAGNOSIS', payload: items as DiagnosisItem[] });
          break;
        case 'test':
          dispatch({ type: 'SET_TESTS', payload: items as TestItem[] });
          break;
        case 'medicine':
          dispatch({ type: 'SET_MEDICATIONS', payload: items as MedicationItem[] });
          break;
        case 'advice':
          dispatch({ type: 'SET_ADVICE', payload: items as AdviceItem[] });
          break;
        case 'followUp':
          dispatch({ type: 'SET_FOLLOW_UP', payload: items[0] ?? '' });
          break;
        default:
          break;
      }
      closeModal();
    },
    [closeModal, modalState.type]
  );

  const handlePatientFieldChange = useCallback(
    (field: keyof PatientInfo, value: string) => {
      dispatch({ type: 'SET_PATIENT', payload: { [field]: value } as Partial<PatientInfo> });
    },
    []
  );

  const handleToggleHeader = useCallback(
    (value: boolean) => {
      dispatch({ type: 'PATCH_STATE', payload: { isHeader: value } });
    },
    []
  );

  const resolveSubmitPayload = useCallback(() => {
    return {
      ...state,
      followUp: state.followUp,
    };
  }, [state]);

  const handleSubmit = useCallback(async () => {
    setIsSaving(true);
    try {
      const payload = resolveSubmitPayload();
      const response = await httpPost(
        ${apiConfig.prescriptionApiBaseUrl}/api/2025-02/create-prescription,
        payload,
        apiConfig.authToken
      );
      onSubmitSuccess?.(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsSaving(false);
    }
  }, [apiConfig.authToken, apiConfig.prescriptionApiBaseUrl, handleError, onSubmitSuccess, resolveSubmitPayload]);

  const handleSaveAsTemplate = useCallback(async () => {
    try {
      const payload = resolveSubmitPayload();
      await httpPost(
        ${apiConfig.prescriptionApiBaseUrl}/api/2025-02/create-prescription,
        {
          ...payload,
          templateName: payload.appointmentCode ?? 'Template',
          isTemplate: true,
        },
        apiConfig.authToken
      );
      onSubmitSuccess?.({ message: 'Template saved successfully' });
    } catch (error) {
      handleError(error);
    }
  }, [apiConfig.authToken, apiConfig.prescriptionApiBaseUrl, handleError, onSubmitSuccess, resolveSubmitPayload]);

  const patientDocumentsHandler = useCallback(async () => {
    try {
      if (!state.patient.patientProfileId) {
        return;
      }
      const docs = await fetchPatientDocuments(
        apiConfig.defaultApiBaseUrl,
        state.patient.patientProfileId,
        state.appointmentId ?? undefined,
        apiConfig.authToken
      );
      onShowPreviousDocuments?.(state.patient.patientProfileId, state.appointmentId ?? undefined, docs);
      if (docs.length === 0) {
        console.info('No documents available for patient');
      }
    } catch (error) {
      handleError(error);
    }
  }, [apiConfig.authToken, apiConfig.defaultApiBaseUrl, handleError, onShowPreviousDocuments, state.appointmentId, state.patient.patientProfileId]);

  return (
    <div className={`px-4 ${className ?? ''}`}>
      <Topbar
        isPreHand={state.isPreHand}
        appointmentId={state.appointmentId ?? undefined}
        patientId={state.patient.patientProfileId}
        doctorId={state.doctor.doctorProfileId ?? undefined}
        onEnterFullScreen={handleEnterFullScreen}
        onClickSelectChamber={() =>
          openModal('select-chamber', state.doctor.chamber ?? [])
        }
        onToggleHeader={handleToggleHeader}
        isHeader={state.isHeader}
        onOpenUploadImage={onOpenUploadImage}
        onShowTemplates={onShowTemplates}
        onShowPreviousDocuments={patientDocumentsHandler}
      />
      <div>
        <div ref={fullScreenRef}>
          {isLoading ? (
            <PrescriptionSkeleton />
          ) : (
            <div
              className={w-full h-full mx-auto border-[1px] py-8 px-6 shadow-xl bg-white rounded-lg overflow-y-auto }
            >
              <div className="h-full">
                <div className="flex flex-wrap justify-between w-full">
                  <DoctorInfo doctor={state.doctor} isPreHand={state.isPreHand} isHeader={state.isHeader} />
                </div>
                <PatientInfoCard patient={state.patient} onChange={handlePatientFieldChange} />
                {uploadImageState.isUploadImage && uploadImageState.image ? (
                  <img
                    src={uploadImageState.image}
                    alt="Prescription upload"
                    width={500}
                    height={500}
                    className="mx-auto"
                  />
                ) : (
                  <div className="flex flex-wrap h-full">
                    <div className="w-full md:max-w-[400px]">
                      <Section
                        title="Chief Complaints"
                        items={state.chiefComplaints}
                        fields={['name', 'duration', 'notes']}
                        onEdit={() => openModal('complaint', state.chiefComplaints)}
                      />
                      <Section
                        title="History"
                        items={state.history}
                        fields={['name', 'pastHistory', 'presentHistory']}
                        onEdit={() => openModal('history', state.history)}
                      />
                      <Section
                        title="Examination"
                        items={state.examination}
                        fields={['systolic', 'diastolic', 'pulse', 'temperature', 'weight']}
                        onEdit={() => openModal('examination', state.examination)}
                        isExamination
                      />
                      <Section
                        title="Diagnosis"
                        items={state.diagnosis}
                        fields={['name', 'pastDiagnosis', 'presentDiagnosis']}
                        onEdit={() => openModal('diagnosis', state.diagnosis)}
                      />
                      <Section
                        title="Investigation"
                        items={state.test}
                        fields={['name', 'duration', 'notes']}
                        onEdit={() => openModal('test', state.test)}
                      />
                    </div>
                    <div className="w-[1px] min-h-full bg-gray-200" />
                    <div className="w-full justify-end flex-1 pl-8">
                      <div className="mb-6">
                        <div className="w-full flex justify-between items-center gap-1 font-poppins">
                          <img
                            className="w-[30px] h-[30px]"
                            src="/assets/other/rx.png"
                            alt="rx"
                          />
                          {state.medications.length > 0 && (
                            <button
                              type="button"
                              onClick={() => openModal('medicine', state.medications)}
                              className="flex text-secondary text-[14px] items-center gap-1 cursor-pointer"
                            >
                              Edit
                              <ModalIcon />
                            </button>
                          )}
                        </div>
                        <div className="space-y-3 mt-3">
                          <MedicationList
                            medications={state.medications}
                            onClick={() => openModal('medicine', state.medications)}
                          />
                        </div>
                      </div>
                      <div className="flex gap-4 mt-5">
                        <div className="mb-6 w-1/2">
                          <button
                            type="button"
                            className="flex items-center justify-between gap-1 font-poppins w-full"
                            onClick={() => openModal('advice', state.advice)}
                          >
                            Advice
                            {state.advice.length > 0 && (
                              <span className="flex text-[14px] text-secondary items-center gap-1 cursor-pointer">
                                Edit
                                <ModalIcon />
                              </span>
                            )}
                          </button>
                          <ul className="border-dotted rounded-xl border-2 border-gray-300 p-4 w-full min-h-[100px]">
                            {state.advice.length === 0 ? (
                              <li className="p-4 w-full flex justify-center text-gray-500 underline">
                                Add Advice
                              </li>
                            ) : (
                              state.advice.map((adviceItem, index) => (
                                <li key={${adviceItem.name}-} className="font-poppins text-[14px]">
                                  {index + 1}. {adviceItem.name}
                                  {adviceItem.notes ?  -  : ''}
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                        <div className="w-1/2">
                          <span className="flex items-center gap-1 font-poppins mb-2">Follow-up</span>
                          <div className="relative border-dotted rounded-xl border-2 border-gray-300 p-4 text-center w-full h-[100px] flex items-center justify-center">
                            <input
                              type="date"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              value={formatDateForInput(followUpDate)}
                              onChange={(event) => handleFollowUpChange(event.target.value)}
                            />
                            {followUpDate ? (
                              <span>{formatDateToDisplay(followUpDate)}</span>
                            ) : (
                              <span>Add Follow-up Date</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <BottomNav
                  isPreHand={state.isPreHand}
                  appointmentCode={state.appointmentCode ?? ''}
                  onSubmit={handleSubmit}
                  onSaveAsTemplate={handleSaveAsTemplate}
                  isSaving={isSaving}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {modalState.type && (
        <DynamicModal
          type={modalState.type}
          title={DEFAULT_MODAL_LABEL[modalState.type]}
          items={modalDraft}
          onClose={closeModal}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default Prescribe;

const ModalIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface TopbarProps {
  doctorId?: number;
  appointmentId?: number;
  patientId?: number;
  isPreHand: boolean;
  isHeader: boolean;
  onEnterFullScreen: () => void;
  onClickSelectChamber: () => void;
  onToggleHeader: (isHeader: boolean) => void;
  onOpenUploadImage?: () => void;
  onShowTemplates?: () => void;
  onShowPreviousDocuments?: () => void;
}

const Topbar: React.FC<TopbarProps> = ({
  isPreHand,
  isHeader,
  onEnterFullScreen,
  onClickSelectChamber,
  onToggleHeader,
  onOpenUploadImage,
  onShowTemplates,
  onShowPreviousDocuments,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between py-4">
      <div className="flex gap-3 items-center">
        <button
          type="button"
          className="px-4 py-2 rounded-full bg-gray-200 text-gray-700"
          onClick={onClickSelectChamber}
        >
          Select Chamber
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-full bg-primary text-white"
          onClick={onEnterFullScreen}
        >
          Full Screen
        </button>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={isHeader}
            onChange={(event) => onToggleHeader(event.target.checked)}
          />
          Show Header
        </label>
      </div>
      <div className="flex gap-3 items-center">
        <button
          type="button"
          className="px-4 py-2 rounded-full bg-secondary text-white"
          onClick={onOpenUploadImage}
        >
          Upload Image
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-full bg-gray-200 text-gray-700"
          onClick={onShowPreviousDocuments}
        >
          Previous Documents
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-full bg-gray-200 text-gray-700"
          onClick={onShowTemplates}
        >
          Templates
        </button>
      </div>
    </div>
  );
};

const PrescriptionSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-gray-200 rounded" />
    <div className="h-64 bg-gray-200 rounded" />
    <div className="h-64 bg-gray-200 rounded" />
  </div>
);

interface DoctorInfoProps {
  doctor: DoctorInfo;
  isPreHand: boolean;
  isHeader: boolean;
}

const DoctorInfo: React.FC<DoctorInfoProps> = ({ doctor, isPreHand, isHeader }) => {
  if (!isHeader) {
    return null;
  }
  const hasChambers = (doctor.chamber?.length ?? 0) > 0;
  return (
    <div className="flex justify-between w-full gap-6">
      <div className="w-1/2 mb-5">
        <h1 className="text-2xl font-bold text-secondary mb-2">
          {doctor.doctorName}
        </h1>
        {doctor.qualification && <p>{doctor.qualification}</p>}
        {doctor.degree?.map((item, index) => (
          <p key={${item.degreeName}-} className="text-gray-500">
            {item.degreeName} - {item.instituteName}
            {item.instituteCity ? ,  : ''}
          </p>
        ))}
        {doctor.areaOfExperties && <p className="text-gray-500">{doctor.areaOfExperties}</p>}
        {doctor.bmdc && <p className="text-gray-500">BMDC: {doctor.bmdc}</p>}
      </div>
      <div className="w-1/2 text-right mb-2 space-y-1">
        {hasChambers ? (
          doctor.chamber?.map((item, index) => (
            <div key={${item?.chamberName}-} className="space-y-1">
              <p className="text-secondary font-semibold text-right text-lg">
                {item?.chamberName}
              </p>
              <p className="text-gray-500 text-right text-sm">
                {item?.address}, {item?.city} {item?.zipCode}
              </p>
            </div>
          ))
        ) : (
          <div>
            <p className="text-secondary font-semibold text-right text-lg">
              Prescriba Online
            </p>
            <p className="text-gray-500 text-right text-sm">+880 1605-144633</p>
            <p className="text-gray-500 text-right text-sm">info@prescriba.com</p>
          </div>
        )}
        {doctor.schedule && doctor.schedule.length > 0 && (
          <div className="flex gap-3 flex-wrap justify-end text-sm text-gray-600">
            {doctor.schedule.map((item, index) => (
              <span key={${item.start}--} className="whitespace-nowrap">
                {item.start !== item.end ? ${item.start} -  : item.start}
                <strong className="ml-1">
                  ({item.startTime} - {item.endTime})
                </strong>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface PatientInfoProps {
  patient: PatientInfo;
  onChange: (field: keyof PatientInfo, value: string) => void;
}

const inputClassName =
  'w-4/5 h-8 rounded-md bg-white py-1.5 px-3 text-base text-[#6B7280] outline-none focus:border-[#6A64F1] border border-gray-200';

const PatientInfoCard: React.FC<PatientInfoProps> = ({ patient, onChange }) => (
  <div className="flex bg-white justify-between rounded-lg px-4 border py-2 mb-6 shadow-lg">
    <label className="text-sm flex items-center gap-2">
      <span>Name:</span>
      <input
        value={patient.patientName}
        onChange={(event) => onChange('patientName', event.target.value)}
        type="text"
        placeholder="Name"
        className={inputClassName}
      />
    </label>
    <label className="text-sm flex items-center gap-2">
      <span>Age:</span>
      <input
        value={patient.patientAge}
        onChange={(event) => onChange('patientAge', event.target.value)}
        type="text"
        placeholder="Age"
        className={inputClassName}
      />
    </label>
    <label className="text-sm flex items-center gap-2">
      <span>Blood:</span>
      <input
        value={patient.patientBloodGroup}
        onChange={(event) => onChange('patientBloodGroup', event.target.value)}
        type="text"
        placeholder="Blood Group"
        className={inputClassName}
      />
    </label>
    <label className="text-sm flex items-center gap-2">
      <span>Mobile:</span>
      <input
        value={patient.patientPhoneNo}
        onChange={(event) => onChange('patientPhoneNo', event.target.value)}
        type="text"
        placeholder="Mobile No"
        className={inputClassName}
      />
    </label>
  </div>
);

interface SectionProps {
  title: string;
  items: any[];
  fields: string[];
  onEdit: () => void;
  isExamination?: boolean;
}

const Section: React.FC<SectionProps> = ({ title, items, fields, onEdit, isExamination }) => {
  const hasItems = items && items.length > 0;
  if (isExamination) {
    return (
      <div className="mb-4 pr-2">
        <button
          type="button"
          className="flex bg-gray-200 max-w-[70%] py-2 px-4 text-primary justify-between rounded-md items-center gap-3 font-poppins"
          onClick={onEdit}
        >
          {title} <ModalIcon />
        </button>
        <div className="grid grid-cols-2 gap-x-4 px-4 py-2 box-border text-sm">
          {hasItems ? (
            items.map((item, index) => (
              <React.Fragment key={index}>
                {item.systolic && (
                  <span>
                    <b>Systolic</b>: {item.systolic}
                  </span>
                )}
                {item.diastolic && (
                  <span>
                    <b>Diastolic</b>: {item.diastolic}
                  </span>
                )}
                {item.pulse && (
                  <span>
                    <b>Pulse</b>: {item.pulse}
                  </span>
                )}
                {item.temperature && (
                  <span>
                    <b>Temperature</b>: {item.temperature}
                  </span>
                )}
                {item.weight && (
                  <span>
                    <b>Weight</b>: {item.weight}
                  </span>
                )}
                {(item.heightFeet || item.heightInches) && (
                  <span>
                    <b>Height</b>: {item.heightFeet}.{item.heightInches}
                  </span>
                )}
              </React.Fragment>
            ))
          ) : (
            <span className="col-span-2 text-gray-500">Add examination details</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 pr-2">
      <button
        type="button"
        className="flex bg-gray-200 max-w-[70%] py-2 px-4 text-primary justify-between rounded-md items-center gap-3 font-poppins"
        onClick={onEdit}
      >
        {title} <ModalIcon />
      </button>
      <ul className="list-disc pl-5 py-2 text-sm">
        {hasItems ? (
          items.map((item, index) => (
            <li key={index} className="font-light">
              {fields
                .map((field) => item[field])
                .filter(Boolean)
                .join('  ')}
            </li>
          ))
        ) : (
          <li className="text-gray-500">Add {title.toLowerCase()}</li>
        )}
      </ul>
    </div>
  );
};

interface MedicationListProps {
  medications: MedicationItem[];
  onClick: () => void;
}

const MedicationList: React.FC<MedicationListProps> = ({ medications, onClick }) => {
  const hasMedications = medications && medications.length > 0;
  return (
    <div className="space-y-6 mb-8" onClick={onClick} role="button" tabIndex={0}>
      {hasMedications ? (
        medications.map((medication, index) => (
          <div key={${medication.name}-} className="relative pl-8">
            <div className="absolute left-0 top-0 text-gray-600">{index + 1}</div>
            <div className="font-medium text-gray-800">{medication.name}</div>
            <div className="text-gray-700 mt-1 pl-4">
              {[medication.timming, medication.mealTime, medication.duration]
                .filter(Boolean)
                .join(' ')}
            </div>
            {medication.notes && (
              <p className="text-gray-700 mt-1 pl-4">Note: {medication.notes}</p>
            )}
            <div className="border-b border-dashed border-gray-300 mt-2" />
          </div>
        ))
      ) : (
        <div className="border-dotted rounded-xl border-2 border-gray-300 p-4 text-center w-full h-[100px] flex items-center justify-center">
          <p className="text-gray-500 underline">Add Medicine</p>
        </div>
      )}
    </div>
  );
};

interface BottomNavProps {
  isPreHand: boolean;
  appointmentCode: string;
  onSubmit: () => void;
  onSaveAsTemplate: () => void;
  isSaving: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({
  onSubmit,
  onSaveAsTemplate,
  isSaving,
}) => (
  <div className="flex gap-4 w-full justify-end mt-6">
    <button
      type="button"
      className="flex items-center gap-1 px-5 py-2 rounded-full bg-primary text-white disabled:bg-gray-400 disabled:text-gray-200"
      onClick={onSubmit}
      disabled={isSaving}
    >
      {isSaving ? 'Saving…' : 'Save & Send'}
    </button>
    <button
      type="button"
      className="px-4 py-2 flex gap-1 items-center rounded-full bg-secondary text-white"
      onClick={onSaveAsTemplate}
    >
      Save as Template
    </button>
  </div>
);

interface DynamicModalProps {
  type: NonNullable<ModalState['type']>;
  title: string;
  items: any[];
  onClose: () => void;
  onSave: (items: any[]) => void;
}

const overlayClass = 'fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50';
const modalClass = 'bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 space-y-4';

const defaultFactories: Record<NonNullable<ModalState['type']>, () => any> = {
  complaint: () => ({ name: '', duration: '', notes: '', days: 0 }),
  history: () => ({ name: '', pastHistory: '', presentHistory: '' }),
  examination: () => ({ systolic: '', diastolic: '', pulse: '', temperature: '', weight: '', heightFeet: '', heightInches: '' }),
  diagnosis: () => ({ name: '', pastDiagnosis: '', presentDiagnosis: '' }),
  test: () => ({ name: '', duration: '', notes: '' }),
  medicine: () => ({ name: '', timming: '', mealTime: '', duration: '', notes: '' }),
  advice: () => ({ name: '', notes: '' }),
  followUp: () => new Date().toISOString(),
  'select-chamber': () => ({ }),
};

const inputBaseClass = 'border border-gray-300 rounded px-3 py-2 text-sm w-full';

const DynamicModal: React.FC<DynamicModalProps> = ({ type, title, items, onClose, onSave }) => {
  const [draft, setDraft] = useState<any[]>(() => (Array.isArray(items) ? [...items] : []));
  const [followUpValue, setFollowUpValue] = useState<string>('');

  useEffect(() => {
    setDraft(Array.isArray(items) ? [...items] : []);
    if (type === 'followUp') {
      const value = items?.[0];
      setFollowUpValue(formatDateForInput(typeof value === 'string' ? value : ''));
    }
  }, [items, type]);

  const handleFieldChange = (index: number, field: string, value: string) => {
    setDraft((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const handleRemove = (index: number) => {
    setDraft((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleAdd = () => {
    const factory = defaultFactories[type];
    if (!factory) {
      return;
    }
    const newItem = factory();
    setDraft((prev) => [...prev, newItem]);
  };

  const handleSubmit = () => {
    if (type === 'followUp') {
      if (followUpValue) {
        const iso = new Date(followUpValue).toISOString();
        onSave([iso]);
      } else {
        onSave(['']);
      }
      return;
    }
    onSave(draft);
  };

  const renderBody = () => {
    if (type === 'followUp') {
      return (
        <div className="space-y-4">
          <label className="text-sm text-gray-700 flex flex-col gap-2">
            Select follow-up date
            <input
              type="date"
              className={inputBaseClass}
              value={followUpValue}
              onChange={(event) => setFollowUpValue(event.target.value)}
            />
          </label>
        </div>
      );
    }

    if (type === 'select-chamber') {
      return (
        <div className="space-y-3 text-sm">
          {draft.length === 0 && <p className="text-gray-500">No chamber information available.</p>}
          {draft.map((item, index) => (
            <div key={index} className="border rounded p-3">
              <p className="font-semibold">{item?.chamberName}</p>
              <p className="text-gray-600">{item?.address}</p>
              <p className="text-gray-600">{item?.city} {item?.zipCode}</p>
            </div>
          ))}
        </div>
      );
    }

    const fieldsMap: Record<string, { label: string; field: string }[]> = {
      complaint: [
        { label: 'Complaint', field: 'name' },
        { label: 'Duration', field: 'duration' },
        { label: 'Notes', field: 'notes' },
      ],
      history: [
        { label: 'History', field: 'name' },
        { label: 'Past History', field: 'pastHistory' },
        { label: 'Present History', field: 'presentHistory' },
      ],
      examination: [
        { label: 'Systolic', field: 'systolic' },
        { label: 'Diastolic', field: 'diastolic' },
        { label: 'Pulse', field: 'pulse' },
        { label: 'Temperature', field: 'temperature' },
        { label: 'Weight', field: 'weight' },
        { label: 'Height (feet)', field: 'heightFeet' },
        { label: 'Height (inches)', field: 'heightInches' },
      ],
      diagnosis: [
        { label: 'Diagnosis', field: 'name' },
        { label: 'Past Diagnosis', field: 'pastDiagnosis' },
        { label: 'Present Diagnosis', field: 'presentDiagnosis' },
      ],
      test: [
        { label: 'Test', field: 'name' },
        { label: 'Duration', field: 'duration' },
        { label: 'Notes', field: 'notes' },
      ],
      medicine: [
        { label: 'Medicine', field: 'name' },
        { label: 'Timing', field: 'timming' },
        { label: 'Meal Time', field: 'mealTime' },
        { label: 'Duration', field: 'duration' },
        { label: 'Notes', field: 'notes' },
      ],
      advice: [
        { label: 'Advice', field: 'name' },
        { label: 'Notes', field: 'notes' },
      ],
    };

    const fields = fieldsMap[type] ?? [];

    return (
      <div className="space-y-4">
        {draft.length === 0 && <p className="text-gray-500">No items yet.</p>}
        {draft.map((item, index) => (
          <div key={index} className="border rounded p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">#{index + 1}</span>
              <button
                type="button"
                className="text-sm text-red-500"
                onClick={() => handleRemove(index)}
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fields.map(({ label, field }) => (
                <label key={field} className="text-sm text-gray-700 flex flex-col gap-2">
                  {label}
                  <input
                    type="text"
                    className={inputBaseClass}
                    value={item?.[field] ?? ''}
                    onChange={(event) => handleFieldChange(index, field, event.target.value)}
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
        {type !== 'select-chamber' && (
          <button
            type="button"
            className="px-4 py-2 rounded bg-primary text-white"
            onClick={handleAdd}
          >
            Add {title}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={overlayClass}>
      <div className={modalClass}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button type="button" onClick={onClose} className="text-gray-500">?</button>
        </div>
        {renderBody()}
        <div className="flex justify-end gap-3">
          <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>
            Cancel
          </button>
          {type !== 'select-chamber' && (
            <button type="button" className="px-4 py-2 rounded bg-primary text-white" onClick={handleSubmit}>
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};



