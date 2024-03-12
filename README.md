# Lucidnote RESTFUL API

---
Lucidnote RESTFUL API is a TypeScript-based RESTful API rewrite of a note-taking application's codebase, aiming for improved maintainability through static typing, enhanced code quality, and a modern development experience for future growth.

---
## Getting Started

---
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
### Prerequisites
- Node JS installed
- MySQL/MariaDB installed
### Installing
1. Install all dependencies with this command:
```shell
npm install
```
2. Create env file that contains database url in the format of:
```json
DATABASE_URL="mysql://db_username:db_password@host:port/lucidnote"
```
3. Run prisma migration:
```shell
npx prisma migrate dev
npx prisma generate
```
## Build With

<img src="https://cdn.worldvectorlogo.com/logos/prisma-2.svg" height="32">
<img src="https://miro.medium.com/v2/resize:fit:873/1*INbde3qJbLHW7Y1nzgY_9g.png" height="32">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/2048px-Typescript_logo_2020.svg.png" height="32">

___
- [ExpressJS](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Winston](https://github.com/winstonjs/winston)
- [Prisma](https://www.prisma.io/)