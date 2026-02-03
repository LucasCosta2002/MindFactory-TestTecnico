import useAuth from "@/auth/hooks/useAuth";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CustomHeader() {
    const { getUser } = useAuth();

    const currentUser = getUser();

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
        >
            <Link to="/" className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <h1 className="  text-2xl font-bold text-foreground">
                    <span className="text-primary">Mind</span>Feed
                </h1>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground hidden sm:block">
                        Bienvenido, {currentUser?.name.split(" ")[0]}
                    </span>
                </div>
            </Link>
        </motion.header>
    )
}
