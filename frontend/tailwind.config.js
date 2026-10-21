/**
 * Identidade visual AJSV – cores tiradas do logotipo.
 *  azul    → menu, botões principais, títulos e menu lateral da área reservada
 *  verde   → botões secundários, destaques e etiquetas
 *  dourado → bolsas em destaque, estrelas e selo "Mentor verificado"
 *  fundo   → fundo das páginas
 *  claro   → cartões, secções e filtros
 * Os alertas usam os tons suaves de laranja e vermelho do próprio Tailwind.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        azul: { DEFAULT: '#143568', escuro: '#0D2448', medio: '#2A4F8A', suave: '#C9D7EA' },
        verde: { DEFAULT: '#207266', escuro: '#185A50', claro: '#E3F1EE' },
        dourado: { DEFAULT: '#D8AA48', escuro: '#A97F22', claro: '#FBF3E1' },
        fundo: '#F8FAFC',
        claro: '#E6EEF7',
      },
      fontFamily: {
        titulo: ['Lexend', 'system-ui', 'sans-serif'],
        corpo: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        cartao: '0 1px 2px rgba(20,53,104,0.06), 0 4px 16px rgba(20,53,104,0.06)',
        elevado: '0 8px 30px rgba(20,53,104,0.14)',
      },
    },
  },
  plugins: [],
};
