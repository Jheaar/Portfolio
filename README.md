# Arnold Ochoa — Portfolio

Portfolio personal como Analista de Datos. Sin frameworks, sin bundlers, sin dependencias externas.

## Estructura

```
portfolio/
├── index.html
├── README.md
├── assets/
│   ├── files/
│   │   └── CV-ArnoldOchoa-AnalistaDatos.pdf
│   └── images/
│       ├── alzheimer-preview.jpg
│       └── n8n-telegram.jpg
├── css/
│   ├── variables.css    → tokens de diseño (colores, tipografía)
│   ├── layout.css       → grid de dos columnas y sidebar
│   ├── components.css   → secciones: about, experience, projects, skills
│   └── intro.css        → pantalla de entrada y efecto de escritura
└── js/
    ├── particles.js     → campo de partículas WebGL
    ├── intro.js         → typing effect y transición de entrada
    └── main.js          → navegación activa y scroll reveal
```

## Correr localmente

Necesitas un servidor estático porque el navegador bloquea las rutas relativas si abres el `.html` directo.

```bash
# Python
python -m http.server 3000

# Node
npx serve .
```

Abre `http://localhost:3000`.

## Despliegue 🚀

No requiere build. Sube la carpeta tal cual.

- **Vercel** → `vercel --prod`
- **Netlify** → arrastra la carpeta al dashboard
- **GitHub Pages** → activa Pages en Settings → rama `main` / raíz

## Personalización

| Qué | Dónde |
|---|---|
| Nombre, rol, descripción | `index.html` → sidebar |
| Experiencia y logros | `index.html` → `#experience` |
| Proyectos | `index.html` → `#projects` |
| Skills y niveles | `index.html` → `#skills` |
| Color acento | `css/variables.css` → `--accent` |
| Texto del intro | `js/intro.js` → `FULL_TEXT` |
| Cantidad de partículas | `js/particles.js` → `COUNT` |

## Agregar un proyecto

1. Pon la imagen en `assets/images/`
2. Copia un bloque `.proj-card` en `index.html`
3. Actualiza título, descripción, imagen y tecnologías

## Licencia

Uso personal.
