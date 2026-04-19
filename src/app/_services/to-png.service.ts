import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { APIS } from '@app/constants/constants';
import { ImageService } from './image.service';

@Injectable({
  providedIn: 'root'
})
export class ToPngService {
  constructor( private imageService: ImageService,) {}

  // Convert DOM to PNG Data URL
  toPng(node: HTMLElement): Promise<string> {
    return new Promise((resolve, reject) => {
      html2canvas(node, { useCORS: true, backgroundColor: null }).then(canvas => {
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      }).catch(err => {
        reject(err);
      });
    });
  }
private sanitizeFileName(name: string, defaultExt: string = 'png'): string {
  const raw = (name || '').trim();

  // Split base and extension from last dot
  const lastDot = raw.lastIndexOf('.');
  const hasExt = lastDot > 0 && lastDot < raw.length - 1;

  const base = (hasExt ? raw.substring(0, lastDot) : raw) || 'collage';
  const ext = (hasExt ? raw.substring(lastDot + 1) : defaultExt).toLowerCase();

  // Keep only letters, numbers, underscore, hyphen, dot.
  // This removes / \ and all other special chars.
  const cleanBase = base
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^[_\. -]+|[_\. -]+$/g, '');

  const cleanExt = ext.replace(/[^a-zA-Z0-9]/g, '') || defaultExt;

  return `${cleanBase || 'collage'}.${cleanExt}`;
}
  // Upload PNG as FormData
  uploadImage(dataUrl: string, fileName: string, programId: number) {
    const blob = this.dataURItoBlob(dataUrl);
    const safeFileName = this.sanitizeFileName(fileName, 'png');
    const formData = new FormData();
    formData.append('programId', programId.toString()); // ensure string
    formData.append('image', blob, safeFileName);
    
     this.imageService.saveImages(`${APIS.collageCreation.UPLOAD_COLLAGE}`,formData).subscribe((res)=>{
      console.log('Image uploaded successfully via ImageService:', res);
      return res.json();

      }
     ,(error)=>{
      console.error('Error uploading image via ImageService:', error);
      throw new Error(`Upload failed: ${error.message}`);
     });

    // return fetch(`${APIS.collageCreation.UPLOAD_COLLAGE}`, {
    //   method: 'POST',
    //   body: formData
    // }).then(response => {
    //   if (!response.ok) {
    //     throw new Error(`Upload failed: ${response.statusText}`);
    //   }
    //   return response.json();
    // });

  }



  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
  }
}
