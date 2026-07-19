export declare class AppService {
    private readonly logger;
    createOrder(data: any): {
        success: boolean;
        orderId: number;
        message: string;
    };
}
