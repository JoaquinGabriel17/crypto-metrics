import "../styles/NewsCardDetail.css";

export default function CardDetail({ newsItem, onClose }) {
  if (!newsItem) return null;

  return (
    <div className="overlay">
      <div className="card-detail">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2 className="title">{newsItem.title}</h2>
        <p className="date">{ new Date(newsItem.published_at).toLocaleString() }</p>
        <p className="description">{newsItem.description}</p>
      </div>
    </div>
  );
}
