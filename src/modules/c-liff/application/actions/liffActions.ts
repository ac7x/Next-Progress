'use server';

import { User } from '@/modules/c-liff/domain/entities/User';
import { LiffProfile } from '@/modules/c-liff/domain/valueObjects/LiffProfile';
import { ProfileServerDTO } from '@/modules/c-liff/infrastructure/dtos/LiffProfileDto';
import { PrismaUserRepository } from '@/modules/c-liff/infrastructure/repositories/PrismaUserRepository';

function handleError(error: unknown): { success: false; message: string } {
  console.error('Error:', error);
  return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
}

function createProfile(profileData: ProfileServerDTO): LiffProfile {
  return new LiffProfile(
    profileData.userId,
    profileData.displayName,
    profileData.pictureUrl,
    profileData.statusMessage
  );
}

export async function saveUserProfile(profileData?: ProfileServerDTO) {
  try {
    if (!profileData || !profileData.userId) {
      return { success: false, message: 'No user profile data provided' };
    }

    const repository = new PrismaUserRepository();
    const existingUser = await repository.findByUserId(profileData.userId);

    const profile = createProfile(profileData);

    if (existingUser) {
      existingUser.updateProfile(profile);
      await repository.save(existingUser);
      return { success: true, userId: existingUser.userId };
    } else {
      const newUser = new User(profileData.userId, profile, false);
      const savedUser = await repository.save(newUser);
      return { success: true, userId: savedUser.userId };
    }
  } catch (error) {
    return handleError(error);
  }
}
