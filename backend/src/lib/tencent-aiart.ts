/**
 * Tencent Cloud AI Art Creation SDK Wrapper
 * 
 * Production-ready TypeScript wrapper for Tencent Cloud Hunyuan Image Generation API.
 * Provides a clean, type-safe API for common operations.
 * 
 * @example
 * ```typescript
 * import { TencentAIArtClient } from './tencent-aiart';
 * 
 * const client = new TencentAIArtClient({
 *   secretId: process.env.TENCENTCLOUD_SECRET_ID!,
 *   secretKey: process.env.TENCENTCLOUD_SECRET_KEY!,
 *   region: 'ap-guangzhou'
 * });
 * 
 * const result = await client.textToImage('A cute little cat');
 * console.log('Job ID:', result.jobId);
 * ```
 * 
 * @see https://cloud.tencent.com/document/product/1668
 * @version 1.0.0
 */

import * as tencentcloud from 'tencentcloud-sdk-nodejs';

const AiartClient = tencentcloud.aiart.v20221229.Client;

/**
 * Client configuration options
 */
export interface TencentAIArtConfig {
  /** Tencent Cloud SecretId */
  secretId: string;
  /** Tencent Cloud SecretKey */
  secretKey: string;
  /** Region, such as ap-guangzhou, ap-beijing */
  region?: string;
  /** API endpoint (optional, usually use default) */
  endpoint?: string;
}

/**
 * Text-to-image options
 */
export interface TextToImageOptions {
  /** Generated image resolution, such as "1024:1024", "1280:768" etc. */
  resolution?: string;
  /** Random seed, 0 or not passed for random, positive number for fixed seed */
  seed?: number;
  /** Whether to add AI watermark, 1=add, 0=don't add, default 1 */
  logoAdd?: number;
  /** Custom watermark logo content */
  logoParam?: LogoParam;
  /** Whether to enable prompt rewriting, 1=enable, 0=disable, default 1 */
  revise?: number;
  /** Image style ID (1-30) */
  style?: string;
  /** Return image method: base64 or url, default base64 */
  rspImgType?: string;
}

/**
 * Image-to-image options
 */
export interface ImageToImageOptions extends TextToImageOptions {
  /** Reference image Base64 encoding or URL */
  image: string;
}

/**
 * Custom watermark logo parameters
 */
export interface LogoParam {
  /** Watermark URL */
  logoUrl?: string;
  /** Watermark Base64 encoding */
  logoImage?: string;
  /** Watermark position: 0=top-left, 1=top-right, 2=bottom-left, 3=bottom-right */
  logoRect?: LogoRect;
}

/**
 * Watermark position parameters
 */
export interface LogoRect {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
  /** Width */
  width: number;
  /** Height */
  height: number;
}

/**
 * Text-to-image result
 */
export interface TextToImageResult {
  /** Job ID */
  jobId: string;
  /** Request ID */
  requestId: string;
}

/**
 * Image-to-image result
 */
export interface ImageToImageResult {
  /** Generated image URL or Base64 */
  resultImage: string;
  /** Request ID */
  requestId: string;
}

/**
 * Query job result
 */
export interface QueryJobResult {
  /** Job status: PENDING, RUNNING, SUCCESS, FAILED */
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  /** Image URL (when job succeeds) */
  imageUrl?: string;
  /** Error message (when job fails) */
  errorMessage?: string;
  /** Request ID */
  requestId: string;
}

/**
 * TencentAIArtClient provides a clean wrapper for Tencent Cloud AI Art Creation SDK
 */
export class TencentAIArtClient {
  private client: any;
  private config: TencentAIArtConfig;

  constructor(config: TencentAIArtConfig) {
    this.validateConfig(config);
    this.config = config;
    this.client = this.initializeClient();
  }

  /**
   * Initialize the underlying SDK client
   */
  private initializeClient(): any {
    // Only use sandbox proxy if X_IDE_AUTH_PROXY exists AND credentials are mock
    const isSandbox = process.env.X_IDE_AUTH_PROXY !== undefined;
    const isMockCredentials = this.config.secretId === 'mock_secret_id' || this.config.secretKey === 'mock_secret_key';
    const useSandbox = isSandbox && isMockCredentials;
    
    const clientConfig = {
      credential: {
        secretId: this.config.secretId,
        secretKey: this.config.secretKey,
      },
      region: this.config.region || 'ap-guangzhou',
      profile: {
        httpProfile: {
          endpoint: this.config.endpoint || (useSandbox ? 'aiart.tencent_cloud.auth-proxy.local' : ''),
          protocol: useSandbox ? 'http:' : 'https:',
        },
      },
    };

    return new AiartClient(clientConfig);
  }

  /**
   * Validate configuration
   */
  private validateConfig(config: TencentAIArtConfig): void {
    if (!config.secretId) {
      throw new Error('SecretId is required');
    }
    if (!config.secretKey) {
      throw new Error('SecretKey is required');
    }
    if (config.secretId.trim() !== config.secretId) {
      throw new Error('SecretId contains leading or trailing spaces');
    }
    if (config.secretKey.trim() !== config.secretKey) {
      throw new Error('SecretKey contains leading or trailing spaces');
    }
  }

