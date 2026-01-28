import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table, InputGroup } from "react-bootstrap";
import api from "../../services/api";

// Importando seus modais personalizados (Ajuste o caminho se necessário)
import SuccessModal from "../common/SuccessModal";
import ErrorModal from "../common/ErrorModal";

const ProdutosModal = ({ show, handleClose, expositor }) => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Estados para controlar os Modais de Feedback
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    preco: "",
    descricao: "",
  });

  // Carrega produtos sempre que o modal abre ou troca de expositor
  useEffect(() => {
    if (show && expositor) {
      carregarProdutos();
      setNovoProduto({ nome: "", preco: "", descricao: "" });
    }
  }, [show, expositor]);

  // ✅ NOVA LÓGICA DE CARREGAMENTO USANDO O ENDPOINT OTIMIZADO
  const carregarProdutos = async () => {
    if (!expositor?.id) return;
    setLoading(true);
    try {
      // Chama a rota específica que criamos no backend
      const dados = await api.get(`/produtos/listar-por-expositor/${expositor.id}`);
      
      // Garante que seja um array antes de setar o estado
      setProdutos(Array.isArray(dados) ? dados : []);
      
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      // Se der erro (ex: 404 ou lista vazia), limpamos a lista para não mostrar dados antigos
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoProduto((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdicionar = async (e) => {
    e.preventDefault();
    if (!novoProduto.nome || !novoProduto.preco) return;

    try {
      setLoading(true);
      
      const payload = {
        nome: novoProduto.nome,
        preco: parseFloat(novoProduto.preco),
        descricao: novoProduto.descricao,
        expositorId: expositor.id, 
      };

      // Rota de cadastro
      await api.post("/produtos/cadastrar", payload);

      setNovoProduto({ nome: "", preco: "", descricao: "" });
      await carregarProdutos(); // Recarrega a lista usando o novo endpoint
      
      // Sucesso
      setModalMessage("Produto adicionado com sucesso!");
      setShowSuccess(true);
      
    } catch (error) {
      console.error(error);
      // Erro
      setModalMessage("Erro ao salvar produto. Verifique os dados.");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (idProduto) => {
    if (!window.confirm("Tem certeza que deseja remover este produto?")) return;

    try {
      await api.delete(`/produtos/delete/${idProduto}`);
      
      // Remove localmente para resposta instantânea
      setProdutos((prev) => prev.filter((p) => p.id !== idProduto));

      setModalMessage("Produto removido com sucesso!");
      setShowSuccess(true);

    } catch (error) {
      console.error(error);
      setModalMessage("Não foi possível excluir o produto.");
      setShowError(true);
    }
  };

  return (
    <>
      {/* Modal Principal */}
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="h5 text-primary">
            <i className="bi bi-box-seam me-2"></i>
            Produtos de <span className="fw-bold text-dark">{expositor?.nome}</span>
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {/* Formulário de Adição */}
          <div className="card card-body bg-light border-0 mb-4">
            <h6 className="card-subtitle mb-3 text-muted">Adicionar Novo Produto</h6>
            <Form onSubmit={handleAdicionar}>
              <div className="row g-2">
                <div className="col-md-5">
                  <Form.Control
                    type="text"
                    name="nome"
                    placeholder="Nome do produto"
                    value={novoProduto.nome}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <InputGroup>
                    <InputGroup.Text>R$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="preco"
                      placeholder="0,00"
                      value={novoProduto.preco}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </div>
                <div className="col-md-4">
                  <Button type="submit" variant="success" className="w-100" disabled={loading}>
                    {loading ? "Salvando..." : <><i className="bi bi-plus-lg"></i> Adicionar</>}
                  </Button>
                </div>
                <div className="col-12 mt-2">
                  <Form.Control
                    type="text"
                    name="descricao"
                    placeholder="Descrição opcional..."
                    size="sm"
                    value={novoProduto.descricao}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </Form>
          </div>

          {/* Lista de Produtos */}
          <h6 className="mb-3 border-bottom pb-2">Catálogo Atual</h6>
          <div className="table-responsive" style={{ maxHeight: "350px", overflowY: "auto" }}>
            <Table hover size="sm" className="align-middle">
              <thead className="table-light sticky-top">
                <tr>
                  <th>Produto</th>
                  <th>Descrição</th>
                  <th style={{ width: "120px" }}>Preço</th>
                  <th className="text-end" style={{ width: "80px" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.length > 0 ? (
                  produtos.map((prod) => (
                    <tr key={prod.id}>
                      <td className="fw-bold text-secondary">{prod.nome}</td>
                      <td className="small text-muted text-truncate" style={{ maxWidth: "200px" }}>
                        {prod.descricao || "-"}
                      </td>
                      <td className="fw-semibold text-success">
                        R$ {Number(prod.preco).toFixed(2).replace(".", ",")}
                      </td>
                      <td className="text-end">
                        <Button 
                          variant="link" 
                          className="text-danger p-0" 
                          onClick={() => handleExcluir(prod.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      {loading ? "Carregando..." : "Nenhum produto cadastrado."}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>Fechar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modais de Feedback (com Z-Index ajustado) */}
      <div style={{ zIndex: 1060, position: 'relative' }}>
        <SuccessModal 
          show={showSuccess} 
          handleClose={() => setShowSuccess(false)} 
          message={modalMessage} 
        />
        
        <ErrorModal 
          show={showError} 
          handleClose={() => setShowError(false)} 
          message={modalMessage} 
        />
      </div>
    </>
  );
};

export default ProdutosModal;