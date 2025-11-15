import { BusinessSettings, BusinessType } from '@/types/invoice';

/**
 * 会計期間の情報
 */
export interface FiscalPeriod {
  startDate: Date;
  endDate: Date;
  fiscalYear: number; // 会計年度（個人：暦年、法人：期）
  label: string; // 表示用ラベル（例：「2025年度」「第5期（2024/04/01-2025/03/31）」）
}

/**
 * 事業形態と決算日に基づいて会計期間を計算
 */
export function calculateFiscalPeriod(
  businessSettings: BusinessSettings | null,
  targetYear?: number
): FiscalPeriod {
  const year = targetYear || new Date().getFullYear();

  // デフォルトは個人事業主（暦年）
  if (!businessSettings || businessSettings.businessType === 'sole_proprietorship') {
    return {
      startDate: new Date(year, 0, 1), // 1月1日
      endDate: new Date(year, 11, 31, 23, 59, 59), // 12月31日
      fiscalYear: year,
      label: `${year}年度`,
    };
  }

  // 法人の場合
  if (businessSettings.businessType === 'corporation' && businessSettings.fiscalYearEnd) {
    const [endMonth, endDay] = businessSettings.fiscalYearEnd.split('-').map(Number);

    // 決算日を基準に会計期間を計算
    // 例：決算日が3/31の場合、会計期間は4/1〜翌年3/31
    const fiscalYearEndDate = new Date(year, endMonth - 1, endDay, 23, 59, 59);
    const fiscalYearStartDate = new Date(year - 1, endMonth - 1, endDay + 1);
    fiscalYearStartDate.setHours(0, 0, 0, 0);

    // 現在の日付から、適切な会計年度を判定
    const today = new Date();
    let actualStartDate: Date;
    let actualEndDate: Date;
    let actualFiscalYear: number;

    if (today > fiscalYearEndDate) {
      // 現在が決算日を過ぎている場合、次の期
      actualStartDate = new Date(year, endMonth - 1, endDay + 1);
      actualStartDate.setHours(0, 0, 0, 0);
      actualEndDate = new Date(year + 1, endMonth - 1, endDay, 23, 59, 59);
      actualFiscalYear = year + 1;
    } else {
      // 現在が決算日前の場合、今期
      actualStartDate = fiscalYearStartDate;
      actualEndDate = fiscalYearEndDate;
      actualFiscalYear = year;
    }

    // 設立日がある場合は、それより前には遡らない
    if (businessSettings.incorporationDate) {
      const incDate = businessSettings.incorporationDate.toDate
        ? businessSettings.incorporationDate.toDate()
        : new Date(businessSettings.incorporationDate as any);
      if (actualStartDate < incDate) {
        actualStartDate = incDate;
      }
    }

    return {
      startDate: actualStartDate,
      endDate: actualEndDate,
      fiscalYear: actualFiscalYear,
      label: `第${actualFiscalYear - (businessSettings.incorporationDate ? new Date(businessSettings.incorporationDate as any).getFullYear() : year) + 1}期（${formatDate(actualStartDate)}-${formatDate(actualEndDate)}）`,
    };
  }

  // フォールバック：暦年
  return {
    startDate: new Date(year, 0, 1),
    endDate: new Date(year, 11, 31, 23, 59, 59),
    fiscalYear: year,
    label: `${year}年度`,
  };
}

/**
 * 指定された会計年度の会計期間を取得
 * @param businessSettings 事業設定
 * @param fiscalYear 会計年度（個人：暦年、法人：期末の年）
 */
export function getFiscalPeriodByYear(
  businessSettings: BusinessSettings | null,
  fiscalYear: number
): FiscalPeriod {
  // 個人事業主の場合
  if (!businessSettings || businessSettings.businessType === 'sole_proprietorship') {
    return {
      startDate: new Date(fiscalYear, 0, 1),
      endDate: new Date(fiscalYear, 11, 31, 23, 59, 59),
      fiscalYear,
      label: `${fiscalYear}年度`,
    };
  }

  // 法人の場合
  if (businessSettings.businessType === 'corporation' && businessSettings.fiscalYearEnd) {
    const [endMonth, endDay] = businessSettings.fiscalYearEnd.split('-').map(Number);

    // 会計期間: (fiscalYear - 1)年の決算日翌日 〜 fiscalYear年の決算日
    const startDate = new Date(fiscalYear - 1, endMonth - 1, endDay + 1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(fiscalYear, endMonth - 1, endDay, 23, 59, 59);

    // 設立日がある場合は、それより前には遡らない
    if (businessSettings.incorporationDate) {
      const incDate = businessSettings.incorporationDate.toDate
        ? businessSettings.incorporationDate.toDate()
        : new Date(businessSettings.incorporationDate as any);
      if (startDate < incDate) {
        startDate.setTime(incDate.getTime());
      }
    }

    const period = businessSettings.incorporationDate
      ? fiscalYear - new Date(businessSettings.incorporationDate as any).getFullYear() + 1
      : 1;

    return {
      startDate,
      endDate,
      fiscalYear,
      label: `第${period}期（${formatDate(startDate)}-${formatDate(endDate)}）`,
    };
  }

  // フォールバック
  return {
    startDate: new Date(fiscalYear, 0, 1),
    endDate: new Date(fiscalYear, 11, 31, 23, 59, 59),
    fiscalYear,
    label: `${fiscalYear}年度`,
  };
}

/**
 * 日付を YYYY/MM/DD 形式でフォーマット
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

/**
 * 利用可能な会計年度のリストを取得
 */
export function getAvailableFiscalYears(
  businessSettings: BusinessSettings | null,
  count: number = 5
): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];

  for (let i = 0; i < count; i++) {
    years.push(currentYear - i);
  }

  return years;
}

/**
 * 事業形態に応じた経費カテゴリをフィルタリング
 */
export function getAvailableExpenseCategories(
  businessType: BusinessType | undefined
): string[] {
  const allCategories = [
    'communication',
    'transportation',
    'supplies',
    'utilities',
    'rent',
    'outsourcing',
    'advertising',
    'entertainment',
    'insurance',
    'depreciation',
    'taxes',
    'professional_fees',
    'software',
    'education',
    'other',
  ];

  const corporationOnlyCategories = [
    'officer_compensation',
    'employee_salary',
    'welfare_expenses',
    'meeting_expenses',
    'statutory_welfare',
  ];

  if (businessType === 'corporation') {
    return [...allCategories, ...corporationOnlyCategories];
  }

  return allCategories;
}
