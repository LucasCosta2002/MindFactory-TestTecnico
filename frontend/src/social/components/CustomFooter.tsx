import { Link } from "react-router-dom";

export default function CustomFooter() {

    return (
        <div className="text-xs text-muted-foreground px-2">
            <p className="space-x-2">
                <Link to="https://www.linkedin.com/in/lucas-costamagna-developer" target="_blank" className="hover:underline">Términos</Link>
                <span>·</span>
                <Link to="https://www.linkedin.com/in/lucas-costamagna-developer" target="_blank" className="hover:underline">Privacidad</Link>
                <span>·</span>
                <Link to="https://www.linkedin.com/in/lucas-costamagna-developer" target="_blank" className="hover:underline">Cookies</Link>
            </p>

            <p className="mt-2">© {new Date().getFullYear()} SocialFeed</p>
        </div>
    )
}
