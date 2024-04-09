export class EnvironmentsResponse {
  pageSize: number;
  previous: number;
  next: number;
  total: number;
  data: any[];

  constructor() {
    this.data = [];
  }
}

export class EnvironmentData {
  id: number;
  created_at: Date;
  updated_at: Date;
  latitude: number;
  longitude: number;
  name: string;
  user_name: string;
  created_by: string;
  description: string;
  environment_user: any[];
  environment_manager: any[];
  environment_restriction_access: any[];

  constructor() {
  }
}
