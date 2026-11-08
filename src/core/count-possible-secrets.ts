const cache = new Map<string, number>();

export const countPossibleSecrets = (length: number, base: number): number => {
  if (
    !Number.isInteger(base) ||
    base < 2 ||
    base > 16 ||
    !Number.isInteger(length) ||
    length < 0 ||
    length > base
  ) {
    throw new RangeError(
      'Length and base must be valid integers, with length no greater than base',
    );
  }

  const key = `${length}:${base}`;
  const cached = cache.get(key);

  if (cached !== undefined) return cached;

  const result = length === 0 ? 1 : (base - length + 1) * countPossibleSecrets(length - 1, base);

  cache.set(key, result);
  return result;
};
