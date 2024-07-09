import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    if (user) {
      req.user = user; // Attach the user to the request
    }
    console.log(`JwtAuthGuard: User: ${user ? user.email : 'No user'}`); // Log for debugging
    return user;
  }
}
