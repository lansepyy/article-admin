import { ContentSection } from '../components/content-section'
import { DisplayForm } from './display-form'
import { Monitor } from 'lucide-react'

export function SettingsDisplay() {
  return (
    <ContentSection
      title='Display'
      desc="Turn items on or off to control what's displayed in the app."
      icon={<Monitor size={18} />}
    >
      <DisplayForm />
    </ContentSection>
  )
}
