import React, { useState, useEffect } from 'react';

const UserFormModal = ({ show, handleClose, handleSave, userToEdit }) => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        perfilUsuario: 'USUARIO' // Valor padrão
    });

    // Atualiza o formulário quando o usuário a ser editado muda
    useEffect(() => {
        if (userToEdit) {
            setFormData({
                nome: userToEdit.nome,
                email: userToEdit.email,
                perfilUsuario: userToEdit.perfilUsuario
            });
        } else {
            setFormData({ nome: '', email: '', perfilUsuario: 'USUARIO' });
        }
    }, [userToEdit, show]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave(formData); // Envia os dados de volta para a tela pai
    };

    if (!show) return null;

    return (
        <>
            <div className="modal-backdrop fade show"></div>
            <div className="modal fade show d-block" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {userToEdit ? 'Editar Usuário' : 'Novo Usuário'}
                            </h5>
                            <button type="button" className="btn-close" onClick={handleClose}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                
                                {/* Nome */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Nome</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Perfil (Select) */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Perfil</label>
                                    <select 
                                        className="form-select"
                                        name="perfilUsuario"
                                        value={formData.perfilUsuario}
                                        onChange={handleChange}
                                    >
                                        <option value="USUARIO">Usuário Padrão</option>
                                        <option value="ADMIN">Administrador</option>
                                    </select>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserFormModal;