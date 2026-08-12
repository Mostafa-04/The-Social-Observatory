import Sidebar from "@/Pages/sidebar/Sidebar";

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Wrapper "sticky" autour du Sidebar : il reste collé à l'écran
                pendant que le contenu de <main> défile, sans avoir besoin
                de connaître sa largeur exacte ni de toucher à Sidebar.jsx */}
            <div className="sticky top-0 h-screen shrink-0 overflow-y-auto">
                <Sidebar />
            </div>

            <main className="flex-1 p-4 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}