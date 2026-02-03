import { Link } from "react-router-dom";
import useAuth from "./auth/hooks/useAuth";

const NotFound = () => {
	const { getToken } = useAuth();

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted">
			<div className="text-center">
				<h1 className="mb-4 text-4xl font-bold">404</h1>
				<p className="mb-4 text-xl text-muted-foreground">Oops! No se encontró la página</p>
				<Link
					to={getToken() ? "/" : "/login"}
					className="text-primary underline hover:text-primary/90">
					Regresar al inicio
				</Link>
			</div>
		</div>
	);
};

export default NotFound;
