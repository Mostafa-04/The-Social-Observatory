import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Mail, CheckCircle2, XCircle, Hash } from "lucide-react";

export default function Show({ subscriber }) {
    return (
        <AdminLayout>
            <Head title="Détails de l'abonné" />

            <div className="mx-auto max-w-4xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Engagement — Newsletter
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Détails de l'abonné
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Informations complètes sur cet abonné à la newsletter.
                        </p>
                    </div>

                    <Link
                        href={route("newsletter-subscribers.index")}
                        className="flex items-center gap-1.5 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2 text-[13px] text-[#324949] transition hover:bg-[#F7F8F6]"
                    >
                        <ArrowLeft size={14} strokeWidth={1.8} />
                        Retour
                    </Link>
                </div>

                <div className="rounded-xl border border-[#D6D9D8] bg-white p-8 shadow-sm">
                    {/* Identity row */}
                    <div className="mb-8 flex items-center gap-4 border-b border-[#EAECE9] pb-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#324949]/10 text-[#324949]">
                            <Mail size={20} strokeWidth={1.6} />
                        </div>
                        <div>
                            <p className="font-display text-lg text-[#1f2d2d]">{subscriber.email}</p>
                            <p className="flex items-center gap-1 text-[12.5px] text-[#8A9290]">
                                <Hash size={11} strokeWidth={2} />
                                {subscriber.id}
                            </p>
                        </div>
                        <span
                            className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium ${
                                subscriber.is_active
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-[#F7F8F6] text-[#5B6462]"
                            }`}
                        >
                            {subscriber.is_active ? (
                                <CheckCircle2 size={13} strokeWidth={2} />
                            ) : (
                                <XCircle size={13} strokeWidth={2} />
                            )}
                            {subscriber.is_active ? "Actif" : "Inactif"}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                Abonné le
                            </label>
                            <p className="mt-1.5 text-[14px] text-[#1f2d2d]">
                                {subscriber.subscribed_at
                                    ? new Date(subscriber.subscribed_at).toLocaleString("fr-FR")
                                    : "—"}
                            </p>
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                Désabonné le
                            </label>
                            <p className="mt-1.5 text-[14px] text-[#1f2d2d]">
                                {subscriber.unsubscribed_at
                                    ? new Date(subscriber.unsubscribed_at).toLocaleString("fr-FR")
                                    : "—"}
                            </p>
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                Créé le
                            </label>
                            <p className="mt-1.5 text-[14px] text-[#1f2d2d]">
                                {new Date(subscriber.created_at).toLocaleString("fr-FR")}
                            </p>
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                Dernière mise à jour
                            </label>
                            <p className="mt-1.5 text-[14px] text-[#1f2d2d]">
                                {new Date(subscriber.updated_at).toLocaleString("fr-FR")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}