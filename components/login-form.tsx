'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    gsap.fromTo('.form-input', { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.1 });
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await fetch('https://backend_spmb.smktibazma.sch.id/api/auth/login-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: username, // backend pakai email
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Login gagal');
      gsap.to(formRef.current, {
        keyframes: { x: [-10, 10, -10, 10, 0] },
        duration: 0.4,
      });
      setIsLoading(false);
      return;
    }

    // Simpan token
    localStorage.setItem('admin_token', data.token);

    // Animasi sukses
    gsap.to(formRef.current, {
      scale: 1.03,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      onComplete: () => router.push('/dashboard'),
    });

    setIsLoading(false);
  };

  return (
    <Card className="h-[600px] w-flex bg-white shadow-xl rounded-[40px] overflow-hidden flex flex-col md:flex-row">
      {/* KIRI: FORM LOGIN */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-10 py-12 space-y-6">
        <div className="text-center mb-4">
          <img src="/logo-bazma.png" alt="SMK TI Bazma" className="w-24 h-24 md:w-900 md:h-28 mb-4 object-contain" />
          <h2 className="text-3xl font-bold text-gray-900 font-inter">Selamat Datang Admin!</h2>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div ref={errorRef} className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="form-input space-y-2">
            <Label htmlFor="username" className="text-gray-700 font-medium">
              Nama Anda
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 h-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1E2B61] outline-none"
                placeholder="Nama Anda"
                required
              />
            </div>
          </div>

          <div className="form-input space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Kata Sandi
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1E2B61] outline-none"
                placeholder="Kata Sandi"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="login-button w-full h-11 bg-[#1E2B61] hover:bg-[#16215a] text-white font-semibold rounded-xl transition-all duration-200">
            {isLoading ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>
      </div>

      {/* KANAN: GAMBAR */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center">
        <img src="/gambar-admin.png" alt="Ilustrasi Login" className="w-full h-[550px] md:max-w-md object-contain" />
      </div>
    </Card>
  );
}
