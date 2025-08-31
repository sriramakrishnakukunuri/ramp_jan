import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoading = new BehaviorSubject<boolean>(false);
  private loadingText = new BehaviorSubject<string>('Loading...');

  // Public observables for components to subscribe to
  isLoading$ = this.isLoading.asObservable();
  loadingText$ = this.loadingText.asObservable();

  constructor() { }

  show(text: string = 'Loading...') {
    this.loadingText.next(text);
    this.isLoading.next(true);
  }

  hide() {
    this.isLoading.next(false);
  }

  updateLoaderText(text: string) {
    this.loadingText.next(text);
  }
}
