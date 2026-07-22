'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AuthFormProps {
  mode: 'sign-in' | 'sign-up'
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'sign-up') {
        const result = await authClient.signUp.email({
          email,
          password,
          name,
        })
        if (result.error) {
          setError(result.error.message || 'Đăng ký thất bại')
        } else {
          router.push('/')
          router.refresh()
        }
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
        })
        if (result.error) {
          setError(result.error.message || 'Đăng nhập thất bại')
        } else {
          // Set cookies for custom session
          const data = result.data
          if (data?.user?.id) {
            document.cookie = `user-session=${data.user.id}; path=/; max-age=${7 * 24 * 60 * 60}`
            try {
              const roleRes = await fetch('/api/user-role')
              const roleData = await roleRes.json()
              document.cookie = `user-role=${roleData.role || 'student'}; path=/; max-age=${7 * 24 * 60 * 60}`
            } catch {
              document.cookie = `user-role=student; path=/; max-age=${7 * 24 * 60 * 60}`
            }
          }
          router.push('/')
          router.refresh()
        }
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {mode === 'sign-in' ? 'Đăng nhập' : 'Đăng ký'}
          </CardTitle>
          <CardDescription>
            {mode === 'sign-in'
              ? 'Đăng nhập vào tài khoản của bạn'
              : 'Tạo tài khoản mới'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'sign-up' && (
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Đang xử lý...' : mode === 'sign-in' ? 'Đăng nhập' : 'Đăng ký'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {mode === 'sign-in' ? (
              <>
                Chưa có tài khoản?{' '}
                <Link href="/sign-up" className="text-primary hover:underline">
                  Đăng ký
                </Link>
              </>
            ) : (
              <>
                Đã có tài khoản?{' '}
                <Link href="/sign-in" className="text-primary hover:underline">
                  Đăng nhập
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
