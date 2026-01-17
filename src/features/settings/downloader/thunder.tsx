import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getConfig, postConfig } from '@/api/config.ts'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import {
  type PathItem,
  PathListInput,
} from '@/features/settings/downloader/path-input-list.tsx'

export type ThunderSchema = {
  url: string
  authorization: string
  save_paths: PathItem[]
}

export function Thunder({ downloaderId }: { downloaderId: string }) {
  const queryClient = useQueryClient()
  const [downloader, setDownloader] = useState<ThunderSchema>({
    url: '',
    authorization: '',
    save_paths: [],
  })
  const { data } = useQuery({
    queryKey: ['downloader', downloaderId],
    queryFn: async () => {
      const res = await getConfig<ThunderSchema>('Downloader.' + downloaderId)
      if (res.data) {
        setDownloader(res.data)
      }
      return res?.data
    },
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (data) {
      setDownloader(data)
    }
  }, [data])

  const handleSave = async () => {
    const res = await postConfig(
      'Downloader.' + downloaderId,
      downloader as never
    )
    toast.success(res.message)
    await queryClient.invalidateQueries({
      queryKey: ['downloader', downloaderId],
    })
    await queryClient.invalidateQueries({ queryKey: ['downloaders'] })
  }
  return (
    <>
      <div className='space-y-2'>
        <Label>webui地址</Label>
        <Input
          type='text'
          value={downloader?.url}
          onChange={(e) =>
            setDownloader((prev) => ({ ...prev, url: e.target.value }))
          }
        />
      </div>
      <div className='space-y-2'>
        <Label>请求头</Label>
        <Input
          type='text'
          value={downloader.authorization}
          onChange={(e) =>
            setDownloader((prev) => ({ ...prev, password: e.target.value }))
          }
        />
      </div>
      <div className='space-y-2'>
        <Label>下载目录ID</Label>
        <PathListInput
          value={downloader.save_paths}
          onChange={(v) =>
            setDownloader((prev) => ({ ...prev, save_paths: v }))
          }
        />
      </div>
      <div className='flex justify-end'>
        <Button onClick={handleSave}>保存配置</Button>
      </div>
    </>
  )
}
