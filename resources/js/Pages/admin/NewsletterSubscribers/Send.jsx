import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Send as SendIcon, Info, Paperclip, X } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link"],
        ["clean"],
    ],
};

export default function Send() {
    const { data, setData, post, processing, errors } = useForm({
        subject: "",
        message: "",
        attachments: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("newsletter-subscribers.send"), {
            forceFormData: true,
        });
    };

    const handleFilesChange = (e) => {
        const files = Array.from(e.target.files);
        setData("attachments", [...data.attachments, ...files]);
    };

    const removeFile = (index) => {
        setData(
            "attachments",
            data.attachments.filter((_, i) => i !== index)
        );
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

                        {/* Message - Rich Text Editor */}
                        <div>
                            <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                Message
                            </label>
                            <div className="rounded-lg border border-[#D6D9D8] overflow-hidden focus-within:border-[#324949]/40">
                                <ReactQuill
                                    theme="snow"
                                    value={data.message}
                                    onChange={(value) => setData("message", value)}
                                    modules={quillModules}
                                    placeholder="Rédigez votre newsletter..."
                                    className="bg-white [&_.ql-container]:min-h-[260px] [&_.ql-toolbar]:border-0 [&_.ql-container]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-[#D6D9D8]"
                                />
                            </div>
                            {errors.message && (
                                <p className="mt-1 text-[12px] text-red-500">{errors.message}</p>
                            )}
                        </div>

                        {/* Attachments */}
                        <div>
                            <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                Pièces jointes (images, fichiers)
                            </label>

                            <label
                                htmlFor="attachments"
                                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#D6D9D8] px-4 py-6 text-[13px] text-[#5B6462] hover:border-[#BF5429] hover:text-[#BF5429]"
                            >
                                <Paperclip size={16} />
                                Cliquez pour sélectionner des fichiers
                            </label>

                            <input
                                id="attachments"
                                type="file"
                                multiple
                                onChange={handleFilesChange}
                                className="hidden"
                            />

                            {data.attachments.length > 0 && (
                                <ul className="mt-3 space-y-2">
                                    {data.attachments.map((file, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center justify-between rounded-lg bg-[#F7F8F6] px-3 py-2 text-[12px] text-[#5B6462]"
                                        >
                                            <span className="truncate">{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="ml-2 text-[#8A9290] hover:text-red-600"
                                            >
                                                <X size={14} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {errors["attachments.0"] && (
                                <p className="mt-1 text-[12px] text-red-500">
                                    {errors["attachments.0"]}
                                </p>
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