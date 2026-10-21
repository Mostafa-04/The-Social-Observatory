<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>
        Confirmation d'inscription
    </title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f5; font-family:Arial, Helvetica, sans-serif; color:#1f2d2d;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0"
           style="background-color:#f4f6f5; padding:40px 15px;">

        <tr>
            <td align="center">

                <!-- Container -->
                <table width="900" cellpadding="0" cellspacing="0" border="0"
                       style="max-width:900px; width:100%; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e1e5e3;">

                    <!-- Header -->
                    <tr>
                        <td align="center"
                            style="background:#1f2d2d; padding:32px 20px;">

                            <img
                                src="{{ asset('/logo.png') }}"
                                alt="The Social Observatory"
                                width="110"
                                style="display:block; width:110px; max-width:110px; height:auto; margin:0 auto 18px; border-radius:10px;"
                            >

                            <div style="font-size:23px; font-weight:bold; color:#ffffff;">
                                The Social Observatory
                            </div>

                            <div style="margin-top:8px; font-size:13px; color:#cbd3d1;">
                                Think. Observe. Anticipate. Act.
                            </div>

                        </td>
                    </tr>

                    <!-- Orange line -->
                    <tr>
                        <td style="height:4px; background:#bf5429; font-size:0; line-height:0;">
                            &nbsp;
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding:40px 38px;">

                            <div style="font-size:13px; color:#bf5429; font-weight:bold; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">
                                Inscription confirmée
                            </div>

                            <h1 style="margin:0 0 22px; font-size:27px; line-height:1.3; color:#1f2d2d;">
                                Votre inscription est confirmée
                            </h1>

                            <p style="margin:0 0 18px; font-size:15px; line-height:1.8; color:#4f5b59;">
                                Bonjour
                                <strong style="color:#1f2d2d;">
                                    {{ $registration->first_name }}
                                    {{ $registration->last_name }}
                                </strong>,
                            </p>

                            <p style="margin:0 0 25px; font-size:15px; line-height:1.8; color:#4f5b59;">
                                Nous vous confirmons que votre inscription
                                à l'événement suivant a bien été enregistrée.
                            </p>

                            <!-- Event Card -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                                   style="background:#f8f9f7; border:1px solid #e3e7e5; border-radius:12px; margin:25px 0;">

                                <tr>
                                    <td style="padding:22px 24px;">

                                        <div style="font-size:12px; color:#7a8582; text-transform:uppercase; letter-spacing:.8px; margin-bottom:9px;">
                                            Événement concerné
                                        </div>

                                        <div style="font-size:17px; font-weight:bold; line-height:1.5; color:#1f2d2d; margin-bottom:18px;">
                                            {{ $registration->event->title }}
                                        </div>

                                        <table width="100%" cellpadding="0" cellspacing="0" border="0"
                                               style="border-top:1px solid #e3e7e5; padding-top:16px;">

                                            <tr>
                                                <td style="padding:8px 0; font-size:14px; line-height:1.7; color:#4f5b59;">
                                                    <strong style="color:#1f2d2d;">Date :</strong>
                                                    {{ $registration->event->date->format('d/m/Y') }}
                                                </td>
                                            </tr>

                                            <tr>
                                                <td style="padding:8px 0; font-size:14px; line-height:1.7; color:#4f5b59;">
                                                    <strong style="color:#1f2d2d;">Horaire :</strong>
                                                    {{ $registration->event->start_time }}
                                                    -
                                                    {{ $registration->event->end_time }}
                                                </td>
                                            </tr>

                                            <tr>
                                                <td style="padding:8px 0; font-size:14px; line-height:1.7; color:#4f5b59;">
                                                    <strong style="color:#1f2d2d;">Lieu :</strong>
                                                    {{ $registration->event->location }},
                                                    {{ $registration->event->city }}
                                                </td>
                                            </tr>

                                        </table>

                                    </td>
                                </tr>

                            </table>

                            <!-- Confirmation -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                                   style="margin:25px 0;">

                                <tr>

                                    <td width="45" valign="top">

                                        <div style="width:36px; height:36px; line-height:36px; text-align:center; background:#e9f4ef; border-radius:50%; color:#174f4b; font-size:18px;">
                                            ✓
                                        </div>

                                    </td>

                                    <td valign="top" style="padding-left:10px;">

                                        <div style="font-size:15px; font-weight:bold; color:#1f2d2d; margin-bottom:5px;">
                                            Votre place est réservée
                                        </div>

                                        <div style="font-size:14px; line-height:1.7; color:#66716e;">
                                            Nous vous attendons avec plaisir
                                            à cet événement. N'hésitez pas à nous
                                            contacter pour toute question.
                                        </div>

                                    </td>

                                </tr>

                            </table>

                            <p style="margin:25px 0 18px; font-size:15px; line-height:1.8; color:#4f5b59;">
                                Merci pour votre inscription et votre confiance.
                            </p>

                            <p style="margin:28px 0 0; font-size:15px; line-height:1.8; color:#4f5b59;">
                                Au plaisir de vous accueillir prochainement.
                            </p>

                            <p style="margin:25px 0 0; font-size:15px; line-height:1.8; color:#4f5b59;">
                                Cordialement,<br>

                                <strong style="color:#1f2d2d;">
                                    L'équipe de l'Observatoire social
                                </strong>
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center"
                            style="background:#1f2d2d; padding:25px 20px;">

                            <div style="font-size:13px; color:#ffffff; font-weight:bold;">
                                The Social Observatory
                            </div>

                            <div style="margin-top:7px; font-size:12px; color:#bfc8c6;">
                                Depuis Casablanca, pour une meilleure compréhension
                                du progrès social en Afrique.
                            </div>

                            <div style="margin-top:15px; font-size:11px; color:#8f9a97;">
                                Cet email a été envoyé automatiquement.
                            </div>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>

    </table>

</body>
</html>