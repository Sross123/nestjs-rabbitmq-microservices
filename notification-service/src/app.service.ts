// notification-service/src/app.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger('NotificationService');

  sendOrderEmail(data: any) {
    // Simulating sending a background email confirmation
    this.logger.log(`📧 Sending confirmation email for Order #${data.orderId}...`);
    setTimeout(()=>{
      this.logger.log(`📧 Confirmation email sent for Order #${data.orderId}.`);
    },5000)
    return true;
  }
}