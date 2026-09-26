
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">

    <title>{{ $subjectLine }}</title>

    <style>
        /* Contenu HTML généré par ReactQuill */
        .email-content p {
            margin: 0 0 14px;
        }

        .email-content h1,
        .email-content h2,
        .email-content h3 {
            margin: 22px 0 10px;
            color: #1f2d2d;
            line-height: 1.3;
        }

        .email-content h1 {
            font-size: 24px;
        }

        .email-content h2 {
            font-size: 20px;
        }

        .email-content h3 {
            font-size: 17px;
        }

        .email-content ul,
        .email-content ol {
            margin: 0 0 14px;
            padding-left: 22px;
        }

        .email-content li {
            margin-bottom: 6px;
        }

        .email-content a {
            color: #bf5429;
            text-decoration: underline;
        }

        .email-content img {
            display: block;
            max-width: 100%;
            height: auto;
            margin: 15px 0;
            border-radius: 8px;
        }

        .email-content blockquote {
            margin: 16px 0;
            padding: 10px 16px;
            border-left: 3px solid #bf5429;
            color: #4f5b59;
            background-color: #f8f9f8;
        }

        .email-content strong {
            color: #1f2d2d;
        }

        @media only screen and (max-width: 640px) {
            .email-container {
                width: 100% !important;
            }

            .container-pad {
                padding: 30px 20px !important;
            }

            .header-title {
                font-size: 21px !important;
            }
        }
    </style>
</head>

<body
    style="
        margin:0;
        padding:0;
        background-color:#f4f6f5;
        font-family:Arial,Helvetica,sans-serif;
        color:#1f2d2d;
        -webkit-text-size-adjust:100%;
    "
>

<!-- Preheader -->
<div
    style="
        display:none;
        max-height:0;
        overflow:hidden;
        opacity:0;
        color:transparent;
        font-size:1px;
        line-height:1px;
    "
>
    {{ $subjectLine }}
</div>

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        width:100%;
        background-color:#f4f6f5;
        padding:40px 15px;
    "
>
    <tr>
        <td align="center">

            <!-- MAIN CONTAINER -->
            <table
                class="email-container"
                width="640"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                    width:100%;
                    max-width:640px;
                    background-color:#ffffff;
                    border:1px solid #e1e5e3;
                    border-radius:16px;
                    overflow:hidden;
                "
            >

                <!-- HEADER -->
                <tr>
                    <td
                        align="center"
                        style="
                            background-color:#1f2d2d;
                            padding:32px 20px;
                        "
                    >

                        <!-- LOGO -->
                        <img
                            src="{{ asset('/logo.png') }}"
                            alt="The Social Observatory"
                            width="110"
                            style="
                                display:block;
                                width:110px;
                                max-width:110px;
                                height:auto;
                                margin:0 auto 18px;
                                border-radius:10px;
                            "
                        >

                        <!-- TITLE -->
                        <div
                            class="header-title"
                            style="
                                font-size:23px;
                                line-height:1.3;
                                font-weight:bold;
                                color:#ffffff;
                            "
                        >
                            The Social Observatory
                        </div>

                        <!-- TAGLINE -->
                        <div
                            style="
                                margin-top:8px;
                                font-size:13px;
                                line-height:1.5;
                                color:#cbd3d1;
                            "
                        >
                            Think. Observe. Anticipate. Act.
                        </div>

                    </td>
                </tr>

                <!-- ORANGE LINE -->
                <tr>
                    <td
                        style="
                            height:4px;
                            background-color:#bf5429;
                            font-size:0;
                            line-height:0;
                        "
                    >
                        &nbsp;
                    </td>
                </tr>

                <!-- CONTENT -->
                <tr>
                    <td
                        class="container-pad"
                        style="
                            padding:40px 38px;
                        "
                    >

                        <!-- BRAND LABEL -->
                        <div
                            style="
                                margin-bottom:10px;
                                font-size:12px;
                                line-height:1.5;
                                font-weight:bold;
                                color:#bf5429;
                                text-transform:uppercase;
                                letter-spacing:1px;
                            "
                        >
                            The Social Observatory
                        </div>

                        <!-- SUBJECT -->
                        <h1
                            style="
                                margin:0 0 24px;
                                font-size:22px;
                                line-height:1.4;
                                font-weight:700;
                                color:#1f2d2d;
                            "
                        >
                            {{ $subjectLine }}
                        </h1>

                        <!-- GREETING -->
                        @if (!empty($recipientName))
                            <p
                                style="
                                    margin:0 0 20px;
                                    font-size:15px;
                                    line-height:1.8;
                                    color:#4f5b59;
                                "
                            >
                                Bonjour
                                <strong style="color:#1f2d2d;">
                                    {{ $recipientName }}
                                </strong>,
                            </p>
                        @endif

                        <!-- MESSAGE -->
                        <div
                            class="email-content"
                            style="
                                margin:0;
                                font-size:15px;
                                line-height:1.8;
                                color:#4f5b59;
                            "
                        >
                            {!! $htmlMessage !!}
                        </div>

                        <!-- CLOSING -->
                        <p
                            style="
                                margin:30px 0 0;
                                padding-top:20px;
                                border-top:1px solid #e8ebe9;
                                font-size:15px;
                                line-height:1.8;
                                color:#4f5b59;
                            "
                        >
                            Cordialement,<br>

                            <strong style="color:#1f2d2d;">
                                L’équipe de The Social Observatory
                            </strong>
                        </p>

                    </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                    <td
                        align="center"
                        style="
                            background-color:#1f2d2d;
                            padding:28px 20px;
                        "
                    >

                        <div
                            style="
                                font-size:14px;
                                line-height:1.5;
                                font-weight:bold;
                                color:#ffffff;
                            "
                        >
                            The Social Observatory
                        </div>

                        <div
                            style="
                                margin-top:8px;
                                font-size:12px;
                                line-height:1.7;
                                color:#bfc8c6;
                            "
                        >
                            Think. Observe. Anticipate. Act.
                        </div>

                        <div
                            style="
                                margin-top:14px;
                                font-size:11px;
                                line-height:1.6;
                                color:#8f9a97;
                            "
                        >
                            Depuis Casablanca, pour une meilleure compréhension
                            du progrès social en Afrique.
                        </div>

                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>

</body>
</html>
