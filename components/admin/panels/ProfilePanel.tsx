interface ProfilePanelProps {
  formData: Record<string, any>;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

export function ProfilePanel({
  formData,
  updateFormValue,
  openImagePicker,
}: ProfilePanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        Profile
      </div>
      {'name' in formData.profile && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Name</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.profile.name || ''}
            onChange={(event) => updateFormValue(['profile', 'name'], event.target.value)}
          />
        </div>
      )}
      {'title' in formData.profile && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Title</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.profile.title || ''}
            onChange={(event) => updateFormValue(['profile', 'title'], event.target.value)}
          />
        </div>
      )}
      {'bio' in formData.profile && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Bio</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.profile.bio || ''}
            onChange={(event) => updateFormValue(['profile', 'bio'], event.target.value)}
          />
        </div>
      )}
      {'quote' in formData.profile && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Quote</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.profile.quote || ''}
            onChange={(event) => updateFormValue(['profile', 'quote'], event.target.value)}
          />
        </div>
      )}
      {'image' in formData.profile && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Profile Photo</label>
          <div className="mt-1 flex gap-2">
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData.profile.image || ''}
              onChange={(event) => updateFormValue(['profile', 'image'], event.target.value)}
            />
            <button
              type="button"
              onClick={() => openImagePicker(['profile', 'image'])}
              className="px-3 rounded-md border border-gray-200 text-xs"
            >
              Choose
            </button>
          </div>
        </div>
      )}
      {'signature' in formData.profile && (
        <div>
          <label className="block text-xs text-gray-500">Signature Image</label>
          <div className="mt-1 flex gap-2">
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData.profile.signature || ''}
              onChange={(event) =>
                updateFormValue(['profile', 'signature'], event.target.value)
              }
            />
            <button
              type="button"
              onClick={() => openImagePicker(['profile', 'signature'])}
              className="px-3 rounded-md border border-gray-200 text-xs"
            >
              Choose
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
