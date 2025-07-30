import React, { useEffect } from 'react';
import { Ticket } from 'lucide-react';

const SupportTicketsModal = ({ onClose }) => {
  const tickets = [
    { id: 1, subject: 'Cannot punch in', status: 'Open' },
    { id: 2, subject: 'Salary delay', status: 'Resolved' },
  ];

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-opacity animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl rounded-xl w-full max-w-md p-6 shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Ticket className="text-gray-700" />
            <h2 className="text-xl font-semibold">Support Tickets</h2>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-black text-lg">✕</button>
        </div>
        <div className="space-y-3 text-gray-800">
          {tickets.length === 0 ? (
            <p className="text-gray-500">No support tickets found.</p>
          ) : (
            tickets.map(ticket => (
              <div key={ticket.id} className="p-3 bg-white/60 border border-gray-200 rounded-lg shadow-sm">
                <p><strong>Subject:</strong> {ticket.subject}</p>
                <p><strong>Status:</strong> {ticket.status}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTicketsModal;
