import { Compose } from '../types/compose';
import * as yaml from 'js-yaml';

export function parseCompose(composeFile: string): Compose {
  return yaml.load(composeFile) as Compose;
}

export function composeToYaml(compose: Compose): string {
  return yaml.dump(compose);
}
