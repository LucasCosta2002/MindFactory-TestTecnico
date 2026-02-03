import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import { UserWithPostsSchemaType } from "@/types/social";
import { FieldErrors, type UseFormRegister } from "react-hook-form";
import { UserUpdateSchemaType } from "@/types/user";

type ProfileInfoProps = {
    user?: UserWithPostsSchemaType | null;
    isEditing: boolean;
    register: UseFormRegister<UserUpdateSchemaType>;
    errors: FieldErrors<{
        name?: string;
        username?: string;
        email?: string;
        bio?: string;
    }>
}

export default function ProfileInfo({ user, isEditing, register, errors }: ProfileInfoProps) {

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="px-4 mt-4"
        >
            { isEditing ? (
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                name="name"
                                {...register("name")}
                                placeholder="Tu nombre"
                            />

                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username">Usuario</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    @
                                </span>
                                <Input
                                    id="username"
                                    name="username"
                                    {...register("username")}
                                    className="pl-8"
                                    placeholder="usuario"
                                />
                            </div>

                            {errors.username && (
                                <p className="text-sm text-destructive">{errors.username.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                {...register("email")}
                                placeholder="Tu email"
                            />

                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Biografía</Label>

                            <Textarea
                                id="bio"
                                name="bio"
                                {...register("bio")}
                                placeholder="Cuéntanos sobre ti..."
                                rows={3}
                                maxLength={200}
                            />
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold text-foreground">
                        {user?.name}
                    </h2>

                    <p className="text-muted-foreground">@{user?.username}</p>

                    <p className="mt-3 text-foreground leading-relaxed">
                        {user?.bio || "Sin biografía"}
                    </p>

                    <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Se unió en {new Date(user?.createdAt || "").toLocaleDateString("es-ES", {
							year: "numeric",
							month: "long",
						})}
                    </div>
                </div>
            )}
        </motion.div>
    )
}
