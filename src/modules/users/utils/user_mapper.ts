import { GetUserInfoResponse } from '../dto/user.dto';
import { User } from '../models/user.model';

export const mapUserToResponse = function (user: User): GetUserInfoResponse {
  return {
    username: user.username,
    full_name: user.full_name,
    role: user.role,
    created_at: user.createdAt,
  };
};
