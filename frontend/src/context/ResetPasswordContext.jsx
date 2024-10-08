import React, { createContext, useState } from 'react';
import { verifyResetToken, resetPassword } from '../services/resetPasswordService';

export const ResetPasswordContext = createContext();

export const ResetPasswordProvider = ({ children }) => {
    const [feedback, setFeedback] = useState({ message: '', error: false });
    const [loading, setLoading] = useState(false);

    const verifyToken = async (token) => {
        setLoading(true);
        try {
            await verifyResetToken(token);
            setFeedback({ message: 'Token is valid', error: false });
        } catch (error) {
            setFeedback({ message: error, error: true });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (token, newPassword) => {
        setLoading(true);
        setFeedback({ message: '', error: false });
        try {
            await resetPassword(token, newPassword);
            setFeedback({ message: 'Your password has been reset successfully.', error: false });
        } catch (error) {
            setFeedback({ message: error, error: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ResetPasswordContext.Provider value={{ feedback, loading, verifyToken, handleResetPassword }}>
            {children}
        </ResetPasswordContext.Provider>
    );
};
