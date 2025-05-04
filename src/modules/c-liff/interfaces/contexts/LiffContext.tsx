'use client';

import { saveUserProfile } from '@/modules/c-liff/application/actions/liffActions';
import { LiffProfile as LiffProfileValueObject } from '@/modules/c-liff/domain/valueObjects/LiffProfile';
import { ProfileServerDTO } from '@/modules/c-liff/infrastructure/dtos/LiffProfileDto';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import LiffClient from '../client';

const liffId = process.env.NEXT_PUBLIC_LIFF_ID!;

interface LiffContextValue {
  profile: LiffProfileValueObject;
  friendship: { friendFlag: boolean };
  isInitialized: boolean;
  error: string | null;
  isLoggedIn: boolean;
  isInClient: boolean;
  os: string;
  language: string;
  liffVersion: string;
  lineVersion: string;
  refreshProfile: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  closeWindow: () => void;
  openExternalWindow: (url: string) => void;
  scanCode: () => Promise<string | null>;
  persistUserData: () => Promise<{ success: boolean; userId?: string }>;
}

const defaultContextValue: LiffContextValue = {
  profile: LiffProfileValueObject.createDefault(),
  friendship: { friendFlag: false },
  isInitialized: false,
  error: null,
  isLoggedIn: false,
  isInClient: false,
  os: '',
  language: '',
  liffVersion: '',
  lineVersion: '',
  refreshProfile: async () => { },
  login: async () => { },
  logout: async () => { },
  closeWindow: () => { },
  openExternalWindow: () => { },
  scanCode: async () => null,
  persistUserData: async () => ({ success: false }),
};

const LiffContext = createContext<LiffContextValue>(defaultContextValue);

export function LiffContextProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<LiffProfileValueObject>(
    LiffProfileValueObject.createDefault()
  );
  const [friendship, setFriendship] = useState<{ friendFlag: boolean }>({ friendFlag: false });
  const [isLiffLoggedIn, setIsLiffLoggedIn] = useState(false);
  const [isLiffInClient, setIsLiffInClient] = useState(false);
  const [osType, setOsType] = useState('');
  const [languageType, setLanguageType] = useState('');
  const [liffVersionValue, setLiffVersionValue] = useState('');
  const [lineVersionValue, setLineVersionValue] = useState('');

  const refreshProfile = useCallback(async () => {
    if (isInitialized && isLiffLoggedIn) {
      const profileData = await LiffClient.getProfile();
      const friendshipData = await LiffClient.getFriendship();
      setProfile(LiffProfileValueObject.fromLiffProfile(profileData));
      setFriendship(friendshipData);
    }
  }, [isInitialized, isLiffLoggedIn]);

  const handleLogout = useCallback(async () => {
    LiffClient.logout();
    setIsLiffLoggedIn(false);
    setProfile(LiffProfileValueObject.createDefault());
    setFriendship({ friendFlag: false });
  }, []);

  const handleOpenExternalWindow = useCallback(
    (url: string) => LiffClient.openWindow({ url, external: true }),
    []
  );

  const handlePersistUserData = useCallback(async () => {
    try {
      if (!isLiffLoggedIn || !profile.userId) {
        return { success: false, message: 'Not logged in' };
      }

      const profileDto: ProfileServerDTO = {
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage,
      };

      return await saveUserProfile(profileDto);
    } catch (err) {
      console.error('Error saving user profile:', err);
      return { success: false };
    }
  }, [isLiffLoggedIn, profile]);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await LiffClient.init({ liffId });
        setIsInitialized(true);
        setIsLiffLoggedIn(LiffClient.isLoggedIn());
        setIsLiffInClient(LiffClient.isInClient());
        setOsType(LiffClient.getOS() || '');
        setLanguageType(LiffClient.getLanguage());
        setLiffVersionValue(LiffClient.getVersion());
        setLineVersionValue(LiffClient.getLineVersion() || '');
        if (LiffClient.isLoggedIn()) {
          await refreshProfile();
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error during LIFF initialization';
        setError(errorMessage);
        console.error('LIFF initialization error:', errorMessage);

        // 處理特定錯誤
        if (errorMessage.includes('no login bot linked')) {
          const message = '請確保已在 LINE Developers Console 中正確設定並連結 LINE Bot。';
          setError(`${errorMessage} - ${message}`);

          // 嘗試自動修復（可選）
          try {
            // 這裡可以實現自動重新初始化的邏輯
          } catch (repairError) {
            console.error('嘗試修復失敗:', repairError);
          }
        }
      }
    };

    initializeLiff();
  }, [refreshProfile]);

  const contextValue: LiffContextValue = {
    profile,
    friendship,
    isInitialized,
    error,
    isLoggedIn: isLiffLoggedIn,
    isInClient: isLiffInClient,
    os: osType,
    language: languageType,
    liffVersion: liffVersionValue,
    lineVersion: lineVersionValue,
    refreshProfile,
    login: LiffClient.login,
    logout: handleLogout,
    closeWindow: LiffClient.closeWindow,
    openExternalWindow: handleOpenExternalWindow,
    scanCode: LiffClient.scanCode,
    persistUserData: handlePersistUserData,
  };

  return <LiffContext.Provider value={contextValue}>{children}</LiffContext.Provider>;
}

export const useLiffContext = () => useContext(LiffContext);
