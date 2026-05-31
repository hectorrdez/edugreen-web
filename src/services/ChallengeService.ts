import ApiClient from "@services/ApiClient";

export interface ChallengeData {
  id: string;
  name: string;
  class_id: string;
  description: string | null;
  image: string | null;
  points: number;
  auto_enroll: boolean;
  participants: number;
  created_at: string;
  updated_at: string;
}

export interface ChallengeCreatePayload {
  name: string;
  class_id: string;
  description?: string;
  image?: string;
  points?: number;
}

export interface ChallengeUpdatePayload {
  name?: string;
  description?: string;
  image?: string | null;
  points?: number;
}

export default class ChallengeService {
  static create(payload: ChallengeCreatePayload, sessionToken: string, imageFile?: File) {
    if (imageFile) {
      const form = new FormData();
      form.append("name", payload.name);
      form.append("class_id", payload.class_id);
      if (payload.description) form.append("description", payload.description);
      if (payload.points !== undefined) form.append("points", String(payload.points));
      form.append("image", imageFile);
      return ApiClient.post<ChallengeData>("/challenge", form, sessionToken);
    }
    return ApiClient.post<ChallengeData>("/challenge", payload, sessionToken);
  }

  static getByClass(class_id: string, sessionToken: string) {
    return ApiClient.get<ChallengeData[]>(`/challenge/class/${class_id}`, sessionToken);
  }

  static getOne(id: string, sessionToken: string) {
    return ApiClient.get<ChallengeData>(`/challenge/${id}`, sessionToken);
  }

  static updateOne(id: string, payload: ChallengeUpdatePayload, sessionToken: string, imageFile?: File) {
    if (imageFile) {
      const form = new FormData();
      if (payload.name) form.append("name", payload.name);
      if (payload.description) form.append("description", payload.description);
      if (payload.points !== undefined) form.append("points", String(payload.points));
      form.append("image", imageFile);
      return ApiClient.patch<{ message: string }>(`/challenge/${id}`, form, sessionToken);
    }
    return ApiClient.patch<{ message: string }>(`/challenge/${id}`, payload, sessionToken);
  }

  static deleteOne(id: string, sessionToken: string) {
    return ApiClient.delete<{ message: string }>(`/challenge/${id}`, undefined, sessionToken);
  }
}
