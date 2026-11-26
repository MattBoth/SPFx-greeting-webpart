import { BothOrder, NameMode, SourceFormat } from './IPersonalGreetingProps';

export interface IParsedName {
  first: string;
  last: string;
}

// Splits a display name into first/last. "Last, First" is detected by a comma when format is 'auto'.
export function parseDisplayName(displayName: string, format: SourceFormat): IParsedName {
  const name = (displayName || '').trim();
  const hasComma = name.indexOf(',') > -1;
  const isLastFirst = format === 'lastFirst' || (format === 'auto' && hasComma);

  if (isLastFirst) {
    const idx = name.indexOf(',');
    if (idx === -1) {
      return { first: name, last: '' };
    }
    return { last: name.substring(0, idx).trim(), first: name.substring(idx + 1).trim() };
  }

  const parts = name.split(/\s+/);
  return { first: parts[0] || '', last: parts.slice(1).join(' ') };
}

export function formatName(displayName: string, mode: NameMode, source: SourceFormat, bothOrder: BothOrder): string {
  const { first, last } = parseDisplayName(displayName, source);

  // Fall back to whatever is available so we never render "Both, " or an empty name.
  if (mode === 'first') {
    return first || last;
  }
  if (mode === 'last') {
    return last || first;
  }
  if (!first || !last) {
    return first || last;
  }
  return bothOrder === 'lastFirst' ? `${last}, ${first}` : `${first} ${last}`;
}
