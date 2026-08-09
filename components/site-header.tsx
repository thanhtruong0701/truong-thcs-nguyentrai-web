'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Search, Phone, Mail, ChevronDown } from 'lucide-react'
import { getVisibleMenuItems } from '@/app/actions/menus'
import { getSettings } from '@/app/actions/settings'

interface MenuItem {
  id: string
  label: string
  link: string
  icon: string | null
  menuType: string | null
  parentId: string | null
  orderIndex: number
  isVisible: boolean
}

function adjustColor(hex: string, amount: number): string {
  if (!hex || !hex.startsWith('#')) return hex || '#1e3a5f'
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount))
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount))
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`
}

function formatLink(link: string | null | undefined, itemId: string, label: string): string {
  if (!link || link === '#' || link === '/') {
    const cleanLabel = label.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return `/${cleanLabel || itemId}`
  }
  if (link.startsWith('/') || link.startsWith('http')) return link
  return `/${link}`
}

export function SiteHeader() {
  const [menuItemsList, setMenuItemsList] = useState<MenuItem[]>([])
  const [schoolSettings, setSchoolSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getVisibleMenuItems(), getSettings()])
      .then(([menus, settings]) => {
        setMenuItemsList(menus)
        setSchoolSettings(settings)
        if (settings.primaryColor) {
          document.documentElement.style.setProperty('--primary', settings.primaryColor)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const rootMenuItems = menuItemsList.filter(i => !i.parentId)
  const getSubItems = (parentId: string) => menuItemsList.filter(i => i.parentId === parentId)

  function handleParentClick(e: React.MouseEvent, item: MenuItem, hasChildren: boolean) {
    if (hasChildren || item.menuType === 'category') {
      e.preventDefault()
      setActiveDropdown(prev => prev === item.id ? null : item.id)
    }
  }

  const now = new Date()
  const dayNames = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  const dateStr = `${dayNames[now.getDay()]}, ngày ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`

  return (
    <>
      {/* Top Bar */}
      <div className="text-white text-xs animate-slideDown" style={{ backgroundColor: schoolSettings?.primaryColor || 'var(--primary)' }}>
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {schoolSettings?.schoolPhone || '(028) 3842-5904'}</span>
            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {schoolSettings?.schoolEmail || 'info@truongnguyen.edu.vn'}</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className="text-white animate-fadeIn"
        style={{
          background: `linear-gradient(to right, ${schoolSettings?.primaryColor || 'var(--primary)'}, ${schoolSettings?.primaryColor ? adjustColor(schoolSettings.primaryColor, -20) : 'var(--primary)'}, ${schoolSettings?.primaryColor || 'var(--primary)'})`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                {schoolSettings?.logoUrl ? (
                  <img src={schoolSettings.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="font-bold text-xl" style={{ color: schoolSettings?.primaryColor || 'var(--primary)' }}>NT</span>
                )}
              </div>
              <div>
                <p className="text-xs opacity-80 tracking-wider uppercase">Cổng thông tin điện tử</p>
                <h1 className="text-2xl md:text-3xl font-bold tracking-wide group-hover:tracking-wider transition-all duration-300">
                  {schoolSettings?.schoolName || 'TRƯỜNG THCS NGUYỄN TRÃI'}
                </h1>
                <p className="text-xs opacity-80">
                  {schoolSettings?.schoolAddress || 'Tây Ninh'}
                </p>
              </div>
            </Link>
            <form action="/search" method="GET" className="hidden md:flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2 hover:bg-white/30 transition-colors">
              <input
                type="text"
                name="q"
                placeholder="Từ khóa tìm kiếm"
                className="bg-transparent text-white placeholder-white/70 text-sm outline-none w-48"
              />
              <button type="submit">
                <Search className="w-4 h-4 text-white/80 hover:text-white transition-colors" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Navigation - Hỗ trợ dropdown menu con */}
      <nav
        className="border-t shadow-md animate-slideDown relative z-50"
        style={{
          background: `linear-gradient(to right, ${schoolSettings?.primaryColor ? adjustColor(schoolSettings.primaryColor, -30) : 'var(--primary)'}, ${schoolSettings?.primaryColor || 'var(--primary)'})`,
          borderColor: schoolSettings?.primaryColor ? adjustColor(schoolSettings.primaryColor, -40) : 'transparent'
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center flex-wrap">
            {rootMenuItems.map((item, i) => {
              const children = getSubItems(item.id)
              const hasChildren = children.length > 0
              const isOpen = activeDropdown === item.id

              return (
                <div
                  key={item.id}
                  className="relative group"
                  onMouseEnter={() => hasChildren && setActiveDropdown(item.id)}
                  onMouseLeave={() => hasChildren && setActiveDropdown(null)}
                >
                  <Link
                    href={hasChildren || item.menuType === 'category' ? '#' : formatLink(item.link, item.id, item.label)}
                    onClick={(e) => handleParentClick(e, item, hasChildren)}
                    className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200 whitespace-nowrap border-r border-white/20 cursor-pointer select-none"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <span>{item.icon || '📄'}</span>
                    {item.label}
                    {hasChildren && (
                      <ChevronDown className={`w-3.5 h-3.5 text-white/70 group-hover:text-white transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : ''}`} />
                    )}
                  </Link>

                  {/* Dropdown Menu Con */}
                  {hasChildren && (
                    <div
                      className={`absolute top-full left-0 min-w-[220px] bg-white rounded-b-lg shadow-2xl border border-gray-100 py-2 z-[100] transition-all duration-150 ${
                        isOpen ? 'block opacity-100 translate-y-0' : 'hidden group-hover:block'
                      }`}
                    >
                      {children.map(child => (
                        <Link
                          key={child.id}
                          href={formatLink(child.link, child.id, child.label)}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium"
                        >
                          <span className="text-base">{child.icon || '📄'}</span>
                          <span>{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
