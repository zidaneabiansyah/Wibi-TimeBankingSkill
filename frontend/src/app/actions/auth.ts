'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { LoginRequest, RegisterRequest } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export async function loginAction(data: LoginRequest) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            return { success: false, error: error.message || 'Login failed' };
        }

        const result = await response.json();

        // Set httpOnly cookie
        const cookieStore = await cookies();
        cookieStore.set('wibi_auth_token', result.data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return { success: true, data: result.data };
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

export async function registerAction(data: RegisterRequest) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            return { success: false, error: error.message || 'Registration failed' };
        }

        const result = await response.json();
        return { success: true, data: result.data };
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('wibi_auth_token');
    redirect('/');
}

export async function getAuthToken() {
    const cookieStore = await cookies();
    return cookieStore.get('wibi_auth_token')?.value;
}
