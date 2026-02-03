import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EventoFormModal = ({ 
  show, 
  handleClose, 
  handleSave, 
  eventoParaEditar, 
  feirasDisponiveis = [] 
}) => {
  
  const initialState = {
    titulo: "",
    descricao: "",
    dataHoraInicio: "",
    dataHoraFim: "",
    feira: null // Objeto Feira ou ID
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (eventoParaEditar) {
      setFormData({
        ...eventoParaEditar,
        // Formata data para o input HTML (yyyy-MM-ddThh:mm) se vier do Java
        dataHoraInicio: formatarDataParaInput(eventoParaEditar.dataHoraInicio),
        dataHoraFim: formatarDataParaInput(eventoParaEditar.dataHoraFim),
        feira: eventoParaEditar.feira
      });
    } else {
      setFormData(initialState);
    }
  }, [eventoParaEditar, show]);

  // Função auxiliar para converter LocalDateTime do Java para input HTML
  const formatarDataParaInput = (dataString) => {
    if (!dataString) return "";
    return dataString.substring(0, 16); // Pega apenas "2026-10-10T08:00"
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Trata a mudança do Select de Feira
  const handleFeiraChange = (e) => {
    const feiraId = Number(e.target.value);
    const feiraSelecionada = feirasDisponiveis.find(f => f.id === feiraId);
    setFormData(prev => ({ ...prev, feira: feiraSelecionada }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(formData);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{eventoParaEditar ? "Editar Evento" : "Novo Evento"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Título do Evento</Form.Label>
            <Form.Control 
              type="text" 
              name="titulo" 
              value={formData.titulo} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Vincular à Feira</Form.Label>
            <Form.Select 
              value={formData.feira?.id || ""} 
              onChange={handleFeiraChange}
              required
            >
              <option value="">Selecione uma feira...</option>
              {feirasDisponiveis.map(feira => (
                <option key={feira.id} value={feira.id}>
                  {feira.nome} ({feira.tipo})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="row">
            <div className="col-6 mb-3">
              <Form.Label className="fw-bold">Início</Form.Label>
              <Form.Control 
                type="datetime-local" 
                name="dataHoraInicio" 
                value={formData.dataHoraInicio} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="col-6 mb-3">
              <Form.Label className="fw-bold">Fim</Form.Label>
              <Form.Control 
                type="datetime-local" 
                name="dataHoraFim" 
                value={formData.dataHoraFim} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Descrição</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              name="descricao" 
              value={formData.descricao} 
              onChange={handleChange} 
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
             <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
             <Button type="submit" variant="primary">Salvar Evento</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EventoFormModal;