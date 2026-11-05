import {ChangeDetectionStrategy, Component, inject, input, signal} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {Image, ImagesService} from '../../services/images.service';

@Component({
  selector: 'app-image-card',
  imports: [MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './image-card.html',
  styleUrl: './image-card.scss',
})
export class ImageCard {
  private readonly imagesService = inject(ImagesService);

  readonly image = input.required<string, Image>({
    transform: (image: Image) => this.imagesService.imageUrl(image)
  });

  readonly loaded = signal(false);
  readonly failed = signal(false);
}
