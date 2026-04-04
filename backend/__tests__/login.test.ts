import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';

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

describe('POST /api/auth/login', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('login reușit cu credențiale corecte', async () => {
    const hashedPassword = await bcrypt.hash('parola123', 10);
    (prisma.user.findUnique as any).mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      password: hashedPassword,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'parola123' });

    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('respinge parola greșită', async () => {
    const hashedPassword = await bcrypt.hash('parola123', 10);
    (prisma.user.findUnique as any).mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      password: hashedPassword,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'parola-gresita' });

    expect(res.status).toBe(401);
  });

  it('respinge user inexistent', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nimeni@test.com', password: 'parola123' });

    expect(res.status).toBe(404);
  });

});