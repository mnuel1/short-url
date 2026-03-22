import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from "react";
import type { UrlStats } from "../models/models";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
  className?: string;
}

export const Button = ({
  variant = "primary",
  size = "md",
  isLoading,
  children,
  className = "",
  disabled,
  ...p
}: ButtonProps) => {

  const base =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer";

  const vs: Record<ButtonVariant, string> = {
    primary: "bg-[#0D0D0D] text-[#F5F0E8] hover:bg-[#1a1a1a] border border-[#0D0D0D]",
    secondary: "bg-transparent text-[#0D0D0D] border border-[#D4CFC6] hover:border-[#0D0D0D] hover:bg-[#F5F0E8]",
    ghost: "bg-transparent text-[#6B6560] hover:text-[#0D0D0D] hover:bg-[#F0EBE3]",
    danger: "bg-transparent text-[#C0392B] border border-[#EDCFC9] hover:bg-[#FBEAE8]",
  };

  const ss: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${base} ${vs[variant]} ${ss[size]} ${className}`}
      disabled={disabled || isLoading}
      {...p}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  );
};


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

export const Input = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className = "",
  ...p
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-medium text-[#4A4540] uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9590] pointer-events-none">
            {leftIcon}
          </span>
        )}

        <input
          className={`w-full bg-white border border-[#D4CFC6] rounded-lg text-[#0D0D0D] text-sm placeholder:text-[#B0ABA5] transition-all duration-150 outline-none focus:border-[#0D0D0D] focus:ring-2 focus:ring-black/5 ${error ? "border-[#C0392B]" : ""} ${leftIcon ? "pl-9" : "pl-3.5"} ${rightIcon ? "pr-9" : "pr-3.5"} py-2.5 ${className}`}
          {...p}
        />

        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9590] pointer-events-none">
            {rightIcon}
          </span>
        )}
      </div>

      {error && <p className="text-xs text-[#C0392B]">{error}</p>}
      {hint && !error && <p className="text-xs text-[#9B9590]">{hint}</p>}
    </div>
  );
};


/* ---------------- SPINNER ---------------- */

type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps {
  size?: SpinnerSize;
}

export const Spinner = ({ size = "md" }: SpinnerProps) => {
  const ss: Record<SpinnerSize, string> = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={`${ss[size]} border-2 border-current border-t-transparent rounded-full animate-spin opacity-60`}
    />
  );
};


/* ---------------- BADGE ---------------- */

type BadgeVariant = "default" | "success" | "info";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export const Badge = ({ label, variant = "default" }: BadgeProps) => {

  const vs: Record<BadgeVariant, string> = {
    default: "bg-[#F0EBE3] text-[#6B6560]",
    success: "bg-[#E8F5EE] text-[#1A7A4A]",
    info: "bg-[#EEF4FF] text-[#1D4ED8]",
  };

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${vs[variant]}`}>
      {label}
    </span>
  );
};


/* ---------------- CARD ---------------- */

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className = "", onClick }: CardProps) => {
  return (
    <div
      className={`bg-white border border-[#E8E3DA] rounded-xl p-5 ${onClick ? "cursor-pointer hover:border-[#C4BFB6] transition-colors" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};


/* ---------------- DIVIDER ---------------- */

interface DividerProps {
  label?: string;
}

export const Divider = ({ label }: DividerProps) => {
  if (!label) return <div className="border-t border-[#E8E3DA] my-4" />;

  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 border-t border-[#E8E3DA]" />
      <span className="text-xs text-[#9B9590] uppercase tracking-wider">
        {label}
      </span>
      <div className="flex-1 border-t border-[#E8E3DA]" />
    </div>
  );
};


/* ---------------- TOGGLE ---------------- */

interface ToggleProps {
  on: boolean;
  onChange: (v: boolean) => void;
}

export const Toggle = ({ on, onChange }: ToggleProps) => {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative rounded-full transition-colors duration-200 cursor-pointer flex-shrink-0 ${on ? "bg-[#0D0D0D]" : "bg-[#D4CFC6]"}`}
      style={{ width: 40, height: 22 }}
    >
      <span
        className="absolute top-0.5 bg-white rounded-full shadow transition-all duration-200"
        style={{
          width: 18,
          height: 18,
          transform: on ? "translateX(19px)" : "translateX(2px)",
        }}
      />
    </button>
  );
};



/* ---------------- STATS GRID ---------------- */

interface StatsGridProps {
  stats: UrlStats | null;
  isLoading: boolean;
}

export const StatsGrid = ({ stats, isLoading }: StatsGridProps) => {
  const items = [
    { label: "Total Links", value: stats?.totalUrls ?? 0 },
    { label: "Total Clicks", value: stats?.totalClicks ?? 0 },
    { label: "Clicks Today", value: stats?.clicksToday ?? 0, hi: true },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map(({ label, value, hi }) => (
        <div
          key={label}
          className={`rounded-xl p-4 border ${
            hi
              ? "bg-[#0D0D0D] border-[#0D0D0D] text-[#F5F0E8]"
              : "bg-white border-[#E8E3DA] text-[#0D0D0D]"
          }`}
        >
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <p className="text-2xl font-semibold tracking-tight">
              {value.toLocaleString()}
            </p>
          )}

          <p
            className={`text-xs mt-0.5 ${
              hi ? "text-[#F5F0E8]/50" : "text-[#9B9590]"
            }`}
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  );
};