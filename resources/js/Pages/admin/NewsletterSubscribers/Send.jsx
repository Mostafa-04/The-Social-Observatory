import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Send as SendIcon, Info } from "lucide-react";

export default function Send() {
    const { data, setData, post, processing, errors } = useForm({
        subject: "",
        message: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("newsletter-subscribers.send"));
    };

    return (
        <AdminLayout>
            <Head title="Envoyer la newsletter" />

            <div className="mx-auto max-w-5xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Engagement — Newsletter
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Envoyer la newsletter
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Envoyer une campagne email à tous les abonnés actifs.
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
                    {/* Info banner */}
                    <div className="mb-6 flex items-start gap-2.5 rounded-lg bg-[#324949]/5 border border-[#324949]/10 px-4 py-3">
                        <Info size={15} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#324949]" />
                        <p className="text-[12.5px] leading-relaxed text-[#324949]">
                            Ce message sera envoyé uniquement aux abonnés au statut <b>Actif</b>.
                            Les abonnés désactivés ne recevront rien.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Subject */}
                        <div>
                            <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                Sujet
                            </label>
                            <input
                                type="text"
                                value={data.subject}
                                onChange={(e) => setData("subject", e.target.value)}
                                className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                placeholder="Objet de la newsletter..."
                            />
                            {errors.subject && (
                                <p className="mt-1 text-[12px] text-red-500">{errors.subject}</p>
                            )}
                        </div>

                        {/* Message */}
                        <div>
                            <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                Message
                            </label>
                            <textarea
                                rows={12}
                                value={data.message}
                                onChange={(e) => setData("message", e.target.value)}
                                className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white resize-none"
                                placeholder="Rédigez votre newsletter..."
                            />
                            {errors.message && (
                                <p className="mt-1 text-[12px] text-red-500">{errors.message}</p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 border-t border-[#D6D9D8] pt-5">
                            <Link
                                href={route("newsletter-subscribers.index")}
                                className="rounded-lg border border-[#D6D9D8] px-6 py-2.5 text-[13.5px] text-[#324949] transition hover:bg-[#F7F8F6]"
                            >
                                Annuler
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-6 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f] disabled:opacity-50"
                            >
                                <SendIcon size={14} strokeWidth={1.8} />
                                {processing ? "Envoi..." : "Envoyer la newsletter"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}