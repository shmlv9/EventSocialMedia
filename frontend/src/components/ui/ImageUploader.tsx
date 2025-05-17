'use client'

import { useState } from 'react'

type ImageUploadProps = {
  onUpload: (file: File) => void
  isPreview?: boolean
}

export default function ImageUploader({ onUpload, isPreview=true }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)
      onUpload(file)
    }
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <label className="cursor-pointer inline-block bg-lime-500 rounded-3xl text-white px-4 py-2 hover:bg-lime-400 transition">
        Загрузить изображение
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>

      {preview && isPreview && (
        <img src={preview} alt="Предпросмотр" className="w-40 h-40 object-cover rounded-xl border" />
      )}
    </div>
  )
}
