# Menu Maky

Sitio estatico del menu publico de Maky Restaurante. El proyecto esta pensado para funcionar abriendo `index.html` directamente en el navegador o publicandolo como archivos estaticos.

## Estructura

- `index.html`: contenido del menu, metadatos SEO, secciones, enlaces de contacto y datos visibles del restaurante.
- `styles.css`: estilos visuales, responsive, animaciones y estados de presentacion.
- `script.js`: navegacion con offset, estado activo de categorias, animaciones, skeleton loader y fallback para imagenes opcionales.
- `images/`: recursos visuales del menu.

## Como ejecutar

Abrir `index.html` en el navegador. No hay paso de instalacion, compilacion ni servidor requerido.

En VS Code tambien existe una configuracion para abrir el archivo desde `.vscode/launch.json`.

## Imagenes opcionales de productos

Algunas tarjetas pueden apuntar a imagenes que todavia no existen en `images/`. Ese comportamiento es intencional: cuando la imagen no esta disponible, `script.js` convierte la tarjeta en un item de lista para evitar una imagen rota. Cuando se agregue el archivo con el mismo nombre, la tarjeta volvera a mostrarse con imagen en la siguiente carga.

Referencias actualmente pendientes:

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

Este sitio puede desplegarse en Render como Static Site sin build command. El publish directory debe apuntar a la raiz del repositorio.

Render permite configurar headers HTTP de sitios estaticos desde el Dashboard. Recomendacion para produccion:

- `/*.html`: `Cache-Control: public, max-age=0, must-revalidate`
- `/**/*.css`: `Cache-Control: public, max-age=86400`
- `/**/*.js`: `Cache-Control: public, max-age=86400`
- `/images/*`: `Cache-Control: public, max-age=604800`
- `/*`: `X-Content-Type-Options: nosniff`
- `/*`: `Referrer-Policy: strict-origin-when-cross-origin`

## Alcance actual

Este repositorio es una carta digital informativa. No incluye carrito, pedidos, pagos, administracion, inventario, base de datos, API ni autenticacion.
