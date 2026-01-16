import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from 'src/users/user.service';

@Injectable()
export class UserSeed implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@admin.com';
    const adminPass = process.env.ADMIN_PASSWORD ?? 'admin123';

    const exists = await this.usersService.findByEmail(adminEmail);
    if (exists) return;

    await this.usersService.create(adminEmail, adminPass, 'admin');
    console.log(` Admin creado: ${adminEmail} / ${adminPass}`);
  }
}
