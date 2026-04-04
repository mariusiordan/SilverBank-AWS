import { describe, it, expect } from 'vitest';
import { signToken, verifyToken } from '@/lib/jwt';

describe('JWT Functions', () => {

  it('signToken creează un token valid', () => {
    const token = signToken({ userId: 1 });
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('verifyToken returnează userId corect', () => {
    const token = signToken({ userId: 42 });
    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(42);
    // expect(decoded?.userId).toBe(999); // intentional fail
  });

  it('verifyToken returnează null pentru token invalid', () => {
    const decoded = verifyToken('token-fals-123');
    expect(decoded).toBeNull();
  });

});