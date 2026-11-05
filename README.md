# TsImageGallery

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.6.

## Image gallery

The Photos route fetches metadata directly from Lorem Picsum using Angular HttpClient;
there is no backend or proxy. `ImagesService` shares in-flight requests by page and
page size, and constructs image URLs that preserve each photograph's aspect ratio.
`PhotosPage` owns signal-based pagination state and requests one page at a time.
An IntersectionObserver with an 800px prefetch margin triggers subsequent pages.
Failed pages can be retried without advancing pagination, and short or empty pages
end the stream. Duplicate image IDs are filtered; a page with no new IDs also ends
the stream to prevent repeatedly fetching a repeated terminal page.

`ImageCard` uses native lazy loading, responsive sources, reserved image dimensions,
a skeleton, and an image failure state. The UI uses the existing Material theme,
cards, buttons, and progress spinner, with reduced-motion support. HTTP subscriptions,
the observer, and scheduled rendering work are cleaned up on route destruction.

Run focused and existing tests with `npm test -- --watch=false`, and check the
production bundle with `npm run build`. Tests cover pagination, concurrent request
deduplication, errors and retry, end-of-results, image states, and destruction.

Virtualization is intentionally deferred. Consider it when profiling a long session
shows that thousands of retained cards cause excessive DOM memory, layout work, or
scrolling latency; account for variable image heights and preserve scroll position.

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

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit
the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
