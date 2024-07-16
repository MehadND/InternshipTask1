import { Controller, Get } from '@nestjs/common';

type Status = {
  status: boolean;
};

@Controller('util')
export class AppController {
  @Get('status')
  findStatus(): Status {
    const status = true;
    return {
      status,
    };
  }
}
