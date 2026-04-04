import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Mock Prisma before importing app
vi.mock('@/backend/src/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import prisma from '@/backend/src/prisma';
import app from '@/backend/src/index';

describe('POST /api/auth/register', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('înregistrează un user nou cu succes', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(null);
    (prisma.user.create as any).mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      name: 'Test',
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'parola123' });

    expect(res.status).toBe(201);
  });

  it('respinge dacă emailul există deja', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({
      id: 1,
      email: 'test@test.com',
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'parola123' });

    expect(res.status).toBe(409);
  });

  it('respinge dacă lipsesc câmpuri obligatorii', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com' }); // lipsește parola

    expect(res.status).toBe(400);
  });

});