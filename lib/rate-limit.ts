// lib/rate-limit.ts
const requests = new Map<string, number[]>();

export async function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000 // 1 minuto
): Promise<{ allowed: boolean; remaining: number }> {
  const now = Date.now();
  const key = identifier;

  // Inicializar ou limpar registros antigos
  if (!requests.has(key)) {
    requests.set(key, []);
  }

  const timestamps = requests.get(key)!;
  const validTimestamps = timestamps.filter(t => now - t < windowMs);

  if (validTimestamps.length >= limit) {
    return {
      allowed: false,
      remaining: 0,
    };
  }

  validTimestamps.push(now);
  requests.set(key, validTimestamps);

  return {
    allowed: true,
    remaining: limit - validTimestamps.length,
  };
}

// Limpar memória a cada 10 minutos
setInterval(() => {
  const now = Date.now();
  requests.forEach((timestamps, key) => {
    const validTimestamps = timestamps.filter(t => now - t < 10 * 60 * 1000);
    if (validTimestamps.length === 0) {
      requests.delete(key);
    } else {
      requests.set(key, validTimestamps);
    }
  });
}, 10 * 60 * 1000);