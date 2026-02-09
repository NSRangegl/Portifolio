export default function ProjectCardSkeleton() {
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse">
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="space-y-2 mb-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-14"></div>
                    </div>

                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
                <div className="ml-4 h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
        </div>
    );
}
