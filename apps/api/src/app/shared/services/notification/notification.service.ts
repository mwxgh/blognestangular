/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, Inject } from '@nestjs/common';
import { NOTIFICATION_OPTIONS } from './constants';
import { ConfigService } from '@nestjs/config';
import { INotification } from './interfaces';
import { find } from 'lodash';

@Injectable()
export class NotificationService {
  constructor(@Inject(NOTIFICATION_OPTIONS) private options, private configService: ConfigService) {}
  register(): any[] {
    return this.options.channels;
  }

  async send(entity: any, notification: INotification): Promise<any> {
    notification.notifiable = entity;
    const methods = notification.via();
    for (const method of methods) {
      const channel = find(this.options.channels, { name: method });
      if (channel) {
        await channel.execute(notification);
      }
    }
    return true;
  }
}
