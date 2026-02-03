import type { MouseEvent } from "react";
import { Button } from "../../components/ui/button";
import { Heart, Share2 } from "lucide-react";
import { motion } from "framer-motion";

type PostFooterProps = {
    likesCount: number;
    likedByMe: boolean;
    onToggleLike?: (event: MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    shareUrl?: string;
    shareTitle?: string;
};

export default function PostFooter({
    likesCount,
    likedByMe,
    onToggleLike,
    disabled,
    shareUrl,
    shareTitle,
}: PostFooterProps) {

    const message = `Hola, te comparto este post: ${shareUrl}`;

    const whatsappUrl = shareUrl
        ? `https://wa.me/?text=${encodeURIComponent(message)}`
        : undefined;

    return (
        <div className="flex items-center gap-1 pt-2 border-t border-border">
            <Button
                variant="ghost"
                size="sm"
                className={`gap-2 ${likedByMe ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                disabled={disabled}
                onClick={(event) => {
                    event.stopPropagation();

                    onToggleLike?.(event);
                }}
            >
                <motion.div
                    whileTap={{ scale: 1.3 }}
                    transition={{ type: "spring", stiffness: 400 }}
                >
                    <Heart className={`h-5 w-5 ${likedByMe ? "fill-current" : ""}`} />
                </motion.div>

                <span>{likesCount}</span>
            </Button>

            <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
                asChild
            >
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    aria-label={shareTitle ? `Compartir ${shareTitle} en WhatsApp` : "Compartir en WhatsApp"}
                >
                    <Share2 className="h-5 w-5" />
                </a>
            </Button>
        </div>
    )
}
