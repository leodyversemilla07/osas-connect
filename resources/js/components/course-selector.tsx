import { SelectorWithLabel } from '@/components/selector-with-label';

// Add major/specialization options for relevant courses
const MAJOR_OPTIONS: Record<string, { value: string; label: string }[]> = {
    'Bachelor of Secondary Education': [
        { value: 'English', label: 'English' },
        { value: 'Mathematics', label: 'Mathematics' },
        { value: 'Science', label: 'Science' },
    ],
    'Bachelor of Science in Entrepreneurship': [{ value: 'Farm Business', label: 'Farm Business' }],
};

interface CourseSelectorProps {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    className?: string;
    majorValue?: string;
    onMajorChange?: (value: string) => void;
    majorError?: string;
}

const COURSE_OPTIONS = [
    { value: 'Bachelor of Arts in Political Science', label: 'ABPolSci - Bachelor of Arts in Political Science' },
    { value: 'Bachelor of Elementary Education', label: 'BEEd - Bachelor of Elementary Education' },
    { value: 'Bachelor of Science in Computer Engineering', label: 'BSCpE - Bachelor of Science in Computer Engineering' },
    { value: 'Bachelor of Science in Criminology', label: 'BSCrim - Bachelor of Science in Criminology' },
    { value: 'Bachelor of Science in Entrepreneurship', label: 'BSENTREP - Bachelor of Science in Entrepreneurship' },
    { value: 'Bachelor of Science in Fisheries', label: 'BSFI - Bachelor of Science in Fisheries' },
    { value: 'Bachelor of Science in Hospitality Management', label: 'BSHM - Bachelor of Science in Hospitality Management' },
    { value: 'Bachelor of Science in Information Technology', label: 'BSIT - Bachelor of Science in Information Technology' },
    { value: 'Bachelor of Secondary Education', label: 'BSEd - Bachelor of Secondary Education' },
    { value: 'Bachelor of Science in Tourism Management', label: 'BSTM - Bachelor of Science in Tourism Management' },
];

export default function CourseSelector({
    id = 'course',
    value,
    onChange,
    error,
    required = false,
    className,
    majorValue = '',
    onMajorChange,
    majorError,
}: CourseSelectorProps) {
    const showMajor = value in MAJOR_OPTIONS;
    const majorLabel = value === 'Bachelor of Secondary Education' ? 'Major' : 'Specialization';
    return (
        <div className={className}>
            <SelectorWithLabel
                id={id}
                label="Course"
                value={value}
                onChange={onChange}
                options={COURSE_OPTIONS}
                error={error}
                required={required}
                placeholder="Select course"
            />
            {showMajor && onMajorChange && (
                <SelectorWithLabel
                    id="major"
                    label={majorLabel}
                    value={majorValue}
                    onChange={onMajorChange}
                    options={MAJOR_OPTIONS[value]}
                    error={majorError}
                    required
                    placeholder={`Select your ${majorLabel.toLowerCase()}`}
                    className="mt-4"
                />
            )}
        </div>
    );
}
