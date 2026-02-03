import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Edit3, Save, X } from "lucide-react";
import { Dispatch, SetStateAction, useRef, type ChangeEvent } from "react";
import { UserStorageSchemaType } from "@/types/user";

type ProfileBannerProps = {
    user?: UserStorageSchemaType | null;
    isEditing: boolean;
    setIsEditing: Dispatch<SetStateAction<boolean>>
    onSave: () => void;
    onCancel: () => void;
    onProfileImageChange: (file: File | null) => void;
    isSaving: boolean;
    isImageUploading: boolean;
}

export default function ProfileBanner({
    user,
    isEditing,
    setIsEditing,
    onSave,
    onCancel,
    onProfileImageChange,
    isSaving,
    isImageUploading,
}: ProfileBannerProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleProfileImageClick = () => {
        if (isImageUploading) return;

        fileInputRef.current?.click();
    };

    const handleProfileImageInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;

        onProfileImageChange(file);

        if (e.target) e.target.value = "";
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
        >
            <div className="h-32 sm:h-48 gradient-warm relative" />

            <div className="px-4">
                <div className="relative -mt-16 sm:-mt-20 flex justify-between items-end">
                    <div className="relative">
                        <Avatar className="h-28 w-28 sm:h-36 sm:w-36 ring-4 ring-background shadow-soft">
                            <AvatarImage
                                src={user?.profileImage}
                                alt={user?.name}
                            />

                            <AvatarFallback className="text-3xl font-semibold">
                                {user?.name?.[0]}
                            </AvatarFallback>
                        </Avatar>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={handleProfileImageInputChange}
                            className="hidden"
                        />

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute bottom-1 right-1 h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-md"
                            onClick={handleProfileImageClick}
                            disabled={isImageUploading}
                        >
                            <Camera className="h-4 w-4" />
                        </Button>
                    </div>

                    {! isEditing ? (
                        <Button
                            onClick={() => setIsEditing(true)}
                            variant="outline"
                            className="gap-2"
                        >
                            <Edit3 className="h-4 w-4" />
                            Editar perfil
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                onClick={onCancel}
                                variant="outline"
                                size="icon"
                                className="h-9 w-9"
                            >
                                <X className="h-4 w-4" />
                            </Button>

                            <Button onClick={onSave} className="gap-2" disabled={isSaving}>
                                <Save className="h-4 w-4" />
                                Guardar
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
