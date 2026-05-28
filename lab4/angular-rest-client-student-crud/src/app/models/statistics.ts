export interface EndpointStat {
  calls: number;
  percentage: number;
}

export interface DataInsights {
  most_common_build_type: string;
  total_builds_retrieved: number;
  most_called_endpoint: string;
}

export interface Statistics {
  total_calls: number;
  endpoint_usage: Record<string, EndpointStat>;
  data_insights: DataInsights;
}
