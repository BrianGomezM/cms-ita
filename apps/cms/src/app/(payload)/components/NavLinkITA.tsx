'use client'
import Link from 'next/link'

export default function NavLinkITA() {
  return (
    <div style={{ padding: '0 16px', marginTop: '8px' }}>
      <Link
        href="/admin/dashboard-ita"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '6px',
          textDecoration: 'none',
          color: 'var(--theme-text)',
          fontSize: '13px',
          fontWeight: 600,
          background: 'var(--theme-elevation-100)',
          transition: 'background 0.2s',
        }}
      >
        📊 Dashboard ITA
      </Link>
    </div>
  )
}