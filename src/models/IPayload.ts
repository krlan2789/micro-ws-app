export interface IPayload {
    message: string;
    timestamp: string;
    content?: any;
    [key: string]: any;
}
