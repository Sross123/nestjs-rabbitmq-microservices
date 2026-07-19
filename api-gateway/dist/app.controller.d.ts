import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
export declare class AppController {
    private readonly orderClient;
    constructor(orderClient: ClientProxy);
    createOrder(orderData: any): Observable<any>;
}
