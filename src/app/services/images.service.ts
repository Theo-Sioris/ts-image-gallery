import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {delay, Observable} from 'rxjs';

export interface Image {
  id: string;
}

@Injectable({providedIn: 'root'})
export class ImagesService {
  private readonly http = inject(HttpClient);

  getImages(page: number, limit: number): Observable<Image[]> {
    return this.http.get<Image[]>('https://picsum.photos/v2/list', {
      params: {page, limit},
    }).pipe(
      delay(400), // This is a requirement of this coding challenge
    );
  }

  imageUrl(image: Image): string {
    // there is a download_url property coming in from the API response
    // but it includes size and for fetching speed the URL is reconstructed here
    // and the API property ignored
    return `https://picsum.photos/id/${image.id}/300`;
  }
}
