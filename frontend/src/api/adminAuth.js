export function createAdminAuthorization(credentials) {
  const encodedCredentials = new TextEncoder().encode(
    `${credentials.username}:${credentials.password}`
  );
  let binary = '';
  encodedCredentials.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return `Basic ${btoa(binary)}`;
}
