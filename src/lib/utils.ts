
export function cn(...classes: (string | boolean | undefined | null | Record<string, boolean>)[]) {
  return classes
    .flatMap(cls => {
      if (typeof cls === 'string') return cls;
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls).filter(([_, value]) => value).map(([key, _]) => key);
      }
      return [];
    })
    .filter(Boolean)
    .join(' ');
}
