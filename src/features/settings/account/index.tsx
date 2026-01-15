import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'
import { UserPen } from 'lucide-react'

export function SettingsAccount() {
  return (
    <ContentSection
      title='Account'
      desc='Update your account settings. Set your preferred language and
          timezone.'
      icon={<UserPen className='h-5 w-5 text-primary' />}
    >
      <AccountForm />
    </ContentSection>
  )
}
