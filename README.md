# Menu Maky

Sitio estatico del menu publico de Maky Restaurante. No es un proyecto Node, Vite, React ni de otro framework: no requiere `package.json`, `npm install` ni `npm run dev`.

## Estructura

- `index.html`: contenido del menu, metadatos SEO, secciones, enlaces de contacto y datos visibles del restaurante.
- `styles.css`: estilos visuales, responsive, animaciones y estados de presentacion.
- `script.js`: navegacion con offset, estado activo de categorias, animaciones, skeleton loader y fallback para imagenes opcionales.
- `images/`: recursos visuales del menu.
- `public/images/decorativas-ia/`: recursos decorativos IA optimizados en WebP.
- `render.yaml`: blueprint para desplegar el sitio como Static Site en Render.

## Como ejecutar

Desde la raiz del proyecto:

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

Luego abrir:

```text
http://127.0.0.1:8080/
```

Tambien puede servirse con cualquier servidor estatico equivalente, por ejemplo `npx serve .`, pero Node no es necesario para este proyecto.

En VS Code, la configuracion `Serve static site` inicia el mismo servidor desde una terminal integrada. No intenta lanzar ni adjuntarse a Chrome.

## Imagenes de productos pendientes

Las tarjetas que todavia no tienen fotografia real usan un fondo artesanal generado por CSS, sin apuntar a archivos inexistentes y sin usar imagenes IA de platos. Cuando existan fotografias reales, reemplazar el fondo pendiente por un `<img>` con el archivo correspondiente y un `alt` descriptivo.

Fotografias reales pendientes:

- `images/pan_ajo.jpg`
- `images/maduro_queso.jpg`
- `images/ensalada_tradicional.jpg`
- `images/sopa_dia.jpg`
- `images/tbone_andino.jpg`
- `images/ribeye_andino.jpg`
- `images/Chuleta_cerdo.jpg`
- `images/filete_pollo.jpg`

`images/og_maky.jpg` si existe y se usa para la vista previa al compartir el sitio en WhatsApp, Facebook y otras redes.

## Mantenimiento del menu

Para cambiar productos, precios o textos, editar las tarjetas correspondientes en `index.html`. Mantener el `alt` de cada imagen actualizado para accesibilidad.

Para cambiar estilos visuales, editar `styles.css`. Revisar especialmente los puntos responsive al final del archivo.

Para cambiar comportamiento interactivo, editar `script.js`. El tracking de secciones esta desactivado por defecto mediante `DEBUG_SECTION_TRACKING`.

## Checklist antes de publicar

- Abrir `index.html` y revisar consola del navegador.
- Revisar que los enlaces de WhatsApp, Google Maps, Facebook y TikTok abran correctamente.
- Probar en celular, tablet y escritorio.
- Verificar que las imagenes nuevas esten en `images/` con el mismo nombre usado en `index.html`.
- Confirmar que precios, horarios, telefono y direccion sean los vigentes.

## Render

Este sitio debe desplegarse en Render como Static Site.

Configuracion recomendada en Dashboard:

- Service Type: Static Site
- Build Command: dejar vacio o usar `echo "No build required for static HTML site"`
- Publish Directory: `.`

El archivo `render.yaml` incluido usa `runtime: static`, `staticPublishPath: .` y un build command neutro para Blueprints.

Render permite configurar headers HTTP de sitios estaticos desde el Dashboard. Recomendacion para produccion:

- `/*.html`: `Cache-Control: public, max-age=0, must-revalidate`
- `/**/*.css`: `Cache-Control: public, max-age=86400`
- `/**/*.js`: `Cache-Control: public, max-age=86400`
- `/images/*`: `Cache-Control: public, max-age=604800`
- `/public/images/*`: `Cache-Control: public, max-age=604800`
- `/*`: `X-Content-Type-Options: nosniff`
- `/*`: `Referrer-Policy: strict-origin-when-cross-origin`

## Alcance actual

Este repositorio es una carta digital informativa. No incluye carrito, pedidos, pagos, administracion, inventario, base de datos, API ni autenticacion.
