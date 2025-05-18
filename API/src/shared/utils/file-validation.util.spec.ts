import { BadRequestException } from '@nestjs/common';
import {
  validateNotEmptyFile,
  validateImageMagicNumber,
} from './file-validation.util';

describe('FileValidationUtil', () => {
  describe('validateNotEmptyFile', () => {
    it('should throw if file is undefined', () => {
      expect(() => validateNotEmptyFile(undefined as any)).toThrow(
        BadRequestException,
      );
    });

    it('should throw if file buffer is undefined', () => {
      expect(() => validateNotEmptyFile({} as any)).toThrow(
        BadRequestException,
      );
    });

    it('should throw if file buffer is empty', () => {
      expect(() =>
        validateNotEmptyFile({ buffer: Buffer.from('') } as any),
      ).toThrow(BadRequestException);
    });

    it('should return file if buffer is not empty', () => {
      const file = { buffer: Buffer.from('abc') } as Express.Multer.File;
      expect(validateNotEmptyFile(file)).toBe(file);
    });
  });

  describe('validateImageMagicNumber', () => {
    it('should throw if buffer is undefined', () => {
      expect(() => validateImageMagicNumber(undefined as any)).toThrow(
        BadRequestException,
      );
    });

    it('should throw if buffer is too small', () => {
      expect(() => validateImageMagicNumber(Buffer.from([0x89]))).toThrow(
        BadRequestException,
      );
    });

    it('should return true for valid PNG magic number', () => {
      const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00]);
      expect(validateImageMagicNumber(png)).toBe(true);
    });

    it('should return true for valid JPEG magic number', () => {
      const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0x00]);
      expect(validateImageMagicNumber(jpeg)).toBe(true);
    });

    it('should throw for invalid magic number', () => {
      const invalid = Buffer.from([0x00, 0x11, 0x22, 0x33]);
      expect(() => validateImageMagicNumber(invalid)).toThrow(
        BadRequestException,
      );
    });
  });
});
