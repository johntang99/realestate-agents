import { type Locale } from '@/lib/i18n';
import Link from 'next/link';

export default function PrivacyPage({ params }: { params: { locale: Locale } }) {
  const isCn = params.locale === 'zh';
  return (
    <div className="pt-32 pb-20 min-h-screen bg-white">
      <div className="container-custom max-w-2xl">
        <h1 className="font-serif text-3xl font-semibold mb-8" style={{ color: 'var(--primary)' }}>
          {isCn ? '隐私政策' : 'Privacy Policy'}
        </h1>
        <div className="space-y-6 text-sm leading-loose" style={{ color: 'var(--text-secondary)' }}>
          <p>{isCn ? '最后更新：2026年2月' : 'Last updated: February 2026'}</p>
          <p>{isCn
            ? 'Jin Pang Homes（以下简称"我们"）尊重您的隐私权，并承诺保护您提供给我们的个人信息。'
            : 'Jin Pang Homes ("we") respects your privacy and is committed to protecting the personal information you provide to us.'
          }</p>
          <h2 className="font-serif text-xl font-semibold pt-4" style={{ color: 'var(--primary)' }}>{isCn ? '我们收集的信息' : 'Information We Collect'}</h2>
          <p>{isCn
            ? '当您提交咨询请求时，我们会收集您的姓名、电子邮件地址、电话号码及项目详情。这些信息仅用于回复您的咨询请求。'
            : 'When you submit a consultation request, we collect your name, email address, phone number, and project details. This information is used solely to respond to your inquiry.'
          }</p>
          <h2 className="font-serif text-xl font-semibold pt-4" style={{ color: 'var(--primary)' }}>{isCn ? '信息的使用' : 'How We Use Your Information'}</h2>
          <p>{isCn
            ? '我们使用您的信息回复咨询请求、安排咨询预约以及发送我们认为您可能感兴趣的信息（在您同意的情况下）。我们不会将您的信息出售或提供给第三方。'
            : 'We use your information to respond to consultation requests, schedule appointments, and send information we think you may find valuable (with your consent). We do not sell or share your information with third parties.'
          }</p>
          <h2 className="font-serif text-xl font-semibold pt-4" style={{ color: 'var(--primary)' }}>{isCn ? '联系我们' : 'Contact Us'}</h2>
          <p>{isCn ? '如有任何隐私相关问题，请联系' : 'For any privacy-related questions, please contact'}{' '}
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
