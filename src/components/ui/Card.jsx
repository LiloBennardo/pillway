import clsx from 'clsx'

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={clsx('bg-bg-card rounded-2xl border border-bg-hover shadow-card', className)}
      {...props}
    >
      {children}
    </div>
  )
}
