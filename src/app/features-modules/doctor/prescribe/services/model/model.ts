type BaseEntity = {
  createdAt: string;
  updatedAt?: string;
  isDeleted: boolean;
  tenantId: number;
};

type SymptomRecord = BaseEntity & {
  symptomId: number;
  symptomName: string;
  description: string;
};

type ApiResponse<T> = {
  isSuccess: boolean;
  message: string;
  results: T[];
  status: string;
  statusCode: number;
};

export type SymptomDto = ApiResponse<SymptomRecord>;

export type Complaint = {
  name: string;
  duration: string;
  days: number;
  notes: string;
  id: number;
};
export type History = {
  name: string;
  id: number;
  pastHistory: string;
  presentHistory: string;
};
export type Diagnosis = {
  name: string;
  presentDiagnosis: string;
  pastDiagnosis: string;
  id: number;
};
export type Advice = {
  name: string;
  notes: string;
  id: number;
};
export type Test = {
  name: string;
  notes: string;
  id: number;
};
export type Followup = {
  name: string;
  notes: string;
  id: number;
};

export type Medicine = {
  name: string;
  duration: string;
  timming: string;
  mealTime: string;
  notes: string;
  id: number;
};
export type OnExam = {
  systolic: string;
  diastolic: string;
  pulse: string;
  temperature: string;
  weight: string;
  heightFeet: string;
  heightInches: string;
};
