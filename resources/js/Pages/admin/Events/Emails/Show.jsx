import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Mail,
    CheckCircle2,
    XCircle,
    Clock,
    Users,
    Calendar,
    MapPin,
} from "lucide-react";


const STATUS_CONFIG = {
    sent: {
        label: "Envoyé",
        className: "bg-[#2F6B4F]/10 text-[#2F6B4F]",
        icon: CheckCircle2,
    },

    failed: {
        label: "Échec",
        className: "bg-red-100 text-red-700",
        icon: XCircle,
    },

    pending: {
        label: "En attente",
        className: "bg-amber-100 text-amber-700",
        icon: Clock,
    },
};


const CAMPAIGN_STATUS = {
    draft: {
        label: "Brouillon",
        className: "bg-gray-100 text-gray-700",
    },

    sending: {
        label: "En cours",
        className: "bg-amber-100 text-amber-700",
    },

    sent: {
        label: "Envoyée",
        className: "bg-[#2F6B4F]/10 text-[#2F6B4F]",
    },

    failed: {
        label: "Échec",
        className: "bg-red-100 text-red-700",
    },
};


export default function Show({ event, campaign }) {

    const logs = campaign.logs ?? [];

    const campaignStatus =
        CAMPAIGN_STATUS[campaign.status] ?? {
            label: campaign.status,
            className: "bg-gray-100 text-gray-700",
        };


    return (
        <AdminLayout>

            <Head title={`Campagne - ${campaign.subject}`} />


            <div className="mx-auto max-w-7xl space-y-6 p-6">


                {/* =====================================================
                    Header
                ===================================================== */}

                <div className="flex items-start justify-between gap-4">

                    <div>

                        <Link
                            href={route(
                                "events.emails.index",
                                event.id
                            )}
                            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#5B6462] transition hover:text-[#BF5429]"
                        >
                            <ArrowLeft size={16} />

                            Retour aux campagnes
                        </Link>


                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[#BF5429]">
                            Communication
                        </p>


                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            {campaign.subject}
                        </h1>


                        <p className="mt-1 text-sm text-[#5B6462]">
                            Campagne email pour l'événement :
                            <span className="ml-1 font-medium text-[#324949]">
                                {event.title}
                            </span>
                        </p>

                    </div>


                    {/* Status */}

                    <span
                        className={`rounded-full px-4 py-2 text-xs font-semibold ${campaignStatus.className}`}
                    >
                        {campaignStatus.label}
                    </span>

                </div>


                {/* =====================================================
                    Event information
                ===================================================== */}

                <div className="rounded-xl border border-[#D6D9D8] bg-white p-5 shadow-sm">

                    <div className="flex flex-wrap items-center gap-6">

                        <div className="flex items-center gap-2 text-sm text-[#5B6462]">

                            <Calendar
                                size={16}
                                className="text-[#BF5429]"
                            />

                            {event.date
                                ? new Date(event.date).toLocaleDateString(
                                      "fr-FR"
                                  )
                                : "—"}

                        </div>


                        <div className="flex items-center gap-2 text-sm text-[#5B6462]">

                            <MapPin
                                size={16}
                                className="text-[#BF5429]"
                            />

                            {event.city || "—"}

                        </div>


                        <div className="flex items-center gap-2 text-sm text-[#5B6462]">

                            <Users
                                size={16}
                                className="text-[#BF5429]"
                            />

                            {campaign.total_recipients ?? 0} destinataires

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    Statistics
                ===================================================== */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">


                    {/* Total */}

                    <div className="rounded-xl border border-[#D6D9D8] bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-xs text-[#8A9290]">
                                    Destinataires
                                </p>

                                <p className="mt-1 text-2xl font-semibold text-[#1f2d2d]">
                                    {campaign.total_recipients ?? 0}
                                </p>

                            </div>


                            <div className="rounded-lg bg-[#324949]/10 p-3 text-[#324949]">

                                <Users size={20} />

                            </div>

                        </div>

                    </div>


                    {/* Sent */}

                    <div className="rounded-xl border border-[#D6D9D8] bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-xs text-[#8A9290]">
                                    Emails envoyés
                                </p>

                                <p className="mt-1 text-2xl font-semibold text-[#2F6B4F]">
                                    {campaign.sent_count ?? 0}
                                </p>

                            </div>


                            <div className="rounded-lg bg-[#2F6B4F]/10 p-3 text-[#2F6B4F]">

                                <CheckCircle2 size={20} />

                            </div>

                        </div>

                    </div>


                    {/* Failed */}

                    <div className="rounded-xl border border-[#D6D9D8] bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-xs text-[#8A9290]">
                                    Échecs
                                </p>

                                <p className="mt-1 text-2xl font-semibold text-red-600">
                                    {campaign.failed_count ?? 0}
                                </p>

                            </div>


                            <div className="rounded-lg bg-red-100 p-3 text-red-600">

                                <XCircle size={20} />

                            </div>

                        </div>

                    </div>


                    {/* Date */}

                    <div className="rounded-xl border border-[#D6D9D8] bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-xs text-[#8A9290]">
                                    Date d'envoi
                                </p>

                                <p className="mt-1 text-sm font-semibold text-[#1f2d2d]">

                                    {campaign.sent_at
                                        ? new Date(
                                              campaign.sent_at
                                          ).toLocaleString("fr-FR")
                                        : "—"}

                                </p>

                            </div>


                            <div className="rounded-lg bg-[#BF5429]/10 p-3 text-[#BF5429]">

                                <Mail size={20} />

                            </div>

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    Email content
                ===================================================== */}

                <div className="rounded-xl border border-[#D6D9D8] bg-white shadow-sm">

                    <div className="border-b border-[#D6D9D8] px-6 py-4">

                        <h2 className="font-semibold text-[#1f2d2d]">
                            Contenu de l'email
                        </h2>

                    </div>


                    <div className="whitespace-pre-wrap px-6 py-5 text-sm leading-7 text-[#5B6462]">
                        {campaign.content}
                    </div>

                </div>


                {/* =====================================================
                    Recipients
                ===================================================== */}

                <div className="overflow-hidden rounded-xl border border-[#D6D9D8] bg-white shadow-sm">


                    <div className="flex items-center justify-between border-b border-[#D6D9D8] px-6 py-4">

                        <div>

                            <h2 className="font-semibold text-[#1f2d2d]">
                                Destinataires
                            </h2>

                            <p className="mt-1 text-xs text-[#8A9290]">
                                Historique de l'envoi pour chaque participant.
                            </p>

                        </div>


                        <span className="rounded-full bg-[#324949]/10 px-3 py-1 text-xs font-semibold text-[#324949]">
                            {logs.length}
                        </span>

                    </div>


                    {/* Table */}

                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead>

                                <tr className="border-b border-[#D6D9D8] bg-[#F7F8F7]">

                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#8A9290]">
                                        #
                                    </th>

                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#8A9290]">
                                        Email
                                    </th>

                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#8A9290]">
                                        Participant
                                    </th>

                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#8A9290]">
                                        Statut
                                    </th>

                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#8A9290]">
                                        Date
                                    </th>

                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#8A9290]">
                                        Erreur
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {logs.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="px-6 py-12 text-center text-sm text-[#8A9290]"
                                        >
                                            Aucun destinataire enregistré.
                                        </td>

                                    </tr>

                                ) : (

                                    logs.map((log, index) => {

                                        const status =
                                            STATUS_CONFIG[log.status] ??
                                            STATUS_CONFIG.pending;

                                        const StatusIcon =
                                            status.icon;


                                        return (

                                            <tr
                                                key={log.id}
                                                className="border-b border-[#D6D9D8] last:border-b-0 hover:bg-[#F7F8F7]"
                                            >

                                                {/* Number */}

                                                <td className="px-6 py-4 text-sm text-[#8A9290]">
                                                    {index + 1}
                                                </td>


                                                {/* Email */}

                                                <td className="px-6 py-4">

                                                    <div className="flex items-center gap-2">

                                                        <Mail
                                                            size={15}
                                                            className="text-[#BF5429]"
                                                        />

                                                        <span className="text-sm font-medium text-[#1f2d2d]">
                                                            {log.email}
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* Participant */}

                                                <td className="px-6 py-4 text-sm text-[#5B6462]">

                                                    {log.registration?.first_name ||
                                                    log.registration?.last_name
                                                        ? `${log.registration?.first_name ?? ""} ${log.registration?.last_name ?? ""}`
                                                        : "—"}

                                                </td>


                                                {/* Status */}

                                                <td className="px-6 py-4">

                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                                                    >

                                                        <StatusIcon size={13} />

                                                        {status.label}

                                                    </span>

                                                </td>


                                                {/* Date */}

                                                <td className="px-6 py-4 text-sm text-[#5B6462]">

                                                    {log.sent_at
                                                        ? new Date(
                                                              log.sent_at
                                                          ).toLocaleString(
                                                              "fr-FR"
                                                          )
                                                        : "—"}

                                                </td>


                                                {/* Error */}

                                                <td className="max-w-xs px-6 py-4">

                                                    {log.error ? (

                                                        <span className="text-xs text-red-600">
                                                            {log.error}
                                                        </span>

                                                    ) : (

                                                        <span className="text-xs text-[#8A9290]">
                                                            —
                                                        </span>

                                                    )}

                                                </td>

                                            </tr>

                                        );

                                    })

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </AdminLayout>
    );
}