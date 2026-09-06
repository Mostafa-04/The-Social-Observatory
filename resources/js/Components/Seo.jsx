import { Head } from '@inertiajs/react';

export default function Seo({
    title,
    description,
    image = '/logo.png',
    type = 'website',
}) {
    const fullTitle = title
        ? `${title} | The Social Observatory`
        : 'The Social Observatory | Research & Social Anticipation';

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={window.location.origin} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="The Social Observatory" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Head>
    );
}