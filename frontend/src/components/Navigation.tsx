import { Home, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

export interface NavItem {
	icon: React.ElementType;
	label: string;
	active?: boolean;
	notifications?: number;
	to?: string;
}

const navItems: NavItem[] = [
	{ icon: Home, label: "Inicio", to: "/" },
	{ icon: Search, label: "Explorar", to: "/explore" },
];

export const Navigation = () => {
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<nav className="bg-card rounded-xl shadow-card p-3">
			<div className="space-y-1">
				{navItems.map((item, index) => (
					<motion.div
						key={item.label}
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: index * 0.05 }}
					>
						{(() => {
							const isActive = item.to ? location.pathname === item.to : false;

							return (
								<Button
									variant={isActive ? "secondary" : "ghost"}
									className={`w-full justify-start gap-3 h-11 ${isActive
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
						})()}
					</motion.div>
				))}
			</div>
		</nav>
	);
};
