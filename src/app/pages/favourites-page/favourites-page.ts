import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {FavoritesService} from '../../services/favorites.service';
import {ImageCard} from '../../shared/image-card/image-card';
import {Gallery} from '../../shared/gallery/gallery';

@Component({
  selector: 'app-favourites-page',
  imports: [Gallery, ImageCard, MatButtonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './favourites-page.html',
  styleUrl: './favourites-page.scss',
})
export class FavouritesPage {
  readonly favorites = inject(FavoritesService);
}
