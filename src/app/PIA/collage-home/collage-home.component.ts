import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../_services/image.service';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { Image } from '../../_models/image.model';
import { Agency } from '../../_models/agencies.model';
import { Program } from '../../_models/program.model';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-collage-home',
  templateUrl: './collage-home.component.html',
  styleUrls: ['./collage-home.component.css']
})
export class CollageHomeComponent implements OnInit {
  faDownload = faDownload;
  collageImages: any[]=[];
  images: any[] = [];  
  selectedImages: Image[] = [];
  agencies: Agency[] = [];
  programs: Program[] = [];
  filteredImages: any[] = [];
  selectedAgencyId: number | null | string= null;
  selectedProgramId: number | null | string= 'select Program'; 

  constructor(
    private imageService: ImageService,
    private library: FaIconLibrary,
    public router: Router
  ) {
    this.library.addIcons(faDownload);
  }

  ngOnInit(): void {
    console.log('Fetching collage images...');
    this.imageService.getCollageImages().subscribe(
      (res: any[]) => {
        this.collageImages = res.filter((fileob: any) =>
          fileob.fileUrl?.match(/\.(jpeg|jpg|png|gif|png)$/i)
        );
        this.filteredImages = [...this.collageImages]; // Default show all
      },
      (err) => {
        console.error('Error fetching collage images:', err);
        this.filteredImages = [];
      }
    )

    this.getAgencies();
    this.getPrograms(1);
  }

  getFileName(fileUrl: string): string {
    return fileUrl.split('/').pop() || 'Unknown File';
  }

  getImageSrc(fileUrl: string): string {
    return fileUrl;
  }

  onAgencyChange(event: any): void {
    const agencyId = +event.target.value;
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
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = this.getFileName(fileUrl);

    link.click();
  }

  getAgencies(): void {
  this.imageService.getAgencies().subscribe(
    (res) => {
      this.agencies = res.data;
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
}
