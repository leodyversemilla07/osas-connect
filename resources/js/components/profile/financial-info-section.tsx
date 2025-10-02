import { InputWithLabel } from '@/components/input-with-label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { ProfileSectionProps } from '@/types/profile';
import { Calculator, Coins, CreditCard, TrendingUp } from 'lucide-react';
import React, { useMemo } from 'react';

/**
 * Financial Information Section Component
 * Handles comprehensive financial data including income and expenses
 */
export const FinancialInfoSection = React.memo<Pick<ProfileSectionProps, 'data' | 'errors' | 'updateField'>>(({ data, errors, updateField }) => {
    // Calculate totals automatically
    const totals = useMemo(() => {
        const incomeFields = [
            'combined_annual_pay_parents',
            'combined_annual_pay_siblings',
            'income_from_business',
            'income_from_land_rentals',
            'income_from_building_rentals',
            'retirement_benefits_pension',
            'commissions',
            'support_from_relatives',
            'bank_deposits',
            'other_income_amount',
        ];

        const monthlyExpenseFields = [
            'house_rental',
            'food_grocery',
            'school_bus_payment',
            'transportation_expense',
            'education_plan_premiums',
            'insurance_policy_premiums',
            'health_insurance_premium',
            'sss_gsis_pagibig_loans',
            'clothing_expense',
            'utilities_expense',
            'communication_expense',
            'medicine_expense',
            'doctor_expense',
            'hospital_expense',
            'recreation_expense',
        ];

        const annualExpenseFields = ['school_tuition_fee', 'withholding_tax', 'sss_gsis_pagibig_contribution'];

        const totalIncome = incomeFields.reduce((sum, field) => {
            return sum + (Number(data[field as keyof typeof data]) || 0);
        }, 0);

        const totalMonthlyExpenses = monthlyExpenseFields.reduce((sum, field) => {
            return sum + (Number(data[field as keyof typeof data]) || 0);
        }, 0);

        const totalAnnualExpenses = annualExpenseFields.reduce((sum, field) => {
            return sum + (Number(data[field as keyof typeof data]) || 0);
        }, 0);

        const annualizedMonthly = totalMonthlyExpenses * 12;
        const grandTotalExpenses = annualizedMonthly + totalAnnualExpenses;

        return {
            totalIncome,
            totalMonthlyExpenses,
            totalAnnualExpenses,
            annualizedMonthly,
            grandTotalExpenses,
            netIncome: totalIncome - grandTotalExpenses,
        };
    }, [data]);

    // Update calculated fields when totals change
    React.useEffect(() => {
        if (totals.totalIncome !== Number(data.total_annual_income)) {
            updateField('total_annual_income', totals.totalIncome);
        }
        if (totals.totalMonthlyExpenses !== Number(data.total_monthly_expenses)) {
            updateField('total_monthly_expenses', totals.totalMonthlyExpenses);
        }
        if (totals.annualizedMonthly !== Number(data.annualized_monthly_expenses)) {
            updateField('annualized_monthly_expenses', totals.annualizedMonthly);
        }
        if (totals.totalAnnualExpenses !== Number(data.subtotal_annual_expenses)) {
            updateField('subtotal_annual_expenses', totals.totalAnnualExpenses);
        }
        if (totals.grandTotalExpenses !== Number(data.total_annual_expenses)) {
            updateField('total_annual_expenses', totals.grandTotalExpenses);
        }
    }, [totals, data, updateField]);

    return (
        <Card data-testid="financial-info-section">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Coins className="text-primary h-5 w-5" />
                    <CardTitle>Financial Information</CardTitle>
                </div>
                <CardDescription>Comprehensive income and expense details for financial assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Annual Income Section */}
                <div className="space-y-4">
                    {' '}
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <h3 className="text-lg font-semibold">Annual Income Sources</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputWithLabel
                            id="combined_annual_pay_parents"
                            label="Combined Annual Pay (Parents)"
                            type="number"
                            value={data.combined_annual_pay_parents !== undefined ? String(data.combined_annual_pay_parents) : ''}
                            onChange={(value) => updateField('combined_annual_pay_parents', value === '' ? undefined : Number(value))}
                            error={errors?.combined_annual_pay_parents}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="combined_annual_pay_siblings"
                            label="Combined Annual Pay (Siblings)"
                            type="number"
                            value={data.combined_annual_pay_siblings !== undefined ? String(data.combined_annual_pay_siblings) : ''}
                            onChange={(value) => updateField('combined_annual_pay_siblings', value === '' ? undefined : Number(value))}
                            error={errors?.combined_annual_pay_siblings}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="income_from_business"
                            label="Income from Business"
                            type="number"
                            value={data.income_from_business !== undefined ? String(data.income_from_business) : ''}
                            onChange={(value) => updateField('income_from_business', value === '' ? undefined : Number(value))}
                            error={errors?.income_from_business}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="income_from_land_rentals"
                            label="Income from Land Rentals"
                            type="number"
                            value={data.income_from_land_rentals !== undefined ? String(data.income_from_land_rentals) : ''}
                            onChange={(value) => updateField('income_from_land_rentals', value === '' ? undefined : Number(value))}
                            error={errors?.income_from_land_rentals}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="income_from_building_rentals"
                            label="Income from Building Rentals"
                            type="number"
                            value={data.income_from_building_rentals !== undefined ? String(data.income_from_building_rentals) : ''}
                            onChange={(value) => updateField('income_from_building_rentals', value === '' ? undefined : Number(value))}
                            error={errors?.income_from_building_rentals}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="retirement_benefits_pension"
                            label="Retirement Benefits/Pension"
                            type="number"
                            value={data.retirement_benefits_pension !== undefined ? String(data.retirement_benefits_pension) : ''}
                            onChange={(value) => updateField('retirement_benefits_pension', value === '' ? undefined : Number(value))}
                            error={errors?.retirement_benefits_pension}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="commissions"
                            label="Commissions"
                            type="number"
                            value={data.commissions !== undefined ? String(data.commissions) : ''}
                            onChange={(value) => updateField('commissions', value === '' ? undefined : Number(value))}
                            error={errors?.commissions}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="support_from_relatives"
                            label="Support from Relatives"
                            type="number"
                            value={data.support_from_relatives !== undefined ? String(data.support_from_relatives) : ''}
                            onChange={(value) => updateField('support_from_relatives', value === '' ? undefined : Number(value))}
                            error={errors?.support_from_relatives}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="bank_deposits"
                            label="Bank Deposits Interest"
                            type="number"
                            value={data.bank_deposits !== undefined ? String(data.bank_deposits) : ''}
                            onChange={(value) => updateField('bank_deposits', value === '' ? undefined : Number(value))}
                            error={errors?.bank_deposits}
                            placeholder="0.00"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputWithLabel
                            id="other_income_description"
                            label="Other Income Description"
                            type="text"
                            value={data.other_income_description || ''}
                            onChange={(value) => updateField('other_income_description', value)}
                            error={errors?.other_income_description}
                            placeholder="Describe other income sources"
                        />

                        <InputWithLabel
                            id="other_income_amount"
                            label="Other Income Amount"
                            type="number"
                            value={data.other_income_amount !== undefined ? String(data.other_income_amount) : ''}
                            onChange={(value) => updateField('other_income_amount', value === '' ? undefined : Number(value))}
                            error={errors?.other_income_amount}
                            placeholder="0.00"
                        />
                    </div>{' '}
                    <div className="rounded-lg border border-green-200 bg-green-100 p-4 text-green-800 dark:border-green-800 dark:bg-green-900/50 dark:text-green-300">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Total Annual Income:</span>
                            <span className="text-xl font-bold">₱{totals.totalIncome.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Monthly Expenses Section */}
                <div className="space-y-4">
                    {' '}
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold">Monthly Expenses</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputWithLabel
                            id="house_rental"
                            label="House Rental"
                            type="number"
                            value={data.house_rental !== undefined ? String(data.house_rental) : ''}
                            onChange={(value) => updateField('house_rental', value === '' ? undefined : Number(value))}
                            error={errors?.house_rental}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="food_grocery"
                            label="Food/Grocery"
                            type="number"
                            value={data.food_grocery !== undefined ? String(data.food_grocery) : ''}
                            onChange={(value) => updateField('food_grocery', value === '' ? undefined : Number(value))}
                            error={errors?.food_grocery}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="school_bus_payment"
                            label="School Bus Payment"
                            type="number"
                            value={data.school_bus_payment !== undefined ? String(data.school_bus_payment) : ''}
                            onChange={(value) => updateField('school_bus_payment', value === '' ? undefined : Number(value))}
                            error={errors?.school_bus_payment}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="transportation_expense"
                            label="Transportation Expense"
                            type="number"
                            value={data.transportation_expense !== undefined ? String(data.transportation_expense) : ''}
                            onChange={(value) => updateField('transportation_expense', value === '' ? undefined : Number(value))}
                            error={errors?.transportation_expense}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="education_plan_premiums"
                            label="Education Plan Premiums"
                            type="number"
                            value={data.education_plan_premiums !== undefined ? String(data.education_plan_premiums) : ''}
                            onChange={(value) => updateField('education_plan_premiums', value === '' ? undefined : Number(value))}
                            error={errors?.education_plan_premiums}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="insurance_policy_premiums"
                            label="Insurance Policy Premiums"
                            type="number"
                            value={data.insurance_policy_premiums !== undefined ? String(data.insurance_policy_premiums) : ''}
                            onChange={(value) => updateField('insurance_policy_premiums', value === '' ? undefined : Number(value))}
                            error={errors?.insurance_policy_premiums}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="health_insurance_premium"
                            label="Health Insurance Premium"
                            type="number"
                            value={data.health_insurance_premium !== undefined ? String(data.health_insurance_premium) : ''}
                            onChange={(value) => updateField('health_insurance_premium', value === '' ? undefined : Number(value))}
                            error={errors?.health_insurance_premium}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="sss_gsis_pagibig_loans"
                            label="SSS/GSIS/Pag-IBIG Loans"
                            type="number"
                            value={data.sss_gsis_pagibig_loans !== undefined ? String(data.sss_gsis_pagibig_loans) : ''}
                            onChange={(value) => updateField('sss_gsis_pagibig_loans', value === '' ? undefined : Number(value))}
                            error={errors?.sss_gsis_pagibig_loans}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="clothing_expense"
                            label="Clothing Expense"
                            type="number"
                            value={data.clothing_expense !== undefined ? String(data.clothing_expense) : ''}
                            onChange={(value) => updateField('clothing_expense', value === '' ? undefined : Number(value))}
                            error={errors?.clothing_expense}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="utilities_expense"
                            label="Utilities Expense"
                            type="number"
                            value={data.utilities_expense !== undefined ? String(data.utilities_expense) : ''}
                            onChange={(value) => updateField('utilities_expense', value === '' ? undefined : Number(value))}
                            error={errors?.utilities_expense}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="communication_expense"
                            label="Communication Expense"
                            type="number"
                            value={data.communication_expense !== undefined ? String(data.communication_expense) : ''}
                            onChange={(value) => updateField('communication_expense', value === '' ? undefined : Number(value))}
                            error={errors?.communication_expense}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="medicine_expense"
                            label="Medicine Expense"
                            type="number"
                            value={data.medicine_expense !== undefined ? String(data.medicine_expense) : ''}
                            onChange={(value) => updateField('medicine_expense', value === '' ? undefined : Number(value))}
                            error={errors?.medicine_expense}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="doctor_expense"
                            label="Doctor Expense"
                            type="number"
                            value={data.doctor_expense !== undefined ? String(data.doctor_expense) : ''}
                            onChange={(value) => updateField('doctor_expense', value === '' ? undefined : Number(value))}
                            error={errors?.doctor_expense}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="hospital_expense"
                            label="Hospital Expense"
                            type="number"
                            value={data.hospital_expense !== undefined ? String(data.hospital_expense) : ''}
                            onChange={(value) => updateField('hospital_expense', value === '' ? undefined : Number(value))}
                            error={errors?.hospital_expense}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="recreation_expense"
                            label="Recreation Expense"
                            type="number"
                            value={data.recreation_expense !== undefined ? String(data.recreation_expense) : ''}
                            onChange={(value) => updateField('recreation_expense', value === '' ? undefined : Number(value))}
                            error={errors?.recreation_expense}
                            placeholder="0.00"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputWithLabel
                            id="car_loan_details"
                            label="Car Loan Details"
                            type="text"
                            value={data.car_loan_details || ''}
                            onChange={(value) => updateField('car_loan_details', value)}
                            error={errors?.car_loan_details}
                            placeholder="Describe car loan details"
                        />

                        <InputWithLabel
                            id="other_loan_details"
                            label="Other Loan Details"
                            type="text"
                            value={data.other_loan_details || ''}
                            onChange={(value) => updateField('other_loan_details', value)}
                            error={errors?.other_loan_details}
                            placeholder="Describe other loan details"
                        />

                        <InputWithLabel
                            id="helper_details"
                            label="Helper Details"
                            type="text"
                            value={data.helper_details || ''}
                            onChange={(value) => updateField('helper_details', value)}
                            error={errors?.helper_details}
                            placeholder="Helper salary and details"
                        />

                        <InputWithLabel
                            id="driver_details"
                            label="Driver Details"
                            type="text"
                            value={data.driver_details || ''}
                            onChange={(value) => updateField('driver_details', value)}
                            error={errors?.driver_details}
                            placeholder="Driver salary and details"
                        />
                    </div>
                    <InputWithLabel
                        id="other_monthly_expense_details"
                        label="Other Monthly Expense Details"
                        type="text"
                        value={data.other_monthly_expense_details || ''}
                        onChange={(value) => updateField('other_monthly_expense_details', value)}
                        error={errors?.other_monthly_expense_details}
                        placeholder="Describe other monthly expenses"
                    />{' '}
                    <div className="rounded-lg border border-blue-200 bg-blue-100 p-4 text-blue-800 dark:border-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Total Monthly Expenses:</span>
                            <span className="text-xl font-bold">
                                ₱{totals.totalMonthlyExpenses.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm opacity-80">Annualized (x12):</span>
                            <span className="font-semibold">₱{totals.annualizedMonthly.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Annual Expenses Section */}
                <div className="space-y-4">
                    {' '}
                    <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <h3 className="text-lg font-semibold">Annual Expenses</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputWithLabel
                            id="school_tuition_fee"
                            label="School Tuition Fee"
                            type="number"
                            value={data.school_tuition_fee !== undefined ? String(data.school_tuition_fee) : ''}
                            onChange={(value) => updateField('school_tuition_fee', value === '' ? undefined : Number(value))}
                            error={errors?.school_tuition_fee}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="withholding_tax"
                            label="Withholding Tax"
                            type="number"
                            value={data.withholding_tax !== undefined ? String(data.withholding_tax) : ''}
                            onChange={(value) => updateField('withholding_tax', value === '' ? undefined : Number(value))}
                            error={errors?.withholding_tax}
                            placeholder="0.00"
                        />

                        <InputWithLabel
                            id="sss_gsis_pagibig_contribution"
                            label="SSS/GSIS/Pag-IBIG Contribution"
                            type="number"
                            value={data.sss_gsis_pagibig_contribution !== undefined ? String(data.sss_gsis_pagibig_contribution) : ''}
                            onChange={(value) => updateField('sss_gsis_pagibig_contribution', value === '' ? undefined : Number(value))}
                            error={errors?.sss_gsis_pagibig_contribution}
                            placeholder="0.00"
                        />
                    </div>
                    <InputWithLabel
                        id="other_annual_expense_details"
                        label="Other Annual Expense Details"
                        type="text"
                        value={data.other_annual_expense_details || ''}
                        onChange={(value) => updateField('other_annual_expense_details', value)}
                        error={errors?.other_annual_expense_details}
                        placeholder="Describe other annual expenses"
                    />{' '}
                    <div className="rounded-lg border border-purple-200 bg-purple-100 p-4 text-purple-800 dark:border-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Subtotal Annual Expenses:</span>
                            <span className="text-xl font-bold">
                                ₱{totals.totalAnnualExpenses.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Financial Summary */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Financial Summary</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="bg-muted rounded-lg border p-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground text-sm">Total Annual Income:</span>
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                        ₱{totals.totalIncome.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground text-sm">Annualized Monthly Expenses:</span>
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                                        ₱{totals.annualizedMonthly.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground text-sm">Annual Expenses:</span>
                                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                                        ₱{totals.totalAnnualExpenses.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-secondary text-secondary-foreground rounded-lg border p-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm opacity-80">Total Annual Expenses:</span>
                                    <span className="font-semibold text-red-600 dark:text-red-400">
                                        ₱{totals.grandTotalExpenses.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="border-border flex justify-between border-t pt-2">
                                    <span className="font-semibold">Net Annual Income:</span>
                                    <span
                                        className={`text-xl font-bold ${totals.netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                                    >
                                        ₱{totals.netIncome.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {totals.netIncome < 0 && (
                        <div className="rounded-lg border border-red-200 bg-red-100 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/50 dark:text-red-300">
                            <p className="text-sm">
                                <strong>Notice:</strong> Your expenses exceed your income. Please review your financial information to ensure
                                accuracy, or consider providing additional documentation for income sources.
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
});

FinancialInfoSection.displayName = 'FinancialInfoSection';
