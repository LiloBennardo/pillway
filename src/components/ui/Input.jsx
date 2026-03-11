import clsx from 'clsx'

export default function Input({ label, error, className, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-gray-400 text-sm">{label}</label>}
      <input
        className={clsx(
          'w-full bg-bg-card border text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition',
          error ? 'border-red-500 focus:border-red-400' : 'border-bg-hover focus:border-brand-green',
          className,
        )}
        {...props}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}
