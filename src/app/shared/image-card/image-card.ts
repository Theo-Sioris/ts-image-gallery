import {ChangeDetectionStrategy, Component, computed, inject, input, output, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {Image, ImagesService} from '../../services/images.service';

@Component({
  selector: 'app-image-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './image-card.html',
  styleUrl: './image-card.scss',
})
export class ImageCard {
  private readonly imagesService = inject(ImagesService);

  readonly image = input.required<Image>();
  readonly isFavorite = input(false);
  readonly imageUrl = computed(() => this.imagesService.imageUrl(this.image()));
  readonly imageClicked = output<Image>();

  readonly loaded = signal(false);
  readonly failed = signal(false);
}
