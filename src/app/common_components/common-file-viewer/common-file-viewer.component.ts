import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-common-file-viewer',
  templateUrl: './common-file-viewer.component.html',
  styleUrls: ['./common-file-viewer.component.css']
})
export class CommonFileViewerComponent implements OnInit, OnDestroy {
  showModal = false;
  filePath: string = '';
  previewUrl: string = '';
  safeFileUrl!: SafeResourceUrl;
  fileType: 'image' | 'pdf' | 'excel' | 'other' | 'invalid' = 'invalid';
  errorMessage: string = '';
  isLoading = false;
  private objectUrl: string = '';

  constructor(private fileService: CommonServiceService,
     private sanitizer: DomSanitizer,
    private toastr:ToastrService) {}


    readonly BASE_URL =  APIS.fileBaseUrlGet;

getFullFileUrl(path: string): string {
  const trimmed = path?.split('public_html/')?.[1];
  return trimmed ? `${this.BASE_URL}${trimmed}` : '';
}

 ngOnInit(): void {
  // Subscribe to service to get file path
  this.fileService.file$.subscribe(path => {
    console.log('File path subscription triggered', path);
    if (!path) return;
    console.log('Received file path:', path);

    // Use the utility to get the full URL
    this.revokeObjectUrl();
    this.filePath = this.fileService.resolveFileUrl(path) || this.getFullFileUrl(path);
    this.previewUrl = '';
    this.errorMessage = '';
    this.safeFileUrl = null as any;
    this.isLoading = false;
    this.isZoomed = false;

    // Validate URL
    if (!this.isValidUrl(this.filePath)) {
      this.fileType = 'invalid';
      this.errorMessage = 'File view not available';
    } else {
      this.fileType = this.getFileType(this.filePath);

      // Only create SafeResourceUrl if PDF
      if (this.fileType === 'pdf') {
        this.loadProtectedPreview(this.filePath);
      } else if (this.fileType === 'image') {
        this.loadProtectedPreview(this.filePath);
      } else if (this.fileType === 'excel') {
        const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(this.filePath)}`;
        this.safeFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(viewerUrl);
      }
    }

    this.showModal = true;
  });
}

 ngOnDestroy(): void {
  this.revokeObjectUrl();
 }

  isZoomed = false;

toggleZoom() {
  this.isZoomed = !this.isZoomed;
}


  closeModal() {
    this.showModal = false;
    this.revokeObjectUrl();
    this.filePath = '';
    this.previewUrl = '';
    this.errorMessage = '';
    this.safeFileUrl = null as any;
    this.isLoading = false;
  }

  getFileType(path: string): 'image' | 'pdf' | 'excel' | 'other' {
    const ext = path.split('.').pop()?.toLowerCase();
    if (ext?.match(/(jpg|jpeg|png|gif|bmp)/)) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (ext?.match(/(xls|xlsx|csv)/)) return 'excel';
    return 'other';
  }

  isValidUrl(path: string): boolean {
    return /^(http|https):\/\//.test(path);
  }

  onImageError() {
    this.revokeObjectUrl();
    this.errorMessage = 'Preview not available';
    this.fileType = 'invalid';
  }

  private revokeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = '';
    }
  }

  private getMimeType(path: string): string {
    const ext = path.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      case 'bmp':
        return 'image/bmp';
      case 'pdf':
        return 'application/pdf';
      default:
        return 'application/octet-stream';
    }
  }

  private normalizePreviewBlob(blob: Blob, path: string): Blob {
    if (blob.type) {
      if (this.fileType === 'image' && blob.type.startsWith('image/')) {
        return blob;
      }

      if (this.fileType === 'pdf' && blob.type === 'application/pdf') {
        return blob;
      }
    }

    return new Blob([blob], { type: this.getMimeType(path) });
  }

  private loadProtectedPreview(path: string): void {
    this.isLoading = true;
    this.fileService.getProtectedFile(path).subscribe({
      next: (blob: Blob) => {
        const previewBlob = this.normalizePreviewBlob(blob, path);
        this.objectUrl = URL.createObjectURL(previewBlob);
        this.previewUrl = this.objectUrl;

        if (this.fileType === 'pdf') {
          this.safeFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl);
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Preview load failed:', path, error);
        this.errorMessage = 'Preview not available';
        this.fileType = 'invalid';
        this.isLoading = false;
      }
    });
  }


  downloadFile() {
  if (!this.isValidUrl(this.filePath)) {
    this.toastr.error('Cannot download. File URL is invalid.');
    return;
  }

  this.fileService.downloadProtectedFile(this.filePath);
}




//    downloadFile() {
//   if (!this.isValidUrl(this.filePath)) {
//     this.toastr.error('Cannot download. File URL is invalid.');
//     return;
//   }

//   fetch(this.filePath, { mode: 'cors' })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.blob();
//     })
//     .then(blob => {
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;

//       const segments = this.filePath.split('/');
//       link.download = segments[segments.length - 1] || 'file';

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       window.URL.revokeObjectURL(url); // cleanup
//     })
//     .catch(() => {
//       this.toastr.error('Download failed.');
//     });
// }


  
}
