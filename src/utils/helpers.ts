import { sanitize } from 'dompurify';
import { decode, encode } from 'js-base64';
import marked from 'marked';
import { filenameLimit } from './data';

export function capitalize(str: string) {
  return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
}

export function getFileExtension(name: string) {
  const ind = name.lastIndexOf('.');
  if (ind !== -1) {
    return name.slice(ind + 1);
  }
  return '';
}

export function fetchErrorMessage(message: string, error: any) {
  return `${message} (${error.status ? `${error.status}: ` : ''}${
    error.message
  })`;
}

export function createSlug(title: string) {
  return title
    .replace(/\s/g, '-')
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-zA-Z0-9\-_]/g, '')
    .toLowerCase()
    .slice(0, filenameLimit);
}

function timeNumStr(from: number) {
  const num = Math.floor(Math.abs(from));
  return `${num < 10 ? '0' : ''}${num}`;
}

export function useHugoTemplate(template: string, title: string, slug: string) {
  const now = new Date();
  const tzo = now.getTimezoneOffset();
  const dateString = now
    .toISOString()
    .replace(
      /\..*/,
      `${tzo < 0 ? '+' : '-'}${timeNumStr(tzo / 60)}:${timeNumStr(tzo % 60)}`
    );
  return template
    .replace(/(title:).*\n/, `$1 "${title}"\n`)
    .replace(/(slug:).*\n/, `$1 ${slug}\n`)
    .replace(/(date:).*\n/, `$1 ${dateString}\n`);
}

export async function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject('Unknown reader result.');
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

export function encodeFileContents(
  value: string,
  onError: (e: string) => void
): string | undefined {
  try {
    // Make sure content has newline at end, base64 encode
    return encode(!value.match(/\n$/) ? `${value}\n` : value);
  } catch (e) {
    onError('Failed to encode file contents.');
    return;
  }
}

export function decodeFileContents(
  value: string,
  onError: (e: string) => void
): string {
  try {
    return decode(value);
  } catch (e) {
    onError('Failed to decode file contents.');
    return '';
  }
}

export function contentToHtml(content: string) {
  const titleMatch = content.match(/title: ['"](.*)['"]\n/);
  const title =
    titleMatch && titleMatch.length >= 2 ? `# ${titleMatch[1]}\n` : '';
  const mdContent = content.replace(/^---\n(.*)\n---\n/s, '');
  const htmlContent = marked(`${title}${mdContent}`);
  return sanitize(htmlContent);
}
