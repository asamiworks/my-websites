import { Metadata } from 'next';
import { PlanCard } from '@/components/payment/PlanCard';
import { PlanComparison } from '@/components/payment/PlanComparison';
import { PLANS } from '@/data/plans';

export const metadata: Metadata = {
  title: '料金プラン | i-manabee',
  description: 'まなびーの料金プランをご確認ください',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            まなびーの料金プラン
          </h1>
          <p className="text-xl text-gray-600">
            お子様の学びに合わせて、最適なプランをお選びください
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {Object.values(PLANS).map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Comparison Table */}
        <PlanComparison />

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            よくある質問
          </h2>

          <div className="space-y-4">
            <details className="bg-white rounded-lg shadow-md p-6">
              <summary className="font-medium text-gray-800 cursor-pointer">
                いつでもプラン変更・キャンセルできますか？
              </summary>
              <p className="mt-4 text-gray-600">
                はい、いつでも変更・キャンセルが可能です。プラン変更は即座に反映され、
                キャンセルは次回更新日まで継続してご利用いただけます。
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-md p-6">
              <summary className="font-medium text-gray-800 cursor-pointer">
                返金はできますか？
              </summary>
              <p className="mt-4 text-gray-600">
                初回登録から7日以内であれば、全額返金いたします。
                それ以降は日割り計算での返金は行っておりません。
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-md p-6">
              <summary className="font-medium text-gray-800 cursor-pointer">
                支払い方法は何がありますか？
              </summary>
              <p className="mt-4 text-gray-600">
                クレジットカード（Visa、Mastercard、American Express、JCB）に対応しています。
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-md p-6">
              <summary className="font-medium text-gray-800 cursor-pointer">
                無料プランから有料プランに変更した場合、すぐに機能が使えますか？
              </summary>
              <p className="mt-4 text-gray-600">
                はい、決済完了後すぐにプランの機能をご利用いただけます。
                アップグレード時は未使用期間の料金は発生しません。
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}