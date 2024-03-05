# Lucidnote RESTFUL API

## Installation
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
