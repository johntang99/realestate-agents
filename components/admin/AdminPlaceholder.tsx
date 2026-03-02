interface AdminPlaceholderProps {
  title: string;
  description: string;
}

export function AdminPlaceholder({ title, description }: AdminPlaceholderProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
  );
}
