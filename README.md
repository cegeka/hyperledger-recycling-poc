# composer-startup-poc

This template is meant as a quick-start for Hyperldger composer projects. It contains a basic backend (`server`) built on top of the standard `composer-rest-server` npm package with additional scripts to build & deploy the composer network, a quickstart front-end application (`client`) with basic user management & transaction monitoring.

The projects containts a fully self-contained Docker-compose deployment environment that can be used for production servers. For setting up a development environment, see the section below in this document.

## Customize Hyperledger composer quickstart template

### Customize project name

Replace the hyperpoc name in both `server\package.json` and in the `docker\fabric-orchestrator\entrypoint.sh` file. The project name is used to generate the Hyperledger fabric chaincode containers which are automatically destroyed at each application setup. Changing this from the default will ensure other fabric containers are not affected.

### Add the Hyperledger composer code

The following Hyperledger composer files must be updated with the proper business definition:

- Data model: `server/models/com.cegeka.cto`
- Access control rules: `server/permissions.acl`
- Transaction logic: `server/lib/logic.js`
- Named Queries: `server/queries.qry`

### Change composer data initialization script

The script in `server/setup/setup.js` is meant to be ran after the composer network is started. It will create all pre-registed composer entities, like user accounts & initial assets.
Customize the javascript file to create all entities by calling the appropriate REST endpoints.

### Customize Frontend application

When customizing the frontend application, you can start from the following list:

- Add a custom application logo in file `client/src/styles.css` (class banner.background)
- Edit the `UserRole` enum in `client/src/app/services/user.service.ts` and add the roles used by the application. The string value of the role must match the Hyperledger Composer object name in the DTO. Also edit the `getUserRole()` method to infer the role based on user names, or replace with a different mechanism
- Create any needed home pages for the new roles and add them to the routes list (`client/src/app.routes.rs`) and modules list (`client/src/app/app.modules.ts`)
- Alter the way login redirects work, based on user roles. Change the method `login()` in the `client/src/app/pages/login/login.components.ts` class to perform redirect to the correct user-role specific routes
- Add a new service for each Composer object specified in the DTO (except for obejcts that represent user identities) by extending the BaseResourceService class (take a look at `client/src/app/services/user.service.ts` and  `client/src/app/services/history.service.ts`). Register these services in the `client/src/app/app.modules.ts` class.
- Implement custom transaction monitoring. The `client/src/app/pages/tx-detail/tx-detail.component.ts` class is used to display details about specific transactions. This class (and the underlying `history.service.ts` file) can be customized to retrieve additional bussiness information for specific transaction types and present this to the user.

## Setup development environment

The development environment is based on the production environment. All prerequisites are bundled in the Docker composer project from the `docker` folder. The backend will still run inside the docker container, as the composer-cli framework doesn't offer any means of JS debugging when ran on the local machine anyway. The frontend application can be started outside of the docker composer project and debugged locally.

1. Start the production docker-compose by following the instructions in the `docker` folder to start a complete Hyperledger fabric network, build the composer .bna file and deploy it onto the network

2. Install the frontend application dependencies.

```
cd frontend
npm install
```
3. Start the frontend application development server. By default it will connect to http://localhost:3000 for the backend service, which is bound to the docker container 'hyper-backend'.

```
ng serve
```
