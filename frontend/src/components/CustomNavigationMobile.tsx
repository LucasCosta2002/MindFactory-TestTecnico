
import { useLocation, useNavigate } from "react-router-dom";
import { NavItem } from "./Navigation";
import { Home, Search } from "lucide-react";
import { Button } from "./ui/button";

const navItems: NavItem[] = [
    { icon: Home, label: "Inicio", to: "/" },
    { icon: Search, label: "Explorar", to: "/explore" },
];

export default function CustomNavigationMobile() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border py-2 px-4">
            <div className="flex items-center justify-around">
                {navItems.map((item) => {
                    const isActive = item.to ? location.pathname === item.to : false;

                    return (
                        <Button
                            key={item.label}
                            variant={isActive ? "secondary" : "ghost"}
                            className={`w-full justify-start gap-3 h-11
                                ${isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                            onClick={() => {
                                if (!item.to) return;
                                if (location.pathname === item.to) return;
                                navigate(item.to);
                            }}
                        >
                            <div className="relative">
                                <item.icon className="h-5 w-5" />

                                {item.notifications && (
                                    <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 text-[10px] font-bold bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                                        {item.notifications}
                                    </span>
                                )}
                            </div>

                            <span>{item.label}</span>
                        </Button>
                    );
                })}
            </div>
        </nav>
    );
}
