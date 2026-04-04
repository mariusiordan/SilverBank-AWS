import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { signToken } from '@/lib/jwt';

// Mock Prisma before importing app
vi.mock('@/backend/src/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import prisma from '@/backend/src/prisma';
import app from '@/backend/src/index';

describe('GET /api/account', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returnează datele contului pentru user autentificat', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({
      id: 1,
      name: 'Test User',
      email: 'test@test.com',
      accounts: [{
        id: 1,
        iban: 'GB1234567890',
        balance: 1000,
        transactions: [],
      }],
    });

    const token = signToken({ userId: 1 });

    const res = await request(app)
      .get('/api/account')
      .set('Cookie', `token=${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('test@test.com');
    expect(res.body.account.iban).toBe('GB1234567890');
  });

  it('respinge request fără token', async () => {
    const res = await request(app)
      .get('/api/account');

    expect(res.status).toBe(401);
  });

  it('respinge token invalid', async () => {
    const res = await request(app)
      .get('/api/account')
      .set('Cookie', 'token=token-fals-123');

    expect(res.status).toBe(401);
  });

});