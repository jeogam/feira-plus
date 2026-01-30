import React, { useState, useEffect } from 'react';
import '../../styles/PublicHero.css';

const PublicHero = ({ termoBusca, setTermoBusca }) => {
  
  // Lista de imagens atualizada e testada (Feira, Comida, Artesanato, Música)
  const images = [
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop", // Feira de Rua (Verduras)
    "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop", // Comida de Rua / Gastronomia
    "https://images.unsplash.com/photo-1459257485404-78d7f3353bc0?q=80&w=2070&auto=format&fit=crop", // Artesanato / Tecidos
    "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2070&auto=format&fit=crop"  // Evento / Show
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState("fade-in");

  useEffect(() => {
    const intervalId = setInterval(() => {
      // 1. Inicia o Fade Out
      setFadeClass("fade-out");

      // 2. Aguarda a animação e troca a imagem
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFadeClass("fade-in");
      }, 500); // Tempo igual ao da transição CSS

    }, 5000); // Troca a cada 5 segundos (aumentei um pouco para dar tempo de carregar)

    return () => clearInterval(intervalId);
  }, [images.length]);

  // Função de segurança: Se a imagem falhar, carrega esta aqui
  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop";
  };

  return (
    <section className="py-5 hero-section d-flex align-items-center">
      <div className="container py-4">
        <div className="row align-items-center g-5">
          
          {/* LADO ESQUERDO: Texto e Busca */}
          <div className="col-lg-6 order-2 order-lg-1 z-1">
            <h1 className="display-4 fw-bold mb-3 hero-title">
              Descubra feiras e <br/>
              <span className="text-primary">artesãos locais.</span>
            </h1>
            <p className="lead text-muted mb-4">
              Explore o melhor da cultura, gastronomia e arte da sua região. 
              Encontre eventos próximos a você agora mesmo.
            </p>

            {/* Barra de Busca */}
            <div className="bg-white p-2 rounded-pill shadow-sm border d-flex align-items-center">
              <span className="ps-3 text-muted">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-none bg-transparent hero-search-input"
                placeholder="Buscar por nome ou cidade..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
              <button 
                className="btn btn-primary rounded-pill px-4 hero-search-btn"
              >
                Buscar
              </button>
            </div>
            
            <div className="mt-3 small text-muted">
              <i className="fas fa-chart-line me-1"></i> 
            </div>
          </div>

          {/* LADO DIREITO: Imagem que Intercala */}
          <div className="col-lg-6 order-1 order-lg-2">
            <div className="hero-image-container">
              <img 
                src={images[currentIndex]} 
                alt="Destaque Feira" 
                className={`img-fluid hero-image-blob ${fadeClass}`}
                onError={handleImageError} // <--- Proteção contra erro de imagem
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PublicHero;