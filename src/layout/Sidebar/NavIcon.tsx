import {
  ArrowLeftRight,
  BarChart2,
  Briefcase,
  LayoutDashboard,
  List,
  Settings,
  Sparkles,
  TrendingUp,
  type LucideProps,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  'layout-dashboard': LayoutDashboard,
  'arrow-left-right': ArrowLeftRight,
  'bar-chart-2': BarChart2,
  'trending-up': TrendingUp,
  briefcase: Briefcase,
  list: List,
  sparkles: Sparkles,
  settings: Settings,
}

interface NavIconProps {
  name: string
  className?: string
}

/**
 * Maps a string icon name (from nav config) to a Lucide icon component.
 * Falls back to a dot if the name is unrecognized.
 */
export function NavIcon({ name, className = 'h-5 w-5' }: NavIconProps) {
  const Icon = ICON_MAP[name]
  if (!Icon) return <span className={className}>•</span>
  return <Icon className={className} aria-hidden="true" />
}
