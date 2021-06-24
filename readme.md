# JS-Notebook
A Jupyter Notebook style web application that allow users to run javascript code and preview it instantly on the browser.

- Each cell can either be a Markdown cell or a code cell
- Support showing React components
- Variable defined in cell before the current cell can be refered
- Support re-ordering cells
- Notebook are saved automatically to the local device for later edition or sharing
- Support importing library from npm

## Getting Starting
Under your working directory, run the following command:
```
npx js-notebook-w serve
```
This will allow user to edit on a notebook with a default name `notebook.js` on the current directory.

User can also specify the file name or the path to save the notebook file by doing:
```
# create the notebook with name test.js on the current directory
npx js-notebook-w serve test.js

# create the notebook with name test.js with related path
npx js-notebook-w serve ./folder1/test.js
```

The application by default will be running on port 4005, and can be changed by passing a flag to the command:
```
# run on port 4006 with short flag
npx js-notebook-w serve -p 4006 test.js

# run on port 4006 with long flag
npx js-notebook-w serve --port 4006 test.js
```