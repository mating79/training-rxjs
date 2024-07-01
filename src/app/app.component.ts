import { Component, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { DataService } from './data.service';
import { Subject, of } from 'rxjs';
import { map, filter, mergeMap, switchMap, concatMap, debounceTime, distinctUntilChanged, catchError, takeUntil, first, take } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

  protected dataService = inject(DataService);
  private destroy$ = new Subject<void>();

  getDataWithMap() {
    this.data.set([]);
    this.dataService
      .getData()
      .pipe(
        map((data) => data.slice(0, 5)), // Get the first 5 items
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        this.data.set(res);
        console.log('Mapped Data:', res);
      });
  }

  getDataWithFilter() {
    this.data.set([]);
    this.dataService
      .getData()
      .pipe(
        filter((res: any[]) => res.length > 0), // Ensure data is not empty
        map((res) => res.filter((item) => item.userId === 1)) // Filter items by userId
      )
      .subscribe((data) => {
        this.data.set(data);
        console.log('Filtered Data:', data);
      });
  }

  getDataWithMergeMap() {
    //when we want to call api with dynamic id or something else.
    this.data.set([]);
    of(1, 2, 3)
      .pipe(
        mergeMap((id) => this.dataService.getData())
        // first()
      )
      .subscribe((data) => {
        this.data.set(data);
        console.log('Merged Data:', data);
      });
  }

  getDataWithSwitchMap() {
    //when we want to call api with dynamic id or something else previous value destroyed.

    this.data.set([]);
    of(1, 2, 3)
      .pipe(
        switchMap((id) => this.dataService.getData())
        // first()
      )
      .subscribe((data) => {
        this.data.set(data);
        console.log('Switched Data:', data);
      });
  }

  getDataWithConcatMap() {
    this.data.set([]);
    of(1, 2, 3)
      .pipe(
        concatMap((id) => this.dataService.getData())
        // first()
      )
      .subscribe((data) => {
        this.data.set(data);
        console.log('Concatenated Data:', data);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
