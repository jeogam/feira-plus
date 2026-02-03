import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
import ContatoService from '../../services/ContatoService';

const ContactModal = ({ show, handleClose, forcedAssunto, forcedMensagem }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: forcedAssunto || 'SUGESTAO',
    mensagem: forcedMensagem || ''
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Se o campo for "assunto" ou "mensagem" e estiver forçado, não permite edição
    if ((name === 'assunto' && forcedAssunto) || (name === 'mensagem' && forcedMensagem)) {
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpa erro do campo ao editar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.mensagem.trim()) {
      newErrors.mensagem = 'Mensagem é obrigatória';
    } else if (formData.mensagem.trim().length < 10) {
      newErrors.mensagem = 'Mensagem deve ter no mínimo 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Tenta enviar via API
      await ContatoService.enviarMensagem(formData);
      
      console.log('Formulário enviado com sucesso:', formData);
      
      setShowSuccess(true);
      
      // Limpa o formulário
      setFormData({
        nome: '',
        email: '',
        assunto: 'SUGESTAO',
        mensagem: ''
      });
      
      // Fecha o modal após 2 segundos
      setTimeout(() => {
        setShowSuccess(false);
        handleClose();
      }, 2000);

    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setErrorMessage(error.message || 'Erro ao enviar mensagem. Tente novamente.');
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setFormData({
      nome: '',
      email: '',
      assunto: forcedAssunto || 'SUGESTAO',
      mensagem: forcedMensagem || ''
    });
    setErrors({});
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleModalClose} centered size="lg">
        <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #1e2939' }}>
          <Modal.Title style={{ color: '#1e2939', fontWeight: 'bold' }}>
            <i className="bi bi-envelope-heart me-2"></i>
            Contato e Sugestões
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-4">
          <p className="text-muted mb-4">
            Sua opinião é muito importante para nós! Envie suas sugestões, dúvidas ou feedbacks.
          </p>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Nome <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Seu nome completo"
                isInvalid={!!errors.nome}
                disabled={isSubmitting}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nome}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Email <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu.email@exemplo.com"
                isInvalid={!!errors.email}
                disabled={isSubmitting}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assunto</Form.Label>
              <Form.Select
                name="assunto"
                value={formData.assunto}
                onChange={handleChange}
                disabled={isSubmitting || !!forcedAssunto}
              >
                <option value="SUGESTAO">Sugestão</option>
                <option value="DUVIDA">Dúvida</option>
                <option value="ELOGIO">Elogio</option>
                <option value="RECLAMACAO">Reclamação</option>
                <option value="OUTRO">Outro</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>
                Mensagem <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                placeholder="Escreva sua mensagem aqui..."
                isInvalid={!!errors.mensagem}
                disabled={isSubmitting || !!forcedMensagem}
                maxLength={1000}
              />
              <Form.Control.Feedback type="invalid">
                {errors.mensagem}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                {formData.mensagem.length}/1000 caracteres
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="secondary" 
                onClick={handleModalClose}
                disabled={isSubmitting}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: '#1e2939', borderColor: '#1e2939' }}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Enviando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-2"></i>
                    Enviar Mensagem
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modais de Feedback */}
      <SuccessModal 
        show={showSuccess} 
        handleClose={() => setShowSuccess(false)} 
        message="Mensagem enviada com sucesso! Agradecemos pelo contato." 
      />
      
      <ErrorModal 
        show={showError} 
        handleClose={() => setShowError(false)} 
        message={errorMessage} 
      />
    </>
  );
};

export default ContactModal;
