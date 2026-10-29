"use client";

interface QuantityStepperProps {
  value: number;
  /** Lowest value the decrease button allows; omit to always allow decreasing. */
  min?: number;
  onChange: (value: number) => void;
  decreaseLabel: string;
  increaseLabel: string;
}

export function QuantityStepper({
  value,
  min,
  onChange,
  decreaseLabel,
  increaseLabel,
}: QuantityStepperProps) {
  const button =
    "flex h-11 w-11 items-center justify-center rounded-full border border-border text-xl font-semibold active:bg-surface-muted disabled:opacity-40";
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label={decreaseLabel}
        disabled={min !== undefined && value <= min}
        onClick={() => onChange(value - 1)}
        className={button}
      >
        −
      </button>
      <span className="w-8 text-center text-lg font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label={increaseLabel}
        onClick={() => onChange(value + 1)}
        className={button}
      >
        +
      </button>
    </div>
  );
}
