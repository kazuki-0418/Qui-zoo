type AnswerPushButtonProps = {
  index: number;
  text: string;
  onClick: () => void;
  disabled: boolean;
  isSelected: boolean;
  showResults: boolean;
  isCorrect: boolean;
  distributionCount?: number;
};

const colorKeys = ["red", "orange", "blue", "green"];

const bgColorMap: Record<string, string> = {
  red: "bg-red-600",
  orange: "bg-yellow-400",
  blue: "bg-blue-600",
  green: "bg-green-600",
  correct: "bg-green-600",
  wrong: "bg-red-600",
};

const shadowColorMap: Record<string, string> = {
  red: "#b91c1c",
  orange: "#ca8a04",
  blue: "#1e40af",
  green: "#145a2e",
  correct: "#145a2e",
  wrong: "#b91c1c",
};

export function AnswerPushButton({
  index,
  text,
  onClick,
  disabled,
  isSelected,
  showResults,
  isCorrect,
  distributionCount,
}: AnswerPushButtonProps) {
  const selectedColor = colorKeys[index];
  const getColorClass = (selectedColor: string) => {
    if (showResults) {
      return isCorrect ? bgColorMap.correct : bgColorMap.wrong;
    }
    return bgColorMap[selectedColor];
  };

  const getShadowColor = (selectedColor: string) => {
    if (showResults) {
      return isCorrect ? shadowColorMap.correct : shadowColorMap.wrong;
    }
    return shadowColorMap[selectedColor];
  };

  const baseClass = [
    "h-24 w-full flex items-center justify-center text-white font-semibold text-base sm:text-lg rounded-lg p-3 transition duration-100 ease-in-out",
    "relative",
  ].join(" ");
  const divClass = `h-24 relative rounded-lg ${disabled && !showResults ? "opacity-80" : ""}`;
  const buttonClass = `${baseClass} ${getColorClass(selectedColor)} ${isSelected ? "translate-y-[4px]" : ""}`;

  return (
    <div className="w-full h-24 relative">
      <div
        className={divClass}
        style={{
          boxShadow: `0 4px 0 0 ${getShadowColor(selectedColor)}`,
        }}
      >
        <button
          onClick={onClick}
          className={`${buttonClass} relative overflow-hidden flex items-center justify-center text-center px-4`}
          disabled={disabled}
          style={{ cursor: disabled ? "not-allowed" : "" }}
        >
          {/* SVG背景 */}
          {showResults && (
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
              fill="white"
            >
              <title>Result</title>
              {isCorrect ? (
                <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="10" fill="none" />
              ) : (
                <>
                  <line x1="20" y1="20" x2="80" y2="80" stroke="white" strokeWidth="10" />
                  <line x1="80" y1="20" x2="20" y2="80" stroke="white" strokeWidth="10" />
                </>
              )}
            </svg>
          )}

          <span className="relative z-10 text-base sm:text-lg font-semibold text-white text-center">
            {text}
          </span>

          {showResults && (
            <span className="absolute bottom-1 left-0 w-full text-center text-sm text-white opacity-80 z-10">
              {distributionCount} people
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default AnswerPushButton;
