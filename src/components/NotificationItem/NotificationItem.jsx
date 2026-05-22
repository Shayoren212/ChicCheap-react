import { BellRing } from 'lucide-react';

export default function NotificationItem({ text }) {
  return (
    <button className="notification-item">
      <BellRing size={18} />
      <span>{text}</span>
    </button>
  );
}
