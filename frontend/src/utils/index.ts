

export const formatTimeAgo = (date: Date | string): string => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;

    const seconds = Math.floor((new Date().getTime() - parsedDate.getTime()) / 1000);

    if (seconds < 60) return "ahora";

    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;

    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;

    return `${Math.floor(seconds / 86400)}d`;
};