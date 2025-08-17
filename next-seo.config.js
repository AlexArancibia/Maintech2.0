module.exports = {
  titleTemplate: '%s | Maintech',
  defaultTitle: 'Maintech - El Futuro del Mantenimiento Tecnológico',
  description: 'Maintech es la plataforma líder en formación de mantenimiento tecnológico. Cursos especializados, certificaciones profesionales y la mejor educación técnica del sector.',
  canonical: 'https://maintech.com',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://maintech.com',
    site_name: 'Maintech',
    title: 'Maintech - El Futuro del Mantenimiento Tecnológico',
    description: 'Plataforma líder en formación de mantenimiento tecnológico. Cursos especializados y certificaciones profesionales.',
    images: [
      {
        url: 'https://maintech.com/iconotipo.png',
        width: 1200,
        height: 630,
        alt: 'Maintech - Mantenimiento Tecnológico',
      },
    ],
  },
  twitter: {
    handle: '@maintech',
    site: '@maintech',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'theme-color',
      content: '#2563eb',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default',
    },
    {
      name: 'apple-mobile-web-app-title',
      content: 'Maintech',
    },
    {
      name: 'application-name',
      content: 'Maintech',
    },
    {
      name: 'msapplication-TileColor',
      content: '#2563eb',
    },
    {
      name: 'msapplication-config',
      content: '/browserconfig.xml',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/iconotipo.png',
    },
    {
      rel: 'apple-touch-icon',
      href: '/iconotipo.png',
    },
    {
      rel: 'manifest',
      href: '/manifest.json',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
  ],
};
