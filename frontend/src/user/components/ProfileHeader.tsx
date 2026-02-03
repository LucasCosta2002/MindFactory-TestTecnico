import { Button } from '@/components/ui/button'
import { ArrowLeft, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from "framer-motion";
import useAuth from '@/auth/hooks/useAuth';

type ProfileHeaderProps = {
    postCount: number;
    userId?: string;
}

export default function ProfileHeader({ postCount, userId }: ProfileHeaderProps) {
    const { logout, getUser } = useAuth();

    const loggedUser = getUser();

    const canLogout = loggedUser?.id && userId && loggedUser.id === userId;

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
        >
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
                <Link to="/">
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>

                <div className='flex justify-between w-full items-center'>
                    <div>
                        { loggedUser?.id === userId && (
                            <h1 className="text-lg font-semibold text-foreground">
                                Mi Perfil
                            </h1>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {postCount} publicaciones
                        </p>
                    </div>

                    {canLogout && (
                        <Button
                            variant="ghost"
                            onClick={() => logout()}
                            className="justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                            <LogOut className="h-4 w-4" />
                            Cerrar sesión
                        </Button>
                    )}
                </div>
            </div>
        </motion.header>
    )
}
