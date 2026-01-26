import { useState } from 'react'
import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { ResponsiveModal } from '@/components/response-modal.tsx'

export function ImagePreview({
  images,
  alt,
  image_trigger,
}: {
  images: string[]
  alt: string
  image_trigger?: React.ReactNode
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }
  return (
    <ResponsiveModal title='图片预览' trigger={image_trigger}>
      <div className='relative rounded-lg bg-black/95 p-4'>
        <img
          src={images[currentIndex]}
          alt={`${alt}-${currentIndex}`}
          className='max-h-[80vh] max-w-[90vw] rounded-lg object-contain'
        />

        {/* 图片导航 */}
        {images.length > 1 && (
          <>
            <Button
              size='icon'
              variant='ghost'
              onClick={prevImage}
              className='absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/60 text-white hover:bg-black/80 hover:text-white'
            >
              <ChevronLeft className='h-6 w-6' />
            </Button>

            <Button
              size='icon'
              variant='ghost'
              onClick={nextImage}
              className='absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/60 text-white hover:bg-black/80 hover:text-white'
            >
              <ChevronRight className='h-6 w-6' />
            </Button>

            {/* 图片计数 */}
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white backdrop-blur-sm'>
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}

        {/* 缩略图 */}
        {images.length > 1 && (
          <div className='scrollbar-thin mt-4 flex gap-2 overflow-x-auto pb-2'>
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  currentIndex === index
                    ? 'scale-110 border-primary shadow-lg'
                    : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`preview-${index}`}
                  className='h-full w-full object-cover'
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </ResponsiveModal>
  )
}
