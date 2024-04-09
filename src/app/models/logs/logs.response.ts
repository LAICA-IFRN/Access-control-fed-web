export class LogsResponse {
    pageSize: number;
    previous: number;
    next: number;
    total: number;
    data: AccessLogData[] | AuditLogsData[];

    constructor() {
        this.data = [];
    }
}

export class AuditLogsData {
    id: number;
    created_at: Date;
    message: string;
    type: string;
    topic: string;
    meta: any;
    metaData?: any;

    constructor() {
    }
}

export class AccessLogData {
    id: number;
    created_at: Date;
    message: string;
    type: string;
    meta: any;
    metaData?: any;

    constructor() {
    }
}

export interface AccessLogMetaData {
    ip: string;
    mac: string;
    rfid: string;
    encoded: string;
    userId: string;
    environmentId: string;
}
