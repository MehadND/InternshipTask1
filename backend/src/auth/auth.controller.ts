import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth-payload.dto';
import { LocalGuard } from './guards/local.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Body() authPayloadDto: AuthPayloadDto) {
    const token = this.authService.login(authPayloadDto);

    return {
      token: token,
      username: authPayloadDto.username,
    };
  }
}
