import { Outlet } from "react-router-dom";
import { ProfilePanel } from "@/user/components/ProfilePanel";
import { UserSearch } from "@/components/UserSearch";
import { Navigation } from "@/components/Navigation";
import CustomHeader from "../components/CustomHeader";
import Tendencies from "../components/Tendencies";
import CustomFooter from "../components/CustomFooter";
import { useIsMobile } from "@/hooks/use-mobile";
import CustomNavigationMobile from "../../components/CustomNavigationMobile";

const SocialLayout = () => {
    const isMobile = useIsMobile();

    return (
        <div className="min-h-screen bg-background">
            <CustomHeader />

            <main className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <aside className="hidden lg:block lg:col-span-3 space-y-6">
                        <Navigation />

                        <ProfilePanel />
                    </aside>

                    <section className="lg:col-span-6 space-y-6">
                        <Outlet />
                    </section>

                    <aside className="hidden lg:block lg:col-span-3 space-y-6">
                        <UserSearch />

                        <Tendencies />

                        <CustomFooter />
                    </aside>
                </div>

                { isMobile && (
                    <CustomNavigationMobile />
                )}
            </main>
        </div>
    );
};

export default SocialLayout;