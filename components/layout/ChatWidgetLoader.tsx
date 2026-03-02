'use client';

import { useEffect } from 'react';
import { trackLeadEvent } from '@/lib/leads/client';

type ChatWidgetConfig = {
  enabled?: boolean;
  provider?: string;
  tidioKey?: string;
  intercomAppId?: string;
  customScriptUrl?: string;
};

type ChatWidgetLoaderProps = {
  siteId: string;
  locale: string;
  chatWidget?: ChatWidgetConfig | null;
};

const interactionSelector =
  '[id*="tidio"],[class*="tidio"],iframe[src*="tidio"],[id*="intercom"],[class*="intercom"],iframe[src*="intercom"]';

export function ChatWidgetLoader({ siteId, locale, chatWidget }: ChatWidgetLoaderProps) {
  useEffect(() => {
    if (!chatWidget?.enabled) return;

    const provider = String(chatWidget.provider || '').toLowerCase().trim();
    let scriptUrl = '';
    if (provider === 'tidio' && chatWidget.tidioKey) {
      scriptUrl = `https://code.tidio.co/${chatWidget.tidioKey}.js`;
    } else if (provider === 'intercom' && chatWidget.intercomAppId) {
      (window as any).intercomSettings = {
        app_id: chatWidget.intercomAppId,
      };
      scriptUrl = `https://widget.intercom.io/widget/${chatWidget.intercomAppId}`;
    } else if (chatWidget.customScriptUrl) {
      scriptUrl = chatWidget.customScriptUrl;
    }

    if (!scriptUrl) return;

    const scriptId = `chat-widget-script-${provider || 'custom'}`;
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
    const script = existing || document.createElement('script');
    let disposed = false;
    let lastInteractionAt = 0;

    const track = (eventName: string, metadata?: Record<string, unknown>) =>
      trackLeadEvent({
        siteId,
        locale,
        eventName,
        source: `chat-widget:${provider || 'custom'}`,
        pagePath: window.location.pathname,
        metadata,
      });

    if (!existing) {
      script.id = scriptId;
      script.async = true;
      script.src = scriptUrl;
      script.onload = () => {
        if (!disposed) {
          track('chat_widget_loaded', { provider });
        }
      };
      script.onerror = () => {
        if (!disposed) {
          track('chat_widget_load_failed', { provider });
        }
      };
      document.body.appendChild(script);
    } else {
      track('chat_widget_loaded', { provider, reusedScript: true });
    }

    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const matched = target.closest(interactionSelector);
      if (!matched) return;
      const now = Date.now();
      if (now - lastInteractionAt < 1500) return;
      lastInteractionAt = now;
      track('chat_widget_interaction', { provider });
    };
    document.addEventListener('click', clickHandler, true);

    return () => {
      disposed = true;
      document.removeEventListener('click', clickHandler, true);
    };
  }, [chatWidget, siteId, locale]);

  return null;
}
