import { BadRequestException } from '@nestjs/common';

export function validateNotEmptyFile(file: Express.Multer.File) {
  if (!file || !file.buffer || file.buffer.length === 0) {
    throw new BadRequestException('Uploaded file is empty');
  }
  return file;
}

// Check magic number/content type for PNG and JPEG
export function validateImageMagicNumber(buffer: Buffer) {
  if (!buffer || buffer.length < 4) {
    throw new BadRequestException('File is too small or empty');
  }
  // PNG: 89 50 4E 47
  if (buffer.slice(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) {
    return true;
  }
  // JPEG: FF D8 FF
  if (buffer.slice(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
    return true;
  }
  throw new BadRequestException(
    'File content does not match allowed image types',
  );
}
