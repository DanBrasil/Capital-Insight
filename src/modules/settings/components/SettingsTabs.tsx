import type { SettingsSection } from '../types'

interface Tab {
  id: SettingsSection
  label: string
}

const TABS: Tab[] = [
  { id: 'profile', label: 'Perfil' },
  { id: 'preferences', label: 'Preferências' },
  { id: 'security', label: 'Segurança' },
  { id: 'platform', label: 'Plataforma' },
]

interface SettingsTabsProps {
  activeSection: SettingsSection
  onSectionChange: (section: SettingsSection) => void
}

/**
 * Horizontal tab navigation for the Settings page.
 *
 * On mobile (<640px) the tabs collapse into a native <select> for better
 * usability — no horizontal scrolling needed.
 */
export function SettingsTabs({ activeSection, onSectionChange }: SettingsTabsProps) {
  return (
    <>
      {/* Desktop / tablet: tab bar */}
      <div
        className="hidden sm:flex gap-1 border-b border-border"
        role="tablist"
        aria-label="Seções de configuração"
      >
        {TABS.map(tab => {
          const isActive = tab.id === activeSection
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`settings-panel-${tab.id}`}
              id={`settings-tab-${tab.id}`}
              type="button"
              onClick={() => onSectionChange(tab.id)}
              className={[
                'px-4 py-2.5 text-sm font-medium rounded-t-md border-b-2 transition-colors',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
              ].join(' ')}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Mobile: native select */}
      <div className="sm:hidden">
        <label htmlFor="settings-section-select" className="sr-only">
          Seção de configuração
        </label>
        <select
          id="settings-section-select"
          value={activeSection}
          onChange={e => onSectionChange(e.target.value as SettingsSection)}
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
        >
          {TABS.map(tab => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}
