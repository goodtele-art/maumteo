export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  reward: AchievementReward;
}

export interface AchievementReward {
  type: "gold" | "reputation" | "ap_permanent";
  value: number;
}

export interface AchievementState {
  unlockedIds: string[];
}
