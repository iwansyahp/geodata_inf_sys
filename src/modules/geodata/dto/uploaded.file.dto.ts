export interface UploadedFileDto {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
