import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import styles from '@/styles/Login.module.scss';
import { useAuth } from '@/lib/useAuth';
import { FiEye } from 'react-icons/fi';

const loginSchema = z.object({
  username: z.string().min(1, 'Tên người dùng không được để trống'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (loginFormData: LoginForm) => {
    setIsLoading(true);
    setError('');

    const result = await login(loginFormData.username, loginFormData.password);

    setIsLoading(false);

    // Fix for lint: use result.success and result.error
    if (result.code===0) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.logoIcon}>
            <circle cx="12" cy="12" r="10"/>
            <path d="m4.93 4.93 4.24 4.24"/>
            <path d="m14.83 9.17 4.24-4.24"/>
            <path d="m14.83 14.83 4.24 4.24"/>
            <path d="m9.17 14.83-4.24 4.24"/>
            <circle cx="12" cy="12" r="4"/>
          </svg>
        </div>
        
        <h1 className={styles.title}>Đăng nhập tài khoản</h1>
        <p className={styles.subtitle}>
          Chào mừng trở lại! Vui lòng nhập thông tin của bạn.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {error && (
            <div className={styles.errorAlert}>
              {error}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Tên người dùng
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Tên người dùng"
              {...register('username')}
              className={styles.input}
            />
            {errors.username && (
              <span className={styles.errorMessage}>{errors.username.message}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Mật khẩu
            </label>
            <div
              className={styles.passwordFieldContainer}
              style={{ position: 'relative' }}
            >
              <Input
                id="password"
                type="password"
                placeholder="Mật khẩu"
                autoComplete="current-password"
                {...register('password')}
                className={`${styles.input} ${styles.passwordInput}`}
                style={{
                  paddingRight: 44, // space for the eye button
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '1rem',
                  height: '44px',
                  boxShadow: '0 1px 2px 0 rgba(31,41,55,0.03)',
                  transition: 'border 0.2s',
                  width: '100%',
                }}
              />
              <button
                type="button"
                aria-label="Hiện mật khẩu"
                // Không cho phép chuyển đổi hiển thị mật khẩu
                className={styles.eyeButton}
                style={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#fff',
                  border: 'none',
                  padding: 0,
                  cursor: 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 32,
                  width: 32,
                  borderRadius: '50%',
                  boxShadow: '0 1px 2px 0 rgba(31,41,55,0.06)',
                  transition: 'background 0.2s',
                  opacity: 0.6,
                  pointerEvents: 'none',
                }}
                tabIndex={-1}
                disabled
              >
                <FiEye size={20} color="#6b7280" />
              </button>
            </div>
            {errors.password && (
              <span className={styles.errorMessage}>{errors.password.message}</span>
            )}
          </div>

          <Button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>
      </div>
    </div>
  );
} 