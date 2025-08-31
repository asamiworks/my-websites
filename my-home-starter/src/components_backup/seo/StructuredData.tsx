import { FC } from 'react';

interface BaseStructuredDataProps {
  type: string;
  data: Record<string, any>;
}

interface OrganizationProps {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    contactType: string;
  };
}

interface LocalBusinessProps extends OrganizationProps {
  priceRange?: string;
  servesCuisine?: string;
  openingHours?: string[];
  geo?: {
    latitude: number;
    longitude: number;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbListProps {
  items: BreadcrumbItem[];
}

interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

interface HowToProps {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQPageProps {
  mainEntity: FAQItem[];
}

interface ServiceProps {
  name: string;
  description: string;
  provider: OrganizationProps;
  serviceType: string;
  areaServed?: string[];
  offers?: {
    price: string;
    priceCurrency: string;
  };
}

const generateStructuredData = (type: string, data: any) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return {
    __html: JSON.stringify(structuredData, null, 2),
  };
};

export const Organization: FC<OrganizationProps> = (props) => {
  const data = {
    name: props.name,
    url: props.url,
    ...(props.logo && { logo: props.logo }),
    ...(props.description && { description: props.description }),
    ...(props.address && {
      address: {
        '@type': 'PostalAddress',
        ...props.address,
      },
    }),
    ...(props.contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        ...props.contactPoint,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={generateStructuredData('Organization', data)}
    />
  );
};

export const LocalBusiness: FC<LocalBusinessProps> = (props) => {
  const data = {
    name: props.name,
    url: props.url,
    ...(props.logo && { logo: props.logo }),
    ...(props.description && { description: props.description }),
    ...(props.priceRange && { priceRange: props.priceRange }),
    ...(props.address && {
      address: {
        '@type': 'PostalAddress',
        ...props.address,
      },
    }),
    ...(props.geo && {
      geo: {
        '@type': 'GeoCoordinates',
        ...props.geo,
      },
    }),
    ...(props.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ...props.aggregateRating,
      },
    }),
    ...(props.openingHours && { openingHours: props.openingHours }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={generateStructuredData('LocalBusiness', data)}
    />
  );
};

export const BreadcrumbList: FC<BreadcrumbListProps> = ({ items }) => {
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  }));

  const data = {
    itemListElement,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={generateStructuredData('BreadcrumbList', data)}
    />
  );
};

export const HowTo: FC<HowToProps> = (props) => {
  const data = {
    name: props.name,
    description: props.description,
    ...(props.totalTime && { totalTime: props.totalTime }),
    step: props.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
      ...(step.url && { url: step.url }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={generateStructuredData('HowTo', data)}
    />
  );
};

export const FAQPage: FC<FAQPageProps> = ({ mainEntity }) => {
  const data = {
    mainEntity: mainEntity.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={generateStructuredData('FAQPage', data)}
    />
  );
};

export const Service: FC<ServiceProps> = (props) => {
  const data = {
    name: props.name,
    description: props.description,
    serviceType: props.serviceType,
    provider: {
      '@type': 'Organization',
      ...props.provider,
    },
    ...(props.areaServed && { areaServed: props.areaServed }),
    ...(props.offers && {
      offers: {
        '@type': 'Offer',
        ...props.offers,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={generateStructuredData('Service', data)}
    />
  );
};