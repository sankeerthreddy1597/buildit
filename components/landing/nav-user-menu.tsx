'use client'

import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import { Icon } from '@/components/shared/icons'

interface NavUserMenuProps {
  name: string
  email: string
}

export function NavUserMenu({ name, email }: NavUserMenuProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 outline-none"
        style={{ fontSize: 13 }}
      >
        <span
          className="inline-flex items-center justify-center shrink-0 text-white font-semibold"
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            background: 'var(--brand)',
            fontSize: 11,
          }}
        >
          {name[0].toUpperCase()}
        </span>
        <span className="text-fg-dim max-w-[140px] truncate">{name}</span>
        <Icon name="chevDown" size={13} className="text-fg-faint" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" style={{ minWidth: 200 }}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-fg" style={{ fontSize: 13 }}>{name}</span>
              <span className="text-fg-muted truncate" style={{ fontSize: 11.5 }}>{email}</span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
          className="cursor-pointer"
        >
          <Icon name="x" size={13} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
