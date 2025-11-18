# 🛍️ E-Commerce Frontend

> Aplicación de e-commerce moderna construida con Next.js 16, React 19, Redux Toolkit y Tailwind CSS.

🌐 **Frontend Desplegado:** [https://ecommerce-frontend-csn8.onrender.com](https://ecommerce-frontend-csn8.onrender.com)

## 📋 Descripción General

**E-Commerce Frontend** es una plataforma de compra online con:

- ✅ Catálogo de productos dinámico
- ✅ Sistema de pagos con tarjeta de crédito
- ✅ Persistencia de formularios en localStorage + Redux
- ✅ Validación de stock en tiempo real
- ✅ Cálculo dinámico de precios y cuotas
- ✅ Cobertura de tests 82% (51/51 tests pasando)
- ✅ UI responsive y moderna

---

## 🚀 Quick Start

### Requisitos

- Node.js v18+
- npm v10+

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/LinaAsprilla/eCommerce-frontend.git
cd eCommerce-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_TIMEOUT=10000
NODE_ENV=development
EOF

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Abrir en navegador
open http://localhost:3000
```

---

## 📦 Stack Tecnológico

| Categoría            | Tecnología                  |
| -------------------- | --------------------------- |
| **Framework**        | Next.js 16, React 19        |
| **State Management** | Redux Toolkit 2.10          |
| **Styling**          | Tailwind CSS 4, PostCSS     |
| **HTTP Client**      | Axios 1.13                  |
| **Testing**          | Jest, React Testing Library |
| **Language**         | TypeScript 5                |
| **Linting**          | ESLint 9                    |

---

## 📁 Estructura del Proyecto

```
app/
├── components/              # Componentes reutilizables
│   ├── common/ProductCard.tsx
│   ├── modals/
│   │   ├── PaymentModal.tsx
│   │   ├── DeliveryFormStep.tsx
│   │   ├── PaymentFormStep.tsx
│   │   └── PaymentSummaryStep.tsx
│   └── __tests__/
│
├── hooks/                   # Custom hooks
│   ├── useProducts.tsx
│   ├── usePaymentPersistence.ts
│   └── __tests__/
│
├── services/                # API services
│   ├── productService.ts
│   ├── transactionService.ts
│   └── __tests__/
│
├── store/                   # Redux state
│   ├── store.ts
│   └── slices/paymentSlice.ts
│
├── utils/                   # Utilidades
│   ├── productUtils.ts
│   └── __tests__/
│
├── config/                  # Configuración
│   ├── apiClient.ts
│   ├── constants.ts
│   └── axios/
│
├── providers/               # Context providers
│   └── ReduxProvider.tsx
│
├── page.tsx                 # Página principal
└── layout.tsx               # Layout raíz
```

---

## 🎯 Características Principales

### 1. Catálogo de Productos

- Obtiene productos del backend
- Renderiza grid responsive
- Datos dinámicos por producto
- Estados de carga y error

### 2. Sistema de Pagos Multi-Paso

- **Paso 1:** Datos de envío (nombre, email, dirección, etc.)
- **Paso 2:** Datos de tarjeta (número, CVV, cuotas)
- **Paso 3:** Resumen y confirmación de pago

**Validaciones:**

- Formato de tarjeta (Luhn)
- Fecha de vencimiento
- CVV válido
- Campos requeridos

### 3. Persistencia de Formularios

- Redux Toolkit para estado centralizado
- localStorage para persistencia
- Sincronización automática
- Recuperación al recargar página

**Almacenamiento:**

```json
{
  "payment_form_data": {
    "cardData": { ... },
    "deliveryData": { ... },
    "installments": 1,
    "quantity": 1
  }
}
```

### 4. Validación de Stock

- Verifica stock disponible al comprar
- Impide cantidades mayores al stock
- Mensaje de error si no hay inventario
- Actualización automática post-compra

### 5. Cálculo de Precios

- Precio unitario × cantidad
- Soporte para cuotas (1, 3, 6, 12)
- Desglose de monto total
- Cálculo de cuota mensual

---

## 🔄 Estado Redux

### PaymentSlice

```typescript
interface PaymentState {
  cardData: {
    cardNumber: string;
    cardholderName: string;
    expiryDate: string; // MM/YY
    cvv: string; // 3-4 dígitos
    cardType: string; // visa, mastercard, etc
  };
  deliveryData: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  installments: number; // 1-12
  quantity: number; // 1+
}
```

**Actions:**

- `setCardData(cardData)` - Actualizar tarjeta
- `setDeliveryData(deliveryData)` - Actualizar envío
- `setInstallments(number)` - Actualizar cuotas
- `setQuantity(number)` - Actualizar cantidad
- `initializePaymentData(data)` - Cargar desde localStorage
- `resetPaymentData()` - Limpiar estado

---

## 🌐 API Endpoints

### Productos

```
GET /products              # Obtener todos los productos
GET /products/:id          # Obtener producto específico
```

**Response:**

```json
{
  "id": 1,
  "name": "Laptop",
  "price": 1500000,
  "stock": 10,
  "description": "..."
}
```

### Transacciones

```
POST /transactions         # Crear transacción de pago
```

**Request:**

```json
{
  "productId": 1,
  "quantity": 2,
  "installments": 6,
  "totalAmount": 3000000,
  "cardData": { ... },
  "deliveryData": { ... }
}
```

**Response:**

```json

Example
{
  "status": "APPROVED",
  "status_message": "Transacción aprobada"
}
```

---

## 🧪 Testing

### Cobertura

```
Test Suites:  7 passed, 7 total
Tests:        51 passed, 51 total
Coverage:     82% (exceeds 80% threshold)
```

### Tests Implementados

| Archivo                       | Tests | Status |
| ----------------------------- | ----- | ------ |
| ProductCard.test.tsx          | 9     | ✅     |
| PaymentModal.test.tsx         | 5     | ✅     |
| PaymentSummaryStep.test.tsx   | 9     | ✅     |
| usePaymentPersistence.test.ts | 5     | ✅     |
| transactionService.test.ts    | 4     | ✅     |
| paymentSlice.test.ts          | 7     | ✅     |
| productUtils.test.ts          | 6     | ✅     |

### Ejecutar Tests

```bash
# Todos los tests
npm run test

# Con cobertura
npm run test -- --coverage

# Watch mode
npm run test -- --watch

# Test específico
npm run test -- usePaymentPersistence.test.ts
```

---

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor en http://localhost:3000

# Build
npm run build            # Compila para producción
npm run start            # Inicia servidor de producción

# Testing
npm run test             # Ejecuta suite de tests
npm run test -- --coverage  # Tests con reporte de cobertura

# Linting
npm run lint             # Valida código con ESLint
```

---

## 🪝 Hooks Personalizados

### usePaymentPersistence

Sincroniza estado de Redux con localStorage.

```typescript
const {
  cardData,
  deliveryData,
  installments,
  quantity,
  updateCardData,
  updateDeliveryData,
  updateInstallments,
  updateQuantity,
} = usePaymentPersistence();
```

### useProducts

Obtiene productos del backend.

```typescript
const { products, loading, error, refetch } = useProducts();
```

---

## 🔐 Seguridad

- ✅ Enmascaramiento de números de tarjeta
- ✅ CVV nunca se almacena
- ✅ Variables de entorno separadas por ambiente
- ✅ Validación en cliente y servidor
- ✅ HTTPS ready para producción

---

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Grid adaptativo (1-5 columnas según pantalla)
- ✅ Componentes escalables
- ✅ Tailwind CSS utilities
- ✅ Touch-friendly botones

---

## 🚀 Deployment

### Vercel (Recomendado)

```bash
# 1. Conectar repositorio a Vercel
# 2. Configurar variables de entorno en dashboard
# 3. Deploy automático en cada push
```

### Docker

```bash
docker build -t ecommerce-frontend .
docker run -p 3000:3000 ecommerce-frontend
```

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crea rama feature: `git checkout -b feature/nombre`
3. Commit cambios: `git commit -m "feat: descripción"`
4. Push: `git push origin feature/nombre`
5. Abre Pull Request

**Antes de hacer PR:**

```bash
npm run test              # Tests deben pasar
npm run lint              # Sin errores de linting
npm run build             # Build sin errores
```

---

## 📞 Contacto

- **GitHub Issues** - Reportar bugs o solicitar features
- **Email** - linaasprilla@hotmail.com

---

## 📄 Licencia

MIT License

---

**Versión:** 0.1.0  
**Última actualización:** Noviembre 2025  
**Mantenedor:** Lina Asprilla
