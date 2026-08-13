<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">

    <title>
        Confirmation d'inscription
    </title>
</head>

<body style="font-family: Arial, sans-serif; background:#f5f5f5; padding:30px;">

    <div
        style="
            max-width:600px;
            margin:auto;
            background:white;
            padding:30px;
            border-radius:12px;
        "
    >

        <h1>
            Inscription confirmée
        </h1>

        <p>
            Bonjour
            <strong>
                {{ $registration->first_name }}
                {{ $registration->last_name }}
            </strong>,
        </p>

        <p>
            Nous vous confirmons que votre inscription
            à l'événement suivant a bien été enregistrée :
        </p>

        <div
            style="
                background:#f5f7fa;
                padding:20px;
                border-radius:10px;
                margin:20px 0;
            "
        >

            <h2>
                {{ $registration->event->title }}
            </h2>

            <p>
                <strong>Date :</strong>
                {{ $registration->event->date->format('d/m/Y') }}
            </p>

            <p>
                <strong>Horaire :</strong>
                {{ $registration->event->start_time }}
                -
                {{ $registration->event->end_time }}
            </p>

            <p>
                <strong>Lieu :</strong>
                {{ $registration->event->location }},
                {{ $registration->event->city }}
            </p>

        </div>

        <p>
            Merci pour votre inscription.
        </p>

        <p>
            Nous vous attendons avec plaisir à cet événement.
        </p>

        <hr>

        <p style="font-size:12px;color:#777;">
            Cet email a été envoyé automatiquement.
        </p>

    </div>

</body>

</html>