'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import styles from './CardRegistrationForm.module.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CardFormProps {
  clientId: string;
  onSuccess: () => void;
}

function CardForm({ clientId, onSuccess }: CardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Setup Intentを作成
      const response = await fetch('/api/stripe/setup-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
      });

      const { clientSecret, error: apiError } = await response.json();

      if (apiError) {
        throw new Error(apiError);
      }

      // カード情報を確認
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Setup Intentを確認（カード登録）
      const { setupIntent, error: stripeError } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (setupIntent && setupIntent.payment_method) {
        // 支払い方法を保存
        const saveResponse = await fetch('/api/stripe/save-payment-method', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientId,
            paymentMethodId: setupIntent.payment_method,
          }),
        });

        const saveData = await saveResponse.json();

        if (saveResponse.ok) {
          setSuccess(true);
          setTimeout(() => {
            onSuccess();
          }, 2000);
        } else {
          throw new Error(saveData.error || '保存に失敗しました');
        }
      }
    } catch (err: any) {
      console.error('Card registration error:', err);
      setError(err.message || 'カード登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>✓</div>
        <p>クレジットカードを登録しました！</p>
        <p className={styles.successSubtext}>今後、請求書が発行されると自動的に決済されます。</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.cardElementContainer}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
            hidePostalCode: true,
          }}
        />
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={styles.submitButton}
      >
        {loading ? '登録中...' : 'カードを登録'}
      </button>

      <p className={styles.securityNote}>
        🔒 カード情報は安全に暗号化されてStripeに保存されます
      </p>
    </form>
  );
}

export default function CardRegistrationForm({ clientId, onSuccess }: CardFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CardForm clientId={clientId} onSuccess={onSuccess} />
    </Elements>
  );
}
