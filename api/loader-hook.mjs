import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

register('ts-node/esm', pathToFileURL('./'));

// Enable path aliases
require('tsconfig-paths/register');