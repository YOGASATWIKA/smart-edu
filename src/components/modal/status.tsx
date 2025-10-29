import React from "react";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";

interface StatusBadgeProps {
    isActive: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
                                                     isActive,
                                                     size = "md",
                                                     className = "",
                                                 }) => {
    const sizeMap = {
        sm: "text-xs gap-1",
        md: "text-sm gap-1.5",
        lg: "text-base gap-2",
    };

    return (
        <div
            className={`flex items-center font-medium ${
                sizeMap[size]
            } ${className}`}
        >
            {isActive ? (
                <>
                    <CheckCircleIcon
                        size={size === "sm" ? 14 : size === "md" ? 16 : 18}
                        className="text-green-600 dark:text-green-400"
                    />
                    <span className="text-green-700 dark:text-green-400">Aktif</span>
                </>
            ) : (
                <>
                    <XCircleIcon
                        size={size === "sm" ? 14 : size === "md" ? 16 : 18}
                        className="text-red-600 dark:text-red-400"
                    />
                    <span className="text-red-700 dark:text-red-400">Nonaktif</span>
                </>
            )}
        </div>
    );
};

export default StatusBadge;
