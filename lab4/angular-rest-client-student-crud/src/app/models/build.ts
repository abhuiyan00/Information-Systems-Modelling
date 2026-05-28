export type BuildType = 'fixed_wing' | 'drone' | 'helicopter' | 'boat' | 'car' | 'scale_model' | 'other';
export type BuildStatus = 'draft' | 'pending_review' | 'published' | 'rejected' | 'archived';

export interface Build {
  id?: string;
  title: string;
  type: BuildType;
  description?: string;
  scale?: string;
  wingspan_mm?: number;
  frame_size_mm?: number;
  num_motors?: number;
  flight_controller?: string;
  max_takeoff_weight_g?: number;
  rotor_diameter_mm?: number;
  hull_length_mm?: number;
  wheelbase_mm?: number;
  status?: BuildStatus;
  owner_id?: string;
  score?: number;
  created_at?: string;
  updated_at?: string;
}

export type BuildPayload = Omit<Build, 'id' | 'status' | 'owner_id' | 'score' | 'created_at' | 'updated_at'>;

export interface BuildList {
  items: Build[];
  total: number;
  page: number;
  size: number;
}
