import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import { ROUTES } from '../../utils/constants.js';

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState({});

    const { signIn, loading, error, clearError, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // *  Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
            navigate(from, { replace: true });  
        }
    }, [isAuthenticated, navigate, location]);

    useEffect(() => {
        return () => {
            if (clearError) clearError();
        };
    }, [clearError]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                if (clearError) clearError();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await signIn(formData);
        } catch (err) {
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link
                            to={ROUTES.SIGN_UP}
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            create a new account
                        </Link>
                    </p>
                </div>

                <Card className="p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Email address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            error={formErrors.email}
                            placeholder="Enter your email"
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            error={formErrors.password}
                            placeholder="Enter your password"
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            loading={loading}
                            disabled={loading}
                        >
                            Sign in
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default SignIn;