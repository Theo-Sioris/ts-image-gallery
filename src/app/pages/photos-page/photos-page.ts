import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {Image, ImagesService} from '../../services/images.service';
import {ImageCard} from '../../shared/image-card/image-card';
import {GallerySkeletons} from './components/gallery-skeletons/gallery-skeletons';
import {catchError, EMPTY, tap} from 'rxjs';

@Component({
  selector: 'app-photos-page',
  imports: [ImageCard, GallerySkeletons, MatButtonModule, MatProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './photos-page.html',
  styleUrl: './photos-page.scss',
})
export class PhotosPage implements OnInit, AfterViewInit {
  private readonly imagesService = inject(ImagesService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly sentinel = viewChild.required<ElementRef<HTMLElement>>('sentinel');
  private intersectionObserver?: IntersectionObserver;

  private nextPage = 1;
  readonly pageSize = 30;

  readonly images = signal<Image[]>([]);
  readonly loading = signal(false);
  readonly error = signal(false);

  ngOnInit() {
    this.destroyRef.onDestroy(() => {
      this.intersectionObserver?.disconnect();
    });
  }

  ngAfterViewInit() {
    //Initial load
    this.loadNext();

    this.setupIntersectionObserver();
    // Caution: With the current implementation if the loaded images (pageSize)
    // are not enough to push the sentinel bellow the bottom of the page the code will stall.
    this.intersectionObserver?.observe(this.sentinel().nativeElement);
  }


  loadNext(): void {
    if (this.loading() || this.destroyRef.destroyed) return;
    this.loading.set(true);
    this.error.set(false);

    this.imagesService.getImages(this.nextPage, this.pageSize)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((newImages) => {
          this.images.update(images => [...images, ...newImages]);
          this.nextPage++;
        }),
        catchError(() => {
          this.error.set(true);
          return EMPTY;
        }),
        tap(() => {
          this.loading.set(false);
        })
      )
      .subscribe();
  }

  private setupIntersectionObserver() {
    const pixelBelowTheEndOfTheScreenToTriggerNextLoad = 300;
    const pixelOnSideAfterTheEndOfTheScreenToTriggerNextLoad = 300;

    this.intersectionObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting) && !this.error()) {
        this.loadNext();
      }
    }, {
      rootMargin: `
    ${pixelBelowTheEndOfTheScreenToTriggerNextLoad}px
    ${pixelOnSideAfterTheEndOfTheScreenToTriggerNextLoad}px
    `
    });
  }

}
