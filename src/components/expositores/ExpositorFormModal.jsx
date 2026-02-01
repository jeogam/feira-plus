import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const PLACEHOLDER_IMG = "https://via.placeholder.com/80?text=Foto";

const initialFormData = {
  nome: "",
  documentacao: "",
  status: "ATIVO",
  categoriaId: "",
  tipoProduto: "", // Nota: este campo não existe no DTO Java (ExpositorPostDto), verifique se o backend espera isso.
  descricao: "",
  foto: "",
  nota: 0, // ✅ NOVO
};

const ExpositorFormModal = ({
  show,
  handleClose,
  handleSave,
  expositorParaEditar,
  categorias = [],
}) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (expositorParaEditar) {
      setFormData({
        id: expositorParaEditar.id,
        nome: expositorParaEditar.nome || "",
        documentacao: expositorParaEditar.documentacao || "",
        status: expositorParaEditar.status || "ATIVO",
        categoriaId: expositorParaEditar.categoriaId || "",
        tipoProduto: expositorParaEditar.tipoProduto || "",
        descricao: expositorParaEditar.descricao || "",
        foto: expositorParaEditar.foto || "",
        nota: expositorParaEditar.nota || 0, // ✅ Carrega a nota
      });
    } else {
      setFormData(initialFormData);
    }
  }, [expositorParaEditar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Função para estrelas
  const handleStarClick = (valor) => {
    setFormData((prev) => ({ ...prev, nota: valor }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.categoriaId) {
      alert("Por favor, selecione uma categoria.");
      return;
    }
    if (!formData.descricao?.trim()) {
      alert("Por favor, preencha o campo de Descrição.");
      return;
    }

    handleSave(formData);
  };

  const previewSrc = formData.foto?.trim() ? formData.foto.trim() : PLACEHOLDER_IMG;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-bold text-secondary">
          {expositorParaEditar ? "Editar Expositor" : "Cadastrar Novo Expositor"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          {/* NOME */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Nome do Expositor *</Form.Label>
            <Form.Control
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Ex: Barraca da Maria"
            />
          </Form.Group>

          {/* DOCUMENTAÇÃO */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Documentação (CPF/CNPJ) *</Form.Label>
            <Form.Control
              type="text"
              name="documentacao"
              value={formData.documentacao}
              onChange={handleChange}
              required
              placeholder="000.000.000-00"
            />
          </Form.Group>

          {/* FOTO E NOTA */}
          <div className="row">
            <div className="col-md-7">
                <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">URL da Foto</Form.Label>
                    <div className="d-flex gap-3 align-items-center">
                    <img
                        src={previewSrc}
                        alt="Preview"
                        className="rounded border"
                        style={{ width: 56, height: 56, objectFit: "cover" }}
                        onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER_IMG;
                        }}
                    />
                    <Form.Control
                        type="text"
                        name="foto"
                        value={formData.foto}
                        onChange={handleChange}
                        placeholder="https://..."
                    />
                    </div>
                </Form.Group>
            </div>
            
            {/* ✅ SELETOR DE ESTRELAS */}
            <div className="col-md-5">
                <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Avaliação</Form.Label>
                    <div className="d-flex align-items-center gap-1 fs-3" style={{ cursor: 'pointer' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                        <i
                            key={star}
                            className={`fas fa-star ${star <= formData.nota ? 'text-warning' : 'text-muted opacity-25'}`}
                            onClick={() => handleStarClick(star)}
                        ></i>
                        ))}
                    </div>
                    <Form.Text className="text-muted">
                        Nota atual: {Number(formData.nota).toFixed(1)}
                    </Form.Text>
                </Form.Group>
            </div>
          </div>

          {/* Descrição */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Descrição *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              required
              placeholder="Descreva o expositor..."
            />
          </Form.Group>

          <div className="row">
            {/* Categoria */}
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Categoria *</Form.Label>
                <Form.Select
                  name="categoriaId"
                  value={formData.categoriaId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione...</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            {/* Status */}
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Status *</Form.Label>
                <Form.Select name="status" value={formData.status} onChange={handleChange} required>
                  <option value="INATIVO">INATIVO</option>
                  <option value="ATIVO">ATIVO</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="bg-light">
          <Button variant="outline-secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="success" className="fw-bold">
            {expositorParaEditar ? "Salvar Alterações" : "Cadastrar"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ExpositorFormModal;