import ApiClient from "@services/ApiClient";

export interface UserStatsData {
  total_points: number;
  history: Array<{
    challenge_id: string;
    points: number;
    earned_at: string;
  }>;
}

export interface ChallengeStatsData {
  challenge_id: string;
  total_completions: number;
  completions: Array<{
    user_id: string;
    points: number;
    earned_at: string;
  }>;
}

export interface ClassStatsData {
  class_id: string;
  total_students: number;
  total_challenges: number;
  total_enrollments: number;
  completed_enrollments: number;
  completion_rate: number;
  participation_rate: number;
  total_points_awarded: number;
}

export interface RankingEntryData {
  user_id: string;
  name: string;
  lastName: string;
  email: string;
  total_points: number;
  rank: number;
}

export interface PlatformStatsData {
  total_users: number;
  total_institutions: number;
  total_classes: number;
  total_challenges: number;
  total_enrollments: number;
  completed_enrollments: number;
  completion_rate: number;
}

export default class StatsService {
  static getByUser(user_id: string, sessionToken: string) {
    return ApiClient.get<UserStatsData>(`/stats/user/${user_id}`, sessionToken);
  }

  static getByChallenge(challenge_id: string, sessionToken: string) {
    return ApiClient.get<ChallengeStatsData>(`/stats/challenge/${challenge_id}`, sessionToken);
  }

  static getByClass(class_id: string, sessionToken: string) {
    return ApiClient.get<ClassStatsData>(`/stats/class/${class_id}`, sessionToken);
  }

  static getRanking(class_id: string, sessionToken: string) {
    return ApiClient.get<{ data: RankingEntryData[] }>(`/stats/class/${class_id}/ranking`, sessionToken);
  }

  static getPlatform(sessionToken: string) {
    return ApiClient.get<PlatformStatsData>("/stats/platform", sessionToken);
  }
}
