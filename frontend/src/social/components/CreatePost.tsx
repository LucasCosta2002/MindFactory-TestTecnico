import { useEffect, useRef, useState } from "react";
import { Image, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { newPostSchema, NewPostSchemaType, UserWithPostsSchemaType } from "@/types/social";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import useCreatePostMutation from "../hooks/create-post.mutation";

interface CreatePostProps {
	user: UserWithPostsSchemaType;
}

const initialValues: NewPostSchemaType = {
	title: '',
	content: '',
};

export const CreatePost = ({ user }: CreatePostProps) => {
	const [isFocused, setIsFocused] = useState(false);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<NewPostSchemaType>({
		resolver: zodResolver(newPostSchema),
		defaultValues: initialValues,
		mode: 'onSubmit',
	});

	const titleValue = watch("title") || "";
	const contentValue = watch("content") || "";

	const { onBlur: onTitleBlur, ...titleField } = register("title");
	const { onBlur: onContentBlur, ...contentField } = register("content");

	const { createPost } = useCreatePostMutation()

	const onSubmit = async (data: NewPostSchemaType) => {
		try {
			const res = await createPost(data);

			toast.success(res.message || "Publicación creada exitosamente");

			reset();
			setImagePreviews([]);

			setIsFocused(false);

		} catch (error) {
			toast.error(error.message || "Error al crear la publicación");
		}
	};

	useEffect(() => {
		return () => {
			imagePreviews.forEach((url) => URL.revokeObjectURL(url));
		};
	}, [imagePreviews]);

	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-card rounded-xl shadow-card border-2 p-5"
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex gap-4">
					<Avatar className="h-11 w-11 ring-2 ring-background shadow-soft shrink-0">
						<AvatarImage src={user?.profileImage} alt={user?.name} />
						<AvatarFallback>{user?.name[0]}</AvatarFallback>
					</Avatar>

					<div className="flex-1">
						<Input
							id="title"
							type="text"
							name="title"
							placeholder="Título"
							className="mb-3"
							{...titleField}
							onFocus={() => setIsFocused(true)}
							onBlur={(e) => {
								onTitleBlur(e);

								if (!e.target.value.trim() && !contentValue.trim()) {
									setIsFocused(false);
								}
							}}
						/>

                        {errors.title && (
							<p className="text-sm text-destructive">{errors.title.message}</p>
						)}

						<Textarea
							id="content"
							name="content"
							placeholder="Contenido"
							{...contentField}
							onFocus={() => setIsFocused(true)}
							onBlur={(e) => {
								onContentBlur(e);

								if (!e.target.value.trim() && !titleValue.trim()) {
									setIsFocused(false);
								}
							}}
							className="min-h-[60px] resize-none border-transparent bg-transparent text-foreground placeholder:text-muted-foreground focus:border-transparent focus:ring-0 text-base"
						/>

						{imagePreviews.length > 0 && (
							<div className="grid grid-cols-2 gap-2 mt-3">
								{imagePreviews.map((image, index) => (
									<img
										key={`new-post-image-${index}`}
										src={image}
										alt={`Imagen seleccionada ${index + 1}`}
										className="h-24 w-full object-cover rounded-md"
									/>
								))}
							</div>
						)}

						<motion.div
							initial={false}
							animate={{ height: isFocused || contentValue ? "auto" : 0, opacity: isFocused || contentValue ? 1 : 0 }}
							className="overflow-hidden"
						>
							<div className="flex items-center justify-between py-3 border-t border-border 	px-4">
								<div className="flex items-center gap-1">
									<input
										ref={fileInputRef}
										id="post-images"
										type="file"
										multiple
										accept="image/*"
										disabled={isSubmitting}
										className="hidden"
										onChange={(e) => {
											const files = e.target.files
												? Array.from(e.target.files)
												: [];

											setValue("images", files, { shouldValidate: true });

											setImagePreviews((prev) => {
												prev.forEach((url) => URL.revokeObjectURL(url));
												return files.map((file) => URL.createObjectURL(file));
											});
										}}
									/>

									<Button
										variant="ghost"
										size="icon"
										className="h-9 w-9 text-primary hover:bg-primary/10 hover:text-foreground"
										type="button"
										aria-label="Agregar imágenes"
										disabled={isSubmitting}
										onClick={() => fileInputRef.current?.click()}
									>
										<Image className="h-5 w-5"  />
									</Button>
								</div>

								<Button
									type="submit"
									disabled={!titleValue.trim() || isSubmitting}
									className="gradient-warm text-white border-0 gap-2 px-5"
								>
									<Send className="h-4 w-4" />
									Publicar
								</Button>
							</div>
						</motion.div>
					</div>
				</div>
			</form>
		</motion.div>
	);
};
