import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {FavoritesService} from '../../services/favorites.service';
import {ImageCard} from '../../shared/image-card/image-card';

@Component({
  selector: 'app-favourites-page',
  imports: [ImageCard, MatButtonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './favourites-page.html',
  styleUrl: './favourites-page.scss',
})
export class FavouritesPage {
  readonly favorites = inject(FavoritesService);
}
