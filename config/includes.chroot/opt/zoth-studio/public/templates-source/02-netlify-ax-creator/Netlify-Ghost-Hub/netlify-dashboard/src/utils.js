export const parseByteValue = (value) => {
  if (!value) return 0;
  const trimmed = String(value).trim();
  const match = trimmed.match(/([\d.]+)\s*([A-Za-z]+)/);
  if (!match) return 0;
  const amount = parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  const multipliers = {
    b: 1,
    kb: 1024,
    kib: 1024,
    mb: 1024 ** 2,
    mib: 1024 ** 2,
    gb: 1024 ** 3,
    gib: 1024 ** 3,
    tb: 1024 ** 4,
    tib: 1024 ** 4
  };

  const factor = multipliers[unit] || 1;
  return amount * factor;
};

export const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  let index = 0;
  let value = bytes;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
};

export const parseCpuPercent = (value) => {
  if (!value) return 0;
  const match = String(value).match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

export const parseMemUsage = (value) => {
  if (!value) return { usedBytes: 0, limitBytes: 0 };
  const [used, limit] = String(value).split('/').map((item) => item.trim());
  return {
    usedBytes: parseByteValue(used),
    limitBytes: parseByteValue(limit)
  };
};
