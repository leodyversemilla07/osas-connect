export interface Interview {
    id: number;
    application_id: number;
    schedule: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
    remarks?: string;
    scholarship?: {
        id: number;
        name: string;
        type: string;
    };
    application?: {
        id: number;
        interviewer?: {
            id: number;
            name: string;
        };
        location?: string;
    };
    created_at: string;
    updated_at: string;
}
