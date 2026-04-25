import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://easyacct.us';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

export default function Seo({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
}) {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title.includes('EasyAcct') ? title : `${title} | EasyAcct`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="EasyAcct" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
