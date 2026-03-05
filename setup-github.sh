#!/bin/bash
set -e

echo "=== Setup: mcp-server-siebel ==="

# 1. Instalar dependencias y hacer build
echo ""
echo "[1/4] Instalando dependencias..."
npm install

echo ""
echo "[2/4] Compilando TypeScript..."
npm run build

echo ""
echo "[3/4] Inicializando git y subiendo a GitHub..."
git init
git add .
git commit -m "feat: initial release - MCP server for Siebel CRM"

# Crear repo en GitHub (requiere gh CLI instalado y autenticado)
gh repo create jeretucu/mcp-server-siebel \
  --public \
  --description "MCP server for Oracle Siebel CRM integration" \
  --source=. \
  --remote=origin \
  --push

echo ""
echo "[4/4] Listo para publicar en npm."
echo ""
echo "Para publicar en npm, ejecuta:"
echo "  npm login"
echo "  npm publish --access public"
echo ""
echo "O configura NPM_TOKEN en GitHub Secrets y crea un tag:"
echo "  git tag v1.0.0"
echo "  git push origin v1.0.0"
echo ""
echo "=== Setup completo ==="
