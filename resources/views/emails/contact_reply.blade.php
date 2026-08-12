<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
</head>

<body>

    <h2>{{ $subjectText }}</h2>

    <p>
        {!! nl2br(e($messageText)) !!}
    </p>

    <br>

    <hr>

    <p>
        Best regards,
    </p>

    <strong>
        {{ config('mail.from.name') }}
    </strong>

</body>

</html>