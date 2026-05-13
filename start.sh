#!/bin/bash
# Script de inicio rápido para desarrollo

echo "🚀 Iniciando CRM Congresista Boyacá..."
echo ""

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    echo ""
fi

# Iniciar servidor de desarrollo
echo "▶️  Iniciando servidor de desarrollo en http://localhost:3000"
npm run dev
