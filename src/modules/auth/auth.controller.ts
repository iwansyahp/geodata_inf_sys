import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Public } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Login endpoint for user, successfull login returns JWT',
  })
  logIn(@Body() loginDto: LoginDto) {
    return this.authService.logIn(loginDto.username, loginDto.password);
  }

  @ApiResponse({
    status: 200,
    description: "Get current user's token information",
  })
  @ApiBearerAuth()
  @Get('/current_user')
  getUser(@Request() req) {
    return req.user;
  }
}
