import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImageService } from '../../_services/image.service';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { Image } from '../../_models/image.model';
import { Agency } from '../../_models/agencies.model';
import { Program } from '../../_models/program.model';
import { Router} from '@angular/router';
import { APIS } from '@app/constants/constants';

@Component({
  selector: 'app-collage-home',
  templateUrl: './collage-home.component.html',
  styleUrls: ['./collage-home.component.css']
})
export class CollageHomeComponent implements OnInit, OnDestroy {
  faDownload = faDownload;
  collageImages: any[]=[];
  images: any[] = [];  
  selectedImages: Image[] = [];
  agencies: Agency[] = [];
  filteredAgencies:any;
  programs: Program[] = [];
  filteredImages: any[] = [];
  selectedAgencyId: number | null | string= null;
  selectedProgramId: number | null | string= 'select Program'; 
  user: any;

  agencyId: any;
  loginsessionDetails:any
  imageSrcMap: Record<string, string> = {};
  private loadingImageSet = new Set<string>();
  constructor(
    private imageService: ImageService,
    private library: FaIconLibrary,
    public router: Router,
  ) {
    this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');    
    this.selectedAgencyId = this.loginsessionDetails?.agencyId;
    if(this.selectedAgencyId){
      this.onAgencyChange(this.selectedAgencyId)
    }
    this.library.addIcons(faDownload);
  }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');  
    console.log('Logged-in User:', this.user);
    this.imageService.getCollageImages().subscribe(
      (res: any[]) => {
        this.collageImages = res.filter((fileob: any) =>
          fileob.fileUrl?.match(/\.(jpeg|jpg|png|gif|png)$/i)
        );
        this.filteredImages = [...this.collageImages]; // Default show all
        this.preloadImagesForRows(this.collageImages);
      },
      (err) => {
        console.error('Error fetching collage images:', err);
        this.filteredImages = [];
      }
    )

    this.getAgencies();
    this.getPrograms(1);
  }
  getColleges(): void {
     this.user = JSON.parse(sessionStorage.getItem('user') || '{}');  
    console.log('Logged-in User:', this.user);
     this.imageService.getCollageImages().subscribe(
      (res: any[]) => {
        this.collageImages = res.filter((fileob: any) =>
          fileob.fileUrl?.match(/\.(jpeg|jpg|png|gif|png)$/i)
        );
        this.filteredImages = [...this.collageImages]; // Default show all
        this.preloadImagesForRows(this.collageImages);
        this.onAgencyChange(this.selectedAgencyId);
      },
      (err) => {
        console.error('Error fetching collage images:', err);
        this.filteredImages = [];
      }
    )
  }

  getFileName(fileUrl: string): string {
    return fileUrl?.split('/').pop() || 'Unknown File';
  }

  trackByCollage(index: number, image: any): any {
    return image?.fileUrl || index;
  }

  private preloadImagesForRows(rows: any[]): void {
    (rows || []).forEach((row: any) => {
      const fileUrl = row?.fileUrl;
      if (!fileUrl) return;
      this.ensureImageSrc(fileUrl);
    });
  }

  private ensureImageSrc(fileUrl: string): void {
    if (!fileUrl || this.imageSrcMap[fileUrl] || this.loadingImageSet.has(fileUrl)) return;
    this.loadingImageSet.add(fileUrl);
    this.imageService.getImage(APIS.fileBaseUrlGet + fileUrl).subscribe({
      next: (blob: Blob) => {
        this.imageSrcMap[fileUrl] = URL.createObjectURL(blob);
        this.loadingImageSet.delete(fileUrl);
      },
      error: () => {
        this.imageSrcMap[fileUrl] = '';
        this.loadingImageSet.delete(fileUrl);
      }
    });
  }

  private clearImageCache(): void {
    Object.values(this.imageSrcMap).forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });
    this.imageSrcMap = {};
    this.loadingImageSet.clear();
  }

  ngOnDestroy(): void {
    this.clearImageCache();
  }

  onAgencyChange(event: any): void {
    this.selectedAgencyId = event;
    const agencyId = +event;
    if (!agencyId) {
      // Reset filter if no agency selected
      this.filteredImages = [...this.collageImages];
      return;
    }

    this.getProgramsAndFilterImages(agencyId);
  }

  getProgramsAndFilterImages(agencyId: number): void {
  this.imageService.getPrograms(agencyId).subscribe(
    (res) => {
      this.programs = res.data;
      const programIds = this.programs.map((p) => p.programId);

      this.filteredImages = this.collageImages.filter(image =>
        programIds.includes(image.programId)
      );
    },
    (err) => {
      console.error('Error fetching programs:', err);
      this.filteredImages = [];
    }
  );
}

  isSelected(id: number): boolean {
    return this.selectedImages.some((img) => img.id === id);
  }

  toggleSelection(image: Image): void {
    const exists = this.selectedImages.find((img) => img.id === image.id);
    if (exists) {
      this.selectedImages = this.selectedImages.filter((img) => img.id !== image.id);

    } else {
      this.selectedImages.push(image);
    }
    console.log("toggle selection:",this.selectedImages);
  }


  redirectToCollageCreation(): void {
    console.log("selected images:",this.selectedImages);
    //window.location.href = '/collage-creation';
    this.router.navigate(['/collage-creation'])
  }
  getDownloadUrl(fileUrl: string): void {
    this.imageService.getImage(APIS.fileBaseUrlGet + fileUrl).subscribe({
      next: (blob: Blob) => {
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = this.getFileName(fileUrl);
        link.click();
        URL.revokeObjectURL(objectUrl);
      },
      error: () => {
        console.error('Download failed for:', fileUrl);
      }
    });
  }

  getAgencies(): void {
  this.imageService.getAgencies().subscribe(
    (res) => {
      this.agencies = res.data;
      this.filteredAgencies= this.agencies
    },
    (err) => {
      console.error('Error fetching agencies:', err);
    }
  );
  }

  getPrograms(agencyId: number): void {
    this.imageService.getPrograms(agencyId).subscribe(
      (res) => {
        console.log('Programs:', res);
        this.programs = res.data;
        console.log('Programs:', this.programs);
      },
      (err) => {
        console.error('Error fetching programs:', err);
      }
    );
  }
  deleteImage(imageId: number): void {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    this.imageService.deleteImage(imageId).subscribe(
      (res) => {
        console.log('Image deleted successfully:', res);
        // Remove the deleted image from local arrays
        this.getColleges()
      },
      (err) => {
        this.getColleges()
        console.error('Error deleting image:', err);
      }
    );

  }
}