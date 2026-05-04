<template>
  <router-view />
</template>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --rojo:        #e8354a;
  --rojo-dark:   #c42a3d;
  --rojo-light:  #f47080;
  --rosa:        #f9c0c9;
  --rosa-bg:     #fdf0f3;
  --rosa-light:  #fde8ed;
  --blanco:      #ffffff;
  --gris-borde:  #f0e4e7;
  --gris-medio:  #d4b8be;
  --gris-texto:  #7a5f64;
  --oscuro:      #2d1a1f;
  --font-display: 'Playfair Display', serif;
  --font-body:    'DM Sans', sans-serif;
  --font-script:  'Dancing Script', cursive;
  --sombra-rosa:  0 8px 32px rgba(232,53,74,.18);
  --sombra-card:  0 4px 24px rgba(45,26,31,.08);
  --radio:    20px;
  --radio-sm: 12px;
  --radio-xs: 8px;
}

html { scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  background: var(--rosa-bg);
  color: var(--oscuro);
  min-height: 100vh;
}
</style>
