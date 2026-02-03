import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md"
			>
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-foreground">
						<span className="text-primary">Mind</span>Feed
					</h1>
					<p className="text-muted-foreground mt-2">Conecta con tu comunidad</p>
				</div>

				<Outlet />
			</motion.div>
		</div>
	);
};

export default AuthLayout;