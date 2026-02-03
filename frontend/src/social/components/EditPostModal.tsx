import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PostWithUser, UpdatePostSchemaType, updatePostSchema } from "@/types/social";
import useUpdatePostMutation from "../hooks/update-post.mutation";
import { X } from "lucide-react";

type EditPostModalProps = {
    post: PostWithUser;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function EditPostModal({ post, open, onOpenChange }: EditPostModalProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [removedImages, setRemovedImages] = useState<string[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { isSubmitting, errors },
    } = useForm<UpdatePostSchemaType>({
        resolver: zodResolver(updatePostSchema),
        defaultValues: {
            title: post.title,
            content: post.content ?? "",
            images: [],
            removeImages: [],
        },
        mode: "onSubmit",
    });

    const { updatePostMutation, isPending } = useUpdatePostMutation();

    const onSubmit = async (data: UpdatePostSchemaType) => {
        try {
            const res = await updatePostMutation({
                id: post.id,
                payload: {
                    ...data,
                    removeImages: removedImages
                }
            });

            toast.success(res.message || "Publicación actualizada");

            onOpenChange(false);
        } catch (error: any) {
            toast.error(error?.message || "Error al actualizar la publicación");
        }
    };

    const visibleImages = (post.images ?? []).filter( image => !removedImages.includes(image));

    useEffect(() => {
        if (! open) return;

        setRemovedImages([]);

        reset({
            title: post.title,
            content: post.content ?? "",
            images: [],
            removeImages: [],
        });

        setNewImagePreviews([]);
    }, [open, post.id, post.content, post.title, reset]);

    useEffect(() => {
        return () => {
            newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [newImagePreviews]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Editar publicación</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Título</Label>

                        <Input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="Título"
                            {...register("title")}
                            disabled={isSubmitting}
                        />

                        {errors.title && (
							<p className="text-sm text-destructive">{errors.title.message}</p>
						)}
                    </div>

                    <div className="space-y-2">
                        <Label>Contenido</Label>

                        <Textarea
                            id="content"
                            name="content"
                            placeholder="¿Qué estás pensando?"
                            className="min-h-[120px] resize-none"
                            {...register("content")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Imágenes</Label>

                        {visibleImages.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                                {visibleImages.map((image, index) => (
                                    <div key={`${post.id}-image-${index}`} className="relative">
                                        <img
                                            src={image}
                                            alt={`Imagen existente ${index + 1}`}
                                            className="h-24 w-full object-cover rounded-md"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setRemovedImages((prev) => [...prev, image])}
                                            className="absolute -top-3 -right-2 h-6 w-6 rounded-full bg-destructive text-white text-xs flex items-center justify-center"
                                            aria-label="Eliminar imagen"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {newImagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {newImagePreviews.map((image, index) => (
                                    <img
                                        key={`new-image-${index}`}
                                        src={image}
                                        alt={`Nueva imagen ${index + 1}`}
                                        className="h-24 w-full object-cover rounded-md"
                                    />
                                ))}
                            </div>
                        )}

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                        >
                            <p className="text-sm text-muted-foreground">
                                Haz clic para agregar imágenes
                            </p>
                        </div>

                        <Input
                            ref={fileInputRef}
                            type="file"
                            id="file"
                            name="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                const files = e.target.files
                                    ? Array.from(e.target.files)
                                    : [];

                                setValue("images", files, { shouldValidate: true });

                                const previews = files.map((file) => URL.createObjectURL(file));

                                setNewImagePreviews((prev) => {
                                    prev.forEach((url) => URL.revokeObjectURL(url));
                                    return previews;
                                });
                            }}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            Guardar cambios
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
