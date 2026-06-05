import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-global-dashboard',
  templateUrl: './global-dashboard.component.html',
  styleUrls: ['./global-dashboard.component.css']
})
export class GlobalDashboardComponent implements OnInit, OnDestroy {
  url: any;
  cacheBuster = new Date().getTime();
  loginsessionDetails: any;
  activeView: 'dashboard' | 'metrics' = 'dashboard';

  summaryData: any = {};
  districtCounts: any[] = [];
  loadingMetrics = false;

  private charts: { [key: string]: Chart } = {};

  constructor(
    private sanitizer: DomSanitizer,
    private _commonService: CommonServiceService
  ) {}

  ngOnInit(): void {
    this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.setDashboardUrl();
  }

  ngOnDestroy(): void {
    Object.values(this.charts).forEach(c => c.destroy());
  }

  switchView(view: 'dashboard' | 'metrics') {
    this.activeView = view;
    if (view === 'metrics') {
      if (this.districtCounts.length === 0 && !this.loadingMetrics) {
        this.loadMetricsData();
      } else if (this.districtCounts.length > 0) {
        setTimeout(() => this.renderAllCharts(), 150);
      }
    }
  }

  loadMetricsData() {
    this.loadingMetrics = true;

    this._commonService.getById(APIS.tihclCOI.getNumericData, 'district').subscribe({
      next: (res: any) => { this.summaryData = res || {}; },
      error: () => {}
    });

    this._commonService.getDataByUrl(APIS.tihclMasterList.getDistricts).subscribe({
      next: (res: any) => {
        const districts: any[] = res.data || [];
        if (!districts.length) { this.loadingMetrics = false; return; }

        const calls = districts.map((d: any) =>
          this._commonService.getById(APIS.tihclCOI.getNumericData, d.districtName).pipe(
            catchError(() => of({ applicationsReceived: 0, applicationsUnderProcess: 0, applicationsWithDic: 0, applicationsLoanSanctioned: 0, applicationsNotConsidered: 0 }))
          )
        );

        forkJoin(calls).subscribe({
          next: (results: any) => {
            const mapped = districts.map((d: any, i: number) => {
              const r = results[i] || {};
              const received = r.applicationsReceived || 0;
              const underProcess = r.applicationsUnderProcess || 0;
              const withDic = r.applicationsWithDic || 0;
              const sanctioned = r.applicationsLoanSanctioned || 0;
              const notConsidered = r.applicationsNotConsidered || 0;
              return {
                name: d.districtName,
                received, underProcess, withDic, sanctioned, notConsidered,
                total: received + underProcess + withDic + sanctioned + notConsidered
              };
            });

            this.districtCounts = mapped
              .filter(d => d.total > 0)
              .sort((a, b) => b.total - a.total);

            this.loadingMetrics = false;
            setTimeout(() => this.renderAllCharts(), 200);
          },
          error: () => { this.loadingMetrics = false; }
        });
      },
      error: () => { this.loadingMetrics = false; }
    });
  }

  renderAllCharts() {
    this.renderDistrictBarChart();
    this.renderStatusStackedChart();
    this.renderDonutChart();
    this.renderSanctionedBarChart();
  }

  private destroyChart(id: string) {
    if (this.charts[id]) { this.charts[id].destroy(); delete this.charts[id]; }
  }

