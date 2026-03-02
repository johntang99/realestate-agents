export interface ContentTemplate {
  id: string;
  label: string;
  content: Record<string, any>;
}

export const CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    id: 'basic',
    label: 'Basic (Hero + CTA)',
    content: {
      hero: {
        title: 'Page Title',
        subtitle: 'Page subtitle goes here',
        backgroundImage: '',
      },
      cta: {
        title: 'Ready to Get Started?',
        description: 'Add a short call to action description.',
        primaryCta: { text: 'Book Now', link: '/contact' },
        secondaryCta: { text: 'Learn More', link: '/services' },
      },
    },
  },
  {
    id: 'hero-only',
    label: 'Hero Only',
    content: {
      hero: {
        title: 'Page Title',
        subtitle: 'Page subtitle goes here',
        backgroundImage: '',
      },
    },
  },
  {
    id: 'empty',
    label: 'Empty JSON',
    content: {},
  },
];
