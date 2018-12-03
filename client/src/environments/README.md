# Info on environments configuration

The 2 defined environments are:

* development (default) - `environment.ts`
* production (prod) - `environment.prod.ts`

The environment.prod.ts file generated inside the frontend Dockerfile by running envsubst on the environment.prod-template.ts file. For running a production-like nginx setup on the local dev. machine, create the environment.prod.ts file and fill in the appropriate values.
