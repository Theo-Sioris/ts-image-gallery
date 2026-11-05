# TsImageGallery

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.6.

## Image gallery

The Photos route fetches metadata directly from Lorem Picsum using Angular HttpClient;
there is no backend or proxy. `ImagesService` requests metadata by page and page
size, delays successful responses by 400ms as required by the assignment, and
constructs URLs for square 300px thumbnails. It does not cache or share requests.
`PhotosPage` owns signal-based pagination state and requests one page at a time.
An IntersectionObserver with a 300px margin on all sides triggers subsequent pages.
Failed pages can be retried without advancing pagination.

`ImageCard` uses native lazy loading, asynchronous decoding, explicit 300 × 300
image dimensions, a loading animation, and an image failure state. The initial
gallery load shows skeletons. The UI uses Angular Material theming, cards, buttons,
and a progress spinner; image animations respect reduced-motion preferences.
HTTP subscriptions and the observer are cleaned up on route destruction.

Clicking a photo in the gallery toggles its favorite status. Favorites are stored
in localStorage, and clicking a saved photo on the Favorites route opens its detail
view. The detail view requests a 1920 × 1080 image and allows removing a favorite.

Run focused and existing tests with `npm test -- --watch=false`, and check the
production bundle with `npm run build`. Tests cover initial and subsequent page
loads, prevention of overlapping page requests, errors and retry, image loading
and failure states, request cancellation and observer cleanup, favorite persistence,
storage failures, and routed photo details.

Current pagination limitations: empty or short pages do not mark the end of the
results, and incoming image IDs are not deduplicated. Automatic loading can stall
if the sentinel remains within the observer's margin after a page loads. The gallery
retains all loaded cards in the DOM; virtualization is not implemented.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will
automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build
optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

No end-to-end test framework or test target is configured in this project.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit
the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
