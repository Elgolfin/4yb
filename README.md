[![CircleCI](https://circleci.com/gh/Elgolfin/4yb/tree/master.svg?style=svg)](https://circleci.com/gh/Elgolfin/4yb/tree/master)
[![Dependency Status](https://david-dm.org/elgolfin/4yb.svg)](https://david-dm.org/elgolfin/4yb)
[![devDependency Status](https://david-dm.org/elgolfin/4yb/dev-status.svg)](https://david-dm.org/elgolfin/4yb#info=devDependencies)

# 4yb

## Developement environment setup

- git clone https://github.com/Elgolfin/4yb.git
- Install electron-prebuilt globally (npm install -g electron-prebuilt)
- npm install
- Run the app (electron .)

## Package

- npm install electron-packager -g
- electron-packager . 4YB --platform=win32 --arch=x64 --version=0.36.0
- http://www.jrsoftware.org/isdl.php (to build a single setup exe file)

To to:
- http://blog.atom.io/2015/11/05/electron-updates-mac-app-store-and-windows-auto-updater.html
- Explore https://github.com/Squirrel/Squirrel.Windows

## Running the app
- cd ~/4yb
- electron main.js

Or
- Run the 4YB exe if you installed from the package

## Running the app
- npm test

Or
- mocha -w

## Links

https://www.iconfinder.com/iconsets/finance-10
