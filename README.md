# 📝 To-Do List App

Aplicación para la gestión de tareas y categorías desarrollada con **Angular 18** e **Ionic 8**, implementando **Clean Architecture** para lograr una estructura mantenible, escalable y desacoplada. Compatible tanto con navegadores como con dispositivos móviles mediante **Cordova**.

---

## 🚀 Características

- Crear, editar, eliminar y filtrar tareas y categorías.
- Asignar categorías y fechas a las tareas.
- Almacenamiento local cifrado con `CryptoJS`.
- Interfaz responsiva lista para dispositivos móviles.
- Configuración remota de funcionalidades vía `Remote Config`.
- Estructura desacoplada por capas (dominio, aplicación, infraestructura, presentación).

---

## 🧱 Arquitectura

El proyecto sigue los principios de **Clean Architecture**, separando responsabilidades en capas independientes:

```
├── domain         → Entidades del negocio (Task, Category)
├── application    → Casos de uso y puertos (interfaces)
├── infrastructure → Servicios técnicos, repositorios y adaptadores
├── presentation   → Componentes, vistas y módulos de la interfaz
```

---

## 📦 Dependencias destacadas

- **Angular 18** – Framework SPA principal
- **Ionic 8** – Componentes UI móviles
- **Cordova** – Acceso a funciones nativas (Haptics, Status Bar, etc.)
- **Firebase 10** – Integración remota y backend opcional
- **Crypto-JS** – Cifrado de datos locales
- **Jasmine / Karma** – Pruebas unitarias
- **ESLint / Prettier** – Formato y linting de código

---

## ⚙️ Configuración

Define las variables de entorno en `src/environments/environment.ts`:

```ts
export const environment = {
  production: true,
  ENCRYPTION_KEY: 'ENCRYPTION_KEY',
  TASKS_KEY: 'TASKS_KEY',
  CATEGORIES_KEY: 'CATEGORIES_KEY',
  TASK_REPOSITORY_TOKEN: 'TASK_REPOSITORY_TOKEN',
  CATEGORY_REPOSITORY_TOKEN: 'CATEGORY_REPOSITORY_TOKEN',
  firebaseConfig: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  }
};
```

### 🔥 Integración con Firebase

Completa los campos en `firebaseConfig` con los datos de tu consola Firebase.

Inicializa Firebase en `AppModule`:

```ts
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';

@NgModule({
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    ...
  ]
})
export class AppModule {}
```

---

## 🛠️ Instalación y ejecución

1. Clona el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd to-do-list
```

2. Instala dependencias:

```bash
npm install
```

3. Ejecuta la app en modo desarrollo:

```bash
ionic serve
```

---

## 🧪 Scripts disponibles

| Comando                | Descripción                                      |
|------------------------|--------------------------------------------------|
| `npm start`            | Inicia el servidor de desarrollo (`ng serve`)    |
| `npm run build`        | Compila la app para producción (`dist/`)         |
| `npm run test`         | Ejecuta pruebas unitarias con cobertura          |
| `npm run lint`         | Ejecuta linter con ESLint                        |
| `npm run watch`        | Compilación en tiempo real                       |

---

## 📱 Compatibilidad móvil

La app está preparada para ejecutarse en:

- **Android**
- **iOS**
- **Web (PWA)**

Plugins nativos usados (Cordova):

- `cordova-plugin-device`
- `cordova-plugin-statusbar`
- `cordova-plugin-splashscreen`
- `cordova-plugin-ionic-webview`
- `cordova-plugin-ionic-keyboard`
- `cordova-plugin-firebase`
- `cordova-plugin-firebase-remoteconfig`

---

## 📂 Estructura del proyecto

```
app/
├── domain/               # Modelos de negocio
├── application/          # Interfaces y servicios
├── infrastructure/       # Repositorios, servicios y adaptadores
├── presentation/         # Componentes de UI y vistas
│   ├── tasks/            # Funcionalidades de tareas
│   ├── categories/       # Funcionalidades de categorías
│   └── components/       # Header y elementos compartidos
|   └── home/             # Pagina principal
```

---

## 📲 Despliegue con Cordova

Puedes generar builds para Android e iOS utilizando **Cordova**. Asegúrate de tener instalado el entorno adecuado:

### 📦 Requisitos

- Node.js y npm
- Ionic CLI (`npm install -g @ionic/cli`)
- Cordova CLI (`npm install -g cordova`)
- Android Studio (para Android)
- Xcode (para iOS, solo en macOS)

### 📱 Android

1. Agrega la plataforma:

   ```bash
   ionic cordova platform add android
   ```

2. Compila la app:

   ```bash
   ionic cordova build android
   ```

3. Ejecuta en un dispositivo o emulador:

   ```bash
   ionic cordova run android
   ```

### 🍏 iOS

1. Agrega la plataforma:

   ```bash
   ionic cordova platform add ios
   ```

2. Compila la app:

   ```bash
   ionic cordova build ios
   ```

3. Abre el proyecto en Xcode:

   ```bash
   open platforms/ios/*.xcworkspace
   ```

4. Desde Xcode, configura certificados, perfiles y ejecuta en un simulador o dispositivo real.

> Nota: Para iOS necesitas una Mac con Xcode instalado.

[PWA](https://to-do-list-52b84.web.app/home/tasks)