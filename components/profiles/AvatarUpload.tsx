'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AvatarUploadProps {
  userId: string
  currentAvatarUrl?: string | null
  onUploadComplete: (url: string) => void
}

export function AvatarUpload({ userId, currentAvatarUrl, onUploadComplete }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Resize image to 400x400
  const resizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const size = 400
          canvas.width = size
          canvas.height = size

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Failed to get canvas context'))
            return
          }

          // Calculate dimensions to crop to square
          const sourceSize = Math.min(img.width, img.height)
          const sourceX = (img.width - sourceSize) / 2
          const sourceY = (img.height - sourceSize) / 2

          ctx.drawImage(
            img,
            sourceX,
            sourceY,
            sourceSize,
            sourceSize,
            0,
            0,
            size,
            size
          )

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error('Failed to create blob'))
              }
            },
            'image/jpeg',
            0.9
          )
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }

    try {
      setUploading(true)

      // Resize image
      const resizedBlob = await resizeImage(file)

      // Create preview
      const previewUrl = URL.createObjectURL(resizedBlob)
      setPreviewUrl(previewUrl)

      // Upload to Supabase Storage
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/avatar.${fileExt}`

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, resizedBlob, {
          upsert: true,
          contentType: 'image/jpeg',
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update profile with avatar URL
      const { error: updateError } = await (supabase as any)
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)

      if (updateError) {
        throw updateError
      }

      onUploadComplete(publicUrl)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Failed to upload avatar. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const getInitials = () => {
    // This will be passed from parent or fetched
    return 'U'
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-900 text-white flex items-center justify-center text-3xl font-medium border-4 border-white shadow-lg">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{getInitials()}</span>
          )}
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Change Photo'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
