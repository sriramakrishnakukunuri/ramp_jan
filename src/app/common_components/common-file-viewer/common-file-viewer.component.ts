import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonServiceService } from '@app/_services/common-service.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-common-file-viewer',
  templateUrl: './common-file-viewer.component.html',
  styleUrls: ['./common-file-viewer.component.css']
})
export class CommonFileViewerComponent implements OnInit {
  showModal = false;
  filePath: string = '';
  safeFileUrl!: SafeResourceUrl;
  fileType: 'image' | 'pdf' | 'other' | 'invalid' = 'invalid';
  errorMessage: string = '';

  constructor(private fileService: CommonServiceService,
     private sanitizer: DomSanitizer,
    private toastr:ToastrService) {}

  ngOnInit(): void {
    // Subscribe to service to get file path
    this.fileService.file$.subscribe(path => {
      if (!path) return;
      console.log('Received file path:', path);

      this.filePath = path;
      this.errorMessage = '';
      this.safeFileUrl = null as any;

      // Validate URL
      if (!this.isValidUrl(path)) {
        this.fileType = 'invalid';
        this.errorMessage = 'File view not available';
      } else {
        this.fileType = this.getFileType(path);

        // Only create SafeResourceUrl if PDF
        if (this.fileType === 'pdf') {
          this.safeFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(path);
        }
      }

      this.showModal = true;
    });
  }

  isZoomed = false;

toggleZoom() {
  this.isZoomed = !this.isZoomed;
}


  closeModal() {
    this.showModal = false;
    this.filePath = '';
    this.errorMessage = '';
  }

  getFileType(path: string): 'image' | 'pdf' | 'other' {
    const ext = path.split('.').pop()?.toLowerCase();
    if (ext?.match(/(jpg|jpeg|png|gif|bmp)/)) return 'image';
    if (ext === 'pdf') return 'pdf';
    return 'other';
  }

  isValidUrl(path: string): boolean {
    return /^(http|https):\/\//.test(path);
  }

  onImageError() {
    this.errorMessage = 'Preview not available';
    this.fileType = 'invalid';
  }


  downloadFile() {
  if (!this.isValidUrl(this.filePath)) {
    this.toastr.error('Cannot download. File URL is invalid.');
    return;
  }

  const fileUrl = this.filePath;
  const fileName = fileUrl.split('/').filter(Boolean).pop() || 'file';

  // const link = document.createElement('a');
  // link.href = fileUrl;
  // link.download = fileName;   // only filename
  // // REMOVE target="_blank"
  
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);

  const link = document.createElement('a');
link.href = fileUrl;
link.target = '_blank';   // open file in new tab
document.body.appendChild(link);
link.click();
document.body.removeChild(link);

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
