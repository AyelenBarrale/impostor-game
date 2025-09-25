# 🎭 El Impostor - Juego de Deducción Social

Un juego de deducción social desarrollado con Next.js 14 y Supabase donde los jugadores deben descubrir quién es el impostor.

## 🚀 Tecnologías

- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Supabase** - Base de datos y backend
- **Tailwind CSS** - Estilos
- **Shadcn/ui** - Componentes UI

## 🎮 Cómo Jugar

1. **Configuración**: Selecciona el número de jugadores (3-10)
2. **Categoría**: Elige una categoría de palabras
3. **Revelación**: Cada jugador ve su palabra secreta
4. **Juego**: Los jugadores describen su palabra sin decirla
5. **Votación**: Todos votan por quién creen que es el impostor
6. **Resultado**: ¡Descubre si ganaron los jugadores o el impostor!

## 🛠️ Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Configurar Supabase
npm run supabase:start
```

## 📦 Estructura del Proyecto

```
├── app/                 # App Router de Next.js
├── components/          # Componentes React
│   ├── game-*.tsx      # Componentes del juego
│   └── ui/             # Componentes UI base
├── lib/                # Utilidades y configuración
├── hooks/              # Hooks personalizados
└── supabase/           # Configuración y migraciones
```

## 🎯 Características

- ✅ Juego multijugador local
- ✅ Categorías dinámicas desde base de datos
- ✅ Interfaz responsive y moderna
- ✅ Sistema de votación
- ✅ Revelación de cartas con temporizador
- ✅ Gestión de estados del juego

---

Desarrollado con ❤️ por [AyelenBarrale](https://github.com/AyelenBarrale)
