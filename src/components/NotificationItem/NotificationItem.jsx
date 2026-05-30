import './NotificationItem.css'

/**
 * NotificationItem — reusable notification row
 * Props:
 *   notification: { id, type, title, message, productId, isRead }
 *   type options: 'price_drop' | 'back_in_stock' | 'out_of_stock' | 'price_rise'
 */

const TYPE_LABELS = {
  price_drop:    { icon: '📉', color: 'var(--sage-green)', badge: 'ירידת מחיר' },
  price_rise:    { icon: '📈', color: 'var(--wine-red)',   badge: 'עלייה במחיר' },
  back_in_stock: { icon: '✅', color: 'var(--sage)',        badge: 'חזר למלאי' },
  out_of_stock:  { icon: '⚠️', color: 'var(--warm-gray)',  badge: 'אזל מהמלאי' },
}

function NotificationItem({ notification, onClick }) {
  const meta = TYPE_LABELS[notification.type] || TYPE_LABELS.price_drop

  return (
    <article
      className={`notification-item card ${!notification.isRead ? 'notification-item--unread' : ''}`}
      onClick={() => onClick && onClick(notification)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick && onClick(notification)}
    >
      {/* Image placeholder */}
      <div className="notification-item__image" aria-hidden="true">
        <span className="notification-item__icon">{meta.icon}</span>
      </div>

      {/* Content */}
      <div className="notification-item__content">
        <p className="notification-item__title">{notification.title}</p>
        <span
          className="notification-item__badge"
          style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
        >
          {meta.badge}
        </span>
      </div>

      {/* Arrow */}
      <span className="notification-item__arrow" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M9 18l-6-6 6-6"/>
        </svg>
      </span>
    </article>
  )
}

export default NotificationItem
