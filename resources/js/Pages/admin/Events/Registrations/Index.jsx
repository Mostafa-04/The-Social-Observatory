import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Users,
    Mail,
    Phone,
    CalendarDays,
    Send,
} from "lucide-react";

export default function Index({
    event,
    registrations,
    total,
}) {
    return (
        <AdminLayout>
            <Head title={`Inscriptions - ${event.title}`} />

            <div className="mx-auto max-w-7xl space-y-6 p-6">

                {/* Header */}
                <div className="flex items-start justify-between">


                    <div>

                        <Link
                            href={route("events.index")}
                            className="mb-4 inline-flex items-center gap-2 text-sm text-[#5B6462] hover:text-[#BF5429]"
                        >
                            <ArrowLeft size={16} />
                            Retour aux événements
                        </Link>

                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429]">
                            Inscriptions
                        </p>

                        <h1 className="mt-1 font-display text-2xl text-[#1f2d2d]">
                            {event.title}
                        </h1>

                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Liste des participants inscrits à cet événement.
                        </p>

                    </div>


                    {/* أزرار Email */}
                    <div className="flex items-center gap-3">

                        <Link
                            href={route(
                                "events.emails.index",
                                event.id
                            )}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2.5 text-sm font-medium text-[#324949] transition hover:bg-[#F7F8F7]"
                        >
                            <Mail size={16} />

                            Campagnes Email
                        </Link>


                        <Link
                            href={route(
                                "events.emails.create",
                                event.id
                            )}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#BF5429] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#a8451f]"
                        >
                            <Mail size={16} />

                            Envoyer un email
                        </Link>

                    </div>

                </div>


                {/* Statistics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div className="rounded-xl border border-[#D6D9D8] bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-[#5B6462]">
                                    Total des inscrits
                                </p>

                                <p className="mt-2 text-3xl font-semibold text-[#1f2d2d]">
                                    {total}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#BF5429]/10 text-[#BF5429]">
                                <Users size={22} />
                            </div>

                        </div>
                    </div>


                    <div className="rounded-xl border border-[#D6D9D8] bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-[#5B6462]">
                                    Date de l'événement
                                </p>

                                <p className="mt-2 text-lg font-semibold text-[#1f2d2d]">
                                    {new Date(event.date).toLocaleDateString(
                                        "fr-FR"
                                    )}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#324949]/10 text-[#324949]">
                                <CalendarDays size={22} />
                            </div>

                        </div>
                    </div>

                </div>


                {/* Registrations table */}
                <div className="overflow-hidden rounded-xl border border-[#D6D9D8] bg-white shadow-sm">

                    <div className="border-b border-[#D6D9D8] px-6 py-4">

                        <h2 className="font-semibold text-[#1f2d2d]">
                            Participants
                        </h2>

                        <p className="mt-1 text-xs text-[#8A9290]">
                            {total} participant(s)
                        </p>

                    </div>


                    {registrations.length === 0 ? (

                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#324949]/10 text-[#324949]">
                                <Users size={24} />
                            </div>

                            <h3 className="font-semibold text-[#1f2d2d]">
                                Aucun inscrit
                            </h3>

                            <p className="mt-1 text-sm text-[#8A9290]">
                                Aucun participant ne s'est encore inscrit à cet événement.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full text-left">

                                <thead className="border-b border-[#D6D9D8] bg-[#F7F8F7]">

                                    <tr>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#5B6462]">
                                            #
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#5B6462]">
                                            Participant
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#5B6462]">
                                            Téléphone
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#5B6462]">
                                            Email
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#5B6462]">
                                            Date d'inscription
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-[#D6D9D8]">

                                    {registrations.map(
                                        (registration, index) => {

                                            const firstName =
                                                registration.first_name ?? "";

                                            const lastName =
                                                registration.last_name ?? "";

                                            return (
                                                <tr
                                                    key={registration.id}
                                                    className="transition hover:bg-[#F7F8F7]"
                                                >

                                                    <td className="px-6 py-4 text-sm text-[#8A9290]">
                                                        {index + 1}
                                                    </td>


                                                    <td className="px-6 py-4">

                                                        <div className="font-medium text-[#1f2d2d]">
                                                            {firstName}{" "}
                                                            {lastName}
                                                        </div>

                                                    </td>


                                                    <td className="px-6 py-4">

                                                        <div className="flex items-center gap-2 text-sm text-[#5B6462]">

                                                            <Phone size={14} />

                                                            {registration.phone ??
                                                                "—"}

                                                        </div>

                                                    </td>


                                                    <td className="px-6 py-4">

                                                        <div className="flex items-center gap-2 text-sm text-[#5B6462]">

                                                            <Mail size={14} />

                                                            {registration.email ??
                                                                "—"}

                                                        </div>

                                                    </td>


                                                    <td className="px-6 py-4 text-sm text-[#5B6462]">

                                                        {registration.created_at
                                                            ? new Date(
                                                                  registration.created_at
                                                              ).toLocaleDateString(
                                                                  "fr-FR"
                                                              )
                                                            : "—"}

                                                    </td>

                                                </tr>
                                            );
                                        }
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