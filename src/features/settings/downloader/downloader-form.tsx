import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getConfig, postConfig } from '@/api/config.ts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'


type PathItem = {
  id: string
  path: string
  label: string
}

export type FieldType = 'text' | 'password' | 'url' | 'number' | 'paths'

export interface FieldSchema {
  key: string
  label: string
  type: FieldType
  placeholder?: string
  required?: boolean
}

export interface DownloaderSchema {
  id: string
  name: string
  fields: FieldSchema[]
}

export const DOWNLOADERS: DownloaderSchema[] = [
  {
    id: 'qbittorrent',
    name: 'qBittorrent',
    fields: [
      { key: 'url', label: 'Web UI地址', type: 'url', required: true },
      { key: 'username', label: '用户名', type: 'text', required: true },
      { key: 'password', label: '密码', type: 'password', required: true },
      { key: 'save_paths', label: '下载目录', type: 'paths', required: true },
    ],
  },
  {
    id: 'transmission',
    name: 'Transmission',
    fields: [
      { key: 'url', label: 'Web UI地址', type: 'url', required: true },
      { key: 'username', label: '用户名', type: 'text', required: true },
      { key: 'password', label: '密码', type: 'password', required: true },
      { key: 'save_paths', label: '下载目录', type: 'paths', required: true },
    ],
  },
  {
    id: 'clouddrive',
    name: 'CloudDrive',
    fields: [
      { key: 'url', label: 'Web UI地址', type: 'url', required: true },
      { key: 'username', label: '用户名', type: 'text', required: true },
      { key: 'password', label: '密码', type: 'password', required: true },
      { key: 'save_paths', label: '下载目录', type: 'paths', required: true },
    ],
  },
  {
    id: 'thunder',
    name: '迅雷',
    fields: [
      { key: 'url', label: 'Web UI地址', type: 'url', required: true },
      { key: 'authorization', label: '认证头', type: 'text' },
      { key: 'save_paths', label: '下载目录', type: 'paths', required: true },
    ],
  },
]

type ConfigValue = Record<string, string | PathItem[]>

function PathListInput({
  value,
  onChange,
}: {
  value: PathItem[]
  onChange: (v: PathItem[]) => void
}) {
  const addPath = () =>
    onChange([...value, { id: crypto.randomUUID(), label: '', path: '' }])

  const updateItem = (id: string, key: 'label' | 'path', val: string) => {
    onChange(
      value.map((item) => (item.id === id ? { ...item, [key]: val } : item))
    )
  }

  const removePath = (id: string) => {
    onChange(value.filter((item) => item.id !== id))
  }

  return (
    <div className='space-y-2'>
      {value.map((item) => (
        <div key={item.id} className='grid grid-cols-11 gap-2'>
          <Input
            className='col-span-5'
            placeholder='名称（如：电影）'
            value={item.label}
            onChange={(e) => updateItem(item.id, 'label', e.target.value)}
          />
          <Input
            className='col-span-5'
            placeholder='/downloads/movie'
            value={item.path}
            onChange={(e) => updateItem(item.id, 'path', e.target.value)}
          />
          <Button
            size='icon'
            variant='ghost'
            onClick={() => removePath(item.id)}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      ))}

      <Button  variant='outline' onClick={addPath}>
        <Plus className='mr-2 h-4 w-4' />
        添加目录
      </Button>
    </div>
  )
}

export function DownloaderForm() {
  const [downloaderId, setDownloaderId] = useState<string>('qbittorrent')
  const [values, setValues] = useState<ConfigValue>({})

  const schema: DownloaderSchema | undefined = DOWNLOADERS.find(
    (d) => d.id === downloaderId
  )

  const updateValue = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const normalizePaths = (raw: unknown): PathItem[] => {
    if (!Array.isArray(raw)) return []

    return raw.map((p) => ({
      id: typeof p?.id === 'string' ? p.id : crypto.randomUUID(),
      label: typeof p?.label === 'string' ? p.label : '',
      path: typeof p?.path === 'string' ? p.path : '',
    }))
  }


  const handleSave = () => {
    const raw = values.save_paths
    const savePaths = Array.isArray(raw)
      ? raw
        .filter((p) => p.label && p.path)
        .map(({ label, path }) => ({ label, path })) // 👈 去掉 id
      : []

    const payload = {
      ...values,
      save_paths: savePaths,
    }
    postConfig('Downloader.' + downloaderId, payload as never).then((res) => {
      toast.success(res.message)
    })
  }

  useEffect(() => {
    getConfig('Downloader.' + downloaderId).then((res) => {
      const data = (res.data ?? {}) as ConfigValue
      setValues({
        ...data,
        save_paths: normalizePaths(data.save_paths),
      })
    })
  }, [downloaderId])

  return (
    <div className='w-full space-y-6'>
      <Select
        value={downloaderId}
        onValueChange={(value) => {
          setDownloaderId(value)
        }}
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='选择下载器' />
        </SelectTrigger>
        <SelectContent className='w-full'>
          {DOWNLOADERS.map((d) => (
            <SelectItem key={d.id} value={d.id}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {schema && (
        <div className='space-y-4'>
          {schema.fields.map((field) => {
            const val = values[field.key]
            if (field.type === 'paths') {
              return (
                <div className="space-y-2" key={field.key}>
                  <Label htmlFor="qb-url">{field.label}</Label>
                  <PathListInput
                    value={(values[field.key] as PathItem[]) || []}
                    onChange={(v) =>
                      setValues((prev) => ({ ...prev, [field.key]: v }))
                    }
                  />
                </div>
              )
            }

            return (
              <div className="space-y-2" key={field.key}>
                <Label htmlFor="qb-url">{field.label}</Label>
                <Input
                  type={field.type}
                  placeholder={field.placeholder || field.label}
                  value={typeof val === 'string' ? val : ''}
                  onChange={(e) => updateValue(field.key, e.target.value)}
                />
              </div>

            )
          })}
        </div>
      )}

      {/* 操作 */}
      {schema && (
        <div className='flex justify-end'>
          <Button onClick={handleSave} >保存配置</Button>
        </div>
      )}
    </div>
  )
}
