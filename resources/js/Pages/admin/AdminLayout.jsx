import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/Pages/sidebar/Sidebar";

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 p-4 overflow-y-auto">
                
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1f2d2d] text-white"
                >
                    <Menu size={18} strokeWidth={1.8} />
                </button>

                {children}
            </main>
        </div>
    );
}