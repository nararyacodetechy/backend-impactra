export function generateUsername(base: string, existingUsernames: string[]): string {
  let username = '@' + base.toLowerCase().replace(/[^a-z0-9]/g, '');
  const original = username;
  let suffix = 1;

  while (existingUsernames.includes(username)) {
    username = `${original}${suffix}`;
    suffix++;
  }

  return username;
}
  