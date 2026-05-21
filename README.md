# 📊 FinanceFlow: Core Cash Flow Management

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

FinanceFlow es una Single Page Application (SPA) moderna diseñada para el control exhaustivo del flujo de caja personal. Este proyecto nació de la necesidad de tener un control financiero estricto y evolucionó hacia una arquitectura modular. 

> **💡 Visión Arquitectónica:** Inicialmente un monolito, FinanceFlow fue refactorizado aplicando principios de diseño orientados al dominio (DDD). Toda la lógica compleja de tarjetas de crédito y cuotas fue abstraída a un microservicio independiente llamado [CardFlow](URL_DE_TU_REPO_CARDFLOW), dejando a FinanceFlow enfocado exclusivamente en la liquidez diaria, ingresos y gastos fijos.

## 🚀 Características Principales (Features)

* **Flujo de Ingresos Multimoneda:** Soporte nativo para ingresos en pesos y dólares con conversión y cálculo en tiempo real.
* **Arqueo General Dinámico:** Sistema de nodos que consolida saldos de múltiples billeteras virtuales y cuentas bancarias para calcular la liquidez exacta (Total Pagado vs. Por Pagar).
* **Gestión de Gastos Fijos:** Tabla interactiva ordenada cronológicamente para el seguimiento de obligaciones mensuales.
* **CRUD Centralizado de Categorías:** Configuración global de categorías de gastos que alimenta de forma reactiva a toda la aplicación.
* **Persistencia Local y Portabilidad:** Almacenamiento seguro en el `localStorage` del navegador con capacidad integral de exportación e importación de bases de datos en formatos `.CSV` y `.JSON`.
* **Diseño UI/UX "Pixel Perfect":** Interfaz en Modo Oscuro (Dark Mode) construida con Tailwind CSS, con tipografía dinámica y alineaciones estrictas para la lectura de datos financieros.

## 🛠️ Stack Tecnológico

* **Frontend:** React.js con Hooks (useState, useMemo, useEffect).
* **Lenguaje:** TypeScript para tipado estático estricto e interfaces de datos financieras.
* **Build Tool:** Vite (reemplazando CRA para tiempos de compilación ultrarrápidos).
* **Estilos:** Tailwind CSS v3 (configurado vía PostCSS).
* **Iconografía:** Lucide React.

## ⚙️ Instalación y Uso Local

1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/tu-usuario/financeflow.git](https://github.com/tu-usuario/financeflow.git)
