'use client';

import { useState, useCallback } from 'react';
import { Button, Input, Select, Badge } from '@/components/ui';
import Checkbox from '@/components/ui/Checkbox';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  templateSites: Array<{ id: string; name: string }>;
}

interface Agent {
  name: string;
  title: string;
  role: string;
  email: string;
  phone: string;
  languages: string[];
  specialties: string;
  licenseNumber: string;
}

interface StepState {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'done' | 'error';
  message: string;
  duration: number;
}

interface GenerationResult {
  siteId: string;
  entries: number;
  services: number;
  domains: number;
  errors: string[];
  warnings: string[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const RE_VERTICALS: Record<string, Array<{ slug: string; label: string }>> = {
  'Core Services': [
    { slug: 'buying', label: 'Buy a Home' },
    { slug: 'selling', label: 'Sell Your Home' },
    { slug: 'home-valuation', label: 'Home Valuation' },
  ],
  'Specialty Services': [
    { slug: 'investing', label: 'Investment Properties' },
    { slug: 'relocating', label: 'Relocation Services' },
    { slug: 'new-construction', label: 'New Construction' },
  ],
};

const BRAND_VARIANTS = [
  {
    id: 'navy-gold',
    label: 'Navy & Gold',
    primary: '#1A2744',
    secondary: '#C9A96E',
  },
  {
    id: 'slate-sage',
    label: 'Slate & Sage',
    primary: '#374151',
    secondary: '#6B8E6B',
  },
  {
    id: 'midnight-copper',
    label: 'Midnight & Copper',
    primary: '#1E293B',
    secondary: '#B87333',
  },
  {
    id: 'charcoal-emerald',
    label: 'Charcoal & Emerald',
    primary: '#2D3748',
    secondary: '#2E6B4F',
  },
  {
    id: 'burgundy-cream',
    label: 'Burgundy & Cream',
    primary: '#4A1942',
    secondary: '#DDA15E',
  },
];

const PIPELINE_STEPS = [
  { id: 'O1', label: 'Clone' },
  { id: 'O2', label: 'Brand' },
  { id: 'O3', label: 'Prune Verticals' },
  { id: 'O4', label: 'Content Replacement' },
  { id: 'O5', label: 'AI Content' },
  { id: 'O6', label: 'Cleanup' },
  { id: 'O7', label: 'Verify' },
];

const LOCALE_MAP: Record<string, string> = { English: 'en', Chinese: 'zh' };
const LANGUAGE_OPTIONS = ['English', 'Chinese'];

const BROKER_LANGUAGE_OPTIONS = ['English', 'Chinese', 'Spanish', 'Korean'];

function createInitialAgent(): Agent {
  return {
    name: '',
    title: 'Licensed Real Estate Agent',
    role: 'agent',
    email: '',
    phone: '',
    languages: ['English'],
    specialties: '',
    licenseNumber: '',
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getAllVerticalSlugs(): string[] {
  return Object.values(RE_VERTICALS)
    .flat()
    .map((v) => v.slug);
}

async function parseApiError(response: Response, fallback: string) {
  const text = await response.text();
  if (!text) return fallback;
  try {
    const parsed = JSON.parse(text) as { message?: string };
    return parsed.message || fallback;
  } catch {
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// CollapsibleSection
// ---------------------------------------------------------------------------

function CollapsibleSection({
  title,
  defaultOpen,
  badge,
  children,
}: {
  title: string;
  defaultOpen: boolean;
  badge?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        className="w-full bg-gray-50 px-6 py-4 flex items-center justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {badge && (
            <Badge variant="info" size="sm">
              {badge}
            </Badge>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`transition-all duration-200 ${
          open
            ? 'max-h-[4000px] opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-6 py-5 bg-white space-y-4">{children}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// OnboardingWizard
// ---------------------------------------------------------------------------

export function OnboardingWizard({ templateSites }: Props) {
  // Phase
  const [phase, setPhase] = useState<'form' | 'generating' | 'done' | 'error'>(
    'form',
  );

  // Section 1: Identity & Template
  const [businessName, setBusinessName] = useState('');
  const [siteId, setSiteId] = useState('');
  const [cloneFrom, setCloneFrom] = useState(
    templateSites[0]?.id || 'jinpanghomes',
  );

  // Section 2: Principal Broker Info
  const [brokerCompany, setBrokerCompany] = useState('');
  const [brokerTitle, setBrokerTitle] = useState('Licensed Real Estate Broker');
  const [licenseState, setLicenseState] = useState('');
  const [brokerLicenseNumber, setBrokerLicenseNumber] = useState('');
  const [principalBrokerLicense, setPrincipalBrokerLicense] = useState('');
  const [brokerLanguages, setBrokerLanguages] = useState<string[]>(['English']);
  const [brokerSpecialties, setBrokerSpecialties] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [transactionCount, setTransactionCount] = useState('');

  // Section 3: Team Agents
  const [agent, setAgent] = useState<Agent>(createInitialAgent);

  // Section 4: Location & Contact
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [county, setCounty] = useState('');

  // Section 5: Office Hours
  const [weekdays, setWeekdays] = useState(
    'Mon\u2013Fri: 9:00 AM \u2013 6:00 PM',
  );
  const [saturday, setSaturday] = useState('Sat: 10:00 AM \u2013 4:00 PM');
  const [sunday, setSunday] = useState('Sun: By appointment');

  // Section 6: Business Verticals
  const [selectedVerticals, setSelectedVerticals] = useState<string[]>(
    getAllVerticalSlugs(),
  );

  // Section 7: Brand
  const [brandVariant, setBrandVariant] = useState('navy-gold');
  const [primaryOverride, setPrimaryOverride] = useState('');

  // Section 8: Locales & Domain
  const [supportedLocales, setSupportedLocales] = useState<string[]>(['en']);
  const [defaultLocale, setDefaultLocale] = useState('en');
  const [prodDomain, setProdDomain] = useState('');
  const [devDomain, setDevDomain] = useState('');

  // Section 9: Content Tone
  const [voice, setVoice] = useState('warm-professional');
  const [targetDemographic, setTargetDemographic] = useState('');
  const [usps, setUsps] = useState<string[]>([]);

  // Section 10: Social Media
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [wechat, setWechat] = useState('');

  // Section 11: License & Compliance
  const [brokerageType, setBrokerageType] = useState(
    'Licensed Real Estate Broker',
  );
  const [mlsDisclaimer, setMlsDisclaimer] = useState('');
  const [equalHousingText, setEqualHousingText] = useState('');
  const [fairHousingStatement, setFairHousingStatement] = useState('');

  // Section 12: Brokerage Stats
  const [totalVolume, setTotalVolume] = useState('');
  const [yearsInBusiness, setYearsInBusiness] = useState('');
  const [totalTransactions, setTotalTransactions] = useState('');
  const [fiveStarReviews, setFiveStarReviews] = useState('');
  const [saleToListRatio, setSaleToListRatio] = useState('');
  const [avgDaysOnMarket, setAvgDaysOnMarket] = useState('');

  // Pipeline state
  const [skipAi, setSkipAi] = useState(false);
  const [steps, setSteps] = useState<StepState[]>([]);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // ---------------------------------------------------------------------------
  // Auto-generation on businessName change
  // ---------------------------------------------------------------------------
  const handleBusinessNameChange = useCallback((value: string) => {
    setBusinessName(value);
    const slug = slugify(value);
    setSiteId(slug);
    setProdDomain(`${slug}.com`);
    setDevDomain(`${slug}.local`);
  }, []);

  // ---------------------------------------------------------------------------
  // Vertical toggling
  // ---------------------------------------------------------------------------
  const toggleVertical = (slug: string) => {
    setSelectedVerticals((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const selectAllInCategory = (category: string) => {
    const slugs = RE_VERTICALS[category].map((v) => v.slug);
    setSelectedVerticals((prev) => [...new Set([...prev, ...slugs])]);
  };

  const deselectAllInCategory = (category: string) => {
    const slugs = new Set(RE_VERTICALS[category].map((v) => v.slug));
    setSelectedVerticals((prev) => prev.filter((s) => !slugs.has(s)));
  };

  // ---------------------------------------------------------------------------
  // Locale toggling
  // ---------------------------------------------------------------------------
  const toggleLocale = (locale: string) => {
    if (locale === 'en') return; // English always required
    setSupportedLocales((prev) => {
      const next = prev.includes(locale)
        ? prev.filter((l) => l !== locale)
        : [...prev, locale];
      if (!next.includes(defaultLocale)) setDefaultLocale('en');
      return next;
    });
  };

  // ---------------------------------------------------------------------------
  // Broker language toggling
  // ---------------------------------------------------------------------------
  const toggleBrokerLanguage = (lang: string) => {
    setBrokerLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
  };

  // ---------------------------------------------------------------------------
  // Agent management
  // ---------------------------------------------------------------------------

  const updateAgent = (field: keyof Agent, value: any) => {
    setAgent((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAgentLanguage = (lang: string) => {
    setAgent((prev) => {
      const languages = prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang];
      return { ...prev, languages };
    });
  };

  // ---------------------------------------------------------------------------
  // USP management
  // ---------------------------------------------------------------------------
  const addUsp = () => setUsps((prev) => [...prev, '']);

  const updateUsp = (index: number, value: string) => {
    setUsps((prev) => prev.map((u, i) => (i === index ? value : u)));
  };

  const removeUsp = (index: number) => {
    setUsps((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------------------------------------------------------------------
  // Form validation
  // ---------------------------------------------------------------------------
  const isFormValid =
    businessName.trim() !== '' &&
    siteId.trim() !== '' &&
    cloneFrom !== '' &&
    selectedVerticals.length > 0;

  // ---------------------------------------------------------------------------
  // Build intake JSON
  // ---------------------------------------------------------------------------
  const buildIntakeJson = () => {
    const normalizedAgentLanguages =
      agent.languages.length > 0 ? agent.languages : brokerLanguages;
    const normalizedAgentSpecialties =
      agent.specialties.trim() || brokerSpecialties.trim() || undefined;

    return {
      clientId: siteId,
      templateSiteId: cloneFrom,
      skipAi,
      business: {
        name: businessName,
        brokerCompany: brokerCompany || undefined,
        brokerTitle: brokerTitle || undefined,
        languages: brokerLanguages,
        specialties: brokerSpecialties
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        tagline: undefined,
        subtagline: undefined,
      },
      agent: {
        name: agent.name || undefined,
        title: agent.title || undefined,
        role: agent.role || 'principal_broker',
        email: agent.email || email || undefined,
        phone: agent.phone || phone || undefined,
        languages: normalizedAgentLanguages,
        specialties: normalizedAgentSpecialties,
        licenseNumber:
          agent.licenseNumber || principalBrokerLicense || undefined,
      },
      location: {
        address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        zip: zip || undefined,
        phone: phone || undefined,
        email: email || undefined,
        county: county || undefined,
      },
      hours: {
        weekdays: weekdays || undefined,
        saturday: saturday || undefined,
        sunday: sunday || undefined,
      },
      services: {
        enabled: selectedVerticals,
      },
      brand: {
        variant: brandVariant,
        primaryColor: primaryOverride || undefined,
      },
      locales: {
        supported: supportedLocales,
        default: defaultLocale,
      },
      domains: {
        production: prodDomain || undefined,
        dev: devDomain || undefined,
      },
      contentTone: {
        voice,
        targetDemographic: targetDemographic || undefined,
        uniqueSellingPoints: usps.filter(Boolean),
      },
      social: {
        facebook: facebook || undefined,
        instagram: instagram || undefined,
        youtube: youtube || undefined,
        linkedin: linkedin || undefined,
        twitter: twitter || undefined,
        tiktok: tiktok || undefined,
        wechat: wechat || undefined,
      },
      license: {
        licenseNumber: brokerLicenseNumber || undefined,
        brokerCompany: brokerCompany || undefined,
        brokerTitle: brokerTitle || undefined,
        licenseState: licenseState || undefined,
        brokerageType: brokerageType || undefined,
      },
      compliance: {
        mlsDisclaimer: mlsDisclaimer || undefined,
        equalHousingText: equalHousingText || undefined,
        fairHousingStatement: fairHousingStatement || undefined,
      },
      stats: {
        totalVolume: totalVolume || undefined,
        yearsInBusiness: yearsInBusiness || undefined,
        totalTransactions: totalTransactions || undefined,
        fiveStarReviews: fiveStarReviews || undefined,
        saleToListRatio: saleToListRatio || undefined,
        avgDaysOnMarket: avgDaysOnMarket || undefined,
      },
    };
  };

  // ---------------------------------------------------------------------------
  // SSE Generation
  // ---------------------------------------------------------------------------
  const handleGenerateSite = async () => {
    setPhase('generating');
    setSteps(
      PIPELINE_STEPS.map((s) => ({
        ...s,
        status: 'pending',
        message: '',
        duration: 0,
      })),
    );

    try {
      const intake = buildIntakeJson();
      const response = await fetch('/api/admin/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intake),
      });

      if (!response.ok) {
        const message = await parseApiError(
          response,
          'Failed to start onboarding',
        );
        throw new Error(message);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        let currentEvent = '';
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7);
          } else if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (currentEvent === 'progress') {
              setSteps((prev) =>
                prev.map((s) => (s.id === data.step ? { ...s, ...data } : s)),
              );
            } else if (currentEvent === 'complete') {
              setResult(data);
              setPhase('done');
            } else if (currentEvent === 'error') {
              setErrorMessage(data.message);
              setPhase('error');
            }
          }
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message);
      setPhase('error');
    }
  };

  // ---------------------------------------------------------------------------
  // Reset form
  // ---------------------------------------------------------------------------
  const resetForm = () => {
    setPhase('form');
    setBusinessName('');
    setSiteId('');
    setCloneFrom(templateSites[0]?.id || 'jinpanghomes');
    setBrokerCompany('');
    setBrokerTitle('Licensed Real Estate Broker');
    setLicenseState('');
    setBrokerLicenseNumber('');
    setPrincipalBrokerLicense('');
    setBrokerLanguages(['English']);
    setBrokerSpecialties('');
    setYearsExperience('');
    setTransactionCount('');
    setAgent(createInitialAgent());
    setAddress('');
    setCity('');
    setState('');
    setZip('');
    setPhone('');
    setEmail('');
    setCounty('');
    setWeekdays('Mon\u2013Fri: 9:00 AM \u2013 6:00 PM');
    setSaturday('Sat: 10:00 AM \u2013 4:00 PM');
    setSunday('Sun: By appointment');
    setSelectedVerticals(getAllVerticalSlugs());
    setBrandVariant('navy-gold');
    setPrimaryOverride('');
    setSupportedLocales(['en']);
    setDefaultLocale('en');
    setProdDomain('');
    setDevDomain('');
    setVoice('warm-professional');
    setTargetDemographic('');
    setUsps([]);
    setFacebook('');
    setInstagram('');
    setYoutube('');
    setLinkedin('');
    setTwitter('');
    setTiktok('');
    setWechat('');
    setBrokerageType('Licensed Real Estate Broker');
    setMlsDisclaimer('');
    setEqualHousingText('');
    setFairHousingStatement('');
    setTotalVolume('');
    setYearsInBusiness('');
    setTotalTransactions('');
    setFiveStarReviews('');
    setSaleToListRatio('');
    setAvgDaysOnMarket('');
    setSkipAi(false);
    setSteps([]);
    setResult(null);
    setErrorMessage('');
  };

  // =========================================================================
  // RENDER: Generating Phase
  // =========================================================================
  if (phase === 'generating') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="border border-gray-200 rounded-xl bg-white p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Generating Site...
          </h2>
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-start gap-3">
                {/* Status icon */}
                <div className="mt-0.5 flex-shrink-0">
                  {step.status === 'pending' && (
                    <span className="inline-block w-5 h-5 text-center text-gray-400 leading-5">
                      &#9675;
                    </span>
                  )}
                  {step.status === 'running' && (
                    <svg
                      className="animate-spin w-5 h-5 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  )}
                  {step.status === 'done' && (
                    <span className="inline-block w-5 h-5 text-center text-green-600 leading-5 font-bold">
                      &#10003;
                    </span>
                  )}
                  {step.status === 'error' && (
                    <span className="inline-block w-5 h-5 text-center text-red-600 leading-5 font-bold">
                      &#10007;
                    </span>
                  )}
                </div>

                {/* Label + message */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        step.status === 'running'
                          ? 'text-blue-700'
                          : step.status === 'done'
                          ? 'text-green-700'
                          : step.status === 'error'
                          ? 'text-red-700'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                    {step.status === 'done' && step.duration > 0 && (
                      <Badge variant="success" size="sm">
                        {(step.duration / 1000).toFixed(1)}s
                      </Badge>
                    )}
                  </div>
                  {step.message && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {step.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Done Phase
  // =========================================================================
  if (phase === 'done' && result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="border border-gray-200 rounded-xl bg-white p-8">
          {/* Success banner */}
          <div className="flex items-center gap-3 mb-6 bg-green-50 border border-green-200 rounded-lg px-5 py-4">
            <span className="text-green-600 text-2xl">&#10003;</span>
            <div>
              <h2 className="text-lg font-bold text-green-800">
                Site Generated Successfully
              </h2>
              <p className="text-sm text-green-700">
                {businessName} is ready to go.
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <p className="text-xs text-gray-500">Entries</p>
              <p className="text-lg font-semibold text-gray-900">
                {result.entries}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <p className="text-xs text-gray-500">Verticals</p>
              <p className="text-lg font-semibold text-gray-900">
                {result.services}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <p className="text-xs text-gray-500">Locales</p>
              <p className="text-lg font-semibold text-gray-900">
                {supportedLocales.join(', ')}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <p className="text-xs text-gray-500">Domains</p>
              <p className="text-lg font-semibold text-gray-900 truncate">
                {result.domains}
              </p>
            </div>
          </div>

          {/* Verification issues */}
          {result.errors && result.errors.length > 0 && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-800 mb-2">Errors</p>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {result.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
          {result.warnings && result.warnings.length > 0 && (
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm font-medium text-amber-800 mb-2">
                Warnings
              </p>
              <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
                {result.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                (window.location.href = `/admin/content?siteId=${result.siteId}&locale=en`)
              }
            >
              View in Content Editor
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(
                  `http://${devDomain || siteId + '.local'}:3070/en`,
                  '_blank',
                )
              }
            >
              Preview Site
            </Button>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              Onboard Another Client
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Error Phase
  // =========================================================================
  if (phase === 'error') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="border border-gray-200 rounded-xl bg-white p-8">
          <div className="flex items-center gap-3 mb-6 bg-red-50 border border-red-200 rounded-lg px-5 py-4">
            <span className="text-red-600 text-2xl">&#10007;</span>
            <div>
              <h2 className="text-lg font-bold text-red-800">
                Generation Failed
              </h2>
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={() => setPhase('form')}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Form Phase
  // =========================================================================
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Section 1: Identity & Template */}
      <CollapsibleSection
        title="Identity & Template"
        defaultOpen
        badge="Required"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Business Name"
            value={businessName}
            onChange={(e) => handleBusinessNameChange(e.target.value)}
            placeholder="e.g. Pacific Coast Realty"
            required
            fullWidth
          />
          <Input
            label="Site ID"
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            placeholder="auto-generated"
            fullWidth
          />
        </div>
        <Select
          label="Clone From"
          value={cloneFrom}
          onChange={(e) => setCloneFrom(e.target.value)}
          options={templateSites.map((s) => ({ value: s.id, label: s.name }))}
          fullWidth
        />
      </CollapsibleSection>

      {/* Section 2: Real Estate Agent */}
      <CollapsibleSection
        title="Real Estate Agent"
        defaultOpen={true}
        badge="Required"
      >
        <div className="border border-gray-100 rounded-lg p-4 mb-3 bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <Input
              label="Name"
              value={agent.name}
              onChange={(e) => updateAgent('name', e.target.value)}
              placeholder="Agent name"
              fullWidth
            />
            <Input
              label="Title"
              value={agent.title}
              onChange={(e) => updateAgent('title', e.target.value)}
              placeholder="Licensed Real Estate Agent"
              fullWidth
            />
            <Input
              label="Role"
              value={agent.role}
              onChange={(e) => updateAgent('role', e.target.value)}
              placeholder="agent"
              fullWidth
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <Input
              label="Email"
              value={agent.email}
              onChange={(e) => updateAgent('email', e.target.value)}
              placeholder="agent@example.com"
              fullWidth
            />
            <Input
              label="Phone"
              value={agent.phone}
              onChange={(e) => updateAgent('phone', e.target.value)}
              placeholder="(555) 123-4567"
              fullWidth
            />
          </div>
          <div className="mb-3">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Languages
            </label>
            <div className="flex flex-wrap gap-3">
              {BROKER_LANGUAGE_OPTIONS.map((lang) => (
                <Checkbox
                  key={`agent-${lang}`}
                  label={lang}
                  checked={agent.languages.includes(lang)}
                  onChange={() => toggleAgentLanguage(lang)}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
            <Input
              label="Specialties"
              value={agent.specialties}
              onChange={(e) => updateAgent('specialties', e.target.value)}
              placeholder="Buyers, Luxury Homes (comma-separated)"
              fullWidth
            />
            <Input
              label="License Number"
              value={agent.licenseNumber}
              onChange={(e) => updateAgent('licenseNumber', e.target.value)}
              placeholder="Agent license #"
              fullWidth
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Section 3: Broker Company */}
      <CollapsibleSection title="Broker Company" defaultOpen badge="Required">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Broker Company Name"
            value={brokerCompany}
            onChange={(e) => setBrokerCompany(e.target.value)}
            placeholder="e.g. Pacific Coast Realty"
            fullWidth
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="License State"
            value={licenseState}
            onChange={(e) => setLicenseState(e.target.value)}
            placeholder="e.g. NY, CA"
            fullWidth
          />
          <Input
            label="Brokerage License Number"
            value={brokerLicenseNumber}
            onChange={(e) => setBrokerLicenseNumber(e.target.value)}
            placeholder="Brokerage license #"
            fullWidth
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Broker Languages
          </label>
          <div className="flex flex-wrap gap-4">
            {BROKER_LANGUAGE_OPTIONS.map((lang) => (
              <Checkbox
                key={lang}
                label={lang}
                checked={brokerLanguages.includes(lang)}
                onChange={() => toggleBrokerLanguage(lang)}
              />
            ))}
          </div>
        </div>

        <Input
          label="Brokerage Specialties"
          value={brokerSpecialties}
          onChange={(e) => setBrokerSpecialties(e.target.value)}
          placeholder="Buyers, Sellers, Investment, Relocation (comma-separated)"
          fullWidth
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Years of Experience"
            type="number"
            value={yearsExperience}
            onChange={(e) => setYearsExperience(e.target.value)}
            placeholder="e.g. 15"
            fullWidth
          />
          <Input
            label="Transaction Count So Far"
            type="number"
            value={transactionCount}
            onChange={(e) => setTransactionCount(e.target.value)}
            placeholder="e.g. 500"
            fullWidth
          />
        </div>
      </CollapsibleSection>

      {/* Section 4: Location & Contact */}
      <CollapsibleSection
        title="Location & Contact"
        defaultOpen
        badge="Required"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, Suite 200"
              fullWidth
            />
          </div>
          <Input
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Irvine"
            fullWidth
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="CA"
              maxLength={2}
              fullWidth
            />
            <Input
              label="Zip"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="92618"
              fullWidth
            />
          </div>
          <Input
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(949) 555-0234"
            fullWidth
          />
          <Input
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="info@example.com"
            fullWidth
          />
          <Input
            label="County"
            value={county}
            onChange={(e) => setCounty(e.target.value)}
            placeholder="e.g. Orange County"
            fullWidth
          />
        </div>
      </CollapsibleSection>

      {/* Section 5: Office Hours */}
      <CollapsibleSection title="Office Hours" defaultOpen={false}>
        <div className="space-y-3">
          <Input
            label="Weekdays"
            value={weekdays}
            onChange={(e) => setWeekdays(e.target.value)}
            placeholder="Mon-Fri: 9:00 AM - 6:00 PM"
            fullWidth
          />
          <Input
            label="Saturday"
            value={saturday}
            onChange={(e) => setSaturday(e.target.value)}
            placeholder="Sat: 10:00 AM - 4:00 PM"
            fullWidth
          />
          <Input
            label="Sunday"
            value={sunday}
            onChange={(e) => setSunday(e.target.value)}
            placeholder="Sun: By appointment"
            fullWidth
          />
        </div>
      </CollapsibleSection>

      {/* Section 6: Business Verticals */}
      <CollapsibleSection
        title="Business Verticals"
        defaultOpen
        badge="Required"
      >
        <div className="space-y-5">
          {Object.entries(RE_VERTICALS).map(([category, verticals]) => (
            <div key={category}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-800">
                  {category}
                </h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => selectAllInCategory(category)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Select All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={() => deselectAllInCategory(category)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {verticals.map((v) => (
                  <Checkbox
                    key={v.slug}
                    label={v.label}
                    checked={selectedVerticals.includes(v.slug)}
                    onChange={() => toggleVertical(v.slug)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {selectedVerticals.length} of {getAllVerticalSlugs().length} verticals
          selected
        </p>
      </CollapsibleSection>

      {/* Section 7: Brand */}
      <CollapsibleSection title="Brand" defaultOpen badge="Required">
        <div className="space-y-3">
          {BRAND_VARIANTS.map((variant) => (
            <label
              key={variant.id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="radio"
                name="brandVariant"
                value={variant.id}
                checked={brandVariant === variant.id}
                onChange={(e) => setBrandVariant(e.target.value)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded border border-gray-300"
                  style={{ backgroundColor: variant.primary }}
                />
                <div
                  className="w-5 h-5 rounded border border-gray-300"
                  style={{ backgroundColor: variant.secondary }}
                />
                <span className="text-sm text-gray-700">{variant.label}</span>
              </div>
            </label>
          ))}
        </div>
        <div className="mt-4 max-w-xs">
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            Primary Color Override
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={
                primaryOverride ||
                BRAND_VARIANTS.find((v) => v.id === brandVariant)!.primary
              }
              onChange={(e) => setPrimaryOverride(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border border-gray-300"
            />
            <span className="text-sm text-gray-500">
              {primaryOverride || 'Using variant default'}
            </span>
          </div>
        </div>
      </CollapsibleSection>

      {/* Section 8: Locales & Domain */}
      <CollapsibleSection title="Locales & Domain" defaultOpen badge="Required">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Supported Locales
          </label>
          <div className="flex flex-wrap gap-4">
            <Checkbox label="English" checked disabled />
            <Checkbox
              label="Chinese"
              checked={supportedLocales.includes('zh')}
              onChange={() => toggleLocale('zh')}
            />
          </div>
        </div>
        <Select
          label="Default Locale"
          value={defaultLocale}
          onChange={(e) => setDefaultLocale(e.target.value)}
          options={supportedLocales.map((l) => ({
            value: l,
            label: l.toUpperCase(),
          }))}
          fullWidth
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Production Domain"
            value={prodDomain}
            onChange={(e) => setProdDomain(e.target.value)}
            placeholder="example.com"
            fullWidth
          />
          <Input
            label="Dev Domain"
            value={devDomain}
            onChange={(e) => setDevDomain(e.target.value)}
            placeholder="example.local"
            fullWidth
          />
        </div>
      </CollapsibleSection>

      {/* Section 9: Content Tone (optional) */}
      <CollapsibleSection title="Content Tone" defaultOpen={false}>
        <Select
          label="Voice"
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
          options={[
            { value: 'warm-professional', label: 'Warm & Professional' },
            { value: 'authoritative', label: 'Authoritative' },
            { value: 'casual-friendly', label: 'Casual & Friendly' },
          ]}
          fullWidth
        />
        <Input
          label="Target Demographic"
          value={targetDemographic}
          onChange={(e) => setTargetDemographic(e.target.value)}
          placeholder="First-time buyers, luxury home seekers, investors"
          fullWidth
        />
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Unique Selling Points
          </label>
          {usps.map((usp, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <Input
                value={usp}
                onChange={(e) => updateUsp(i, e.target.value)}
                placeholder="e.g. #1 brokerage in Orange County"
                fullWidth
              />
              <button
                type="button"
                onClick={() => removeUsp(i)}
                className="text-red-500 hover:text-red-700 text-sm flex-shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addUsp}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + Add USP
          </button>
        </div>
      </CollapsibleSection>

      {/* Section 10: Social Media (optional) */}
      <CollapsibleSection title="Social Media" defaultOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Facebook"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            placeholder="https://facebook.com/..."
            fullWidth
          />
          <Input
            label="Instagram"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="https://instagram.com/..."
            fullWidth
          />
          <Input
            label="YouTube"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
            placeholder="https://youtube.com/..."
            fullWidth
          />
          <Input
            label="LinkedIn"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="https://linkedin.com/company/..."
            fullWidth
          />
          <Input
            label="Twitter / X"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            placeholder="https://x.com/..."
            fullWidth
          />
          <Input
            label="TikTok"
            value={tiktok}
            onChange={(e) => setTiktok(e.target.value)}
            placeholder="https://tiktok.com/@..."
            fullWidth
          />
          <Input
            label="WeChat"
            value={wechat}
            onChange={(e) => setWechat(e.target.value)}
            placeholder="WeChat ID or link"
            fullWidth
          />
        </div>
      </CollapsibleSection>

      {/* Section 11: License & Compliance (optional) */}
      <CollapsibleSection title="License & Compliance" defaultOpen={false}>
        <Input
          label="Brokerage Type"
          value={brokerageType}
          onChange={(e) => setBrokerageType(e.target.value)}
          placeholder="Licensed Real Estate Broker"
          fullWidth
        />
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            MLS Disclaimer
          </label>
          <textarea
            value={mlsDisclaimer}
            onChange={(e) => setMlsDisclaimer(e.target.value)}
            placeholder="Based on information from the MLS as of [date]. All data, including all measurements and calculations..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            Equal Housing Text
          </label>
          <textarea
            value={equalHousingText}
            onChange={(e) => setEqualHousingText(e.target.value)}
            placeholder="We are committed to providing an inclusive and welcoming environment for all..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            Fair Housing Statement
          </label>
          <textarea
            value={fairHousingStatement}
            onChange={(e) => setFairHousingStatement(e.target.value)}
            placeholder="We are pledged to the letter and spirit of U.S. policy for the achievement of equal housing opportunity..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </CollapsibleSection>

      {/* Section 12: Brokerage Stats (optional) */}
      <CollapsibleSection title="Brokerage Stats" defaultOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Total Volume"
            value={totalVolume}
            onChange={(e) => setTotalVolume(e.target.value)}
            placeholder="e.g. $180M+"
            fullWidth
          />
          <Input
            label="Years in Business"
            value={yearsInBusiness}
            onChange={(e) => setYearsInBusiness(e.target.value)}
            placeholder="e.g. 12"
            fullWidth
          />
          <Input
            label="Total Transactions"
            value={totalTransactions}
            onChange={(e) => setTotalTransactions(e.target.value)}
            placeholder="e.g. 620+"
            fullWidth
          />
          <Input
            label="Five-Star Reviews"
            value={fiveStarReviews}
            onChange={(e) => setFiveStarReviews(e.target.value)}
            placeholder="e.g. 200+"
            fullWidth
          />
          <Input
            label="Sale-to-List Ratio"
            value={saleToListRatio}
            onChange={(e) => setSaleToListRatio(e.target.value)}
            placeholder="e.g. 103%"
            fullWidth
          />
          <Input
            label="Avg Days on Market"
            value={avgDaysOnMarket}
            onChange={(e) => setAvgDaysOnMarket(e.target.value)}
            placeholder="e.g. 24"
            fullWidth
          />
        </div>
      </CollapsibleSection>

      {/* Bottom Controls */}
      <div className="border border-gray-200 rounded-xl bg-white px-6 py-5 flex items-center justify-between">
        <Checkbox
          label="Skip AI content generation (faster, uses template content)"
          checked={skipAi}
          onChange={(e) => setSkipAi(e.target.checked)}
        />
        <Button
          variant="primary"
          size="md"
          disabled={!isFormValid}
          loading={false}
          onClick={handleGenerateSite}
        >
          Generate Site
        </Button>
      </div>
    </div>
  );
}
