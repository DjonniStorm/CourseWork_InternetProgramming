import * as fs from 'fs';
import * as path from 'path';

interface FileInfo {
  path: string;
  content: string;
}

const IGNORE_PATTERNS = [
  'node_modules',
  'dist',
  'target',
  '.git',
  '.idea',
  'generated-sources',
  'generated-test-sources',
  'maven-archiver',
  'maven-status',
  'test-classes',
  'classes',
  '.md',
];

const INCLUDED_EXTENSIONS = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.java',
  '.yaml',
  '.yml',
  '.xml',
  '.json',
  '.css',
  '.html',
  '.sql',
  '.properties',
  '.sh',
  '.bat',
  '.dockerfile',
];

const INCLUDED_FILES = [
  'docker-compose.yml',
  'Dockerfile',
  '.gitignore',
  '.env',
  'pom.xml',
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'eslint.config.mjs',
  'eslint.config.js',
  'postcss.config.cjs',
];

function shouldIgnore(filePath: string): boolean {
  const normalizedPath = filePath.replace(/\\/g, '/');

  for (const pattern of IGNORE_PATTERNS) {
    if (normalizedPath.includes(pattern)) {
      return true;
    }
  }

  return false;
}

function shouldInclude(filePath: string): boolean {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const fileName = path.basename(normalizedPath);

  if (INCLUDED_FILES.includes(fileName)) {
    return true;
  }

  const ext = path.extname(normalizedPath).toLowerCase();
  if (INCLUDED_EXTENSIONS.includes(ext)) {
    return true;
  }

  return false;
}

function getAllFiles(dirPath: string, arrayOfFiles: FileInfo[] = []): FileInfo[] {
  try {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      const relativePath = path.relative(process.cwd(), filePath);
      const normalizedPath = relativePath.replace(/\\/g, '/');

      if (normalizedPath === 'code-listing.txt' || normalizedPath === 'generate-code-listing.ts') {
        return;
      }

      const fileName = path.basename(normalizedPath);
      if (
        fileName === 'package-lock.json' ||
        fileName === 'bun.lock' ||
        fileName.endsWith('.lock')
      ) {
        return;
      }

      if (shouldIgnore(relativePath)) {
        return;
      }

      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        if (!shouldIgnore(relativePath)) {
          // Рекурсивно обходим поддиректории
          getAllFiles(filePath, arrayOfFiles);
        }
      } else if (stat.isFile() && shouldInclude(relativePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          arrayOfFiles.push({
            path: normalizedPath,
            content,
          });
        } catch (error) {
          console.warn(`Не удалось прочитать файл: ${relativePath}`);
        }
      }
    });
  } catch (error) {
    console.error(`Ошибка при чтении директории ${dirPath}:`, error);
  }

  return arrayOfFiles;
}

function cleanContent(content: string): string {
  return (
    content
      .split('\n')
      .map((line) => {
        // Убираем все пробелы и табы в начале строки (отступы)
        let cleaned = line.trimStart();
        // Убираем пробелы в конце строки
        cleaned = cleaned.trimEnd();
        // Заменяем множественные пробелы на один
        cleaned = cleaned.replace(/[ ]{2,}/g, ' ');
        return cleaned;
      })
      .join('\n')
      // Убираем множественные пустые строки (более 1 подряд)
      .replace(/\n{2,}/g, '\n')
      // Убираем пустые строки в начале и конце
      .trim()
  );
}

function generateListing(): void {
  console.log('Начинаю генерацию листинга кода...');

  const rootDir = process.cwd();
  const files = getAllFiles(rootDir);

  console.log(`Найдено файлов: ${files.length}`);

  let output = '';
  output += 'ЛИСТИНГ КОДА ПРОЕКТА\n';
  output += `Дата создания: ${new Date().toLocaleString('ru-RU')}\n`;
  output += `Всего файлов: ${files.length}\n`;
  output += `${'='.repeat(80)}\n\n`;

  files.sort((a, b) => a.path.localeCompare(b.path));

  files.forEach((file) => {
    const cleanedContent = cleanContent(file.content);
    output += `${file.path}\n`;
    output += cleanedContent;
    output += '\n\n';
  });

  // Убираем лишние пустые строки в конце
  output = output.trimEnd();

  const outputPath = path.join(rootDir, 'code-listing.txt');
  fs.writeFileSync(outputPath, output, 'utf-8');

  console.log(`Листинг кода сохранен в файл: ${outputPath}`);
  console.log(`Размер файла: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
}

generateListing();
