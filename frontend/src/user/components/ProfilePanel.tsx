import { LogOut, Edit3, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useAuth from "@/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";

export const ProfilePanel = () => {
	const navigate = useNavigate();

	const { logout, getUser } = useAuth();

	const userStorage = getUser();

	const { data: user } = useUser(userStorage?.id || "");

	return (
		<motion.aside
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}
			className="bg-card rounded-xl shadow-card overflow-hidden"
		>
			<div className="relative">
				<div className="h-24 gradient-warm" />

				<div className="absolute -bottom-10 left-5">
					<Avatar className="h-20 w-20 ring-4 ring-card shadow-soft">
						<AvatarImage src={user?.profileImage || ""} alt={user?.name || "SS"} />
						<AvatarFallback className="text-xl font-semibold">
							{user?.name[0]}
						</AvatarFallback>
					</Avatar>
				</div>

				<Button
					variant="ghost"
					size="icon"
					className="absolute top-3 right-3 h-8 w-8 bg-card/20 backdrop-blur-sm text-white hover:bg-card/40"
					onClick={() => navigate(`/profile/${user?.id || ""}`)}
				>
					<Edit3 className="h-4 w-4" />
				</Button>
			</div>

			<div className="pt-12 px-5 pb-5">
				<h2 className="  text-xl font-semibold text-foreground">
					{user?.name}
				</h2>
				<p className="text-sm text-muted-foreground mb-3">@{user?.username}</p>
				<p className="text-sm text-foreground leading-relaxed mb-4">
					{user?.bio || ""}
				</p>

				<div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
					<span className="flex items-center gap-1">
						<Calendar className="h-4 w-4" />
						Te uniste en {' ' }
						{new Date(user?.createdAt || "").toLocaleDateString("es-ES", {
							year: "numeric",
							month: "long",
						})}
					</span>
				</div>

				<Separator className="mb-4" />

				<Button
					variant="ghost"
					onClick={() => logout()}
					className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
				>
					<LogOut className="h-4 w-4" />
					Cerrar sesión
				</Button>
			</div>
		</motion.aside>
	);
};
