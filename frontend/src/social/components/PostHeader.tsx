import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserWithPostsSchemaType } from "@/types/social";
import { formatTimeAgo } from "@/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { MoreHorizontal } from "lucide-react";

type PostHeaderProps = {
    author: Pick<UserWithPostsSchemaType,"id" | "name" | "username" | "profileImage">;
    createdAt: string;
    title?: string;
    userId?: string;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function PostHeader({ author, createdAt, title, userId, onEdit, onDelete }: PostHeaderProps) {
    return (
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 ring-2 ring-background shadow-soft">
                    <AvatarImage src={author?.profileImage || ""} alt={author?.name} />
                    <AvatarFallback>{author?.name[0]}</AvatarFallback>
                </Avatar>

                <div>
                    <h3 className="font-semibold text-foreground leading-tight">
                        {author?.name}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        @{author?.username} · {formatTimeAgo(createdAt)}
                    </p>

                    {title && (
                        <p className="text-sm font-medium text-foreground mt-1">
                            {title}
                        </p>
                    )}
                </div>
            </div>

            { userId === author?.id && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem onClick={ e => {
                            e.stopPropagation();
                            onEdit?.();
                        }}>
                            Editar
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={ e => {
                                e.stopPropagation();
                                onDelete?.();
                            }}
                        >
                            Eliminar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    )
}
