interface AboutPagePanelProps {
  formData: Record<string, any>;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

export function AboutPagePanel({
  formData,
  updateFormValue,
  openImagePicker,
}: AboutPagePanelProps) {
  const storyBlocks = Array.isArray(formData?.story?.blocks) ? formData.story.blocks : [];
  const statItems = Array.isArray(formData?.stats?.items) ? formData.stats.items : [];
  const credentialItems = Array.isArray(formData?.credentials?.items) ? formData.credentials.items : [];
  const teamMembers = Array.isArray(formData?.team?.members) ? formData.team.members : [];
  const awardItems = Array.isArray(formData?.awards?.items) ? formData.awards.items : [];

  const addStoryBlock = () => {
    updateFormValue(['story', 'blocks'], [
      ...storyBlocks,
      { body: '', image: '', imageAlt: '' },
    ]);
  };

  const removeStoryBlock = (index: number) => {
    updateFormValue(
      ['story', 'blocks'],
      storyBlocks.filter((_: any, idx: number) => idx !== index)
    );
  };

  const addStatItem = () => {
    updateFormValue(['stats', 'items'], [...statItems, { value: '', label: '' }]);
  };

  const removeStatItem = (index: number) => {
    updateFormValue(
      ['stats', 'items'],
      statItems.filter((_: any, idx: number) => idx !== index)
    );
  };

  const addCredentialItem = () => {
    updateFormValue(['credentials', 'items'], [
      ...credentialItems,
      { name: '', abbreviation: '', description: '' },
    ]);
  };

  const removeCredentialItem = (index: number) => {
    updateFormValue(
      ['credentials', 'items'],
      credentialItems.filter((_: any, idx: number) => idx !== index)
    );
  };

  const addTeamMember = () => {
    updateFormValue(['team', 'members'], [
      ...teamMembers,
      {
        name: '',
        title: '',
        photo: '',
        bio: '',
        specialization: '',
        email: '',
        phone: '',
        featured: false,
      },
    ]);
  };

  const removeTeamMember = (index: number) => {
    updateFormValue(
      ['team', 'members'],
      teamMembers.filter((_: any, idx: number) => idx !== index)
    );
  };

  const addAwardItem = () => {
    updateFormValue(['awards', 'items'], [
      ...awardItems,
      { name: '', organization: '', year: new Date().getFullYear() },
    ]);
  };

  const removeAwardItem = (index: number) => {
    updateFormValue(
      ['awards', 'items'],
      awardItems.filter((_: any, idx: number) => idx !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">About Hero</div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500">Headline</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData?.hero?.headline || ''}
              onChange={(event) => updateFormValue(['hero', 'headline'], event.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Image Alt</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData?.hero?.imageAlt || ''}
              onChange={(event) => updateFormValue(['hero', 'imageAlt'], event.target.value)}
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-xs text-gray-500">Subline</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData?.hero?.subline || ''}
            onChange={(event) => updateFormValue(['hero', 'subline'], event.target.value)}
          />
        </div>
        <div className="mt-3">
          <label className="block text-xs text-gray-500">Image</label>
          <div className="mt-1 flex gap-2">
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData?.hero?.image || ''}
              onChange={(event) => updateFormValue(['hero', 'image'], event.target.value)}
            />
            <button
              type="button"
              onClick={() => openImagePicker(['hero', 'image'])}
              className="px-3 rounded-md border border-gray-200 text-xs"
            >
              Choose
            </button>
            <button
              type="button"
              onClick={() => updateFormValue(['hero', 'image'], '')}
              className="px-3 rounded-md border border-gray-200 text-xs"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">Story Blocks</div>
          <button type="button" onClick={addStoryBlock} className="px-3 py-1.5 rounded border border-gray-200 text-xs">
            Add Block
          </button>
        </div>
        <div className="space-y-4">
          {storyBlocks.map((_: any, index: number) => (
            <div key={index} className="rounded-md border border-gray-100 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-gray-500">Block {index + 1}</div>
                <button type="button" onClick={() => removeStoryBlock(index)} className="text-xs text-red-600">
                  Remove
                </button>
              </div>
              <div>
                <label className="block text-xs text-gray-500">Body</label>
                <textarea
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm min-h-[100px]"
                  value={storyBlocks[index]?.body || ''}
                  onChange={(event) => updateFormValue(['story', 'blocks', String(index), 'body'], event.target.value)}
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="block text-xs text-gray-500">Image</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                      value={storyBlocks[index]?.image || ''}
                      onChange={(event) => updateFormValue(['story', 'blocks', String(index), 'image'], event.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => openImagePicker(['story', 'blocks', String(index), 'image'])}
                      className="px-3 rounded-md border border-gray-200 text-xs"
                    >
                      Choose
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Image Alt</label>
                  <input
                    className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    value={storyBlocks[index]?.imageAlt || ''}
                    onChange={(event) => updateFormValue(['story', 'blocks', String(index), 'imageAlt'], event.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">Stats</div>
          <button type="button" onClick={addStatItem} className="px-3 py-1.5 rounded border border-gray-200 text-xs">
            Add Stat
          </button>
        </div>
        <div className="space-y-2">
          {statItems.map((_: any, index: number) => (
            <div key={index} className="grid gap-2 md:grid-cols-[1fr_2fr_auto] items-center">
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={statItems[index]?.value || ''}
                onChange={(event) => updateFormValue(['stats', 'items', String(index), 'value'], event.target.value)}
                placeholder="Value"
              />
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={statItems[index]?.label || ''}
                onChange={(event) => updateFormValue(['stats', 'items', String(index), 'label'], event.target.value)}
                placeholder="Label"
              />
              <button type="button" onClick={() => removeStatItem(index)} className="text-xs text-red-600 px-2">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">Credentials</div>
          <button type="button" onClick={addCredentialItem} className="px-3 py-1.5 rounded border border-gray-200 text-xs">
            Add Credential
          </button>
        </div>
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Headline</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData?.credentials?.headline || ''}
            onChange={(event) => updateFormValue(['credentials', 'headline'], event.target.value)}
          />
        </div>
        <div className="space-y-3">
          {credentialItems.map((_: any, index: number) => (
            <div key={index} className="rounded-md border border-gray-100 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-gray-500">Credential {index + 1}</div>
                <button type="button" onClick={() => removeCredentialItem(index)} className="text-xs text-red-600">
                  Remove
                </button>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={credentialItems[index]?.name || ''}
                  onChange={(event) => updateFormValue(['credentials', 'items', String(index), 'name'], event.target.value)}
                  placeholder="Name"
                />
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={credentialItems[index]?.abbreviation || ''}
                  onChange={(event) => updateFormValue(['credentials', 'items', String(index), 'abbreviation'], event.target.value)}
                  placeholder="Abbreviation"
                />
              </div>
              <textarea
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={credentialItems[index]?.description || ''}
                onChange={(event) => updateFormValue(['credentials', 'items', String(index), 'description'], event.target.value)}
                placeholder="Description"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">Team</div>
          <button type="button" onClick={addTeamMember} className="px-3 py-1.5 rounded border border-gray-200 text-xs">
            Add Member
          </button>
        </div>
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Headline</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData?.team?.headline || ''}
            onChange={(event) => updateFormValue(['team', 'headline'], event.target.value)}
          />
        </div>
        <div className="space-y-4">
          {teamMembers.map((_: any, index: number) => (
            <div key={index} className="rounded-md border border-gray-100 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-gray-500">Member {index + 1}</div>
                <button type="button" onClick={() => removeTeamMember(index)} className="text-xs text-red-600">
                  Remove
                </button>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={teamMembers[index]?.name || ''}
                  onChange={(event) => updateFormValue(['team', 'members', String(index), 'name'], event.target.value)}
                  placeholder="Name"
                />
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={teamMembers[index]?.title || ''}
                  onChange={(event) => updateFormValue(['team', 'members', String(index), 'title'], event.target.value)}
                  placeholder="Title"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Photo</label>
                <div className="mt-1 flex gap-2">
                  <input
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    value={teamMembers[index]?.photo || ''}
                    onChange={(event) => updateFormValue(['team', 'members', String(index), 'photo'], event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => openImagePicker(['team', 'members', String(index), 'photo'])}
                    className="px-3 rounded-md border border-gray-200 text-xs"
                  >
                    Choose
                  </button>
                </div>
              </div>
              <textarea
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={teamMembers[index]?.bio || ''}
                onChange={(event) => updateFormValue(['team', 'members', String(index), 'bio'], event.target.value)}
                placeholder="Bio"
              />
              <div className="grid gap-2 md:grid-cols-2">
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={teamMembers[index]?.specialization || ''}
                  onChange={(event) => updateFormValue(['team', 'members', String(index), 'specialization'], event.target.value)}
                  placeholder="Specialization"
                />
                <label className="inline-flex items-center gap-2 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={Boolean(teamMembers[index]?.featured)}
                    onChange={(event) => updateFormValue(['team', 'members', String(index), 'featured'], event.target.checked)}
                  />
                  Featured member
                </label>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={teamMembers[index]?.email || ''}
                  onChange={(event) => updateFormValue(['team', 'members', String(index), 'email'], event.target.value)}
                  placeholder="Email"
                />
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={teamMembers[index]?.phone || ''}
                  onChange={(event) => updateFormValue(['team', 'members', String(index), 'phone'], event.target.value)}
                  placeholder="Phone"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">Awards</div>
          <button type="button" onClick={addAwardItem} className="px-3 py-1.5 rounded border border-gray-200 text-xs">
            Add Award
          </button>
        </div>
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Headline</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData?.awards?.headline || ''}
            onChange={(event) => updateFormValue(['awards', 'headline'], event.target.value)}
          />
        </div>
        <div className="space-y-2">
          {awardItems.map((_: any, index: number) => (
            <div key={index} className="grid gap-2 md:grid-cols-[1.3fr_1.3fr_120px_auto] items-center">
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={awardItems[index]?.name || ''}
                onChange={(event) => updateFormValue(['awards', 'items', String(index), 'name'], event.target.value)}
                placeholder="Award name"
              />
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={awardItems[index]?.organization || ''}
                onChange={(event) => updateFormValue(['awards', 'items', String(index), 'organization'], event.target.value)}
                placeholder="Organization"
              />
              <input
                type="number"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={awardItems[index]?.year ?? ''}
                onChange={(event) =>
                  updateFormValue(
                    ['awards', 'items', String(index), 'year'],
                    event.target.value ? Number(event.target.value) : ''
                  )
                }
                placeholder="Year"
              />
              <button type="button" onClick={() => removeAwardItem(index)} className="text-xs text-red-600 px-2">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Community</div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500">Headline</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData?.community?.headline || ''}
              onChange={(event) => updateFormValue(['community', 'headline'], event.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Image Alt</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData?.community?.imageAlt || ''}
              onChange={(event) => updateFormValue(['community', 'imageAlt'], event.target.value)}
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-xs text-gray-500">Body</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm min-h-[90px]"
            value={formData?.community?.body || ''}
            onChange={(event) => updateFormValue(['community', 'body'], event.target.value)}
          />
        </div>
        <div className="mt-3">
          <label className="block text-xs text-gray-500">Image</label>
          <div className="mt-1 flex gap-2">
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData?.community?.image || ''}
              onChange={(event) => updateFormValue(['community', 'image'], event.target.value)}
            />
            <button
              type="button"
              onClick={() => openImagePicker(['community', 'image'])}
              className="px-3 rounded-md border border-gray-200 text-xs"
            >
              Choose
            </button>
            <button
              type="button"
              onClick={() => updateFormValue(['community', 'image'], '')}
              className="px-3 rounded-md border border-gray-200 text-xs"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Brokerage</div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500">Brokerage Name</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData?.brokerage?.name || ''}
              onChange={(event) => updateFormValue(['brokerage', 'name'], event.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Brokerage Logo</label>
            <div className="mt-1 flex gap-2">
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData?.brokerage?.logo || ''}
                onChange={(event) => updateFormValue(['brokerage', 'logo'], event.target.value)}
              />
              <button
                type="button"
                onClick={() => openImagePicker(['brokerage', 'logo'])}
                className="px-3 rounded-md border border-gray-200 text-xs"
              >
                Choose
              </button>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-xs text-gray-500">Description</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm min-h-[90px]"
            value={formData?.brokerage?.description || ''}
            onChange={(event) => updateFormValue(['brokerage', 'description'], event.target.value)}
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">CTA</div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500">Headline</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData?.cta?.headline || ''}
              onChange={(event) => updateFormValue(['cta', 'headline'], event.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Button Label</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData?.cta?.ctaLabel || ''}
              onChange={(event) => updateFormValue(['cta', 'ctaLabel'], event.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 mt-3">
          <div>
            <label className="block text-xs text-gray-500">Subline</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData?.cta?.subline || ''}
              onChange={(event) => updateFormValue(['cta', 'subline'], event.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Button Link</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData?.cta?.ctaHref || ''}
              onChange={(event) => updateFormValue(['cta', 'ctaHref'], event.target.value)}
              placeholder="/contact"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
