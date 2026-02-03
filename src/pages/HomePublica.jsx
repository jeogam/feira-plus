import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FeiraService } from "../services/FeiraService";
import Footer from "../components/common/Footer";
import "../styles/HomePublica.css";

import PublicNavbar from "../components/public/PublicNavbar";
import PublicHero from "../components/public/PublicHero";
import PublicToolbar from "../components/public/PublicToolBar";
import FeiraCard from "../components/public/FeiraCard";
import FeiraModal from "../components/public/FeiraModal";
import CallToAction from "../components/public/CallToAction";
import ExpositorCtaModal from "../components/public/ExpositorCtaModal";

const HomePublica = () => {
  const navigate = useNavigate(); 

  const [todasFeiras, setTodasFeiras] = useState([]);
  const [feirasExibidas, setFeirasExibidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feiraSelecionada, setFeiraSelecionada] = useState(null);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("TODOS");
  const [showExpositorModal, setShowExpositorModal] = useState(false);

  useEffect(() => {
    carregarFeiras();
  }, []);

  // ... (useEffects de filtro mantidos iguais) ...
  useEffect(() => {
    let lista = todasFeiras;
    if (termoBusca) {
      const termoLower = termoBusca.toLowerCase();
      lista = lista.filter(
        (f) =>
          f.nome.toLowerCase().includes(termoLower) ||
          f.local.toLowerCase().includes(termoLower),
      );
    }
    if (filtroTipo !== "TODOS") {
      lista = lista.filter((f) => f.tipo === filtroTipo);
    }
    setFeirasExibidas(lista);
  }, [termoBusca, filtroTipo, todasFeiras]);

  const carregarFeiras = async () => {
    try {
      const dados = await FeiraService.listarTodas();
      setTodasFeiras(dados);
      setFeirasExibidas(dados);
    } catch (error) {
      console.error("Erro ao carregar feiras públicas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    setShowExpositorModal(true);
  };

  return (
    <div className="d-flex flex-column bg-white" style={{ height: "100vh", overflowY: "auto" }}>
      
      {/* ✅ Navbar agora gerencia quem vê o que baseado no Contexto */}
      <PublicNavbar 
        onNavigateLogin={handleLogin} 
        onNavigateRegister={handleRegister} 
      />

      <PublicHero termoBusca={termoBusca} setTermoBusca={setTermoBusca} />

      <main className="flex-grow-1 bg-contrast py-5">
        <div className="container">
          {/* ... Conteúdo da Home mantido igual ... */}
          <div className="text-center mb-5">
            <h3 className="fw-bold" style={{ color: "#1e2939" }}>
              Explore Nossas Feiras
            </h3>
            <div style={{ width: "60px", height: "4px", backgroundColor: "#1e2939", margin: "10px auto", borderRadius: "2px" }}></div>
          </div>

          <PublicToolbar filtroTipo={filtroTipo} setFiltroTipo={setFiltroTipo} />

          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <>
              {feirasExibidas.length === 0 ? (
                <div className="text-center py-5">
                  <h4 className="text-muted">Nenhum resultado encontrado</h4>
                </div>
              ) : (
                <div className="row g-4">
                  {feirasExibidas.map((feira) => (
                    <FeiraCard
                      key={feira.id}
                      feira={feira}
                      onVerDetalhes={setFeiraSelecionada}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <CallToAction onRegisterClick={handleRegister} />
      <Footer />

      <FeiraModal feira={feiraSelecionada} onClose={() => setFeiraSelecionada(null)} />
      <ExpositorCtaModal show={showExpositorModal} handleClose={() => setShowExpositorModal(false)} />
    </div>
  );
};

export default HomePublica;