import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-gallery-skeletons',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gallery-skeletons.html',
  styleUrl: './gallery-skeletons.scss',
})
export class GallerySkeletons {
  readonly skeletons = Array.from({length: 6});
}
