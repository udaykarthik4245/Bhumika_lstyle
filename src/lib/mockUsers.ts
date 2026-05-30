import { User } from './types';

// Seeded users — used to demonstrate auth flows in-memory.
// In a real app, never store plaintext passwords.
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Demo User',
    email: 'demo@bhumikastyle.com',
    phone: '9876543210',
    password: 'demo123',
    role: 'customer',
    addresses: [
      {
        id: 'addr-1',
        name: 'Demo User',
        phone: '9876543210',
        line1: '12 MG Road',
        line2: 'Apartment 4B',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001',
        type: 'home',
        isDefault: true,
      },
    ],
  },
  {
    id: 'user-admin',
    name: 'Admin',
    email: 'admin@bhumikastyle.com',
    phone: '9999999999',
    password: 'admin123',
    role: 'admin',
    addresses: [],
  },
];
