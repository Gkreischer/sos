// Test helpers for creating mock data
export function createMockUser(overrides: Partial<any> = {}): any {
  return {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    address: 'Test Street',
    cep: '12345-678',
    city: 'Test City',
    state: 'TS',
    cnpj: '12.345.678/0001-90',
    country: 'Brazil',
    cpf: '123.456.789-00',
    image: '',
    fantasy_name: 'Test Fantasy',
    phone: '(11) 12345-6789',
    equipments: [],
    type_id: 1,
    type: createMockUserType(),
    corporate_name: 'Test Corp',
    password: 'password123',
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

export function createMockUserType(overrides: Partial<any> = {}): any {
  return {
    id: 1,
    name: 'Admin',
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

export function createMockEquipment(overrides: Partial<any> = {}): any {
  return {
    id: 1,
    name: 'Test Equipment',
    description: 'Test Description',
    image: [],
    user: createMockUser(),
    category_id: 1,
    parts: [],
    category: { id: 1, name: 'Test Category', created_at: new Date(), updated_at: new Date() },
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

export function createMockOrder(overrides: Partial<any> = {}): any {
  return {
    id: 1,
    title: 'Test Order',
    user_id: '1',
    equipment_id: 1,
    equipment: createMockEquipment(),
    total_price: 100,
    parts_price: 50,
    technician_id: 1,
    technician: createMockUser(),
    service_price: 50,
    service_description: 'Test Service',
    diagnostic: 'Test Diagnostic',
    order_parts: [],
    description: 'Test Description',
    discount: 0,
    obs: 'Test OBS',
    status_id: 1,
    status: { id: 1, name: 'Pending', created_at: new Date(), updated_at: new Date() },
    user: createMockUser(),
    signature: '',
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

export function createMockPaginateResponse(data: any[]): any {
  return {
    current_page: 1,
    data: data,
    first_page_url: 'http://localhost/api?page=1',
    from: 1,
    next_page_url: null,
    path: 'http://localhost/api',
    per_page: 15,
    prev_page_url: null,
    last_page_url: 'http://localhost/api?page=1',
    to: data.length,
    total: data.length,
    last_page: 1,
  };
}

export function createMockRoomMessage(overrides: Partial<any> = {}): any {
  return {
    id: 1,
    content: 'Test message',
    room_id: 1,
    user_id: 1,
    user: createMockUser(),
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

export function createMockPost(overrides: Partial<any> = {}): any {
  return {
    id: 1,
    title: 'Test Post',
    content: 'Test content',
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

export function createMockPart(overrides: Partial<any> = {}): any {
  return {
    id: 1,
    name: 'Test Part',
    description: 'Test Description',
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

export function createMockCategory(overrides: Partial<any> = {}): any {
  return {
    id: 1,
    name: 'Test Category',
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

export function createMockOrderStatus(overrides: Partial<any> = {}): any {
  return {
    id: 1,
    name: 'Pending',
    description: 'Pending description',
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

export function createMockCep(overrides: Partial<any> = {}): any {
  return {
    cep: '12345-678',
    logradouro: 'Rua Teste',
    complemento: '',
    unidade: '',
    bairro: 'Centro',
    localidade: 'São Paulo',
    uf: 'SP',
    ibge: '',
    gia: '',
    ddd: '11',
    siafi: '',
    estado: 'SP',
    regiao: 'Sudeste',
    ...overrides,
  };
}

export function createMockBusinessInfo(overrides: Partial<any> = {}): any {
  return {
    id: 1,
    name: 'Test Company',
    cnpj: '12.345.678/0001-90',
    email: 'test@example.com',
    phone: '(11) 12345-6789',
    address: 'Test Address',
    address_number: 123,
    state: 'TS',
    city: 'Test City',
    country: 'Brazil',
    image: '',
    website: 'https://test.com',
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

export function createMockRoom(overrides: Partial<any> = {}): any {
  return {
    id: 1,
    name: 'Test Room',
    description: 'Test Description',
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}