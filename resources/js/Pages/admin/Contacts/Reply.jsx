import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Send } from "lucide-react";

export default function Reply({ contact }) {
    const { data, setData, post, processing, errors } = useForm({
        subject: `Re: ${contact.subject}`,
        message: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("contacts.sendReply", contact.id));
    };

    return (
        <AdminLayout>
            <Head title="Répondre au message" />

            <div className="mx-auto max-w-5xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Engagement — Messages
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Répondre au message
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Envoyer une réponse par email au visiteur.
                        </p>
                    </div>

                    <Link
                        href={route("contacts.show", contact.id)}
                        className="flex items-center gap-1.5 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2 text-[13px] text-[#324949] transition hover:bg-[#F7F8F6]"
                    >
                        <ArrowLeft size={14} strokeWidth={1.8} />
                        Retour
                    </Link>
                </div>

                <div className="rounded-xl border border-[#D6D9D8] bg-white p-8 shadow-sm">
                    {/* Visitor Information */}
                    <div className="mb-6 rounded-lg border border-[#D6D9D8] bg-[#F7F8F6] p-6">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    Nom
                                </label>
                                <p className="mt-1 text-[14px] text-[#1f2d2d]">{contact.name}</p>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    Email
                                </label>
                                <p className="mt-1 text-[14px] text-[#1f2d2d]">{contact.email}</p>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    Sujet original
                                </label>
                                <p className="mt-1 text-[14px] text-[#1f2d2d]">{contact.subject}</p>
                            </div>
                        </div>
                    </div>

                    {/* Original message — pour contexte pendant la réponse */}
                    {contact.message && (
                        <div className="relative mb-8 rounded-lg border-l-2 border-[#BF5429]/40 bg-white pl-5 py-1">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8A9290] mb-1.5">
                                Message original
                            </p>
                            <p className="text-[13.5px] leading-relaxed text-[#5B6462] whitespace-pre-line">
                                {contact.message}
                            </p>
                        </div>
                    )}

                    {/* Reply Form */}
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                Sujet
                            </label>
                            <input
                                type="text"
                                value={data.subject}
                                onChange={(e) => setData("subject", e.target.value)}
                                className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                            />
                            {errors.subject && (
                                <p className="mt-1 text-[12px] text-red-500">{errors.subject}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                Message
                            </label>
                            <textarea
                                rows={12}
                                value={data.message}
                                onChange={(e) => setData("message", e.target.value)}
                                className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white resize-none"
                                placeholder="Rédigez votre réponse..."
                            />
                            {errors.message && (
                                <p className="mt-1 text-[12px] text-red-500">{errors.message}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 border-t border-[#D6D9D8] pt-5">
                            <Link
                                href={route("contacts.show", contact.id)}
                                className="rounded-lg border border-[#D6D9D8] px-6 py-2.5 text-[13.5px] text-[#324949] transition hover:bg-[#F7F8F6]"
                            >
                                Annuler
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-6 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f] disabled:opacity-50"
                            >
                                <Send size={14} strokeWidth={1.8} />
                                {processing ? "Envoi..." : "Envoyer la réponse"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}