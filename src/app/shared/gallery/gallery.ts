import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  selector: 'app-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery {
  readonly label = input();
  readonly busy = input(false);
}
