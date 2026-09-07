// resources/js/Pages/admin/publications/Downloads.jsx

import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Mail,
    User,
    Calendar,
    Users,
    Download,
} from "lucide-react";

export default function Downloads({ publication, downloads = [] }) {
    return (
        <AdminLayout>
            <Head title={`Téléchargements — ${publication.title}`} />

            <div className="mx-auto max-w-4xl space-y-6 p-6">
                {/* Header */}
                <div>
                    <Link
                        href={route("publications.index")}
                        className="mb-4 inline-flex items-center gap-2 text-[13px] font-medium text-[#5B6462] transition-colors hover:text-[#BF5429]"
                    >
                        <ArrowLeft size={15} />
                        Retour aux publications
                    </Link>

                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[#BF5429]">
                        Contenu — Publications
                    </p>

                    <h1 className="font-display text-2xl text-[#1f2d2d]">
                        {publication.title}
                    </h1>

                    <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[#5B6462]">
                        <Users size={14} />

                        {downloads.length} personne
                        {downloads.length > 1 ? "s" : ""} inscrite
                        {downloads.length > 1 ? "s" : ""}
                    </p>
                </div>

                {/* Downloads table */}
                <div className="overflow-hidden rounded-xl border border-[#D6D9D8] bg-white shadow-sm">
                    {downloads.length === 0 ? (
                        <div className="p-10 text-center text-[13px] text-[#8A9290]">
                            Aucun téléchargement enregistré pour cette
                            publication.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[#D6D9D8] bg-[#F7F8F7]">
                                        <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#5B6462]">
                                            <User
                                                size={12}
                                                className="mr-1.5 inline -mt-0.5"
                                            />
                                            Nom
                                        </th>

                                        <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#5B6462]">
                                            <Mail
                                                size={12}
                                                className="mr-1.5 inline -mt-0.5"
                                            />
                                            Email
                                        </th>

                                        <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#5B6462]">
                                            <Calendar
                                                size={12}
                                                className="mr-1.5 inline -mt-0.5"
                                            />
                                            Date
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {downloads.map((d, idx) => (
                                        <tr
                                            key={d.id}
                                            className={
                                                idx % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-[#FAFBFA]"
                                            }
                                        >
                                            {/* Name */}
                                            <td className="border-t border-[#EEF0EF] px-5 py-3 text-[13px] font-medium text-[#1f2d2d]">
                                                {d.name}
                                            </td>

                                            {/* Email */}
                                            <td className="border-t border-[#EEF0EF] px-5 py-3 text-[13px] text-[#5B6462]">
                                                <a
                                                    href={`mailto:${d.email}`}
                                                    className="transition-colors hover:text-[#BF5429]"
                                                >
                                                    {d.email}
                                                </a>
                                            </td>

                                            {/* Date */}
                                            <td className="border-t border-[#EEF0EF] px-5 py-3 text-[13px] text-[#5B6462]">
                                                {d.created_at
                                                    ? new Date(
                                                          d.created_at
                                                      ).toLocaleDateString(
                                                          "fr-FR",
                                                          {
                                                              year: "numeric",
                                                              month: "long",
                                                              day: "numeric",
                                                              hour: "2-digit",
                                                              minute: "2-digit",
                                                          }
                                                      )
                                                    : "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Export CSV */}
                {downloads.length > 0 && (
                    <div>
                        <a
                            href={route(
                                "publications.downloads.export",
                                publication.id
                            )}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#1f2d2d] px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#BF5429]"
                        >
                            <Download size={15} />
                            Exporter en CSV
                        </a>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}