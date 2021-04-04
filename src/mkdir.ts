import fs from 'fs';

/** Recursively creates directories. */
export const makeDirectories = async (path: string) => {
  if (!fs.existsSync(path)) {
    await fs.promises.mkdir(path, { recursive: true });
  }
};
