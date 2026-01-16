import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from './entities/user.entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findById(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findByEmailForAuth(email: string): Promise<User | null> {
  return this.repo.findOne({
    where: { email },
    select: ['id', 'email', 'passwordHash', 'role'],
  });
}

  async create(
    email: string,
    password: string,
    role: UserRole = 'user',
  ): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.repo.create({
      email,
      passwordHash,
      role,
    });

    return this.repo.save(user);
  }
}
