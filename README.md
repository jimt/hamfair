# Hamfair

A [Hugo](https://gohugo.io/) project for rendering my annual
galleries of photos from the
[Japan Ham Hair](https://www.jarl.org/English/4_Library/A-4-6_ham-fair/Ham%20Fair%202024,%20Tokyo.html).

## Use

Each year is presumed to have a `description.yaml` file
that paginates the images. Each page lists the images
and descriptions.

- `hugo build`
- `cp deploy.SAMPLE.sh deploy.sh`
- edit `deploy.sh` to set host and directories
- `./deploy.sh`

## History

This replaces the custom `pages` Python static site
generator.

## License

The images and descriptions are licensed under a
[Creative Commons Attribution 4.0 International License][cc-by].

[![CC BY 4.0][cc-by-image]][cc-by]

[cc-by]: http://creativecommons.org/licenses/by/4.0/
[cc-by-image]: https://i.creativecommons.org/l/by/4.0/88x31.png

