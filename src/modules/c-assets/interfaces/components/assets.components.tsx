'use client';

import { useTransition } from 'react';

interface UserAssetsDisplayProps {
  diamonds: number;
  hearts: number;
  bubbles: number;
  coins: number;
}

export function UserAssetsDisplay({ diamonds, hearts, coins, bubbles }: UserAssetsDisplayProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Your Assets</h2>
      <ul className="list-disc pl-5">
        <li>Diamonds: {diamonds}</li>
        <li>Hearts: {hearts}</li>
        <li>Bubbles: {bubbles}</li>
        <li>Coins: {coins}</li>
      </ul>
    </div>
  );
}

interface RechargeFormProps {
  amount: string;
  setAmountAction: (amount: string) => Promise<void>; // 改為 Action
  error: string;
  isLoading: boolean;
  onSubmitAction: (e: React.FormEvent) => Promise<void>; // 改為 Action
}

export function RechargeForm({ 
  amount, 
  setAmountAction, 
  error, 
  isLoading, 
  onSubmitAction 
}: RechargeFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleAmountChange = (value: string) => {
    startTransition(() => {
      setAmountAction(value);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      onSubmitAction(e);
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-3">Recharge Diamonds</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="amount" className="block mb-1 text-sm font-medium text-gray-700">
            Recharge Amount
          </label>
          <input
            type="number"
            id="amount"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter diamond amount"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            min="1"
            required
          />
        </div>
        
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
          disabled={isLoading || isPending}
        >
          {isLoading || isPending ? 'Processing...' : 'Recharge Now'}
        </button>
      </form>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>• 1 diamond = 1 TWD</p>
        <p>• Recharge is credited immediately.</p>
        <p>• If payment succeeds but diamonds are not received, please contact support.</p>
      </div>
    </div>
  );
}
