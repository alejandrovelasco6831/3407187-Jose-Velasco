{
  id: 1,                          // Número único (Date.now())
  name: "Proyecto Casa Moderna", // String - nombre del proyecto
  description: "Remodelación interior y adecuación de espacios", // Descripción (opcional)
  active: true,                   // Boolean - proyecto activo / finalizado
  priority: "high",               // "low" | "medium" | "high"
  category: "diseño-interiores",  // diseño-interiores | inmobiliaria | construccion
  createdAt: "2024-01-15",        // Fecha de creación
  updatedAt: null,                // Fecha de última actualización

  // Propiedades específicas del dominio:

  // Diseño de interiores:
  area: 120,                      // Área en metros cuadrados
  style: "Minimalista",           // Estilo de diseño
  budget: 25000000,               // Presupuesto en COP

  // Inmobiliaria:
  propertyType: "Apartamento",    // Casa | Apartamento | Local | Oficina
  location: "Bogotá",             // Ubicación
  price: 350000000,               // Precio del inmueble

  // Construcción:
  projectType: "Remodelación",    // Obra nueva | Remodelación | Ampliación
  materials: "Concreto y acero",  // Materiales principales
  duration: 90                    // Duración en días
}