export const generateSecret = (length: number, base: number, random = Math.random): string => {
  if (
    !Number.isInteger(base) ||
    base < 2 ||
    base > 16 ||
    !Number.isInteger(length) ||
    length < 1 ||
    length > base
  ) {
    throw new RangeError(
      'Length and base must be valid integers, with length no greater than base',
    );
  }

  const digits = [...'0123456789abcdef'.slice(0, base)];

  for (let index = digits.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [digits[index], digits[randomIndex]] = [digits[randomIndex], digits[index]];
  }

  return digits.slice(0, length).join('');
};
