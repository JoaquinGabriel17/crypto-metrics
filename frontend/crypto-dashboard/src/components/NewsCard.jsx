import '../styles/NewsCard.css';

export default function NewsCard({cardInfo}){
    const { title, description, kind, published_at } = cardInfo;

  // Función para convertir la fecha a "hace X tiempo"
    function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now - date) / 1000; // diferencia en segundos

  const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

  if (diff < 60) return rtf.format(-Math.floor(diff), 'second');
  if (diff < 3600) return rtf.format(-Math.floor(diff / 60), 'minute');
  if (diff < 86400) return rtf.format(-Math.floor(diff / 3600), 'hour');
  return rtf.format(-Math.floor(diff / 86400), 'day');
}

    
    return(
        <div className="news-card-container">
            <h2>{title}</h2>
            <h4>{kind} - {timeAgo(published_at)}</h4>
            <a  target="_blank" rel="noopener noreferrer">
            Leer más
            </a>
        </div>
    )
}