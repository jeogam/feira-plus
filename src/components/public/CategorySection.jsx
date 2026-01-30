import React from 'react';

const CategorySection = () => {
  // Categorias estáticas para visual (futuramente podem vir da API)
  const categories = [
    { icon: 'fa-utensils', label: 'Gastronomia', color: '#e67e22' },
    { icon: 'fa-tshirt', label: 'Vestuário', color: '#9b59b6' },
    { icon: 'fa-tree', label: 'Madeira', color: '#27ae60' },
    { icon: 'fa-gem', label: 'Bijuterias', color: '#e74c3c' },
    { icon: 'fa-paint-brush', label: 'Pinturas', color: '#3498db' },
    { icon: 'fa-music', label: 'Cultural', color: '#f1c40f' },
  ];

  return (
    <div className="container mb-5">
      <h4 className="fw-bold text-brand mb-4 border-start border-4 border-primary ps-3">
        Navegue por Categorias
      </h4>
      <div className="d-flex justify-content-between overflow-auto pb-3 gap-3 text-center">
        {categories.map((cat, idx) => (
          <div key={idx} className="d-flex flex-column align-items-center category-item" style={{ minWidth: '100px', cursor: 'pointer' }}>
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center shadow-sm mb-2 hover-zoom"
              style={{ width: '70px', height: '70px', backgroundColor: 'white', border: `2px solid ${cat.color}` }}
            >
              <i className={`fas ${cat.icon} fs-3`} style={{ color: cat.color }}></i>
            </div>
            <span className="small fw-bold text-muted">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;