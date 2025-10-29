import React, { useState } from 'react';
import { IoEye, IoEyeOff } from 'react-icons/io5';

interface PasswordInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
    placeholder?: string;
    label?: string;
}

const PasswordInput = ({
                           value,
                           onChange,
                           id = "password",
                           label = "Password",
                           placeholder = "********"
                       }: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    return (
        <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor={id}>
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <button
                    type="button"
                    onClick={toggleVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 transition-colors hover:text-slate-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
            </div>
        </div>
    );
};

export default PasswordInput;