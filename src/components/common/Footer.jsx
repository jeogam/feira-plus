import React, { useState } from 'react';
import ContactModal from './ContactModal';

const Footer = () => {
    const [showContact, setShowContact] = useState(false);

    return (
        <>
            <footer className="mt-5 py-4 text-center text-muted border-top bg-white">
                <div className="container">
                    <div className="mb-3">
                        <button 
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => setShowContact(true)}
                            style={{ 
                                borderRadius: '20px',
                                borderColor: '#1e2939',
                                color: '#1e2939'
                            }}
                        >
                            <i className="bi bi-envelope-heart me-1"></i>
                            Contato e Sugestões
                        </button>
                    </div>
                    <p className="mb-1">
                        &copy; {new Date().getFullYear()} <strong>Feira+</strong> &bull; Conectando pessoas às feiras
                    </p>
                    <small style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                        Desenvolvido para IFBA Campus Irecê
                    </small>
                </div>
            </footer>

            <ContactModal 
                show={showContact} 
                handleClose={() => setShowContact(false)} 
            />
        </>
    );
};

export default Footer;