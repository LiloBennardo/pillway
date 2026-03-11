import clsx from 'clsx'

const variants = {
  primary: 'bg-brand-green hover:bg-brand-green-dark text-white shadow-green',
  secondary: 'bg-bg-card hover:bg-bg-hover text-white border border-bg-hover',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  ghost: 'text-gray-400 hover:text-white hover:bg-bg-hover',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'font-semibold rounded-xl transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