  /**
   * Text-to-image - Submit Hunyuan Image Generation 3.0 job
   */
  async textToImage(
    prompt: string,
    options?: TextToImageOptions
  ): Promise<TextToImageResult> {
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }

    if (prompt.length > 1024) {
      throw new Error('Prompt length cannot exceed 1024 characters');
    }

    try {
      const params: any = {
        Prompt: prompt,
      };

      if (options?.resolution) {
        params.Resolution = options.resolution;
      }
      if (options?.seed !== undefined) {
        params.Seed = options.seed;
      }
      if (options?.logoAdd !== undefined) {
        params.LogoAdd = options.logoAdd;
      }
      if (options?.logoParam) {
        params.LogoParam = options.logoParam;
      }
      if (options?.revise !== undefined) {
        params.Revise = options.revise;
      }

      console.log('params', params);
      const response = await this.client.SubmitTextToImageJob(params);
      console.log('response', response);
      return {
        jobId: response.JobId,
        requestId: response.RequestId,
      };
    } catch (error: any) {
      throw new Error(`Text-to-image failed: ${error.message}`);
    }
  }

  /**
   * Image-to-image - Hunyuan Image Generation 2.0
   */
  async imageToImage(
    prompt: string,
    imageUrl: string,
    options?: Omit<ImageToImageOptions, 'image'>
  ): Promise<ImageToImageResult> {
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }

    if (prompt.length > 256) {
      throw new Error('Prompt length cannot exceed 256 characters');
    }

    if (!imageUrl || imageUrl.trim().length === 0) {
      throw new Error('Image URL or Base64 cannot be empty');
    }

    try {
      const params: any = {
        Prompt: prompt,
        Image: imageUrl,
      };

      if (options?.resolution) {
        params.Resolution = options.resolution;
      }
      if (options?.seed !== undefined) {
        params.Seed = options.seed;
      }
      if (options?.logoAdd !== undefined) {
        params.LogoAdd = options.logoAdd;
      }
      if (options?.logoParam) {
        params.LogoParam = options.logoParam;
      }
      if (options?.rspImgType) {
        params.RspImgType = options.rspImgType;
      }

      const response = await this.client.ImageToImage(params);

      return {
        resultImage: response.ResultImage,
        requestId: response.RequestId,
      };
    } catch (error: any) {
      throw new Error(`Image-to-image failed: ${error.message}`);
    }
  }

  /**
   * Query job status
   */
  async queryJob(jobId: string): Promise<QueryJobResult> {
    if (!jobId || jobId.trim().length === 0) {
      throw new Error('Job ID cannot be empty');
    }

    try {
      const params = {
        JobId: jobId,
      };

      const response = await this.client.QueryTextToImageJob(params);

      const result: QueryJobResult = {
        status: response.JobStatusCode,
        requestId: response.RequestId,
      };

      if (response.JobStatusCode === '5') {
        result.imageUrl = response.ResultImage && response.ResultImage.length > 0 
        ? response.ResultImage[0] 
        : undefined;
        result.status = 'SUCCESS';
      } else if (response.JobStatusCode === '4') {
        result.status = 'FAILED';
        result.errorMessage = response.JobErrorMsg || 'Unknown error';
      } else if (response.JobStatusCode === '1') {
        result.status = 'PENDING';
      } else if (response.JobStatusCode === '2') {
        result.status = 'RUNNING';
      }
      return result;
    } catch (error: any) {
      throw new Error(`Query job failed: ${error.message}`);
    }
  }

  /**
   * Poll and wait for job completion
   */
  async waitForJob(
    jobId: string,
    maxAttempts: number = 60,
    intervalMs: number = 2000
  ): Promise<QueryJobResult> {
    for (let i = 0; i < maxAttempts; i++) {
      const result = await this.queryJob(jobId);

      if (result.status === 'SUCCESS') {
        return result;
      }

      if (result.status === 'FAILED') {
        throw new Error(`Job failed: ${result.errorMessage}`);
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new Error(`Job timeout: not completed after ${maxAttempts * intervalMs / 1000} seconds`);
  }

  /**
   * Text-to-image (synchronous version)
   */
  async textToImageSync(
    prompt: string,
    options?: TextToImageOptions
  ): Promise<string> {
    const job = await this.textToImage(prompt, options);
    const result = await this.waitForJob(job.jobId);
    
    if (!result.imageUrl) {
      throw new Error('Job completed but no image URL returned');
    }
    
    return result.imageUrl;
  }
}

/**
 * Create TencentAIArtClient instance using environment variables
 */
export function createClient(config?: Partial<TencentAIArtConfig>): TencentAIArtClient {
  const isSandbox = process.env.X_IDE_AUTH_PROXY !== undefined;
  
  const secretId = process.env.TENCENTCLOUD_SECRET_ID || (isSandbox ? 'mock_secret_id' : '');
  const secretKey = process.env.TENCENTCLOUD_SECRET_KEY || (isSandbox ? 'mock_secret_key' : '');
  const region = process.env.TENCENTCLOUD_REGION || 'ap-guangzhou';
  
  return new TencentAIArtClient({
    secretId,
    secretKey,
    region,
    ...config,
  });
}
