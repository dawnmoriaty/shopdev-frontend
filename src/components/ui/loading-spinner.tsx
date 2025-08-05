import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner = ({ size = 24, className = "" }: LoadingSpinnerProps) => {
  return (
    <div
      className={`flex justify-center items-center w-full h-40 ${className}`}
    >
      <Loader2 size={size} className="animate-spin text-primary" />
    </div>
  );
};

export default LoadingSpinner;
