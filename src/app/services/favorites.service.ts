import {inject, Injectable, signal} from '@angular/core';
import {Image} from './images.service';
import {StorageService} from './storage.service';

@Injectable({providedIn: 'root'})
export class FavoritesService {
  private readonly storageService = inject(StorageService);
  private readonly storageKey = 'FAVOURITE_IMAGES';

  private readonly favoriteImages = signal<Image[]>(this.load());
  readonly images = this.favoriteImages.asReadonly();

  add(image: Image): void {
    if (this.isFavorite(image)) return;

    this.favoriteImages.update(images => [...images, {id: image.id}]);
    this.storageService.set(this.storageKey, this.images());
  }

  remove(image: Image): void {
    this.favoriteImages.update(images => images.filter(favorite => favorite.id !== image.id));
    this.storageService.set(this.storageKey, this.images());
  }

  isFavorite(image: Image): boolean {
    return this.images().some(favorite => favorite.id === image.id)
  }

  private load(): Image[] {
    return this.storageService.get<Image[]>(this.storageKey) || [];
  }
}
