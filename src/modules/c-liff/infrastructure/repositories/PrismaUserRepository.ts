import { User } from '@/modules/c-liff/domain/entities/User';
import { IUserRepository } from '@/modules/c-liff/domain/repositories/IUserRepository';
import { UserMapper } from '@/modules/c-liff/infrastructure/mappers/UserMapper';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';

export class PrismaUserRepository implements IUserRepository {
  private prisma: typeof prisma;
  private mapper: UserMapper;

  constructor() {
    this.prisma = prisma;
    this.mapper = new UserMapper();
  }

  async findByUserId(userId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      return null;
    }

    return this.mapper.toDomain(user);
  }

  async save(user: User): Promise<User> {
    const userData = this.mapper.toPersistence(user);

    const savedUser = await this.prisma.user.upsert({
      where: { userId: userData.userId },
      update: userData,
      create: userData,
    });

    return this.mapper.toDomain(savedUser);
  }
}
