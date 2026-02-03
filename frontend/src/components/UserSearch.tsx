import { useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUserSearch from "@/user/hooks/useUserSearch";
import { useNavigate } from "react-router-dom";
import useAuth from "@/auth/hooks/useAuth";

export const UserSearch = () => {
	const [query, setQuery] = useState("");
	const { getUser } = useAuth();
	const currentUser = getUser();
	const navigate = useNavigate();

	const { data: users = [], isLoading, isError, error, trimmedQuery } = useUserSearch(query);

	const filteredUsers = users.filter((user) => user.id !== currentUser?.id);

	const clearSearch = () => {
		setQuery("");
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="bg-card rounded-xl shadow-card p-4"
		>
			<h3 className="text-lg font-semibold text-foreground mb-3">
				Buscar usuarios
			</h3>

			<div className="relative mb-4">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					type="text"
					placeholder="Buscar por nombre o @usuario..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="pl-10 pr-10 bg-secondary/50 border-transparent focus:border-primary"
				/>
				{query && (
					<Button
						variant="ghost"
						size="icon"
						onClick={clearSearch}
						className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
					>
						<X className="h-4 w-4" />
					</Button>
				)}
			</div>

			<AnimatePresence mode="popLayout">
				{trimmedQuery && isLoading && (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="text-sm text-muted-foreground text-center py-4"
					>
						Buscando usuarios...
					</motion.p>
				)}

				{trimmedQuery && isError && (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="text-sm text-destructive text-center py-4"
					>
						{error instanceof Error ? error.message : "Ocurrió un error al buscar usuarios."}
					</motion.p>
				)}

				{trimmedQuery && !isLoading && filteredUsers.length === 0 && (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="text-sm text-muted-foreground text-center py-4"
					>
						No se encontraron usuarios
					</motion.p>
				)}

				{filteredUsers.length > 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="space-y-2"
					>
						{filteredUsers.map((user, index) => {
							return (
								<motion.div
									key={user.id}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.05 }}
									className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
									onClick={() => navigate(`/profile/${user.id}`)}
								>
									<Avatar className="h-10 w-10">
										<AvatarImage src={user.profileImage ?? ""} alt={user.name} />
										<AvatarFallback>{user.name[0]}</AvatarFallback>
									</Avatar>

									<div className="flex-1 min-w-0">
										<p className="font-medium text-sm text-foreground truncate">
											{user.name}
										</p>
										<p className="text-xs text-muted-foreground">
											@{user.username}
										</p>
									</div>
								</motion.div>
							);
						})}
					</motion.div>
				)}
			</AnimatePresence>

			{! query && (
				<div className="text-xs text-muted-foreground">
					Escribe para buscar usuarios.
				</div>
			)}
		</motion.div>
	);
};
