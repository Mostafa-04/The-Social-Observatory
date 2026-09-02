import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
    ArrowLeft,
    Mail,
    Users,
    Send,
    Paperclip,
    X,
} from "lucide-react";

const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link", ],
        ["clean"],
    ],
};

export default function Create({
    event,
    totalRecipients,
}) {
    const { data, setData, post, processing, errors } = useForm({
        subject: "",
        content: "",
        attachments: [],
    });

    const submit = (e) => {
        e.preventDefault();

        post(
            route("events.emails.store", event.id),
            {
                forceFormData: true,
            }
        );
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


                    {/* Content - Rich Text Editor */}

                    <div className="mb-6">

                        <label className="mb-2 block text-sm font-medium text-[#1f2d2d]">
                            Message
                        </label>

                        <div className="rounded-xl border border-[#D6D9D8] overflow-hidden focus-within:border-[#BF5429] focus-within:ring-2 focus-within:ring-[#BF5429]/10">
                            <ReactQuill
                                theme="snow"
                                value={data.content}
                                onChange={(value) =>
                                    setData("content", value)
                                }
                                modules={quillModules}
                                placeholder="Écrivez votre message..."
                                className="bg-white [&_.ql-container]:min-h-[220px] [&_.ql-toolbar]:border-0 [&_.ql-container]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-[#D6D9D8]"
                            />
                        </div>

                        {errors.content && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.content}
                            </p>
                        )}

                    </div>


                    {/* Attachments */}

                    <div className="mb-6">

                        <label className="mb-2 block text-sm font-medium text-[#1f2d2d]">
                            Pièces jointes (images, fichiers)
                        </label>

                        <label
                            htmlFor="attachments"
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#D6D9D8] px-4 py-6 text-sm text-[#5B6462] hover:border-[#BF5429] hover:text-[#BF5429]"
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
                                        className="flex items-center justify-between rounded-lg bg-[#F7F8F7] px-3 py-2 text-xs text-[#5B6462]"
                                    >
                                        <span className="truncate">
                                            {file.name}
                                        </span>

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
                            <p className="mt-1 text-xs text-red-600">
                                {errors["attachments.0"]}
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