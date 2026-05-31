import ApiClient from "@services/ApiClient";

export interface UserData {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: "student" | "teacher" | "admin";
  points: number;
  institution_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  last_login_at: string | null;
}

export interface UserUpdatePayload {
  name?: string;
  lastName?: string;
  email?: string;
}

export interface UserChallengeData {
  challenge_id: string;
  challenge_name: string;
  description: string;
  points: number;
  class_id: string;
  enrolled_at: string;
  completed_at: string | null;
  status: "completed" | "in_progress";
}

export default class UserService {
  static checkExists(email: string) {
    return ApiClient.get<{ exists: boolean }>(
      `/user?email=${encodeURIComponent(email)}`,
    );
  }

  static getOne(id: string, sessionToken: string) {
    return ApiClient.get<UserData>(`/user/${id}`, sessionToken);
  }

  static updateOne(
    id: string,
    payload: UserUpdatePayload,
    sessionToken: string,
  ) {
    return ApiClient.patch<{ message: string }>(
      `/user/${id}`,
      payload,
      sessionToken,
    );
  }

  static deleteOne(id: string, sessionToken: string) {
    return ApiClient.delete<{ message: string }>(
      `/user/${id}`,
      undefined,
      sessionToken,
    );
  }

  static getChallenges(id: string, sessionToken: string) {
    return ApiClient.get<{ data: UserChallengeData[] }>(
      `/user/${id}/challenges`,
      sessionToken,
    );
  }

  static getByEmail(email: string, sessionToken: string) {
    return ApiClient.get<UserData>(
      `/user/email/${encodeURIComponent(email)}`,
      sessionToken,
    );
  }

  static searchStudents(q: string, sessionToken: string) {
    return ApiClient.get<{ data: UserData[] }>(
      `/user/search?q=${encodeURIComponent(q)}`,
      sessionToken,
    );
  }
}
