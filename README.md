# documentdb-node-es6-todo-app
This sample shows you how to use the Microsoft Azure DocumentDB service to store and access data from a Node.js Express application. It is based on the original sample available [here](https://github.com/Azure-Samples/documentdb-node-todo-app), but has been rewritten in ES6 and updated to use [Application Insights](https://azure.microsoft.com/en-us/documentation/services/application-insights/) and [dotenv](https://www.npmjs.com/package/dotenv). The project is set up to be used with [Visual Studio Code](https://code.visualstudio.com/) and [ESLint](http://eslint.org/). Please make sureto  have ESLint installed globally (`npm i -g eslint eslint-config-defaults`).
***
In order to run the sample locally, create a text file called `.env` in the project's root directory and add the environment settings `HOST`, `APP_KEY`, and `APPINSIGHTS_INSTRUMENTATIONKEY` (see the dotenv documentation to understand the file format). 

Note that `.env` is included in the project's [`.gitignore`](https://github.com/joergjo/documentdb-node-es6-todo-app/blob/master/.gitignore) and thus will _not_ be commited to your git repo in order to protect your DocumentDB and Application Insights keys.
***
The project also contains a basic Dockerfile to get you started to build a containerized version of this app. Just follow [these instructions](https://hub.docker.com/_/node/), and don't forget to supply HOST, APP_KEY, and APPINSIGHTS_INSTRUMENTATIONKEY as environment. You can reuse the aforementioned `.env` file for this purpose by adding `--env-file .env` as parameter to `docker run`, e.g. `docker run -d -p 3000:3000 --env-file .env
--name "todo-app" <image-name>` (replace the host port or container name as desired). 
***
A prebuilt Docker image of this app is available on [Docker Hub](https://hub.docker.com/r/joergjo/documentdb-node-es6-todo-app/). This
 image is built automatically from this repository, so if you run it, make sure to pass your DocumentDB and Application Insight settings 
 as environment (see above), or map a volume containing an `.env` file.