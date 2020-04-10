/*
   Copyright 2020 AryToNeX

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
'use strict';

const Glasscord = require('./glasscord.js');
const electron = require('electron');
const path = require('path');

// Require our version checker
require('./version_check.js')();

/*
 * The BrowserWindow override class
 * This is the core of Glasscord.
 */
class BrowserWindow extends electron.BrowserWindow {
	constructor(originalOptions) {
		if(process.platform != 'win32') originalOptions.transparent = true;
		originalOptions.backgroundColor = '#00000000'; 
		super(originalOptions);
		new Glasscord(this);
	}

	/**
	 * Let's stub setBackgroundColor because it's way too buggy. Use the CSS 'body' selector instead.
	 */
	setBackgroundColor(backgroundColor){
		return;
	}
}

// from EnhancedDiscord -- thanks folks!
const electron_path = require.resolve('electron');
Object.assign(BrowserWindow, electron.BrowserWindow); // Assigns the new chrome-specific ones
if (electron.deprecate && electron.deprecate.promisify) {
	const originalDeprecate = electron.deprecate.promisify; // Grab original deprecate promisify
	electron.deprecate.promisify = (originalFunction) => originalFunction ? originalDeprecate(originalFunction) : () => void 0; // Override with falsey check
}
const newElectron = Object.assign({}, electron, {BrowserWindow});
delete require.cache[electron_path].exports;
require.cache[electron_path].exports = newElectron;
