 'use client';
 
 import { useState } from 'react';
 import { useRouter } from 'next/navigation';
 import { useForm } from 'react-hook-form';
 import { zodResolver } from '@hookform/resolvers/zod';
 import { z } from 'zod';
import { Button, Input } from '@/components/ui';
 import { Eye, EyeOff, AlertCircle } from 'lucide-react';
 
 const loginSchema = z.object({
   email: z.string().email('Invalid email address'),
   password: z.string().min(6, 'Password must be at least 6 characters'),
 });
 
 type LoginFormData = z.infer<typeof loginSchema>;
 
 export function LoginForm() {
   const router = useRouter();
   const [showPassword, setShowPassword] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [loading, setLoading] = useState(false);
 
   const form = useForm<LoginFormData>({
     resolver: zodResolver(loginSchema),
     defaultValues: { email: '', password: '' },
   });
 
   const onSubmit = async (data: LoginFormData) => {
     try {
       setLoading(true);
       setError(null);
 
       const response = await fetch('/api/admin/auth/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data),
       });
 
       if (!response.ok) {
         const payload = await response.json();
         throw new Error(payload.message || 'Login failed');
       }
 
       router.push('/admin/sites');
       router.refresh();
     } catch (err: any) {
       setError(err.message);
     } finally {
       setLoading(false);
     }
   };
 
   return (
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
       {error && (
         <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-center gap-2">
           <AlertCircle className="w-4 h-4" />
           {error}
         </div>
       )}
 
       <div>
         <label htmlFor="email" className="block text-sm font-medium text-gray-700">
           Email
         </label>
         <Input
           id="email"
           type="email"
           placeholder="admin@example.com"
           className="mt-1"
           {...form.register('email')}
         />
         {form.formState.errors.email && (
           <p className="text-sm text-red-600 mt-1">
             {form.formState.errors.email.message}
           </p>
         )}
       </div>
 
       <div>
         <label htmlFor="password" className="block text-sm font-medium text-gray-700">
           Password
         </label>
         <div className="relative mt-1">
           <Input
             id="password"
             type={showPassword ? 'text' : 'password'}
             placeholder="••••••••"
             {...form.register('password')}
           />
           <button
             type="button"
             onClick={() => setShowPassword(!showPassword)}
             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
             aria-label={showPassword ? 'Hide password' : 'Show password'}
           >
             {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
           </button>
         </div>
         {form.formState.errors.password && (
           <p className="text-sm text-red-600 mt-1">
             {form.formState.errors.password.message}
           </p>
         )}
       </div>
 
       <Button type="submit" className="w-full" disabled={loading}>
         {loading ? 'Signing in...' : 'Sign In'}
       </Button>
     </form>
   );
 }
