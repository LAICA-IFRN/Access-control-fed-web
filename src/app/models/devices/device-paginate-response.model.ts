export class DevicePaginateResponse {
  pageSize: number;
  previous: number;
  next: number;
  total: number;
  data: MicrocontrollerPaginateResponseData[] | MobilePaginateResponseData[] | RFIDPaginateResponseData[];

  constructor() {
    this.data = [];
  }
}

export class MobilePaginateResponseData {
  id: string;
  user_id: string;
  user_name: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class RFIDPaginateResponseData {
  id: number;
  tag: string;
  active: boolean;
  user_id: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export class MicrocontrollerPaginateResponseData {
  id: number;
  ip: string;
  mac: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  microcontroller_type_id: {
    name: string;
  };
}
