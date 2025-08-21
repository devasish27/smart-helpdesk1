import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../lib/api';
import { useAuth } from '../store/auth';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import TextInput from '../components/TextInput';


const schema = z.object({
  email: z.string().refine((val) => /\S+@\S+\.\S+/.test(val), {
    message: "Enter a valid email",
  }),
  password: z.string().min(6, "Minimum 6 characters"),
});


export default function Login() {
const navigate = useNavigate();
const { login } = useAuth();
const { register, handleSubmit, formState:{ errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });


const onSubmit = async (values) => {
try {
const { data } = await api.post('/auth/login', values);
login({ user: data.user, token: data.token });
navigate('/');
} catch (e) {
alert(e?.response?.data?.error || 'Login failed');
}
};


return (
<AuthLayout title="Welcome back" subtitle="Sign in to your helpdesk account">
<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
<TextInput label="Email" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} />
<TextInput label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
<button className="btn-primary w-full" disabled={isSubmitting}>{isSubmitting? 'Signing in...' : 'Sign in'}</button>
<p className="text-sm text-slate-600">No account? <Link to="/register" className="text-brand-700">Create one</Link></p>
</form>
</AuthLayout>
);
}