import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Camera, X, Upload, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PhotoIdUploadProps {
  onChange: (file: File | null) => void
  existingPhotoUrl?: string
  maxSizeInMB?: number
  requiredDimensions?: { width: number; height: number }
  onError?: (error: string) => void
}

export function PhotoIdUpload({
  onChange,
  existingPhotoUrl,
  maxSizeInMB = 5,
  requiredDimensions = { width: 300, height: 300 },
  onError
}: PhotoIdUploadProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(existingPhotoUrl || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // File validation function
  const validateFile = useCallback((file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        reject(new Error('Please upload a valid image file (JPEG, PNG, or WebP)'))
        return
      }

      // Check file size
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024
      if (file.size > maxSizeInBytes) {
        reject(new Error(`File size must be less than ${maxSizeInMB}MB`))
        return
      }

      // Check image dimensions
      const img = new Image()
      img.onload = () => {
        const aspectRatio = img.width / img.height
        const idealAspectRatio = requiredDimensions.width / requiredDimensions.height

        // Allow some tolerance for aspect ratio (±10%)
        if (Math.abs(aspectRatio - idealAspectRatio) > 0.1) {
          reject(new Error('Image should be square (1:1 aspect ratio) for ID photos'))
          return
        }

        // Check minimum dimensions
        if (img.width < 200 || img.height < 200) {
          reject(new Error('Image should be at least 200x200 pixels'))
          return
        }

        URL.revokeObjectURL(img.src)
        resolve()
      }

      img.onerror = () => {
        URL.revokeObjectURL(img.src)
        reject(new Error('Invalid image file'))
      }

      img.src = URL.createObjectURL(file)
    })
  }, [maxSizeInMB, requiredDimensions])

  // Compress image if needed
  const compressImage = useCallback((file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Set canvas dimensions
        const maxDimension = 800
        let { width, height } = img

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width
            width = maxDimension
          } else {
            width = (width * maxDimension) / height
            height = maxDimension
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          'image/jpeg',
          0.8
        )

        URL.revokeObjectURL(img.src)
      }

      img.src = URL.createObjectURL(file)
    })
  }, [])

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      // Validate file
      await validateFile(file)

      // Compress if needed
      const processedFile = file.size > 1024 * 1024 ? await compressImage(file) : file

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string)
        setIsLoading(false)
      }
      reader.onerror = () => {
        setError('Failed to read the file')
        setIsLoading(false)
      }
      reader.readAsDataURL(processedFile)

      // Call onChange with processed file
      onChange(processedFile)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while processing the file'
      setError(errorMessage)
      setIsLoading(false)
      onError?.(errorMessage)
    }
  }, [validateFile, compressImage, onChange, onError])

  const clearPreview = useCallback(() => {
    // Revoke object URL to prevent memory leaks
    if (photoPreview && photoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview)
    }

    setPhotoPreview(null)
    setError(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    onChange(null)
  }, [photoPreview, onChange])

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload 1x1 Photo</CardTitle>
        <CardDescription>
          Please upload a recent 1x1 ID photo with white background (max {maxSizeInMB}MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Upload Area */}
        <div
          className={cn(
            "relative w-full aspect-square max-w-[300px] mx-auto border-2 rounded-lg overflow-hidden transition-all duration-200",
            photoPreview
              ? "border-solid border-border"
              : "border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer",
            isLoading && "opacity-50 pointer-events-none"
          )}
          onClick={() => !photoPreview && !isLoading && handleUploadClick()}
        >
          {photoPreview ? (
            <>
              <img
                src={photoPreview}
                alt="1x1 ID Preview"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  clearPreview()
                }}
                disabled={isLoading}
                className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm p-1 rounded-full hover:bg-background transition-colors disabled:opacity-50"
                aria-label="Remove photo"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4">
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-sm text-muted-foreground">Processing image...</p>
                </div>
              ) : (
                <>
                  <Camera className="h-12 w-12 mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2 text-center">
                    Tap to upload your 1x1 photo
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    Square format, white background preferred
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Alternative Upload Button */}
        {!photoPreview && !isLoading && (
          <Button
            type="button"
            variant="outline"
            onClick={handleUploadClick}
            className="w-full"
            aria-label="Upload photo"
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        )}

        {/* Hidden File Input */}
        <Input
          id="photo-id"
          type="file"
          ref={fileInputRef}
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
          aria-describedby="photo-requirements"
        />

        {/* Requirements and Info */}
        <div id="photo-requirements" className="text-xs text-muted-foreground space-y-1">
          <p>Requirements:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Square aspect ratio (1:1)</li>
            <li>Minimum 200x200 pixels</li>
            <li>Maximum {maxSizeInMB}MB file size</li>
            <li>JPEG, PNG, or WebP format</li>
            <li>Clear face visibility with white background</li>
          </ul>
          <p className="mt-2">
            Your photo will be used for identification purposes in your student profile
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
