import { createContext, useState, useContext, useEffect } from 'react';
import { contactService } from '../api/apiClient';

const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [allContacts, setAllContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar TODOS los contactos paginando (máximo 100 por página)
  const fetchAllContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Primera página para obtener el total
      const firstPage = await contactService.getContactos({ page: 1, page_size: 100 });
      const totalPages = firstPage.pages || 1;
      const allItems = [...(firstPage.items || [])];

      // Si hay más páginas, traer todas en paralelo
      if (totalPages > 1) {
        const remainingPages = Array.from(
          { length: totalPages - 1 },
          (_, i) => i + 2
        );

        const responses = await Promise.all(
          remainingPages.map(page =>
            contactService.getContactos({ page, page_size: 100 })
              .then(res => res.items || [])
              .catch(err => {
                console.error(`Error fetching page ${page}:`, err);
                return [];
              })
          )
        );

        responses.forEach(items => allItems.push(...items));
      }

      setAllContacts(allItems);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching all contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllContacts();
  }, []);

  const value = {
    allContacts,
    loading,
    error,
    refreshContacts: fetchAllContacts,
    totalContactos: allContacts.length,
    aliadosCount: allContacts.filter(c => c.afinidad?.toLowerCase() === 'aliado').length,
    opositoresCount: allContacts.filter(c => c.afinidad?.toLowerCase() === 'opositor').length,
    neutrosCount: allContacts.filter(c => c.afinidad?.toLowerCase() === 'neutro').length,
    movilizadoresCount: allContacts.filter(c => c.moviliza === true).length,
  };

  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContacts must be used within ContactProvider');
  }
  return context;
};
