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

    ecoA:          "#1b5e20",
    ecoB:          "#388e3c",
    ecoC:          "#a5d6a7",

    error:         "#b71c1c",
    errorFondo:    "#fdecea",
  },
  radius: {
    sm: 10,
    md: 16,
    pill: 20,
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    condado:       "#b0533f",
    condadoDark:   "#6c2d20",
    condado2:      "#c4705f",
    condado3:      "#d98c7a",
    condadoLight:  "#3a2621",

    bg:            "#15100d",
    surface:       "#211915",
    surface2:      "#2a201b",
    border:        "#3d302a",

    textPrimary:   "#f2ebe6",
    textSecondary: "#cdbdb3",
    textMuted:     "#958479",

    error:         "#ef9a9a",
    errorFondo:    "#3b1d1d",
  },
};

export default lightTheme;
