"use client";

import { useContactSettings } from "@/hooks/useContactSettings";
import { buildMailtoLink, buildWhatsappLink } from "@/lib/contactSettings";
import SocialIcon from "@/components/SocialIcon";

export default function ContactPage() {
  const { settings } = useContactSettings();

  const emailLink = buildMailtoLink(settings.email);
  const whatsappLink = buildWhatsappLink(settings.whatsappNumber);

  const touchpoints = [
    { type: "email", label: "Email", href: emailLink, value: settings.email },
    { type: "whatsapp", label: "WhatsApp", href: whatsappLink, value: settings.whatsappNumber },
    { type: "facebook", label: "Facebook", href: settings.facebook },
    { type: "instagram", label: "Instagram", href: settings.instagram },
    { type: "x", label: "X (Twitter)", href: settings.x },
    { type: "youtube", label: "YouTube", href: settings.youtube },
    { type: "tiktok", label: "TikTok", href: settings.tiktok },
    { type: "linkedin", label: "LinkedIn", href: settings.linkedin },
  ].filter((item) => item.href || item.value);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex-1 w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Reach out to the party through any of the channels below.
      </p>

      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white">
        {touchpoints.map((item) => {
          const isExternal = ["facebook", "instagram", "x", "youtube", "tiktok", "linkedin"].includes(item.type);
          return (
            <li key={item.type} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-900 font-medium">{item.label}</span>
              </div>
              {item.href ? (
                <a
                  href={item.href}
                  {...(isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="text-green-700 hover:underline text-sm break-all text-right"
                >
                  {item.value || item.href}
                </a>
              ) : (
                <span className="text-gray-400 text-sm">Not set</span>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Follow us</h2>
        <div className="flex flex-wrap gap-3">
          <SocialIcon type="email" href={emailLink} size="lg" />
          <SocialIcon type="whatsapp" href={whatsappLink} size="lg" />
          <SocialIcon type="facebook" href={settings.facebook} size="lg" />
          <SocialIcon type="instagram" href={settings.instagram} size="lg" />
          <SocialIcon type="x" href={settings.x} size="lg" />
          <SocialIcon type="youtube" href={settings.youtube} size="lg" />
          <SocialIcon type="tiktok" href={settings.tiktok} size="lg" />
          <SocialIcon type="linkedin" href={settings.linkedin} size="lg" />
        </div>
      </div>
    </div>
  );
}