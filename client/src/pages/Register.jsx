import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../lib/api';
import { useAuth } from '../store/auth';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import TextInput from '../components/TextInput';


const schema = z.object({
name: z.string().min(2, 'Enter your name'),
email: z.string().email('Enter a valid email'),
password: z.string().min(6, 'Minimum 6 characters'),
role: z.enum(['admin','agent','user']).default('user'),
});


export default function Register() {
const navigate = useNavigate();
const { login } = useAuth();
const { register, handleSubmit, formState:{ errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), defaultValues: { role: 'user' } });


const onSubmit = async (values) => {
try {
const { data } = await api.post('/auth/register', values);
login({ user: data.user, token: data.token });
navigate('/');
} catch (e) {
alert(e?.response?.data?.error || 'Registration failed');
}
};


return (
<AuthLayout title="Create your account" subtitle="Start managing tickets in minutes">
<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
<TextInput label="Full name" placeholder="Alex Doe" {...register('name')} error={errors.name?.message} />
<TextInput label="Email" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} />
<TextInput label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
<div>
<label className="label">Role</label>
<select className="input mt-1" {...register('role')}>
<option value="user">User</option>
<option value="agent">Agent</option>
<option value="admin">Admin</option>
</select>
</div>
<button className="btn-primary w-full" disabled={isSubmitting}>{isSubmitting? 'Creating...' : 'Create account'}</button>
<p className="text-sm text-slate-600">Already have an account? <Link to="/login" className="text-brand-700">Sign in</Link></p>
</form>
</AuthLayout>
);
}