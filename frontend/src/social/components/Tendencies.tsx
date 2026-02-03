import { motion } from "framer-motion";

const tendencies = [
    "#MindFactory",
    "#TechNews",
    "#Diseño2026",
    "#Emprendimiento",
    "#ReactJS"
]

export default function Tendencies() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-xl shadow-card p-4"
        >
            <h3 className="text-lg font-semibold text-foreground mb-3">
                Tendencias
            </h3>

            <div className="space-y-3">
                {tendencies.map(
                    (tendencie, index) => (
                        <div
                            key={tendencie}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer"
                        >
                            <div>
                                <p className="font-medium text-sm text-foreground">
                                    {tendencie}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {Math.floor(Math.random() * 50 + 10)}k posts
                                </p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                #{index + 1}
                            </span>
                        </div>
                    )
                )}
            </div>
        </motion.div>
    )
}
