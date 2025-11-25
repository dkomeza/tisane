import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  className?: string;
}

export default function Signet({ color, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 401 371"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color, ...(props.style || {}) }}
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 299V24C0 10.7452 10.7452 0 24 0H401V187L200 371V299H0ZM55 101C41.7452 101 31 111.745 31 125V268H230V303L358 185L230 67V101H55Z"
      />
    </svg>
  );
}
