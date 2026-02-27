// ============================================
// CLASE BASE - Property
// ============================================
class Property {
  #id;
  #name;
  #location;
  #price;
  #active;
  #dateCreated;

  constructor(name, location, price) {
    this.#id = crypto.randomUUID();
    this.#name = name;
    this.#location = location;
    this.#price = price;
    this.#active = true;
    this.#dateCreated = new Date().toISOString();
  }

  // Getters
  get id() { return this.#id; }
  get name() { return this.#name; }
  get location() { return this.#location; }
  get price() { return this.#price; }
  get isActive() { return this.#active; }
  get dateCreated() { return this.#dateCreated; }

  // Setters
  set location(value) {
    if (!value || value.trim() === '') throw new Error('La ubicación no puede estar vacía');
    this.#location = value.trim();
  }

  set price(value) {
    if (typeof value !== 'number' || value <= 0) throw new Error('Precio inválido');
    this.#price = value;
  }

  // Métodos
  activate() {
    if (this.#active) return { success: false, message: 'La propiedad ya está activa' };
    this.#active = true;
    return { success: true, message: 'Propiedad activada' };
  }

  deactivate() {
    if (!this.#active) return { success: false, message: 'La propiedad ya está inactiva' };
    this.#active = false;
    return { success: true, message: 'Propiedad desactivada' };
  }

  getInfo() {
    return {
      id: this.#id,
      name: this.#name,
      location: this.#location,
      price: this.#price,
      active: this.#active,
      dateCreated: this.#dateCreated
    };
  }

  getType() { return this.constructor.name; }
}

// ============================================
// CLASES DERIVADAS - Tipos de propiedad
// ============================================

// Casa
class House extends Property {
  #bedrooms;
  #bathrooms;
  #hasGarden;

  constructor(name, location, price, bedrooms, bathrooms, hasGarden) {
    super(name, location, price);
    this.#bedrooms = bedrooms;
    this.#bathrooms = bathrooms;
    this.#hasGarden = hasGarden;
  }

  get bedrooms() { return this.#bedrooms; }
  get bathrooms() { return this.#bathrooms; }
  get hasGarden() { return this.#hasGarden; }

  getInfo() {
    return { ...super.getInfo(), bedrooms: this.#bedrooms, bathrooms: this.#bathrooms, hasGarden: this.#hasGarden };
  }
}

// Departamento
class Apartment extends Property {
  #floor;
  #hasBalcony;

  constructor(name, location, price, floor, hasBalcony) {
    super(name, location, price);
    this.#floor = floor;
    this.#hasBalcony = hasBalcony;
  }

  get floor() { return this.#floor; }
  get hasBalcony() { return this.#hasBalcony; }

  getInfo() {
    return { ...super.getInfo(), floor: this.#floor, hasBalcony: this.#hasBalcony };
  }
}

// Local comercial
class Commercial extends Property {
  #area;
  #parkingSpaces;

  constructor(name, location, price, area, parkingSpaces) {
    super(name, location, price);
    this.#area = area;
    this.#parkingSpaces = parkingSpaces;
  }

  get area() { return this.#area; }
  get parkingSpaces() { return this.#parkingSpaces; }

  getInfo() {
    return { ...super.getInfo(), area: this.#area, parkingSpaces: this.#parkingSpaces };
  }
}