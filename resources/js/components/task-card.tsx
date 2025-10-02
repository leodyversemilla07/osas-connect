interface TaskProps {
    task: {
        id: number;
        title: string;
        dueDate: string;
        priority: string;
    };
}

export default function TaskCard({ task }: TaskProps) {
    const priorityClasses = {
        high: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
        medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
        low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    };

    // Calculate days remaining
    const currentDate = new Date();
    const dueDate = new Date(task.dueDate);
    const daysRemaining = Math.ceil((dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

    let dateStatusClass = 'text-gray-600 dark:text-gray-400';
    if (daysRemaining < 0) {
        dateStatusClass = 'text-rose-600 dark:text-rose-400';
    } else if (daysRemaining <= 3) {
        dateStatusClass = 'text-amber-600 dark:text-amber-400';
    }

    return (
        <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-start justify-between">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{task.title}</h4>
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        priorityClasses[task.priority as keyof typeof priorityClasses]
                    }`}
                >
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
            </div>

            <div className="mt-2 flex items-center">
                <svg
                    className="mr-1 h-4 w-4 text-gray-400 dark:text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
                <span className={`text-sm ${dateStatusClass}`}>
                    Due: {task.dueDate}
                    {daysRemaining < 0
                        ? ' (Overdue)'
                        : daysRemaining === 0
                          ? ' (Today)'
                          : daysRemaining === 1
                            ? ' (Tomorrow)'
                            : ` (${daysRemaining} days left)`}
                </span>
            </div>

            <div className="mt-3 flex justify-end space-x-2">
                <button className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">Details</button>
                <button className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                    Mark Complete
                </button>
            </div>
        </div>
    );
}
