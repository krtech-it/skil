export function removeEmptyFieldsObject<T>(object: T): T {
  return Object.entries(object)
    .filter(([_, v]) => v !== null && v !== undefined)
    .reduce(
      (acc, [k, v]) => ({
        ...acc,
        [k]:
          v === Object(v) && !Array.isArray(v) ? removeEmptyFieldsObject(v) : v
      }),
      {}
    ) as T;
}
