import { useState } from 'react'

import { useSettingsData } from '../hooks/useSettingsData'
import type { SettingsSection } from '../types'
import { PlatformSettingsForm } from './PlatformSettingsForm'
import { PreferencesSettingsForm } from './PreferencesSettingsForm'
import { ProfileSettingsForm } from './ProfileSettingsForm'
import { SecuritySettingsForm } from './SecuritySettingsForm'
import { SettingsErrorState } from './SettingsErrorState'
import { SettingsHeader } from './SettingsHeader'
import { SettingsSkeleton } from './SettingsSkeleton'
import { SettingsTabs } from './SettingsTabs'

/**
 * Top-level orchestrator for the Settings page.
 *
 * Owns:
 * - Active section state (tab navigation)
 * - Loading and error branches
 * - Data distribution to form components
 *
 * Does NOT:
 * - Contain form logic (each form component is self-contained)
 * - Perform mutations directly
 */
export function SettingsView() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')
  const { data, isLoading, isError, refetch } = useSettingsData()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
        <SettingsHeader />
        <SettingsSkeleton />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
        <SettingsHeader />
        <SettingsErrorState onRetry={() => void refetch()} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <SettingsHeader />

      <SettingsTabs activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="mt-4">
        {activeSection === 'profile' && <ProfileSettingsForm initialData={data.profile} />}
        {activeSection === 'preferences' && (
          <PreferencesSettingsForm initialData={data.preferences} />
        )}
        {activeSection === 'security' && <SecuritySettingsForm securityInfo={data.security} />}
        {activeSection === 'platform' && <PlatformSettingsForm initialData={data.platform} />}
      </div>
    </div>
  )
}
