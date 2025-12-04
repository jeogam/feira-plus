import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/GestaoUsuarios.css'; 

// Componentes
import UserProfileCard from '../components/usuarios/UserProfileCard';
import UserListTable from '../components/usuarios/UserListTable';
import UserFormModal from '../components/usuarios/UserFormModal';
import ChangePasswordModal from '../components/usuarios/ChangePasswordModal';

// Modais
import SuccessModal from '../components/common/SuccessModal';
import ErrorModal from '../components/common/ErrorModal';

const GestaoUsuarios = () => {
    const { user: currentUser } = useContext(AuthContext);

    // Estados
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Controle de Modais
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [successState, setSuccessState] = useState({ show: false, message: '' });
    const [errorState, setErrorState] = useState({ show: false, message: '' });

    // --- API & Lógica (Mantida igual) ---
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/usuarios/buscar');
            if (response && Array.isArray(response.content)) {
                setUsers(response.content);
            } else if (Array.isArray(response)) {
                setUsers(response);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("Erro ao buscar:", error);
            setErrorState({ show: true, message: 'Erro ao carregar lista.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const term = searchTerm.toLowerCase();
        return (
            user.nome?.toLowerCase().includes(term) || 
            user.email?.toLowerCase().includes(term) ||
            user.perfilUsuario?.toLowerCase().includes(term)
        );
    });

    // --- Handlers (Mantidos iguais) ---
    const handleEditClick = (user) => {
        setUserToEdit(user);
        setShowEditModal(true);
    };

    const handleSaveUser = async (formData) => {
        try {
            await api.patch(`/usuarios/update/${userToEdit.id}`, formData);
            setSuccessState({ show: true, message: 'Usuário atualizado!' });
            setShowEditModal(false);
            fetchUsers();
        } catch (error) {
            console.error(error);
            setErrorState({ show: true, message: 'Erro ao salvar.' });
        }
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm("Deseja realmente excluir este usuário?")) {
            try {
                await api.delete(`/usuarios/delete/${id}`);
                setSuccessState({ show: true, message: 'Usuário removido.' });
                setUsers(prev => prev.filter(u => u.id !== id));
            } catch (error) {
                console.error(error);
                setErrorState({ show: true, message: 'Erro ao excluir.' });
            }
        }
    };

    const handleUpdatePassword = async (passData) => {
        try {
            await api.patch(`/usuarios/update/senha/${currentUser.id}`, passData);
            setSuccessState({ show: true, message: 'Senha alterada!' });
            setShowPasswordModal(false);
        } catch (error) {
            const msg = error.response?.data?.message || 'Erro ao alterar senha.'; 
            setErrorState({ show: true, message: msg });
        }
    };

    // --- RENDERIZAÇÃO ---
    return (
        // Uso da classe page-container-bottom
        <div className="container-fluid fade-in page-container-bottom"> 
            <h2 className="mb-4 text-dark fw-bold">Gestão de Usuários</h2>

            <UserProfileCard 
                user={currentUser} 
                onChangePassword={() => setShowPasswordModal(true)} 
            />

            <div className="card shadow-sm border-0 mb-4">
                
                <div className="card-header bg-white py-3">
                    <div className="row align-items-center g-3">
                        
                        {/* Título */}
                        <div className="col-12 col-md-6">
                            <h5 className="mb-0 fw-bold text-secondary">
                                <i className="fas fa-users me-2"></i> Lista de Usuários
                            </h5>
                        </div>

                        {/* Busca Responsiva com Classe CSS */}
                        <div className="col-12 col-md-6 d-flex justify-content-md-end">
                            <div className="input-group search-container">
                                <span className="input-group-text bg-light border-end-0">
                                    <i className="fas fa-search text-muted"></i>
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control border-start-0 bg-light" 
                                    placeholder="Buscar por nome ou email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                    </div>
                </div>

                <div className="card-body p-0">
                    <UserListTable 
                        users={filteredUsers} 
                        loading={loading}
                        currentUser={currentUser}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />
                </div>
            </div>

            {/* Modais */}
            <UserFormModal 
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                handleSave={handleSaveUser}
                userToEdit={userToEdit}
            />
            <ChangePasswordModal 
                show={showPasswordModal}
                handleClose={() => setShowPasswordModal(false)}
                handleSave={handleUpdatePassword}
            />
            <SuccessModal 
                show={successState.show} 
                message={successState.message} 
                handleClose={() => setSuccessState({ ...successState, show: false })} 
            />
            <ErrorModal 
                show={errorState.show} 
                message={errorState.message} 
                handleClose={() => setErrorState({ ...errorState, show: false })} 
            />
        </div>
    );
};

export default GestaoUsuarios;