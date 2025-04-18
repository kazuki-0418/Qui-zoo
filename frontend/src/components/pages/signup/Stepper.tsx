const steps = ["Account Type", "Personal Info", "Account Info", "Confirmation"];
type StepperProps = {
  step: number;
};

export function Stepper({ step }: StepperProps) {
  return (
    <ol className="flex justify-between items-center w-full px-4">
      {steps.map((label, index) => {
        const isCompleted = index < step - 1;
        const isActive = index === step - 1;
        const isLast = index === steps.length - 1;

        return (
          <li key={label} className="flex-1 relative flex flex-col items-center text-center">
            <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">{label}</div>
            <div
              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-4 
            ${
              isCompleted
                ? "bg-green-200 border-white dark:bg-green-900"
                : isActive
                  ? "bg-blue-300 border-white dark:bg-blue-900"
                  : "bg-gray-200 border-white dark:bg-gray-700"
            }
          `}
            >
              {isCompleted ? (
                <svg
                  className="w-4 h-4 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <title>section</title>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="w-2.5 h-2.5 rounded-full" />
              )}
            </div>
            {!isLast && (
              <div className="absolute top-5 left-1/2 w-full h-1 -translate-y-1/2 z-0">
                <div
                  className={`h-full ${
                    isCompleted ? "bg-green-300 dark:bg-green-700" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  style={{ marginTop: "1.75rem", width: "100%" }}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
