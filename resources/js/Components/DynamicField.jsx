import React from "react";

export default function DynamicField({
    field,
    value,
    onChange,
}) {
    const inputId = `field-${field.id}`;

    const commonProps = {
        id: inputId,
        name: field.name,
        value: value ?? "",
        onChange: (e) => onChange(field.id, e.target.value),
        required: field.is_required,
        className:
            "w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
    };

    switch (field.type) {
        case "textarea":
            return (
                <div>
                    <label
                        htmlFor={inputId}
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        {field.label}
                        {field.is_required && (
                            <span className="ml-1 text-red-500">*</span>
                        )}
                    </label>

                    <textarea
                        {...commonProps}
                        rows={4}
                    />
                </div>
            );

        case "number":
            return (
                <div>
                    <label
                        htmlFor={inputId}
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        {field.label}
                        {field.is_required && (
                            <span className="ml-1 text-red-500">*</span>
                        )}
                    </label>

                    <input
                        {...commonProps}
                        type="number"
                    />
                </div>
            );

        case "date":
            return (
                <div>
                    <label
                        htmlFor={inputId}
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        {field.label}
                        {field.is_required && (
                            <span className="ml-1 text-red-500">*</span>
                        )}
                    </label>

                    <input
                        {...commonProps}
                        type="date"
                    />
                </div>
            );

        case "email":
            return (
                <div>
                    <label
                        htmlFor={inputId}
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        {field.label}
                        {field.is_required && (
                            <span className="ml-1 text-red-500">*</span>
                        )}
                    </label>

                    <input
                        {...commonProps}
                        type="email"
                    />
                </div>
            );

        case "phone":
            return (
                <div>
                    <label
                        htmlFor={inputId}
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        {field.label}
                        {field.is_required && (
                            <span className="ml-1 text-red-500">*</span>
                        )}
                    </label>

                    <input
                        {...commonProps}
                        type="tel"
                    />
                </div>
            );

        case "file":
            return (
                <div>
                    <label
                        htmlFor={inputId}
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        {field.label}
                        {field.is_required && (
                            <span className="ml-1 text-red-500">*</span>
                        )}
                    </label>

                    <input
                        id={inputId}
                        name={field.name}
                        type="file"
                        required={field.is_required}
                        onChange={(e) =>
                            onChange(field.id, e.target.files?.[0] ?? null)
                        }
                        className="w-full rounded-xl border border-gray-300 px-4 py-3"
                    />
                </div>
            );

        case "select":
            return (
                <div>
                    <label
                        htmlFor={inputId}
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        {field.label}
                        {field.is_required && (
                            <span className="ml-1 text-red-500">*</span>
                        )}
                    </label>

                    <select
                        {...commonProps}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="">Select...</option>

                        {(field.options ?? []).map((option, index) => {
                            const optionValue =
                                typeof option === "object"
                                    ? option.value
                                    : option;

                            const optionLabel =
                                typeof option === "object"
                                    ? option.label
                                    : option;

                            return (
                                <option
                                    key={index}
                                    value={optionValue}
                                >
                                    {optionLabel}
                                </option>
                            );
                        })}
                    </select>
                </div>
            );

        case "radio":
            return (
                <div>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                        {field.label}
                        {field.is_required && (
                            <span className="ml-1 text-red-500">*</span>
                        )}
                    </p>

                    <div className="space-y-2">
                        {(field.options ?? []).map((option, index) => {
                            const optionValue =
                                typeof option === "object"
                                    ? option.value
                                    : option;

                            const optionLabel =
                                typeof option === "object"
                                    ? option.label
                                    : option;

                            return (
                                <label
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="radio"
                                        name={field.name}
                                        value={optionValue}
                                        checked={value === optionValue}
                                        onChange={(e) =>
                                            onChange(
                                                field.id,
                                                e.target.value
                                            )
                                        }
                                        required={
                                            field.is_required &&
                                            index === 0
                                        }
                                    />

                                    <span>{optionLabel}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            );

        case "checkbox":
            return (
                <div>
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name={field.name}
                            checked={Boolean(value)}
                            onChange={(e) =>
                                onChange(
                                    field.id,
                                    e.target.checked
                                )
                            }
                            required={field.is_required}
                            className="h-4 w-4"
                        />

                        <span className="text-sm text-gray-700">
                            {field.label}
                            {field.is_required && (
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            )}
                        </span>
                    </label>
                </div>
            );

        case "country":
            return (
                <div>
                    <label
                        htmlFor={inputId}
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        {field.label}
                        {field.is_required && (
                            <span className="ml-1 text-red-500">*</span>
                        )}
                    </label>

                    <input
                        {...commonProps}
                        type="text"
                        placeholder="Country"
                    />
                </div>
            );

        case "text":
        default:
            return (
                <div>
                    <label
                        htmlFor={inputId}
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        {field.label}
                        {field.is_required && (
                            <span className="ml-1 text-red-500">*</span>
                        )}
                    </label>

                    <input
                        {...commonProps}
                        type="text"
                    />
                </div>
            );
    }
}