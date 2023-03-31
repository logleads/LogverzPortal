
## Installation

Use the package manager [npm](https://www.npmjs.com/) to install foobar.

```bash
npm install
```

## Run

```bash
npm run start
```

## eslint
```bash
npm run lint
```

## Build

```bash
npm run build
```

## Deploy
For deploy app:
  1. run app
  2. run eslint
  3. build app
  4. delete old bandle in [S3] (s3://Logverz-logicbucket-iwc74fxi23ar/ui/)
  5. upload new bandle to [S3] (s3://Logverz-logicbucket-iwc74fxi23ar/ui/)
  6. go to [website](https://iimw521s71.execute-api.ap-southeast-2.amazonaws.com/V3/HTTP/S3/LB/ui/index.html) 