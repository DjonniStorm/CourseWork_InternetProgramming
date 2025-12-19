function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function nameToColor(name: string): string {
  const hash = hashString(name);
  const hue = Math.abs(hash) % 360;

  return `hsl(${hue}, 60%, 70%)`; // светлый фон
}

export { nameToColor };
