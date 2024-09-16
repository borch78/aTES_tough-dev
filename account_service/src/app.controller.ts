import {Controller, Get, Param, Query} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('accounts/my-own/:id')
  getMyOwnAccount(@Param('id') ownerId: string) {
    return this.appService.getAccount(ownerId);
  }

  @Get('accounts/my-own/:id/history')
  getMyOperationsLog(@Param('id') ownerId: string) {
    return this.appService.getLogs(ownerId);
  }

  @Get('analytic')
  getAnalyticData() {
    return this.appService.getAnalytic()
  }
}
