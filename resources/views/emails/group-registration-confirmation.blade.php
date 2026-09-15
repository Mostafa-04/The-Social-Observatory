
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Confirmation de votre inscription</title>
</head>

<body style="margin:0; padding:0; background:#f7f8f6; font-family:Arial, Helvetica, sans-serif; color:#1f2d2d;">

    <div style="max-width:600px; margin:40px auto; background:#ffffff; border:1px solid #d6d9d8; border-radius:12px; overflow:hidden;">

        <div style="background:#1f2d2d; padding:30px; text-align:center;">
            <h1 style="margin:0; color:#ffffff; font-size:24px;">
                The Social Observatory
            </h1>
        </div>

        <div style="padding:35px;">

            <h2 style="margin-top:0; color:#bf5429; font-size:22px;">
                Merci pour votre inscription
            </h2>

            <p style="font-size:15px; line-height:1.7;">
                Bonjour {{ $fullName }},
            </p>

            <p style="font-size:15px; line-height:1.7;">
                Nous vous confirmons que votre demande pour rejoindre
                notre groupe de travail a bien été reçue.
            </p>

            <div style="margin:25px 0; padding:20px; background:#f7f8f6; border-left:4px solid #bf5429; border-radius:6px;">
                <p style="margin:0 0 8px; font-size:13px; color:#5f6967;">
                    Groupe sélectionné
                </p>

                <p style="margin:0; font-size:16px; font-weight:bold; color:#1f2d2d;">
                    {{ $groupType }}
                </p>
            </div>

            <p style="font-size:15px; line-height:1.7;">
                Notre équipe va maintenant examiner votre demande.
                Nous reviendrons vers vous prochainement avec les
                prochaines étapes.
            </p>

            <p style="font-size:15px; line-height:1.7;">
                Nous vous remercions pour votre intérêt et votre volonté
                de contribuer à cette initiative.
            </p>

            <p style="font-size:15px; line-height:1.7; margin-bottom:0;">
                Cordialement,<br>
                <strong>The Social Observatory</strong>
            </p>

        </div>

        <div style="background:#f7f8f6; padding:20px; text-align:center; font-size:12px; color:#5f6967;">
            Think. Observe. Anticipate. Act.
        </div>

    </div>

</body>
</html>
