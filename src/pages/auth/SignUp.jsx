import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import { ROUTES } from '../../utils/constants.js';

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        retypePassword: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const navigate = useNavigate();

    // Clear error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Clear success message after 5 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

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

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^\+?[0-9]{7,15}$/.test(formData.phone)) {
            errors.phone = 'Phone number is invalid';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (!formData.retypePassword) {
            errors.retypePassword = 'Please retype your password';
        } else if (formData.password !== formData.retypePassword) {
            errors.retypePassword = 'Passwords do not match';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Prepare data exactly as backend expects
            const signupData = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                password: formData.password,
                retypePassword: formData.retypePassword,
            };
            
            console.log('Sending signup data:', signupData);

            // Use authService instead of direct fetch
            const response = await authService.adminSignUp(signupData);

            setSuccess(response.message || 'Admin signup successful. Awaiting SuperAdmin verification.');
            
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                retypePassword: '',
            });

            // Optional: Navigate to admin sign in after successful signup
            // setTimeout(() => {
            //     navigate(ROUTES.ADMIN_SIGN_IN);
            // }, 2000);

        } catch (err) {
            console.error('Admin signup error:', err);
            setError(err.message || 'Admin signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="min-h-screen w-full flex items-center justify-center p-4"
            style={{
                backgroundImage: `url('https://buvanesh-adya.s3.eu-north-1.amazonaws.com/adbg.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center">
                    <img src="https://buvanesh-adya.s3.eu-north-1.amazonaws.com/logo2.jpg" alt="Logo" className="mx-auto h-20 w-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Create Admin Account
                    </h2>
                    <p className="text-sm text-gray-600 mb-8">
                        Or{' '}
                        <Link
                            to={ROUTES.ADMIN_SIGN_IN}
                            className="font-medium text-yellow-600 hover:text-yellow-500"
                        >
                            sign in to your existing account
                        </Link>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 flex items-center" role="alert">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6 flex items-center" role="alert">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="block sm:inline">{success}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="text-sm font-semibold text-gray-700 block mb-1">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className={`w-full px-4 py-3 bg-white rounded-lg border-2 ${formErrors.name ? 'border-red-500' : 'border-gray-900'} focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200`}
                        />
                        {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700 block mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                            className={`w-full px-4 py-3 bg-white rounded-lg border-2 ${formErrors.email ? 'border-red-500' : 'border-gray-900'} focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200`}
                        />
                        {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="phone" className="text-sm font-semibold text-gray-700 block mb-1">
                            Phone Number
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            className={`w-full px-4 py-3 bg-white rounded-lg border-2 ${formErrors.phone ? 'border-red-500' : 'border-gray-900'} focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200`}
                        />
                        {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="text-sm font-semibold text-gray-700 block mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a strong password"
                            className={`w-full px-4 py-3 bg-white rounded-lg border-2 ${formErrors.password ? 'border-red-500' : 'border-gray-900'} focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200`}
                        />
                        {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="retypePassword" className="text-sm font-semibold text-gray-700 block mb-1">
                            Confirm Password
                        </label>
                        <input
                            id="retypePassword"
                            name="retypePassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={formData.retypePassword}
                            onChange={handleChange}
                            placeholder="Re-enter your password"
                            className={`w-full px-4 py-3 bg-white rounded-lg border-2 ${formErrors.retypePassword ? 'border-red-500' : 'border-gray-900'} focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200`}
                        />
                        {formErrors.retypePassword && <p className="text-red-500 text-xs mt-1">{formErrors.retypePassword}</p>}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-200 ease-in-out disabled:bg-yellow-300 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                                    Creating Account...
                                </div>
                            ) : (
                                'Create Admin Account'
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-amber-800">
                                Account Verification Required
                            </h3>
                            <div className="mt-2 text-sm text-amber-700">
                                <p>Your admin account will need to be approved and verified by a SuperAdmin. You'll be notified once verification is complete.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;