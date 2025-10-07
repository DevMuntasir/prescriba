import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { SendNotificationInputDto } from '../../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  apiName = 'Default';
  

  sendNotification = (input: SendNotificationInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/chat/send-message',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
