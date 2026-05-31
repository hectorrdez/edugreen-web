import ApiClient from "@services/ApiClient";

export interface UserClassData {
  user_id: string;
  class_id: string;
  joined_at: string;
}

export interface ClassWithJoinDate {
  id: string;
  name: string;
  tutor_id: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  joined_at: string;
}

export default class UserClassService {
  static addUserToClass(user_id: string, class_id: string, sessionToken: string) {
    return ApiClient.post<UserClassData>("/user-class", { user_id, class_id }, sessionToken);
  }

  static removeUserFromClass(user_id: string, class_id: string, sessionToken: string) {
    return ApiClient.delete<{ message: string }>("/user-class", { user_id, class_id }, sessionToken);
  }

  static getClassesByUser(user_id: string, sessionToken: string) {
    return ApiClient.get<{ data: ClassWithJoinDate[] }>(`/user-class/user/${user_id}`, sessionToken);
  }

  static getUsersByClass(class_id: string, sessionToken: string) {
    return ApiClient.get<UserClassData[]>(`/user-class/class/${class_id}`, sessionToken);
  }
}
