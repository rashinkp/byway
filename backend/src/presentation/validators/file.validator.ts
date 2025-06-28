import { z } from 'zod';

const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  audio: [
    'audio/mpeg', 
    'audio/wav', 
    'audio/ogg', 
    'audio/webm',
    'audio/webm;codecs=opus',
    'audio/mp4',
    'audio/mp4;codecs=mp4a',
    'audio/ogg;codecs=opus',
    'audio/ogg;codecs=vorbis'
  ],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

const ALLOWED_FILE_TYPES = [
  ...ALLOWED_MIME_TYPES.image,
  ...ALLOWED_MIME_TYPES.video,
  ...ALLOWED_MIME_TYPES.audio,
  ...ALLOWED_MIME_TYPES.document,
];

export const generatePresignedUrlSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().refine(
    (type) => ALLOWED_FILE_TYPES.includes(type),
    'Invalid file type. Please provide a valid image, video, audio, or document file type.'
  ),
});

export type GeneratePresignedUrlRequest = z.infer<typeof generatePresignedUrlSchema>; 