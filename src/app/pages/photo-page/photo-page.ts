import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {FavoritesService} from '../../services/favorites.service';

@Component({
  selector: 'app-photo-page',
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './photo-page.html',
  styleUrl: './photo-page.scss',
})
export class PhotoPage {
  private readonly route = inject(ActivatedRoute);
  readonly favorites = inject(FavoritesService);

  private readonly params = toSignal(this.route.paramMap, {initialValue: this.route.snapshot.paramMap});
  readonly image = computed(() => {
    const id = this.params().get('id');
    if (!id) {
      throw new Error('Missing photo ID');
    }
    
    return {
      id
    }
  });

  readonly imageUrl = computed(() => `https://picsum.photos/id/${this.image().id}/1920/1080`);
  readonly isFavorite = computed(() => this.favorites.isFavorite(this.image()));

  readonly errorLoadingImage = signal(false);

  removeFavorite() {
    this.favorites.remove(this.image())
  }
}
