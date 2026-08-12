<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>{{ $subjectText }}</title>
</head>

<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
        <tr>
            <td align="center">

                <table width="650" cellpadding="0" cellspacing="0"
                    style="background:#ffffff;border-radius:10px;overflow:hidden;">

                    {{-- Header --}}
                    <tr>
                        <td
                            style="background:#4f46e5;padding:30px;text-align:center;color:white;">

                            <h1 style="margin:0;font-size:30px;">
                                Newsletter
                            </h1>

                        </td>
                    </tr>

                    {{-- Content --}}
                    <tr>
                        <td style="padding:40px;">

                            <h2 style="margin-top:0;color:#111827;">
                                {{ $subjectText }}
                            </h2>

                            <div
                                style="font-size:16px;line-height:30px;color:#4b5563;white-space:pre-line;">

                                {!! nl2br(e($messageText)) !!}

                            </div>

                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td
                            style="padding:25px;text-align:center;background:#f9fafb;color:#6b7280;font-size:13px;">

                            © {{ date('Y') }}
                            The Social Observatory

                            <br><br>

                            Thank you for subscribing to our newsletter.

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>