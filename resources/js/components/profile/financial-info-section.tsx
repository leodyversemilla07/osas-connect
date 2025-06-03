import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Coins, TrendingUp, CreditCard, Calculator } from 'lucide-react';
import type { ProfileSectionProps } from '@/types/profile';
import { NumberField, TextField } from '@/components/profile/form-fields';


/**
 * Financial Information Section Component
 * Handles comprehensive financial data including income and expenses
 */
export const FinancialInfoSection = React.memo<Pick<ProfileSectionProps, 'data' | 'errors' | 'updateField'>>(({
    data,
    errors,
    updateField
}) => {
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
            'other_income_amount'
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
            'recreation_expense'
        ];

        const annualExpenseFields = [
            'school_tuition_fee',
            'withholding_tax',
            'sss_gsis_pagibig_contribution'
        ];

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
            netIncome: totalIncome - grandTotalExpenses
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
                    <Coins className="h-5 w-5 text-primary" />
                    <CardTitle>Financial Information</CardTitle>
                </div>
                <CardDescription>
                    Comprehensive income and expense details for financial assessment
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Annual Income Section */}
                <div className="space-y-4">                    <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <h3 className="text-lg font-semibold">Annual Income Sources</h3>
                </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <NumberField
                            id="combined_annual_pay_parents"
                            label="Combined Annual Pay (Parents)"
                            value={data.combined_annual_pay_parents}
                            onChange={(value) => updateField('combined_annual_pay_parents', value)}
                            error={errors?.combined_annual_pay_parents}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="combined_annual_pay_siblings"
                            label="Combined Annual Pay (Siblings)"
                            value={data.combined_annual_pay_siblings}
                            onChange={(value) => updateField('combined_annual_pay_siblings', value)}
                            error={errors?.combined_annual_pay_siblings}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="income_from_business"
                            label="Income from Business"
                            value={data.income_from_business}
                            onChange={(value) => updateField('income_from_business', value)}
                            error={errors?.income_from_business}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="income_from_land_rentals"
                            label="Income from Land Rentals"
                            value={data.income_from_land_rentals}
                            onChange={(value) => updateField('income_from_land_rentals', value)}
                            error={errors?.income_from_land_rentals}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="income_from_building_rentals"
                            label="Income from Building Rentals"
                            value={data.income_from_building_rentals}
                            onChange={(value) => updateField('income_from_building_rentals', value)}
                            error={errors?.income_from_building_rentals}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="retirement_benefits_pension"
                            label="Retirement Benefits/Pension"
                            value={data.retirement_benefits_pension}
                            onChange={(value) => updateField('retirement_benefits_pension', value)}
                            error={errors?.retirement_benefits_pension}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="commissions"
                            label="Commissions"
                            value={data.commissions}
                            onChange={(value) => updateField('commissions', value)}
                            error={errors?.commissions}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="support_from_relatives"
                            label="Support from Relatives"
                            value={data.support_from_relatives}
                            onChange={(value) => updateField('support_from_relatives', value)}
                            error={errors?.support_from_relatives}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="bank_deposits"
                            label="Bank Deposits Interest"
                            value={data.bank_deposits}
                            onChange={(value) => updateField('bank_deposits', value)}
                            error={errors?.bank_deposits}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            id="other_income_description"
                            label="Other Income Description"
                            value={data.other_income_description || ''}
                            onChange={(value) => updateField('other_income_description', value)}
                            error={errors?.other_income_description}
                            placeholder="Describe other income sources"
                        />

                        <NumberField
                            id="other_income_amount"
                            label="Other Income Amount"
                            value={data.other_income_amount}
                            onChange={(value) => updateField('other_income_amount', value)}
                            error={errors?.other_income_amount}
                            placeholder="0.00"
                        />
                    </div>                    <div className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Total Annual Income:</span>
                            <span className="text-xl font-bold">
                                ₱{totals.totalIncome.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Monthly Expenses Section */}
                <div className="space-y-4">                    <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold">Monthly Expenses</h3>
                </div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <NumberField
                            id="house_rental"
                            label="House Rental"
                            value={data.house_rental}
                            onChange={(value) => updateField('house_rental', value)}
                            error={errors?.house_rental}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="food_grocery"
                            label="Food/Grocery"
                            value={data.food_grocery}
                            onChange={(value) => updateField('food_grocery', value)}
                            error={errors?.food_grocery}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="school_bus_payment"
                            label="School Bus Payment"
                            value={data.school_bus_payment}
                            onChange={(value) => updateField('school_bus_payment', value)}
                            error={errors?.school_bus_payment}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="transportation_expense"
                            label="Transportation Expense"
                            value={data.transportation_expense}
                            onChange={(value) => updateField('transportation_expense', value)}
                            error={errors?.transportation_expense}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="education_plan_premiums"
                            label="Education Plan Premiums"
                            value={data.education_plan_premiums}
                            onChange={(value) => updateField('education_plan_premiums', value)}
                            error={errors?.education_plan_premiums}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="insurance_policy_premiums"
                            label="Insurance Policy Premiums"
                            value={data.insurance_policy_premiums}
                            onChange={(value) => updateField('insurance_policy_premiums', value)}
                            error={errors?.insurance_policy_premiums}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="health_insurance_premium"
                            label="Health Insurance Premium"
                            value={data.health_insurance_premium}
                            onChange={(value) => updateField('health_insurance_premium', value)}
                            error={errors?.health_insurance_premium}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="sss_gsis_pagibig_loans"
                            label="SSS/GSIS/Pag-IBIG Loans"
                            value={data.sss_gsis_pagibig_loans}
                            onChange={(value) => updateField('sss_gsis_pagibig_loans', value)}
                            error={errors?.sss_gsis_pagibig_loans}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="clothing_expense"
                            label="Clothing Expense"
                            value={data.clothing_expense}
                            onChange={(value) => updateField('clothing_expense', value)}
                            error={errors?.clothing_expense}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="utilities_expense"
                            label="Utilities Expense"
                            value={data.utilities_expense}
                            onChange={(value) => updateField('utilities_expense', value)}
                            error={errors?.utilities_expense}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="communication_expense"
                            label="Communication Expense"
                            value={data.communication_expense}
                            onChange={(value) => updateField('communication_expense', value)}
                            error={errors?.communication_expense}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="medicine_expense"
                            label="Medicine Expense"
                            value={data.medicine_expense}
                            onChange={(value) => updateField('medicine_expense', value)}
                            error={errors?.medicine_expense}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="doctor_expense"
                            label="Doctor Expense"
                            value={data.doctor_expense}
                            onChange={(value) => updateField('doctor_expense', value)}
                            error={errors?.doctor_expense}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="hospital_expense"
                            label="Hospital Expense"
                            value={data.hospital_expense}
                            onChange={(value) => updateField('hospital_expense', value)}
                            error={errors?.hospital_expense}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="recreation_expense"
                            label="Recreation Expense"
                            value={data.recreation_expense}
                            onChange={(value) => updateField('recreation_expense', value)}
                            error={errors?.recreation_expense}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            id="car_loan_details"
                            label="Car Loan Details"
                            value={data.car_loan_details || ''}
                            onChange={(value) => updateField('car_loan_details', value)}
                            error={errors?.car_loan_details}
                            placeholder="Describe car loan details"
                        />

                        <TextField
                            id="other_loan_details"
                            label="Other Loan Details"
                            value={data.other_loan_details || ''}
                            onChange={(value) => updateField('other_loan_details', value)}
                            error={errors?.other_loan_details}
                            placeholder="Describe other loan details"
                        />

                        <TextField
                            id="helper_details"
                            label="Helper Details"
                            value={data.helper_details || ''}
                            onChange={(value) => updateField('helper_details', value)}
                            error={errors?.helper_details}
                            placeholder="Helper salary and details"
                        />

                        <TextField
                            id="driver_details"
                            label="Driver Details"
                            value={data.driver_details || ''}
                            onChange={(value) => updateField('driver_details', value)}
                            error={errors?.driver_details}
                            placeholder="Driver salary and details"
                        />
                    </div>

                    <TextField
                        id="other_monthly_expense_details"
                        label="Other Monthly Expense Details"
                        value={data.other_monthly_expense_details || ''}
                        onChange={(value) => updateField('other_monthly_expense_details', value)}
                        error={errors?.other_monthly_expense_details}
                        placeholder="Describe other monthly expenses"
                    />                    <div className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Total Monthly Expenses:</span>
                            <span className="text-xl font-bold">
                                ₱{totals.totalMonthlyExpenses.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-sm opacity-80">Annualized (x12):</span>
                            <span className="font-semibold">
                                ₱{totals.annualizedMonthly.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Annual Expenses Section */}
                <div className="space-y-4">                    <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-lg font-semibold">Annual Expenses</h3>
                </div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <NumberField
                            id="school_tuition_fee"
                            label="School Tuition Fee"
                            value={data.school_tuition_fee}
                            onChange={(value) => updateField('school_tuition_fee', value)}
                            error={errors?.school_tuition_fee}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="withholding_tax"
                            label="Withholding Tax"
                            value={data.withholding_tax}
                            onChange={(value) => updateField('withholding_tax', value)}
                            error={errors?.withholding_tax}
                            placeholder="0.00"
                        />

                        <NumberField
                            id="sss_gsis_pagibig_contribution"
                            label="SSS/GSIS/Pag-IBIG Contribution"
                            value={data.sss_gsis_pagibig_contribution}
                            onChange={(value) => updateField('sss_gsis_pagibig_contribution', value)}
                            error={errors?.sss_gsis_pagibig_contribution}
                            placeholder="0.00"
                        />
                    </div>

                    <TextField
                        id="other_annual_expense_details"
                        label="Other Annual Expense Details"
                        value={data.other_annual_expense_details || ''}
                        onChange={(value) => updateField('other_annual_expense_details', value)}
                        error={errors?.other_annual_expense_details}
                        placeholder="Describe other annual expenses"
                    />                    <div className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted p-4 rounded-lg border">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Total Annual Income:</span>
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                        ₱{totals.totalIncome.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Annualized Monthly Expenses:</span>
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                                        ₱{totals.annualizedMonthly.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Annual Expenses:</span>
                                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                                        ₱{totals.totalAnnualExpenses.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-secondary text-secondary-foreground p-4 rounded-lg border">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm opacity-80">Total Annual Expenses:</span>
                                    <span className="font-semibold text-red-600 dark:text-red-400">
                                        ₱{totals.grandTotalExpenses.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-border pt-2">
                                    <span className="font-semibold">Net Annual Income:</span>
                                    <span className={`text-xl font-bold ${totals.netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        ₱{totals.netIncome.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {totals.netIncome < 0 && (
                        <div className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <p className="text-sm">
                                <strong>Notice:</strong> Your expenses exceed your income. Please review your financial information
                                to ensure accuracy, or consider providing additional documentation for income sources.
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
});

FinancialInfoSection.displayName = 'FinancialInfoSection';