  renderDistrictBarChart() {
    this.destroyChart('district');
    const canvas = document.getElementById('districtBarChart') as HTMLCanvasElement;
    if (!canvas || !this.districtCounts.length) return;
    const labels = this.districtCounts.map(d => d.name);
    const data = this.districtCounts.map(d => d.total);

    this.charts['district'] = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ data, backgroundColor: this.palette(labels.length), borderRadius: 5 }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx: any) => `${ctx.parsed.y} applications` } }
        },
        scales: {
          x: { ticks: { maxRotation: 40, font: { size: 10 } }, grid: { display: false } },
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  }

  renderStatusStackedChart() {
    this.destroyChart('status');
    const canvas = document.getElementById('statusBarChart') as HTMLCanvasElement;
    if (!canvas || !this.districtCounts.length) return;
    const labels = this.districtCounts.map(d => d.name);

    this.charts['status'] = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'New Applications', data: this.districtCounts.map(d => d.received), backgroundColor: '#4285F4', borderRadius: 2 },
          { label: 'Under Process', data: this.districtCounts.map(d => d.underProcess), backgroundColor: '#00ACC1', borderRadius: 2 },
          { label: 'With DIC', data: this.districtCounts.map(d => d.withDic), backgroundColor: '#E91E8C', borderRadius: 2 },
          { label: 'Sanctioned', data: this.districtCounts.map(d => d.sanctioned), backgroundColor: '#4CAF50', borderRadius: 2 },
          { label: 'Not Considered', data: this.districtCounts.map(d => d.notConsidered), backgroundColor: '#FF5722', borderRadius: 2 },
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top', labels: { boxWidth: 12, font: { size: 10 } } } },
        scales: {
          x: { stacked: true, ticks: { maxRotation: 40, font: { size: 10 } }, grid: { display: false } },
          y: { stacked: true, beginAtZero: true }
        }
      }
    });
  }

  renderDonutChart() {
    this.destroyChart('donut');
    const canvas = document.getElementById('donutChart') as HTMLCanvasElement;
    if (!canvas || !this.districtCounts.length) return;
    const top = this.districtCounts.slice(0, 10);
    const labels = top.map(d => d.name);
    const data = top.map(d => d.total);

    this.charts['donut'] = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data, backgroundColor: this.palette(labels.length), borderWidth: 2, borderColor: '#fff', hoverOffset: 8 }]
      },
      options: {
        responsive: true,
        cutout: '55%',
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 14, font: { size: 10 }, padding: 10 } },
          tooltip: {
            callbacks: {
              label: (ctx: any) => {
                const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const pct = total ? ((ctx.parsed / total) * 100).toFixed(1) : '0';
                return `${ctx.label}: ${ctx.parsed} (${pct}%)`;
              }
            }
          }
        }
      }
    });
  }

  renderSanctionedBarChart() {
    this.destroyChart('sanctioned');
    const canvas = document.getElementById('sanctionedBarChart') as HTMLCanvasElement;
    if (!canvas || !this.districtCounts.length) return;
    const active = this.districtCounts.filter(d => d.sanctioned > 0);
    const labels = active.map(d => d.name);
    const data = active.map(d => d.sanctioned);

    this.charts['sanctioned'] = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ data, backgroundColor: '#4CAF50', borderRadius: 5 }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx: any) => `${ctx.parsed.y} sanctioned` } }
        },
        scales: {
          x: { ticks: { maxRotation: 40, font: { size: 10 } }, grid: { display: false } },
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  }

  palette(n: number): string[] {
    const p = ['#4285F4','#00ACC1','#E91E8C','#FF5722','#FFC107','#9C27B0','#4CAF50','#FF9800','#607D8B','#795548','#F44336','#03A9F4','#8BC34A','#FF5252'];
    return Array.from({ length: n }, (_, i) => p[i % p.length]);
  }

  get hasSanctioned(): boolean {
    return this.districtCounts.some(d => d.sanctioned > 0);
  }

  get totalApplications(): number {
    return (this.summaryData?.applicationsReceived || 0) +
           (this.summaryData?.applicationsUnderProcess || 0) +
           (this.summaryData?.applicationsWithDic || 0) +
           (this.summaryData?.applicationsLoanSanctioned || 0) +
           (this.summaryData?.applicationsNotConsidered || 0);
  }

  setDashboardUrl(): void {
    if (this.loginsessionDetails && this.loginsessionDetails.userRole === 'EXECUTIVE_MANAGER') {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://lookerstudio.google.com/embed/u/0/reporting/52880037-9096-4a97-9068-aeefbb359054/page/CQfUF?params=%7B%22id%22:%22' + this.loginsessionDetails.userId + '%22%7D'
      );
    } else {
      switch (this.loginsessionDetails.userId) {
        case 'b3ca0091-d2e6-4716-9c72-f4f3889d36ca':
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://lookerstudio.google.com/embed/reporting/c3cfbbe8-992b-43a0-9e29-6a0e34c81dd2/page/VgMUF'); break;
        case 'e3d08054-e5cb-4231-9eb0-432ac2c569a8':
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://lookerstudio.google.com/embed/reporting/480e6275-7aac-4c37-856f-a6f5fcde3f21/page/VgMUF'); break;
        case '1145be0e-fbbb-47d2-b67d-030c95d1f369':
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://lookerstudio.google.com/embed/reporting/8f3200a9-5c2f-425f-b89e-71a880d1550a/page/p_p68byoxbvd'); break;
        case '21d35a88-bb51-4ed0-be36-2fa7b3a500d5':
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://lookerstudio.google.com/embed/reporting/be915832-9da4-422d-8ea1-3a64b5dca0e1/page/p_p68byoxbvd'); break;
        case '5bea8a43-db75-4292-8f51-1e85ba44111a':
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://lookerstudio.google.com/embed/reporting/f877f566-5fd6-4c9b-9f09-299ae94fa768/page/p_p68byoxbvd'); break;
        case '756edb90-97ac-4b30-9ba6-74509788cda6':
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://lookerstudio.google.com/embed/reporting/74368c36-2e1c-4ddd-8691-e6b57c4fa200/page/p_p68byoxbvd'); break;
        case 'bc1ac718-4d6e-4a86-9ec0-a9b1748f2a49':
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://lookerstudio.google.com/embed/reporting/643d2038-ec80-40f8-afee-704cd8e3a1e1/page/p_p68byoxbvd'); break;
        case 'c7c4df33-38c4-43a0-86a3-b12baf093640':
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://lookerstudio.google.com/embed/reporting/b966437e-860b-4080-8a8d-c213cf9329ee/page/p_p68byoxbvd'); break;
        case 'cc071924-5d3a-4cd3-9287-37da92485855':
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://lookerstudio.google.com/embed/reporting/7b94d358-96f5-499d-8187-8291038cc449/page/p_p68byoxbvd'); break;
        case '9c99aff3-f2e5-4785-8b74-81836f774a9e':
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://lookerstudio.google.com/embed/reporting/643d2038-ec80-40f8-afee-704cd8e3a1e1/page/p_p68byoxbvd'); break;
        case 'f2b8f2aa-9259-467c-926d-b296504401ea':
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://lookerstudio.google.com/embed/reporting/52581a80-1cbb-4ef1-bb4c-6aa2900243ae/page/KkgmF'); break;
        case '173440de-f39a-4d13-b6bd-dd23d5ab1ea6':
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://lookerstudio.google.com/embed/reporting/d5ce2fe0-2a54-48d2-b30e-21371b1d8af4/page/VgMUF'); break;
        default:
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://lookerstudio.google.com/embed/reporting/7b94d358-96f5-499d-8187-8291038cc449/page/p_p68byoxbvd');
      }
    }
  }
}
