import ApiClient from "@services/ApiClient";

export interface EnrollmentData {
  user_id: string;
  challenge_id: string;
  enrolled_at: string;
  completed_at: string | null;
}

export default class EnrollmentService {
  static enroll(user_id: string, challenge_id: string, sessionToken: string) {
    return ApiClient.post<EnrollmentData>("/enrollment", { user_id, challenge_id }, sessionToken);
  }

  static unenroll(user_id: string, challenge_id: string, sessionToken: string) {
    return ApiClient.delete<{ message: string }>("/enrollment", { user_id, challenge_id }, sessionToken);
  }

  static complete(user_id: string, challenge_id: string, sessionToken: string) {
    return ApiClient.patch<{ message: string }>("/enrollment/complete", { user_id, challenge_id }, sessionToken);
  }

  static uncomplete(user_id: string, challenge_id: string, sessionToken: string) {
    return ApiClient.patch<{ message: string }>("/enrollment/uncomplete", { user_id, challenge_id }, sessionToken);
  }

  static getByUser(user_id: string, sessionToken: string) {
    return ApiClient.get<EnrollmentData[]>(`/enrollment/user/${user_id}`, sessionToken);
  }

  static getByChallenge(challenge_id: string, sessionToken: string) {
    return ApiClient.get<EnrollmentData[]>(`/enrollment/challenge/${challenge_id}`, sessionToken);
  }
}
