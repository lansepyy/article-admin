import { createContext, useContext, useEffect, useState } from 'react'

export type ImageMode = 'show' | 'blur' | 'hide'

const ImageModeContext = createContext<{
  mode: ImageMode
  setMode: (m: ImageMode) => void
}>({
  mode: 'show',
  setMode: () => {},
})

export function ImageModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ImageMode>('show')

  // 持久化
  useEffect(() => {
    const saved = localStorage.getItem('image-mode') as ImageMode | null
    if (saved) setMode(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('image-mode', mode)
    document.body.setAttribute('data-image-mode', mode)
  }, [mode])

  return (
    <ImageModeContext.Provider value={{ mode, setMode }}>
      <div data-image-mode={mode}>{children}</div>
    </ImageModeContext.Provider>
  )
}

export const useImageMode = () => useContext(ImageModeContext)
