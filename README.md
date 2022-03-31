## Adding and publishing results of a new election

1. Add the csv file to `public/data`.
2. Add the election to `src/elections.ts`, as the first element of the array, with the following fields:
   * `fileName` - name of the file you added in step 1, for example `Fall_2021.csv`
   * `title` - descriptive title that will be displayed, for example `Fall 2021`,
   * `system`: either `score` (which should cover all new elections) or `stv` (for the first two). If at some point a different system is used, it'll have to be implemented here.
3. Run it locally, make sure it works as expected (`yarn start`)
4. Ship it!:
4.1.: Commit and push the changes to `master`
4.2: Run `yarn deploy`. It will be delopyed to github pages: https://dlopezm.github.io/election-visualizer/