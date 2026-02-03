import { Toaster  } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/pages/Login";
import Register from "./auth/pages/Register";
import ForgotPassword from "./auth/pages/ForgotPassword";
import ConfirmToken from "./auth/pages/ConfirmToken";
import ResetPassword from "./auth/pages/ResetPassword";
import NotFound from "./NotFound";
import AuthLayout from "./auth/layout/AuthLayout";
import SocialLayout from "./social/layout/SocialLayout";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ProtectedRoute from "./auth/components/ProtectedRoute";
import Profile from "./user/pages/Profile";
import Post from "./social/pages/Post";
import Feed from "./social/pages/Feed";
import Explore from "./social/pages/Explore";

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>

		<Toaster />

		<BrowserRouter>
			<Routes>
				<Route element={<ProtectedRoute />}>
					<Route element={<SocialLayout />}>
						<Route path="/" element={<Feed />} />
						<Route path="/post/:id" element={<Post />} />
						<Route path="/explore" element={<Explore />} />
					</Route>

					<Route path="/profile/:id" element={<Profile />} />
				</Route>

				<Route element={<AuthLayout />}>
					<Route path="/login" element={<Login />} />
					<Route path="/confirm-account/:token" element={<ConfirmToken />} />
					<Route path="/register" element={<Register />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route path="/validate-token" element={<ConfirmToken />} />
					<Route path="/reset-password/:token" element={<ResetPassword />} />
				</Route>

				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>

		<ReactQueryDevtools initialIsOpen={false} />
	</QueryClientProvider>
);

export default App;
