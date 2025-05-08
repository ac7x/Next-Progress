import { User } from '@/modules/c-liff/domain/entities/User';
import { LiffProfile } from '@/modules/c-liff/domain/valueObjects/LiffProfile';
import { User as PrismaUser } from '@prisma/client';

export class UserMapper {
  toDomain(persistenceModel: PrismaUser): User {
    const profile = new LiffProfile(
      persistenceModel.userId,
      persistenceModel.displayName,
      persistenceModel.pictureUrl || undefined,
      persistenceModel.statusMessage || undefined
    );

    return new User(persistenceModel.userId, profile);
  }

  toPersistence(domainModel: User): {
    userId: string;
    displayName: string;
    pictureUrl: string | null;
    statusMessage: string | null;
  } {
    const profile = domainModel.profile;

    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl || null,
      statusMessage: profile.statusMessage || null,
    };
  }
}
