export const VALIDATION = {
    EMAIL: {
        DOMAIN: '@minsu.edu.ph',
        MAX_LENGTH: 255
    },
    MOBILE_NUMBER: {
        LENGTH: 10,
        PREFIX: '+63'
    },
    PASSWORD: {
        MIN_LENGTH: 8,
        SPECIAL_CHARS: '!@#$%^&*'
    },
    STUDENT_ID: {
        PATTERN: /^MBC\d{4}-\d{4}$/,
        FORMAT: 'MBCyyyy-nnnn'
    }
};