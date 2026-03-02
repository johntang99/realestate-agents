interface SitePanelProps {
  formData: Record<string, any>;
  updateFormValue: (path: string[], value: any) => void;
}

export function SitePanel({ formData, updateFormValue }: SitePanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="text-xs font-semibold text-gray-500 uppercase">Site Info</div>

      <div className="grid gap-3 md:grid-cols-2">
        {['id', 'name', 'tagline', 'subtagline', 'phone', 'smsPhone', 'email'].map((key) => (
          <div key={`site-${key}`}>
            <label className="block text-xs text-gray-500">{key}</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData[key] || ''}
              onChange={(event) => updateFormValue([key], event.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Address</div>
        <div className="grid gap-3 md:grid-cols-2">
          {['street', 'city', 'state', 'zip', 'full', 'mapsUrl', 'mapsEmbedUrl'].map((key) => (
            <div key={`address-${key}`}>
              <label className="block text-xs text-gray-500">{key}</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.address?.[key] || ''}
                onChange={(event) =>
                  updateFormValue(['address', key], event.target.value)
                }
              />
            </div>
          ))}
          <div>
            <label className="block text-xs text-gray-500">lat</label>
            <input
              type="number"
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={typeof formData.address?.lat === 'number' ? formData.address.lat : 0}
              onChange={(event) =>
                updateFormValue(['address', 'lat'], Number(event.target.value || 0))
              }
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">lng</label>
            <input
              type="number"
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={typeof formData.address?.lng === 'number' ? formData.address.lng : 0}
              onChange={(event) =>
                updateFormValue(['address', 'lng'], Number(event.target.value || 0))
              }
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">License</div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            'brokerageType',
            'licenseNumber',
            'licenseState',
            'principalBrokerName',
            'principalBrokerLicense',
            'principalBrokerTitle',
          ].map((key) => (
            <div key={`license-${key}`}>
              <label className="block text-xs text-gray-500">{key}</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.license?.[key] || ''}
                onChange={(event) =>
                  updateFormValue(['license', key], event.target.value)
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Social</div>
        <div className="grid gap-3 md:grid-cols-2">
          {['facebook', 'instagram', 'linkedin', 'youtube', 'twitter', 'tiktok'].map((key) => (
            <div key={`social-${key}`}>
              <label className="block text-xs text-gray-500">{key}</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.social?.[key] || ''}
                onChange={(event) =>
                  updateFormValue(['social', key], event.target.value)
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Stats</div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            'totalVolume',
            'totalTransactions',
            'yearsInBusiness',
            'agentCount',
            'fiveStarReviews',
            'avgDaysOnMarket',
            'saleToListRatio',
          ].map((key) => (
            <div key={`stats-${key}`}>
              <label className="block text-xs text-gray-500">{key}</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.stats?.[key] || ''}
                onChange={(event) =>
                  updateFormValue(['stats', key], event.target.value)
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Office Hours</div>
        <div className="grid gap-3 md:grid-cols-3">
          {['weekdays', 'saturday', 'sunday'].map((key) => (
            <div key={`office-${key}`}>
              <label className="block text-xs text-gray-500">{key}</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.officeHours?.[key] || ''}
                onChange={(event) =>
                  updateFormValue(['officeHours', key], event.target.value)
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Chat Widget</div>
        <div className="grid gap-3 md:grid-cols-2 items-end">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              checked={Boolean(formData.chatWidget?.enabled)}
              onChange={(event) =>
                updateFormValue(['chatWidget', 'enabled'], event.target.checked)
              }
            />
            Enabled
          </label>
          <div>
            <label className="block text-xs text-gray-500">provider</label>
            <select
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData.chatWidget?.provider || ''}
              onChange={(event) =>
                updateFormValue(['chatWidget', 'provider'], event.target.value)
              }
            >
              <option value="">Select provider</option>
              <option value="tidio">tidio</option>
              <option value="intercom">intercom</option>
              <option value="custom">custom</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500">tidioKey</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData.chatWidget?.tidioKey || ''}
              onChange={(event) =>
                updateFormValue(['chatWidget', 'tidioKey'], event.target.value)
              }
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">intercomAppId</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData.chatWidget?.intercomAppId || ''}
              onChange={(event) =>
                updateFormValue(['chatWidget', 'intercomAppId'], event.target.value)
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500">customScriptUrl</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData.chatWidget?.customScriptUrl || ''}
              onChange={(event) =>
                updateFormValue(['chatWidget', 'customScriptUrl'], event.target.value)
              }
              placeholder="https://example.com/chat-widget.js"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-3">
        <div className="text-xs font-semibold text-gray-500 uppercase">Compliance</div>
        <div>
          <label className="block text-xs text-gray-500">equalHousingText</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            rows={2}
            value={formData.compliance?.equalHousingText || ''}
            onChange={(event) =>
              updateFormValue(['compliance', 'equalHousingText'], event.target.value)
            }
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500">mlsDisclaimer</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            rows={2}
            value={formData.compliance?.mlsDisclaimer || ''}
            onChange={(event) =>
              updateFormValue(['compliance', 'mlsDisclaimer'], event.target.value)
            }
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500">fairHousingStatement</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            rows={2}
            value={formData.compliance?.fairHousingStatement || ''}
            onChange={(event) =>
              updateFormValue(['compliance', 'fairHousingStatement'], event.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
}
