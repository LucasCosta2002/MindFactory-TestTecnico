import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useDeletePostMutation from "../hooks/delete-post.mutation";
import { useLocation, useNavigate } from "react-router-dom";

type DeletePostModalProps = {
    postId: string;
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function DeletePostModal({ postId, userId, open, onOpenChange }: DeletePostModalProps) {
    const { deletePost, deletePostMutation } = useDeletePostMutation();

    const location = useLocation();
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const res = await deletePost({ id: postId, userId });

            toast.success(res.message || "Publicación eliminada");

            onOpenChange(false);

            if (location.pathname.includes("/post")) {
                navigate("/");
            }

        } catch (error: any) {
            toast.error(error?.message || "Error al eliminar la publicación");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Eliminar publicación</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                    Esta acción no se puede deshacer. ¿Quieres eliminar esta publicación?
                </p>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deletePostMutation.isPending}
                    >
                        Eliminar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
