# Brian's Blog

### Building and Deploying

First, build the app by having Sapper export the static site:

```bash
npm run export
```

Copy files to s3 bucket using the `aws` CLI. Remember to replace with the
correct aws `profile_name`. (This assumes that aws credentials are correctly
set up in `~/.aws/config` and `~/.aws/credentials`

```bash
aws --profile <profile_name> s3 sync __sapper__/export s3://development.saylerb.com
```

### Running the project locally

However you get the code, you can install dependencies and run the project in
development mode with:

```bash
cd my-app
npm install # or yarn
npm run dev
```

Open up [localhost:3000](http://localhost:3000) and start clicking around.

