import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadExcelPdfComponent } from './download-excel-pdf.component';

describe('DownloadExcelPdfComponent', () => {
  let component: DownloadExcelPdfComponent;
  let fixture: ComponentFixture<DownloadExcelPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadExcelPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadExcelPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
