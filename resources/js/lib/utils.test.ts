import { cn, formatDate } from './utils';

describe('utils', () => {
    it('merges classes with tailwind precedence', () => {
        expect(cn('px-2', 'px-4', 'text-sm')).toBe('px-4 text-sm');
    });

    it('formats dates in a readable format', () => {
        expect(formatDate('2026-01-01')).toContain('2026');
    });
});
