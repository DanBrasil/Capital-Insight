/**
 * Lightweight loading screen shown while the tenant config is being resolved.
 * Rendered BEFORE the app tree mounts — cannot depend on tenant context or theme.
 * Uses hardcoded neutral styles to avoid flash of unstyled content.
 */
export function TenantBootstrap() {
  return (
    <div
      role="status"
      aria-label="Carregando aplicação"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#fafafa',
        color: '#64748b',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: '3px solid #e2e8f0',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'tenant-spin 0.8s linear infinite',
        }}
      />
      <p style={{ marginTop: 16, fontSize: 14 }}>Inicializando...</p>

      <style>{`
        @keyframes tenant-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
