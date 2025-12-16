'use client'

import { PlusIcon } from '@heroicons/react/24/outline'

interface FloatingActionButtonProps {
  onClick: () => void
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-40 flex items-center justify-center group"
      aria-label="Create post"
    >
      <PlusIcon className="w-6 h-6 md:w-7 md:h-7 group-hover:rotate-90 transition-transform" />
    </button>
  )
}
