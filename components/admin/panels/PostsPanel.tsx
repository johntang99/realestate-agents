interface PostsPanelProps {
  posts: any[];
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

export function PostsPanel({ posts, updateFormValue, openImagePicker }: PostsPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        Blog Posts
      </div>
      <div className="space-y-4">
        {posts.map((post: any, index: number) => (
          <div key={post.slug || index} className="border rounded-md p-3">
            <div className="text-xs text-gray-500 mb-2">
              {post.title || `Post ${index + 1}`}
            </div>
            <input
              className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Title"
              value={post.title || ''}
              onChange={(event) =>
                updateFormValue(['posts', String(index), 'title'], event.target.value)
              }
            />
            <textarea
              className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Excerpt"
              value={post.excerpt || ''}
              onChange={(event) =>
                updateFormValue(['posts', String(index), 'excerpt'], event.target.value)
              }
            />
            <div className="flex gap-2">
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Image"
                value={post.image || ''}
                onChange={(event) =>
                  updateFormValue(['posts', String(index), 'image'], event.target.value)
                }
              />
              <button
                type="button"
                onClick={() => openImagePicker(['posts', String(index), 'image'])}
                className="px-3 rounded-md border border-gray-200 text-xs"
              >
                Choose
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
