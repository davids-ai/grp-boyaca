// Configuración base de la API
export const API_BASE = "https://backend-crm-l5dw.onrender.com/";

// Cliente HTTP mejorado con manejo de errores
export class ApiClient {
  constructor(baseURL = API_BASE) {
    this.baseURL = baseURL;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }

  async request(endpoint, options = {}) {
    const { method = 'GET', body = null, useCache = true, cacheKey = null } = options;
    
    const url = `${this.baseURL}${endpoint}`;
    const cacheKeyToUse = cacheKey || `${method}:${endpoint}`;

    // Verificar caché para GET
    if (method === 'GET' && useCache && this.cache.has(cacheKeyToUse)) {
      const cached = this.cache.get(cacheKeyToUse);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body) {
        config.body = JSON.stringify(body);
      }

      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Cachear GET exitosos
      if (method === 'GET' && useCache) {
        this.cache.set(cacheKeyToUse, {
          data,
          timestamp: Date.now(),
        });
      }

      return data;
    } catch (error) {
      console.error(`Error en API: ${url}`, error);
      
      // Si hay error en GET, intentar devolver caché viejo
      if (method === 'GET' && this.cache.has(cacheKeyToUse)) {
        console.warn('Usando caché antiguo por falta de conexión');
        return this.cache.get(cacheKeyToUse).data;
      }

      throw error;
    }
  }

  clearCache() {
    this.cache.clear();
  }

  getCachedData(cacheKey) {
    return this.cache.get(cacheKey)?.data;
  }
}

export const apiClient = new ApiClient();

// ===== SERVICIOS ESPECÍFICOS =====

export const contactService = {
  // Obtener todos los contactos
  getContactos: (params = {}) => {
    const { page = 1, page_size = 20 } = params;
    return apiClient.request(`contactos?page=${page}&page_size=${page_size}`);
  },

  // Filtrar contactos con parámetros avanzados
  filterContactos: (filters) => {
    const params = new URLSearchParams();
    if (filters.nombre) params.append('nombre', filters.nombre);
    if (filters.municipio_id) params.append('municipio_id', filters.municipio_id);
    if (filters.cargo_id) params.append('cargo_id', filters.cargo_id);
    if (filters.partido_id) params.append('partido_id', filters.partido_id);
    if (filters.afinidad) params.append('afinidad', filters.afinidad);
    if (filters.prioridad) params.append('prioridad', filters.prioridad);

    return apiClient.request(`contactos/filtrar?${params.toString()}`);
  },

  // Obtener contactos por tipo
  getContactosPorTipo: (tipoId) =>
    apiClient.request(`contactos/por-tipo/${tipoId}`),

  // Obtener detalle de un contacto
  getContacto: (contactoId) =>
    apiClient.request(`contactos/${contactoId}`),

  // Crear contacto
  createContacto: (data) =>
    apiClient.request('contactos', {
      method: 'POST',
      body: data,
    }),

  // Actualizar contacto
  updateContacto: (contactoId, data) =>
    apiClient.request(`contactos/${contactoId}`, {
      method: 'PUT',
      body: data,
    }),

  // Eliminar contacto
  deleteContacto: (contactoId) =>
    apiClient.request(`contactos/${contactoId}`, {
      method: 'DELETE',
    }),
};

export const catalogService = {
  // Obtener provincias
  getProvincias: () =>
    apiClient.request('provincias'),

  // Obtener municipios de una provincia
  getMunicipiosPorProvincia: (provinciaId) =>
    apiClient.request(`provincias/${provinciaId}/municipios`),

  // Obtener todos los municipios
  getMunicipios: () =>
    apiClient.request('municipios'),

  // Obtener cargos
  getCargos: () =>
    apiClient.request('cargos'),

  // Obtener partidos
  getPartidos: () =>
    apiClient.request('partidos'),

  // Obtener tipos de contacto
  getTipos: () =>
    apiClient.request('tipos'),

  // Obtener tipos de relación
  getRelaciones: () =>
    apiClient.request('relaciones'),
};
