interface FeaturedPostPanelProps {
  featuredPost: Record<string, any>;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

export function FeaturedPostPanel({
  featuredPost,
  updateFormValue,
  openImagePicker,
}: FeaturedPostPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        Featured Post
      </div>
      <input
        className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        placeholder="Title"
        value={featuredPost.title || ''}
        onChange={(event) => updateFormValue(['featuredPost', 'title'], event.target.value)}
      />
      <textarea
        className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        placeholder="Excerpt"
        value={featuredPost.excerpt || ''}
        onChange={(event) => updateFormValue(['featuredPost', 'excerpt'], event.target.value)}
      />
      <div className="flex gap-2">
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Image"
          value={featuredPost.image || ''}
          onChange={(event) => updateFormValue(['featuredPost', 'image'], event.target.value)}
        />
        <button
          type="button"
          onClick={() => openImagePicker(['featuredPost', 'image'])}
          className="px-3 rounded-md border border-gray-200 text-xs"
        >
          Choose
        </button>
      </div>
    </div>
  );
}
