import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/social/components/PostCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserWithPostsSchemaType } from "@/types/social";

type ProfileTabsProps = {
	user?: UserWithPostsSchemaType | null
}

export default function ProfileTabs({ user }: ProfileTabsProps) {

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
			className="mt-6"
		>
			<Tabs defaultValue="posts" className="w-full">
				<TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-4 h-auto p-0">
					<TabsTrigger
						value="posts"
						className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
					>
						Publicaciones
					</TabsTrigger>

					<TabsTrigger
						value="likes"
						className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
					>
						Me gusta
					</TabsTrigger>
				</TabsList>

				<TabsContent value="posts" className="mt-0">
					{user?.posts?.length ? (
						<div className="divide-y divide-border">
							{user?.posts?.map((post, index) => (
								<PostCard
									key={post.id}
									post={post}
									user={user}
									index={index}
								/>
							))}
						</div>
					) : (
						<div className="py-16 text-center">
							<p className="text-muted-foreground">
								Aún no tenes publicaciones
							</p>

							<Link to="/">
								<Button variant="link" className="mt-2">
									Crea tu primera publicación
								</Button>
							</Link>
						</div>
					)}
				</TabsContent>

				<TabsContent value="likes" className="mt-0">
					{user?.likedPosts?.length ? (
						<div className="divide-y divide-border">
							{user.likedPosts.map((post, index) => (
								<PostCard
									key={post.id}
									post={post}
									user={post.user}
									index={index}
								/>
							))}
						</div>
					) : (
						<div className="py-16 text-center">
							<p className="text-muted-foreground">
								Los posts que te gusten aparecerán acá
							</p>
						</div>
					)}
				</TabsContent>
			</Tabs>
		</motion.div>
	)
}
