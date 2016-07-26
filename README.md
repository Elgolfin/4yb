[![CircleCI](https://circleci.com/gh/Elgolfin/electron-vue-boilerplate/tree/master.svg?style=shield)](https://circleci.com/gh/Elgolfin/electron-vue-boilerplate/tree/master)
[![codecov](https://codecov.io/gh/Elgolfin/electron-vue-boilerplate/branch/master/graph/badge.svg)](https://codecov.io/gh/Elgolfin/electron-vue-boilerplate)

[![Dependency Status](https://david-dm.org/elgolfin/electron-vue-boilerplate.svg)](https://david-dm.org/elgolfin/electron-vue-boilerplate)
[![devDependency Status](https://david-dm.org/elgolfin/electron-vue-boilerplate/dev-status.svg)](https://david-dm.org/elgolfin/electron-vue-boilerplate#info=devDependencies)

# electron-vue-boilerplate

Based on https://github.com/bradstewart/electron-boilerplate-vue/

## Development environment setup

- git clone https://github.com/Elgolfin/electron-vue-boilerplate.git
- Install electron-prebuilt globally (npm install -g electron-prebuilt; Visual Studio must be install; Python 2.x also)
- npm install
- npm start

## Package (To be reviewed)

- npm install electron-packager -g
- electron-packager . 4YB --platform=win32 --arch=x64 --version=0.36.0
- http://www.jrsoftware.org/isdl.php (to build a single setup exe file)

To to:
- http://blog.atom.io/2015/11/05/electron-updates-mac-app-store-and-windows-auto-updater.html
- Explore https://github.com/Squirrel/Squirrel.Windows

## Running the app
- npm start

## Testing the app
- npm test (Run the unit tests only)
- npm run all (Run the unit tests + the 2e2 tests)
- npm run unitlive (Run the unit tests in real time)


## Links

