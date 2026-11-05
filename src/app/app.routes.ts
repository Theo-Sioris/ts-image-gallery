import { Routes } from '@angular/router';
import { PhotosPage } from './pages/photos-page/photos-page';
import { FavouritesPage } from './pages/favourites-page/favourites-page';
import { PhotoPage } from './pages/photo-page/photo-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: PhotosPage },
  { path: 'favorites', component: FavouritesPage },
  { path: 'photos/:id', component: PhotoPage },
];
