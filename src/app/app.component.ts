import { Component, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { DataService } from './data.service';
import { Subject, of } from 'rxjs';
import { map, filter, mergeMap, switchMap, concatMap, debounceTime, distinctUntilChanged, catchError, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css'],
  })
  data: WritableSignal<any> = signal([]);
  transformedData: WritableSignal<any> = signal([]);

  private destroy$ = new Subject<void>();

  protected dataService = inject(DataService);

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.dataService
      .getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.data = data;
        console.log('Fetched Data:', this.data);
      });
  }

  getDataWithMap() {
    this.dataService
      .getData()
      .pipe(
        map((data) => data.slice(0, 5)) // Get the first 5 items
      )
      .subscribe((data) => {
        this.transformedData = data;
        console.log('Mapped Data:', data);
      });
  }

  getDataWithFilter() {
    this.dataService
      .getData()
      .pipe(
        filter((data: any[]) => data.length > 0), // Ensure data is not empty
        map((data) => data.filter((item) => item.userId === 1)) // Filter items by userId
      )
      .subscribe((data) => {
        this.transformedData.set(data);
        console.log('Filtered Data:', data);
      });
  }

  getDataWithMergeMap() {
    of(1, 2, 3)
      .pipe(mergeMap((id) => this.dataService.getData()))
      .subscribe((data) => {
        this.transformedData = data;
        console.log('Merged Data:', data);
      });
  }

  getDataWithSwitchMap() {
    of(1, 2, 3)
      .pipe(switchMap((id) => this.dataService.getData()))
      .subscribe((data) => {
        this.transformedData = data;
        console.log('Switched Data:', data);
      });
  }

  getDataWithConcatMap() {
    of(1, 2, 3)
      .pipe(concatMap((id) => this.dataService.getData()))
      .subscribe((data) => {
        this.transformedData = data;
        console.log('Concatenated Data:', data);
      });
  }

  getDataWithDebounce() {
    of('search query')
      .pipe(
        debounceTime(300),
        switchMap((query) => this.dataService.getData())
      )
      .subscribe((data) => {
        this.transformedData = data;
        console.log('Debounced Data:', data);
      });
  }

  getDataWithDistinctUntilChanged() {
    of('query1', 'query1', 'query2')
      .pipe(
        distinctUntilChanged(),
        switchMap((query) => this.dataService.getData())
      )
      .subscribe((data) => {
        this.transformedData = data;
        console.log('Distinct Data:', data);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
