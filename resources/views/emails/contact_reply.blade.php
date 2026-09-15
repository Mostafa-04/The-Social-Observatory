<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
</head>

<body>

    <h2>{{ $subjectText }}</h2>
                            <div
                                style="font-size:15px;line-height:1.7;color:#5B6462;">

                                {!! $messageText !!}

                            </div>

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