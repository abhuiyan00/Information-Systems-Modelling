export type FlightConditions = 'SUNNY' | 'CLOUDY' | 'WINDY' | 'RAIN';

export interface FlightLogRequest {
  flight_date: string;          // YYYY-MM-DD
  location_name: string;
  duration_min: number;
  max_altitude_m: number;       // EU Open Category cap: 120
  drone_identifier: string;     // /^[A-Z]{2}-[A-Z0-9]{6,12}$/ (EASA UAS operator id)
  conditions: FlightConditions;
  notebook?: string;
}

export interface FlightLog extends FlightLogRequest {
  id: string;
  build_id: string;
  created_at: string;
}
