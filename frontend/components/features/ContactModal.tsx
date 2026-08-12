'use client';

import React from 'react';
import { Phone, MessageCircle, ShieldCheck, Mail } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { LandlordContact } from '@/lib/api-client';

export interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: LandlordContact | null;
  listingAddress?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  contact,
  listingAddress = 'your listing',
}) => {
  if (!contact) return null;

  const cleanPhone = contact.landlord_phone.replace(/[^0-9+]/g, '');
  const encodedText = encodeURIComponent(`Hi ${contact.landlord_name}, I saw your listing at ${listingAddress} on Seedfundin and I'm interested in viewing it!`);
  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodedText}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Landlord Verified Contact Revealed">
      <div className="space-y-5">
        <div className="flex items-center gap-3 p-3 bg-[#6B7A3A]/10 border border-[#6B7A3A]/20 rounded-xl">
          <ShieldCheck className="w-6 h-6 text-[#6B7A3A] shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-[#2B2B26]">{contact.landlord_name}</h4>
            <p className="text-xs text-[#4A5A2A] font-medium">Verified Marketplace Landlord</p>
          </div>
        </div>

        {/* Contact Numbers & Email */}
        <div className="space-y-3">
          <div className="p-3.5 bg-[#F7F7F2] rounded-xl border border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[#2B2B26]">
              <Phone className="w-4 h-4 text-[#6B7A3A]" />
              <span className="font-mono font-bold text-base">{contact.landlord_phone}</span>
            </div>
            <a
              href={`tel:${cleanPhone}`}
              className="text-xs font-semibold text-[#6B7A3A] hover:underline"
            >
              Call Direct
            </a>
          </div>

          <div className="p-3.5 bg-[#F7F7F2] rounded-xl border border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[#2B2B26] truncate">
              <Mail className="w-4 h-4 text-[#6B7A3A] shrink-0" />
              <span className="font-medium text-xs truncate">{contact.landlord_email}</span>
            </div>
            <a
              href={`mailto:${contact.landlord_email}?subject=Inquiry%20regarding%20${encodeURIComponent(listingAddress)}`}
              className="text-xs font-semibold text-[#6B7A3A] hover:underline shrink-0"
            >
              Send Email
            </a>
          </div>
        </div>

        {/* WhatsApp Deep Link Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block focus-visible:outline-none"
        >
          <Button variant="primary" size="lg" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white gap-2">
            <MessageCircle className="w-5 h-5 fill-current" />
            Chat on WhatsApp
          </Button>
        </a>

        <p className="text-xs text-center text-gray-500">
          This contact reveal event has been recorded for tenant protection and analytics.
        </p>
      </div>
    </Modal>
  );
};
