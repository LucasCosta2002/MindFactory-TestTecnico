import { useEffect, useState } from "react";
import { api } from "@/axios";

export const useAuthCheck = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");

            if (! token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                await api.get("/auth/me");

                setIsAuthenticated(true);
            } catch (error) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    return { isAuthenticated };
};