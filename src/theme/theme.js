/* Paleta terracota de Grupo Condado.
   Los valores salen de los tokens :root de styles.css del sistema web,
   para que la app y la web se lean como el mismo producto. */

export const lightTheme = {
  colors: {
    condado:       "#6c2d20",
    condadoDark:   "#4e1f15",
    condado2:      "#8c3b2a",
    condado3:      "#c4705f",
    condadoLight:  "#f5e9e6",

    bg:            "#f7f4f0",
    surface:       "#ffffff",
    surface2:      "#fdf9f7",
    border:        "#e8e0db",

    textPrimary:   "#1a1209",
    textSecondary: "#6b5b52",
    textMuted:     "#a0918a",

    /* Colores de la etiqueta de clase energética (RN1) */
    ecoA:          "#2e7d32",
    ecoB:          "#b98900",
    ecoC:          "#8a8a8a",
  },
  radius: {
    sm: 10,
    md: 16,
    pill: 20,
  },
};

export default lightTheme;
