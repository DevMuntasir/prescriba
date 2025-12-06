import { environment, prescriptionApi } from '../../environments/environment';

export const API_BASE_URL = environment.apis.default.url;
export const PRESCRIPTION_API_BASE_URL = prescriptionApi +'/api/2025-02';
