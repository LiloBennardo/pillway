import clsx from 'clsx'

const variants = {
  green: 'bg-brand-green/20 text-brand-green',
  red: 'bg-red-500/20 text-red-400',
  yellow: 'bg-amber-500/20 text-amber-400',
  blue: 'bg-blue-500/20 text-blue-400',
  gray: 'bg-bg-hover text-gray-300',
}

export default function Badge({ children, variant = 'green', className }) {
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  )
}
