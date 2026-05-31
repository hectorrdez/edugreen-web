import ApiClient from "@services/ApiClient";

export interface ClassData {
  id: string;
  name: string;
  tutor_id: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClassCreatePayload {
  name: string;
  tutor_id: string;
  description?: string;
}

export interface ClassUpdatePayload {
  name?: string;
  description?: string;
}

export default class ClassService {
  static create(payload: ClassCreatePayload, sessionToken: string) {
    return ApiClient.post<ClassData>("/class", payload, sessionToken);
  }

  static getOne(id: string, sessionToken: string) {
    return ApiClient.get<ClassData>(`/class/${id}`, sessionToken);
  }

  static getByTutor(tutorId: string, sessionToken: string) {
    return ApiClient.get<ClassData[]>(`/class/tutor/${tutorId}`, sessionToken);
  }

  static updateOne(id: string, payload: ClassUpdatePayload, sessionToken: string) {
    return ApiClient.patch<{ message: string }>(`/class/${id}`, payload, sessionToken);
  }

  static deleteOne(id: string, sessionToken: string) {
    return ApiClient.delete<{ message: string }>(`/class/${id}`, undefined, sessionToken);
  }
}
