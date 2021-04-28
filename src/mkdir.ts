import fs from 'fs';

/** Recursively creates directories. */
export const makeDirectories = async (path: string) =>
  void (
    fs.existsSync(path) || (await fs.promises.mkdir(path, { recursive: true }))
  );
