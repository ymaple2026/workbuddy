import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface SavedImage {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: string;
  quality: string;
  style: string;
  createdAt: string;
}

export interface ImagesResponse {
  images: SavedImage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SaveImageInput {
  url: string;
  prompt: string;
  aspectRatio?: string;
  quality?: string;
  style?: string;
}

const STORAGE_KEY = 'img_local_gallery';

function readGallery(): SavedImage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedImage[]) : [];
  } catch {
    return [];
  }
}

function writeGallery(images: SavedImage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
}

export function useImages(page = 1, limit = 20) {
  return useQuery<ImagesResponse>({
    queryKey: ['images', page, limit],
    queryFn: async () => {
      const all = readGallery();
      const start = (page - 1) * limit;
      const slice = all.slice(start, start + limit);
      return {
        images: slice,
        pagination: {
          page,
          limit,
          total: all.length,
          totalPages: Math.max(1, Math.ceil(all.length / limit)),
        },
      };
    },
  });
}

export function useSaveImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SaveImageInput) => {
      const image: SavedImage = {
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        url: input.url,
        prompt: input.prompt,
        aspectRatio: input.aspectRatio ?? '1:1',
        quality: input.quality ?? 'medium',
        style: input.style ?? 'auto',
        createdAt: new Date().toISOString(),
      };
      const all = readGallery();
      all.unshift(image);
      writeGallery(all);
      return image;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
}

export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: string) => {
      const all = readGallery().filter((img) => img.id !== imageId);
      writeGallery(all);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
}
