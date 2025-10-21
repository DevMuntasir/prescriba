export interface EnumOption<T = number | string> {
  name: string;
  value: T;
}

export function mapEnumToOptions<T extends object>(enumType: T): EnumOption[] {
  return Object.keys(enumType)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      name: key,
      value: (enumType as any)[key],
    }));
}
