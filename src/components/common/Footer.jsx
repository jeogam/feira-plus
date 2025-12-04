import React from 'react';

const Footer = () => {
    return (
        <footer className="mt-5 py-4 text-center text-muted border-top bg-white">
            <div className="container">
                <p className="mb-1">
                    &copy; {new Date().getFullYear()} <strong>Feira+</strong> &bull; Painel Administrativo
                </p>
                <small style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                    Desenvolvido para IFBA Campus Irecê
                </small>
            </div>
        </footer>
    );
};

export default Footer;