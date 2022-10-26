<div align="center">

# **WorknMates**

### **Creating a more decentralized world by allowing people to work anywhere.**

</div>

<br />

![Atomic Design Scaffolding](https://worknmates.com/static/media/Logo.ee9aeb0f.png)

<br />

## **Repos:**
#### Web App:
- Writen in React.Js
- Yarn as package manager
- [Link](https://github.com/AI-CORE-dev/cohowerks-web)

#### Admin Panel:
- Writen in React.Js
- Yarn as package manager
- [Link](https://github.com/AI-CORE-dev/cohowerks-admin)

#### Mobile App:
- Writen in React Native
- Yarn as package manager
- [Link](https://github.com/AI-CORE-dev/cohowerks-app)

#### Backend:
- Writen in Nest.Js
- SQL Database
- NPM as package manager
- [Link](https://github.com/AI-CORE-dev/cohowerks)

# Enviroments
Each enviroment has it's own DDBB.

- Performance ([Web](https://performance.worknmates.com/) / [Admin](https://performance.admin.worknmates.com/))
- Client ([Web](https://client.worknmates.com/) / [Admin](https://client.admin.worknmates.com/))
- **Production** ([Web](https://worknmates.com/) / [Admin](https://admin.worknmates.com/))

**Performance**  is a development enviroment. It has the most recent changes and features. You may test and/or break anything you want here!

**Client** is an enviroment that is closer to production, so we try to keep things organized here.

**Production** is production!

# Deploys & Hosting
### **Backend**:
**Performance** is deployed from the `dev` branch via Continous Deploy.
Every push to the `dev` branch will result in a new version being deployed automatically.
Performance is hosted on Heroku.

**Client** is deployed from the `mainline` branch manually.
Once the features on Performance pass the QA stage, they get deployed manually to this enviroment.
Client is also hosted on Heroku.

**Production** is deployed from the `master` branch manually.

### **Frontend**:
**Performance** is deployed from the `dev`  branch manually.

**Client** is deployed from the `mainline` branch manually.

**Production** is deployed from the `master` branch manually.

(both the Admin Panel and the Web App are currently hosted on AWS)

# Node.Js versions
In order to manage Node versions for the different projects/repos you may need to use **[NVM](https://github.com/nvm-sh/nvm)**.

The web app, the admin panel and the backend uses Node `v13.12.1`
The mobile app uses Node `v14.17.4`

To start up a project, you need to install the dependencies and run the start command with the proper Node Version.

# Initial setup
First of all, check your Node version with `node --v`.
If the output of the command is `12.13.1`, you are OK to proceed.
If not, run `nvm install 12.13.1` to install and set that version as default.

**[NVM Docs](https://github.com/nvm-sh/nvm)**

- ### **Frontend repos:**
You may notice that the Frontend repos comes with some `.env` files. Each one corresponds to the backend enviroment you want to aim the requests to.
These files also contains some keys that needs to match with the backend you are trying to hit, so make sure you dont mix them.

In each repo's `package.json` you will find the yarn command to run the project in an specific enviroment.

Then:

   - Clone the repos.
   - Run `yarn` to install dependencies.
   - Run `yarn start`  to start the project hitting Performance's backend.
   - Run `yarn start:[enviroment]`  to start the project on an specific enviroment.

There you go!

- ### **Backend projects:**
In order to start up the backend, you need to create a `.env` file that will contain your custom env variables. You can copy the content of the `.env.development` file and paste it into the file you just created. The `.env` is ignored by git, so you can modify it to match the needs of the feature you are working on or the bug you are fixing. You will get familiar with it in a couple days!

As stated before, the backend is written in Nest.Js syntax. The Nest.js framework uses NPM by default, so the backend's dependencies are NOT handled by yarn, but by NPM.

Nest.Js + SQL setup comes with [typeORM](https://typeorm.io/), an object–relational mapping tool. If you've worked with nonSQL DDBBs in the past you may be familiar with [Mongoose](https://mongoosejs.com/). Both tools are pretty much the same. If not, dont worry!

The backend is auto-documented with [Swagger](https://swagger.io/).  You can see all the endpoints (and also make requests) from the Swagger UI.

The url is https://worknmates-api-performance.herokuapp.com/api/.
You will also have a local Swagger instance running when you start up the backend. The url will be: http://localhost:3000/api/.

To start up the backend:
- Run `npm i`
- Then, run `npm run start:dev`

There you go! Now you got the backend running locally and hitting Performance's DDBB.

From time to time you might need to have a local DDBB. You will need to use [DBeaver](https://dbeaver.io/) to clone and start up a local instance of a remote DDBB. Ask anyone in the team for help with it! We are glad to help.

# Conventions
We are currently trying to keep the development process as professional as possible. In that order, we need to follow certain conventions regarding, most of all, naming (branches, commits, migrations, files, components, etc)

- ### Branches:
We currently work with [feature branching](https://martinfowler.com/bliki/FeatureBranch.html), so, naming the branches clearly it's key.

- For the branch name to be clear, it is recommended to name it following this pattern:
  *branchType*/feature-name

	So, for example, a branch for a new feature should be named like:
	  **feature/the_name_of_the_feature**

	A branch for fixing a production bug should be named like:
	  **hotfix/bug_key_indicator**

- ### Commits:
	- Try to use imperative mood for the commit message. Think of what the commit will do and name it like so.
		For example:

		**Fix getCurrYearBudget function**

		**Add users total count endpoint**

		**Remove unused code**
	- More info about commit naming [here](https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/).

- ### Migrations:
Migrations are *controlled sets of changes developed to modify the structure of the objects within a [relational database](https://www.prisma.io/dataguide/intro/database-glossary#relational-database).* Migrations are generated manually (with a command) when an entity is changed.

Migrations needs to be named clearly in order, since they are key to our development proccess.
You can name them same way as you would name a commit.

For example, good names for migrations are:

- **Add employee minimum colum in subscription budget**

- **Add X colum in N entity**

- **Modify monthly bookings by space type view**

You can find previous migrations in `src/migrations` (on the backend).

- ### Files and Scaffolding:
You will find that the Web App repo is pretty unorganized. It is a gigantic codebase, so there is little to standarize there.

The **Admin Panel** repo is relatively small, so we are heading it towards the [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) scaffolding.

The **Mobile App** started from scratch with [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) in mind. If you are in doubt where to create a component, you may look up there.

The **Backend** is perfectly organized and structured. You will find it easy to dive in.

- ### Releases channel:
We use this channel to keep the team updated about bugs fixed and the features and that are deployed on the different enviroments.

The format of the message should be something like:

***[ENVIROMENT]*** ***[FEATURE  | BUG | OPS]*** ***[WEB / ADMIN / BACK]***

***Key indicator of what was deployed***

**And if you consider it pertinent, a small description of what was deployed**

<br />

For example:

**[*PERFORMANCE*]** **[*FEATURE*]** **[WEB]**

**Primera versión de modelo de suscripción, incluye X y N.**

<br />

**[*PERFORMANCE*]** **[*FEATURE*]** **[ADMIN]**

**Versión actualizada de panel KPIs**

<br />

**[*PERFORMANCE*]** **[*BUG*]** **[BACK]**

**Fix devolución de créditos en split**

<br />

**[*CLIENT*]**

**Deployado en web y back features de performance aprobadas por QA**

<br />

**[*PRODUCCIÓN*]**

**Release n.n.n:**

**Modelo de suscripción fase 1**

<br />

# Disclaimer:
The conventions and patterns described here are not written in stone, everything is open to discussion, change and improvements. Feel free to bring things to the table!

We hope you will find this documentation useful. If there's any doubt, send a message to anyone in the team. We are all happy to help.

Hope you enjoy your journey at AiCore - WorknMates!
<br />
<br />
<br />
<br />
<br />

<div align="left">
	Irungaray, 31/08/2022 - 22:00hs
</div>
