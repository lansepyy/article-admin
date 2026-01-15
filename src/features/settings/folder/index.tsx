import { ContentSection } from '@/features/settings/components/content-section.tsx'
import { FolderForm } from '@/features/settings/folder/folder-form.tsx'
import { Folder } from 'lucide-react'

export function SettingsFolder() {
  return (
    <ContentSection title='下载目录配置' desc='管理类目-下载器-下载目录的关系' icon={<Folder className='h-5 w-5 text-primary' />}>
      <FolderForm />
    </ContentSection>
  )
}
