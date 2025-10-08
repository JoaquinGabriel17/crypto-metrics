import NewsCard from "./NewsCard"
import { useEffect, useState } from "react"
import axios from "axios"
import '../styles/NewsCard.css'
import Loading from "./Loading"

const ApiURL = import.meta.env.VITE_BACKEND_API_URL //guardar la URL de la API


export default function NewsCarosel(){

    const [news, setNews] = useState([])
    //cantidad de noticias visibles
    const [visibleCount, setVisibleCount] = useState(3);
    const [loading, setLoading] = useState(false);

    //cargar las noticias desde la API
    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${ApiURL}/data/news`);
                setNews(response.data[0].results);
                setLoading(false)
            } catch (error) {
                console.error("Error fetching news:", error);
                setLoading(false)
            }
        }
        fetchNews();
    }, [])


    const visibleNews = news.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 5); // Cargar 5 más
    };

    return(
        <div className="news-carousel-container">
        <h1 className="different-title">Últimas noticias sobre criptomonedas</h1>
            {visibleNews.map((item, i) => (
        <NewsCard key={i} cardInfo={item} />
      ))}

      {loading && <Loading/>}

      {!loading && visibleCount < news.length && (
        <button onClick={handleLoadMore}>Cargar más</button>
      )}

      {!loading && visibleCount >= news.length && news.length > 0 && (
        <p>No hay más noticias</p>
      )}
        </div>
    )
}