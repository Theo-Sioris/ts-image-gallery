import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {Image} from '../../services/images.service';
import {MatButtonModule} from '@angular/material/button';
import {FavoritesService} from '../../services/favorites.service';
import {ImageCard} from '../../shared/image-card/image-card';
import {Gallery} from '../../shared/gallery/gallery';

@Component({
  selector: 'app-favourites-page',
  imports: [Gallery, ImageCard, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './favourites-page.html',
  styleUrl: './favourites-page.scss',
})
export class FavouritesPage {
  private readonly router = inject(Router);
  readonly favorites = inject(FavoritesService);

  openPhoto(image: Image): void {
    void this.router.navigate(['/photos', image.id]);
  }
}
