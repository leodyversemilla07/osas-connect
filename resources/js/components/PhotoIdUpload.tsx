"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Camera, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface PhotoIdUploadProps {
  onChange: (file: File | null) => void
  existingPhotoUrl?: string
}

export function PhotoIdUpload({ onChange, existingPhotoUrl }: PhotoIdUploadProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(existingPhotoUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Call the onChange prop with the file
    onChange(file)
  }

  const clearPreview = () => {
    setPhotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onChange(null)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload 1x1 Photo</CardTitle>
        <CardDescription>Please upload a recent 1x1 ID photo with white background</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={cn(
            "relative w-full aspect-square max-w-[300px] mx-auto border-2 rounded-lg overflow-hidden",
            photoPreview
              ? "border-solid border-border"
              : "border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer",
          )}
          onClick={() => !photoPreview && fileInputRef.current?.click()}
        >
          {photoPreview ? (
            <>
              <img src={photoPreview} alt="1x1 ID Preview" className="w-full h-full object-cover" />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  clearPreview()
                }}
                className="absolute top-2 right-2 bg-background/80 p-1 rounded-full hover:bg-background"
                aria-label="Clear preview"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <Camera className="h-12 w-12 mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2 text-center">Tap to upload your 1x1 photo</p>
              <p className="text-xs text-muted-foreground text-center">Should be a recent photo with white background</p>
            </div>
          )}
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Input
            id="photo-id"
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Your photo will be used for identification purposes in your student profile
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
