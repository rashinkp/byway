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
  uploadType: z.enum(['course', 'profile', 'certificate']),
  metadata: z.object({
    courseId: z.string().optional(),
    userId: z.string().optional(),
    certificateId: z.string().optional(),
    contentType: z.enum(['thumbnail', 'video', 'document', 'avatar', 'cv']).optional(),
  }).optional(),
  // Optional size hint from client for pre-validation (bytes). Enforce max 100MB here.
  fileSize: z.number().int().positive().max(100 * 1024 * 1024).optional(),
});

export type GeneratePresignedUrlRequest = z.infer<typeof generatePresignedUrlSchema>; 

export const getPresignedGetUrlSchema = z.object({
  key: z.string().min(1),
  expiresInSeconds: z.coerce.number().int().positive().max(3600).optional(), // up to 1 hour
});