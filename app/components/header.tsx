"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
    const pathname = usePathname();
    const navLinks = [
        { name: "My Network", href: "/" },
        { name: "Logs", href: "/logs" },
        { name: "Update", href: "/update" },
        { name: "LAN", href: "/broadband" },
    ];
    return (
        <header className="bg-white shadow-md py-4 px-8 mb-6">
            <nav className="flex justify-between items-center">
                <div className="text-2xl font-bold text-blue-600">Network Monitor</div>
                <ul className="flex space-x-8">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                                href={link.href}
                                className={`text-lg font-medium transition-colors duration-200 px-3 py-1 rounded-md ${pathname === link.href ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"}`}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}