import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  full_name: string;

  @ApiProperty()
  password: string;
}

export interface GetUserInfoResponse {
  username: string;
  full_name: string;
  role: string;
  created_at: string;
}
