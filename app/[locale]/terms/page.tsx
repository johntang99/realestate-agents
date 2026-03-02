import { type Locale } from '@/lib/i18n';
import Link from 'next/link';

export default function TermsPage({ params }: { params: { locale: Locale } }) {
  const isCn = params.locale === 'zh';
  return (
    <div className="pt-32 pb-20 min-h-screen bg-white">
      <div className="container-custom max-w-2xl">
        <h1 className="font-serif text-3xl font-semibold mb-8" style={{ color: 'var(--primary)' }}>
          {isCn ? '服务条款' : 'Terms of Service'}
        </h1>
        <div className="space-y-6 text-sm leading-loose" style={{ color: 'var(--text-secondary)' }}>
          <p>{isCn ? '最后更新：2026年2月' : 'Last updated: February 2026'}</p>
          <p>{isCn
            ? '使用 Jin Pang Homes 网站，即表示您同意以下服务条款。请仔细阅读这些条款。'
            : 'By using the Jin Pang Homes website, you agree to the following terms of service. Please read these terms carefully.'
          }</p>
          <h2 className="font-serif text-xl font-semibold pt-4" style={{ color: 'var(--primary)' }}>{isCn ? '网站使用' : 'Use of Website'}</h2>
          <p>{isCn
            ? '本网站及其内容仅供一般信息目的，不构成对设计服务的提供或保证。'
            : 'This website and its content are for general informational purposes only and do not constitute an offer or guarantee of design services.'
          }</p>
          <h2 className="font-serif text-xl font-semibold pt-4" style={{ color: 'var(--primary)' }}>{isCn ? '知识产权' : 'Intellectual Property'}</h2>
          <p>{isCn
            ? '本网站上的所有内容，包括照片、文字和资料，均为 Jin Pang Homes 的财产，受版权法保护。未经书面许可，不得复制或使用。'
            : 'All content on this website, including photos, text, and materials, is the property of Jin Pang Homes and protected by copyright law. It may not be reproduced or used without written permission.'
          }</p>
          <h2 className="font-serif text-xl font-semibold pt-4" style={{ color: 'var(--primary)' }}>{isCn ? '联系我们' : 'Contact Us'}</h2>
          <p>{isCn ? '如有任何问题，请联系' : 'For any questions, please contact'}{' '}
            <a href="mailto:info@jinpanghomes.com" style={{ color: 'var(--secondary)' }}>info@jinpanghomes.com</a>
          </p>
        </div>
        <div className="mt-10">
          <Link href={`/${params.locale}`} style={{ color: 'var(--secondary)' }} className="text-sm">← {isCn ? '返回首页' : 'Back to Home'}</Link>
        </div>
      </div>
    </div>
  );
}
