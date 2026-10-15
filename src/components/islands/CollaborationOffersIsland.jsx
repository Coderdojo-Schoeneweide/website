import React, { useState } from 'react';
import { marked } from 'marked';
import WorkshopModal from './WorkshopModal.jsx';

export default function CollaborationOffersIsland({ offers }) {
  const [selectedOffer, setSelectedOffer] = useState(null);

  const openOffer = (offer) => setSelectedOffer(offer);
  const closeOffer = () => setSelectedOffer(null);

  const htmlContent = selectedOffer ? marked.parse(selectedOffer.content) : '';

  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {offers.map((offer) => (
          <button
            key={offer.title}
            type="button"
            className="group hover:border-primary-400 focus-visible:ring-primary-400 flex min-h-24 flex-col items-stretch overflow-hidden rounded-2xl border border-slate-300 bg-white p-0 text-center text-slate-900 shadow-md transition hover:-translate-y-1 hover:shadow-lg focus-visible:ring-4"
            onClick={() => openOffer(offer)}
          >
            <img
              src={offer.image}
              alt=""
              className="h-32 w-full object-cover transition group-hover:scale-105"
            />
            <span className="flex min-h-24 items-center justify-center p-6 text-xl font-bold">
              {offer.title}
            </span>
          </button>
        ))}
      </div>
      <WorkshopModal
        open={Boolean(selectedOffer)}
        onClose={closeOffer}
        htmlContent={htmlContent}
        photo={selectedOffer?.image}
        title={selectedOffer?.title}
      />
    </>
  );
}
