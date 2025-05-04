'use client';

import { LiffContainer } from '@/modules/c-liff/interfaces/components/LiffContainer';
import { useLiff } from '@/modules/c-liff/interfaces/hooks/useLiff';
import { LineBotIntegration } from '@/modules/c-lineBot/interfaces/components/LineBotIntegration';
import { processLinePayCallback } from '@/modules/c-linePay/application/callbacks/payment.callback';
import { AssetDisplay } from '@/modules/c-linePay/interfaces/components/AssetDisplay';
import { RechargeForm } from '@/modules/c-linePay/interfaces/components/RechargeForm';
import { PaymentCallback } from '@/modules/c-linePay/interfaces/payment.callback';
import { usePayment } from '@/modules/c-linePay/interfaces/payment.hooks';
import { PaymentEnumMessage } from '@/modules/c-linePay/interfaces/payment.status';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <h2 className="text-xl font-semibold text-gray-600">Loading...</h2>
    </div>
  );
}

function PaymentCallbackHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const transactionId = searchParams.get('transactionId');

    if (orderId && transactionId) {
      processLinePayCallback(transactionId, orderId);
    }
  }, [searchParams]);

  return null;
}

function ProfileContent() {
  const [activeTab, setActiveTab] = useState<'recharge' | 'assets'>('recharge');
  const { profile } = useLiff();
  const {
    assets,
    amount,
    setAmount,
    isLoading: paymentLoading,
    error: paymentError,
    paymentMessage,
    handleRecharge
  } = usePayment(profile?.userId);

  return (
    <div className="max-w-2xl mx-auto mt-4 space-y-6">
      {/* 標籤導航 */}
      <div className="bg-white rounded-lg shadow-sm">
        <nav className="flex border-b">
          <button
            onClick={() => setActiveTab('recharge')}
            className={`flex-1 px-4 py-2 text-sm font-medium text-center ${activeTab === 'recharge'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            充值中心
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`flex-1 px-4 py-2 text-sm font-medium text-center ${activeTab === 'assets'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            我的資產
          </button>
        </nav>
      </div>

      {/* 內容區塊 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeTab === 'recharge' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">充值中心</h2>
            <PaymentCallback />
            <PaymentEnumMessage status={paymentMessage} />
            <RechargeForm
              amount={amount}
              setAmount={setAmount}
              isLoading={paymentLoading}
              error={paymentError}
              onSubmit={handleRecharge}
            />
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">我的資產</h2>
            <AssetDisplay assets={assets} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#00B900]">個人資料</h1>
        <p className="text-sm text-gray-600">查看您的 LINE 個人資料與相關功能</p>
      </div>

      <div className="mb-8 bg-[#00B900]/5 p-6 rounded-lg shadow-sm border border-[#00B900]/20">
        <h2 className="font-semibold text-[#00B900] mb-3">LIFF 資訊</h2>
        <p className="text-sm text-gray-600">此區域顯示 LIFF 資訊與互動功能</p>
        <LiffContainer
          showProfile={true}
          showInfo={true}
          showActions={true}
          showInitStatus={true}
        />
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <PaymentCallbackHandler />
        <ProfileContent />
      </Suspense>

      <div className="mt-8">
        <LineBotIntegration />
      </div>
    </div>
  );
}