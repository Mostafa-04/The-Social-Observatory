import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Mail,
    Users,
    Send,
} from "lucide-react";

export default function Create({
    event,
    totalRecipients,
}) {
    const { data, setData, post, processing, errors } = useForm({
        subject: "",
        content: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(
            route("events.emails.store", event.id)
        );
    };

    return (
        <AdminLayout>
            <Head title={`Email - ${event.title}`} />

            <div className="mx-auto max-w-4xl space-y-6 p-6">

                {/* Header */}

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

                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#BF5429]/10 text-[#BF5429]">
                            <Mail size={22} />
                        </div>

                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429]">
                                Communication
                            </p>

                            <h1 className="font-display text-2xl text-[#1f2d2d]">
                                Envoyer un email
                            </h1>

                            <p className="text-sm text-[#5B6462]">
                                {event.title}
                            </p>
                        </div>

                    </div>
                </div>


                {/* Recipients */}

                <div className="flex items-center justify-between rounded-xl border border-[#D6D9D8] bg-white p-5 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#324949]/10 text-[#324949]">
                            <Users size={18} />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-[#1f2d2d]">
                                Destinataires
                            </p>

                            <p className="text-xs text-[#8A9290]">
                                Tous les participants inscrits
                            </p>
                        </div>

                    </div>

                    <div className="text-right">

                        <p className="text-2xl font-semibold text-[#1f2d2d]">
                            {totalRecipients}
                        </p>

                        <p className="text-xs text-[#8A9290]">
                            participant(s)
                        </p>

                    </div>

                </div>


                {/* Form */}

                <form
                    onSubmit={submit}
                    className="rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-sm"
                >

                    {/* Subject */}

                    <div className="mb-6">

                        <label className="mb-2 block text-sm font-medium text-[#1f2d2d]">
                            Objet
                        </label>

                        <input
                            type="text"
                            value={data.subject}
                            onChange={(e) =>
                                setData(
                                    "subject",
                                    e.target.value
                                )
                            }
                            placeholder="Ex : Rappel concernant votre participation"
                            className="w-full rounded-xl border border-[#D6D9D8] px-4 py-3 text-sm outline-none focus:border-[#BF5429] focus:ring-2 focus:ring-[#BF5429]/10"
                        />

                        {errors.subject && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.subject}
                            </p>
                        )}

                    </div>


                    {/* Content */}

                    <div className="mb-6">

                        <label className="mb-2 block text-sm font-medium text-[#1f2d2d]">
                            Message
                        </label>

                        <textarea
                            rows={10}
                            value={data.content}
                            onChange={(e) =>
                                setData(
                                    "content",
                                    e.target.value
                                )
                            }
                            placeholder="Écrivez votre message..."
                            className="w-full resize-y rounded-xl border border-[#D6D9D8] px-4 py-3 text-sm outline-none focus:border-[#BF5429] focus:ring-2 focus:ring-[#BF5429]/10"
                        />

                        {errors.content && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.content}
                            </p>
                        )}

                    </div>


                    {/* Warning */}

                    <div className="mb-6 rounded-xl bg-[#BF5429]/5 p-4 text-sm text-[#5B6462]">

                        <strong className="text-[#1f2d2d]">
                            Attention :
                        </strong>{" "}

                        Le message sera envoyé à tous les participants
                        ayant une adresse email valide pour cet événement.

                    </div>


                    {/* Buttons */}

                    <div className="flex justify-end gap-3">

                        <Link
                            href={route(
                                "events.registrations.index",
                                event.id
                            )}
                            className="rounded-lg border border-[#D6D9D8] px-5 py-2.5 text-sm font-medium text-[#5B6462] hover:bg-[#F7F8F7]"
                        >
                            Annuler
                        </Link>

                        <button
                            type="submit"
                            disabled={processing || totalRecipients === 0}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#BF5429] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#a8451f] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Send size={16} />

                            {processing
                                ? "Envoi..."
                                : "Envoyer à tous"}
                        </button>

                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}