interface AvatarProps {
  src?: string | null
  alt: string
  fallbackText: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({ src, alt, fallbackText, size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-32 h-32 text-3xl',
  }

  const baseClasses = `rounded-full flex items-center justify-center font-medium flex-shrink-0 ${sizeClasses[size]}`

  if (src) {
    return (
      <div className={`${baseClasses} overflow-hidden bg-gray-900 ${className}`}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, hide it and show fallback
            e.currentTarget.style.display = 'none'
            if (e.currentTarget.nextSibling) {
              (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex'
            }
          }}
        />
        <div className="w-full h-full bg-gray-900 text-white hidden items-center justify-center">
          {fallbackText[0]?.toUpperCase() || '?'}
        </div>
      </div>
    )
  }

  return (
    <div className={`${baseClasses} bg-gray-900 text-white ${className}`}>
      {fallbackText[0]?.toUpperCase() || '?'}
    </div>
  )
}
