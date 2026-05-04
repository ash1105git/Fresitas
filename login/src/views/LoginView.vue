<template>
  <div class="login-page">
    <!-- Fondo decorativo -->
    <div class="bg-dots"></div>
    <div class="bg-glow"></div>

    <!-- Card central -->
    <div class="login-card" :class="{ shake: shaking }">

      <!-- Logo -->
      <div class="card-brand">
        <div class="brand-icon">🍓</div>
        <div>
          <span class="brand-script">Strawberry Yarn</span>
          <p class="brand-sub">Panel de administración</p>
        </div>
      </div>

      <h1 class="card-title">Bienvenida de vuelta</h1>
      <p class="card-desc">Inicia sesión para gestionar tu tienda</p>

      <!-- Formulario -->
      <div class="form-group">
        <label for="usuario">Usuario</label>
        <div class="input-wrap" :class="{ focused: focusedField === 'usuario' }">
          <span class="input-icon">👤</span>
          <input
            id="usuario"
            v-model="form.usuario"
            type="text"
            placeholder="admin"
            autocomplete="username"
            @focus="focusedField = 'usuario'"
            @blur="focusedField = ''"
            @keyup.enter="handleLogin"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <div class="input-wrap" :class="{ focused: focusedField === 'password' }">
          <span class="input-icon">🔒</span>
          <input
            id="password"
            v-model="form.password"
            :type="showPass ? 'text' : 'password'"
            placeholder="••••••••••"
            autocomplete="current-password"
            @focus="focusedField = 'password'"
            @blur="focusedField = ''"
            @keyup.enter="handleLogin"
          />
          <button class="toggle-pass" type="button" @click="showPass = !showPass" :aria-label="showPass ? 'Ocultar' : 'Mostrar'">
            {{ showPass ? '🙈' : '👁️' }}
          </button>
        </div>
      </div>

      <!-- Error -->
      <transition name="error-fade">
        <div v-if="errorMsg" class="error-box">
          <span>⚠️</span> {{ errorMsg }}
        </div>
      </transition>

      <!-- Botón login -->
      <button
        class="btn-login"
        :class="{ loading }"
        :disabled="loading"
        @click="handleLogin"
      >
        <span v-if="!loading">🔐 Iniciar sesión</span>
        <span v-else class="spinner-wrap">
          <span class="spinner"></span> Verificando…
        </span>
      </button>

      <!-- Volver al inicio -->
      <a :href="frontendUrl" class="link-volver">
        ← Volver a la tienda
      </a>
    </div>

    <!-- Decoración lateral (solo desktop) -->
    <div class="deco-side">
      <div class="deco-card">
        <div class="deco-emoji">🧶</div>
        <p class="deco-text">Tejido a mano<br>con <em>mucho amor</em></p>
      </div>
      <div class="deco-dots">
        <span v-for="n in 12" :key="n" class="deco-dot" :style="dotStyle(n)"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const API_URL      = import.meta.env.VITE_API_URL      ?? 'http://localhost:4000/api'
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL ?? 'http://localhost:5173'
const frontendUrl  = FRONTEND_URL

const form        = reactive({ usuario: '', password: '' })
const loading     = ref(false)
const errorMsg    = ref('')
const shaking     = ref(false)
const showPass    = ref(false)
const focusedField = ref('')

function triggerShake() {
  shaking.value = true
  setTimeout(() => (shaking.value = false), 500)
}

