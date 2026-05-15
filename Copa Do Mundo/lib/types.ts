export interface Profile {
  id: string
  name: string
  department: string
  avatar_url: string | null
  created_at: string
}

export interface Match {
  id: string
  team_home: string
  team_away: string
  flag_home: string | null
  flag_away: string | null
  match_date: string
  group_stage: string | null
  phase: string
  score_home: number | null
  score_away: number | null
  is_finished: boolean
  created_at: string
}

export interface Prediction {
  id: string
  user_id: string
  match_id: string
  score_home: number
  score_away: number
  points: number
  created_at: string
  updated_at: string
}

export interface PredictionWithMatch extends Prediction {
  matches: Match
}

export interface ProfileWithPoints extends Profile {
  total_points: number
}
