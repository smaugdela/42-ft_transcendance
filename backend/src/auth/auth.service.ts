import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
	login() {
		return 'I am login';
	}

	signup() {
		return 'I am signup';
	}
}
