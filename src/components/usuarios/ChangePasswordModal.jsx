import React, { useState } from 'react';

const ChangePasswordModal = ({ show, handleClose, handleSave }) => {
    const [passData, setPassData] = useState({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
    });

    const [erroSenha, setErroSenha] = useState('');

    const handleChange = (e) => {
        setPassData({ ...passData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErroSenha('');

        // Validação básica no Front
        if (passData.novaSenha !== passData.confirmarSenha) {
            setErroSenha('A nova senha e a confirmação não coincidem.');
            return;
        }

        if (passData.novaSenha.length < 6) {
            setErroSenha('A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }

        // Envia para o componente pai
        handleSave({
            senhaAtual: passData.senhaAtual,
            novaSenha: passData.novaSenha,
            senhaConfirmada: passData.confirmarSenha
        });
        
        // Limpa formulário
        setPassData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
    };

    if (!show) return null;

    return (
        <>
            <div className="modal-backdrop fade show"></div>
            <div className="modal fade show d-block" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Alterar Senha de Acesso</h5>
                            <button type="button" className="btn-close" onClick={handleClose}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                
                                {erroSenha && (
                                    <div className="alert alert-danger p-2 small mb-3">
                                        <i className="fas fa-exclamation-circle me-1"></i> {erroSenha}
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Senha Atual</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="senhaAtual"
                                        value={passData.senhaAtual}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Nova Senha</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="novaSenha"
                                        value={passData.novaSenha}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Confirmar Nova Senha</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="confirmarSenha"
                                        value={passData.confirmarSenha}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-warning fw-bold">
                                    <i className="fas fa-key me-2"></i> Atualizar Senha
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChangePasswordModal;