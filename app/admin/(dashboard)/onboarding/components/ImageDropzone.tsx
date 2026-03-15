export default function ImageDropzone({
  siteId,
  label,
  onUploaded,
  uploading,
  setUploading,
  currentUrl,
  exampleImage,
  exampleTitle,
  exampleDescription,
  exampleDark = false,
}: {
  siteId: string;
  label: string;
  onUploaded: (url: string) => void;
  uploading: boolean;
  setUploading: (value: boolean) => void;
  currentUrl: string;
  exampleImage: string;
  exampleTitle: string;
  exampleDescription: string;
  exampleDark?: boolean;
}) {
  const disabled = !siteId.trim();

  const handleFile = async (file: File) => {
    if (disabled) {
      throw new Error(
        'Enter business name first so a site ID can be generated.',
      );
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('siteId', siteId);
      formData.append('folder', 'general');

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      onUploaded(data.url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_280px] lg:items-stretch">
      <div
        onDragOver={(e) => {
          if (!disabled) e.preventDefault();
        }}
        onDrop={async (e) => {
          if (disabled) return;
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) await handleFile(file);
        }}
        className={`rounded-lg border border-dashed p-4 ${
          disabled
            ? 'cursor-not-allowed border-gray-200 bg-gray-50'
            : 'border-gray-300 bg-white'
        }`}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900">{label}</p>
            <p className="text-xs text-gray-500">
              {disabled
                ? 'Set the site ID first, then upload this image.'
                : 'Drag and drop an image here, or choose one from your computer.'}
            </p>
          </div>
          {currentUrl ? (
            <span className="inline-flex w-fit items-center rounded-md bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
              Uploaded
            </span>
          ) : (
            <span className="inline-flex w-fit items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              Pending
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label
            className={`inline-flex w-fit items-center rounded-md border px-3 py-2 text-sm font-medium ${
              disabled
                ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                : 'cursor-pointer border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {uploading ? 'Uploading...' : 'Choose Image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={disabled}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) await handleFile(file);
              }}
            />
          </label>

          <p
            className={`text-xs ${
              disabled ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            Recommended: PNG or JPG, landscape orientation.
          </p>
        </div>

        {currentUrl && (
          <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 px-3 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Current File
            </p>
            <a
              href={currentUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block truncate text-sm text-blue-600 hover:text-blue-800"
            >
              {currentUrl}
            </a>
          </div>
        )}
      </div>

      <div
        className={`overflow-hidden rounded-lg border ${
          exampleDark
            ? 'border-gray-300 bg-gray-900'
            : 'border-gray-200 bg-white'
        }`}
      >
        <div
          className={`flex h-32 items-center justify-center p-4 ${
            exampleDark ? '' : 'bg-gray-50'
          }`}
        >
          <img
            src={currentUrl || exampleImage}
            alt={exampleTitle}
            className={`${
              exampleTitle === 'Agent Image'
                ? 'max-h-full max-w-full object-contain'
                : 'max-h-16 w-auto object-contain'
            }`}
          />
        </div>
        <div
          className={`border-t px-4 py-3 ${
            exampleDark
              ? 'border-white/10 text-white'
              : 'border-gray-200 text-gray-900'
          }`}
        >
          <p className="text-sm font-semibold">{exampleTitle}</p>
          <p
            className={`mt-1 text-xs ${
              exampleDark ? 'text-slate-300' : 'text-gray-500'
            }`}
          >
            {exampleDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
