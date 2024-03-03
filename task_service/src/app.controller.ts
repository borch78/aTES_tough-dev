import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller({ path: 'tasks' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  createTask(@Body() task: string) {
    return this.appService.createTask(task);
  }

  @Get()
  shuffle() {
    return this.appService.shuffleTask();
  }

  @Get('popugs/:id')
  getTasks(@Param('id') id: string) {
    return this.appService.getTasks(id);
  }

  @Patch(':id/complete')
  async changeStatus(@Param('id', ParseIntPipe) taskId: number) {
    await this.appService.changeStatus(taskId);
  }
}
