export default function PillIcon({ color = '#F59E0B', size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="4" y="8" width="24" height="16" rx="8" fill={color} opacity="0.2" />
      <rect x="4" y="8" width="12" height="16" rx="8" fill={color} />
      <rect x="16" y="8" width="12" height="16" rx="8" fill={color} opacity="0.6" />
      <line x1="16" y1="8" x2="16" y2="24" stroke="white" strokeWidth="1" opacity="0.4" />
    </svg>
  )
}
