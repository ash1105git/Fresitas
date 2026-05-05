#!/bin/bash
# ================================================================
#  deploy-aws.sh — Despliegue de Fresitas en AWS S3 + CloudFront
#  Configura MIME types correctos para que la AR funcione en
#  Android (WebXR) e iPhone/iPad (ARKit Quick Look)
# ================================================================

# ── CONFIGURACIÓN — edita estos valores ──────────────────────────
BUCKET="tu-bucket-name"          # Nombre de tu bucket S3
REGION="us-east-1"               # Región de tu bucket
DISTRIBUTION_ID="XXXXXXXXXXXXXXX" # ID de tu distribución CloudFront (opcional)
# ─────────────────────────────────────────────────────────────────

set -e

echo "🍓 Iniciando despliegue de Strawberry Yarn en AWS..."

# 1. Subir archivos HTML con cache corto
echo "📄 Subiendo archivos HTML..."
aws s3 sync . s3://$BUCKET \
  --exclude "*" \
  --include "*.html" \
  --content-type "text/html; charset=utf-8" \
  --cache-control "public, max-age=300" \
  --region $REGION

# 2. Subir CSS
echo "🎨 Subiendo CSS..."
aws s3 sync ./css s3://$BUCKET/css \
  --content-type "text/css; charset=utf-8" \
  --cache-control "public, max-age=86400" \
  --region $REGION

# 3. Subir JS
echo "⚙️  Subiendo JavaScript..."
aws s3 sync ./js s3://$BUCKET/js \
  --content-type "application/javascript; charset=utf-8" \
  --cache-control "public, max-age=86400" \
  --region $REGION

# 4. Subir modelos 3D (.glb) con MIME type correcto para AR
#    CRÍTICO: sin este MIME type la AR no funciona en iOS Safari
echo "🎭 Subiendo modelos 3D (.glb)..."
for f in assets/modelos/*.glb; do
  echo "   → $f"
  aws s3 cp "$f" "s3://$BUCKET/$f" \
    --content-type "model/gltf-binary" \
    --cache-control "public, max-age=604800" \
    --region $REGION
done

# 5. Subir imágenes de productos
echo "🖼️  Subiendo imágenes..."
aws s3 sync ./assets/productos s3://$BUCKET/assets/productos \
  --exclude "*.glb" \
  --cache-control "public, max-age=604800" \
  --region $REGION

# 6. Subir logo y otros assets
aws s3 sync ./assets s3://$BUCKET/assets \
  --exclude "modelos/*.glb" \
  --exclude "productos/*" \
  --cache-control "public, max-age=604800" \
  --region $REGION

# 7. Invalidar caché de CloudFront (si se configuró)
if [ "$DISTRIBUTION_ID" != "XXXXXXXXXXXXXXX" ]; then
  echo "☁️  Invalidando caché de CloudFront..."
  aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths "/*"
  echo "✅ Invalidación de CloudFront creada."
fi

echo ""
echo "✅ Despliegue completado."
echo "🌐 Tu sitio: http://$BUCKET.s3-website-$REGION.amazonaws.com"
echo ""
echo "⚠️  RECORDATORIO:"
echo "   - Activa 'Static website hosting' en la consola de S3"
echo "   - El bucket debe ser público (o usar CloudFront)"
echo "   - Para AR en iPhone: el sitio DEBE servirse por HTTPS"
echo "     (CloudFront lo hace automáticamente)"