async function handleLogin() {
  errorMsg.value = ''
  if (!form.usuario.trim() || !form.password) {
    errorMsg.value = 'Completa usuario y contraseña.'
    triggerShake()
    return
  }
  loading.value = true
  try {
    const res  = await fetch(`${API_URL}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ usuario: form.usuario.trim(), password: form.password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Error al iniciar sesión')

    localStorage.setItem('sy_token',   data.token)
    localStorage.setItem('sy_usuario', data.usuario)

    // Redirige al frontend (admin panel dentro de React)
    window.location.href = `${FRONTEND_URL}/admin`
  } catch (e) {
    errorMsg.value = e.message
    triggerShake()
    form.password = ''
  } finally {
    loading.value = false
  }
}

function dotStyle(n) {
  const size  = 6 + (n % 4) * 4
  const delay = (n * 0.3).toFixed(1)
  const x     = ((n * 97) % 100)
  const y     = ((n * 61) % 100)
  return {
    width: `${size}px`, height: `${size}px`,
    left: `${x}%`, top: `${y}%`,
    animationDelay: `${delay}s`,
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;
  padding: 40px 24px;
  position: relative;
  overflow: hidden;
}

/* Fondo */
.bg-dots {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background-image: radial-gradient(circle, rgba(232,53,74,.11) 1.5px, transparent 1.5px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 70% 70% at 30% 50%, black, transparent);
}
.bg-glow {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background: radial-gradient(ellipse 50% 60% at 20% 50%, rgba(232,53,74,.07), transparent 70%);
}

/* Card */
.login-card {
  background: var(--blanco);
  border-radius: 26px;
  padding: 48px 44px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 24px 80px rgba(45,26,31,.10), 0 4px 16px rgba(232,53,74,.06);
  border: 1px solid var(--gris-borde);
  position: relative; z-index: 2;
  transition: transform .15s;
}
.login-card.shake {
  animation: shake .4s ease;
}
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%      { transform: translateX(-8px); }
  40%      { transform: translateX(8px); }
  60%      { transform: translateX(-5px); }
  80%      { transform: translateX(5px); }
}

/* Brand */
.card-brand {
  display: flex; align-items: center; gap: 14px;
  margin-bottom: 32px;
}
.brand-icon {
  width: 52px; height: 52px; border-radius: 16px;
  background: rgba(232,53,74,.08);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; flex-shrink: 0;
}
.brand-script {
  font-family: var(--font-script);
  font-size: 1.3rem; font-weight: 600;
  color: var(--rojo);
  display: block;
}
.brand-sub {
  font-size: .72rem; color: var(--gris-texto);
  letter-spacing: .04em; margin-top: 1px;
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.7rem; font-weight: 700;
  letter-spacing: -.02em; margin-bottom: 6px;
}
.card-desc {
  font-size: .88rem; color: var(--gris-texto);
  margin-bottom: 28px; line-height: 1.5;
}

/* Form */
.form-group { margin-bottom: 18px; }
.form-group label {
  display: block;
  font-size: .8rem; font-weight: 600;
  color: var(--oscuro); margin-bottom: 7px;
  letter-spacing: .02em;
}

.input-wrap {
  display: flex; align-items: center;
  border: 2px solid var(--gris-borde);
  border-radius: var(--radio-sm);
  background: var(--blanco);
  transition: border-color .2s, box-shadow .2s;
  overflow: hidden;
}
.input-wrap.focused {
  border-color: var(--rojo);
  box-shadow: 0 0 0 4px rgba(232,53,74,.10);
}
.input-icon {
  padding: 0 12px 0 14px;
  font-size: 15px; flex-shrink: 0;
}
.input-wrap input {
  flex: 1;
  padding: 13px 12px 13px 0;
  border: none; outline: none;
  font-family: var(--font-body);
  font-size: .92rem; color: var(--oscuro);
  background: transparent;
}
.input-wrap input::placeholder { color: var(--gris-medio); }

.toggle-pass {
  background: none; border: none;
  padding: 0 14px; cursor: pointer;
  font-size: 15px; color: var(--gris-texto);
  transition: color .2s;
  line-height: 1;
}
.toggle-pass:hover { color: var(--rojo); }

/* Error */
.error-box {
  background: rgba(232,53,74,.08);
  border: 1px solid rgba(232,53,74,.22);
  border-radius: var(--radio-xs);
  padding: 11px 14px;
  font-size: .84rem; color: var(--rojo);
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 18px;
}
.error-fade-enter-active, .error-fade-leave-active { transition: opacity .25s, transform .25s; }
.error-fade-enter-from, .error-fade-leave-to { opacity: 0; transform: translateY(-6px); }

/* Botón */
.btn-login {
  width: 100%;
  padding: 14px 24px;
  border: none; border-radius: 50px;
  background: var(--rojo); color: var(--blanco);
  font-family: var(--font-body); font-size: .9rem; font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(232,53,74,.34);
  transition: transform .2s, box-shadow .2s, background .2s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  margin-top: 4px;
}
.btn-login:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 14px 32px rgba(232,53,74,.44);
}
.btn-login:active:not(:disabled) { transform: translateY(-1px); }
.btn-login.loading {
  background: var(--gris-medio); cursor: not-allowed;
  box-shadow: none;
}
.spinner-wrap { display: flex; align-items: center; gap: 8px; }
.spinner {
  width: 16px; height: 16px; border-radius: 50%;
  border: 2.5px solid rgba(255,255,255,.3);
  border-top-color: var(--blanco);
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Volver */
.link-volver {
  display: block; text-align: center;
  margin-top: 20px;
  font-size: .82rem; color: var(--gris-texto);
  text-decoration: none;
  transition: color .2s;
}
.link-volver:hover { color: var(--rojo); }

/* Decoración lateral */
.deco-side {
  display: flex; flex-direction: column; align-items: center;
  gap: 32px; position: relative; z-index: 2;
}
.deco-card {
  background: var(--oscuro);
  border-radius: 24px;
  padding: 40px 36px;
  text-align: center;
  color: var(--blanco);
  box-shadow: 0 24px 60px rgba(45,26,31,.28);
}
.deco-emoji {
  font-size: 56px; margin-bottom: 18px;
  animation: floatDeco 3s ease-in-out infinite;
}
@keyframes floatDeco {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-10px); }
}
.deco-text {
  font-family: var(--font-display);
  font-size: 1.4rem; line-height: 1.3;
  color: rgba(255,255,255,.9);
}
.deco-text em { font-style: normal; color: var(--rojo-light); }

.deco-dots { position: relative; width: 200px; height: 120px; }
.deco-dot {
  position: absolute; border-radius: 50%;
  background: var(--rojo);
  opacity: .18;
  animation: dotPulse 4s ease-in-out infinite;
}
@keyframes dotPulse {
  0%,100% { opacity: .12; transform: scale(1); }
  50%     { opacity: .28; transform: scale(1.3); }
}

@media (max-width: 860px) { .deco-side { display: none; } }
@media (max-width: 480px) {
  .login-card { padding: 36px 24px; }
}
</style>
