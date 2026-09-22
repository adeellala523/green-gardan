import React from 'react';
import { Mail, Check, Trash2, MailOpen, CornerUpLeft } from 'lucide-react';
import { useBlog } from '../../context/BlogContext';

export const AdminContact: React.FC = () => {
  const { contactMessages, markMessageAsRead, deleteContactMessage } = useBlog();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-editorial text-[#14281c]">
          Contact Inquiries ({contactMessages.length})
        </h2>
        <p className="text-xs text-[#52796f]">
          Reader questions, feedback, and editorial submissions received from the Contact Us page.
        </p>
      </div>

      {contactMessages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2ece2] p-12 text-center text-neutral-400">
          <Mail className="w-10 h-10 mx-auto mb-2 opacity-50 text-[#2d6a4f]" />
          <p className="text-sm font-editorial text-neutral-600">No messages received yet.</p>
          <p className="text-xs mt-1">Reader queries submitted via /contact-us will appear here in real-time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contactMessages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-2xl border p-5 transition-all shadow-2xs ${
                msg.status === 'unread' ? 'border-[#40916c] bg-[#fbfdfb]' : 'border-[#e2ece2]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${msg.status === 'unread' ? 'bg-[#2d6a4f]' : 'bg-neutral-300'}`} />
                  <span className="font-bold text-xs text-[#14281c]">{msg.name}</span>
                  <span className="text-neutral-400 text-xs">&lt;{msg.email}&gt;</span>
                </div>

                <div className="text-[11px] text-neutral-400">
                  {new Date(msg.createdAt).toLocaleString('en-GB')}
                </div>
              </div>

              {msg.subject && (
                <div className="text-xs font-semibold text-[#1b4332] mb-1">
                  Subject: {msg.subject}
                </div>
              )}

              <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line bg-neutral-50 p-3.5 rounded-xl border border-neutral-100">
                {msg.message}
              </p>

              <div className="flex items-center justify-between pt-3 mt-2 text-xs">
                <a
                  href={`mailto:${msg.email}?subject=${encodeURIComponent('Re: ' + (msg.subject || 'Your inquiry to Green Garden'))}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1b4332] hover:text-[#2d6a4f]"
                >
                  <CornerUpLeft className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>

                <div className="flex items-center gap-2">
                  {msg.status === 'unread' && (
                    <button
                      onClick={() => markMessageAsRead(msg.id)}
                      className="px-3 py-1 rounded-lg bg-[#e7f2e8] text-[#1b4332] text-xs font-medium hover:bg-[#d5ead7] cursor-pointer"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm('Delete this message?')) {
                        deleteContactMessage(msg.id);
                      }
                    }}
                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-neutral-100 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
