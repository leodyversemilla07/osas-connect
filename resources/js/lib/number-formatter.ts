/**
 * Enhanced utility functions for number handling in forms
 */
export class NumberFormatter {
    private static readonly MAX_VALUE = 999999999999;
    private static readonly MIN_VALUE = 0;

    /**
     * Format a number for display in input fields
     */
    static formatForInput(value: number | null | undefined): string {
        if (value === null || value === undefined || isNaN(value)) {
            return '';
        }

        const clampedValue = Math.max(this.MIN_VALUE, Math.min(this.MAX_VALUE, value));

        return clampedValue.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
            useGrouping: false,
        });
    }

    /**
     * Parse input string to number with validation
     */
    static parseInput(value: string): number {
        if (!value || value.trim() === '') return 0;

        const cleanValue = value.replace(/[^\d.-]/g, '');
        const parsed = parseFloat(cleanValue);

        if (isNaN(parsed)) return 0;

        return Math.max(this.MIN_VALUE, Math.min(this.MAX_VALUE, Math.round(parsed * 100) / 100));
    }

    /**
     * Format currency for display
     */
    static formatCurrency(value: number | null | undefined): string {
        if (value === null || value === undefined || isNaN(value)) {
            return '₱0.00';
        }

        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(value);
    }

    /**
     * Format a number for display in form fields (alias for formatForInput)
     */
    static formatForDisplay(value: number | null | undefined): string {
        return this.formatForInput(value);
    }

    /**
     * Parse input from form fields (alias for parseInput)
     */
    static parseFromInput(value: string): number {
        return this.parseInput(value);
    }
}
