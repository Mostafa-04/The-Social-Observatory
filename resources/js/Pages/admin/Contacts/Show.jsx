import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Reply as ReplyIcon } from "lucide-react";

export default function Show({ contact }) {
    return (
        <AdminLayout>
            <Head title="Message reçu" />

            <div className="mx-auto max-w-5xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Engagement — Messages
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Message de contact
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Détails du message reçu du visiteur.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={route("contacts.index")}
                            className="flex items-center gap-1.5 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2 text-[13px] text-[#324949] transition hover:bg-[#F7F8F6]"
                        >
                            <ArrowLeft size={14} strokeWidth={1.8} />
                            Retour
                        </Link>

                        <Link
                            href={route("contacts.reply", contact.id)}
                            className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                        >
                            <ReplyIcon size={14} strokeWidth={1.8} />
                            Répondre
                        </Link>
                    </div>
                </div>

                <div className="rounded-xl border border-[#D6D9D8] bg-white p-8 shadow-sm">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                Nom
                            </label>
                            <p className="mt-1 text-[17px] text-[#1f2d2d]">{contact.name}</p>
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                Email
                            </label>
                            <p className="mt-1 text-[14px] text-[#1f2d2d]">{contact.email}</p>
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                Téléphone
                            </label>
                            <p className="mt-1 text-[14px] text-[#1f2d2d]">{contact.phone || "—"}</p>
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                Organisation
                            </label>
                            <p className="mt-1 text-[14px] text-[#1f2d2d]">{contact.organization || "—"}</p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                Sujet
                            </label>
                            <p className="mt-1 font-display text-[18px] text-[#1f2d2d]">{contact.subject}</p>
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                Statut
                            </label>
                            <div className="mt-2">
                                <span
                                    className={`rounded-full px-3.5 py-1 text-[12.5px] font-medium ${
                                        contact.is_read
                                            ? "bg-[#F7F8F6] text-[#5B6462]"
                                            : "bg-[#BF5429]/10 text-[#BF5429]"
                                    }`}
                                >
                                    {contact.is_read ? "Lu" : "Non lu"}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                Reçu le
                            </label>
                            <p className="mt-1 text-[14px] text-[#1f2d2d]">
                                {new Date(contact.created_at).toLocaleString("fr-FR")}
                            </p>
                        </div>

                        {contact.read_at && (
                            <div>
                                <label className="text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    Lu le
                                </label>
                                <p className="mt-1 text-[14px] text-[#1f2d2d]">
                                    {new Date(contact.read_at).toLocaleString("fr-FR")}
                                </p>
                            </div>
                        )}
                    </div>

                    <hr className="my-8 border-[#EAECE9]" />

                    <div>
                        <label className="mb-3 block text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                            Message
                        </label>
                        <div className="rounded-lg border border-[#D6D9D8] bg-[#F7F8F6] p-6 text-[14px] leading-7 text-[#1f2d2d] whitespace-pre-wrap">
                            {contact.message}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}