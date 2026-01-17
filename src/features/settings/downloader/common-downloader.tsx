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

export type CommonDownloaderSchema = {
  url: string
  username: string
  password: string
  save_paths: PathItem[]
}

export function CommonDownloader({ downloaderId }: { downloaderId: string }) {
  const [downloader, setDownloader] = useState<CommonDownloaderSchema>({
    url: '',
    username: '',
    password: '',
    save_paths: [],
  })
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['downloader', downloaderId],
    queryFn: async () => {
      const res = await getConfig<CommonDownloaderSchema>(
        'Downloader.' + downloaderId
      )
      return res.data
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
        <Label>用户名</Label>
        <Input
          type='text'
          value={downloader.username}
          onChange={(e) =>
            setDownloader((prev) => ({ ...prev, username: e.target.value }))
          }
        />
      </div>
      <div className='space-y-2'>
        <Label>密码</Label>
        <Input
          type='text'
          value={downloader.password}
          onChange={(e) =>
            setDownloader((prev) => ({ ...prev, password: e.target.value }))
          }
        />
      </div>
      <div className='space-y-2'>
        <Label>下载目录</Label>
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
