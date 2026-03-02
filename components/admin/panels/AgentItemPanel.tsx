import { Plus, X } from 'lucide-react';

interface AgentItemPanelProps {
  formData: any;
  updateFormValue: (path: string, value: any) => void;
  openImagePicker: (field: string) => void;
}

const inputClassName =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-[var(--primary)] focus:outline-none';
const labelClassName = 'block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1';

export function AgentItemPanel({
  formData,
  updateFormValue,
  openImagePicker,
}: AgentItemPanelProps) {
  const socials = formData?.social || {};
  const specialties = Array.isArray(formData?.specialties) ? formData.specialties : [];
  const languages = Array.isArray(formData?.languages) ? formData.languages : [];
  const neighborhoods = Array.isArray(formData?.neighborhoods) ? formData.neighborhoods : [];
  const awards = Array.isArray(formData?.awards) ? formData.awards : [];
  const testimonials = Array.isArray(formData?.testimonials) ? formData.testimonials : [];

  const addStringItem = (field: string) => {
    const current = Array.isArray(formData?.[field]) ? [...formData[field]] : [];
    current.push('');
    updateFormValue(field, current);
  };

  const removeStringItem = (field: string, index: number) => {
    const current = Array.isArray(formData?.[field]) ? [...formData[field]] : [];
    current.splice(index, 1);
    updateFormValue(field, current);
  };

  const addTestimonial = () => {
    const current = [...testimonials];
    current.push({
      id: `t-${Date.now()}`,
      reviewer: '',
      reviewDate: '',
      rating: 5,
      text: '',
      transactionType: 'buyer',
      verified: false,
    });
    updateFormValue('testimonials', current);
  };

  const removeTestimonial = (index: number) => {
    const current = [...testimonials];
    current.splice(index, 1);
    updateFormValue('testimonials', current);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-100 bg-white p-4">
        <h3 className="mb-4 text-sm font-semibold text-gray-800">Basic Info</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className={labelClassName}>Slug</label>
            <input
              className={inputClassName}
              value={formData?.slug || ''}
              onChange={(event) => updateFormValue('slug', event.target.value)}
            />
          </div>
          <div>
            <label className={labelClassName}>Status</label>
            <input
              className={inputClassName}
              value={formData?.status || ''}
              onChange={(event) => updateFormValue('status', event.target.value)}
            />
          </div>
          <div>
            <label className={labelClassName}>Display Order</label>
            <input
              type="number"
              className={inputClassName}
              value={formData?.displayOrder ?? 0}
              onChange={(event) => updateFormValue('displayOrder', Number(event.target.value) || 0)}
            />
          </div>
          <div>
            <label className={labelClassName}>Role</label>
            <input
              className={inputClassName}
              value={formData?.role || ''}
              onChange={(event) => updateFormValue('role', event.target.value)}
            />
          </div>
          <div>
            <label className={labelClassName}>Name</label>
            <input
              className={inputClassName}
              value={formData?.name || ''}
              onChange={(event) => updateFormValue('name', event.target.value)}
            />
          </div>
          <div>
            <label className={labelClassName}>Title</label>
            <input
              className={inputClassName}
              value={formData?.title || ''}
              onChange={(event) => updateFormValue('title', event.target.value)}
            />
          </div>
        </div>
        <div className="mt-3 space-y-3">
          <div>
            <label className={labelClassName}>Photo URL</label>
            <div className="flex gap-2">
              <input
                className={inputClassName}
                value={formData?.photo || ''}
                onChange={(event) => updateFormValue('photo', event.target.value)}
              />
              <button
                type="button"
                className="rounded-md border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                onClick={() => openImagePicker('photo')}
              >
                Pick
              </button>
            </div>
          </div>
          <div>
            <label className={labelClassName}>Bio</label>
            <textarea
              rows={5}
              className={inputClassName}
              value={formData?.bio || ''}
              onChange={(event) => updateFormValue('bio', event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-gray-100 bg-white p-4">
        <h3 className="mb-4 text-sm font-semibold text-gray-800">Contact & License</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className={labelClassName}>Phone</label>
            <input
              className={inputClassName}
              value={formData?.phone || ''}
              onChange={(event) => updateFormValue('phone', event.target.value)}
            />
          </div>
          <div>
            <label className={labelClassName}>Email</label>
            <input
              className={inputClassName}
              value={formData?.email || ''}
              onChange={(event) => updateFormValue('email', event.target.value)}
            />
          </div>
          <div>
            <label className={labelClassName}>License Number</label>
            <input
              className={inputClassName}
              value={formData?.licenseNumber || ''}
              onChange={(event) => updateFormValue('licenseNumber', event.target.value)}
            />
          </div>
          <div>
            <label className={labelClassName}>License State</label>
            <input
              className={inputClassName}
              value={formData?.licenseState || ''}
              onChange={(event) => updateFormValue('licenseState', event.target.value)}
            />
          </div>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div>
            <label className={labelClassName}>Instagram</label>
            <input
              className={inputClassName}
              value={socials.instagram || ''}
              onChange={(event) => updateFormValue('social.instagram', event.target.value)}
            />
          </div>
          <div>
            <label className={labelClassName}>LinkedIn</label>
            <input
              className={inputClassName}
              value={socials.linkedin || ''}
              onChange={(event) => updateFormValue('social.linkedin', event.target.value)}
            />
          </div>
          <div>
            <label className={labelClassName}>Facebook</label>
            <input
              className={inputClassName}
              value={socials.facebook || ''}
              onChange={(event) => updateFormValue('social.facebook', event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-gray-100 bg-white p-4">
        <h3 className="mb-4 text-sm font-semibold text-gray-800">Performance & Flags</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className={labelClassName}>Years Experience</label>
            <input
              type="number"
              className={inputClassName}
              value={formData?.yearsExperience ?? 0}
              onChange={(event) =>
                updateFormValue('yearsExperience', Number(event.target.value) || 0)
              }
            />
          </div>
          <div>
            <label className={labelClassName}>Transaction Count</label>
            <input
              type="number"
              className={inputClassName}
              value={formData?.transactionCount ?? 0}
              onChange={(event) =>
                updateFormValue('transactionCount', Number(event.target.value) || 0)
              }
            />
          </div>
          <div>
            <label className={labelClassName}>Average Days On Market</label>
            <input
              type="number"
              className={inputClassName}
              value={formData?.avgDaysOnMarket ?? 0}
              onChange={(event) =>
                updateFormValue('avgDaysOnMarket', Number(event.target.value) || 0)
              }
            />
          </div>
          <div>
            <label className={labelClassName}>Sale To List Ratio</label>
            <input
              className={inputClassName}
              value={formData?.saleToListRatio || ''}
              onChange={(event) => updateFormValue('saleToListRatio', event.target.value)}
            />
          </div>
          <div>
            <label className={labelClassName}>Volume Label</label>
            <input
              className={inputClassName}
              value={formData?.volumeLabel || ''}
              onChange={(event) => updateFormValue('volumeLabel', event.target.value)}
            />
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={Boolean(formData?.featured)}
                onChange={(event) => updateFormValue('featured', event.target.checked)}
              />
              Featured
            </label>
          </div>
        </div>
      </section>

      {[
        { key: 'specialties', label: 'Specialties', value: specialties },
        { key: 'languages', label: 'Languages', value: languages },
        { key: 'neighborhoods', label: 'Neighborhoods', value: neighborhoods },
        { key: 'awards', label: 'Awards', value: awards },
      ].map((group) => (
        <section key={group.key} className="rounded-lg border border-gray-100 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">{group.label}</h3>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
              onClick={() => addStringItem(group.key)}
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          </div>
          <div className="space-y-2">
            {group.value.map((item: string, index: number) => (
              <div key={`${group.key}-${index}`} className="flex items-center gap-2">
                <input
                  className={inputClassName}
                  value={item || ''}
                  onChange={(event) => updateFormValue(`${group.key}.${index}`, event.target.value)}
                />
                <button
                  type="button"
                  className="rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50"
                  onClick={() => removeStringItem(group.key, index)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {group.value.length === 0 && (
              <div className="text-xs text-gray-500">No items yet.</div>
            )}
          </div>
        </section>
      ))}

      <section className="rounded-lg border border-gray-100 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">Testimonials</h3>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
            onClick={addTestimonial}
          >
            <Plus className="h-3 w-3" />
            Add Testimonial
          </button>
        </div>
        <div className="space-y-3">
          {testimonials.map((testimonial: any, index: number) => (
            <div key={index} className="rounded-lg border border-gray-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Testimonial {index + 1}
                </div>
                <button
                  type="button"
                  className="rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50"
                  onClick={() => removeTestimonial(index)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <input
                  className={inputClassName}
                  placeholder="id"
                  value={testimonial?.id || ''}
                  onChange={(event) =>
                    updateFormValue(`testimonials.${index}.id`, event.target.value)
                  }
                />
                <input
                  className={inputClassName}
                  placeholder="reviewer"
                  value={testimonial?.reviewer || ''}
                  onChange={(event) =>
                    updateFormValue(`testimonials.${index}.reviewer`, event.target.value)
                  }
                />
                <input
                  className={inputClassName}
                  placeholder="reviewDate (YYYY-MM)"
                  value={testimonial?.reviewDate || ''}
                  onChange={(event) =>
                    updateFormValue(`testimonials.${index}.reviewDate`, event.target.value)
                  }
                />
                <input
                  type="number"
                  min={1}
                  max={5}
                  className={inputClassName}
                  placeholder="rating"
                  value={testimonial?.rating ?? 5}
                  onChange={(event) =>
                    updateFormValue(
                      `testimonials.${index}.rating`,
                      Number(event.target.value) || 0
                    )
                  }
                />
                <input
                  className={inputClassName}
                  placeholder="transactionType"
                  value={testimonial?.transactionType || ''}
                  onChange={(event) =>
                    updateFormValue(`testimonials.${index}.transactionType`, event.target.value)
                  }
                />
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={Boolean(testimonial?.verified)}
                    onChange={(event) =>
                      updateFormValue(`testimonials.${index}.verified`, event.target.checked)
                    }
                  />
                  Verified
                </label>
              </div>
              <div className="mt-2">
                <textarea
                  rows={3}
                  className={inputClassName}
                  placeholder="testimonial text"
                  value={testimonial?.text || ''}
                  onChange={(event) =>
                    updateFormValue(`testimonials.${index}.text`, event.target.value)
                  }
                />
              </div>
            </div>
          ))}
          {testimonials.length === 0 && (
            <div className="text-xs text-gray-500">No testimonials yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
