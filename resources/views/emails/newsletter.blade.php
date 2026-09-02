<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>{{ $subjectText }}</title>
</head>

<body style="margin:0;padding:0;background:#F7F8F6;font-family:Arial,Helvetica,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F8F6;padding:40px 0;">
        <tr>
            <td align="center">

                <table width="650" cellpadding="0" cellspacing="0"
                    style="background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #D6D9D8;">

                    {{-- Header --}}
                    <tr>
                        <td
                            style="background:#324949;padding:30px;text-align:center;color:#ffffff;">

                            <h1 style="margin:0;font-size:26px;font-weight:600;">
                                Newsletter
                            </h1>

                        </td>
                    </tr>

                    {{-- Accent bar --}}
                    <tr>
                        <td style="background:#BF5429;height:4px;line-height:4px;font-size:0;">
                            &nbsp;
                        </td>
                    </tr>

                    {{-- Content --}}
                    <tr>
                        <td style="padding:40px;">

                            <h2 style="margin-top:0;margin-bottom:20px;color:#1f2d2d;font-size:22px;">
                                {{ $subjectText }}
                            </h2>

                            <div
                                style="font-size:15px;line-height:1.7;color:#5B6462;">

                                {!! $messageText !!}

                            </div>

                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td
                            style="padding:25px;text-align:center;background:#F7F8F6;color:#8A9290;font-size:12.5px;border-top:1px solid #D6D9D8;">

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