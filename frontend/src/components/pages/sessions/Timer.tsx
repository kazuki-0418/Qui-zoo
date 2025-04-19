import { Progress } from "flowbite-react";
import { useEffect, useRef, useState } from "react";

interface TimerProps {
  showResults: boolean;
  duration: number; // seconds
  onExpire: () => void;
  questionIndex: number;
}

export function Timer({ showResults, duration, onExpire, questionIndex }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (showResults) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }
    startTimeRef.current = performance.now();
    const animate = (now: number) => {
      if (!startTimeRef.current) return;

      const elapsed = (now - startTimeRef.current) / 1000; // seconds
      const newTimeLeft = Math.max(duration - elapsed, 0);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft > 0) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        onExpire();
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [duration, onExpire, showResults]);

  const progress = (timeLeft / duration) * 100;

  const getColor = () => {
    if (progress > 66) return "green";
    if (progress > 33) return "yellow";
    return "red";
  };

  return (
    <div className="w-full">
      <div className="flex items-between justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">Question {questionIndex + 1}</span>
        <span className="text-sm font-medium text-gray-700">{Math.ceil(timeLeft)}s</span>
      </div>
      <Progress progress={progress} color={getColor()} size="md" />
    </div>
  );
}
