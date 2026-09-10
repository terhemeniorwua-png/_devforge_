"use client";

import { useContactSettings } from "@/hooks/useContactSettings";
import { buildMailtoLink, buildWhatsappLink } from "@/lib/contactSettings";

export default function CampaignPage() {
  const { settings } = useContactSettings();

  const emailLink = buildMailtoLink(settings.email);
  const whatsappLink = buildWhatsappLink(settings.whatsappNumber);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex-1 w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Support the Campaign
      </h1>
      <p className="text-gray-600 mb-8">
        Help us take the message of the party to every corner of the country.
      </p>

      <div className="border border-green-200 rounded-lg bg-green-50 p-6 mb-8">
        <h2 className="text-lg font-semibold text-green-900 mb-2">
          Get involved
        </h2>
        <p className="text-sm text-green-800 mb-4">
          Volunteer, contribute, or share the campaign. Our coordinators are
          one message away.
        </p>
        <div className="flex flex-wrap gap-4">
          {emailLink ? (
            <a
              href={emailLink}
              className="inline-flex items-center rounded-md bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition-colors"
            >
              Email the Team
            </a>
          ) : null}
          {whatsappLink ? (
            <a
              href={whatsappLink}
              className="inline-flex items-center rounded-md border border-green-700 px-5 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-700 hover:text-white transition-colors"
            >
              Chat on WhatsApp
            </a>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-1">Volunteer</h3>
          <p className="text-sm text-gray-600">
            Join a ward or LGA team and help with canvassing and rallies.
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-1">Donate</h3>
          <p className="text-sm text-gray-600">
            Contributions of any size go directly to campaign logistics.
          </p>
        </div>
      </div>
    </div>
  );
}