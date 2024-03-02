# lr_rest_books_node

Example project: RESTful API implemented with Express in Node.js.

See [project tutorial](https://www.literank.com/project/15/intro) here.

This project presents a thorough walkthrough for constructing a RESTful API utilizing the Express web framework within Node.js.

In the initial phase, you'll receive guidance on configuring the development environment and establishing the project's objectives.

The development stage is divided into several segments, encompassing the creation of an initial API version, integration of health endpoints, definition of data models, establishment of routes, implementation of a 4-layer architecture, configuration of databases such as MySQL and MongoDB, integration of caching with Redis, incorporation of pagination and search capabilities, and finally, incorporation of authentication mechanisms.

Subsequently, the deployment phase addresses multiple deployment possibilities, including standalone deployment, configuring a reverse proxy using Nginx, and deploying the application utilizing Docker and Docker Compose.

In summary, this project tutorial presents a systematic approach to constructing a resilient RESTful API using Express, covering crucial elements from development to deployment.

## Build

```bash
npm run build
```

## Run in Docker Compose

Create `compose/.env` file:

```bash
REDIS_PASSWORD=your_pass
MYSQL_PASSWORD=your_pass
MYSQL_ROOT_PASSWORD=your_root_pass
```

Run it:

```bash
cd compose
docker compose up
```

See [project tutorial](https://www.literank.com/project/15/intro) here.
