import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Plus,
    Mail,
    CheckCircle2,
    XCircle,
    Users,
    Eye,
} from "lucide-react";

const STATUS_LABELS = {
    draft: "Brouillon",
    sending: "En cours",
    sent: "Envoyée",
    failed: "Échec",
};

const STATUS_STYLES = {
    draft: "bg-gray-100 text-gray-700",
    sending: "bg-blue-100 text-blue-700",
    sent: "bg-[#2F6B4F]/10 text-[#2F6B4F]",
    failed: "bg-red-100 text-red-700",
};

export default function Index({
    event,
    campaigns,
}) {
    return (
        <AdminLayout>

            <Head
                title={`Campagnes Email - ${event.title}`}
            />

            <div className="mx-auto max-w-7xl space-y-6 p-6">

                {/* Header */}

                <div className="flex items-start justify-between">

                    <div>

                        <Link
                            href={route(
                                "events.registrations.index",
                                event.id
                            )}
                            className="mb-4 inline-flex items-center gap-2 text-sm text-[#5B6462] hover:text-[#BF5429]"
                        >
                            <ArrowLeft size={16} />

                            Retour aux inscriptions
                        </Link>


                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429]">
                            Communication
                        </p>


                        <h1 className="mt-1 font-display text-2xl text-[#1f2d2d]">
                            Campagnes Email
                        </h1>


                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            {event.title}
                        </p>

                    </div>


                    <Link
                        href={route(
                            "events.emails.create",
                            event.id
                        )}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#BF5429] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#a8451f]"
                    >
                        <Plus size={16} />

                        Nouvelle campagne
                    </Link>

                </div>


                {/* Statistics */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

                    <StatCard
                        icon={<Mail size={20} />}
                        label="Campagnes"
                        value={campaigns.length}
                    />


                    <StatCard
                        icon={<Users size={20} />}
                        label="Destinataires"
                        value={campaigns.reduce(
                            (sum, campaign) =>
                                sum +
                                Number(
                                    campaign.total_recipients
                                ),
                            0
                        )}
                    />


                    <StatCard
                        icon={<CheckCircle2 size={20} />}
                        label="Emails envoyés"
                        value={campaigns.reduce(
                            (sum, campaign) =>
                                sum +
                                Number(
                                    campaign.sent_count_real ?? 0
                                ),
                            0
                        )}
                    />


                    <StatCard
                        icon={<XCircle size={20} />}
                        label="Échecs"
                        value={campaigns.reduce(
                            (sum, campaign) =>
                                sum +
                                Number(
                                    campaign.failed_count_real ?? 0
                                ),
                            0
                        )}
                    />

                </div>


                {/* Table */}

                <div className="overflow-hidden rounded-xl border border-[#D6D9D8] bg-white shadow-sm">

                    <div className="border-b border-[#D6D9D8] px-6 py-4">

                        <h2 className="font-semibold text-[#1f2d2d]">
                            Historique des campagnes
                        </h2>

                    </div>


                    {campaigns.length === 0 ? (

                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#BF5429]/10 text-[#BF5429]">
                                <Mail size={24} />
                            </div>

                            <h3 className="font-semibold text-[#1f2d2d]">
                                Aucune campagne
                            </h3>

                            <p className="mt-1 text-sm text-[#8A9290]">
                                Aucune campagne email n'a encore été créée.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="border-b border-[#D6D9D8] bg-[#F7F8F7]">

                                    <tr>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#5B6462]">
                                            Objet
                                        </th>

                                        <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-[#5B6462]">
                                            Dest.
                                        </th>

                                        <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-[#5B6462]">
                                            Envoyés
                                        </th>

                                        <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-[#5B6462]">
                                            Échecs
                                        </th>

                                        <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-[#5B6462]">
                                            Statut
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#5B6462]">
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-[#D6D9D8]">

                                    {campaigns.map(
                                        (campaign) => (
                                            <tr
                                                key={
                                                    campaign.id
                                                }
                                                className="transition hover:bg-[#F7F8F7]"
                                            >

                                                <td className="px-6 py-4">

                                                    <div className="font-medium text-[#1f2d2d]">
                                                        {
                                                            campaign.subject
                                                        }
                                                    </div>

                                                    <div className="mt-1 text-xs text-[#8A9290]">
                                                        {campaign.sent_at
                                                            ? new Date(
                                                                  campaign.sent_at
                                                              ).toLocaleString(
                                                                  "fr-FR"
                                                              )
                                                            : "—"}
                                                    </div>

                                                </td>


                                                <td className="px-6 py-4 text-center">

                                                    <span className="font-medium text-[#1f2d2d]">
                                                        {
                                                            campaign.total_recipients
                                                        }
                                                    </span>

                                                </td>


                                                <td className="px-6 py-4 text-center">

                                                    <span className="inline-flex items-center gap-1.5 font-medium text-[#2F6B4F]">

                                                        <CheckCircle2
                                                            size={15}
                                                        />

                                                        {
                                                            campaign.sent_count_real ??
                                                            0
                                                        }

                                                    </span>

                                                </td>


                                                <td className="px-6 py-4 text-center">

                                                    <span className="inline-flex items-center gap-1.5 font-medium text-red-600">

                                                        <XCircle
                                                            size={15}
                                                        />

                                                        {
                                                            campaign.failed_count_real ??
                                                            0
                                                        }

                                                    </span>

                                                </td>


                                                <td className="px-6 py-4 text-center">

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                                                            STATUS_STYLES[
                                                                campaign
                                                                    .status
                                                            ]
                                                        }`}
                                                    >
                                                        {
                                                            STATUS_LABELS[
                                                                campaign
                                                                    .status
                                                            ]
                                                        }
                                                    </span>

                                                </td>


                                                <td className="px-6 py-4 text-right">

                                                    <Link
                                                        href={route(
                                                            "events.emails.show",
                                                            [
                                                                event.id,
                                                                campaign.id,
                                                            ]
                                                        )}
                                                        className="inline-flex items-center gap-2 rounded-lg p-2 text-[#324949] transition hover:bg-[#324949]/10"
                                                        title="Voir les détails"
                                                    >
                                                        <Eye
                                                            size={17}
                                                        />
                                                    </Link>

                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </AdminLayout>
    );
}


function StatCard({
    icon,
    label,
    value,
}) {
    return (
        <div className="rounded-xl border border-[#D6D9D8] bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-[#5B6462]">
                        {label}
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-[#1f2d2d]">
                        {value}
                    </p>

                </div>


                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#BF5429]/10 text-[#BF5429]">
                    {icon}
                </div>

            </div>

        </div>
    );
}