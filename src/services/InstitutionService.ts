import ApiClient from "@services/ApiClient";

export interface InstitutionData {
  id: string;
  name: string;
  student_domain: string;
  teacher_domain: string;
  created_at: string;
}

export interface InstitutionCreatePayload {
  name: string;
  student_domain: string;
  teacher_domain: string;
}

export interface InstitutionUpdatePayload {
  name?: string;
  student_domain?: string;
  teacher_domain?: string;
}

export default class InstitutionService {
  static getAll(sessionToken: string) {
    return ApiClient.get<InstitutionData[]>("/institution", sessionToken);
  }

  static create(payload: InstitutionCreatePayload, sessionToken: string) {
    return ApiClient.post<InstitutionData>("/institution", payload, sessionToken);
  }

  static getOne(id: string, sessionToken: string) {
    return ApiClient.get<InstitutionData>(`/institution/${id}`, sessionToken);
  }

  static updateOne(id: string, payload: InstitutionUpdatePayload, sessionToken: string) {
    return ApiClient.patch<{ message: string }>(`/institution/${id}`, payload, sessionToken);
  }

  static deleteOne(id: string, sessionToken: string) {
    return ApiClient.delete<{ message: string }>(`/institution/${id}`, undefined, sessionToken);
  }

  static searchByDomain(domain: string) {
    return ApiClient.get<{ name: string; role: "student" | "teacher" }>(`/institution/domain/${domain}`);
  }
}
