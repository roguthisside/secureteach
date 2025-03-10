
export interface SecurityOptions {
  preventScreenRecording: boolean;
  preventScreenshots: boolean;
  preventDownloading: boolean;
  preventWindowSharing: boolean;
  enableWatermarking: boolean;
}

export interface WatermarkOptions {
  enabled: boolean;
  includeName: boolean;
  includeEmail: boolean;
  includeId: boolean;
  includeTimestamp: boolean;
  includeCustomText: boolean;
  customText: string;
  opacity: number;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export interface VideoContent {
  id: string;
  title: string;
  description: string;
  uploadDate: string;
  duration: number;
  thumbnailUrl: string;
  videoUrl: string;
  securityOptions: SecurityOptions;
  watermarkOptions: WatermarkOptions;
  embedCode?: string;
}

// Default security options
export const defaultSecurityOptions: SecurityOptions = {
  preventScreenRecording: true,
  preventScreenshots: true,
  preventDownloading: true,
  preventWindowSharing: true,
  enableWatermarking: true,
};

// Default watermark options
export const defaultWatermarkOptions: WatermarkOptions = {
  enabled: true,
  includeName: true,
  includeEmail: false,
  includeId: true,
  includeTimestamp: true,
  includeCustomText: false,
  customText: '',
  opacity: 0.5,
  position: 'center',
};

export function generateEmbedCode(
  videoId: string, 
  securityOptions: SecurityOptions, 
  watermarkOptions: WatermarkOptions
): string {
  // Create URL with parameters
  const baseUrl = window.location.origin;
  const embedUrl = new URL(`${baseUrl}/embed/${videoId}`);
  
  // Add security options as URL parameters
  Object.entries(securityOptions).forEach(([key, value]) => {
    embedUrl.searchParams.append(key, value.toString());
  });
  
  // Add watermarking options
  if (watermarkOptions.enabled) {
    embedUrl.searchParams.append('watermark', 'true');
    embedUrl.searchParams.append('wm_position', watermarkOptions.position);
    embedUrl.searchParams.append('wm_opacity', watermarkOptions.opacity.toString());
    
    // Add watermark content options
    if (watermarkOptions.includeName) embedUrl.searchParams.append('wm_name', 'true');
    if (watermarkOptions.includeEmail) embedUrl.searchParams.append('wm_email', 'true');
    if (watermarkOptions.includeId) embedUrl.searchParams.append('wm_id', 'true');
    if (watermarkOptions.includeTimestamp) embedUrl.searchParams.append('wm_time', 'true');
    if (watermarkOptions.includeCustomText && watermarkOptions.customText) {
      embedUrl.searchParams.append('wm_text', encodeURIComponent(watermarkOptions.customText));
    }
  }
  
  // Generate iframe HTML
  const iframeCode = `<iframe 
  src="${embedUrl.toString()}" 
  width="100%" 
  height="480" 
  frameborder="0" 
  allowfullscreen 
  allow="encrypted-media" 
  class="secureteach-player"
></iframe>
<script src="${baseUrl}/secureteach.js"></script>`;

  return iframeCode;
}

// Local storage key for demo content
const CONTENT_STORAGE_KEY = 'secure_teach_content';

// Mock content service for demo purposes
export class ContentService {
  // Get all user content
  getAllContent(): VideoContent[] {
    const storedContent = localStorage.getItem(CONTENT_STORAGE_KEY);
    if (!storedContent) return [];
    
    try {
      return JSON.parse(storedContent) as VideoContent[];
    } catch (error) {
      console.error('Error parsing content:', error);
      return [];
    }
  }
  
  // Get single content item by ID
  getContentById(id: string): VideoContent | null {
    const allContent = this.getAllContent();
    return allContent.find(item => item.id === id) || null;
  }
  
  // Save new content
  addContent(content: Omit<VideoContent, 'id'>): VideoContent {
    const newContent: VideoContent = {
      ...content,
      id: crypto.randomUUID(),
    };
    
    const allContent = this.getAllContent();
    allContent.push(newContent);
    
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(allContent));
    return newContent;
  }
  
  // Update existing content
  updateContent(content: VideoContent): VideoContent {
    const allContent = this.getAllContent();
    const index = allContent.findIndex(item => item.id === content.id);
    
    if (index === -1) {
      throw new Error('Content not found');
    }
    
    allContent[index] = content;
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(allContent));
    
    return content;
  }
  
  // Delete content
  deleteContent(id: string): void {
    const allContent = this.getAllContent();
    const filteredContent = allContent.filter(item => item.id !== id);
    
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(filteredContent));
  }
  
  // Generate embed code for content
  generateEmbedCode(id: string): string | null {
    const content = this.getContentById(id);
    if (!content) return null;
    
    const embedCode = generateEmbedCode(
      content.id,
      content.securityOptions,
      content.watermarkOptions
    );
    
    // Save the embed code to the content
    content.embedCode = embedCode;
    this.updateContent(content);
    
    return embedCode;
  }
}

export const contentService = new ContentService();
