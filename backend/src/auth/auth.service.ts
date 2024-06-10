import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/auth-payload.dto';

const fakeUsers = [
  {
    id: 1,
    username: 'anson',
    password: 'password',
  },
  {
    id: 2,
    username: 'mehadnd',
    password: 'password',
  },
];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login({ username, password }: AuthPayloadDto) {
    const findUser = fakeUsers.find((user) => user.username === username);
    if (!findUser) {
        throw new HttpException('Invalid Username', HttpStatus.UNAUTHORIZED);
    }
    if (password === findUser.password) {
      const { password, ...user } = findUser;
      return this.jwtService.sign(user);
    } else {
        throw new HttpException('Invalid Password', HttpStatus.UNAUTHORIZED);
    }
  }
}
