import ProfileHeader from "../components/ProfileHeader";
import { Link, useParams } from "react-router-dom";
import useUser from "../hooks/useUser";
import ProfileTabs from "../components/ProfileTabs";
import ProfileMain from "../components/ProfileMain";
import { Button } from "@/components/ui/button";

const Profile = () => {
    const { id } = useParams();

    const { data: user, isLoading, isError, refetch } = useUser(id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-40">
                <span className="text-muted-foreground text-sm font-semibold animate-pulse">
                    Cargando perfil...
                </span>
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 h-40">
                <span className="text-destructive text-sm font-semibold">
                    Ocurrió un error al cargar el perfil.
                </span>

                <Button
                    onClick={() => refetch()}
                    className="text-sm font-semibold text-primary hover:underline"
                    type="button"
                    variant="ghost"
                >
                    Reintentar
                </Button>

                <Link to="/" className="text-primary">Volver al inicio</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <ProfileHeader postCount={user?.posts.length || 0} userId={user?.id} />

            <main className="max-w-4xl mx-auto pb-20">
                <ProfileMain user={user} />

                <ProfileTabs user={user} />
            </main>
        </div>
    );
};

export default Profile;
