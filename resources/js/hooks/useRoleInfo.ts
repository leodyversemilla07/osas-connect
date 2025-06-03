import { useMemo } from 'react';

export type UserRole = 'student' | 'osas_staff' | 'admin';

interface UseRoleInfoReturn {
    roleIdField: string;
    roleDisplayName: string;
    isStudent: boolean;
    isStaff: boolean;
    isAdmin: boolean;
}

/**
 * Custom hook for role-related logic and utilities
 */
export function useRoleInfo(role: UserRole): UseRoleInfoReturn {
    const roleInfo = useMemo(() => {
        const roleIdField = (() => {
            switch (role) {
                case 'student': return 'student_id';
                case 'osas_staff': return 'staff_id';
                case 'admin': return 'admin_id';
                default: return 'student_id';
            }
        })();

        const roleDisplayName = (() => {
            switch (role) {
                case 'student': return 'Student ID';
                case 'osas_staff': return 'Staff ID';
                case 'admin': return 'Admin ID';
                default: return 'ID';
            }
        })();

        return {
            roleIdField,
            roleDisplayName,
            isStudent: role === 'student',
            isStaff: role === 'osas_staff',
            isAdmin: role === 'admin'
        };
    }, [role]);

    return roleInfo;
}
