import React from 'react';
import './HomeLayout.css';
import Footer from './common/Footer'; // <--- Importe o Footer

const HomeLayout = ({ children }) => {
  return (
    // Adicionamos 'd-flex flex-column' para organizar o layout verticalmente
    <div className="home-layout d-flex flex-column">
      
      {/* O conteúdo principal cresce (flex-grow-1) e ocupa o espaço disponível */}
      <div className="flex-grow-1">
        {children}
      </div>

      {/* O Footer fica sempre no final */}
      <Footer />
      
    </div>
  );
};

export default HomeLayout;