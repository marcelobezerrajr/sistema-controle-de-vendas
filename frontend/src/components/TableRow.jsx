import React from 'react';
import "../styles/TableRow.css"

const TableRow = ({ rowData, columns, actions, idField, secondaryIdField }) => {
  const userPermission = localStorage.getItem('user_permission');

  return (
    <tr>
      {columns.map((col) => (
        <td key={col}>{rowData[col]}</td>
      ))}
      
      <td>
        {actions.view && (
          <button 
            onClick={() => {
              if (secondaryIdField) {
                actions.view(rowData[idField], rowData[secondaryIdField]);
              } else {
                actions.view(rowData[idField]);
              }
            }}
            className="custom-button-view"
          >
            Ver
          </button>
        )}
        
        {actions.update && (userPermission === 'Admin' || (userPermission === 'User' && rowData.permission !== 'Admin')) && (
          <button onClick={() => actions.update(rowData[idField])} className="custom-button-edit">Editar</button>
        )}
        
        {actions.delete && userPermission === 'Admin' && (
          <button onClick={() => actions.delete(rowData[idField])} className="custom-button-delete">Deletar</button>
        )}
      </td>
    </tr>
  );
};

export default TableRow;
