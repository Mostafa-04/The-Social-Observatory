<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>{{ $subjectText }}</title>
</head>

<body style="
    margin:0;
    padding:0;
    background-color:#f4f6f5;
    font-family:Arial, Helvetica, sans-serif;
    color:#1f2d2d;
    -webkit-text-size-adjust:100%;
">

<!-- Preheader -->
<div style="
    display:none;
    max-height:0;
    overflow:hidden;
    opacity:0;
    color:transparent;
">
    {{ $subjectText }}
</div>


<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background-color:#f4f6f5;padding:40px 15px;"
>
    <tr>
        <td align="center">

            <!-- Main Container -->
            <table
                width="900"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                    max-width:900px;
                    width:100%;
                    background:#ffffff;
                    border-radius:16px;
                    overflow:hidden;
                    border:1px solid #e1e5e3;
                "
            >

                <!-- ========================= -->
                <!-- HEADER -->
                <!-- ========================= -->

                <tr>
                    <td
                        align="center"
                        style="
                            background:#1f2d2d;
                            padding:32px 20px;
                        "
                    >

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

                        <div style="
                            font-size:23px;
                            font-weight:bold;
                            color:#ffffff;
                        ">
                            The Social Observatory
                        </div>

                        <div style="
                            margin-top:8px;
                            font-size:13px;
                            color:#cbd3d1;
                        ">
                            Think. Observe. Anticipate. Act.
                        </div>

                    </td>
                </tr>


                <!-- ========================= -->
                <!-- ORANGE LINE -->
                <!-- ========================= -->

                <tr>
                    <td style="
                        height:4px;
                        background:#bf5429;
                        font-size:0;
                        line-height:0;
                    ">
                        &nbsp;
                    </td>
                </tr>


                <!-- ========================= -->
                <!-- CONTENT -->
                <!-- ========================= -->

                <tr>
                    <td style="padding:40px 38px;">

                        <!-- Label -->
                        <div style="
                            font-size:13px;
                            color:#bf5429;
                            font-weight:bold;
                            text-transform:uppercase;
                            letter-spacing:1px;
                            margin-bottom:10px;
                        ">
                            The Social Observatory
                        </div>


                        <!-- Greeting -->
                        <p style="
                            margin:0 0 18px;
                            font-size:15px;
                            line-height:1.8;
                            color:#4f5b59;
                        ">
                            Bonjour
                            <strong style="color:#1f2d2d;">
                                {{ $contact->name }}
                            </strong>,
                        </p>


                        <!-- Message -->
                        <div style="
                            margin:0;
                            font-size:15px;
                            line-height:1.8;
                            color:#4f5b59;
                        ">
                            {!! $safeMessage !!}
                        </div>


                        <!-- Optional CTA -->
                        @if(isset($actionUrl) && $actionUrl)

                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="margin:30px 0 10px;"
                            >
                                <tr>
                                    <td align="left">

                                        <a
                                            href="{{ $actionUrl }}"
                                            style="
                                                display:inline-block;
                                                background:#bf5429;
                                                color:#ffffff;
                                                text-decoration:none;
                                                font-size:14px;
                                                font-weight:bold;
                                                padding:13px 24px;
                                                border-radius:8px;
                                            "
                                        >
                                            Découvrir davantage
                                        </a>

                                    </td>
                                </tr>
                            </table>

                        @endif


                        <!-- Closing -->
                        <p style="
                            margin:30px 0 0;
                            font-size:15px;
                            line-height:1.8;
                            color:#4f5b59;
                        ">
                            Cordialement,<br>

                            <strong style="color:#1f2d2d;">
                                L’équipe de l’Observatoire social
                            </strong>
                        </p>

                    </td>
                </tr>


                <!-- ========================= -->
                <!-- FOOTER -->
                <!-- ========================= -->

                <tr>
                    <td
                        align="center"
                        style="
                            background:#1f2d2d;
                            padding:25px 20px;
                        "
                    >

                        <div style="
                            font-size:13px;
                            color:#ffffff;
                            font-weight:bold;
                        ">
                            The Social Observatory
                        </div>

                        <div style="
                            margin-top:7px;
                            font-size:12px;
                            line-height:1.6;
                            color:#bfc8c6;
                        ">
                            Depuis Casablanca, pour une meilleure compréhension
                            du progrès social en Afrique.
                        </div>

                        <div style="
                            margin-top:15px;
                            font-size:11px;
                            color:#8f9a97;
                        ">
                            Think. Observe. Anticipate. Act.
                        </div>

                    </td>
                </tr>


            </table>

        </td>
    </tr>
</table>

</body>
</html>