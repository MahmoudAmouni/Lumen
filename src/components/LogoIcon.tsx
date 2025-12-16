import styles from "./LogoIcon.module.css";

interface LogoIconProps {
  size?: number;
  className?: string;
}

export default function LogoIcon({ size = 37, className }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Six petals arranged in a circle */}
      <g fill="#2563eb">
        {/* Top petal */}
        <ellipse cx="24" cy="6" rx="5" ry="8" />
        {/* Top-right petal */}
        <ellipse cx="38" cy="14" rx="5" ry="8" transform="rotate(60 24 24)" />
        {/* Bottom-right petal */}
        <ellipse cx="38" cy="34" rx="5" ry="8" transform="rotate(120 24 24)" />
        {/* Bottom petal */}
        <ellipse cx="24" cy="42" rx="5" ry="8" transform="rotate(180 24 24)" />
        {/* Bottom-left petal */}
        <ellipse cx="10" cy="34" rx="5" ry="8" transform="rotate(240 24 24)" />
        {/* Top-left petal */}
        <ellipse cx="10" cy="14" rx="5" ry="8" transform="rotate(300 24 24)" />
      </g>
      
      {/* Inner circle hole */}
      <circle cx="24" cy="24" r="10" fill="#ffffff" />
    </svg>
  );
}

