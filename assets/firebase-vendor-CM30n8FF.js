import { n as __exportAll } from "./rolldown-runtime-BZ_oHznj.js";
//#region node_modules/@firebase/util/dist/postinstall.mjs
var getDefaultsFromPostinstall = () => void 0;
//#endregion
//#region node_modules/@firebase/util/dist/index.esm.js
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var stringToByteArray$1 = function(str) {
	const out = [];
	let p = 0;
	for (let i = 0; i < str.length; i++) {
		let c = str.charCodeAt(i);
		if (c < 128) out[p++] = c;
		else if (c < 2048) {
			out[p++] = c >> 6 | 192;
			out[p++] = c & 63 | 128;
		} else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
			c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
			out[p++] = c >> 18 | 240;
			out[p++] = c >> 12 & 63 | 128;
			out[p++] = c >> 6 & 63 | 128;
			out[p++] = c & 63 | 128;
		} else {
			out[p++] = c >> 12 | 224;
			out[p++] = c >> 6 & 63 | 128;
			out[p++] = c & 63 | 128;
		}
	}
	return out;
};
/**
* Turns an array of numbers into the string given by the concatenation of the
* characters to which the numbers correspond.
* @param bytes Array of numbers representing characters.
* @return Stringification of the array.
*/
var byteArrayToString = function(bytes) {
	const out = [];
	let pos = 0, c = 0;
	while (pos < bytes.length) {
		const c1 = bytes[pos++];
		if (c1 < 128) out[c++] = String.fromCharCode(c1);
		else if (c1 > 191 && c1 < 224) {
			const c2 = bytes[pos++];
			out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
		} else if (c1 > 239 && c1 < 365) {
			const c2 = bytes[pos++];
			const c3 = bytes[pos++];
			const c4 = bytes[pos++];
			const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
			out[c++] = String.fromCharCode(55296 + (u >> 10));
			out[c++] = String.fromCharCode(56320 + (u & 1023));
		} else {
			const c2 = bytes[pos++];
			const c3 = bytes[pos++];
			out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
		}
	}
	return out.join("");
};
var base64 = {
	/**
	* Maps bytes to characters.
	*/
	byteToCharMap_: null,
	/**
	* Maps characters to bytes.
	*/
	charToByteMap_: null,
	/**
	* Maps bytes to websafe characters.
	* @private
	*/
	byteToCharMapWebSafe_: null,
	/**
	* Maps websafe characters to bytes.
	* @private
	*/
	charToByteMapWebSafe_: null,
	/**
	* Our default alphabet, shared between
	* ENCODED_VALS and ENCODED_VALS_WEBSAFE
	*/
	ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
	/**
	* Our default alphabet. Value 64 (=) is special; it means "nothing."
	*/
	get ENCODED_VALS() {
		return this.ENCODED_VALS_BASE + "+/=";
	},
	/**
	* Our websafe alphabet.
	*/
	get ENCODED_VALS_WEBSAFE() {
		return this.ENCODED_VALS_BASE + "-_.";
	},
	/**
	* Whether this browser supports the atob and btoa functions. This extension
	* started at Mozilla but is now implemented by many browsers. We use the
	* ASSUME_* variables to avoid pulling in the full useragent detection library
	* but still allowing the standard per-browser compilations.
	*
	*/
	HAS_NATIVE_SUPPORT: typeof atob === "function",
	/**
	* Base64-encode an array of bytes.
	*
	* @param input An array of bytes (numbers with
	*     value in [0, 255]) to encode.
	* @param webSafe Boolean indicating we should use the
	*     alternative alphabet.
	* @return The base64 encoded string.
	*/
	encodeByteArray(input, webSafe) {
		if (!Array.isArray(input)) throw Error("encodeByteArray takes an array as a parameter");
		this.init_();
		const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
		const output = [];
		for (let i = 0; i < input.length; i += 3) {
			const byte1 = input[i];
			const haveByte2 = i + 1 < input.length;
			const byte2 = haveByte2 ? input[i + 1] : 0;
			const haveByte3 = i + 2 < input.length;
			const byte3 = haveByte3 ? input[i + 2] : 0;
			const outByte1 = byte1 >> 2;
			const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
			let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
			let outByte4 = byte3 & 63;
			if (!haveByte3) {
				outByte4 = 64;
				if (!haveByte2) outByte3 = 64;
			}
			output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
		}
		return output.join("");
	},
	/**
	* Base64-encode a string.
	*
	* @param input A string to encode.
	* @param webSafe If true, we should use the
	*     alternative alphabet.
	* @return The base64 encoded string.
	*/
	encodeString(input, webSafe) {
		if (this.HAS_NATIVE_SUPPORT && !webSafe) return btoa(input);
		return this.encodeByteArray(stringToByteArray$1(input), webSafe);
	},
	/**
	* Base64-decode a string.
	*
	* @param input to decode.
	* @param webSafe True if we should use the
	*     alternative alphabet.
	* @return string representing the decoded value.
	*/
	decodeString(input, webSafe) {
		if (this.HAS_NATIVE_SUPPORT && !webSafe) return atob(input);
		return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
	},
	/**
	* Base64-decode a string.
	*
	* In base-64 decoding, groups of four characters are converted into three
	* bytes.  If the encoder did not apply padding, the input length may not
	* be a multiple of 4.
	*
	* In this case, the last group will have fewer than 4 characters, and
	* padding will be inferred.  If the group has one or two characters, it decodes
	* to one byte.  If the group has three characters, it decodes to two bytes.
	*
	* @param input Input to decode.
	* @param webSafe True if we should use the web-safe alphabet.
	* @return bytes representing the decoded value.
	*/
	decodeStringToByteArray(input, webSafe) {
		this.init_();
		const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
		const output = [];
		for (let i = 0; i < input.length;) {
			const byte1 = charToByteMap[input.charAt(i++)];
			const byte2 = i < input.length ? charToByteMap[input.charAt(i)] : 0;
			++i;
			const byte3 = i < input.length ? charToByteMap[input.charAt(i)] : 64;
			++i;
			const byte4 = i < input.length ? charToByteMap[input.charAt(i)] : 64;
			++i;
			if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) throw new DecodeBase64StringError();
			const outByte1 = byte1 << 2 | byte2 >> 4;
			output.push(outByte1);
			if (byte3 !== 64) {
				const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
				output.push(outByte2);
				if (byte4 !== 64) {
					const outByte3 = byte3 << 6 & 192 | byte4;
					output.push(outByte3);
				}
			}
		}
		return output;
	},
	/**
	* Lazy static initialization function. Called before
	* accessing any of the static map variables.
	* @private
	*/
	init_() {
		if (!this.byteToCharMap_) {
			this.byteToCharMap_ = {};
			this.charToByteMap_ = {};
			this.byteToCharMapWebSafe_ = {};
			this.charToByteMapWebSafe_ = {};
			for (let i = 0; i < this.ENCODED_VALS.length; i++) {
				this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
				this.charToByteMap_[this.byteToCharMap_[i]] = i;
				this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
				this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
				if (i >= this.ENCODED_VALS_BASE.length) {
					this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
					this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
				}
			}
		}
	}
};
/**
* An error encountered while decoding base64 string.
*/
var DecodeBase64StringError = class extends Error {
	constructor() {
		super(...arguments);
		this.name = "DecodeBase64StringError";
	}
};
/**
* URL-safe base64 encoding
*/
var base64Encode = function(str) {
	const utf8Bytes = stringToByteArray$1(str);
	return base64.encodeByteArray(utf8Bytes, true);
};
/**
* URL-safe base64 encoding (without "." padding in the end).
* e.g. Used in JSON Web Token (JWT) parts.
*/
var base64urlEncodeWithoutPadding = function(str) {
	return base64Encode(str).replace(/\./g, "");
};
/**
* URL-safe base64 decoding
*
* NOTE: DO NOT use the global atob() function - it does NOT support the
* base64Url variant encoding.
*
* @param str To be decoded
* @return Decoded result, if possible
*/
var base64Decode = function(str) {
	try {
		return base64.decodeString(str, true);
	} catch (e) {
		console.error("base64Decode failed: ", e);
	}
	return null;
};
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Polyfill for `globalThis` object.
* @returns the `globalThis` object for the given environment.
* @public
*/
function getGlobal() {
	if (typeof self !== "undefined") return self;
	if (typeof window !== "undefined") return window;
	if (typeof global !== "undefined") return global;
	throw new Error("Unable to locate global object.");
}
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var getDefaultsFromGlobal = () => getGlobal().__FIREBASE_DEFAULTS__;
/**
* Attempt to read defaults from a JSON string provided to
* process(.)env(.)__FIREBASE_DEFAULTS__ or a JSON file whose path is in
* process(.)env(.)__FIREBASE_DEFAULTS_PATH__
* The dots are in parens because certain compilers (Vite?) cannot
* handle seeing that variable in comments.
* See https://github.com/firebase/firebase-js-sdk/issues/6838
*/
var getDefaultsFromEnvVariable = () => {
	if (typeof process === "undefined" || false) return;
	const defaultsJsonString = {}.__FIREBASE_DEFAULTS__;
	if (defaultsJsonString) return JSON.parse(defaultsJsonString);
};
var getDefaultsFromCookie = () => {
	if (typeof document === "undefined") return;
	let match;
	try {
		match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
	} catch (e) {
		return;
	}
	const decoded = match && base64Decode(match[1]);
	return decoded && JSON.parse(decoded);
};
/**
* Get the __FIREBASE_DEFAULTS__ object. It checks in order:
* (1) if such an object exists as a property of `globalThis`
* (2) if such an object was provided on a shell environment variable
* (3) if such an object exists in a cookie
* @public
*/
var getDefaults = () => {
	try {
		return getDefaultsFromPostinstall() || getDefaultsFromGlobal() || getDefaultsFromEnvVariable() || getDefaultsFromCookie();
	} catch (e) {
		/**
		* Catch-all for being unable to get __FIREBASE_DEFAULTS__ due
		* to any environment case we have not accounted for. Log to
		* info instead of swallowing so we can find these unknown cases
		* and add paths for them if needed.
		*/
		console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
		return;
	}
};
/**
* Returns emulator host stored in the __FIREBASE_DEFAULTS__ object
* for the given product.
* @returns a URL host formatted like `127.0.0.1:9999` or `[::1]:4000` if available
* @public
*/
var getDefaultEmulatorHost = (productName) => getDefaults()?.emulatorHosts?.[productName];
/**
* Returns emulator hostname and port stored in the __FIREBASE_DEFAULTS__ object
* for the given product.
* @returns a pair of hostname and port like `["::1", 4000]` if available
* @public
*/
var getDefaultEmulatorHostnameAndPort = (productName) => {
	const host = getDefaultEmulatorHost(productName);
	if (!host) return;
	const separatorIndex = host.lastIndexOf(":");
	if (separatorIndex <= 0 || separatorIndex + 1 === host.length) throw new Error(`Invalid host ${host} with no separate hostname and port!`);
	const port = parseInt(host.substring(separatorIndex + 1), 10);
	if (host[0] === "[") return [host.substring(1, separatorIndex - 1), port];
	else return [host.substring(0, separatorIndex), port];
};
/**
* Returns Firebase app config stored in the __FIREBASE_DEFAULTS__ object.
* @public
*/
var getDefaultAppConfig = () => getDefaults()?.config;
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Deferred = class {
	constructor() {
		this.reject = () => {};
		this.resolve = () => {};
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}
	/**
	* Our API internals are not promisified and cannot because our callback APIs have subtle expectations around
	* invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
	* and returns a node-style callback which will resolve or reject the Deferred's promise.
	*/
	wrapCallback(callback) {
		return (error, value) => {
			if (error) this.reject(error);
			else this.resolve(value);
			if (typeof callback === "function") {
				this.promise.catch(() => {});
				if (callback.length === 1) callback(error);
				else callback(error, value);
			}
		};
	}
};
/**
* @license
* Copyright 2021 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function createMockUserToken(token, projectId) {
	if (token.uid) throw new Error("The \"uid\" field is no longer supported by mockUserToken. Please use \"sub\" instead for Firebase Auth User ID.");
	const header = {
		alg: "none",
		type: "JWT"
	};
	const project = projectId || "demo-project";
	const iat = token.iat || 0;
	const sub = token.sub || token.user_id;
	if (!sub) throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
	const payload = {
		iss: `https://securetoken.google.com/${project}`,
		aud: project,
		iat,
		exp: iat + 3600,
		auth_time: iat,
		sub,
		user_id: sub,
		firebase: {
			sign_in_provider: "custom",
			identities: {}
		},
		...token
	};
	return [
		base64urlEncodeWithoutPadding(JSON.stringify(header)),
		base64urlEncodeWithoutPadding(JSON.stringify(payload)),
		""
	].join(".");
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Returns navigator.userAgent string or '' if it's not defined.
* @return user agent string
*/
function getUA() {
	if (typeof navigator !== "undefined" && typeof navigator["userAgent"] === "string") return navigator["userAgent"];
	else return "";
}
/**
* Detect Node.js.
*
* @return true if Node.js environment is detected or specified.
*/
function isNode() {
	const forceEnvironment = getDefaults()?.forceEnvironment;
	if (forceEnvironment === "node") return true;
	else if (forceEnvironment === "browser") return false;
	try {
		return Object.prototype.toString.call(global.process) === "[object process]";
	} catch (e) {
		return false;
	}
}
/** Returns true if we are running in Safari. */
function isSafari() {
	return !isNode() && !!navigator.userAgent && navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome");
}
/**
* This method checks if indexedDB is supported by current browser/service worker context
* @return true if indexedDB is supported by current browser/service worker context
*/
function isIndexedDBAvailable() {
	try {
		return typeof indexedDB === "object";
	} catch (e) {
		return false;
	}
}
/**
* This method validates browser/sw context for indexedDB by opening a dummy indexedDB database and reject
* if errors occur during the database open operation.
*
* @throws exception if current browser/sw context can't run idb.open (ex: Safari iframe, Firefox
* private browsing)
*/
function validateIndexedDBOpenable() {
	return new Promise((resolve, reject) => {
		try {
			let preExist = true;
			const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
			const request = self.indexedDB.open(DB_CHECK_NAME);
			request.onsuccess = () => {
				request.result.close();
				if (!preExist) self.indexedDB.deleteDatabase(DB_CHECK_NAME);
				resolve(true);
			};
			request.onupgradeneeded = () => {
				preExist = false;
			};
			request.onerror = () => {
				reject(request.error?.message || "");
			};
		} catch (error) {
			reject(error);
		}
	});
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @fileoverview Standardized Firebase Error.
*
* Usage:
*
*   // TypeScript string literals for type-safe codes
*   type Err =
*     'unknown' |
*     'object-not-found'
*     ;
*
*   // Closure enum for type-safe error codes
*   // at-enum {string}
*   var Err = {
*     UNKNOWN: 'unknown',
*     OBJECT_NOT_FOUND: 'object-not-found',
*   }
*
*   let errors: Map<Err, string> = {
*     'generic-error': "Unknown error",
*     'file-not-found': "Could not find file: {$file}",
*   };
*
*   // Type-safe function - must pass a valid error code as param.
*   let error = new ErrorFactory<Err>('service', 'Service', errors);
*
*   ...
*   throw error.create(Err.GENERIC);
*   ...
*   throw error.create(Err.FILE_NOT_FOUND, {'file': fileName});
*   ...
*   // Service: Could not file file: foo.txt (service/file-not-found).
*
*   catch (e) {
*     assert(e.message === "Could not find file: foo.txt.");
*     if ((e as FirebaseError)?.code === 'service/file-not-found') {
*       console.log("Could not read file: " + e['file']);
*     }
*   }
*/
var ERROR_NAME = "FirebaseError";
var FirebaseError = class FirebaseError extends Error {
	constructor(code, message, customData) {
		super(message);
		this.code = code;
		this.customData = customData;
		/** The custom name for all FirebaseErrors. */
		this.name = ERROR_NAME;
		Object.setPrototypeOf(this, FirebaseError.prototype);
		if (Error.captureStackTrace) Error.captureStackTrace(this, ErrorFactory.prototype.create);
	}
};
var ErrorFactory = class {
	constructor(service, serviceName, errors) {
		this.service = service;
		this.serviceName = serviceName;
		this.errors = errors;
	}
	create(code, ...data) {
		const customData = data[0] || {};
		const fullCode = `${this.service}/${code}`;
		const template = this.errors[code];
		const message = template ? replaceTemplate(template, customData) : "Error";
		return new FirebaseError(fullCode, `${this.serviceName}: ${message} (${fullCode}).`, customData);
	}
};
function replaceTemplate(template, data) {
	return template.replace(PATTERN, (_, key) => {
		const value = data[key];
		return value != null ? String(value) : `<${key}?>`;
	});
}
var PATTERN = /\{\$([^}]+)}/g;
/**
* Deep equal two objects. Support Arrays and Objects.
*/
function deepEqual(a, b) {
	if (a === b) return true;
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);
	for (const k of aKeys) {
		if (!bKeys.includes(k)) return false;
		const aProp = a[k];
		const bProp = b[k];
		if (isObject(aProp) && isObject(bProp)) {
			if (!deepEqual(aProp, bProp)) return false;
		} else if (aProp !== bProp) return false;
	}
	for (const k of bKeys) if (!aKeys.includes(k)) return false;
	return true;
}
function isObject(thing) {
	return thing !== null && typeof thing === "object";
}
/**
* @license
* Copyright 2021 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function getModularInstance(service) {
	if (service && service._delegate) return service._delegate;
	else return service;
}
/**
* @license
* Copyright 2025 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Checks whether host is a cloud workstation or not.
* @public
*/
function isCloudWorkstation(url) {
	try {
		return (url.startsWith("http://") || url.startsWith("https://") ? new URL(url).hostname : url).endsWith(".cloudworkstations.dev");
	} catch {
		return false;
	}
}
/**
* Makes a fetch request to the given server.
* Mostly used for forwarding cookies in Firebase Studio.
* @public
*/
async function pingServer(endpoint) {
	return (await fetch(endpoint, { credentials: "include" })).ok;
}
//#endregion
//#region node_modules/@firebase/component/dist/esm/index.esm.js
/**
* Component for service name T, e.g. `auth`, `auth-internal`
*/
var Component = class {
	/**
	*
	* @param name The public service name, e.g. app, auth, firestore, database
	* @param instanceFactory Service factory responsible for creating the public interface
	* @param type whether the service provided by the component is public or private
	*/
	constructor(name, instanceFactory, type) {
		this.name = name;
		this.instanceFactory = instanceFactory;
		this.type = type;
		this.multipleInstances = false;
		/**
		* Properties to be added to the service namespace
		*/
		this.serviceProps = {};
		this.instantiationMode = "LAZY";
		this.onInstanceCreated = null;
	}
	setInstantiationMode(mode) {
		this.instantiationMode = mode;
		return this;
	}
	setMultipleInstances(multipleInstances) {
		this.multipleInstances = multipleInstances;
		return this;
	}
	setServiceProps(props) {
		this.serviceProps = props;
		return this;
	}
	setInstanceCreatedCallback(callback) {
		this.onInstanceCreated = callback;
		return this;
	}
};
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var DEFAULT_ENTRY_NAME$1 = "[DEFAULT]";
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Provider for instance for service name T, e.g. 'auth', 'auth-internal'
* NameServiceMapping[T] is an alias for the type of the instance
*/
var Provider = class {
	constructor(name, container) {
		this.name = name;
		this.container = container;
		this.component = null;
		this.instances = /* @__PURE__ */ new Map();
		this.instancesDeferred = /* @__PURE__ */ new Map();
		this.instancesOptions = /* @__PURE__ */ new Map();
		this.onInitCallbacks = /* @__PURE__ */ new Map();
	}
	/**
	* @param identifier A provider can provide multiple instances of a service
	* if this.component.multipleInstances is true.
	*/
	get(identifier) {
		const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
		if (!this.instancesDeferred.has(normalizedIdentifier)) {
			const deferred = new Deferred();
			this.instancesDeferred.set(normalizedIdentifier, deferred);
			if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) try {
				const instance = this.getOrInitializeService({ instanceIdentifier: normalizedIdentifier });
				if (instance) deferred.resolve(instance);
			} catch (e) {}
		}
		return this.instancesDeferred.get(normalizedIdentifier).promise;
	}
	getImmediate(options) {
		const normalizedIdentifier = this.normalizeInstanceIdentifier(options?.identifier);
		const optional = options?.optional ?? false;
		if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) try {
			return this.getOrInitializeService({ instanceIdentifier: normalizedIdentifier });
		} catch (e) {
			if (optional) return null;
			else throw e;
		}
		else if (optional) return null;
		else throw Error(`Service ${this.name} is not available`);
	}
	getComponent() {
		return this.component;
	}
	setComponent(component) {
		if (component.name !== this.name) throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
		if (this.component) throw Error(`Component for ${this.name} has already been provided`);
		this.component = component;
		if (!this.shouldAutoInitialize()) return;
		if (isComponentEager(component)) try {
			this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME$1 });
		} catch (e) {}
		for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
			const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
			try {
				const instance = this.getOrInitializeService({ instanceIdentifier: normalizedIdentifier });
				instanceDeferred.resolve(instance);
			} catch (e) {}
		}
	}
	clearInstance(identifier = DEFAULT_ENTRY_NAME$1) {
		this.instancesDeferred.delete(identifier);
		this.instancesOptions.delete(identifier);
		this.instances.delete(identifier);
	}
	async delete() {
		const services = Array.from(this.instances.values());
		await Promise.all([...services.filter((service) => "INTERNAL" in service).map((service) => service.INTERNAL.delete()), ...services.filter((service) => "_delete" in service).map((service) => service._delete())]);
	}
	isComponentSet() {
		return this.component != null;
	}
	isInitialized(identifier = DEFAULT_ENTRY_NAME$1) {
		return this.instances.has(identifier);
	}
	getOptions(identifier = DEFAULT_ENTRY_NAME$1) {
		return this.instancesOptions.get(identifier) || {};
	}
	initialize(opts = {}) {
		const { options = {} } = opts;
		const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
		if (this.isInitialized(normalizedIdentifier)) throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
		if (!this.isComponentSet()) throw Error(`Component ${this.name} has not been registered yet`);
		const instance = this.getOrInitializeService({
			instanceIdentifier: normalizedIdentifier,
			options
		});
		for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) if (normalizedIdentifier === this.normalizeInstanceIdentifier(instanceIdentifier)) instanceDeferred.resolve(instance);
		return instance;
	}
	/**
	*
	* @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
	* The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
	*
	* @param identifier An optional instance identifier
	* @returns a function to unregister the callback
	*/
	onInit(callback, identifier) {
		const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
		const existingCallbacks = this.onInitCallbacks.get(normalizedIdentifier) ?? /* @__PURE__ */ new Set();
		existingCallbacks.add(callback);
		this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
		const existingInstance = this.instances.get(normalizedIdentifier);
		if (existingInstance) callback(existingInstance, normalizedIdentifier);
		return () => {
			existingCallbacks.delete(callback);
		};
	}
	/**
	* Invoke onInit callbacks synchronously
	* @param instance the service instance`
	*/
	invokeOnInitCallbacks(instance, identifier) {
		const callbacks = this.onInitCallbacks.get(identifier);
		if (!callbacks) return;
		for (const callback of callbacks) try {
			callback(instance, identifier);
		} catch {}
	}
	getOrInitializeService({ instanceIdentifier, options = {} }) {
		let instance = this.instances.get(instanceIdentifier);
		if (!instance && this.component) {
			instance = this.component.instanceFactory(this.container, {
				instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
				options
			});
			this.instances.set(instanceIdentifier, instance);
			this.instancesOptions.set(instanceIdentifier, options);
			/**
			* Invoke onInit listeners.
			* Note this.component.onInstanceCreated is different, which is used by the component creator,
			* while onInit listeners are registered by consumers of the provider.
			*/
			this.invokeOnInitCallbacks(instance, instanceIdentifier);
			/**
			* Order is important
			* onInstanceCreated() should be called after this.instances.set(instanceIdentifier, instance); which
			* makes `isInitialized()` return true.
			*/
			if (this.component.onInstanceCreated) try {
				this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
			} catch {}
		}
		return instance || null;
	}
	normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME$1) {
		if (this.component) return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME$1;
		else return identifier;
	}
	shouldAutoInitialize() {
		return !!this.component && this.component.instantiationMode !== "EXPLICIT";
	}
};
function normalizeIdentifierForFactory(identifier) {
	return identifier === DEFAULT_ENTRY_NAME$1 ? void 0 : identifier;
}
function isComponentEager(component) {
	return component.instantiationMode === "EAGER";
}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* ComponentContainer that provides Providers for service name T, e.g. `auth`, `auth-internal`
*/
var ComponentContainer = class {
	constructor(name) {
		this.name = name;
		this.providers = /* @__PURE__ */ new Map();
	}
	/**
	*
	* @param component Component being added
	* @param overwrite When a component with the same name has already been registered,
	* if overwrite is true: overwrite the existing component with the new component and create a new
	* provider with the new component. It can be useful in tests where you want to use different mocks
	* for different tests.
	* if overwrite is false: throw an exception
	*/
	addComponent(component) {
		const provider = this.getProvider(component.name);
		if (provider.isComponentSet()) throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
		provider.setComponent(component);
	}
	addOrOverwriteComponent(component) {
		if (this.getProvider(component.name).isComponentSet()) this.providers.delete(component.name);
		this.addComponent(component);
	}
	/**
	* getProvider provides a type safe interface where it can only be called with a field name
	* present in NameServiceMapping interface.
	*
	* Firebase SDKs providing services should extend NameServiceMapping interface to register
	* themselves.
	*/
	getProvider(name) {
		if (this.providers.has(name)) return this.providers.get(name);
		const provider = new Provider(name, this);
		this.providers.set(name, provider);
		return provider;
	}
	getProviders() {
		return Array.from(this.providers.values());
	}
};
//#endregion
//#region node_modules/@firebase/logger/dist/esm/index.esm.js
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* A container for all of the Logger instances
*/
var instances = [];
/**
* The JS SDK supports 5 log levels and also allows a user the ability to
* silence the logs altogether.
*
* The order is a follows:
* DEBUG < VERBOSE < INFO < WARN < ERROR
*
* All of the log types above the current log level will be captured (i.e. if
* you set the log level to `INFO`, errors will still be logged, but `DEBUG` and
* `VERBOSE` logs will not)
*/
var LogLevel;
(function(LogLevel) {
	LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
	LogLevel[LogLevel["VERBOSE"] = 1] = "VERBOSE";
	LogLevel[LogLevel["INFO"] = 2] = "INFO";
	LogLevel[LogLevel["WARN"] = 3] = "WARN";
	LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
	LogLevel[LogLevel["SILENT"] = 5] = "SILENT";
})(LogLevel || (LogLevel = {}));
var levelStringToEnum = {
	"debug": LogLevel.DEBUG,
	"verbose": LogLevel.VERBOSE,
	"info": LogLevel.INFO,
	"warn": LogLevel.WARN,
	"error": LogLevel.ERROR,
	"silent": LogLevel.SILENT
};
/**
* The default log level
*/
var defaultLogLevel = LogLevel.INFO;
/**
* By default, `console.debug` is not displayed in the developer console (in
* chrome). To avoid forcing users to have to opt-in to these logs twice
* (i.e. once for firebase, and once in the console), we are sending `DEBUG`
* logs to the `console.log` function.
*/
var ConsoleMethod = {
	[LogLevel.DEBUG]: "log",
	[LogLevel.VERBOSE]: "log",
	[LogLevel.INFO]: "info",
	[LogLevel.WARN]: "warn",
	[LogLevel.ERROR]: "error"
};
/**
* The default log handler will forward DEBUG, VERBOSE, INFO, WARN, and ERROR
* messages on to their corresponding console counterparts (if the log method
* is supported by the current log level)
*/
var defaultLogHandler = (instance, logType, ...args) => {
	if (logType < instance.logLevel) return;
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const method = ConsoleMethod[logType];
	if (method) console[method](`[${now}]  ${instance.name}:`, ...args);
	else throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
};
var Logger = class {
	/**
	* Gives you an instance of a Logger to capture messages according to
	* Firebase's logging scheme.
	*
	* @param name The name that the logs will be associated with
	*/
	constructor(name) {
		this.name = name;
		/**
		* The log level of the given Logger instance.
		*/
		this._logLevel = defaultLogLevel;
		/**
		* The main (internal) log handler for the Logger instance.
		* Can be set to a new function in internal package code but not by user.
		*/
		this._logHandler = defaultLogHandler;
		/**
		* The optional, additional, user-defined log handler for the Logger instance.
		*/
		this._userLogHandler = null;
		/**
		* Capture the current instance for later use
		*/
		instances.push(this);
	}
	get logLevel() {
		return this._logLevel;
	}
	set logLevel(val) {
		if (!(val in LogLevel)) throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
		this._logLevel = val;
	}
	setLogLevel(val) {
		this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
	}
	get logHandler() {
		return this._logHandler;
	}
	set logHandler(val) {
		if (typeof val !== "function") throw new TypeError("Value assigned to `logHandler` must be a function");
		this._logHandler = val;
	}
	get userLogHandler() {
		return this._userLogHandler;
	}
	set userLogHandler(val) {
		this._userLogHandler = val;
	}
	/**
	* The functions below are all based on the `console` interface
	*/
	debug(...args) {
		this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
		this._logHandler(this, LogLevel.DEBUG, ...args);
	}
	log(...args) {
		this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
		this._logHandler(this, LogLevel.VERBOSE, ...args);
	}
	info(...args) {
		this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
		this._logHandler(this, LogLevel.INFO, ...args);
	}
	warn(...args) {
		this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
		this._logHandler(this, LogLevel.WARN, ...args);
	}
	error(...args) {
		this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
		this._logHandler(this, LogLevel.ERROR, ...args);
	}
};
//#endregion
//#region node_modules/idb/build/wrap-idb-value.js
var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
var idbProxyableTypes;
var cursorAdvanceMethods;
function getIdbProxyableTypes() {
	return idbProxyableTypes || (idbProxyableTypes = [
		IDBDatabase,
		IDBObjectStore,
		IDBIndex,
		IDBCursor,
		IDBTransaction
	]);
}
function getCursorAdvanceMethods() {
	return cursorAdvanceMethods || (cursorAdvanceMethods = [
		IDBCursor.prototype.advance,
		IDBCursor.prototype.continue,
		IDBCursor.prototype.continuePrimaryKey
	]);
}
var cursorRequestMap = /* @__PURE__ */ new WeakMap();
var transactionDoneMap = /* @__PURE__ */ new WeakMap();
var transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
var transformCache = /* @__PURE__ */ new WeakMap();
var reverseTransformCache = /* @__PURE__ */ new WeakMap();
function promisifyRequest(request) {
	const promise = new Promise((resolve, reject) => {
		const unlisten = () => {
			request.removeEventListener("success", success);
			request.removeEventListener("error", error);
		};
		const success = () => {
			resolve(wrap(request.result));
			unlisten();
		};
		const error = () => {
			reject(request.error);
			unlisten();
		};
		request.addEventListener("success", success);
		request.addEventListener("error", error);
	});
	promise.then((value) => {
		if (value instanceof IDBCursor) cursorRequestMap.set(value, request);
	}).catch(() => {});
	reverseTransformCache.set(promise, request);
	return promise;
}
function cacheDonePromiseForTransaction(tx) {
	if (transactionDoneMap.has(tx)) return;
	const done = new Promise((resolve, reject) => {
		const unlisten = () => {
			tx.removeEventListener("complete", complete);
			tx.removeEventListener("error", error);
			tx.removeEventListener("abort", error);
		};
		const complete = () => {
			resolve();
			unlisten();
		};
		const error = () => {
			reject(tx.error || new DOMException("AbortError", "AbortError"));
			unlisten();
		};
		tx.addEventListener("complete", complete);
		tx.addEventListener("error", error);
		tx.addEventListener("abort", error);
	});
	transactionDoneMap.set(tx, done);
}
var idbProxyTraps = {
	get(target, prop, receiver) {
		if (target instanceof IDBTransaction) {
			if (prop === "done") return transactionDoneMap.get(target);
			if (prop === "objectStoreNames") return target.objectStoreNames || transactionStoreNamesMap.get(target);
			if (prop === "store") return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
		}
		return wrap(target[prop]);
	},
	set(target, prop, value) {
		target[prop] = value;
		return true;
	},
	has(target, prop) {
		if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) return true;
		return prop in target;
	}
};
function replaceTraps(callback) {
	idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
	if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) return function(storeNames, ...args) {
		const tx = func.call(unwrap(this), storeNames, ...args);
		transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
		return wrap(tx);
	};
	if (getCursorAdvanceMethods().includes(func)) return function(...args) {
		func.apply(unwrap(this), args);
		return wrap(cursorRequestMap.get(this));
	};
	return function(...args) {
		return wrap(func.apply(unwrap(this), args));
	};
}
function transformCachableValue(value) {
	if (typeof value === "function") return wrapFunction(value);
	if (value instanceof IDBTransaction) cacheDonePromiseForTransaction(value);
	if (instanceOfAny(value, getIdbProxyableTypes())) return new Proxy(value, idbProxyTraps);
	return value;
}
function wrap(value) {
	if (value instanceof IDBRequest) return promisifyRequest(value);
	if (transformCache.has(value)) return transformCache.get(value);
	const newValue = transformCachableValue(value);
	if (newValue !== value) {
		transformCache.set(value, newValue);
		reverseTransformCache.set(newValue, value);
	}
	return newValue;
}
var unwrap = (value) => reverseTransformCache.get(value);
//#endregion
//#region node_modules/idb/build/index.js
/**
* Open a database.
*
* @param name Name of the database.
* @param version Schema version.
* @param callbacks Additional callbacks.
*/
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
	const request = indexedDB.open(name, version);
	const openPromise = wrap(request);
	if (upgrade) request.addEventListener("upgradeneeded", (event) => {
		upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
	});
	if (blocked) request.addEventListener("blocked", (event) => blocked(event.oldVersion, event.newVersion, event));
	openPromise.then((db) => {
		if (terminated) db.addEventListener("close", () => terminated());
		if (blocking) db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
	}).catch(() => {});
	return openPromise;
}
var readMethods = [
	"get",
	"getKey",
	"getAll",
	"getAllKeys",
	"count"
];
var writeMethods = [
	"put",
	"add",
	"delete",
	"clear"
];
var cachedMethods = /* @__PURE__ */ new Map();
function getMethod(target, prop) {
	if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) return;
	if (cachedMethods.get(prop)) return cachedMethods.get(prop);
	const targetFuncName = prop.replace(/FromIndex$/, "");
	const useIndex = prop !== targetFuncName;
	const isWrite = writeMethods.includes(targetFuncName);
	if (!(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) return;
	const method = async function(storeName, ...args) {
		const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
		let target = tx.store;
		if (useIndex) target = target.index(args.shift());
		return (await Promise.all([target[targetFuncName](...args), isWrite && tx.done]))[0];
	};
	cachedMethods.set(prop, method);
	return method;
}
replaceTraps((oldTraps) => ({
	...oldTraps,
	get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
	has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));
//#endregion
//#region node_modules/@firebase/app/dist/esm/index.esm.js
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var PlatformLoggerServiceImpl = class {
	constructor(container) {
		this.container = container;
	}
	getPlatformInfoString() {
		return this.container.getProviders().map((provider) => {
			if (isVersionServiceProvider(provider)) {
				const service = provider.getImmediate();
				return `${service.library}/${service.version}`;
			} else return null;
		}).filter((logString) => logString).join(" ");
	}
};
/**
*
* @param provider check if this provider provides a VersionService
*
* NOTE: Using Provider<'app-version'> is a hack to indicate that the provider
* provides VersionService. The provider is not necessarily a 'app-version'
* provider.
*/
function isVersionServiceProvider(provider) {
	return provider.getComponent()?.type === "VERSION";
}
var name$q = "@firebase/app";
var version$1 = "0.14.11";
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var logger = new Logger("@firebase/app");
var name$p = "@firebase/app-compat";
var name$o = "@firebase/analytics-compat";
var name$n = "@firebase/analytics";
var name$m = "@firebase/app-check-compat";
var name$l = "@firebase/app-check";
var name$k = "@firebase/auth";
var name$j = "@firebase/auth-compat";
var name$i = "@firebase/database";
var name$h = "@firebase/data-connect";
var name$g = "@firebase/database-compat";
var name$f = "@firebase/functions";
var name$e = "@firebase/functions-compat";
var name$d = "@firebase/installations";
var name$c = "@firebase/installations-compat";
var name$b = "@firebase/messaging";
var name$a = "@firebase/messaging-compat";
var name$9 = "@firebase/performance";
var name$8 = "@firebase/performance-compat";
var name$7 = "@firebase/remote-config";
var name$6 = "@firebase/remote-config-compat";
var name$5 = "@firebase/storage";
var name$4 = "@firebase/storage-compat";
var name$3 = "@firebase/firestore";
var name$2 = "@firebase/ai";
var name$1 = "@firebase/firestore-compat";
var name = "firebase";
var version = "12.12.0";
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* The default app name
*
* @internal
*/
var DEFAULT_ENTRY_NAME = "[DEFAULT]";
var PLATFORM_LOG_STRING = {
	[name$q]: "fire-core",
	[name$p]: "fire-core-compat",
	[name$n]: "fire-analytics",
	[name$o]: "fire-analytics-compat",
	[name$l]: "fire-app-check",
	[name$m]: "fire-app-check-compat",
	[name$k]: "fire-auth",
	[name$j]: "fire-auth-compat",
	[name$i]: "fire-rtdb",
	[name$h]: "fire-data-connect",
	[name$g]: "fire-rtdb-compat",
	[name$f]: "fire-fn",
	[name$e]: "fire-fn-compat",
	[name$d]: "fire-iid",
	[name$c]: "fire-iid-compat",
	[name$b]: "fire-fcm",
	[name$a]: "fire-fcm-compat",
	[name$9]: "fire-perf",
	[name$8]: "fire-perf-compat",
	[name$7]: "fire-rc",
	[name$6]: "fire-rc-compat",
	[name$5]: "fire-gcs",
	[name$4]: "fire-gcs-compat",
	[name$3]: "fire-fst",
	[name$1]: "fire-fst-compat",
	[name$2]: "fire-vertex",
	"fire-js": "fire-js",
	[name]: "fire-js-all"
};
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @internal
*/
var _apps = /* @__PURE__ */ new Map();
/**
* @internal
*/
var _serverApps = /* @__PURE__ */ new Map();
/**
* Registered components.
*
* @internal
*/
var _components = /* @__PURE__ */ new Map();
/**
* @param component - the component being added to this app's container
*
* @internal
*/
function _addComponent(app, component) {
	try {
		app.container.addComponent(component);
	} catch (e) {
		logger.debug(`Component ${component.name} failed to register with FirebaseApp ${app.name}`, e);
	}
}
/**
*
* @param component - the component to register
* @returns whether or not the component is registered successfully
*
* @internal
*/
function _registerComponent(component) {
	const componentName = component.name;
	if (_components.has(componentName)) {
		logger.debug(`There were multiple attempts to register component ${componentName}.`);
		return false;
	}
	_components.set(componentName, component);
	for (const app of _apps.values()) _addComponent(app, component);
	for (const serverApp of _serverApps.values()) _addComponent(serverApp, component);
	return true;
}
/**
*
* @param app - FirebaseApp instance
* @param name - service name
*
* @returns the provider for the service with the matching name
*
* @internal
*/
function _getProvider(app, name) {
	const heartbeatController = app.container.getProvider("heartbeat").getImmediate({ optional: true });
	if (heartbeatController) heartbeatController.triggerHeartbeat();
	return app.container.getProvider(name);
}
/**
*
* @param obj - an object of type FirebaseApp.
*
* @returns true if the provided object is of type FirebaseServerAppImpl.
*
* @internal
*/
function _isFirebaseServerApp(obj) {
	if (obj === null || obj === void 0) return false;
	return obj.settings !== void 0;
}
var ERROR_FACTORY = new ErrorFactory("app", "Firebase", {
	["no-app"]: "No Firebase App '{$appName}' has been created - call initializeApp() first",
	["bad-app-name"]: "Illegal App name: '{$appName}'",
	["duplicate-app"]: "Firebase App named '{$appName}' already exists with different options or config",
	["app-deleted"]: "Firebase App named '{$appName}' already deleted",
	["server-app-deleted"]: "Firebase Server App has been deleted",
	["no-options"]: "Need to provide options, when not being deployed to hosting via source.",
	["invalid-app-argument"]: "firebase.{$appName}() takes either no argument or a Firebase App instance.",
	["invalid-log-argument"]: "First argument to `onLog` must be null or a function.",
	["idb-open"]: "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
	["idb-get"]: "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
	["idb-set"]: "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
	["idb-delete"]: "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
	["finalization-registry-not-supported"]: "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
	["invalid-server-app-environment"]: "FirebaseServerApp is not for use in browser environments."
});
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var FirebaseAppImpl = class {
	constructor(options, config, container) {
		this._isDeleted = false;
		this._options = { ...options };
		this._config = { ...config };
		this._name = config.name;
		this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
		this._container = container;
		this.container.addComponent(new Component("app", () => this, "PUBLIC"));
	}
	get automaticDataCollectionEnabled() {
		this.checkDestroyed();
		return this._automaticDataCollectionEnabled;
	}
	set automaticDataCollectionEnabled(val) {
		this.checkDestroyed();
		this._automaticDataCollectionEnabled = val;
	}
	get name() {
		this.checkDestroyed();
		return this._name;
	}
	get options() {
		this.checkDestroyed();
		return this._options;
	}
	get config() {
		this.checkDestroyed();
		return this._config;
	}
	get container() {
		return this._container;
	}
	get isDeleted() {
		return this._isDeleted;
	}
	set isDeleted(val) {
		this._isDeleted = val;
	}
	/**
	* This function will throw an Error if the App has already been deleted -
	* use before performing API actions on the App.
	*/
	checkDestroyed() {
		if (this.isDeleted) throw ERROR_FACTORY.create("app-deleted", { appName: this._name });
	}
};
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* The current SDK version.
*
* @public
*/
var SDK_VERSION = version;
function initializeApp(_options, rawConfig = {}) {
	let options = _options;
	if (typeof rawConfig !== "object") rawConfig = { name: rawConfig };
	const config = {
		name: DEFAULT_ENTRY_NAME,
		automaticDataCollectionEnabled: true,
		...rawConfig
	};
	const name = config.name;
	if (typeof name !== "string" || !name) throw ERROR_FACTORY.create("bad-app-name", { appName: String(name) });
	options || (options = getDefaultAppConfig());
	if (!options) throw ERROR_FACTORY.create("no-options");
	const existingApp = _apps.get(name);
	if (existingApp) if (deepEqual(options, existingApp.options) && deepEqual(config, existingApp.config)) return existingApp;
	else throw ERROR_FACTORY.create("duplicate-app", { appName: name });
	const container = new ComponentContainer(name);
	for (const component of _components.values()) container.addComponent(component);
	const newApp = new FirebaseAppImpl(options, config, container);
	_apps.set(name, newApp);
	return newApp;
}
/**
* Retrieves a {@link @firebase/app#FirebaseApp} instance.
*
* When called with no arguments, the default app is returned. When an app name
* is provided, the app corresponding to that name is returned.
*
* An exception is thrown if the app being retrieved has not yet been
* initialized.
*
* @example
* ```javascript
* // Return the default app
* const app = getApp();
* ```
*
* @example
* ```javascript
* // Return a named app
* const otherApp = getApp("otherApp");
* ```
*
* @param name - Optional name of the app to return. If no name is
*   provided, the default is `"[DEFAULT]"`.
*
* @returns The app corresponding to the provided app name.
*   If no app name is provided, the default app is returned.
*
* @public
*/
function getApp(name = DEFAULT_ENTRY_NAME) {
	const app = _apps.get(name);
	if (!app && name === "[DEFAULT]" && getDefaultAppConfig()) return initializeApp();
	if (!app) throw ERROR_FACTORY.create("no-app", { appName: name });
	return app;
}
/**
* Registers a library's name and version for platform logging purposes.
* @param library - Name of 1p or 3p library (e.g. firestore, angularfire)
* @param version - Current version of that library.
* @param variant - Bundle variant, e.g., node, rn, etc.
*
* @public
*/
function registerVersion(libraryKeyOrName, version, variant) {
	let library = PLATFORM_LOG_STRING[libraryKeyOrName] ?? libraryKeyOrName;
	if (variant) library += `-${variant}`;
	const libraryMismatch = library.match(/\s|\//);
	const versionMismatch = version.match(/\s|\//);
	if (libraryMismatch || versionMismatch) {
		const warning = [`Unable to register library "${library}" with version "${version}":`];
		if (libraryMismatch) warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
		if (libraryMismatch && versionMismatch) warning.push("and");
		if (versionMismatch) warning.push(`version name "${version}" contains illegal characters (whitespace or "/")`);
		logger.warn(warning.join(" "));
		return;
	}
	_registerComponent(new Component(`${library}-version`, () => ({
		library,
		version
	}), "VERSION"));
}
/**
* @license
* Copyright 2021 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var DB_NAME = "firebase-heartbeat-database";
var DB_VERSION = 1;
var STORE_NAME = "firebase-heartbeat-store";
var dbPromise = null;
function getDbPromise() {
	if (!dbPromise) dbPromise = openDB(DB_NAME, DB_VERSION, { upgrade: (db, oldVersion) => {
		switch (oldVersion) {
			case 0: try {
				db.createObjectStore(STORE_NAME);
			} catch (e) {
				console.warn(e);
			}
		}
	} }).catch((e) => {
		throw ERROR_FACTORY.create("idb-open", { originalErrorMessage: e.message });
	});
	return dbPromise;
}
async function readHeartbeatsFromIndexedDB(app) {
	try {
		const tx = (await getDbPromise()).transaction(STORE_NAME);
		const result = await tx.objectStore(STORE_NAME).get(computeKey(app));
		await tx.done;
		return result;
	} catch (e) {
		if (e instanceof FirebaseError) logger.warn(e.message);
		else {
			const idbGetError = ERROR_FACTORY.create("idb-get", { originalErrorMessage: e?.message });
			logger.warn(idbGetError.message);
		}
	}
}
async function writeHeartbeatsToIndexedDB(app, heartbeatObject) {
	try {
		const tx = (await getDbPromise()).transaction(STORE_NAME, "readwrite");
		await tx.objectStore(STORE_NAME).put(heartbeatObject, computeKey(app));
		await tx.done;
	} catch (e) {
		if (e instanceof FirebaseError) logger.warn(e.message);
		else {
			const idbGetError = ERROR_FACTORY.create("idb-set", { originalErrorMessage: e?.message });
			logger.warn(idbGetError.message);
		}
	}
}
function computeKey(app) {
	return `${app.name}!${app.options.appId}`;
}
/**
* @license
* Copyright 2021 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var MAX_HEADER_BYTES = 1024;
var MAX_NUM_STORED_HEARTBEATS = 30;
var HeartbeatServiceImpl = class {
	constructor(container) {
		this.container = container;
		/**
		* In-memory cache for heartbeats, used by getHeartbeatsHeader() to generate
		* the header string.
		* Stores one record per date. This will be consolidated into the standard
		* format of one record per user agent string before being sent as a header.
		* Populated from indexedDB when the controller is instantiated and should
		* be kept in sync with indexedDB.
		* Leave public for easier testing.
		*/
		this._heartbeatsCache = null;
		const app = this.container.getProvider("app").getImmediate();
		this._storage = new HeartbeatStorageImpl(app);
		this._heartbeatsCachePromise = this._storage.read().then((result) => {
			this._heartbeatsCache = result;
			return result;
		});
	}
	/**
	* Called to report a heartbeat. The function will generate
	* a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
	* to IndexedDB.
	* Note that we only store one heartbeat per day. So if a heartbeat for today is
	* already logged, subsequent calls to this function in the same day will be ignored.
	*/
	async triggerHeartbeat() {
		try {
			const agent = this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString();
			const date = getUTCDateString();
			if (this._heartbeatsCache?.heartbeats == null) {
				this._heartbeatsCache = await this._heartbeatsCachePromise;
				if (this._heartbeatsCache?.heartbeats == null) return;
			}
			if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat) => singleDateHeartbeat.date === date)) return;
			else {
				this._heartbeatsCache.heartbeats.push({
					date,
					agent
				});
				if (this._heartbeatsCache.heartbeats.length > MAX_NUM_STORED_HEARTBEATS) {
					const earliestHeartbeatIdx = getEarliestHeartbeatIdx(this._heartbeatsCache.heartbeats);
					this._heartbeatsCache.heartbeats.splice(earliestHeartbeatIdx, 1);
				}
			}
			return this._storage.overwrite(this._heartbeatsCache);
		} catch (e) {
			logger.warn(e);
		}
	}
	/**
	* Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
	* It also clears all heartbeats from memory as well as in IndexedDB.
	*
	* NOTE: Consuming product SDKs should not send the header if this method
	* returns an empty string.
	*/
	async getHeartbeatsHeader() {
		try {
			if (this._heartbeatsCache === null) await this._heartbeatsCachePromise;
			if (this._heartbeatsCache?.heartbeats == null || this._heartbeatsCache.heartbeats.length === 0) return "";
			const date = getUTCDateString();
			const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
			const headerString = base64urlEncodeWithoutPadding(JSON.stringify({
				version: 2,
				heartbeats: heartbeatsToSend
			}));
			this._heartbeatsCache.lastSentHeartbeatDate = date;
			if (unsentEntries.length > 0) {
				this._heartbeatsCache.heartbeats = unsentEntries;
				await this._storage.overwrite(this._heartbeatsCache);
			} else {
				this._heartbeatsCache.heartbeats = [];
				this._storage.overwrite(this._heartbeatsCache);
			}
			return headerString;
		} catch (e) {
			logger.warn(e);
			return "";
		}
	}
};
function getUTCDateString() {
	return (/* @__PURE__ */ new Date()).toISOString().substring(0, 10);
}
function extractHeartbeatsForHeader(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
	const heartbeatsToSend = [];
	let unsentEntries = heartbeatsCache.slice();
	for (const singleDateHeartbeat of heartbeatsCache) {
		const heartbeatEntry = heartbeatsToSend.find((hb) => hb.agent === singleDateHeartbeat.agent);
		if (!heartbeatEntry) {
			heartbeatsToSend.push({
				agent: singleDateHeartbeat.agent,
				dates: [singleDateHeartbeat.date]
			});
			if (countBytes(heartbeatsToSend) > maxSize) {
				heartbeatsToSend.pop();
				break;
			}
		} else {
			heartbeatEntry.dates.push(singleDateHeartbeat.date);
			if (countBytes(heartbeatsToSend) > maxSize) {
				heartbeatEntry.dates.pop();
				break;
			}
		}
		unsentEntries = unsentEntries.slice(1);
	}
	return {
		heartbeatsToSend,
		unsentEntries
	};
}
var HeartbeatStorageImpl = class {
	constructor(app) {
		this.app = app;
		this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
	}
	async runIndexedDBEnvironmentCheck() {
		if (!isIndexedDBAvailable()) return false;
		else return validateIndexedDBOpenable().then(() => true).catch(() => false);
	}
	/**
	* Read all heartbeats.
	*/
	async read() {
		if (!await this._canUseIndexedDBPromise) return { heartbeats: [] };
		else {
			const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
			if (idbHeartbeatObject?.heartbeats) return idbHeartbeatObject;
			else return { heartbeats: [] };
		}
	}
	async overwrite(heartbeatsObject) {
		if (!await this._canUseIndexedDBPromise) return;
		else {
			const existingHeartbeatsObject = await this.read();
			return writeHeartbeatsToIndexedDB(this.app, {
				lastSentHeartbeatDate: heartbeatsObject.lastSentHeartbeatDate ?? existingHeartbeatsObject.lastSentHeartbeatDate,
				heartbeats: heartbeatsObject.heartbeats
			});
		}
	}
	async add(heartbeatsObject) {
		if (!await this._canUseIndexedDBPromise) return;
		else {
			const existingHeartbeatsObject = await this.read();
			return writeHeartbeatsToIndexedDB(this.app, {
				lastSentHeartbeatDate: heartbeatsObject.lastSentHeartbeatDate ?? existingHeartbeatsObject.lastSentHeartbeatDate,
				heartbeats: [...existingHeartbeatsObject.heartbeats, ...heartbeatsObject.heartbeats]
			});
		}
	}
};
/**
* Calculate bytes of a HeartbeatsByUserAgent array after being wrapped
* in a platform logging header JSON object, stringified, and converted
* to base 64.
*/
function countBytes(heartbeatsCache) {
	return base64urlEncodeWithoutPadding(JSON.stringify({
		version: 2,
		heartbeats: heartbeatsCache
	})).length;
}
/**
* Returns the index of the heartbeat with the earliest date.
* If the heartbeats array is empty, -1 is returned.
*/
function getEarliestHeartbeatIdx(heartbeats) {
	if (heartbeats.length === 0) return -1;
	let earliestHeartbeatIdx = 0;
	let earliestHeartbeatDate = heartbeats[0].date;
	for (let i = 1; i < heartbeats.length; i++) if (heartbeats[i].date < earliestHeartbeatDate) {
		earliestHeartbeatDate = heartbeats[i].date;
		earliestHeartbeatIdx = i;
	}
	return earliestHeartbeatIdx;
}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function registerCoreComponents(variant) {
	_registerComponent(new Component("platform-logger", (container) => new PlatformLoggerServiceImpl(container), "PRIVATE"));
	_registerComponent(new Component("heartbeat", (container) => new HeartbeatServiceImpl(container), "PRIVATE"));
	registerVersion(name$q, version$1, variant);
	registerVersion(name$q, version$1, "esm2020");
	registerVersion("fire-js", "");
}
/**
* Firebase App
*
* @remarks This package coordinates the communication between the different Firebase components
* @packageDocumentation
*/
registerCoreComponents("");
//#endregion
//#region node_modules/firebase/app/dist/esm/index.esm.js
var index_esm_exports$1 = /* @__PURE__ */ __exportAll({
	SDK_VERSION: () => SDK_VERSION,
	_DEFAULT_ENTRY_NAME: () => DEFAULT_ENTRY_NAME,
	_addComponent: () => _addComponent,
	_apps: () => _apps,
	_components: () => _components,
	_getProvider: () => _getProvider,
	_isFirebaseServerApp: () => _isFirebaseServerApp,
	_registerComponent: () => _registerComponent,
	_serverApps: () => _serverApps,
	getApp: () => getApp,
	initializeApp: () => initializeApp,
	registerVersion: () => registerVersion
});
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
registerVersion("firebase", "12.12.1", "app");
//#endregion
//#region node_modules/@firebase/webchannel-wrapper/dist/bloom-blob/esm/bloom_blob_es2018.js
var commonjsGlobal$1 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var bloom_blob_es2018 = {};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/
var Integer;
var Md5;
(function() {
	var h;
	function k(d, a) {
		function c() {}
		c.prototype = a.prototype;
		d.F = a.prototype;
		d.prototype = new c();
		d.prototype.constructor = d;
		d.D = function(f, e, g) {
			for (var b = Array(arguments.length - 2), r = 2; r < arguments.length; r++) b[r - 2] = arguments[r];
			return a.prototype[e].apply(f, b);
		};
	}
	function l() {
		this.blockSize = -1;
	}
	function m() {
		this.blockSize = -1;
		this.blockSize = 64;
		this.g = Array(4);
		this.C = Array(this.blockSize);
		this.o = this.h = 0;
		this.u();
	}
	k(m, l);
	m.prototype.u = function() {
		this.g[0] = 1732584193;
		this.g[1] = 4023233417;
		this.g[2] = 2562383102;
		this.g[3] = 271733878;
		this.o = this.h = 0;
	};
	function n(d, a, c) {
		c || (c = 0);
		const f = Array(16);
		if (typeof a === "string") for (var e = 0; e < 16; ++e) f[e] = a.charCodeAt(c++) | a.charCodeAt(c++) << 8 | a.charCodeAt(c++) << 16 | a.charCodeAt(c++) << 24;
		else for (e = 0; e < 16; ++e) f[e] = a[c++] | a[c++] << 8 | a[c++] << 16 | a[c++] << 24;
		a = d.g[0];
		c = d.g[1];
		e = d.g[2];
		let g = d.g[3], b;
		b = a + (g ^ c & (e ^ g)) + f[0] + 3614090360 & 4294967295;
		a = c + (b << 7 & 4294967295 | b >>> 25);
		b = g + (e ^ a & (c ^ e)) + f[1] + 3905402710 & 4294967295;
		g = a + (b << 12 & 4294967295 | b >>> 20);
		b = e + (c ^ g & (a ^ c)) + f[2] + 606105819 & 4294967295;
		e = g + (b << 17 & 4294967295 | b >>> 15);
		b = c + (a ^ e & (g ^ a)) + f[3] + 3250441966 & 4294967295;
		c = e + (b << 22 & 4294967295 | b >>> 10);
		b = a + (g ^ c & (e ^ g)) + f[4] + 4118548399 & 4294967295;
		a = c + (b << 7 & 4294967295 | b >>> 25);
		b = g + (e ^ a & (c ^ e)) + f[5] + 1200080426 & 4294967295;
		g = a + (b << 12 & 4294967295 | b >>> 20);
		b = e + (c ^ g & (a ^ c)) + f[6] + 2821735955 & 4294967295;
		e = g + (b << 17 & 4294967295 | b >>> 15);
		b = c + (a ^ e & (g ^ a)) + f[7] + 4249261313 & 4294967295;
		c = e + (b << 22 & 4294967295 | b >>> 10);
		b = a + (g ^ c & (e ^ g)) + f[8] + 1770035416 & 4294967295;
		a = c + (b << 7 & 4294967295 | b >>> 25);
		b = g + (e ^ a & (c ^ e)) + f[9] + 2336552879 & 4294967295;
		g = a + (b << 12 & 4294967295 | b >>> 20);
		b = e + (c ^ g & (a ^ c)) + f[10] + 4294925233 & 4294967295;
		e = g + (b << 17 & 4294967295 | b >>> 15);
		b = c + (a ^ e & (g ^ a)) + f[11] + 2304563134 & 4294967295;
		c = e + (b << 22 & 4294967295 | b >>> 10);
		b = a + (g ^ c & (e ^ g)) + f[12] + 1804603682 & 4294967295;
		a = c + (b << 7 & 4294967295 | b >>> 25);
		b = g + (e ^ a & (c ^ e)) + f[13] + 4254626195 & 4294967295;
		g = a + (b << 12 & 4294967295 | b >>> 20);
		b = e + (c ^ g & (a ^ c)) + f[14] + 2792965006 & 4294967295;
		e = g + (b << 17 & 4294967295 | b >>> 15);
		b = c + (a ^ e & (g ^ a)) + f[15] + 1236535329 & 4294967295;
		c = e + (b << 22 & 4294967295 | b >>> 10);
		b = a + (e ^ g & (c ^ e)) + f[1] + 4129170786 & 4294967295;
		a = c + (b << 5 & 4294967295 | b >>> 27);
		b = g + (c ^ e & (a ^ c)) + f[6] + 3225465664 & 4294967295;
		g = a + (b << 9 & 4294967295 | b >>> 23);
		b = e + (a ^ c & (g ^ a)) + f[11] + 643717713 & 4294967295;
		e = g + (b << 14 & 4294967295 | b >>> 18);
		b = c + (g ^ a & (e ^ g)) + f[0] + 3921069994 & 4294967295;
		c = e + (b << 20 & 4294967295 | b >>> 12);
		b = a + (e ^ g & (c ^ e)) + f[5] + 3593408605 & 4294967295;
		a = c + (b << 5 & 4294967295 | b >>> 27);
		b = g + (c ^ e & (a ^ c)) + f[10] + 38016083 & 4294967295;
		g = a + (b << 9 & 4294967295 | b >>> 23);
		b = e + (a ^ c & (g ^ a)) + f[15] + 3634488961 & 4294967295;
		e = g + (b << 14 & 4294967295 | b >>> 18);
		b = c + (g ^ a & (e ^ g)) + f[4] + 3889429448 & 4294967295;
		c = e + (b << 20 & 4294967295 | b >>> 12);
		b = a + (e ^ g & (c ^ e)) + f[9] + 568446438 & 4294967295;
		a = c + (b << 5 & 4294967295 | b >>> 27);
		b = g + (c ^ e & (a ^ c)) + f[14] + 3275163606 & 4294967295;
		g = a + (b << 9 & 4294967295 | b >>> 23);
		b = e + (a ^ c & (g ^ a)) + f[3] + 4107603335 & 4294967295;
		e = g + (b << 14 & 4294967295 | b >>> 18);
		b = c + (g ^ a & (e ^ g)) + f[8] + 1163531501 & 4294967295;
		c = e + (b << 20 & 4294967295 | b >>> 12);
		b = a + (e ^ g & (c ^ e)) + f[13] + 2850285829 & 4294967295;
		a = c + (b << 5 & 4294967295 | b >>> 27);
		b = g + (c ^ e & (a ^ c)) + f[2] + 4243563512 & 4294967295;
		g = a + (b << 9 & 4294967295 | b >>> 23);
		b = e + (a ^ c & (g ^ a)) + f[7] + 1735328473 & 4294967295;
		e = g + (b << 14 & 4294967295 | b >>> 18);
		b = c + (g ^ a & (e ^ g)) + f[12] + 2368359562 & 4294967295;
		c = e + (b << 20 & 4294967295 | b >>> 12);
		b = a + (c ^ e ^ g) + f[5] + 4294588738 & 4294967295;
		a = c + (b << 4 & 4294967295 | b >>> 28);
		b = g + (a ^ c ^ e) + f[8] + 2272392833 & 4294967295;
		g = a + (b << 11 & 4294967295 | b >>> 21);
		b = e + (g ^ a ^ c) + f[11] + 1839030562 & 4294967295;
		e = g + (b << 16 & 4294967295 | b >>> 16);
		b = c + (e ^ g ^ a) + f[14] + 4259657740 & 4294967295;
		c = e + (b << 23 & 4294967295 | b >>> 9);
		b = a + (c ^ e ^ g) + f[1] + 2763975236 & 4294967295;
		a = c + (b << 4 & 4294967295 | b >>> 28);
		b = g + (a ^ c ^ e) + f[4] + 1272893353 & 4294967295;
		g = a + (b << 11 & 4294967295 | b >>> 21);
		b = e + (g ^ a ^ c) + f[7] + 4139469664 & 4294967295;
		e = g + (b << 16 & 4294967295 | b >>> 16);
		b = c + (e ^ g ^ a) + f[10] + 3200236656 & 4294967295;
		c = e + (b << 23 & 4294967295 | b >>> 9);
		b = a + (c ^ e ^ g) + f[13] + 681279174 & 4294967295;
		a = c + (b << 4 & 4294967295 | b >>> 28);
		b = g + (a ^ c ^ e) + f[0] + 3936430074 & 4294967295;
		g = a + (b << 11 & 4294967295 | b >>> 21);
		b = e + (g ^ a ^ c) + f[3] + 3572445317 & 4294967295;
		e = g + (b << 16 & 4294967295 | b >>> 16);
		b = c + (e ^ g ^ a) + f[6] + 76029189 & 4294967295;
		c = e + (b << 23 & 4294967295 | b >>> 9);
		b = a + (c ^ e ^ g) + f[9] + 3654602809 & 4294967295;
		a = c + (b << 4 & 4294967295 | b >>> 28);
		b = g + (a ^ c ^ e) + f[12] + 3873151461 & 4294967295;
		g = a + (b << 11 & 4294967295 | b >>> 21);
		b = e + (g ^ a ^ c) + f[15] + 530742520 & 4294967295;
		e = g + (b << 16 & 4294967295 | b >>> 16);
		b = c + (e ^ g ^ a) + f[2] + 3299628645 & 4294967295;
		c = e + (b << 23 & 4294967295 | b >>> 9);
		b = a + (e ^ (c | ~g)) + f[0] + 4096336452 & 4294967295;
		a = c + (b << 6 & 4294967295 | b >>> 26);
		b = g + (c ^ (a | ~e)) + f[7] + 1126891415 & 4294967295;
		g = a + (b << 10 & 4294967295 | b >>> 22);
		b = e + (a ^ (g | ~c)) + f[14] + 2878612391 & 4294967295;
		e = g + (b << 15 & 4294967295 | b >>> 17);
		b = c + (g ^ (e | ~a)) + f[5] + 4237533241 & 4294967295;
		c = e + (b << 21 & 4294967295 | b >>> 11);
		b = a + (e ^ (c | ~g)) + f[12] + 1700485571 & 4294967295;
		a = c + (b << 6 & 4294967295 | b >>> 26);
		b = g + (c ^ (a | ~e)) + f[3] + 2399980690 & 4294967295;
		g = a + (b << 10 & 4294967295 | b >>> 22);
		b = e + (a ^ (g | ~c)) + f[10] + 4293915773 & 4294967295;
		e = g + (b << 15 & 4294967295 | b >>> 17);
		b = c + (g ^ (e | ~a)) + f[1] + 2240044497 & 4294967295;
		c = e + (b << 21 & 4294967295 | b >>> 11);
		b = a + (e ^ (c | ~g)) + f[8] + 1873313359 & 4294967295;
		a = c + (b << 6 & 4294967295 | b >>> 26);
		b = g + (c ^ (a | ~e)) + f[15] + 4264355552 & 4294967295;
		g = a + (b << 10 & 4294967295 | b >>> 22);
		b = e + (a ^ (g | ~c)) + f[6] + 2734768916 & 4294967295;
		e = g + (b << 15 & 4294967295 | b >>> 17);
		b = c + (g ^ (e | ~a)) + f[13] + 1309151649 & 4294967295;
		c = e + (b << 21 & 4294967295 | b >>> 11);
		b = a + (e ^ (c | ~g)) + f[4] + 4149444226 & 4294967295;
		a = c + (b << 6 & 4294967295 | b >>> 26);
		b = g + (c ^ (a | ~e)) + f[11] + 3174756917 & 4294967295;
		g = a + (b << 10 & 4294967295 | b >>> 22);
		b = e + (a ^ (g | ~c)) + f[2] + 718787259 & 4294967295;
		e = g + (b << 15 & 4294967295 | b >>> 17);
		b = c + (g ^ (e | ~a)) + f[9] + 3951481745 & 4294967295;
		d.g[0] = d.g[0] + a & 4294967295;
		d.g[1] = d.g[1] + (e + (b << 21 & 4294967295 | b >>> 11)) & 4294967295;
		d.g[2] = d.g[2] + e & 4294967295;
		d.g[3] = d.g[3] + g & 4294967295;
	}
	m.prototype.v = function(d, a) {
		a === void 0 && (a = d.length);
		const c = a - this.blockSize, f = this.C;
		let e = this.h, g = 0;
		for (; g < a;) {
			if (e == 0) for (; g <= c;) n(this, d, g), g += this.blockSize;
			if (typeof d === "string") {
				for (; g < a;) if (f[e++] = d.charCodeAt(g++), e == this.blockSize) {
					n(this, f);
					e = 0;
					break;
				}
			} else for (; g < a;) if (f[e++] = d[g++], e == this.blockSize) {
				n(this, f);
				e = 0;
				break;
			}
		}
		this.h = e;
		this.o += a;
	};
	m.prototype.A = function() {
		var d = Array((this.h < 56 ? this.blockSize : this.blockSize * 2) - this.h);
		d[0] = 128;
		for (var a = 1; a < d.length - 8; ++a) d[a] = 0;
		a = this.o * 8;
		for (var c = d.length - 8; c < d.length; ++c) d[c] = a & 255, a /= 256;
		this.v(d);
		d = Array(16);
		a = 0;
		for (c = 0; c < 4; ++c) for (let f = 0; f < 32; f += 8) d[a++] = this.g[c] >>> f & 255;
		return d;
	};
	function p(d, a) {
		var c = q;
		return Object.prototype.hasOwnProperty.call(c, d) ? c[d] : c[d] = a(d);
	}
	function t(d, a) {
		this.h = a;
		const c = [];
		let f = !0;
		for (let e = d.length - 1; e >= 0; e--) {
			const g = d[e] | 0;
			f && g == a || (c[e] = g, f = !1);
		}
		this.g = c;
	}
	var q = {};
	function u(d) {
		return -128 <= d && d < 128 ? p(d, function(a) {
			return new t([a | 0], a < 0 ? -1 : 0);
		}) : new t([d | 0], d < 0 ? -1 : 0);
	}
	function v(d) {
		if (isNaN(d) || !isFinite(d)) return w;
		if (d < 0) return x(v(-d));
		const a = [];
		let c = 1;
		for (let f = 0; d >= c; f++) a[f] = d / c | 0, c *= 4294967296;
		return new t(a, 0);
	}
	function y(d, a) {
		if (d.length == 0) throw Error("number format error: empty string");
		a = a || 10;
		if (a < 2 || 36 < a) throw Error("radix out of range: " + a);
		if (d.charAt(0) == "-") return x(y(d.substring(1), a));
		if (d.indexOf("-") >= 0) throw Error("number format error: interior \"-\" character");
		const c = v(Math.pow(a, 8));
		let f = w;
		for (let g = 0; g < d.length; g += 8) {
			var e = Math.min(8, d.length - g);
			const b = parseInt(d.substring(g, g + e), a);
			e < 8 ? (e = v(Math.pow(a, e)), f = f.j(e).add(v(b))) : (f = f.j(c), f = f.add(v(b)));
		}
		return f;
	}
	var w = u(0), z = u(1), A = u(16777216);
	h = t.prototype;
	h.m = function() {
		if (B(this)) return -x(this).m();
		let d = 0, a = 1;
		for (let c = 0; c < this.g.length; c++) {
			const f = this.i(c);
			d += (f >= 0 ? f : 4294967296 + f) * a;
			a *= 4294967296;
		}
		return d;
	};
	h.toString = function(d) {
		d = d || 10;
		if (d < 2 || 36 < d) throw Error("radix out of range: " + d);
		if (C(this)) return "0";
		if (B(this)) return "-" + x(this).toString(d);
		const a = v(Math.pow(d, 6));
		var c = this;
		let f = "";
		for (;;) {
			const e = D(c, a).g;
			c = F(c, e.j(a));
			let g = ((c.g.length > 0 ? c.g[0] : c.h) >>> 0).toString(d);
			c = e;
			if (C(c)) return g + f;
			for (; g.length < 6;) g = "0" + g;
			f = g + f;
		}
	};
	h.i = function(d) {
		return d < 0 ? 0 : d < this.g.length ? this.g[d] : this.h;
	};
	function C(d) {
		if (d.h != 0) return !1;
		for (let a = 0; a < d.g.length; a++) if (d.g[a] != 0) return !1;
		return !0;
	}
	function B(d) {
		return d.h == -1;
	}
	h.l = function(d) {
		d = F(this, d);
		return B(d) ? -1 : C(d) ? 0 : 1;
	};
	function x(d) {
		const a = d.g.length, c = [];
		for (let f = 0; f < a; f++) c[f] = ~d.g[f];
		return new t(c, ~d.h).add(z);
	}
	h.abs = function() {
		return B(this) ? x(this) : this;
	};
	h.add = function(d) {
		const a = Math.max(this.g.length, d.g.length), c = [];
		let f = 0;
		for (let e = 0; e <= a; e++) {
			let g = f + (this.i(e) & 65535) + (d.i(e) & 65535), b = (g >>> 16) + (this.i(e) >>> 16) + (d.i(e) >>> 16);
			f = b >>> 16;
			g &= 65535;
			b &= 65535;
			c[e] = b << 16 | g;
		}
		return new t(c, c[c.length - 1] & -2147483648 ? -1 : 0);
	};
	function F(d, a) {
		return d.add(x(a));
	}
	h.j = function(d) {
		if (C(this) || C(d)) return w;
		if (B(this)) return B(d) ? x(this).j(x(d)) : x(x(this).j(d));
		if (B(d)) return x(this.j(x(d)));
		if (this.l(A) < 0 && d.l(A) < 0) return v(this.m() * d.m());
		const a = this.g.length + d.g.length, c = [];
		for (var f = 0; f < 2 * a; f++) c[f] = 0;
		for (f = 0; f < this.g.length; f++) for (let e = 0; e < d.g.length; e++) {
			const g = this.i(f) >>> 16, b = this.i(f) & 65535, r = d.i(e) >>> 16, E = d.i(e) & 65535;
			c[2 * f + 2 * e] += b * E;
			G(c, 2 * f + 2 * e);
			c[2 * f + 2 * e + 1] += g * E;
			G(c, 2 * f + 2 * e + 1);
			c[2 * f + 2 * e + 1] += b * r;
			G(c, 2 * f + 2 * e + 1);
			c[2 * f + 2 * e + 2] += g * r;
			G(c, 2 * f + 2 * e + 2);
		}
		for (d = 0; d < a; d++) c[d] = c[2 * d + 1] << 16 | c[2 * d];
		for (d = a; d < 2 * a; d++) c[d] = 0;
		return new t(c, 0);
	};
	function G(d, a) {
		for (; (d[a] & 65535) != d[a];) d[a + 1] += d[a] >>> 16, d[a] &= 65535, a++;
	}
	function H(d, a) {
		this.g = d;
		this.h = a;
	}
	function D(d, a) {
		if (C(a)) throw Error("division by zero");
		if (C(d)) return new H(w, w);
		if (B(d)) return a = D(x(d), a), new H(x(a.g), x(a.h));
		if (B(a)) return a = D(d, x(a)), new H(x(a.g), a.h);
		if (d.g.length > 30) {
			if (B(d) || B(a)) throw Error("slowDivide_ only works with positive integers.");
			for (var c = z, f = a; f.l(d) <= 0;) c = I(c), f = I(f);
			var e = J(c, 1), g = J(f, 1);
			f = J(f, 2);
			for (c = J(c, 2); !C(f);) {
				var b = g.add(f);
				b.l(d) <= 0 && (e = e.add(c), g = b);
				f = J(f, 1);
				c = J(c, 1);
			}
			a = F(d, e.j(a));
			return new H(e, a);
		}
		for (e = w; d.l(a) >= 0;) {
			c = Math.max(1, Math.floor(d.m() / a.m()));
			f = Math.ceil(Math.log(c) / Math.LN2);
			f = f <= 48 ? 1 : Math.pow(2, f - 48);
			g = v(c);
			for (b = g.j(a); B(b) || b.l(d) > 0;) c -= f, g = v(c), b = g.j(a);
			C(g) && (g = z);
			e = e.add(g);
			d = F(d, b);
		}
		return new H(e, d);
	}
	h.B = function(d) {
		return D(this, d).h;
	};
	h.and = function(d) {
		const a = Math.max(this.g.length, d.g.length), c = [];
		for (let f = 0; f < a; f++) c[f] = this.i(f) & d.i(f);
		return new t(c, this.h & d.h);
	};
	h.or = function(d) {
		const a = Math.max(this.g.length, d.g.length), c = [];
		for (let f = 0; f < a; f++) c[f] = this.i(f) | d.i(f);
		return new t(c, this.h | d.h);
	};
	h.xor = function(d) {
		const a = Math.max(this.g.length, d.g.length), c = [];
		for (let f = 0; f < a; f++) c[f] = this.i(f) ^ d.i(f);
		return new t(c, this.h ^ d.h);
	};
	function I(d) {
		const a = d.g.length + 1, c = [];
		for (let f = 0; f < a; f++) c[f] = d.i(f) << 1 | d.i(f - 1) >>> 31;
		return new t(c, d.h);
	}
	function J(d, a) {
		const c = a >> 5;
		a %= 32;
		const f = d.g.length - c, e = [];
		for (let g = 0; g < f; g++) e[g] = a > 0 ? d.i(g + c) >>> a | d.i(g + c + 1) << 32 - a : d.i(g + c);
		return new t(e, d.h);
	}
	m.prototype.digest = m.prototype.A;
	m.prototype.reset = m.prototype.u;
	m.prototype.update = m.prototype.v;
	Md5 = bloom_blob_es2018.Md5 = m;
	t.prototype.add = t.prototype.add;
	t.prototype.multiply = t.prototype.j;
	t.prototype.modulo = t.prototype.B;
	t.prototype.compare = t.prototype.l;
	t.prototype.toNumber = t.prototype.m;
	t.prototype.toString = t.prototype.toString;
	t.prototype.getBits = t.prototype.i;
	t.fromNumber = v;
	t.fromString = y;
	Integer = bloom_blob_es2018.Integer = t;
}).apply(typeof commonjsGlobal$1 !== "undefined" ? commonjsGlobal$1 : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
//#endregion
//#region node_modules/@firebase/webchannel-wrapper/dist/webchannel-blob/esm/webchannel_blob_es2018.js
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var webchannel_blob_es2018 = {};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/
var XhrIo;
var WebChannel;
var EventType;
var ErrorCode;
var Stat;
var Event;
var getStatEventTarget;
var createWebChannelTransport;
(function() {
	var h, aa = Object.defineProperty;
	function ba(a) {
		a = [
			"object" == typeof globalThis && globalThis,
			a,
			"object" == typeof window && window,
			"object" == typeof self && self,
			"object" == typeof commonjsGlobal && commonjsGlobal
		];
		for (var b = 0; b < a.length; ++b) {
			var c = a[b];
			if (c && c.Math == Math) return c;
		}
		throw Error("Cannot find global object");
	}
	var ca = ba(this);
	function da(a, b) {
		if (b) a: {
			var c = ca;
			a = a.split(".");
			for (var d = 0; d < a.length - 1; d++) {
				var e = a[d];
				if (!(e in c)) break a;
				c = c[e];
			}
			a = a[a.length - 1];
			d = c[a];
			b = b(d);
			b != d && b != null && aa(c, a, {
				configurable: !0,
				writable: !0,
				value: b
			});
		}
	}
	da("Symbol.dispose", function(a) {
		return a ? a : Symbol("Symbol.dispose");
	});
	da("Array.prototype.values", function(a) {
		return a ? a : function() {
			return this[Symbol.iterator]();
		};
	});
	da("Object.entries", function(a) {
		return a ? a : function(b) {
			var c = [], d;
			for (d in b) Object.prototype.hasOwnProperty.call(b, d) && c.push([d, b[d]]);
			return c;
		};
	});
	var ea = ea || {}, l = this || self;
	function n(a) {
		var b = typeof a;
		return b == "object" && a != null || b == "function";
	}
	function fa(a, b, c) {
		return a.call.apply(a.bind, arguments);
	}
	function p(a, b, c) {
		p = fa;
		return p.apply(null, arguments);
	}
	function ha(a, b) {
		var c = Array.prototype.slice.call(arguments, 1);
		return function() {
			var d = c.slice();
			d.push.apply(d, arguments);
			return a.apply(this, d);
		};
	}
	function t(a, b) {
		function c() {}
		c.prototype = b.prototype;
		a.Z = b.prototype;
		a.prototype = new c();
		a.prototype.constructor = a;
		a.Ob = function(d, e, f) {
			for (var g = Array(arguments.length - 2), k = 2; k < arguments.length; k++) g[k - 2] = arguments[k];
			return b.prototype[e].apply(d, g);
		};
	}
	var ia = typeof AsyncContext !== "undefined" && typeof AsyncContext.Snapshot === "function" ? (a) => a && AsyncContext.Snapshot.wrap(a) : (a) => a;
	function ja(a) {
		const b = a.length;
		if (b > 0) {
			const c = Array(b);
			for (let d = 0; d < b; d++) c[d] = a[d];
			return c;
		}
		return [];
	}
	function ka(a, b) {
		for (let d = 1; d < arguments.length; d++) {
			const e = arguments[d];
			var c = typeof e;
			c = c != "object" ? c : e ? Array.isArray(e) ? "array" : c : "null";
			if (c == "array" || c == "object" && typeof e.length == "number") {
				c = a.length || 0;
				const f = e.length || 0;
				a.length = c + f;
				for (let g = 0; g < f; g++) a[c + g] = e[g];
			} else a.push(e);
		}
	}
	class la {
		constructor(a, b) {
			this.i = a;
			this.j = b;
			this.h = 0;
			this.g = null;
		}
		get() {
			let a;
			this.h > 0 ? (this.h--, a = this.g, this.g = a.next, a.next = null) : a = this.i();
			return a;
		}
	}
	function ma(a) {
		l.setTimeout(() => {
			throw a;
		}, 0);
	}
	function na() {
		var a = oa;
		let b = null;
		a.g && (b = a.g, a.g = a.g.next, a.g || (a.h = null), b.next = null);
		return b;
	}
	class pa {
		constructor() {
			this.h = this.g = null;
		}
		add(a, b) {
			const c = qa.get();
			c.set(a, b);
			this.h ? this.h.next = c : this.g = c;
			this.h = c;
		}
	}
	var qa = new la(() => new ra(), (a) => a.reset());
	class ra {
		constructor() {
			this.next = this.g = this.h = null;
		}
		set(a, b) {
			this.h = a;
			this.g = b;
			this.next = null;
		}
		reset() {
			this.next = this.g = this.h = null;
		}
	}
	let u, v = !1, oa = new pa(), ta = () => {
		const a = Promise.resolve(void 0);
		u = () => {
			a.then(sa);
		};
	};
	function sa() {
		for (var a; a = na();) {
			try {
				a.h.call(a.g);
			} catch (c) {
				ma(c);
			}
			var b = qa;
			b.j(a);
			b.h < 100 && (b.h++, a.next = b.g, b.g = a);
		}
		v = !1;
	}
	function w() {
		this.u = this.u;
		this.C = this.C;
	}
	w.prototype.u = !1;
	w.prototype.dispose = function() {
		this.u || (this.u = !0, this.N());
	};
	w.prototype[Symbol.dispose] = function() {
		this.dispose();
	};
	w.prototype.N = function() {
		if (this.C) for (; this.C.length;) this.C.shift()();
	};
	function x(a, b) {
		this.type = a;
		this.g = this.target = b;
		this.defaultPrevented = !1;
	}
	x.prototype.h = function() {
		this.defaultPrevented = !0;
	};
	var ua = function() {
		if (!l.addEventListener || !Object.defineProperty) return !1;
		var a = !1, b = Object.defineProperty({}, "passive", { get: function() {
			a = !0;
		} });
		try {
			const c = () => {};
			l.addEventListener("test", c, b);
			l.removeEventListener("test", c, b);
		} catch (c) {}
		return a;
	}();
	function y(a) {
		return /^[\s\xa0]*$/.test(a);
	}
	function z(a, b) {
		x.call(this, a ? a.type : "");
		this.relatedTarget = this.g = this.target = null;
		this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;
		this.key = "";
		this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
		this.state = null;
		this.pointerId = 0;
		this.pointerType = "";
		this.i = null;
		a && this.init(a, b);
	}
	t(z, x);
	z.prototype.init = function(a, b) {
		const c = this.type = a.type, d = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null;
		this.target = a.target || a.srcElement;
		this.g = b;
		b = a.relatedTarget;
		b || (c == "mouseover" ? b = a.fromElement : c == "mouseout" && (b = a.toElement));
		this.relatedTarget = b;
		d ? (this.clientX = d.clientX !== void 0 ? d.clientX : d.pageX, this.clientY = d.clientY !== void 0 ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0) : (this.clientX = a.clientX !== void 0 ? a.clientX : a.pageX, this.clientY = a.clientY !== void 0 ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0);
		this.button = a.button;
		this.key = a.key || "";
		this.ctrlKey = a.ctrlKey;
		this.altKey = a.altKey;
		this.shiftKey = a.shiftKey;
		this.metaKey = a.metaKey;
		this.pointerId = a.pointerId || 0;
		this.pointerType = a.pointerType;
		this.state = a.state;
		this.i = a;
		a.defaultPrevented && z.Z.h.call(this);
	};
	z.prototype.h = function() {
		z.Z.h.call(this);
		const a = this.i;
		a.preventDefault ? a.preventDefault() : a.returnValue = !1;
	};
	var B = "closure_listenable_" + (Math.random() * 1e6 | 0);
	var va = 0;
	function wa(a, b, c, d, e) {
		this.listener = a;
		this.proxy = null;
		this.src = b;
		this.type = c;
		this.capture = !!d;
		this.ha = e;
		this.key = ++va;
		this.da = this.fa = !1;
	}
	function xa(a) {
		a.da = !0;
		a.listener = null;
		a.proxy = null;
		a.src = null;
		a.ha = null;
	}
	function ya(a, b, c) {
		for (const d in a) b.call(c, a[d], d, a);
	}
	function Aa(a, b) {
		for (const c in a) b.call(void 0, a[c], c, a);
	}
	function Ba(a) {
		const b = {};
		for (const c in a) b[c] = a[c];
		return b;
	}
	const Ca = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
	function Da(a, b) {
		let c, d;
		for (let e = 1; e < arguments.length; e++) {
			d = arguments[e];
			for (c in d) a[c] = d[c];
			for (let f = 0; f < Ca.length; f++) c = Ca[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
		}
	}
	function Ea(a) {
		this.src = a;
		this.g = {};
		this.h = 0;
	}
	Ea.prototype.add = function(a, b, c, d, e) {
		const f = a.toString();
		a = this.g[f];
		a || (a = this.g[f] = [], this.h++);
		const g = Fa(a, b, d, e);
		g > -1 ? (b = a[g], c || (b.fa = !1)) : (b = new wa(b, this.src, f, !!d, e), b.fa = c, a.push(b));
		return b;
	};
	function Ga(a, b) {
		const c = b.type;
		if (c in a.g) {
			var d = a.g[c], e = Array.prototype.indexOf.call(d, b, void 0), f;
			(f = e >= 0) && Array.prototype.splice.call(d, e, 1);
			f && (xa(b), a.g[c].length == 0 && (delete a.g[c], a.h--));
		}
	}
	function Fa(a, b, c, d) {
		for (let e = 0; e < a.length; ++e) {
			const f = a[e];
			if (!f.da && f.listener == b && f.capture == !!c && f.ha == d) return e;
		}
		return -1;
	}
	var Ha = "closure_lm_" + (Math.random() * 1e6 | 0), Ia = {};
	function Ka(a, b, c, d, e) {
		if (d && d.once) return La(a, b, c, d, e);
		if (Array.isArray(b)) {
			for (let f = 0; f < b.length; f++) Ka(a, b[f], c, d, e);
			return null;
		}
		c = Ma(c);
		return a && a[B] ? a.J(b, c, n(d) ? !!d.capture : !!d, e) : Na(a, b, c, !1, d, e);
	}
	function Na(a, b, c, d, e, f) {
		if (!b) throw Error("Invalid event type");
		const g = n(e) ? !!e.capture : !!e;
		let k = Oa(a);
		k || (a[Ha] = k = new Ea(a));
		c = k.add(b, c, d, g, f);
		if (c.proxy) return c;
		d = Pa();
		c.proxy = d;
		d.src = a;
		d.listener = c;
		if (a.addEventListener) ua || (e = g), e === void 0 && (e = !1), a.addEventListener(b.toString(), d, e);
		else if (a.attachEvent) a.attachEvent(Qa(b.toString()), d);
		else if (a.addListener && a.removeListener) a.addListener(d);
		else throw Error("addEventListener and attachEvent are unavailable.");
		return c;
	}
	function Pa() {
		function a(c) {
			return b.call(a.src, a.listener, c);
		}
		const b = Ra;
		return a;
	}
	function La(a, b, c, d, e) {
		if (Array.isArray(b)) {
			for (let f = 0; f < b.length; f++) La(a, b[f], c, d, e);
			return null;
		}
		c = Ma(c);
		return a && a[B] ? a.K(b, c, n(d) ? !!d.capture : !!d, e) : Na(a, b, c, !0, d, e);
	}
	function Sa(a, b, c, d, e) {
		if (Array.isArray(b)) for (var f = 0; f < b.length; f++) Sa(a, b[f], c, d, e);
		else (d = n(d) ? !!d.capture : !!d, c = Ma(c), a && a[B]) ? (a = a.i, f = String(b).toString(), f in a.g && (b = a.g[f], c = Fa(b, c, d, e), c > -1 && (xa(b[c]), Array.prototype.splice.call(b, c, 1), b.length == 0 && (delete a.g[f], a.h--)))) : a && (a = Oa(a)) && (b = a.g[b.toString()], a = -1, b && (a = Fa(b, c, d, e)), (c = a > -1 ? b[a] : null) && Ta(c));
	}
	function Ta(a) {
		if (typeof a !== "number" && a && !a.da) {
			var b = a.src;
			if (b && b[B]) Ga(b.i, a);
			else {
				var c = a.type, d = a.proxy;
				b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent ? b.detachEvent(Qa(c), d) : b.addListener && b.removeListener && b.removeListener(d);
				(c = Oa(b)) ? (Ga(c, a), c.h == 0 && (c.src = null, b[Ha] = null)) : xa(a);
			}
		}
	}
	function Qa(a) {
		return a in Ia ? Ia[a] : Ia[a] = "on" + a;
	}
	function Ra(a, b) {
		if (a.da) a = !0;
		else {
			b = new z(b, this);
			const c = a.listener, d = a.ha || a.src;
			a.fa && Ta(a);
			a = c.call(d, b);
		}
		return a;
	}
	function Oa(a) {
		a = a[Ha];
		return a instanceof Ea ? a : null;
	}
	var Ua = "__closure_events_fn_" + (Math.random() * 1e9 >>> 0);
	function Ma(a) {
		if (typeof a === "function") return a;
		a[Ua] || (a[Ua] = function(b) {
			return a.handleEvent(b);
		});
		return a[Ua];
	}
	function C() {
		w.call(this);
		this.i = new Ea(this);
		this.M = this;
		this.G = null;
	}
	t(C, w);
	C.prototype[B] = !0;
	C.prototype.removeEventListener = function(a, b, c, d) {
		Sa(this, a, b, c, d);
	};
	function D(a, b) {
		var c, d = a.G;
		if (d) for (c = []; d; d = d.G) c.push(d);
		a = a.M;
		d = b.type || b;
		if (typeof b === "string") b = new x(b, a);
		else if (b instanceof x) b.target = b.target || a;
		else {
			var e = b;
			b = new x(d, a);
			Da(b, e);
		}
		e = !0;
		let f, g;
		if (c) for (g = c.length - 1; g >= 0; g--) f = b.g = c[g], e = Va(f, d, !0, b) && e;
		f = b.g = a;
		e = Va(f, d, !0, b) && e;
		e = Va(f, d, !1, b) && e;
		if (c) for (g = 0; g < c.length; g++) f = b.g = c[g], e = Va(f, d, !1, b) && e;
	}
	C.prototype.N = function() {
		C.Z.N.call(this);
		if (this.i) {
			var a = this.i;
			for (const c in a.g) {
				const d = a.g[c];
				for (let e = 0; e < d.length; e++) xa(d[e]);
				delete a.g[c];
				a.h--;
			}
		}
		this.G = null;
	};
	C.prototype.J = function(a, b, c, d) {
		return this.i.add(String(a), b, !1, c, d);
	};
	C.prototype.K = function(a, b, c, d) {
		return this.i.add(String(a), b, !0, c, d);
	};
	function Va(a, b, c, d) {
		b = a.i.g[String(b)];
		if (!b) return !0;
		b = b.concat();
		let e = !0;
		for (let f = 0; f < b.length; ++f) {
			const g = b[f];
			if (g && !g.da && g.capture == c) {
				const k = g.listener, q = g.ha || g.src;
				g.fa && Ga(a.i, g);
				e = k.call(q, d) !== !1 && e;
			}
		}
		return e && !d.defaultPrevented;
	}
	function Wa(a, b) {
		if (typeof a !== "function") if (a && typeof a.handleEvent == "function") a = p(a.handleEvent, a);
		else throw Error("Invalid listener argument");
		return Number(b) > 2147483647 ? -1 : l.setTimeout(a, b || 0);
	}
	function Xa(a) {
		a.g = Wa(() => {
			a.g = null;
			a.i && (a.i = !1, Xa(a));
		}, a.l);
		const b = a.h;
		a.h = null;
		a.m.apply(null, b);
	}
	class Ya extends w {
		constructor(a, b) {
			super();
			this.m = a;
			this.l = b;
			this.h = null;
			this.i = !1;
			this.g = null;
		}
		j(a) {
			this.h = arguments;
			this.g ? this.i = !0 : Xa(this);
		}
		N() {
			super.N();
			this.g && (l.clearTimeout(this.g), this.g = null, this.i = !1, this.h = null);
		}
	}
	function E(a) {
		w.call(this);
		this.h = a;
		this.g = {};
	}
	t(E, w);
	var Za = [];
	function $a(a) {
		ya(a.g, function(b, c) {
			this.g.hasOwnProperty(c) && Ta(b);
		}, a);
		a.g = {};
	}
	E.prototype.N = function() {
		E.Z.N.call(this);
		$a(this);
	};
	E.prototype.handleEvent = function() {
		throw Error("EventHandler.handleEvent not implemented");
	};
	var ab = l.JSON.stringify;
	var cb = l.JSON.parse;
	var db = class {
		stringify(a) {
			return l.JSON.stringify(a, void 0);
		}
		parse(a) {
			return l.JSON.parse(a, void 0);
		}
	};
	function eb() {}
	function fb() {}
	var H = {
		OPEN: "a",
		hb: "b",
		ERROR: "c",
		tb: "d"
	};
	function gb() {
		x.call(this, "d");
	}
	t(gb, x);
	function hb() {
		x.call(this, "c");
	}
	t(hb, x);
	var I = {}, ib = null;
	function jb() {
		return ib = ib || new C();
	}
	I.Ia = "serverreachability";
	function kb(a) {
		x.call(this, I.Ia, a);
	}
	t(kb, x);
	function lb(a) {
		const b = jb();
		D(b, new kb(b));
	}
	I.STAT_EVENT = "statevent";
	function mb(a, b) {
		x.call(this, I.STAT_EVENT, a);
		this.stat = b;
	}
	t(mb, x);
	function J(a) {
		const b = jb();
		D(b, new mb(b, a));
	}
	I.Ja = "timingevent";
	function nb(a, b) {
		x.call(this, I.Ja, a);
		this.size = b;
	}
	t(nb, x);
	function ob(a, b) {
		if (typeof a !== "function") throw Error("Fn must not be null and must be a function");
		return l.setTimeout(function() {
			a();
		}, b);
	}
	function pb() {
		this.g = !0;
	}
	pb.prototype.ua = function() {
		this.g = !1;
	};
	function qb(a, b, c, d, e, f) {
		a.info(function() {
			if (a.g) if (f) {
				var g = "";
				var k = f.split("&");
				for (let m = 0; m < k.length; m++) {
					var q = k[m].split("=");
					if (q.length > 1) {
						const r = q[0];
						q = q[1];
						const A = r.split("_");
						g = A.length >= 2 && A[1] == "type" ? g + (r + "=" + q + "&") : g + (r + "=redacted&");
					}
				}
			} else g = null;
			else g = f;
			return "XMLHTTP REQ (" + d + ") [attempt " + e + "]: " + b + "\n" + c + "\n" + g;
		});
	}
	function rb(a, b, c, d, e, f, g) {
		a.info(function() {
			return "XMLHTTP RESP (" + d + ") [ attempt " + e + "]: " + b + "\n" + c + "\n" + f + " " + g;
		});
	}
	function K(a, b, c, d) {
		a.info(function() {
			return "XMLHTTP TEXT (" + b + "): " + sb(a, c) + (d ? " " + d : "");
		});
	}
	function tb(a, b) {
		a.info(function() {
			return "TIMEOUT: " + b;
		});
	}
	pb.prototype.info = function() {};
	function sb(a, b) {
		if (!a.g) return b;
		if (!b) return null;
		try {
			const f = JSON.parse(b);
			if (f) {
				for (a = 0; a < f.length; a++) if (Array.isArray(f[a])) {
					var c = f[a];
					if (!(c.length < 2)) {
						var d = c[1];
						if (Array.isArray(d) && !(d.length < 1)) {
							var e = d[0];
							if (e != "noop" && e != "stop" && e != "close") for (let g = 1; g < d.length; g++) d[g] = "";
						}
					}
				}
			}
			return ab(f);
		} catch (f) {
			return b;
		}
	}
	var ub = {
		NO_ERROR: 0,
		cb: 1,
		qb: 2,
		pb: 3,
		kb: 4,
		ob: 5,
		rb: 6,
		Ga: 7,
		TIMEOUT: 8,
		ub: 9
	};
	var vb = {
		ib: "complete",
		Fb: "success",
		ERROR: "error",
		Ga: "abort",
		xb: "ready",
		yb: "readystatechange",
		TIMEOUT: "timeout",
		sb: "incrementaldata",
		wb: "progress",
		lb: "downloadprogress",
		Nb: "uploadprogress"
	};
	var wb;
	function xb() {}
	t(xb, eb);
	xb.prototype.g = function() {
		return new XMLHttpRequest();
	};
	wb = new xb();
	function L(a) {
		return encodeURIComponent(String(a));
	}
	function yb(a) {
		var b = 1;
		a = a.split(":");
		const c = [];
		for (; b > 0 && a.length;) c.push(a.shift()), b--;
		a.length && c.push(a.join(":"));
		return c;
	}
	function N(a, b, c, d) {
		this.j = a;
		this.i = b;
		this.l = c;
		this.S = d || 1;
		this.V = new E(this);
		this.H = 45e3;
		this.J = null;
		this.o = !1;
		this.u = this.B = this.A = this.M = this.F = this.T = this.D = null;
		this.G = [];
		this.g = null;
		this.C = 0;
		this.m = this.v = null;
		this.X = -1;
		this.K = !1;
		this.P = 0;
		this.O = null;
		this.W = this.L = this.U = this.R = !1;
		this.h = new zb();
	}
	function zb() {
		this.i = null;
		this.g = "";
		this.h = !1;
	}
	var Ab = {}, Bb = {};
	function Cb(a, b, c) {
		a.M = 1;
		a.A = Db(O(b));
		a.u = c;
		a.R = !0;
		Eb(a, null);
	}
	function Eb(a, b) {
		a.F = Date.now();
		Fb(a);
		a.B = O(a.A);
		var c = a.B, d = a.S;
		Array.isArray(d) || (d = [String(d)]);
		Gb(c.i, "t", d);
		a.C = 0;
		c = a.j.L;
		a.h = new zb();
		a.g = Hb(a.j, c ? b : null, !a.u);
		a.P > 0 && (a.O = new Ya(p(a.Y, a, a.g), a.P));
		b = a.V;
		c = a.g;
		d = a.ba;
		var e = "readystatechange";
		Array.isArray(e) || (e && (Za[0] = e.toString()), e = Za);
		for (let f = 0; f < e.length; f++) {
			const g = Ka(c, e[f], d || b.handleEvent, !1, b.h || b);
			if (!g) break;
			b.g[g.key] = g;
		}
		b = a.J ? Ba(a.J) : {};
		a.u ? (a.v || (a.v = "POST"), b["Content-Type"] = "application/x-www-form-urlencoded", a.g.ea(a.B, a.v, a.u, b)) : (a.v = "GET", a.g.ea(a.B, a.v, null, b));
		lb();
		qb(a.i, a.v, a.B, a.l, a.S, a.u);
	}
	N.prototype.ba = function(a) {
		a = a.target;
		const b = this.O;
		b && P(a) == 3 ? b.j() : this.Y(a);
	};
	N.prototype.Y = function(a) {
		try {
			if (a == this.g) a: {
				const k = P(this.g), q = this.g.ya(), m = this.g.ca();
				if (!(k < 3) && (k != 3 || this.g && (this.h.h || this.g.la() || Ib(this.g)))) {
					this.K || k != 4 || q == 7 || (q == 8 || m <= 0 ? lb(3) : lb(2));
					Jb(this);
					var b = this.g.ca();
					this.X = b;
					var c = Kb(this);
					this.o = b == 200;
					rb(this.i, this.v, this.B, this.l, this.S, k, b);
					if (this.o) {
						if (this.U && !this.L) {
							b: {
								if (this.g) {
									var d, e = this.g;
									if ((d = e.g ? e.g.getResponseHeader("X-HTTP-Initial-Response") : null) && !y(d)) {
										var f = d;
										break b;
									}
								}
								f = null;
							}
							if (a = f) K(this.i, this.l, a, "Initial handshake response via X-HTTP-Initial-Response"), this.L = !0, Lb(this, a);
							else {
								this.o = !1;
								this.m = 3;
								J(12);
								Q(this);
								Mb(this);
								break a;
							}
						}
						if (this.R) {
							a = !0;
							let r;
							for (; !this.K && this.C < c.length;) if (r = Nb(this, c), r == Bb) {
								k == 4 && (this.m = 4, J(14), a = !1);
								K(this.i, this.l, null, "[Incomplete Response]");
								break;
							} else if (r == Ab) {
								this.m = 4;
								J(15);
								K(this.i, this.l, c, "[Invalid Chunk]");
								a = !1;
								break;
							} else K(this.i, this.l, r, null), Lb(this, r);
							Ob(this) && this.C != 0 && (this.h.g = this.h.g.slice(this.C), this.C = 0);
							k != 4 || c.length != 0 || this.h.h || (this.m = 1, J(16), a = !1);
							this.o = this.o && a;
							if (!a) K(this.i, this.l, c, "[Invalid Chunked Response]"), Q(this), Mb(this);
							else if (c.length > 0 && !this.W) {
								this.W = !0;
								var g = this.j;
								g.g == this && g.aa && !g.P && (g.j.info("Great, no buffering proxy detected. Bytes received: " + c.length), Pb(g), g.P = !0, J(11));
							}
						} else K(this.i, this.l, c, null), Lb(this, c);
						k == 4 && Q(this);
						this.o && !this.K && (k == 4 ? Qb(this.j, this) : (this.o = !1, Fb(this)));
					} else Rb(this.g), b == 400 && c.indexOf("Unknown SID") > 0 ? (this.m = 3, J(12)) : (this.m = 0, J(13)), Q(this), Mb(this);
				}
			}
		} catch (k) {}
	};
	function Kb(a) {
		if (!Ob(a)) return a.g.la();
		const b = Ib(a.g);
		if (b === "") return "";
		let c = "";
		const d = b.length, e = P(a.g) == 4;
		if (!a.h.i) {
			if (typeof TextDecoder === "undefined") return Q(a), Mb(a), "";
			a.h.i = new l.TextDecoder();
		}
		for (let f = 0; f < d; f++) a.h.h = !0, c += a.h.i.decode(b[f], { stream: !(e && f == d - 1) });
		b.length = 0;
		a.h.g += c;
		a.C = 0;
		return a.h.g;
	}
	function Ob(a) {
		return a.g ? a.v == "GET" && a.M != 2 && a.j.Aa : !1;
	}
	function Nb(a, b) {
		var c = a.C, d = b.indexOf("\n", c);
		if (d == -1) return Bb;
		c = Number(b.substring(c, d));
		if (isNaN(c)) return Ab;
		d += 1;
		if (d + c > b.length) return Bb;
		b = b.slice(d, d + c);
		a.C = d + c;
		return b;
	}
	N.prototype.cancel = function() {
		this.K = !0;
		Q(this);
	};
	function Fb(a) {
		a.T = Date.now() + a.H;
		Sb(a, a.H);
	}
	function Sb(a, b) {
		if (a.D != null) throw Error("WatchDog timer not null");
		a.D = ob(p(a.aa, a), b);
	}
	function Jb(a) {
		a.D && (l.clearTimeout(a.D), a.D = null);
	}
	N.prototype.aa = function() {
		this.D = null;
		const a = Date.now();
		a - this.T >= 0 ? (tb(this.i, this.B), this.M != 2 && (lb(), J(17)), Q(this), this.m = 2, Mb(this)) : Sb(this, this.T - a);
	};
	function Mb(a) {
		a.j.I == 0 || a.K || Qb(a.j, a);
	}
	function Q(a) {
		Jb(a);
		var b = a.O;
		b && typeof b.dispose == "function" && b.dispose();
		a.O = null;
		$a(a.V);
		a.g && (b = a.g, a.g = null, b.abort(), b.dispose());
	}
	function Lb(a, b) {
		try {
			var c = a.j;
			if (c.I != 0 && (c.g == a || Tb(c.h, a))) {
				if (!a.L && Tb(c.h, a) && c.I == 3) {
					try {
						var d = c.Ba.g.parse(b);
					} catch (m) {
						d = null;
					}
					if (Array.isArray(d) && d.length == 3) {
						var e = d;
						if (e[0] == 0) {
							a: if (!c.v) {
								if (c.g) if (c.g.F + 3e3 < a.F) Ub(c), Vb(c);
								else break a;
								Wb(c);
								J(18);
							}
						} else c.xa = e[1], 0 < c.xa - c.K && e[2] < 37500 && c.F && c.A == 0 && !c.C && (c.C = ob(p(c.Va, c), 6e3));
						Xb(c.h) <= 1 && c.ta && (c.ta = void 0);
					} else R(c, 11);
				} else if ((a.L || c.g == a) && Ub(c), !y(b)) for (e = c.Ba.g.parse(b), b = 0; b < e.length; b++) {
					let m = e[b];
					const r = m[0];
					if (!(r <= c.K)) if (c.K = r, m = m[1], c.I == 2) if (m[0] == "c") {
						c.M = m[1];
						c.ba = m[2];
						const A = m[3];
						A != null && (c.ka = A, c.j.info("VER=" + c.ka));
						const M = m[4];
						M != null && (c.za = M, c.j.info("SVER=" + c.za));
						const F = m[5];
						F != null && typeof F === "number" && F > 0 && (d = 1.5 * F, c.O = d, c.j.info("backChannelRequestTimeoutMs_=" + d));
						d = c;
						const G = a.g;
						if (G) {
							const za = G.g ? G.g.getResponseHeader("X-Client-Wire-Protocol") : null;
							if (za) {
								var f = d.h;
								f.g || za.indexOf("spdy") == -1 && za.indexOf("quic") == -1 && za.indexOf("h2") == -1 || (f.j = f.l, f.g = /* @__PURE__ */ new Set(), f.h && (Yb(f, f.h), f.h = null));
							}
							if (d.G) {
								const bb = G.g ? G.g.getResponseHeader("X-HTTP-Session-Id") : null;
								bb && (d.wa = bb, S(d.J, d.G, bb));
							}
						}
						c.I = 3;
						c.l && c.l.ra();
						c.aa && (c.T = Date.now() - a.F, c.j.info("Handshake RTT: " + c.T + "ms"));
						d = c;
						var g = a;
						d.na = Zb(d, d.L ? d.ba : null, d.W);
						if (g.L) {
							$b(d.h, g);
							var k = g, q = d.O;
							q && (k.H = q);
							k.D && (Jb(k), Fb(k));
							d.g = g;
						} else ac(d);
						c.i.length > 0 && bc(c);
					} else m[0] != "stop" && m[0] != "close" || R(c, 7);
					else c.I == 3 && (m[0] == "stop" || m[0] == "close" ? m[0] == "stop" ? R(c, 7) : cc(c) : m[0] != "noop" && c.l && c.l.qa(m), c.A = 0);
				}
			}
			lb(4);
		} catch (m) {}
	}
	var dc = class {
		constructor(a, b) {
			this.g = a;
			this.map = b;
		}
	};
	function ec(a) {
		this.l = a || 10;
		l.PerformanceNavigationTiming ? (a = l.performance.getEntriesByType("navigation"), a = a.length > 0 && (a[0].nextHopProtocol == "hq" || a[0].nextHopProtocol == "h2")) : a = !!(l.chrome && l.chrome.loadTimes && l.chrome.loadTimes() && l.chrome.loadTimes().wasFetchedViaSpdy);
		this.j = a ? this.l : 1;
		this.g = null;
		this.j > 1 && (this.g = /* @__PURE__ */ new Set());
		this.h = null;
		this.i = [];
	}
	function fc(a) {
		return a.h ? !0 : a.g ? a.g.size >= a.j : !1;
	}
	function Xb(a) {
		return a.h ? 1 : a.g ? a.g.size : 0;
	}
	function Tb(a, b) {
		return a.h ? a.h == b : a.g ? a.g.has(b) : !1;
	}
	function Yb(a, b) {
		a.g ? a.g.add(b) : a.h = b;
	}
	function $b(a, b) {
		a.h && a.h == b ? a.h = null : a.g && a.g.has(b) && a.g.delete(b);
	}
	ec.prototype.cancel = function() {
		this.i = hc(this);
		if (this.h) this.h.cancel(), this.h = null;
		else if (this.g && this.g.size !== 0) {
			for (const a of this.g.values()) a.cancel();
			this.g.clear();
		}
	};
	function hc(a) {
		if (a.h != null) return a.i.concat(a.h.G);
		if (a.g != null && a.g.size !== 0) {
			let b = a.i;
			for (const c of a.g.values()) b = b.concat(c.G);
			return b;
		}
		return ja(a.i);
	}
	var ic = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");
	function jc(a, b) {
		if (a) {
			a = a.split("&");
			for (let c = 0; c < a.length; c++) {
				const d = a[c].indexOf("=");
				let e, f = null;
				d >= 0 ? (e = a[c].substring(0, d), f = a[c].substring(d + 1)) : e = a[c];
				b(e, f ? decodeURIComponent(f.replace(/\+/g, " ")) : "");
			}
		}
	}
	function T(a) {
		this.g = this.o = this.j = "";
		this.u = null;
		this.m = this.h = "";
		this.l = !1;
		let b;
		a instanceof T ? (this.l = a.l, kc(this, a.j), this.o = a.o, this.g = a.g, lc(this, a.u), this.h = a.h, mc(this, nc(a.i)), this.m = a.m) : a && (b = String(a).match(ic)) ? (this.l = !1, kc(this, b[1] || "", !0), this.o = oc(b[2] || ""), this.g = oc(b[3] || "", !0), lc(this, b[4]), this.h = oc(b[5] || "", !0), mc(this, b[6] || "", !0), this.m = oc(b[7] || "")) : (this.l = !1, this.i = new pc(null, this.l));
	}
	T.prototype.toString = function() {
		const a = [];
		var b = this.j;
		b && a.push(qc(b, rc, !0), ":");
		var c = this.g;
		if (c || b == "file") a.push("//"), (b = this.o) && a.push(qc(b, rc, !0), "@"), a.push(L(c).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.u, c != null && a.push(":", String(c));
		if (c = this.h) this.g && c.charAt(0) != "/" && a.push("/"), a.push(qc(c, c.charAt(0) == "/" ? sc : tc, !0));
		(c = this.i.toString()) && a.push("?", c);
		(c = this.m) && a.push("#", qc(c, uc));
		return a.join("");
	};
	T.prototype.resolve = function(a) {
		const b = O(this);
		let c = !!a.j;
		c ? kc(b, a.j) : c = !!a.o;
		c ? b.o = a.o : c = !!a.g;
		c ? b.g = a.g : c = a.u != null;
		var d = a.h;
		if (c) lc(b, a.u);
		else if (c = !!a.h) {
			if (d.charAt(0) != "/") if (this.g && !this.h) d = "/" + d;
			else {
				var e = b.h.lastIndexOf("/");
				e != -1 && (d = b.h.slice(0, e + 1) + d);
			}
			e = d;
			if (e == ".." || e == ".") d = "";
			else if (e.indexOf("./") != -1 || e.indexOf("/.") != -1) {
				d = e.lastIndexOf("/", 0) == 0;
				e = e.split("/");
				const f = [];
				for (let g = 0; g < e.length;) {
					const k = e[g++];
					k == "." ? d && g == e.length && f.push("") : k == ".." ? ((f.length > 1 || f.length == 1 && f[0] != "") && f.pop(), d && g == e.length && f.push("")) : (f.push(k), d = !0);
				}
				d = f.join("/");
			} else d = e;
		}
		c ? b.h = d : c = a.i.toString() !== "";
		c ? mc(b, nc(a.i)) : c = !!a.m;
		c && (b.m = a.m);
		return b;
	};
	function O(a) {
		return new T(a);
	}
	function kc(a, b, c) {
		a.j = c ? oc(b, !0) : b;
		a.j && (a.j = a.j.replace(/:$/, ""));
	}
	function lc(a, b) {
		if (b) {
			b = Number(b);
			if (isNaN(b) || b < 0) throw Error("Bad port number " + b);
			a.u = b;
		} else a.u = null;
	}
	function mc(a, b, c) {
		b instanceof pc ? (a.i = b, vc(a.i, a.l)) : (c || (b = qc(b, wc)), a.i = new pc(b, a.l));
	}
	function S(a, b, c) {
		a.i.set(b, c);
	}
	function Db(a) {
		S(a, "zx", Math.floor(Math.random() * 2147483648).toString(36) + Math.abs(Math.floor(Math.random() * 2147483648) ^ Date.now()).toString(36));
		return a;
	}
	function oc(a, b) {
		return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : "";
	}
	function qc(a, b, c) {
		return typeof a === "string" ? (a = encodeURI(a).replace(b, xc), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null;
	}
	function xc(a) {
		a = a.charCodeAt(0);
		return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16);
	}
	var rc = /[#\/\?@]/g, tc = /[#\?:]/g, sc = /[#\?]/g, wc = /[#\?@]/g, uc = /#/g;
	function pc(a, b) {
		this.h = this.g = null;
		this.i = a || null;
		this.j = !!b;
	}
	function U(a) {
		a.g || (a.g = /* @__PURE__ */ new Map(), a.h = 0, a.i && jc(a.i, function(b, c) {
			a.add(decodeURIComponent(b.replace(/\+/g, " ")), c);
		}));
	}
	h = pc.prototype;
	h.add = function(a, b) {
		U(this);
		this.i = null;
		a = V(this, a);
		let c = this.g.get(a);
		c || this.g.set(a, c = []);
		c.push(b);
		this.h += 1;
		return this;
	};
	function yc(a, b) {
		U(a);
		b = V(a, b);
		a.g.has(b) && (a.i = null, a.h -= a.g.get(b).length, a.g.delete(b));
	}
	function zc(a, b) {
		U(a);
		b = V(a, b);
		return a.g.has(b);
	}
	h.forEach = function(a, b) {
		U(this);
		this.g.forEach(function(c, d) {
			c.forEach(function(e) {
				a.call(b, e, d, this);
			}, this);
		}, this);
	};
	function Ac(a, b) {
		U(a);
		let c = [];
		if (typeof b === "string") zc(a, b) && (c = c.concat(a.g.get(V(a, b))));
		else for (a = Array.from(a.g.values()), b = 0; b < a.length; b++) c = c.concat(a[b]);
		return c;
	}
	h.set = function(a, b) {
		U(this);
		this.i = null;
		a = V(this, a);
		zc(this, a) && (this.h -= this.g.get(a).length);
		this.g.set(a, [b]);
		this.h += 1;
		return this;
	};
	h.get = function(a, b) {
		if (!a) return b;
		a = Ac(this, a);
		return a.length > 0 ? String(a[0]) : b;
	};
	function Gb(a, b, c) {
		yc(a, b);
		c.length > 0 && (a.i = null, a.g.set(V(a, b), ja(c)), a.h += c.length);
	}
	h.toString = function() {
		if (this.i) return this.i;
		if (!this.g) return "";
		const a = [], b = Array.from(this.g.keys());
		for (let d = 0; d < b.length; d++) {
			var c = b[d];
			const e = L(c);
			c = Ac(this, c);
			for (let f = 0; f < c.length; f++) {
				let g = e;
				c[f] !== "" && (g += "=" + L(c[f]));
				a.push(g);
			}
		}
		return this.i = a.join("&");
	};
	function nc(a) {
		const b = new pc();
		b.i = a.i;
		a.g && (b.g = new Map(a.g), b.h = a.h);
		return b;
	}
	function V(a, b) {
		b = String(b);
		a.j && (b = b.toLowerCase());
		return b;
	}
	function vc(a, b) {
		b && !a.j && (U(a), a.i = null, a.g.forEach(function(c, d) {
			const e = d.toLowerCase();
			d != e && (yc(this, d), Gb(this, e, c));
		}, a));
		a.j = b;
	}
	function Bc(a, b) {
		const c = new pb();
		if (l.Image) {
			const d = new Image();
			d.onload = ha(W, c, "TestLoadImage: loaded", !0, b, d);
			d.onerror = ha(W, c, "TestLoadImage: error", !1, b, d);
			d.onabort = ha(W, c, "TestLoadImage: abort", !1, b, d);
			d.ontimeout = ha(W, c, "TestLoadImage: timeout", !1, b, d);
			l.setTimeout(function() {
				if (d.ontimeout) d.ontimeout();
			}, 1e4);
			d.src = a;
		} else b(!1);
	}
	function Cc(a, b) {
		const c = new pb(), d = new AbortController(), e = setTimeout(() => {
			d.abort();
			W(c, "TestPingServer: timeout", !1, b);
		}, 1e4);
		fetch(a, { signal: d.signal }).then((f) => {
			clearTimeout(e);
			f.ok ? W(c, "TestPingServer: ok", !0, b) : W(c, "TestPingServer: server error", !1, b);
		}).catch(() => {
			clearTimeout(e);
			W(c, "TestPingServer: error", !1, b);
		});
	}
	function W(a, b, c, d, e) {
		try {
			e && (e.onload = null, e.onerror = null, e.onabort = null, e.ontimeout = null), d(c);
		} catch (f) {}
	}
	function Dc() {
		this.g = new db();
	}
	function Ec(a) {
		this.i = a.Sb || null;
		this.h = a.ab || !1;
	}
	t(Ec, eb);
	Ec.prototype.g = function() {
		return new Fc(this.i, this.h);
	};
	function Fc(a, b) {
		C.call(this);
		this.H = a;
		this.o = b;
		this.m = void 0;
		this.status = this.readyState = 0;
		this.responseType = this.responseText = this.response = this.statusText = "";
		this.onreadystatechange = null;
		this.A = new Headers();
		this.h = null;
		this.F = "GET";
		this.D = "";
		this.g = !1;
		this.B = this.j = this.l = null;
		this.v = new AbortController();
	}
	t(Fc, C);
	h = Fc.prototype;
	h.open = function(a, b) {
		if (this.readyState != 0) throw this.abort(), Error("Error reopening a connection");
		this.F = a;
		this.D = b;
		this.readyState = 1;
		Gc(this);
	};
	h.send = function(a) {
		if (this.readyState != 1) throw this.abort(), Error("need to call open() first. ");
		if (this.v.signal.aborted) throw this.abort(), Error("Request was aborted.");
		this.g = !0;
		const b = {
			headers: this.A,
			method: this.F,
			credentials: this.m,
			cache: void 0,
			signal: this.v.signal
		};
		a && (b.body = a);
		(this.H || l).fetch(new Request(this.D, b)).then(this.Pa.bind(this), this.ga.bind(this));
	};
	h.abort = function() {
		this.response = this.responseText = "";
		this.A = new Headers();
		this.status = 0;
		this.v.abort();
		this.j && this.j.cancel("Request was aborted.").catch(() => {});
		this.readyState >= 1 && this.g && this.readyState != 4 && (this.g = !1, Hc(this));
		this.readyState = 0;
	};
	h.Pa = function(a) {
		if (this.g && (this.l = a, this.h || (this.status = this.l.status, this.statusText = this.l.statusText, this.h = a.headers, this.readyState = 2, Gc(this)), this.g && (this.readyState = 3, Gc(this), this.g))) if (this.responseType === "arraybuffer") a.arrayBuffer().then(this.Na.bind(this), this.ga.bind(this));
		else if (typeof l.ReadableStream !== "undefined" && "body" in a) {
			this.j = a.body.getReader();
			if (this.o) {
				if (this.responseType) throw Error("responseType must be empty for \"streamBinaryChunks\" mode responses.");
				this.response = [];
			} else this.response = this.responseText = "", this.B = new TextDecoder();
			Ic(this);
		} else a.text().then(this.Oa.bind(this), this.ga.bind(this));
	};
	function Ic(a) {
		a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a));
	}
	h.Ma = function(a) {
		if (this.g) {
			if (this.o && a.value) this.response.push(a.value);
			else if (!this.o) {
				var b = a.value ? a.value : new Uint8Array(0);
				if (b = this.B.decode(b, { stream: !a.done })) this.response = this.responseText += b;
			}
			a.done ? Hc(this) : Gc(this);
			this.readyState == 3 && Ic(this);
		}
	};
	h.Oa = function(a) {
		this.g && (this.response = this.responseText = a, Hc(this));
	};
	h.Na = function(a) {
		this.g && (this.response = a, Hc(this));
	};
	h.ga = function() {
		this.g && Hc(this);
	};
	function Hc(a) {
		a.readyState = 4;
		a.l = null;
		a.j = null;
		a.B = null;
		Gc(a);
	}
	h.setRequestHeader = function(a, b) {
		this.A.append(a, b);
	};
	h.getResponseHeader = function(a) {
		return this.h ? this.h.get(a.toLowerCase()) || "" : "";
	};
	h.getAllResponseHeaders = function() {
		if (!this.h) return "";
		const a = [], b = this.h.entries();
		for (var c = b.next(); !c.done;) c = c.value, a.push(c[0] + ": " + c[1]), c = b.next();
		return a.join("\r\n");
	};
	function Gc(a) {
		a.onreadystatechange && a.onreadystatechange.call(a);
	}
	Object.defineProperty(Fc.prototype, "withCredentials", {
		get: function() {
			return this.m === "include";
		},
		set: function(a) {
			this.m = a ? "include" : "same-origin";
		}
	});
	function Jc(a) {
		let b = "";
		ya(a, function(c, d) {
			b += d;
			b += ":";
			b += c;
			b += "\r\n";
		});
		return b;
	}
	function Kc(a, b, c) {
		a: {
			for (d in c) {
				var d = !1;
				break a;
			}
			d = !0;
		}
		d || (c = Jc(c), typeof a === "string" ? c != null && L(c) : S(a, b, c));
	}
	function X(a) {
		C.call(this);
		this.headers = /* @__PURE__ */ new Map();
		this.L = a || null;
		this.h = !1;
		this.g = null;
		this.D = "";
		this.o = 0;
		this.l = "";
		this.j = this.B = this.v = this.A = !1;
		this.m = null;
		this.F = "";
		this.H = !1;
	}
	t(X, C);
	var Lc = /^https?$/i, Mc = ["POST", "PUT"];
	h = X.prototype;
	h.Fa = function(a) {
		this.H = a;
	};
	h.ea = function(a, b, c, d) {
		if (this.g) throw Error("[goog.net.XhrIo] Object is active with another request=" + this.D + "; newUri=" + a);
		b = b ? b.toUpperCase() : "GET";
		this.D = a;
		this.l = "";
		this.o = 0;
		this.A = !1;
		this.h = !0;
		this.g = this.L ? this.L.g() : wb.g();
		this.g.onreadystatechange = ia(p(this.Ca, this));
		try {
			this.B = !0, this.g.open(b, String(a), !0), this.B = !1;
		} catch (f) {
			Nc(this, f);
			return;
		}
		a = c || "";
		c = new Map(this.headers);
		if (d) if (Object.getPrototypeOf(d) === Object.prototype) for (var e in d) c.set(e, d[e]);
		else if (typeof d.keys === "function" && typeof d.get === "function") for (const f of d.keys()) c.set(f, d.get(f));
		else throw Error("Unknown input type for opt_headers: " + String(d));
		d = Array.from(c.keys()).find((f) => "content-type" == f.toLowerCase());
		e = l.FormData && a instanceof l.FormData;
		!(Array.prototype.indexOf.call(Mc, b, void 0) >= 0) || d || e || c.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
		for (const [f, g] of c) this.g.setRequestHeader(f, g);
		this.F && (this.g.responseType = this.F);
		"withCredentials" in this.g && this.g.withCredentials !== this.H && (this.g.withCredentials = this.H);
		try {
			this.m && (clearTimeout(this.m), this.m = null), this.v = !0, this.g.send(a), this.v = !1;
		} catch (f) {
			Nc(this, f);
		}
	};
	function Nc(a, b) {
		a.h = !1;
		a.g && (a.j = !0, a.g.abort(), a.j = !1);
		a.l = b;
		a.o = 5;
		Oc(a);
		Pc(a);
	}
	function Oc(a) {
		a.A || (a.A = !0, D(a, "complete"), D(a, "error"));
	}
	h.abort = function(a) {
		this.g && this.h && (this.h = !1, this.j = !0, this.g.abort(), this.j = !1, this.o = a || 7, D(this, "complete"), D(this, "abort"), Pc(this));
	};
	h.N = function() {
		this.g && (this.h && (this.h = !1, this.j = !0, this.g.abort(), this.j = !1), Pc(this, !0));
		X.Z.N.call(this);
	};
	h.Ca = function() {
		this.u || (this.B || this.v || this.j ? Qc(this) : this.Xa());
	};
	h.Xa = function() {
		Qc(this);
	};
	function Qc(a) {
		if (a.h && typeof ea != "undefined") {
			if (a.v && P(a) == 4) setTimeout(a.Ca.bind(a), 0);
			else if (D(a, "readystatechange"), P(a) == 4) {
				a.h = !1;
				try {
					const f = a.ca();
					a: switch (f) {
						case 200:
						case 201:
						case 202:
						case 204:
						case 206:
						case 304:
						case 1223:
							var b = !0;
							break a;
						default: b = !1;
					}
					var c;
					if (!(c = b)) {
						var d;
						if (d = f === 0) {
							let g = String(a.D).match(ic)[1] || null;
							!g && l.self && l.self.location && (g = l.self.location.protocol.slice(0, -1));
							d = !Lc.test(g ? g.toLowerCase() : "");
						}
						c = d;
					}
					if (c) D(a, "complete"), D(a, "success");
					else {
						a.o = 6;
						try {
							var e = P(a) > 2 ? a.g.statusText : "";
						} catch (g) {
							e = "";
						}
						a.l = e + " [" + a.ca() + "]";
						Oc(a);
					}
				} finally {
					Pc(a);
				}
			}
		}
	}
	function Pc(a, b) {
		if (a.g) {
			a.m && (clearTimeout(a.m), a.m = null);
			const c = a.g;
			a.g = null;
			b || D(a, "ready");
			try {
				c.onreadystatechange = null;
			} catch (d) {}
		}
	}
	h.isActive = function() {
		return !!this.g;
	};
	function P(a) {
		return a.g ? a.g.readyState : 0;
	}
	h.ca = function() {
		try {
			return P(this) > 2 ? this.g.status : -1;
		} catch (a) {
			return -1;
		}
	};
	h.la = function() {
		try {
			return this.g ? this.g.responseText : "";
		} catch (a) {
			return "";
		}
	};
	h.La = function(a) {
		if (this.g) {
			var b = this.g.responseText;
			a && b.indexOf(a) == 0 && (b = b.substring(a.length));
			return cb(b);
		}
	};
	function Ib(a) {
		try {
			if (!a.g) return null;
			if ("response" in a.g) return a.g.response;
			switch (a.F) {
				case "":
				case "text": return a.g.responseText;
				case "arraybuffer": if ("mozResponseArrayBuffer" in a.g) return a.g.mozResponseArrayBuffer;
			}
			return null;
		} catch (b) {
			return null;
		}
	}
	function Rb(a) {
		const b = {};
		a = (a.g && P(a) >= 2 ? a.g.getAllResponseHeaders() || "" : "").split("\r\n");
		for (let d = 0; d < a.length; d++) {
			if (y(a[d])) continue;
			var c = yb(a[d]);
			const e = c[0];
			c = c[1];
			if (typeof c !== "string") continue;
			c = c.trim();
			const f = b[e] || [];
			b[e] = f;
			f.push(c);
		}
		Aa(b, function(d) {
			return d.join(", ");
		});
	}
	h.ya = function() {
		return this.o;
	};
	h.Ha = function() {
		return typeof this.l === "string" ? this.l : String(this.l);
	};
	function Rc(a, b, c) {
		return c && c.internalChannelParams ? c.internalChannelParams[a] || b : b;
	}
	function Sc(a) {
		this.za = 0;
		this.i = [];
		this.j = new pb();
		this.ba = this.na = this.J = this.W = this.g = this.wa = this.G = this.H = this.u = this.U = this.o = null;
		this.Ya = this.V = 0;
		this.Sa = Rc("failFast", !1, a);
		this.F = this.C = this.v = this.m = this.l = null;
		this.X = !0;
		this.xa = this.K = -1;
		this.Y = this.A = this.D = 0;
		this.Qa = Rc("baseRetryDelayMs", 5e3, a);
		this.Za = Rc("retryDelaySeedMs", 1e4, a);
		this.Ta = Rc("forwardChannelMaxRetries", 2, a);
		this.va = Rc("forwardChannelRequestTimeoutMs", 2e4, a);
		this.ma = a && a.xmlHttpFactory || void 0;
		this.Ua = a && a.Rb || void 0;
		this.Aa = a && a.useFetchStreams || !1;
		this.O = void 0;
		this.L = a && a.supportsCrossDomainXhr || !1;
		this.M = "";
		this.h = new ec(a && a.concurrentRequestLimit);
		this.Ba = new Dc();
		this.S = a && a.fastHandshake || !1;
		this.R = a && a.encodeInitMessageHeaders || !1;
		this.S && this.R && (this.R = !1);
		this.Ra = a && a.Pb || !1;
		a && a.ua && this.j.ua();
		a && a.forceLongPolling && (this.X = !1);
		this.aa = !this.S && this.X && a && a.detectBufferingProxy || !1;
		this.ia = void 0;
		a && a.longPollingTimeout && a.longPollingTimeout > 0 && (this.ia = a.longPollingTimeout);
		this.ta = void 0;
		this.T = 0;
		this.P = !1;
		this.ja = this.B = null;
	}
	h = Sc.prototype;
	h.ka = 8;
	h.I = 1;
	h.connect = function(a, b, c, d) {
		J(0);
		this.W = a;
		this.H = b || {};
		c && d !== void 0 && (this.H.OSID = c, this.H.OAID = d);
		this.F = this.X;
		this.J = Zb(this, null, this.W);
		bc(this);
	};
	function cc(a) {
		Tc(a);
		if (a.I == 3) {
			var b = a.V++, c = O(a.J);
			S(c, "SID", a.M);
			S(c, "RID", b);
			S(c, "TYPE", "terminate");
			Uc(a, c);
			b = new N(a, a.j, b);
			b.M = 2;
			b.A = Db(O(c));
			c = !1;
			if (l.navigator && l.navigator.sendBeacon) try {
				c = l.navigator.sendBeacon(b.A.toString(), "");
			} catch (d) {}
			!c && l.Image && (new Image().src = b.A, c = !0);
			c || (b.g = Hb(b.j, null), b.g.ea(b.A));
			b.F = Date.now();
			Fb(b);
		}
		Vc(a);
	}
	function Vb(a) {
		a.g && (Pb(a), a.g.cancel(), a.g = null);
	}
	function Tc(a) {
		Vb(a);
		a.v && (l.clearTimeout(a.v), a.v = null);
		Ub(a);
		a.h.cancel();
		a.m && (typeof a.m === "number" && l.clearTimeout(a.m), a.m = null);
	}
	function bc(a) {
		if (!fc(a.h) && !a.m) {
			a.m = !0;
			var b = a.Ea;
			u || ta();
			v || (u(), v = !0);
			oa.add(b, a);
			a.D = 0;
		}
	}
	function Wc(a, b) {
		if (Xb(a.h) >= a.h.j - (a.m ? 1 : 0)) return !1;
		if (a.m) return a.i = b.G.concat(a.i), !0;
		if (a.I == 1 || a.I == 2 || a.D >= (a.Sa ? 0 : a.Ta)) return !1;
		a.m = ob(p(a.Ea, a, b), Xc(a, a.D));
		a.D++;
		return !0;
	}
	h.Ea = function(a) {
		if (this.m) if (this.m = null, this.I == 1) {
			if (!a) {
				this.V = Math.floor(Math.random() * 1e5);
				a = this.V++;
				const e = new N(this, this.j, a);
				let f = this.o;
				this.U && (f ? (f = Ba(f), Da(f, this.U)) : f = this.U);
				this.u !== null || this.R || (e.J = f, f = null);
				if (this.S) a: {
					var b = 0;
					for (var c = 0; c < this.i.length; c++) {
						b: {
							var d = this.i[c];
							if ("__data__" in d.map && (d = d.map.__data__, typeof d === "string")) {
								d = d.length;
								break b;
							}
							d = void 0;
						}
						if (d === void 0) break;
						b += d;
						if (b > 4096) {
							b = c;
							break a;
						}
						if (b === 4096 || c === this.i.length - 1) {
							b = c + 1;
							break a;
						}
					}
					b = 1e3;
				}
				else b = 1e3;
				b = Yc(this, e, b);
				c = O(this.J);
				S(c, "RID", a);
				S(c, "CVER", 22);
				this.G && S(c, "X-HTTP-Session-Id", this.G);
				Uc(this, c);
				f && (this.R ? b = "headers=" + L(Jc(f)) + "&" + b : this.u && Kc(c, this.u, f));
				Yb(this.h, e);
				this.Ra && S(c, "TYPE", "init");
				this.S ? (S(c, "$req", b), S(c, "SID", "null"), e.U = !0, Cb(e, c, null)) : Cb(e, c, b);
				this.I = 2;
			}
		} else this.I == 3 && (a ? Zc(this, a) : this.i.length == 0 || fc(this.h) || Zc(this));
	};
	function Zc(a, b) {
		var c;
		b ? c = b.l : c = a.V++;
		const d = O(a.J);
		S(d, "SID", a.M);
		S(d, "RID", c);
		S(d, "AID", a.K);
		Uc(a, d);
		a.u && a.o && Kc(d, a.u, a.o);
		c = new N(a, a.j, c, a.D + 1);
		a.u === null && (c.J = a.o);
		b && (a.i = b.G.concat(a.i));
		b = Yc(a, c, 1e3);
		c.H = Math.round(a.va * .5) + Math.round(a.va * .5 * Math.random());
		Yb(a.h, c);
		Cb(c, d, b);
	}
	function Uc(a, b) {
		a.H && ya(a.H, function(c, d) {
			S(b, d, c);
		});
		a.l && ya({}, function(c, d) {
			S(b, d, c);
		});
	}
	function Yc(a, b, c) {
		c = Math.min(a.i.length, c);
		const d = a.l ? p(a.l.Ka, a.l, a) : null;
		a: {
			var e = a.i;
			let k = -1;
			for (;;) {
				const q = ["count=" + c];
				k == -1 ? c > 0 ? (k = e[0].g, q.push("ofs=" + k)) : k = 0 : q.push("ofs=" + k);
				let m = !0;
				for (let r = 0; r < c; r++) {
					var f = e[r].g;
					const A = e[r].map;
					f -= k;
					if (f < 0) k = Math.max(0, e[r].g - 100), m = !1;
					else try {
						f = "req" + f + "_" || "";
						try {
							var g = A instanceof Map ? A : Object.entries(A);
							for (const [M, F] of g) {
								let G = F;
								n(F) && (G = ab(F));
								q.push(f + M + "=" + encodeURIComponent(G));
							}
						} catch (M) {
							throw q.push(f + "type=_badmap"), M;
						}
					} catch (M) {
						d && d(A);
					}
				}
				if (m) {
					g = q.join("&");
					break a;
				}
			}
			g = void 0;
		}
		a = a.i.splice(0, c);
		b.G = a;
		return g;
	}
	function ac(a) {
		if (!a.g && !a.v) {
			a.Y = 1;
			var b = a.Da;
			u || ta();
			v || (u(), v = !0);
			oa.add(b, a);
			a.A = 0;
		}
	}
	function Wb(a) {
		if (a.g || a.v || a.A >= 3) return !1;
		a.Y++;
		a.v = ob(p(a.Da, a), Xc(a, a.A));
		a.A++;
		return !0;
	}
	h.Da = function() {
		this.v = null;
		$c(this);
		if (this.aa && !(this.P || this.g == null || this.T <= 0)) {
			var a = 4 * this.T;
			this.j.info("BP detection timer enabled: " + a);
			this.B = ob(p(this.Wa, this), a);
		}
	};
	h.Wa = function() {
		this.B && (this.B = null, this.j.info("BP detection timeout reached."), this.j.info("Buffering proxy detected and switch to long-polling!"), this.F = !1, this.P = !0, J(10), Vb(this), $c(this));
	};
	function Pb(a) {
		a.B != null && (l.clearTimeout(a.B), a.B = null);
	}
	function $c(a) {
		a.g = new N(a, a.j, "rpc", a.Y);
		a.u === null && (a.g.J = a.o);
		a.g.P = 0;
		var b = O(a.na);
		S(b, "RID", "rpc");
		S(b, "SID", a.M);
		S(b, "AID", a.K);
		S(b, "CI", a.F ? "0" : "1");
		!a.F && a.ia && S(b, "TO", a.ia);
		S(b, "TYPE", "xmlhttp");
		Uc(a, b);
		a.u && a.o && Kc(b, a.u, a.o);
		a.O && (a.g.H = a.O);
		var c = a.g;
		a = a.ba;
		c.M = 1;
		c.A = Db(O(b));
		c.u = null;
		c.R = !0;
		Eb(c, a);
	}
	h.Va = function() {
		this.C != null && (this.C = null, Vb(this), Wb(this), J(19));
	};
	function Ub(a) {
		a.C != null && (l.clearTimeout(a.C), a.C = null);
	}
	function Qb(a, b) {
		var c = null;
		if (a.g == b) {
			Ub(a);
			Pb(a);
			a.g = null;
			var d = 2;
		} else if (Tb(a.h, b)) c = b.G, $b(a.h, b), d = 1;
		else return;
		if (a.I != 0) {
			if (b.o) if (d == 1) {
				c = b.u ? b.u.length : 0;
				b = Date.now() - b.F;
				var e = a.D;
				d = jb();
				D(d, new nb(d, c));
				bc(a);
			} else ac(a);
			else if (e = b.m, e == 3 || e == 0 && b.X > 0 || !(d == 1 && Wc(a, b) || d == 2 && Wb(a))) switch (c && c.length > 0 && (b = a.h, b.i = b.i.concat(c)), e) {
				case 1:
					R(a, 5);
					break;
				case 4:
					R(a, 10);
					break;
				case 3:
					R(a, 6);
					break;
				default: R(a, 2);
			}
		}
	}
	function Xc(a, b) {
		let c = a.Qa + Math.floor(Math.random() * a.Za);
		a.isActive() || (c *= 2);
		return c * b;
	}
	function R(a, b) {
		a.j.info("Error code " + b);
		if (b == 2) {
			var c = p(a.bb, a), d = a.Ua;
			const e = !d;
			d = new T(d || "//www.google.com/images/cleardot.gif");
			l.location && l.location.protocol == "http" || kc(d, "https");
			Db(d);
			e ? Bc(d.toString(), c) : Cc(d.toString(), c);
		} else J(2);
		a.I = 0;
		a.l && a.l.pa(b);
		Vc(a);
		Tc(a);
	}
	h.bb = function(a) {
		a ? (this.j.info("Successfully pinged google.com"), J(2)) : (this.j.info("Failed to ping google.com"), J(1));
	};
	function Vc(a) {
		a.I = 0;
		a.ja = [];
		if (a.l) {
			const b = hc(a.h);
			if (b.length != 0 || a.i.length != 0) ka(a.ja, b), ka(a.ja, a.i), a.h.i.length = 0, ja(a.i), a.i.length = 0;
			a.l.oa();
		}
	}
	function Zb(a, b, c) {
		var d = c instanceof T ? O(c) : new T(c);
		if (d.g != "") b && (d.g = b + "." + d.g), lc(d, d.u);
		else {
			var e = l.location;
			d = e.protocol;
			b = b ? b + "." + e.hostname : e.hostname;
			e = +e.port;
			const f = new T(null);
			d && kc(f, d);
			b && (f.g = b);
			e && lc(f, e);
			c && (f.h = c);
			d = f;
		}
		c = a.G;
		b = a.wa;
		c && b && S(d, c, b);
		S(d, "VER", a.ka);
		Uc(a, d);
		return d;
	}
	function Hb(a, b, c) {
		if (b && !a.L) throw Error("Can't create secondary domain capable XhrIo object.");
		b = a.Aa && !a.ma ? new X(new Ec({ ab: c })) : new X(a.ma);
		b.Fa(a.L);
		return b;
	}
	h.isActive = function() {
		return !!this.l && this.l.isActive(this);
	};
	function ad() {}
	h = ad.prototype;
	h.ra = function() {};
	h.qa = function() {};
	h.pa = function() {};
	h.oa = function() {};
	h.isActive = function() {
		return !0;
	};
	h.Ka = function() {};
	function bd() {}
	bd.prototype.g = function(a, b) {
		return new Y(a, b);
	};
	function Y(a, b) {
		C.call(this);
		this.g = new Sc(b);
		this.l = a;
		this.h = b && b.messageUrlParams || null;
		a = b && b.messageHeaders || null;
		b && b.clientProtocolHeaderRequired && (a ? a["X-Client-Protocol"] = "webchannel" : a = { "X-Client-Protocol": "webchannel" });
		this.g.o = a;
		a = b && b.initMessageHeaders || null;
		b && b.messageContentType && (a ? a["X-WebChannel-Content-Type"] = b.messageContentType : a = { "X-WebChannel-Content-Type": b.messageContentType });
		b && b.sa && (a ? a["X-WebChannel-Client-Profile"] = b.sa : a = { "X-WebChannel-Client-Profile": b.sa });
		this.g.U = a;
		(a = b && b.Qb) && !y(a) && (this.g.u = a);
		this.A = b && b.supportsCrossDomainXhr || !1;
		this.v = b && b.sendRawJson || !1;
		(b = b && b.httpSessionIdParam) && !y(b) && (this.g.G = b, a = this.h, a !== null && b in a && (a = this.h, b in a && delete a[b]));
		this.j = new Z(this);
	}
	t(Y, C);
	Y.prototype.m = function() {
		this.g.l = this.j;
		this.A && (this.g.L = !0);
		this.g.connect(this.l, this.h || void 0);
	};
	Y.prototype.close = function() {
		cc(this.g);
	};
	Y.prototype.o = function(a) {
		var b = this.g;
		if (typeof a === "string") {
			var c = {};
			c.__data__ = a;
			a = c;
		} else this.v && (c = {}, c.__data__ = ab(a), a = c);
		b.i.push(new dc(b.Ya++, a));
		b.I == 3 && bc(b);
	};
	Y.prototype.N = function() {
		this.g.l = null;
		delete this.j;
		cc(this.g);
		delete this.g;
		Y.Z.N.call(this);
	};
	function cd(a) {
		gb.call(this);
		a.__headers__ && (this.headers = a.__headers__, this.statusCode = a.__status__, delete a.__headers__, delete a.__status__);
		var b = a.__sm__;
		if (b) {
			a: {
				for (const c in b) {
					a = c;
					break a;
				}
				a = void 0;
			}
			if (this.i = a) a = this.i, b = b !== null && a in b ? b[a] : void 0;
			this.data = b;
		} else this.data = a;
	}
	t(cd, gb);
	function dd() {
		hb.call(this);
		this.status = 1;
	}
	t(dd, hb);
	function Z(a) {
		this.g = a;
	}
	t(Z, ad);
	Z.prototype.ra = function() {
		D(this.g, "a");
	};
	Z.prototype.qa = function(a) {
		D(this.g, new cd(a));
	};
	Z.prototype.pa = function(a) {
		D(this.g, new dd());
	};
	Z.prototype.oa = function() {
		D(this.g, "b");
	};
	bd.prototype.createWebChannel = bd.prototype.g;
	Y.prototype.send = Y.prototype.o;
	Y.prototype.open = Y.prototype.m;
	Y.prototype.close = Y.prototype.close;
	createWebChannelTransport = webchannel_blob_es2018.createWebChannelTransport = function() {
		return new bd();
	};
	getStatEventTarget = webchannel_blob_es2018.getStatEventTarget = function() {
		return jb();
	};
	Event = webchannel_blob_es2018.Event = I;
	Stat = webchannel_blob_es2018.Stat = {
		jb: 0,
		mb: 1,
		nb: 2,
		Hb: 3,
		Mb: 4,
		Jb: 5,
		Kb: 6,
		Ib: 7,
		Gb: 8,
		Lb: 9,
		PROXY: 10,
		NOPROXY: 11,
		Eb: 12,
		Ab: 13,
		Bb: 14,
		zb: 15,
		Cb: 16,
		Db: 17,
		fb: 18,
		eb: 19,
		gb: 20
	};
	ub.NO_ERROR = 0;
	ub.TIMEOUT = 8;
	ub.HTTP_ERROR = 6;
	ErrorCode = webchannel_blob_es2018.ErrorCode = ub;
	vb.COMPLETE = "complete";
	EventType = webchannel_blob_es2018.EventType = vb;
	fb.EventType = H;
	H.OPEN = "a";
	H.CLOSE = "b";
	H.ERROR = "c";
	H.MESSAGE = "d";
	C.prototype.listen = C.prototype.J;
	WebChannel = webchannel_blob_es2018.WebChannel = fb;
	webchannel_blob_es2018.FetchXmlHttpFactory = Ec;
	X.prototype.listenOnce = X.prototype.K;
	X.prototype.getLastError = X.prototype.Ha;
	X.prototype.getLastErrorCode = X.prototype.ya;
	X.prototype.getStatus = X.prototype.ca;
	X.prototype.getResponseJson = X.prototype.La;
	X.prototype.getResponseText = X.prototype.la;
	X.prototype.send = X.prototype.ea;
	X.prototype.setWithCredentials = X.prototype.Fa;
	XhrIo = webchannel_blob_es2018.XhrIo = X;
}).apply(typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
//#endregion
//#region node_modules/@firebase/firestore/dist/common-fe7037b3.esm.js
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Simple wrapper around a nullable UID. Mostly exists to make code more
* readable.
*/ var User = class {
	constructor(e) {
		this.uid = e;
	}
	isAuthenticated() {
		return null != this.uid;
	}
	/**
	* Returns a key representing this user, suitable for inclusion in a
	* dictionary.
	*/ toKey() {
		return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
	}
	isEqual(e) {
		return e.uid === this.uid;
	}
};
/** A user with a null UID. */ User.UNAUTHENTICATED = new User(null), User.GOOGLE_CREDENTIALS = new User("google-credentials-uid"), User.FIRST_PARTY = new User("first-party-uid"), User.MOCK_USER = new User("mock-user");
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var b = "12.12.0";
function __PRIVATE_setSDKVersion(e) {
	b = e;
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/** Formats an object as a JSON string, suitable for logging. */
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var S = new Logger("@firebase/firestore");
function __PRIVATE_getLogLevel() {
	return S.logLevel;
}
function __PRIVATE_logDebug(e, ...t) {
	if (S.logLevel <= LogLevel.DEBUG) {
		const n = t.map(__PRIVATE_argToString);
		S.debug(`Firestore (${b}): ${e}`, ...n);
	}
}
function __PRIVATE_logError(e, ...t) {
	if (S.logLevel <= LogLevel.ERROR) {
		const n = t.map(__PRIVATE_argToString);
		S.error(`Firestore (${b}): ${e}`, ...n);
	}
}
/**
* @internal
*/ function __PRIVATE_logWarn(e, ...t) {
	if (S.logLevel <= LogLevel.WARN) {
		const n = t.map(__PRIVATE_argToString);
		S.warn(`Firestore (${b}): ${e}`, ...n);
	}
}
/**
* Converts an additional log parameter to a string representation.
*/ function __PRIVATE_argToString(e) {
	if ("string" == typeof e) return e;
	try {
		return function __PRIVATE_formatJSON(e) {
			return JSON.stringify(e);
		}(e);
	} catch (t) {
		return e;
	}
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ function fail(e, t, n) {
	let r = "Unexpected state";
	"string" == typeof t ? r = t : n = t, __PRIVATE__fail(e, r, n);
}
function __PRIVATE__fail(e, t, n) {
	let r = `FIRESTORE (${b}) INTERNAL ASSERTION FAILED: ${t} (ID: ${e.toString(16)})`;
	if (void 0 !== n) try {
		r += " CONTEXT: " + JSON.stringify(n);
	} catch (e) {
		r += " CONTEXT: " + n;
	}
	throw __PRIVATE_logError(r), new Error(r);
}
function __PRIVATE_hardAssert(e, t, n, r) {
	let i = "Unexpected state";
	"string" == typeof n ? i = n : r = n, e || __PRIVATE__fail(t, i, r);
}
/**
* Casts `obj` to `T`. In non-production builds, verifies that `obj` is an
* instance of `T` before casting.
*/ function __PRIVATE_debugCast(e, t) {
	return e;
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var D = {
	/** Not an error; returned on success. */
	OK: "ok",
	/** The operation was cancelled (typically by the caller). */
	CANCELLED: "cancelled",
	/** Unknown error or an error from a different error domain. */
	UNKNOWN: "unknown",
	/**
	* Client specified an invalid argument. Note that this differs from
	* FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments that are
	* problematic regardless of the state of the system (e.g., a malformed file
	* name).
	*/
	INVALID_ARGUMENT: "invalid-argument",
	/**
	* Deadline expired before operation could complete. For operations that
	* change the state of the system, this error may be returned even if the
	* operation has completed successfully. For example, a successful response
	* from a server could have been delayed long enough for the deadline to
	* expire.
	*/
	DEADLINE_EXCEEDED: "deadline-exceeded",
	/** Some requested entity (e.g., file or directory) was not found. */
	NOT_FOUND: "not-found",
	/**
	* Some entity that we attempted to create (e.g., file or directory) already
	* exists.
	*/
	ALREADY_EXISTS: "already-exists",
	/**
	* The caller does not have permission to execute the specified operation.
	* PERMISSION_DENIED must not be used for rejections caused by exhausting
	* some resource (use RESOURCE_EXHAUSTED instead for those errors).
	* PERMISSION_DENIED must not be used if the caller cannot be identified
	* (use UNAUTHENTICATED instead for those errors).
	*/
	PERMISSION_DENIED: "permission-denied",
	/**
	* The request does not have valid authentication credentials for the
	* operation.
	*/
	UNAUTHENTICATED: "unauthenticated",
	/**
	* Some resource has been exhausted, perhaps a per-user quota, or perhaps the
	* entire file system is out of space.
	*/
	RESOURCE_EXHAUSTED: "resource-exhausted",
	/**
	* Operation was rejected because the system is not in a state required for
	* the operation's execution. For example, directory to be deleted may be
	* non-empty, an rmdir operation is applied to a non-directory, etc.
	*
	* A litmus test that may help a service implementor in deciding
	* between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE:
	*  (a) Use UNAVAILABLE if the client can retry just the failing call.
	*  (b) Use ABORTED if the client should retry at a higher-level
	*      (e.g., restarting a read-modify-write sequence).
	*  (c) Use FAILED_PRECONDITION if the client should not retry until
	*      the system state has been explicitly fixed. E.g., if an "rmdir"
	*      fails because the directory is non-empty, FAILED_PRECONDITION
	*      should be returned since the client should not retry unless
	*      they have first fixed up the directory by deleting files from it.
	*  (d) Use FAILED_PRECONDITION if the client performs conditional
	*      REST Get/Update/Delete on a resource and the resource on the
	*      server does not match the condition. E.g., conflicting
	*      read-modify-write on the same resource.
	*/
	FAILED_PRECONDITION: "failed-precondition",
	/**
	* The operation was aborted, typically due to a concurrency issue like
	* sequencer check failures, transaction aborts, etc.
	*
	* See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
	* and UNAVAILABLE.
	*/
	ABORTED: "aborted",
	/**
	* Operation was attempted past the valid range. E.g., seeking or reading
	* past end of file.
	*
	* Unlike INVALID_ARGUMENT, this error indicates a problem that may be fixed
	* if the system state changes. For example, a 32-bit file system will
	* generate INVALID_ARGUMENT if asked to read at an offset that is not in the
	* range [0,2^32-1], but it will generate OUT_OF_RANGE if asked to read from
	* an offset past the current file size.
	*
	* There is a fair bit of overlap between FAILED_PRECONDITION and
	* OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific error)
	* when it applies so that callers who are iterating through a space can
	* easily look for an OUT_OF_RANGE error to detect when they are done.
	*/
	OUT_OF_RANGE: "out-of-range",
	/** Operation is not implemented or not supported/enabled in this service. */
	UNIMPLEMENTED: "unimplemented",
	/**
	* Internal errors. Means some invariants expected by underlying System has
	* been broken. If you see one of these errors, Something is very broken.
	*/
	INTERNAL: "internal",
	/**
	* The service is currently unavailable. This is a most likely a transient
	* condition and may be corrected by retrying with a backoff.
	*
	* See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
	* and UNAVAILABLE.
	*/
	UNAVAILABLE: "unavailable",
	/** Unrecoverable data loss or corruption. */
	DATA_LOSS: "data-loss"
};
/** An error returned by a Firestore operation. */ var FirestoreError = class extends FirebaseError {
	/** @hideconstructor */
	constructor(e, t) {
		super(e, t), this.code = e, this.message = t, this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`;
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var __PRIVATE_Deferred = class {
	constructor() {
		this.promise = new Promise(((e, t) => {
			this.resolve = e, this.reject = t;
		}));
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var __PRIVATE_OAuthToken = class {
	constructor(e, t) {
		this.user = t, this.type = "OAuth", this.headers = /* @__PURE__ */ new Map(), this.headers.set("Authorization", `Bearer ${e}`);
	}
};
/**
* A CredentialsProvider that always yields an empty token.
* @internal
*/ var __PRIVATE_EmptyAuthCredentialsProvider = class {
	getToken() {
		return Promise.resolve(null);
	}
	invalidateToken() {}
	start(e, t) {
		e.enqueueRetryable((() => t(User.UNAUTHENTICATED)));
	}
	shutdown() {}
};
/**
* A CredentialsProvider that always returns a constant token. Used for
* emulator token mocking.
*/ var __PRIVATE_EmulatorAuthCredentialsProvider = class {
	constructor(e) {
		this.token = e, this.changeListener = null;
	}
	getToken() {
		return Promise.resolve(this.token);
	}
	invalidateToken() {}
	start(e, t) {
		this.changeListener = t, e.enqueueRetryable((() => t(this.token.user)));
	}
	shutdown() {
		this.changeListener = null;
	}
};
var __PRIVATE_FirebaseAuthCredentialsProvider = class {
	constructor(e) {
		this.t = e, this.currentUser = User.UNAUTHENTICATED, this.i = 0, this.forceRefresh = !1, this.auth = null;
	}
	start(e, t) {
		__PRIVATE_hardAssert(void 0 === this.o, 42304);
		let n = this.i;
		const __PRIVATE_guardedChangeListener = (e) => this.i !== n ? (n = this.i, t(e)) : Promise.resolve();
		let r = new __PRIVATE_Deferred();
		this.o = () => {
			this.i++, this.currentUser = this.u(), r.resolve(), r = new __PRIVATE_Deferred(), e.enqueueRetryable((() => __PRIVATE_guardedChangeListener(this.currentUser)));
		};
		const __PRIVATE_awaitNextToken = () => {
			const t = r;
			e.enqueueRetryable((async () => {
				await t.promise, await __PRIVATE_guardedChangeListener(this.currentUser);
			}));
		}, __PRIVATE_registerAuth = (e) => {
			__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth detected"), this.auth = e, this.o && (this.auth.addAuthTokenListener(this.o), __PRIVATE_awaitNextToken());
		};
		this.t.onInit(((e) => __PRIVATE_registerAuth(e))), setTimeout((() => {
			if (!this.auth) {
				const e = this.t.getImmediate({ optional: !0 });
				e ? __PRIVATE_registerAuth(e) : (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth not yet detected"), r.resolve(), r = new __PRIVATE_Deferred());
			}
		}), 0), __PRIVATE_awaitNextToken();
	}
	getToken() {
		const e = this.i, t = this.forceRefresh;
		return this.forceRefresh = !1, this.auth ? this.auth.getToken(t).then(((t) => this.i !== e ? (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : t ? (__PRIVATE_hardAssert("string" == typeof t.accessToken, 31837, { l: t }), new __PRIVATE_OAuthToken(t.accessToken, this.currentUser)) : null)) : Promise.resolve(null);
	}
	invalidateToken() {
		this.forceRefresh = !0;
	}
	shutdown() {
		this.auth && this.o && this.auth.removeAuthTokenListener(this.o), this.o = void 0;
	}
	u() {
		const e = this.auth && this.auth.getUid();
		return __PRIVATE_hardAssert(null === e || "string" == typeof e, 2055, { h: e }), new User(e);
	}
};
var __PRIVATE_FirstPartyToken = class {
	constructor(e, t, n) {
		this.P = e, this.T = t, this.I = n, this.type = "FirstParty", this.user = User.FIRST_PARTY, this.R = /* @__PURE__ */ new Map();
	}
	/**
	* Gets an authorization token, using a provided factory function, or return
	* null.
	*/ A() {
		return this.I ? this.I() : null;
	}
	get headers() {
		this.R.set("X-Goog-AuthUser", this.P);
		const e = this.A();
		return e && this.R.set("Authorization", e), this.T && this.R.set("X-Goog-Iam-Authorization-Token", this.T), this.R;
	}
};
var __PRIVATE_FirstPartyAuthCredentialsProvider = class {
	constructor(e, t, n) {
		this.P = e, this.T = t, this.I = n;
	}
	getToken() {
		return Promise.resolve(new __PRIVATE_FirstPartyToken(this.P, this.T, this.I));
	}
	start(e, t) {
		e.enqueueRetryable((() => t(User.FIRST_PARTY)));
	}
	shutdown() {}
	invalidateToken() {}
};
var AppCheckToken = class {
	constructor(e) {
		this.value = e, this.type = "AppCheck", this.headers = /* @__PURE__ */ new Map(), e && e.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
	}
};
var __PRIVATE_FirebaseAppCheckTokenProvider = class {
	constructor(t, n) {
		this.V = n, this.forceRefresh = !1, this.appCheck = null, this.m = null, this.p = null, _isFirebaseServerApp(t) && t.settings.appCheckToken && (this.p = t.settings.appCheckToken);
	}
	start(e, t) {
		__PRIVATE_hardAssert(void 0 === this.o, 3512);
		const onTokenChanged = (e) => {
			null != e.error && __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`);
			const n = e.token !== this.m;
			return this.m = e.token, __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Received ${n ? "new" : "existing"} token.`), n ? t(e.token) : Promise.resolve();
		};
		this.o = (t) => {
			e.enqueueRetryable((() => onTokenChanged(t)));
		};
		const __PRIVATE_registerAppCheck = (e) => {
			__PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck detected"), this.appCheck = e, this.o && this.appCheck.addTokenListener(this.o);
		};
		this.V.onInit(((e) => __PRIVATE_registerAppCheck(e))), setTimeout((() => {
			if (!this.appCheck) {
				const e = this.V.getImmediate({ optional: !0 });
				e ? __PRIVATE_registerAppCheck(e) : __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck not yet detected");
			}
		}), 0);
	}
	getToken() {
		if (this.p) return Promise.resolve(new AppCheckToken(this.p));
		const e = this.forceRefresh;
		return this.forceRefresh = !1, this.appCheck ? this.appCheck.getToken(e).then(((e) => e ? (__PRIVATE_hardAssert("string" == typeof e.token, 44558, { tokenResult: e }), this.m = e.token, new AppCheckToken(e.token)) : null)) : Promise.resolve(null);
	}
	invalidateToken() {
		this.forceRefresh = !0;
	}
	shutdown() {
		this.appCheck && this.o && this.appCheck.removeTokenListener(this.o), this.o = void 0;
	}
};
/**
* Builds a CredentialsProvider depending on the type of
* the credentials passed in.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Generates `nBytes` of random bytes.
*
* If `nBytes < 0` , an error will be thrown.
*/
function __PRIVATE_randomBytes(e) {
	const t = "undefined" != typeof self && (self.crypto || self.msCrypto), n = new Uint8Array(e);
	if (t && "function" == typeof t.getRandomValues) t.getRandomValues(n);
	else for (let t = 0; t < e; t++) n[t] = Math.floor(256 * Math.random());
	return n;
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* A utility class for generating unique alphanumeric IDs of a specified length.
*
* @internal
* Exported internally for testing purposes.
*/ var __PRIVATE_AutoId = class {
	static newId() {
		const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", t = 62 * Math.floor(256 / 62);
		let n = "";
		for (; n.length < 20;) {
			const r = __PRIVATE_randomBytes(40);
			for (let i = 0; i < r.length; ++i) n.length < 20 && r[i] < t && (n += e.charAt(r[i] % 62));
		}
		return n;
	}
};
function __PRIVATE_primitiveComparator(e, t) {
	return e < t ? -1 : e > t ? 1 : 0;
}
/** Compare strings in UTF-8 encoded byte order */ function __PRIVATE_compareUtf8Strings(e, t) {
	const n = Math.min(e.length, t.length);
	for (let r = 0; r < n; r++) {
		const n = e.charAt(r), i = t.charAt(r);
		if (n !== i) return __PRIVATE_isSurrogate(n) === __PRIVATE_isSurrogate(i) ? __PRIVATE_primitiveComparator(n, i) : __PRIVATE_isSurrogate(n) ? 1 : -1;
	}
	return __PRIVATE_primitiveComparator(e.length, t.length);
}
var C = 55296, v = 57343;
function __PRIVATE_isSurrogate(e) {
	const t = e.charCodeAt(0);
	return t >= C && t <= v;
}
/** Helper to compare arrays using isEqual(). */ function __PRIVATE_arrayEquals(e, t, n) {
	return e.length === t.length && e.every(((e, r) => n(e, t[r])));
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var F = "__name__";
/**
* Path represents an ordered sequence of string segments.
*/ var BasePath = class BasePath {
	constructor(e, t, n) {
		void 0 === t ? t = 0 : t > e.length && fail(637, {
			offset: t,
			range: e.length
		}), void 0 === n ? n = e.length - t : n > e.length - t && fail(1746, {
			length: n,
			range: e.length - t
		}), this.segments = e, this.offset = t, this.len = n;
	}
	get length() {
		return this.len;
	}
	isEqual(e) {
		return 0 === BasePath.comparator(this, e);
	}
	child(e) {
		const t = this.segments.slice(this.offset, this.limit());
		return e instanceof BasePath ? e.forEach(((e) => {
			t.push(e);
		})) : t.push(e), this.construct(t);
	}
	/** The index of one past the last segment of the path. */ limit() {
		return this.offset + this.length;
	}
	popFirst(e) {
		return e = void 0 === e ? 1 : e, this.construct(this.segments, this.offset + e, this.length - e);
	}
	popLast() {
		return this.construct(this.segments, this.offset, this.length - 1);
	}
	firstSegment() {
		return this.segments[this.offset];
	}
	lastSegment() {
		return this.get(this.length - 1);
	}
	get(e) {
		return this.segments[this.offset + e];
	}
	isEmpty() {
		return 0 === this.length;
	}
	isPrefixOf(e) {
		if (e.length < this.length) return !1;
		for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return !1;
		return !0;
	}
	isImmediateParentOf(e) {
		if (this.length + 1 !== e.length) return !1;
		for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return !1;
		return !0;
	}
	forEach(e) {
		for (let t = this.offset, n = this.limit(); t < n; t++) e(this.segments[t]);
	}
	toArray() {
		return this.segments.slice(this.offset, this.limit());
	}
	/**
	* Compare 2 paths segment by segment, prioritizing numeric IDs
	* (e.g., "__id123__") in numeric ascending order, followed by string
	* segments in lexicographical order.
	*/ static comparator(e, t) {
		const n = Math.min(e.length, t.length);
		for (let r = 0; r < n; r++) {
			const n = BasePath.compareSegments(e.get(r), t.get(r));
			if (0 !== n) return n;
		}
		return __PRIVATE_primitiveComparator(e.length, t.length);
	}
	static compareSegments(e, t) {
		const n = BasePath.isNumericId(e), r = BasePath.isNumericId(t);
		return n && !r ? -1 : !n && r ? 1 : n && r ? BasePath.extractNumericId(e).compare(BasePath.extractNumericId(t)) : __PRIVATE_compareUtf8Strings(e, t);
	}
	static isNumericId(e) {
		return e.startsWith("__id") && e.endsWith("__");
	}
	static extractNumericId(e) {
		return Integer.fromString(e.substring(4, e.length - 2));
	}
};
/**
* A slash-separated path for navigating resources (documents and collections)
* within Firestore.
*
* @internal
*/ var ResourcePath = class ResourcePath extends BasePath {
	construct(e, t, n) {
		return new ResourcePath(e, t, n);
	}
	canonicalString() {
		return this.toArray().join("/");
	}
	toString() {
		return this.canonicalString();
	}
	/**
	* Returns a string representation of this path
	* where each path segment has been encoded with
	* `encodeURIComponent`.
	*/ toUriEncodedString() {
		return this.toArray().map(encodeURIComponent).join("/");
	}
	/**
	* Creates a resource path from the given slash-delimited string. If multiple
	* arguments are provided, all components are combined. Leading and trailing
	* slashes from all components are ignored.
	*/ static fromString(...e) {
		const t = [];
		for (const n of e) {
			if (n.indexOf("//") >= 0) throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid segment (${n}). Paths must not contain // in them.`);
			t.push(...n.split("/").filter(((e) => e.length > 0)));
		}
		return new ResourcePath(t);
	}
	static emptyPath() {
		return new ResourcePath([]);
	}
};
var M = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
/**
* A dot-separated path for navigating sub-objects within a document.
* @internal
*/ var FieldPath$1 = class FieldPath$1 extends BasePath {
	construct(e, t, n) {
		return new FieldPath$1(e, t, n);
	}
	/**
	* Returns true if the string could be used as a segment in a field path
	* without escaping.
	*/ static isValidIdentifier(e) {
		return M.test(e);
	}
	canonicalString() {
		return this.toArray().map(((e) => (e = e.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), FieldPath$1.isValidIdentifier(e) || (e = "`" + e + "`"), e))).join(".");
	}
	toString() {
		return this.canonicalString();
	}
	/**
	* Returns true if this field references the key of a document.
	*/ isKeyField() {
		return 1 === this.length && this.get(0) === "__name__";
	}
	/**
	* The field designating the key of a document.
	*/ static keyField() {
		return new FieldPath$1([F]);
	}
	/**
	* Parses a field string from the given server-formatted string.
	*
	* - Splitting the empty string is not allowed (for now at least).
	* - Empty segments within the string (e.g. if there are two consecutive
	*   separators) are not allowed.
	*
	* TODO(b/37244157): we should make this more strict. Right now, it allows
	* non-identifier path components, even if they aren't escaped.
	*/ static fromServerFormat(e) {
		const t = [];
		let n = "", r = 0;
		const __PRIVATE_addCurrentSegment = () => {
			if (0 === n.length) throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
			t.push(n), n = "";
		};
		let i = !1;
		for (; r < e.length;) {
			const t = e[r];
			if ("\\" === t) {
				if (r + 1 === e.length) throw new FirestoreError(D.INVALID_ARGUMENT, "Path has trailing escape character: " + e);
				const t = e[r + 1];
				if ("\\" !== t && "." !== t && "`" !== t) throw new FirestoreError(D.INVALID_ARGUMENT, "Path has invalid escape sequence: " + e);
				n += t, r += 2;
			} else "`" === t ? (i = !i, r++) : "." !== t || i ? (n += t, r++) : (__PRIVATE_addCurrentSegment(), r++);
		}
		if (__PRIVATE_addCurrentSegment(), i) throw new FirestoreError(D.INVALID_ARGUMENT, "Unterminated ` in path: " + e);
		return new FieldPath$1(t);
	}
	static emptyPath() {
		return new FieldPath$1([]);
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @internal
*/ var DocumentKey = class DocumentKey {
	constructor(e) {
		this.path = e;
	}
	static fromPath(e) {
		return new DocumentKey(ResourcePath.fromString(e));
	}
	static fromName(e) {
		return new DocumentKey(ResourcePath.fromString(e).popFirst(5));
	}
	static empty() {
		return new DocumentKey(ResourcePath.emptyPath());
	}
	get collectionGroup() {
		return this.path.popLast().lastSegment();
	}
	/** Returns true if the document is in the specified collectionId. */ hasCollectionId(e) {
		return this.path.length >= 2 && this.path.get(this.path.length - 2) === e;
	}
	/** Returns the collection group (i.e. the name of the parent collection) for this key. */ getCollectionGroup() {
		return this.path.get(this.path.length - 2);
	}
	/** Returns the fully qualified path to the parent collection. */ getCollectionPath() {
		return this.path.popLast();
	}
	isEqual(e) {
		return null !== e && 0 === ResourcePath.comparator(this.path, e.path);
	}
	toString() {
		return this.path.toString();
	}
	static comparator(e, t) {
		return ResourcePath.comparator(e.path, t.path);
	}
	static isDocumentKey(e) {
		return e.length % 2 == 0;
	}
	/**
	* Creates and returns a new document key with the given segments.
	*
	* @param segments - The segments of the path to the document
	* @returns A new instance of DocumentKey
	*/ static fromSegments(e) {
		return new DocumentKey(new ResourcePath(e.slice()));
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ function __PRIVATE_validateNonEmptyArgument(e, t, n) {
	if (!n) throw new FirestoreError(D.INVALID_ARGUMENT, `Function ${e}() cannot be called with an empty ${t}.`);
}
/**
* Validates that two boolean options are not set at the same time.
* @internal
*/ function __PRIVATE_validateIsNotUsedTogether(e, t, n, r) {
	if (!0 === t && !0 === r) throw new FirestoreError(D.INVALID_ARGUMENT, `${e} and ${n} cannot be used together.`);
}
/**
* Validates that `path` refers to a document (indicated by the fact it contains
* an even numbers of segments).
*/ function __PRIVATE_validateDocumentPath(e) {
	if (!DocumentKey.isDocumentKey(e)) throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`);
}
/**
* Validates that `path` refers to a collection (indicated by the fact it
* contains an odd numbers of segments).
*/ function __PRIVATE_validateCollectionPath(e) {
	if (DocumentKey.isDocumentKey(e)) throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`);
}
/**
* Returns true if it's a non-null object without a custom prototype
* (i.e. excludes Array, Date, etc.).
*/ function __PRIVATE_isPlainObject(e) {
	return "object" == typeof e && null !== e && (Object.getPrototypeOf(e) === Object.prototype || null === Object.getPrototypeOf(e));
}
/** Returns a string describing the type / value of the provided input. */ function __PRIVATE_valueDescription(e) {
	if (void 0 === e) return "undefined";
	if (null === e) return "null";
	if ("string" == typeof e) return e.length > 20 && (e = `${e.substring(0, 20)}...`), JSON.stringify(e);
	if ("number" == typeof e || "boolean" == typeof e) return "" + e;
	if ("object" == typeof e) {
		if (e instanceof Array) return "an array";
		{
			const t = function __PRIVATE_tryGetCustomObjectType(e) {
				if (e.constructor) return e.constructor.name;
				return null;
			}(e);
			return t ? `a custom ${t} object` : "an object";
		}
	}
	return "function" == typeof e ? "a function" : fail(12329, { type: typeof e });
}
function __PRIVATE_cast(e, t) {
	if ("_delegate" in e && (e = e._delegate), !(e instanceof t)) {
		if (t.name === e.constructor.name) throw new FirestoreError(D.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
		{
			const n = __PRIVATE_valueDescription(e);
			throw new FirestoreError(D.INVALID_ARGUMENT, `Expected type '${t.name}', but it was: ${n}`);
		}
	}
	return e;
}
/**
* @license
* Copyright 2025 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Helper function to define a JSON schema {@link Property}.
* @private
* @internal
*/ function property(e, t) {
	const n = { typeString: e };
	return t && (n.value = t), n;
}
/**
* Validates the JSON object based on the provided schema, and narrows the type to the provided
* JSON schema.
* @private
* @internal
*
* @param json - A JSON object to validate.
* @param scheme - a {@link JsonSchema} that defines the properties to validate.
* @returns true if the JSON schema exists within the object. Throws a FirestoreError otherwise.
*/ function __PRIVATE_validateJSON(e, t) {
	if (!__PRIVATE_isPlainObject(e)) throw new FirestoreError(D.INVALID_ARGUMENT, "JSON must be an object");
	let n;
	for (const r in t) if (t[r]) {
		const i = t[r].typeString, s = "value" in t[r] ? { value: t[r].value } : void 0;
		if (!(r in e)) {
			n = `JSON missing required field: '${r}'`;
			break;
		}
		const o = e[r];
		if (i && typeof o !== i) {
			n = `JSON field '${r}' must be a ${i}.`;
			break;
		}
		if (void 0 !== s && o !== s.value) {
			n = `Expected '${r}' field to equal '${s.value}'`;
			break;
		}
	}
	if (n) throw new FirestoreError(D.INVALID_ARGUMENT, n);
	return !0;
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var x = -62135596800, O = 1e6;
/**
* A `Timestamp` represents a point in time independent of any time zone or
* calendar, represented as seconds and fractions of seconds at nanosecond
* resolution in UTC Epoch time.
*
* It is encoded using the Proleptic Gregorian Calendar which extends the
* Gregorian calendar backwards to year one. It is encoded assuming all minutes
* are 60 seconds long, i.e. leap seconds are "smeared" so that no leap second
* table is needed for interpretation. Range is from 0001-01-01T00:00:00Z to
* 9999-12-31T23:59:59.999999999Z.
*
* For examples and further specifications, refer to the
* {@link https://github.com/google/protobuf/blob/master/src/google/protobuf/timestamp.proto | Timestamp definition}.
*/
var Timestamp = class Timestamp {
	/**
	* Creates a new timestamp with the current date, with millisecond precision.
	*
	* @returns a new timestamp representing the current date.
	*/
	static now() {
		return Timestamp.fromMillis(Date.now());
	}
	/**
	* Creates a new timestamp from the given date.
	*
	* @param date - The date to initialize the `Timestamp` from.
	* @returns A new `Timestamp` representing the same point in time as the given
	*     date.
	*/ static fromDate(e) {
		return Timestamp.fromMillis(e.getTime());
	}
	/**
	* Creates a new timestamp from the given number of milliseconds.
	*
	* @param milliseconds - Number of milliseconds since Unix epoch
	*     1970-01-01T00:00:00Z.
	* @returns A new `Timestamp` representing the same point in time as the given
	*     number of milliseconds.
	*/ static fromMillis(e) {
		const t = Math.floor(e / 1e3);
		return new Timestamp(t, Math.floor((e - 1e3 * t) * O));
	}
	/**
	* Creates a new timestamp.
	*
	* @param seconds - The number of seconds of UTC time since Unix epoch
	*     1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
	*     9999-12-31T23:59:59Z inclusive.
	* @param nanoseconds - The non-negative fractions of a second at nanosecond
	*     resolution. Negative second values with fractions must still have
	*     non-negative nanoseconds values that count forward in time. Must be
	*     from 0 to 999,999,999 inclusive.
	*/ constructor(e, t) {
		if (this.seconds = e, this.nanoseconds = t, t < 0) throw new FirestoreError(D.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
		if (t >= 1e9) throw new FirestoreError(D.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
		if (e < x) throw new FirestoreError(D.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
		if (e >= 253402300800) throw new FirestoreError(D.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
	}
	/**
	* Converts a `Timestamp` to a JavaScript `Date` object. This conversion
	* causes a loss of precision since `Date` objects only support millisecond
	* precision.
	*
	* @returns JavaScript `Date` object representing the same point in time as
	*     this `Timestamp`, with millisecond precision.
	*/ toDate() {
		return new Date(this.toMillis());
	}
	/**
	* Converts a `Timestamp` to a numeric timestamp (in milliseconds since
	* epoch). This operation causes a loss of precision.
	*
	* @returns The point in time corresponding to this timestamp, represented as
	*     the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
	*/ toMillis() {
		return 1e3 * this.seconds + this.nanoseconds / O;
	}
	_compareTo(e) {
		return this.seconds === e.seconds ? __PRIVATE_primitiveComparator(this.nanoseconds, e.nanoseconds) : __PRIVATE_primitiveComparator(this.seconds, e.seconds);
	}
	/**
	* Returns true if this `Timestamp` is equal to the provided one.
	*
	* @param other - The `Timestamp` to compare against.
	* @returns true if this `Timestamp` is equal to the provided one.
	*/ isEqual(e) {
		return e.seconds === this.seconds && e.nanoseconds === this.nanoseconds;
	}
	/** Returns a textual representation of this `Timestamp`. */ toString() {
		return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
	}
	/**
	* Returns a JSON-serializable representation of this `Timestamp`.
	*/ toJSON() {
		return {
			type: Timestamp._jsonSchemaVersion,
			seconds: this.seconds,
			nanoseconds: this.nanoseconds
		};
	}
	/**
	* Builds a `Timestamp` instance from a JSON object created by {@link Timestamp.toJSON}.
	*/ static fromJSON(e) {
		if (__PRIVATE_validateJSON(e, Timestamp._jsonSchema)) return new Timestamp(e.seconds, e.nanoseconds);
	}
	/**
	* Converts this object to a primitive string, which allows `Timestamp` objects
	* to be compared using the `>`, `<=`, `>=` and `>` operators.
	*/ valueOf() {
		const e = this.seconds - x;
		return String(e).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
	}
};
Timestamp._jsonSchemaVersion = "firestore/timestamp/1.0", Timestamp._jsonSchema = {
	type: property("string", Timestamp._jsonSchemaVersion),
	seconds: property("number"),
	nanoseconds: property("number")
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* A version of a document in Firestore. This corresponds to the version
* timestamp, such as update_time or read_time.
*/
var SnapshotVersion = class SnapshotVersion {
	static fromTimestamp(e) {
		return new SnapshotVersion(e);
	}
	static min() {
		return new SnapshotVersion(new Timestamp(0, 0));
	}
	static max() {
		return new SnapshotVersion(new Timestamp(253402300799, 999999999));
	}
	constructor(e) {
		this.timestamp = e;
	}
	compareTo(e) {
		return this.timestamp._compareTo(e.timestamp);
	}
	isEqual(e) {
		return this.timestamp.isEqual(e.timestamp);
	}
	/** Returns a number representation of the version for use in spec tests. */ toMicroseconds() {
		return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
	}
	toString() {
		return "SnapshotVersion(" + this.timestamp.toString() + ")";
	}
	toTimestamp() {
		return this.timestamp;
	}
};
/**
* @license
* Copyright 2021 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* The initial mutation batch id for each index. Gets updated during index
* backfill.
*/ var N = -1;
/**
* The initial sequence number for each index. Gets updated during index
* backfill.
*/
/**
* An index definition for field indexes in Firestore.
*
* Every index is associated with a collection. The definition contains a list
* of fields and their index kind (which can be `ASCENDING`, `DESCENDING` or
* `CONTAINS` for ArrayContains/ArrayContainsAny queries).
*
* Unlike the backend, the SDK does not differentiate between collection or
* collection group-scoped indices. Every index can be used for both single
* collection and collection group queries.
*/
var FieldIndex = class {
	constructor(e, t, n, r) {
		this.indexId = e, this.collectionGroup = t, this.fields = n, this.indexState = r;
	}
};
/** Returns a debug representation of the field index */ FieldIndex.UNKNOWN_ID = -1;
/**
* Creates an offset that matches all documents with a read time higher than
* `readTime`.
*/ function __PRIVATE_newIndexOffsetSuccessorFromReadTime(e, t) {
	const n = e.toTimestamp().seconds, r = e.toTimestamp().nanoseconds + 1;
	return new IndexOffset(SnapshotVersion.fromTimestamp(1e9 === r ? new Timestamp(n + 1, 0) : new Timestamp(n, r)), DocumentKey.empty(), t);
}
/** Creates a new offset based on the provided document. */ function __PRIVATE_newIndexOffsetFromDocument(e) {
	return new IndexOffset(e.readTime, e.key, N);
}
/**
* Stores the latest read time, document and batch ID that were processed for an
* index.
*/ var IndexOffset = class IndexOffset {
	constructor(e, t, n) {
		this.readTime = e, this.documentKey = t, this.largestBatchId = n;
	}
	/** Returns an offset that sorts before all regular offsets. */ static min() {
		return new IndexOffset(SnapshotVersion.min(), DocumentKey.empty(), N);
	}
	/** Returns an offset that sorts after all regular offsets. */ static max() {
		return new IndexOffset(SnapshotVersion.max(), DocumentKey.empty(), N);
	}
};
function __PRIVATE_indexOffsetComparator(e, t) {
	let n = e.readTime.compareTo(t.readTime);
	return 0 !== n ? n : (n = DocumentKey.comparator(e.documentKey, t.documentKey), 0 !== n ? n : __PRIVATE_primitiveComparator(e.largestBatchId, t.largestBatchId));
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var B = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";
/**
* A base class representing a persistence transaction, encapsulating both the
* transaction's sequence numbers as well as a list of onCommitted listeners.
*
* When you call Persistence.runTransaction(), it will create a transaction and
* pass it to your callback. You then pass it to any method that operates
* on persistence.
*/ var PersistenceTransaction = class {
	constructor() {
		this.onCommittedListeners = [];
	}
	addOnCommittedListener(e) {
		this.onCommittedListeners.push(e);
	}
	raiseOnCommittedEvent() {
		this.onCommittedListeners.forEach(((e) => e()));
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Verifies the error thrown by a LocalStore operation. If a LocalStore
* operation fails because the primary lease has been taken by another client,
* we ignore the error (the persistence layer will immediately call
* `applyPrimaryLease` to propagate the primary state change). All other errors
* are re-thrown.
*
* @param err - An error returned by a LocalStore operation.
* @returns A Promise that resolves after we recovered, or the original error.
*/ async function __PRIVATE_ignoreIfPrimaryLeaseLoss(e) {
	if (e.code !== D.FAILED_PRECONDITION || e.message !== B) throw e;
	__PRIVATE_logDebug("LocalStore", "Unexpectedly lost primary lease");
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* PersistencePromise is essentially a re-implementation of Promise except
* it has a .next() method instead of .then() and .next() and .catch() callbacks
* are executed synchronously when a PersistencePromise resolves rather than
* asynchronously (Promise implementations use setImmediate() or similar).
*
* This is necessary to interoperate with IndexedDB which will automatically
* commit transactions if control is returned to the event loop without
* synchronously initiating another operation on the transaction.
*
* NOTE: .then() and .catch() only allow a single consumer, unlike normal
* Promises.
*/ var PersistencePromise = class PersistencePromise {
	constructor(e) {
		this.nextCallback = null, this.catchCallback = null, this.result = void 0, this.error = void 0, this.isDone = !1, this.callbackAttached = !1, e(((e) => {
			this.isDone = !0, this.result = e, this.nextCallback && this.nextCallback(e);
		}), ((e) => {
			this.isDone = !0, this.error = e, this.catchCallback && this.catchCallback(e);
		}));
	}
	catch(e) {
		return this.next(void 0, e);
	}
	next(e, t) {
		return this.callbackAttached && fail(59440), this.callbackAttached = !0, this.isDone ? this.error ? this.wrapFailure(t, this.error) : this.wrapSuccess(e, this.result) : new PersistencePromise(((n, r) => {
			this.nextCallback = (t) => {
				this.wrapSuccess(e, t).next(n, r);
			}, this.catchCallback = (e) => {
				this.wrapFailure(t, e).next(n, r);
			};
		}));
	}
	toPromise() {
		return new Promise(((e, t) => {
			this.next(e, t);
		}));
	}
	wrapUserFunction(e) {
		try {
			const t = e();
			return t instanceof PersistencePromise ? t : PersistencePromise.resolve(t);
		} catch (e) {
			return PersistencePromise.reject(e);
		}
	}
	wrapSuccess(e, t) {
		return e ? this.wrapUserFunction((() => e(t))) : PersistencePromise.resolve(t);
	}
	wrapFailure(e, t) {
		return e ? this.wrapUserFunction((() => e(t))) : PersistencePromise.reject(t);
	}
	static resolve(e) {
		return new PersistencePromise(((t, n) => {
			t(e);
		}));
	}
	static reject(e) {
		return new PersistencePromise(((t, n) => {
			n(e);
		}));
	}
	static waitFor(e) {
		return new PersistencePromise(((t, n) => {
			let r = 0, i = 0, s = !1;
			e.forEach(((e) => {
				++r, e.next((() => {
					++i, s && i === r && t();
				}), ((e) => n(e)));
			})), s = !0, i === r && t();
		}));
	}
	/**
	* Given an array of predicate functions that asynchronously evaluate to a
	* boolean, implements a short-circuiting `or` between the results. Predicates
	* will be evaluated until one of them returns `true`, then stop. The final
	* result will be whether any of them returned `true`.
	*/ static or(e) {
		let t = PersistencePromise.resolve(!1);
		for (const n of e) t = t.next(((e) => e ? PersistencePromise.resolve(e) : n()));
		return t;
	}
	static forEach(e, t) {
		const n = [];
		return e.forEach(((e, r) => {
			n.push(t.call(this, e, r));
		})), this.waitFor(n);
	}
	/**
	* Concurrently map all array elements through asynchronous function.
	*/ static mapArray(e, t) {
		return new PersistencePromise(((n, r) => {
			const i = e.length, s = new Array(i);
			let o = 0;
			for (let _ = 0; _ < i; _++) {
				const a = _;
				t(e[a]).next(((e) => {
					s[a] = e, ++o, o === i && n(s);
				}), ((e) => r(e)));
			}
		}));
	}
	/**
	* An alternative to recursive PersistencePromise calls, that avoids
	* potential memory problems from unbounded chains of promises.
	*
	* The `action` will be called repeatedly while `condition` is true.
	*/ static doWhile(e, t) {
		return new PersistencePromise(((n, r) => {
			const process = () => {
				!0 === e() ? t().next((() => {
					process();
				}), r) : n();
			};
			process();
		}));
	}
};
/** Parse User Agent to determine Android version. Returns -1 if not found. */ function __PRIVATE_getAndroidVersion(e) {
	const t = e.match(/Android ([\d.]+)/i), n = t ? t[1].split(".").slice(0, 2).join(".") : "-1";
	return Number(n);
}
/** Verifies whether `e` is an IndexedDbTransactionError. */ function __PRIVATE_isIndexedDbTransactionError(e) {
	return "IndexedDbTransactionError" === e.name;
}
/**
* @license
* Copyright 2018 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* `ListenSequence` is a monotonic sequence. It is initialized with a minimum value to
* exceed. All subsequent calls to next will return increasing values. If provided with a
* `SequenceNumberSyncer`, it will additionally bump its next value when told of a new value, as
* well as write out sequence numbers that it produces via `next()`.
*/ var __PRIVATE_ListenSequence = class {
	constructor(e, t) {
		this.previousValue = e, t && (t.sequenceNumberHandler = (e) => this.ae(e), this.ue = (e) => t.writeSequenceNumber(e));
	}
	ae(e) {
		return this.previousValue = Math.max(e, this.previousValue), this.previousValue;
	}
	next() {
		const e = ++this.previousValue;
		return this.ue && this.ue(e), e;
	}
};
__PRIVATE_ListenSequence.ce = -1;
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/** Sentinel value that sorts before any Mutation Batch ID. */
var q = -1;
/**
* Returns whether a variable is either undefined or null.
*/ function __PRIVATE_isNullOrUndefined(e) {
	return null == e;
}
/** Returns whether the value represents -0. */ function __PRIVATE_isNegativeZero(e) {
	return 0 === e && 1 / e == -Infinity;
}
/**
* Returns whether a value is an integer and in the safe integer range
* @param value - The value to test for being an integer and in the safe range
*/ function isSafeInteger(e) {
	return "number" == typeof e && Number.isInteger(e) && !__PRIVATE_isNegativeZero(e) && e <= Number.MAX_SAFE_INTEGER && e >= Number.MIN_SAFE_INTEGER;
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var U = "";
/**
* Encodes a resource path into a IndexedDb-compatible string form.
*/
function __PRIVATE_encodeResourcePath(e) {
	let t = "";
	for (let n = 0; n < e.length; n++) t.length > 0 && (t = __PRIVATE_encodeSeparator(t)), t = __PRIVATE_encodeSegment(e.get(n), t);
	return __PRIVATE_encodeSeparator(t);
}
/** Encodes a single segment of a resource path into the given result */ function __PRIVATE_encodeSegment(e, t) {
	let n = t;
	const r = e.length;
	for (let t = 0; t < r; t++) {
		const r = e.charAt(t);
		switch (r) {
			case "\0":
				n += "";
				break;
			case U:
				n += "";
				break;
			default: n += r;
		}
	}
	return n;
}
/** Encodes a path separator into the given result */ function __PRIVATE_encodeSeparator(e) {
	return e + U + "";
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ function __PRIVATE_objectSize(e) {
	let t = 0;
	for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && t++;
	return t;
}
function forEach(e, t) {
	for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && t(n, e[n]);
}
function isEmpty(e) {
	for (const t in e) if (Object.prototype.hasOwnProperty.call(e, t)) return !1;
	return !0;
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var SortedMap = class SortedMap {
	constructor(e, t) {
		this.comparator = e, this.root = t || LLRBNode.EMPTY;
	}
	insert(e, t) {
		return new SortedMap(this.comparator, this.root.insert(e, t, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
	}
	remove(e) {
		return new SortedMap(this.comparator, this.root.remove(e, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
	}
	get(e) {
		let t = this.root;
		for (; !t.isEmpty();) {
			const n = this.comparator(e, t.key);
			if (0 === n) return t.value;
			n < 0 ? t = t.left : n > 0 && (t = t.right);
		}
		return null;
	}
	indexOf(e) {
		let t = 0, n = this.root;
		for (; !n.isEmpty();) {
			const r = this.comparator(e, n.key);
			if (0 === r) return t + n.left.size;
			r < 0 ? n = n.left : (t += n.left.size + 1, n = n.right);
		}
		return -1;
	}
	isEmpty() {
		return this.root.isEmpty();
	}
	get size() {
		return this.root.size;
	}
	minKey() {
		return this.root.minKey();
	}
	maxKey() {
		return this.root.maxKey();
	}
	inorderTraversal(e) {
		return this.root.inorderTraversal(e);
	}
	forEach(e) {
		this.inorderTraversal(((t, n) => (e(t, n), !1)));
	}
	toString() {
		const e = [];
		return this.inorderTraversal(((t, n) => (e.push(`${t}:${n}`), !1))), `{${e.join(", ")}}`;
	}
	reverseTraversal(e) {
		return this.root.reverseTraversal(e);
	}
	getIterator() {
		return new SortedMapIterator(this.root, null, this.comparator, !1);
	}
	getIteratorFrom(e) {
		return new SortedMapIterator(this.root, e, this.comparator, !1);
	}
	getReverseIterator() {
		return new SortedMapIterator(this.root, null, this.comparator, !0);
	}
	getReverseIteratorFrom(e) {
		return new SortedMapIterator(this.root, e, this.comparator, !0);
	}
};
var SortedMapIterator = class {
	constructor(e, t, n, r) {
		this.isReverse = r, this.nodeStack = [];
		let i = 1;
		for (; !e.isEmpty();) if (i = t ? n(e.key, t) : 1, t && r && (i *= -1), i < 0) e = this.isReverse ? e.left : e.right;
		else {
			if (0 === i) {
				this.nodeStack.push(e);
				break;
			}
			this.nodeStack.push(e), e = this.isReverse ? e.right : e.left;
		}
	}
	getNext() {
		let e = this.nodeStack.pop();
		const t = {
			key: e.key,
			value: e.value
		};
		if (this.isReverse) for (e = e.left; !e.isEmpty();) this.nodeStack.push(e), e = e.right;
		else for (e = e.right; !e.isEmpty();) this.nodeStack.push(e), e = e.left;
		return t;
	}
	hasNext() {
		return this.nodeStack.length > 0;
	}
	peek() {
		if (0 === this.nodeStack.length) return null;
		const e = this.nodeStack[this.nodeStack.length - 1];
		return {
			key: e.key,
			value: e.value
		};
	}
};
var LLRBNode = class LLRBNode {
	constructor(e, t, n, r, i) {
		this.key = e, this.value = t, this.color = null != n ? n : LLRBNode.RED, this.left = null != r ? r : LLRBNode.EMPTY, this.right = null != i ? i : LLRBNode.EMPTY, this.size = this.left.size + 1 + this.right.size;
	}
	copy(e, t, n, r, i) {
		return new LLRBNode(null != e ? e : this.key, null != t ? t : this.value, null != n ? n : this.color, null != r ? r : this.left, null != i ? i : this.right);
	}
	isEmpty() {
		return !1;
	}
	inorderTraversal(e) {
		return this.left.inorderTraversal(e) || e(this.key, this.value) || this.right.inorderTraversal(e);
	}
	reverseTraversal(e) {
		return this.right.reverseTraversal(e) || e(this.key, this.value) || this.left.reverseTraversal(e);
	}
	min() {
		return this.left.isEmpty() ? this : this.left.min();
	}
	minKey() {
		return this.min().key;
	}
	maxKey() {
		return this.right.isEmpty() ? this.key : this.right.maxKey();
	}
	insert(e, t, n) {
		let r = this;
		const i = n(e, r.key);
		return r = i < 0 ? r.copy(null, null, null, r.left.insert(e, t, n), null) : 0 === i ? r.copy(null, t, null, null, null) : r.copy(null, null, null, null, r.right.insert(e, t, n)), r.fixUp();
	}
	removeMin() {
		if (this.left.isEmpty()) return LLRBNode.EMPTY;
		let e = this;
		return e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()), e = e.copy(null, null, null, e.left.removeMin(), null), e.fixUp();
	}
	remove(e, t) {
		let n, r = this;
		if (t(e, r.key) < 0) r.left.isEmpty() || r.left.isRed() || r.left.left.isRed() || (r = r.moveRedLeft()), r = r.copy(null, null, null, r.left.remove(e, t), null);
		else {
			if (r.left.isRed() && (r = r.rotateRight()), r.right.isEmpty() || r.right.isRed() || r.right.left.isRed() || (r = r.moveRedRight()), 0 === t(e, r.key)) {
				if (r.right.isEmpty()) return LLRBNode.EMPTY;
				n = r.right.min(), r = r.copy(n.key, n.value, null, null, r.right.removeMin());
			}
			r = r.copy(null, null, null, null, r.right.remove(e, t));
		}
		return r.fixUp();
	}
	isRed() {
		return this.color;
	}
	fixUp() {
		let e = this;
		return e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()), e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()), e.left.isRed() && e.right.isRed() && (e = e.colorFlip()), e;
	}
	moveRedLeft() {
		let e = this.colorFlip();
		return e.right.left.isRed() && (e = e.copy(null, null, null, null, e.right.rotateRight()), e = e.rotateLeft(), e = e.colorFlip()), e;
	}
	moveRedRight() {
		let e = this.colorFlip();
		return e.left.left.isRed() && (e = e.rotateRight(), e = e.colorFlip()), e;
	}
	rotateLeft() {
		const e = this.copy(null, null, LLRBNode.RED, null, this.right.left);
		return this.right.copy(null, null, this.color, e, null);
	}
	rotateRight() {
		const e = this.copy(null, null, LLRBNode.RED, this.left.right, null);
		return this.left.copy(null, null, this.color, null, e);
	}
	colorFlip() {
		const e = this.left.copy(null, null, !this.left.color, null, null), t = this.right.copy(null, null, !this.right.color, null, null);
		return this.copy(null, null, !this.color, e, t);
	}
	checkMaxDepth() {
		const e = this.check();
		return Math.pow(2, e) <= this.size + 1;
	}
	check() {
		if (this.isRed() && this.left.isRed()) throw fail(43730, {
			key: this.key,
			value: this.value
		});
		if (this.right.isRed()) throw fail(14113, {
			key: this.key,
			value: this.value
		});
		const e = this.left.check();
		if (e !== this.right.check()) throw fail(27949);
		return e + (this.isRed() ? 0 : 1);
	}
};
LLRBNode.EMPTY = null, LLRBNode.RED = !0, LLRBNode.BLACK = !1;
LLRBNode.EMPTY = new class LLRBEmptyNode {
	constructor() {
		this.size = 0;
	}
	get key() {
		throw fail(57766);
	}
	get value() {
		throw fail(16141);
	}
	get color() {
		throw fail(16727);
	}
	get left() {
		throw fail(29726);
	}
	get right() {
		throw fail(36894);
	}
	copy(e, t, n, r, i) {
		return this;
	}
	insert(e, t, n) {
		return new LLRBNode(e, t);
	}
	remove(e, t) {
		return this;
	}
	isEmpty() {
		return !0;
	}
	inorderTraversal(e) {
		return !1;
	}
	reverseTraversal(e) {
		return !1;
	}
	minKey() {
		return null;
	}
	maxKey() {
		return null;
	}
	isRed() {
		return !1;
	}
	checkMaxDepth() {
		return !0;
	}
	check() {
		return 0;
	}
}();
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* SortedSet is an immutable (copy-on-write) collection that holds elements
* in order specified by the provided comparator.
*
* NOTE: if provided comparator returns 0 for two elements, we consider them to
* be equal!
*/
var SortedSet = class SortedSet {
	constructor(e) {
		this.comparator = e, this.data = new SortedMap(this.comparator);
	}
	has(e) {
		return null !== this.data.get(e);
	}
	first() {
		return this.data.minKey();
	}
	last() {
		return this.data.maxKey();
	}
	get size() {
		return this.data.size;
	}
	indexOf(e) {
		return this.data.indexOf(e);
	}
	/** Iterates elements in order defined by "comparator" */ forEach(e) {
		this.data.inorderTraversal(((t, n) => (e(t), !1)));
	}
	/** Iterates over `elem`s such that: range[0] &lt;= elem &lt; range[1]. */ forEachInRange(e, t) {
		const n = this.data.getIteratorFrom(e[0]);
		for (; n.hasNext();) {
			const r = n.getNext();
			if (this.comparator(r.key, e[1]) >= 0) return;
			t(r.key);
		}
	}
	/**
	* Iterates over `elem`s such that: start &lt;= elem until false is returned.
	*/ forEachWhile(e, t) {
		let n;
		for (n = void 0 !== t ? this.data.getIteratorFrom(t) : this.data.getIterator(); n.hasNext();) if (!e(n.getNext().key)) return;
	}
	/** Finds the least element greater than or equal to `elem`. */ firstAfterOrEqual(e) {
		const t = this.data.getIteratorFrom(e);
		return t.hasNext() ? t.getNext().key : null;
	}
	getIterator() {
		return new SortedSetIterator(this.data.getIterator());
	}
	getIteratorFrom(e) {
		return new SortedSetIterator(this.data.getIteratorFrom(e));
	}
	/** Inserts or updates an element */ add(e) {
		return this.copy(this.data.remove(e).insert(e, !0));
	}
	/** Deletes an element */ delete(e) {
		return this.has(e) ? this.copy(this.data.remove(e)) : this;
	}
	isEmpty() {
		return this.data.isEmpty();
	}
	unionWith(e) {
		let t = this;
		return t.size < e.size && (t = e, e = this), e.forEach(((e) => {
			t = t.add(e);
		})), t;
	}
	isEqual(e) {
		if (!(e instanceof SortedSet)) return !1;
		if (this.size !== e.size) return !1;
		const t = this.data.getIterator(), n = e.data.getIterator();
		for (; t.hasNext();) {
			const e = t.getNext().key, r = n.getNext().key;
			if (0 !== this.comparator(e, r)) return !1;
		}
		return !0;
	}
	toArray() {
		const e = [];
		return this.forEach(((t) => {
			e.push(t);
		})), e;
	}
	toString() {
		const e = [];
		return this.forEach(((t) => e.push(t))), "SortedSet(" + e.toString() + ")";
	}
	copy(e) {
		const t = new SortedSet(this.comparator);
		return t.data = e, t;
	}
};
var SortedSetIterator = class {
	constructor(e) {
		this.iter = e;
	}
	getNext() {
		return this.iter.getNext().key;
	}
	hasNext() {
		return this.iter.hasNext();
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Provides a set of fields that can be used to partially patch a document.
* FieldMask is used in conjunction with ObjectValue.
* Examples:
*   foo - Overwrites foo entirely with the provided value. If foo is not
*         present in the companion ObjectValue, the field is deleted.
*   foo.bar - Overwrites only the field bar of the object foo.
*             If foo is not an object, foo is replaced with an object
*             containing foo
*/ var FieldMask = class FieldMask {
	constructor(e) {
		this.fields = e, e.sort(FieldPath$1.comparator);
	}
	static empty() {
		return new FieldMask([]);
	}
	/**
	* Returns a new FieldMask object that is the result of adding all the given
	* fields paths to this field mask.
	*/ unionWith(e) {
		let t = new SortedSet(FieldPath$1.comparator);
		for (const e of this.fields) t = t.add(e);
		for (const n of e) t = t.add(n);
		return new FieldMask(t.toArray());
	}
	/**
	* Verifies that `fieldPath` is included by at least one field in this field
	* mask.
	*
	* This is an O(n) operation, where `n` is the size of the field mask.
	*/ covers(e) {
		for (const t of this.fields) if (t.isPrefixOf(e)) return !0;
		return !1;
	}
	isEqual(e) {
		return __PRIVATE_arrayEquals(this.fields, e.fields, ((e, t) => e.isEqual(t)));
	}
};
/**
* @license
* Copyright 2023 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* An error encountered while decoding base64 string.
*/ var __PRIVATE_Base64DecodeError = class extends Error {
	constructor() {
		super(...arguments), this.name = "Base64DecodeError";
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Immutable class that represents a "proto" byte string.
*
* Proto byte strings can either be Base64-encoded strings or Uint8Arrays when
* sent on the wire. This class abstracts away this differentiation by holding
* the proto byte string in a common class that must be converted into a string
* before being sent as a proto.
* @internal
*/ var ByteString = class ByteString {
	constructor(e) {
		this.binaryString = e;
	}
	static fromBase64String(e) {
		return new ByteString(function __PRIVATE_decodeBase64(e) {
			try {
				return atob(e);
			} catch (e) {
				throw "undefined" != typeof DOMException && e instanceof DOMException ? new __PRIVATE_Base64DecodeError("Invalid base64 string: " + e) : e;
			}
		}(e));
	}
	static fromUint8Array(e) {
		return new ByteString(function __PRIVATE_binaryStringFromUint8Array(e) {
			let t = "";
			for (let n = 0; n < e.length; ++n) t += String.fromCharCode(e[n]);
			return t;
		}(e));
	}
	[Symbol.iterator]() {
		let e = 0;
		return { next: () => e < this.binaryString.length ? {
			value: this.binaryString.charCodeAt(e++),
			done: !1
		} : {
			value: void 0,
			done: !0
		} };
	}
	toBase64() {
		return function __PRIVATE_encodeBase64(e) {
			return btoa(e);
		}(this.binaryString);
	}
	toUint8Array() {
		return function __PRIVATE_uint8ArrayFromBinaryString(e) {
			const t = new Uint8Array(e.length);
			for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
			return t;
		}(this.binaryString);
	}
	approximateByteSize() {
		return 2 * this.binaryString.length;
	}
	compareTo(e) {
		return __PRIVATE_primitiveComparator(this.binaryString, e.binaryString);
	}
	isEqual(e) {
		return this.binaryString === e.binaryString;
	}
};
ByteString.EMPTY_BYTE_STRING = new ByteString("");
var Ye = /* @__PURE__ */ new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
/**
* Converts the possible Proto values for a timestamp value into a "seconds and
* nanos" representation.
*/ function __PRIVATE_normalizeTimestamp(e) {
	if (__PRIVATE_hardAssert(!!e, 39018), "string" == typeof e) {
		let t = 0;
		const n = Ye.exec(e);
		if (__PRIVATE_hardAssert(!!n, 46558, { timestamp: e }), n[1]) {
			let e = n[1];
			e = (e + "000000000").substr(0, 9), t = Number(e);
		}
		const r = new Date(e);
		return {
			seconds: Math.floor(r.getTime() / 1e3),
			nanos: t
		};
	}
	return {
		seconds: __PRIVATE_normalizeNumber(e.seconds),
		nanos: __PRIVATE_normalizeNumber(e.nanos)
	};
}
/**
* Converts the possible Proto types for numbers into a JavaScript number.
* Returns 0 if the value is not numeric.
*/ function __PRIVATE_normalizeNumber(e) {
	return "number" == typeof e ? e : "string" == typeof e ? Number(e) : 0;
}
/** Converts the possible Proto types for Blobs into a ByteString. */ function __PRIVATE_normalizeByteString(e) {
	return "string" == typeof e ? ByteString.fromBase64String(e) : ByteString.fromUint8Array(e);
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Represents a locally-applied ServerTimestamp.
*
* Server Timestamps are backed by MapValues that contain an internal field
* `__type__` with a value of `server_timestamp`. The previous value and local
* write time are stored in its `__previous_value__` and `__local_write_time__`
* fields respectively.
*
* Notes:
* - ServerTimestampValue instances are created as the result of applying a
*   transform. They can only exist in the local view of a document. Therefore
*   they do not need to be parsed or serialized.
* - When evaluated locally (e.g. for snapshot.data()), they by default
*   evaluate to `null`. This behavior can be configured by passing custom
*   FieldValueOptions to value().
* - With respect to other ServerTimestampValues, they sort by their
*   localWriteTime.
*/ var et = "server_timestamp", tt = "__type__", nt = "__previous_value__", rt = "__local_write_time__";
function __PRIVATE_isServerTimestamp(e) {
	return (e?.mapValue?.fields || {})[tt]?.stringValue === et;
}
/**
* Creates a new ServerTimestamp proto value (using the internal format).
*/
/**
* Returns the value of the field before this ServerTimestamp was set.
*
* Preserving the previous values allows the user to display the last resoled
* value until the backend responds with the timestamp.
*/
function __PRIVATE_getPreviousValue(e) {
	const t = e.mapValue.fields[nt];
	return __PRIVATE_isServerTimestamp(t) ? __PRIVATE_getPreviousValue(t) : t;
}
/**
* Returns the local time at which this timestamp was first set.
*/ function __PRIVATE_getLocalWriteTime(e) {
	const t = __PRIVATE_normalizeTimestamp(e.mapValue.fields[rt].timestampValue);
	return new Timestamp(t.seconds, t.nanos);
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var DatabaseInfo = class {
	/**
	* Constructs a DatabaseInfo using the provided host, databaseId and
	* persistenceKey.
	*
	* @param databaseId - The database to use.
	* @param appId - The Firebase App Id.
	* @param persistenceKey - A unique identifier for this Firestore's local
	* storage (used in conjunction with the databaseId).
	* @param host - The Firestore backend host to connect to.
	* @param ssl - Whether to use SSL when connecting.
	* @param forceLongPolling - Whether to use the forceLongPolling option
	* when using WebChannel as the network transport.
	* @param autoDetectLongPolling - Whether to use the detectBufferingProxy
	* option when using WebChannel as the network transport.
	* @param longPollingOptions - Options that configure long-polling.
	* @param useFetchStreams - Whether to use the Fetch API instead of
	* XMLHTTPRequest
	*/
	constructor(e, t, n, r, i, s, o, _, a, u, c) {
		this.databaseId = e, this.appId = t, this.persistenceKey = n, this.host = r, this.ssl = i, this.forceLongPolling = s, this.autoDetectLongPolling = o, this.longPollingOptions = _, this.useFetchStreams = a, this.isUsingEmulator = u, this.apiKey = c;
	}
};
/** The default database name for a project. */ var it = "(default)";
/**
* Represents the database ID a Firestore client is associated with.
* @internal
*/ var DatabaseId = class DatabaseId {
	constructor(e, t) {
		this.projectId = e, this.database = t || it;
	}
	static empty() {
		return new DatabaseId("", "");
	}
	get isDefaultDatabase() {
		return this.database === it;
	}
	isEqual(e) {
		return e instanceof DatabaseId && e.projectId === this.projectId && e.database === this.database;
	}
};
function __PRIVATE_databaseIdFromApp(e, t) {
	if (!Object.prototype.hasOwnProperty.apply(e.options, ["projectId"])) throw new FirestoreError(D.INVALID_ARGUMENT, "\"projectId\" not provided in firebase.initializeApp.");
	return new DatabaseId(e.options.projectId, t);
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var st = "__type__", ot = "__max__", _t = { mapValue: { fields: { __type__: { stringValue: ot } } } }, at = "__vector__", ut = "value";
/** Extracts the backend's type order for the provided value. */
function __PRIVATE_typeOrder(e) {
	return "nullValue" in e ? 0 : "booleanValue" in e ? 1 : "integerValue" in e || "doubleValue" in e ? 2 : "timestampValue" in e ? 3 : "stringValue" in e ? 5 : "bytesValue" in e ? 6 : "referenceValue" in e ? 7 : "geoPointValue" in e ? 8 : "arrayValue" in e ? 9 : "mapValue" in e ? __PRIVATE_isServerTimestamp(e) ? 4 : __PRIVATE_isMaxValue(e) ? 9007199254740991 : __PRIVATE_isVectorValue(e) ? 10 : 11 : fail(28295, { value: e });
}
/** Tests `left` and `right` for equality based on the backend semantics. */ function __PRIVATE_valueEquals(e, t) {
	if (e === t) return !0;
	const n = __PRIVATE_typeOrder(e);
	if (n !== __PRIVATE_typeOrder(t)) return !1;
	switch (n) {
		case 0:
		case 9007199254740991: return !0;
		case 1: return e.booleanValue === t.booleanValue;
		case 4: return __PRIVATE_getLocalWriteTime(e).isEqual(__PRIVATE_getLocalWriteTime(t));
		case 3: return function __PRIVATE_timestampEquals(e, t) {
			if ("string" == typeof e.timestampValue && "string" == typeof t.timestampValue && e.timestampValue.length === t.timestampValue.length) return e.timestampValue === t.timestampValue;
			const n = __PRIVATE_normalizeTimestamp(e.timestampValue), r = __PRIVATE_normalizeTimestamp(t.timestampValue);
			return n.seconds === r.seconds && n.nanos === r.nanos;
		}(e, t);
		case 5: return e.stringValue === t.stringValue;
		case 6: return function __PRIVATE_blobEquals(e, t) {
			return __PRIVATE_normalizeByteString(e.bytesValue).isEqual(__PRIVATE_normalizeByteString(t.bytesValue));
		}(e, t);
		case 7: return e.referenceValue === t.referenceValue;
		case 8: return function __PRIVATE_geoPointEquals(e, t) {
			return __PRIVATE_normalizeNumber(e.geoPointValue.latitude) === __PRIVATE_normalizeNumber(t.geoPointValue.latitude) && __PRIVATE_normalizeNumber(e.geoPointValue.longitude) === __PRIVATE_normalizeNumber(t.geoPointValue.longitude);
		}(e, t);
		case 2: return function __PRIVATE_numberEquals(e, t) {
			if ("integerValue" in e && "integerValue" in t) return __PRIVATE_normalizeNumber(e.integerValue) === __PRIVATE_normalizeNumber(t.integerValue);
			if ("doubleValue" in e && "doubleValue" in t) {
				const n = __PRIVATE_normalizeNumber(e.doubleValue), r = __PRIVATE_normalizeNumber(t.doubleValue);
				return n === r ? __PRIVATE_isNegativeZero(n) === __PRIVATE_isNegativeZero(r) : isNaN(n) && isNaN(r);
			}
			return !1;
		}(e, t);
		case 9: return __PRIVATE_arrayEquals(e.arrayValue.values || [], t.arrayValue.values || [], __PRIVATE_valueEquals);
		case 10:
		case 11: return function __PRIVATE_objectEquals(e, t) {
			const n = e.mapValue.fields || {}, r = t.mapValue.fields || {};
			if (__PRIVATE_objectSize(n) !== __PRIVATE_objectSize(r)) return !1;
			for (const e in n) if (n.hasOwnProperty(e) && (void 0 === r[e] || !__PRIVATE_valueEquals(n[e], r[e]))) return !1;
			return !0;
		}(e, t);
		default: return fail(52216, { left: e });
	}
}
function __PRIVATE_arrayValueContains(e, t) {
	return void 0 !== (e.values || []).find(((e) => __PRIVATE_valueEquals(e, t)));
}
function __PRIVATE_valueCompare(e, t) {
	if (e === t) return 0;
	const n = __PRIVATE_typeOrder(e), r = __PRIVATE_typeOrder(t);
	if (n !== r) return __PRIVATE_primitiveComparator(n, r);
	switch (n) {
		case 0:
		case 9007199254740991: return 0;
		case 1: return __PRIVATE_primitiveComparator(e.booleanValue, t.booleanValue);
		case 2: return function __PRIVATE_compareNumbers(e, t) {
			const n = __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue), r = __PRIVATE_normalizeNumber(t.integerValue || t.doubleValue);
			return n < r ? -1 : n > r ? 1 : n === r ? 0 : isNaN(n) ? isNaN(r) ? 0 : -1 : 1;
		}(e, t);
		case 3: return __PRIVATE_compareTimestamps(e.timestampValue, t.timestampValue);
		case 4: return __PRIVATE_compareTimestamps(__PRIVATE_getLocalWriteTime(e), __PRIVATE_getLocalWriteTime(t));
		case 5: return __PRIVATE_compareUtf8Strings(e.stringValue, t.stringValue);
		case 6: return function __PRIVATE_compareBlobs(e, t) {
			const n = __PRIVATE_normalizeByteString(e), r = __PRIVATE_normalizeByteString(t);
			return n.compareTo(r);
		}(e.bytesValue, t.bytesValue);
		case 7: return function __PRIVATE_compareReferences(e, t) {
			const n = e.split("/"), r = t.split("/");
			for (let e = 0; e < n.length && e < r.length; e++) {
				const t = __PRIVATE_primitiveComparator(n[e], r[e]);
				if (0 !== t) return t;
			}
			return __PRIVATE_primitiveComparator(n.length, r.length);
		}(e.referenceValue, t.referenceValue);
		case 8: return function __PRIVATE_compareGeoPoints(e, t) {
			const n = __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e.latitude), __PRIVATE_normalizeNumber(t.latitude));
			if (0 !== n) return n;
			return __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e.longitude), __PRIVATE_normalizeNumber(t.longitude));
		}(e.geoPointValue, t.geoPointValue);
		case 9: return __PRIVATE_compareArrays(e.arrayValue, t.arrayValue);
		case 10: return function __PRIVATE_compareVectors(e, t) {
			const n = e.fields || {}, r = t.fields || {}, i = n[ut]?.arrayValue, s = r[ut]?.arrayValue, o = __PRIVATE_primitiveComparator(i?.values?.length || 0, s?.values?.length || 0);
			if (0 !== o) return o;
			return __PRIVATE_compareArrays(i, s);
		}(e.mapValue, t.mapValue);
		case 11: return function __PRIVATE_compareMaps(e, t) {
			if (e === _t.mapValue && t === _t.mapValue) return 0;
			if (e === _t.mapValue) return 1;
			if (t === _t.mapValue) return -1;
			const n = e.fields || {}, r = Object.keys(n), i = t.fields || {}, s = Object.keys(i);
			r.sort(), s.sort();
			for (let e = 0; e < r.length && e < s.length; ++e) {
				const t = __PRIVATE_compareUtf8Strings(r[e], s[e]);
				if (0 !== t) return t;
				const o = __PRIVATE_valueCompare(n[r[e]], i[s[e]]);
				if (0 !== o) return o;
			}
			return __PRIVATE_primitiveComparator(r.length, s.length);
		}(e.mapValue, t.mapValue);
		default: throw fail(23264, { he: n });
	}
}
function __PRIVATE_compareTimestamps(e, t) {
	if ("string" == typeof e && "string" == typeof t && e.length === t.length) return __PRIVATE_primitiveComparator(e, t);
	const n = __PRIVATE_normalizeTimestamp(e), r = __PRIVATE_normalizeTimestamp(t), i = __PRIVATE_primitiveComparator(n.seconds, r.seconds);
	return 0 !== i ? i : __PRIVATE_primitiveComparator(n.nanos, r.nanos);
}
function __PRIVATE_compareArrays(e, t) {
	const n = e.values || [], r = t.values || [];
	for (let e = 0; e < n.length && e < r.length; ++e) {
		const t = __PRIVATE_valueCompare(n[e], r[e]);
		if (t) return t;
	}
	return __PRIVATE_primitiveComparator(n.length, r.length);
}
function canonicalId(e) {
	return __PRIVATE_canonifyValue(e);
}
function __PRIVATE_canonifyValue(e) {
	return "nullValue" in e ? "null" : "booleanValue" in e ? "" + e.booleanValue : "integerValue" in e ? "" + e.integerValue : "doubleValue" in e ? "" + e.doubleValue : "timestampValue" in e ? function __PRIVATE_canonifyTimestamp(e) {
		const t = __PRIVATE_normalizeTimestamp(e);
		return `time(${t.seconds},${t.nanos})`;
	}(e.timestampValue) : "stringValue" in e ? e.stringValue : "bytesValue" in e ? function __PRIVATE_canonifyByteString(e) {
		return __PRIVATE_normalizeByteString(e).toBase64();
	}(e.bytesValue) : "referenceValue" in e ? function __PRIVATE_canonifyReference(e) {
		return DocumentKey.fromName(e).toString();
	}(e.referenceValue) : "geoPointValue" in e ? function __PRIVATE_canonifyGeoPoint(e) {
		return `geo(${e.latitude},${e.longitude})`;
	}(e.geoPointValue) : "arrayValue" in e ? function __PRIVATE_canonifyArray(e) {
		let t = "[", n = !0;
		for (const r of e.values || []) n ? n = !1 : t += ",", t += __PRIVATE_canonifyValue(r);
		return t + "]";
	}(e.arrayValue) : "mapValue" in e ? function __PRIVATE_canonifyMap(e) {
		const t = Object.keys(e.fields || {}).sort();
		let n = "{", r = !0;
		for (const i of t) r ? r = !1 : n += ",", n += `${i}:${__PRIVATE_canonifyValue(e.fields[i])}`;
		return n + "}";
	}(e.mapValue) : fail(61005, { value: e });
}
function __PRIVATE_estimateByteSize(e) {
	switch (__PRIVATE_typeOrder(e)) {
		case 0:
		case 1: return 4;
		case 2: return 8;
		case 3:
		case 8: return 16;
		case 4:
			const t = __PRIVATE_getPreviousValue(e);
			return t ? 16 + __PRIVATE_estimateByteSize(t) : 16;
		case 5: return 2 * e.stringValue.length;
		case 6: return __PRIVATE_normalizeByteString(e.bytesValue).approximateByteSize();
		case 7: return e.referenceValue.length;
		case 9: return function __PRIVATE_estimateArrayByteSize(e) {
			return (e.values || []).reduce(((e, t) => e + __PRIVATE_estimateByteSize(t)), 0);
		}(e.arrayValue);
		case 10:
		case 11: return function __PRIVATE_estimateMapByteSize(e) {
			let t = 0;
			return forEach(e.fields, ((e, n) => {
				t += e.length + __PRIVATE_estimateByteSize(n);
			})), t;
		}(e.mapValue);
		default: throw fail(13486, { value: e });
	}
}
function __PRIVATE_refValue(e, t) {
	return { referenceValue: `projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}` };
}
/** Returns true if `value` is an IntegerValue . */ function isInteger(e) {
	return !!e && "integerValue" in e;
}
/** Returns true if `value` is a DoubleValue. */
/** Returns true if `value` is an ArrayValue. */
function isArray(e) {
	return !!e && "arrayValue" in e;
}
/** Returns true if `value` is a NullValue. */ function __PRIVATE_isNullValue(e) {
	return !!e && "nullValue" in e;
}
/** Returns true if `value` is NaN. */ function __PRIVATE_isNanValue(e) {
	return !!e && "doubleValue" in e && isNaN(Number(e.doubleValue));
}
/** Returns true if `value` is a MapValue. */ function __PRIVATE_isMapValue(e) {
	return !!e && "mapValue" in e;
}
/** Returns true if `value` is a VetorValue. */ function __PRIVATE_isVectorValue(e) {
	return (e?.mapValue?.fields || {})[st]?.stringValue === at;
}
/** Creates a deep copy of `source`. */ function __PRIVATE_deepClone(e) {
	if (e.geoPointValue) return { geoPointValue: { ...e.geoPointValue } };
	if (e.timestampValue && "object" == typeof e.timestampValue) return { timestampValue: { ...e.timestampValue } };
	if (e.mapValue) {
		const t = { mapValue: { fields: {} } };
		return forEach(e.mapValue.fields, ((e, n) => t.mapValue.fields[e] = __PRIVATE_deepClone(n))), t;
	}
	if (e.arrayValue) {
		const t = { arrayValue: { values: [] } };
		for (let n = 0; n < (e.arrayValue.values || []).length; ++n) t.arrayValue.values[n] = __PRIVATE_deepClone(e.arrayValue.values[n]);
		return t;
	}
	return { ...e };
}
/** Returns true if the Value represents the canonical {@link #MAX_VALUE} . */ function __PRIVATE_isMaxValue(e) {
	return (((e.mapValue || {}).fields || {}).__type__ || {}).stringValue === ot;
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* An ObjectValue represents a MapValue in the Firestore Proto and offers the
* ability to add and remove fields (via the ObjectValueBuilder).
*/ var ObjectValue = class ObjectValue {
	constructor(e) {
		this.value = e;
	}
	static empty() {
		return new ObjectValue({ mapValue: {} });
	}
	/**
	* Returns the value at the given path or null.
	*
	* @param path - the path to search
	* @returns The value at the path or null if the path is not set.
	*/ field(e) {
		if (e.isEmpty()) return this.value;
		{
			let t = this.value;
			for (let n = 0; n < e.length - 1; ++n) if (t = (t.mapValue.fields || {})[e.get(n)], !__PRIVATE_isMapValue(t)) return null;
			return t = (t.mapValue.fields || {})[e.lastSegment()], t || null;
		}
	}
	/**
	* Sets the field to the provided value.
	*
	* @param path - The field path to set.
	* @param value - The value to set.
	*/ set(e, t) {
		this.getFieldsMap(e.popLast())[e.lastSegment()] = __PRIVATE_deepClone(t);
	}
	/**
	* Sets the provided fields to the provided values.
	*
	* @param data - A map of fields to values (or null for deletes).
	*/ setAll(e) {
		let t = FieldPath$1.emptyPath(), n = {}, r = [];
		e.forEach(((e, i) => {
			if (!t.isImmediateParentOf(i)) {
				const e = this.getFieldsMap(t);
				this.applyChanges(e, n, r), n = {}, r = [], t = i.popLast();
			}
			e ? n[i.lastSegment()] = __PRIVATE_deepClone(e) : r.push(i.lastSegment());
		}));
		const i = this.getFieldsMap(t);
		this.applyChanges(i, n, r);
	}
	/**
	* Removes the field at the specified path. If there is no field at the
	* specified path, nothing is changed.
	*
	* @param path - The field path to remove.
	*/ delete(e) {
		const t = this.field(e.popLast());
		__PRIVATE_isMapValue(t) && t.mapValue.fields && delete t.mapValue.fields[e.lastSegment()];
	}
	isEqual(e) {
		return __PRIVATE_valueEquals(this.value, e.value);
	}
	/**
	* Returns the map that contains the leaf element of `path`. If the parent
	* entry does not yet exist, or if it is not a map, a new map will be created.
	*/ getFieldsMap(e) {
		let t = this.value;
		t.mapValue.fields || (t.mapValue = { fields: {} });
		for (let n = 0; n < e.length; ++n) {
			let r = t.mapValue.fields[e.get(n)];
			__PRIVATE_isMapValue(r) && r.mapValue.fields || (r = { mapValue: { fields: {} } }, t.mapValue.fields[e.get(n)] = r), t = r;
		}
		return t.mapValue.fields;
	}
	/**
	* Modifies `fieldsMap` by adding, replacing or deleting the specified
	* entries.
	*/ applyChanges(e, t, n) {
		forEach(t, ((t, n) => e[t] = n));
		for (const t of n) delete e[t];
	}
	clone() {
		return new ObjectValue(__PRIVATE_deepClone(this.value));
	}
};
/**
* Returns a FieldMask built from all fields in a MapValue.
*/ function __PRIVATE_extractFieldMask(e) {
	const t = [];
	return forEach(e.fields, ((e, n) => {
		const r = new FieldPath$1([e]);
		if (__PRIVATE_isMapValue(n)) {
			const e = __PRIVATE_extractFieldMask(n.mapValue).fields;
			if (0 === e.length) t.push(r);
			else for (const n of e) t.push(r.child(n));
		} else t.push(r);
	})), new FieldMask(t);
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Represents a document in Firestore with a key, version, data and whether it
* has local mutations applied to it.
*
* Documents can transition between states via `convertToFoundDocument()`,
* `convertToNoDocument()` and `convertToUnknownDocument()`. If a document does
* not transition to one of these states even after all mutations have been
* applied, `isValidDocument()` returns false and the document should be removed
* from all views.
*/ var MutableDocument = class MutableDocument {
	constructor(e, t, n, r, i, s, o) {
		this.key = e, this.documentType = t, this.version = n, this.readTime = r, this.createTime = i, this.data = s, this.documentState = o;
	}
	/**
	* Creates a document with no known version or data, but which can serve as
	* base document for mutations.
	*/ static newInvalidDocument(e) {
		return new MutableDocument(e, 0, SnapshotVersion.min(), SnapshotVersion.min(), SnapshotVersion.min(), ObjectValue.empty(), 0);
	}
	/**
	* Creates a new document that is known to exist with the given data at the
	* given version.
	*/ static newFoundDocument(e, t, n, r) {
		return new MutableDocument(e, 1, t, SnapshotVersion.min(), n, r, 0);
	}
	/** Creates a new document that is known to not exist at the given version. */ static newNoDocument(e, t) {
		return new MutableDocument(e, 2, t, SnapshotVersion.min(), SnapshotVersion.min(), ObjectValue.empty(), 0);
	}
	/**
	* Creates a new document that is known to exist at the given version but
	* whose data is not known (e.g. a document that was updated without a known
	* base document).
	*/ static newUnknownDocument(e, t) {
		return new MutableDocument(e, 3, t, SnapshotVersion.min(), SnapshotVersion.min(), ObjectValue.empty(), 2);
	}
	/**
	* Changes the document type to indicate that it exists and that its version
	* and data are known.
	*/ convertToFoundDocument(e, t) {
		return !this.createTime.isEqual(SnapshotVersion.min()) || 2 !== this.documentType && 0 !== this.documentType || (this.createTime = e), this.version = e, this.documentType = 1, this.data = t, this.documentState = 0, this;
	}
	/**
	* Changes the document type to indicate that it doesn't exist at the given
	* version.
	*/ convertToNoDocument(e) {
		return this.version = e, this.documentType = 2, this.data = ObjectValue.empty(), this.documentState = 0, this;
	}
	/**
	* Changes the document type to indicate that it exists at a given version but
	* that its data is not known (e.g. a document that was updated without a known
	* base document).
	*/ convertToUnknownDocument(e) {
		return this.version = e, this.documentType = 3, this.data = ObjectValue.empty(), this.documentState = 2, this;
	}
	setHasCommittedMutations() {
		return this.documentState = 2, this;
	}
	setHasLocalMutations() {
		return this.documentState = 1, this.version = SnapshotVersion.min(), this;
	}
	setReadTime(e) {
		return this.readTime = e, this;
	}
	get hasLocalMutations() {
		return 1 === this.documentState;
	}
	get hasCommittedMutations() {
		return 2 === this.documentState;
	}
	get hasPendingWrites() {
		return this.hasLocalMutations || this.hasCommittedMutations;
	}
	isValidDocument() {
		return 0 !== this.documentType;
	}
	isFoundDocument() {
		return 1 === this.documentType;
	}
	isNoDocument() {
		return 2 === this.documentType;
	}
	isUnknownDocument() {
		return 3 === this.documentType;
	}
	isEqual(e) {
		return e instanceof MutableDocument && this.key.isEqual(e.key) && this.version.isEqual(e.version) && this.documentType === e.documentType && this.documentState === e.documentState && this.data.isEqual(e.data);
	}
	mutableCopy() {
		return new MutableDocument(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
	}
	toString() {
		return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
	}
};
/**
* Compares the value for field `field` in the provided documents. Throws if
* the field does not exist in both documents.
*/
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Represents a bound of a query.
*
* The bound is specified with the given components representing a position and
* whether it's just before or just after the position (relative to whatever the
* query order is).
*
* The position represents a logical index position for a query. It's a prefix
* of values for the (potentially implicit) order by clauses of a query.
*
* Bound provides a function to determine whether a document comes before or
* after a bound. This is influenced by whether the position is just before or
* just after the provided values.
*/
var Bound = class {
	constructor(e, t) {
		this.position = e, this.inclusive = t;
	}
};
function __PRIVATE_boundCompareToDocument(e, t, n) {
	let r = 0;
	for (let i = 0; i < e.position.length; i++) {
		const s = t[i], o = e.position[i];
		if (s.field.isKeyField()) r = DocumentKey.comparator(DocumentKey.fromName(o.referenceValue), n.key);
		else r = __PRIVATE_valueCompare(o, n.data.field(s.field));
		if ("desc" === s.dir && (r *= -1), 0 !== r) break;
	}
	return r;
}
/**
* Returns true if a document sorts after a bound using the provided sort
* order.
*/ function __PRIVATE_boundEquals(e, t) {
	if (null === e) return null === t;
	if (null === t) return !1;
	if (e.inclusive !== t.inclusive || e.position.length !== t.position.length) return !1;
	for (let n = 0; n < e.position.length; n++) if (!__PRIVATE_valueEquals(e.position[n], t.position[n])) return !1;
	return !0;
}
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* An ordering on a field, in some Direction. Direction defaults to ASCENDING.
*/ var OrderBy = class {
	constructor(e, t = "asc") {
		this.field = e, this.dir = t;
	}
};
function __PRIVATE_orderByEquals(e, t) {
	return e.dir === t.dir && e.field.isEqual(t.field);
}
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var Filter = class {};
var FieldFilter = class FieldFilter extends Filter {
	constructor(e, t, n) {
		super(), this.field = e, this.op = t, this.value = n;
	}
	/**
	* Creates a filter based on the provided arguments.
	*/ static create(e, t, n) {
		return e.isKeyField() ? "in" === t || "not-in" === t ? this.createKeyFieldInFilter(e, t, n) : new __PRIVATE_KeyFieldFilter(e, t, n) : "array-contains" === t ? new __PRIVATE_ArrayContainsFilter(e, n) : "in" === t ? new __PRIVATE_InFilter(e, n) : "not-in" === t ? new __PRIVATE_NotInFilter(e, n) : "array-contains-any" === t ? new __PRIVATE_ArrayContainsAnyFilter(e, n) : new FieldFilter(e, t, n);
	}
	static createKeyFieldInFilter(e, t, n) {
		return "in" === t ? new __PRIVATE_KeyFieldInFilter(e, n) : new __PRIVATE_KeyFieldNotInFilter(e, n);
	}
	matches(e) {
		const t = e.data.field(this.field);
		return "!=" === this.op ? null !== t && void 0 === t.nullValue && this.matchesComparison(__PRIVATE_valueCompare(t, this.value)) : null !== t && __PRIVATE_typeOrder(this.value) === __PRIVATE_typeOrder(t) && this.matchesComparison(__PRIVATE_valueCompare(t, this.value));
	}
	matchesComparison(e) {
		switch (this.op) {
			case "<": return e < 0;
			case "<=": return e <= 0;
			case "==": return 0 === e;
			case "!=": return 0 !== e;
			case ">": return e > 0;
			case ">=": return e >= 0;
			default: return fail(47266, { operator: this.op });
		}
	}
	isInequality() {
		return [
			"<",
			"<=",
			">",
			">=",
			"!=",
			"not-in"
		].indexOf(this.op) >= 0;
	}
	getFlattenedFilters() {
		return [this];
	}
	getFilters() {
		return [this];
	}
};
var CompositeFilter = class CompositeFilter extends Filter {
	constructor(e, t) {
		super(), this.filters = e, this.op = t, this.Pe = null;
	}
	/**
	* Creates a filter based on the provided arguments.
	*/ static create(e, t) {
		return new CompositeFilter(e, t);
	}
	matches(e) {
		return __PRIVATE_compositeFilterIsConjunction(this) ? void 0 === this.filters.find(((t) => !t.matches(e))) : void 0 !== this.filters.find(((t) => t.matches(e)));
	}
	getFlattenedFilters() {
		return null !== this.Pe || (this.Pe = this.filters.reduce(((e, t) => e.concat(t.getFlattenedFilters())), [])), this.Pe;
	}
	getFilters() {
		return Object.assign([], this.filters);
	}
};
function __PRIVATE_compositeFilterIsConjunction(e) {
	return "and" === e.op;
}
/**
* Returns true if this filter is a conjunction of field filters only. Returns false otherwise.
*/ function __PRIVATE_compositeFilterIsFlatConjunction(e) {
	return __PRIVATE_compositeFilterIsFlat(e) && __PRIVATE_compositeFilterIsConjunction(e);
}
/**
* Returns true if this filter does not contain any composite filters. Returns false otherwise.
*/ function __PRIVATE_compositeFilterIsFlat(e) {
	for (const t of e.filters) if (t instanceof CompositeFilter) return !1;
	return !0;
}
function __PRIVATE_canonifyFilter(e) {
	if (e instanceof FieldFilter) return e.field.canonicalString() + e.op.toString() + canonicalId(e.value);
	if (__PRIVATE_compositeFilterIsFlatConjunction(e)) return e.filters.map(((e) => __PRIVATE_canonifyFilter(e))).join(",");
	{
		const t = e.filters.map(((e) => __PRIVATE_canonifyFilter(e))).join(",");
		return `${e.op}(${t})`;
	}
}
function __PRIVATE_filterEquals(e, t) {
	return e instanceof FieldFilter ? function __PRIVATE_fieldFilterEquals(e, t) {
		return t instanceof FieldFilter && e.op === t.op && e.field.isEqual(t.field) && __PRIVATE_valueEquals(e.value, t.value);
	}(e, t) : e instanceof CompositeFilter ? function __PRIVATE_compositeFilterEquals(e, t) {
		if (t instanceof CompositeFilter && e.op === t.op && e.filters.length === t.filters.length) return e.filters.reduce(((e, n, r) => e && __PRIVATE_filterEquals(n, t.filters[r])), !0);
		return !1;
	}(e, t) : void fail(19439);
}
/** Returns a debug description for `filter`. */ function __PRIVATE_stringifyFilter(e) {
	return e instanceof FieldFilter ? function __PRIVATE_stringifyFieldFilter(e) {
		return `${e.field.canonicalString()} ${e.op} ${canonicalId(e.value)}`;
	}(e) : e instanceof CompositeFilter ? function __PRIVATE_stringifyCompositeFilter(e) {
		return e.op.toString() + " {" + e.getFilters().map(__PRIVATE_stringifyFilter).join(" ,") + "}";
	}(e) : "Filter";
}
var __PRIVATE_KeyFieldFilter = class extends FieldFilter {
	constructor(e, t, n) {
		super(e, t, n), this.key = DocumentKey.fromName(n.referenceValue);
	}
	matches(e) {
		const t = DocumentKey.comparator(e.key, this.key);
		return this.matchesComparison(t);
	}
};
/** Filter that matches on key fields within an array. */ var __PRIVATE_KeyFieldInFilter = class extends FieldFilter {
	constructor(e, t) {
		super(e, "in", t), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("in", t);
	}
	matches(e) {
		return this.keys.some(((t) => t.isEqual(e.key)));
	}
};
/** Filter that matches on key fields not present within an array. */ var __PRIVATE_KeyFieldNotInFilter = class extends FieldFilter {
	constructor(e, t) {
		super(e, "not-in", t), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("not-in", t);
	}
	matches(e) {
		return !this.keys.some(((t) => t.isEqual(e.key)));
	}
};
function __PRIVATE_extractDocumentKeysFromArrayValue(e, t) {
	return (t.arrayValue?.values || []).map(((e) => DocumentKey.fromName(e.referenceValue)));
}
/** A Filter that implements the array-contains operator. */ var __PRIVATE_ArrayContainsFilter = class extends FieldFilter {
	constructor(e, t) {
		super(e, "array-contains", t);
	}
	matches(e) {
		const t = e.data.field(this.field);
		return isArray(t) && __PRIVATE_arrayValueContains(t.arrayValue, this.value);
	}
};
/** A Filter that implements the IN operator. */ var __PRIVATE_InFilter = class extends FieldFilter {
	constructor(e, t) {
		super(e, "in", t);
	}
	matches(e) {
		const t = e.data.field(this.field);
		return null !== t && __PRIVATE_arrayValueContains(this.value.arrayValue, t);
	}
};
/** A Filter that implements the not-in operator. */ var __PRIVATE_NotInFilter = class extends FieldFilter {
	constructor(e, t) {
		super(e, "not-in", t);
	}
	matches(e) {
		if (__PRIVATE_arrayValueContains(this.value.arrayValue, { nullValue: "NULL_VALUE" })) return !1;
		const t = e.data.field(this.field);
		return null !== t && void 0 === t.nullValue && !__PRIVATE_arrayValueContains(this.value.arrayValue, t);
	}
};
/** A Filter that implements the array-contains-any operator. */ var __PRIVATE_ArrayContainsAnyFilter = class extends FieldFilter {
	constructor(e, t) {
		super(e, "array-contains-any", t);
	}
	matches(e) {
		const t = e.data.field(this.field);
		return !(!isArray(t) || !t.arrayValue.values) && t.arrayValue.values.some(((e) => __PRIVATE_arrayValueContains(this.value.arrayValue, e)));
	}
};
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var __PRIVATE_TargetImpl = class {
	constructor(e, t = null, n = [], r = [], i = null, s = null, o = null) {
		this.path = e, this.collectionGroup = t, this.orderBy = n, this.filters = r, this.limit = i, this.startAt = s, this.endAt = o, this.Te = null;
	}
};
/**
* Initializes a Target with a path and optional additional query constraints.
* Path must currently be empty if this is a collection group query.
*
* NOTE: you should always construct `Target` from `Query.toTarget` instead of
* using this factory method, because `Query` provides an implicit `orderBy`
* property.
*/ function __PRIVATE_newTarget(e, t = null, n = [], r = [], i = null, s = null, o = null) {
	return new __PRIVATE_TargetImpl(e, t, n, r, i, s, o);
}
function __PRIVATE_canonifyTarget(e) {
	const t = __PRIVATE_debugCast(e);
	if (null === t.Te) {
		let e = t.path.canonicalString();
		null !== t.collectionGroup && (e += "|cg:" + t.collectionGroup), e += "|f:", e += t.filters.map(((e) => __PRIVATE_canonifyFilter(e))).join(","), e += "|ob:", e += t.orderBy.map(((e) => function __PRIVATE_canonifyOrderBy(e) {
			return e.field.canonicalString() + e.dir;
		}(e))).join(","), __PRIVATE_isNullOrUndefined(t.limit) || (e += "|l:", e += t.limit), t.startAt && (e += "|lb:", e += t.startAt.inclusive ? "b:" : "a:", e += t.startAt.position.map(((e) => canonicalId(e))).join(",")), t.endAt && (e += "|ub:", e += t.endAt.inclusive ? "a:" : "b:", e += t.endAt.position.map(((e) => canonicalId(e))).join(",")), t.Te = e;
	}
	return t.Te;
}
function __PRIVATE_targetEquals(e, t) {
	if (e.limit !== t.limit) return !1;
	if (e.orderBy.length !== t.orderBy.length) return !1;
	for (let n = 0; n < e.orderBy.length; n++) if (!__PRIVATE_orderByEquals(e.orderBy[n], t.orderBy[n])) return !1;
	if (e.filters.length !== t.filters.length) return !1;
	for (let n = 0; n < e.filters.length; n++) if (!__PRIVATE_filterEquals(e.filters[n], t.filters[n])) return !1;
	return e.collectionGroup === t.collectionGroup && !!e.path.isEqual(t.path) && !!__PRIVATE_boundEquals(e.startAt, t.startAt) && __PRIVATE_boundEquals(e.endAt, t.endAt);
}
function __PRIVATE_targetIsDocumentTarget(e) {
	return DocumentKey.isDocumentKey(e.path) && null === e.collectionGroup && 0 === e.filters.length;
}
/** Returns the number of segments of a perfect index for this target. */
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Query encapsulates all the query attributes we support in the SDK. It can
* be run against the LocalStore, as well as be converted to a `Target` to
* query the RemoteStore results.
*
* Visible for testing.
*/
var __PRIVATE_QueryImpl = class {
	/**
	* Initializes a Query with a path and optional additional query constraints.
	* Path must currently be empty if this is a collection group query.
	*/
	constructor(e, t = null, n = [], r = [], i = null, s = "F", o = null, _ = null) {
		this.path = e, this.collectionGroup = t, this.explicitOrderBy = n, this.filters = r, this.limit = i, this.limitType = s, this.startAt = o, this.endAt = _, this.Ee = null, this.Ie = null, this.Re = null, this.startAt, this.endAt;
	}
};
/** Creates a new Query instance with the options provided. */ function __PRIVATE_newQuery(e, t, n, r, i, s, o, _) {
	return new __PRIVATE_QueryImpl(e, t, n, r, i, s, o, _);
}
/** Creates a new Query for a query that matches all documents at `path` */ function __PRIVATE_newQueryForPath(e) {
	return new __PRIVATE_QueryImpl(e);
}
/**
* Helper to convert a collection group query into a collection query at a
* specific path. This is used when executing collection group queries, since
* we have to split the query into a set of collection queries at multiple
* paths.
*/
/**
* Returns true if this query does not specify any query constraints that
* could remove results.
*/
function __PRIVATE_queryMatchesAllDocuments(e) {
	return 0 === e.filters.length && null === e.limit && null == e.startAt && null == e.endAt && (0 === e.explicitOrderBy.length || 1 === e.explicitOrderBy.length && e.explicitOrderBy[0].field.isKeyField());
}
/**
* Returns whether the query matches a single document by path (rather than a
* collection).
*/
function __PRIVATE_isDocumentQuery$1(e) {
	return DocumentKey.isDocumentKey(e.path) && null === e.collectionGroup && 0 === e.filters.length;
}
/**
* Returns whether the query matches a collection group rather than a specific
* collection.
*/ function __PRIVATE_isCollectionGroupQuery(e) {
	return null !== e.collectionGroup;
}
/**
* Returns the normalized order-by constraint that is used to execute the Query,
* which can be different from the order-by constraints the user provided (e.g.
* the SDK and backend always orders by `__name__`). The normalized order-by
* includes implicit order-bys in addition to the explicit user provided
* order-bys.
*/ function __PRIVATE_queryNormalizedOrderBy(e) {
	const t = __PRIVATE_debugCast(e);
	if (null === t.Ee) {
		t.Ee = [];
		const e = /* @__PURE__ */ new Set();
		for (const n of t.explicitOrderBy) t.Ee.push(n), e.add(n.field.canonicalString());
		const n = t.explicitOrderBy.length > 0 ? t.explicitOrderBy[t.explicitOrderBy.length - 1].dir : "asc";
		(function __PRIVATE_getInequalityFilterFields(e) {
			let t = new SortedSet(FieldPath$1.comparator);
			return e.filters.forEach(((e) => {
				e.getFlattenedFilters().forEach(((e) => {
					e.isInequality() && (t = t.add(e.field));
				}));
			})), t;
		})(t).forEach(((r) => {
			e.has(r.canonicalString()) || r.isKeyField() || t.Ee.push(new OrderBy(r, n));
		})), e.has(FieldPath$1.keyField().canonicalString()) || t.Ee.push(new OrderBy(FieldPath$1.keyField(), n));
	}
	return t.Ee;
}
/**
* Converts this `Query` instance to its corresponding `Target` representation.
*/ function __PRIVATE_queryToTarget(e) {
	const t = __PRIVATE_debugCast(e);
	return t.Ie || (t.Ie = __PRIVATE__queryToTarget(t, __PRIVATE_queryNormalizedOrderBy(e))), t.Ie;
}
function __PRIVATE__queryToTarget(e, t) {
	if ("F" === e.limitType) return __PRIVATE_newTarget(e.path, e.collectionGroup, t, e.filters, e.limit, e.startAt, e.endAt);
	{
		t = t.map(((e) => {
			const t = "desc" === e.dir ? "asc" : "desc";
			return new OrderBy(e.field, t);
		}));
		const n = e.endAt ? new Bound(e.endAt.position, e.endAt.inclusive) : null, r = e.startAt ? new Bound(e.startAt.position, e.startAt.inclusive) : null;
		return __PRIVATE_newTarget(e.path, e.collectionGroup, t, e.filters, e.limit, n, r);
	}
}
function __PRIVATE_queryWithAddedFilter(e, t) {
	const n = e.filters.concat([t]);
	return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), n, e.limit, e.limitType, e.startAt, e.endAt);
}
function __PRIVATE_queryWithAddedOrderBy(e, t) {
	const n = e.explicitOrderBy.concat([t]);
	return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, n, e.filters.slice(), e.limit, e.limitType, e.startAt, e.endAt);
}
function __PRIVATE_queryWithLimit(e, t, n) {
	return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), e.filters.slice(), t, n, e.startAt, e.endAt);
}
function __PRIVATE_queryEquals(e, t) {
	return __PRIVATE_targetEquals(__PRIVATE_queryToTarget(e), __PRIVATE_queryToTarget(t)) && e.limitType === t.limitType;
}
function __PRIVATE_canonifyQuery(e) {
	return `${__PRIVATE_canonifyTarget(__PRIVATE_queryToTarget(e))}|lt:${e.limitType}`;
}
function __PRIVATE_stringifyQuery(e) {
	return `Query(target=${function __PRIVATE_stringifyTarget(e) {
		let t = e.path.canonicalString();
		return null !== e.collectionGroup && (t += " collectionGroup=" + e.collectionGroup), e.filters.length > 0 && (t += `, filters: [${e.filters.map(((e) => __PRIVATE_stringifyFilter(e))).join(", ")}]`), __PRIVATE_isNullOrUndefined(e.limit) || (t += ", limit: " + e.limit), e.orderBy.length > 0 && (t += `, orderBy: [${e.orderBy.map(((e) => function __PRIVATE_stringifyOrderBy(e) {
			return `${e.field.canonicalString()} (${e.dir})`;
		}(e))).join(", ")}]`), e.startAt && (t += ", startAt: ", t += e.startAt.inclusive ? "b:" : "a:", t += e.startAt.position.map(((e) => canonicalId(e))).join(",")), e.endAt && (t += ", endAt: ", t += e.endAt.inclusive ? "a:" : "b:", t += e.endAt.position.map(((e) => canonicalId(e))).join(",")), `Target(${t})`;
	}(__PRIVATE_queryToTarget(e))}; limitType=${e.limitType})`;
}
/** Returns whether `doc` matches the constraints of `query`. */ function __PRIVATE_queryMatches(e, t) {
	return t.isFoundDocument() && function __PRIVATE_queryMatchesPathAndCollectionGroup(e, t) {
		const n = t.key.path;
		return null !== e.collectionGroup ? t.key.hasCollectionId(e.collectionGroup) && e.path.isPrefixOf(n) : DocumentKey.isDocumentKey(e.path) ? e.path.isEqual(n) : e.path.isImmediateParentOf(n);
	}(e, t) && function __PRIVATE_queryMatchesOrderBy(e, t) {
		for (const n of __PRIVATE_queryNormalizedOrderBy(e)) if (!n.field.isKeyField() && null === t.data.field(n.field)) return !1;
		return !0;
	}(e, t) && function __PRIVATE_queryMatchesFilters(e, t) {
		for (const n of e.filters) if (!n.matches(t)) return !1;
		return !0;
	}(e, t) && function __PRIVATE_queryMatchesBounds(e, t) {
		if (e.startAt && !function __PRIVATE_boundSortsBeforeDocument(e, t, n) {
			const r = __PRIVATE_boundCompareToDocument(e, t, n);
			return e.inclusive ? r <= 0 : r < 0;
		}(e.startAt, __PRIVATE_queryNormalizedOrderBy(e), t)) return !1;
		if (e.endAt && !function __PRIVATE_boundSortsAfterDocument(e, t, n) {
			const r = __PRIVATE_boundCompareToDocument(e, t, n);
			return e.inclusive ? r >= 0 : r > 0;
		}(e.endAt, __PRIVATE_queryNormalizedOrderBy(e), t)) return !1;
		return !0;
	}(e, t);
}
function __PRIVATE_queryCollectionGroup(e) {
	return e.collectionGroup || (e.path.length % 2 == 1 ? e.path.lastSegment() : e.path.get(e.path.length - 2));
}
/**
* Returns a new comparator function that can be used to compare two documents
* based on the Query's ordering constraint.
*/ function __PRIVATE_newQueryComparator(e) {
	return (t, n) => {
		let r = !1;
		for (const i of __PRIVATE_queryNormalizedOrderBy(e)) {
			const e = __PRIVATE_compareDocs(i, t, n);
			if (0 !== e) return e;
			r = r || i.field.isKeyField();
		}
		return 0;
	};
}
function __PRIVATE_compareDocs(e, t, n) {
	const r = e.field.isKeyField() ? DocumentKey.comparator(t.key, n.key) : function __PRIVATE_compareDocumentsByField(e, t, n) {
		const r = t.data.field(e), i = n.data.field(e);
		return null !== r && null !== i ? __PRIVATE_valueCompare(r, i) : fail(42886);
	}(e.field, t, n);
	switch (e.dir) {
		case "asc": return r;
		case "desc": return -1 * r;
		default: return fail(19790, { direction: e.dir });
	}
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* A map implementation that uses objects as keys. Objects must have an
* associated equals function and must be immutable. Entries in the map are
* stored together with the key being produced from the mapKeyFn. This map
* automatically handles collisions of keys.
*/ var ObjectMap = class {
	constructor(e, t) {
		this.mapKeyFn = e, this.equalsFn = t, this.inner = {}, this.innerSize = 0;
	}
	/** Get a value for this key, or undefined if it does not exist. */ get(e) {
		const t = this.mapKeyFn(e), n = this.inner[t];
		if (void 0 !== n) {
			for (const [t, r] of n) if (this.equalsFn(t, e)) return r;
		}
	}
	has(e) {
		return void 0 !== this.get(e);
	}
	/** Put this key and value in the map. */ set(e, t) {
		const n = this.mapKeyFn(e), r = this.inner[n];
		if (void 0 === r) return this.inner[n] = [[e, t]], void this.innerSize++;
		for (let n = 0; n < r.length; n++) if (this.equalsFn(r[n][0], e)) return void (r[n] = [e, t]);
		r.push([e, t]), this.innerSize++;
	}
	/**
	* Remove this key from the map. Returns a boolean if anything was deleted.
	*/ delete(e) {
		const t = this.mapKeyFn(e), n = this.inner[t];
		if (void 0 === n) return !1;
		for (let r = 0; r < n.length; r++) if (this.equalsFn(n[r][0], e)) return 1 === n.length ? delete this.inner[t] : n.splice(r, 1), this.innerSize--, !0;
		return !1;
	}
	forEach(e) {
		forEach(this.inner, ((t, n) => {
			for (const [t, r] of n) e(t, r);
		}));
	}
	isEmpty() {
		return isEmpty(this.inner);
	}
	size() {
		return this.innerSize;
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var ht = new SortedMap(DocumentKey.comparator);
function __PRIVATE_mutableDocumentMap() {
	return ht;
}
var Pt = new SortedMap(DocumentKey.comparator);
function documentMap(...e) {
	let t = Pt;
	for (const n of e) t = t.insert(n.key, n);
	return t;
}
function __PRIVATE_convertOverlayedDocumentMapToDocumentMap(e) {
	let t = Pt;
	return e.forEach(((e, n) => t = t.insert(e, n.overlayedDocument))), t;
}
function __PRIVATE_newOverlayMap() {
	return __PRIVATE_newDocumentKeyMap();
}
function __PRIVATE_newMutationMap() {
	return __PRIVATE_newDocumentKeyMap();
}
function __PRIVATE_newDocumentKeyMap() {
	return new ObjectMap(((e) => e.toString()), ((e, t) => e.isEqual(t)));
}
var Tt = new SortedMap(DocumentKey.comparator);
var It = new SortedSet(DocumentKey.comparator);
function __PRIVATE_documentKeySet(...e) {
	let t = It;
	for (const n of e) t = t.add(n);
	return t;
}
var Et = new SortedSet(__PRIVATE_primitiveComparator);
function __PRIVATE_targetIdSet() {
	return Et;
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Returns an DoubleValue for `value` that is encoded based the serializer's
* `useProto3Json` setting.
*/ function __PRIVATE_toDouble(e, t) {
	if (e.useProto3Json) {
		if (isNaN(t)) return { doubleValue: "NaN" };
		if (t === Infinity) return { doubleValue: "Infinity" };
		if (t === -Infinity) return { doubleValue: "-Infinity" };
	}
	return { doubleValue: __PRIVATE_isNegativeZero(t) ? "-0" : t };
}
/**
* Returns an IntegerValue for `value`.
*/ function __PRIVATE_toInteger(e) {
	return { integerValue: "" + e };
}
/**
* Returns a value for a number that's appropriate to put into a proto.
* The return value is an IntegerValue if it can safely represent the value,
* otherwise a DoubleValue is returned.
*/ function toNumber(e, t) {
	return isSafeInteger(t) ? __PRIVATE_toInteger(t) : __PRIVATE_toDouble(e, t);
}
/**
* @license
* Copyright 2018 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/** Used to represent a field transform on a mutation. */ var TransformOperation = class {
	constructor() {
		this._ = void 0;
	}
};
/**
* Computes the local transform result against the provided `previousValue`,
* optionally using the provided localWriteTime.
*/ function __PRIVATE_applyTransformOperationToLocalView(e, t, n) {
	return e instanceof __PRIVATE_ServerTimestampTransform ? function serverTimestamp$1(e, t) {
		const n = { fields: {
			[tt]: { stringValue: et },
			[rt]: { timestampValue: {
				seconds: e.seconds,
				nanos: e.nanoseconds
			} }
		} };
		return t && __PRIVATE_isServerTimestamp(t) && (t = __PRIVATE_getPreviousValue(t)), t && (n.fields[nt] = t), { mapValue: n };
	}(n, t) : e instanceof __PRIVATE_ArrayUnionTransformOperation ? __PRIVATE_applyArrayUnionTransformOperation(e, t) : e instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_applyArrayRemoveTransformOperation(e, t) : function __PRIVATE_applyNumericIncrementTransformOperationToLocalView(e, t) {
		const n = __PRIVATE_computeTransformOperationBaseValue(e, t), r = asNumber(n) + asNumber(e.Ae);
		return isInteger(n) && isInteger(e.Ae) ? __PRIVATE_toInteger(r) : __PRIVATE_toDouble(e.serializer, r);
	}(e, t);
}
/**
* Computes a final transform result after the transform has been acknowledged
* by the server, potentially using the server-provided transformResult.
*/ function __PRIVATE_applyTransformOperationToRemoteDocument(e, t, n) {
	return e instanceof __PRIVATE_ArrayUnionTransformOperation ? __PRIVATE_applyArrayUnionTransformOperation(e, t) : e instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_applyArrayRemoveTransformOperation(e, t) : n;
}
/**
* If this transform operation is not idempotent, returns the base value to
* persist for this transform. If a base value is returned, the transform
* operation is always applied to this base value, even if document has
* already been updated.
*
* Base values provide consistent behavior for non-idempotent transforms and
* allow us to return the same latency-compensated value even if the backend
* has already applied the transform operation. The base value is null for
* idempotent transforms, as they can be re-played even if the backend has
* already applied them.
*
* @returns a base value to store along with the mutation, or null for
* idempotent transforms.
*/ function __PRIVATE_computeTransformOperationBaseValue(e, t) {
	return e instanceof __PRIVATE_NumericIncrementTransformOperation ? function __PRIVATE_isNumber(e) {
		return isInteger(e) || function __PRIVATE_isDouble(e) {
			return !!e && "doubleValue" in e;
		}(e);
	}(t) ? t : { integerValue: 0 } : null;
}
/** Transforms a value into a server-generated timestamp. */
var __PRIVATE_ServerTimestampTransform = class extends TransformOperation {};
/** Transforms an array value via a union operation. */ var __PRIVATE_ArrayUnionTransformOperation = class extends TransformOperation {
	constructor(e) {
		super(), this.elements = e;
	}
};
function __PRIVATE_applyArrayUnionTransformOperation(e, t) {
	const n = __PRIVATE_coercedFieldValuesArray(t);
	for (const t of e.elements) n.some(((e) => __PRIVATE_valueEquals(e, t))) || n.push(t);
	return { arrayValue: { values: n } };
}
/** Transforms an array value via a remove operation. */ var __PRIVATE_ArrayRemoveTransformOperation = class extends TransformOperation {
	constructor(e) {
		super(), this.elements = e;
	}
};
function __PRIVATE_applyArrayRemoveTransformOperation(e, t) {
	let n = __PRIVATE_coercedFieldValuesArray(t);
	for (const t of e.elements) n = n.filter(((e) => !__PRIVATE_valueEquals(e, t)));
	return { arrayValue: { values: n } };
}
/**
* Implements the backend semantics for locally computed NUMERIC_ADD (increment)
* transforms. Converts all field values to integers or doubles, but unlike the
* backend does not cap integer values at 2^63. Instead, JavaScript number
* arithmetic is used and precision loss can occur for values greater than 2^53.
*/ var __PRIVATE_NumericIncrementTransformOperation = class extends TransformOperation {
	constructor(e, t) {
		super(), this.serializer = e, this.Ae = t;
	}
};
function asNumber(e) {
	return __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue);
}
function __PRIVATE_coercedFieldValuesArray(e) {
	return isArray(e) && e.arrayValue.values ? e.arrayValue.values.slice() : [];
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/** A field path and the TransformOperation to perform upon it. */ var FieldTransform = class {
	constructor(e, t) {
		this.field = e, this.transform = t;
	}
};
function __PRIVATE_fieldTransformEquals(e, t) {
	return e.field.isEqual(t.field) && function __PRIVATE_transformOperationEquals(e, t) {
		return e instanceof __PRIVATE_ArrayUnionTransformOperation && t instanceof __PRIVATE_ArrayUnionTransformOperation || e instanceof __PRIVATE_ArrayRemoveTransformOperation && t instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_arrayEquals(e.elements, t.elements, __PRIVATE_valueEquals) : e instanceof __PRIVATE_NumericIncrementTransformOperation && t instanceof __PRIVATE_NumericIncrementTransformOperation ? __PRIVATE_valueEquals(e.Ae, t.Ae) : e instanceof __PRIVATE_ServerTimestampTransform && t instanceof __PRIVATE_ServerTimestampTransform;
	}(e.transform, t.transform);
}
/** The result of successfully applying a mutation to the backend. */
var MutationResult = class {
	constructor(e, t) {
		this.version = e, this.transformResults = t;
	}
};
/**
* Encodes a precondition for a mutation. This follows the model that the
* backend accepts with the special case of an explicit "empty" precondition
* (meaning no precondition).
*/ var Precondition = class Precondition {
	constructor(e, t) {
		this.updateTime = e, this.exists = t;
	}
	/** Creates a new empty Precondition. */ static none() {
		return new Precondition();
	}
	/** Creates a new Precondition with an exists flag. */ static exists(e) {
		return new Precondition(void 0, e);
	}
	/** Creates a new Precondition based on a version a document exists at. */ static updateTime(e) {
		return new Precondition(e);
	}
	/** Returns whether this Precondition is empty. */ get isNone() {
		return void 0 === this.updateTime && void 0 === this.exists;
	}
	isEqual(e) {
		return this.exists === e.exists && (this.updateTime ? !!e.updateTime && this.updateTime.isEqual(e.updateTime) : !e.updateTime);
	}
};
/** Returns true if the preconditions is valid for the given document. */ function __PRIVATE_preconditionIsValidForDocument(e, t) {
	return void 0 !== e.updateTime ? t.isFoundDocument() && t.version.isEqual(e.updateTime) : void 0 === e.exists || e.exists === t.isFoundDocument();
}
/**
* A mutation describes a self-contained change to a document. Mutations can
* create, replace, delete, and update subsets of documents.
*
* Mutations not only act on the value of the document but also its version.
*
* For local mutations (mutations that haven't been committed yet), we preserve
* the existing version for Set and Patch mutations. For Delete mutations, we
* reset the version to 0.
*
* Here's the expected transition table.
*
* MUTATION           APPLIED TO            RESULTS IN
*
* SetMutation        Document(v3)          Document(v3)
* SetMutation        NoDocument(v3)        Document(v0)
* SetMutation        InvalidDocument(v0)   Document(v0)
* PatchMutation      Document(v3)          Document(v3)
* PatchMutation      NoDocument(v3)        NoDocument(v3)
* PatchMutation      InvalidDocument(v0)   UnknownDocument(v3)
* DeleteMutation     Document(v3)          NoDocument(v0)
* DeleteMutation     NoDocument(v3)        NoDocument(v0)
* DeleteMutation     InvalidDocument(v0)   NoDocument(v0)
*
* For acknowledged mutations, we use the updateTime of the WriteResponse as
* the resulting version for Set and Patch mutations. As deletes have no
* explicit update time, we use the commitTime of the WriteResponse for
* Delete mutations.
*
* If a mutation is acknowledged by the backend but fails the precondition check
* locally, we transition to an `UnknownDocument` and rely on Watch to send us
* the updated version.
*
* Field transforms are used only with Patch and Set Mutations. We use the
* `updateTransforms` message to store transforms, rather than the `transforms`s
* messages.
*
* ## Subclassing Notes
*
* Every type of mutation needs to implement its own applyToRemoteDocument() and
* applyToLocalView() to implement the actual behavior of applying the mutation
* to some source document (see `setMutationApplyToRemoteDocument()` for an
* example).
*/ var Mutation = class {};
/**
* A utility method to calculate a `Mutation` representing the overlay from the
* final state of the document, and a `FieldMask` representing the fields that
* are mutated by the local mutations.
*/ function __PRIVATE_calculateOverlayMutation(e, t) {
	if (!e.hasLocalMutations || t && 0 === t.fields.length) return null;
	if (null === t) return e.isNoDocument() ? new __PRIVATE_DeleteMutation(e.key, Precondition.none()) : new __PRIVATE_SetMutation(e.key, e.data, Precondition.none());
	{
		const n = e.data, r = ObjectValue.empty();
		let i = new SortedSet(FieldPath$1.comparator);
		for (let e of t.fields) if (!i.has(e)) {
			let t = n.field(e);
			null === t && e.length > 1 && (e = e.popLast(), t = n.field(e)), null === t ? r.delete(e) : r.set(e, t), i = i.add(e);
		}
		return new __PRIVATE_PatchMutation(e.key, r, new FieldMask(i.toArray()), Precondition.none());
	}
}
/**
* Applies this mutation to the given document for the purposes of computing a
* new remote document. If the input document doesn't match the expected state
* (e.g. it is invalid or outdated), the document type may transition to
* unknown.
*
* @param mutation - The mutation to apply.
* @param document - The document to mutate. The input document can be an
*     invalid document if the client has no knowledge of the pre-mutation state
*     of the document.
* @param mutationResult - The result of applying the mutation from the backend.
*/ function __PRIVATE_mutationApplyToRemoteDocument(e, t, n) {
	e instanceof __PRIVATE_SetMutation ? function __PRIVATE_setMutationApplyToRemoteDocument(e, t, n) {
		const r = e.value.clone(), i = __PRIVATE_serverTransformResults(e.fieldTransforms, t, n.transformResults);
		r.setAll(i), t.convertToFoundDocument(n.version, r).setHasCommittedMutations();
	}(e, t, n) : e instanceof __PRIVATE_PatchMutation ? function __PRIVATE_patchMutationApplyToRemoteDocument(e, t, n) {
		if (!__PRIVATE_preconditionIsValidForDocument(e.precondition, t)) return void t.convertToUnknownDocument(n.version);
		const r = __PRIVATE_serverTransformResults(e.fieldTransforms, t, n.transformResults), i = t.data;
		i.setAll(__PRIVATE_getPatch(e)), i.setAll(r), t.convertToFoundDocument(n.version, i).setHasCommittedMutations();
	}(e, t, n) : function __PRIVATE_deleteMutationApplyToRemoteDocument(e, t, n) {
		t.convertToNoDocument(n.version).setHasCommittedMutations();
	}(0, t, n);
}
/**
* Applies this mutation to the given document for the purposes of computing
* the new local view of a document. If the input document doesn't match the
* expected state, the document is not modified.
*
* @param mutation - The mutation to apply.
* @param document - The document to mutate. The input document can be an
*     invalid document if the client has no knowledge of the pre-mutation state
*     of the document.
* @param previousMask - The fields that have been updated before applying this mutation.
* @param localWriteTime - A timestamp indicating the local write time of the
*     batch this mutation is a part of.
* @returns A `FieldMask` representing the fields that are changed by applying this mutation.
*/ function __PRIVATE_mutationApplyToLocalView(e, t, n, r) {
	return e instanceof __PRIVATE_SetMutation ? function __PRIVATE_setMutationApplyToLocalView(e, t, n, r) {
		if (!__PRIVATE_preconditionIsValidForDocument(e.precondition, t)) return n;
		const i = e.value.clone(), s = __PRIVATE_localTransformResults(e.fieldTransforms, r, t);
		return i.setAll(s), t.convertToFoundDocument(t.version, i).setHasLocalMutations(), null;
	}(e, t, n, r) : e instanceof __PRIVATE_PatchMutation ? function __PRIVATE_patchMutationApplyToLocalView(e, t, n, r) {
		if (!__PRIVATE_preconditionIsValidForDocument(e.precondition, t)) return n;
		const i = __PRIVATE_localTransformResults(e.fieldTransforms, r, t), s = t.data;
		if (s.setAll(__PRIVATE_getPatch(e)), s.setAll(i), t.convertToFoundDocument(t.version, s).setHasLocalMutations(), null === n) return null;
		return n.unionWith(e.fieldMask.fields).unionWith(e.fieldTransforms.map(((e) => e.field)));
	}(e, t, n, r) : function __PRIVATE_deleteMutationApplyToLocalView(e, t, n) {
		if (__PRIVATE_preconditionIsValidForDocument(e.precondition, t)) return t.convertToNoDocument(t.version).setHasLocalMutations(), null;
		return n;
	}(e, t, n);
}
/**
* If this mutation is not idempotent, returns the base value to persist with
* this mutation. If a base value is returned, the mutation is always applied
* to this base value, even if document has already been updated.
*
* The base value is a sparse object that consists of only the document
* fields for which this mutation contains a non-idempotent transformation
* (e.g. a numeric increment). The provided value guarantees consistent
* behavior for non-idempotent transforms and allow us to return the same
* latency-compensated value even if the backend has already applied the
* mutation. The base value is null for idempotent mutations, as they can be
* re-played even if the backend has already applied them.
*
* @returns a base value to store along with the mutation, or null for
* idempotent mutations.
*/ function __PRIVATE_mutationExtractBaseValue(e, t) {
	let n = null;
	for (const r of e.fieldTransforms) {
		const e = t.data.field(r.field), i = __PRIVATE_computeTransformOperationBaseValue(r.transform, e || null);
		null != i && (null === n && (n = ObjectValue.empty()), n.set(r.field, i));
	}
	return n || null;
}
function __PRIVATE_mutationEquals(e, t) {
	return e.type === t.type && !!e.key.isEqual(t.key) && !!e.precondition.isEqual(t.precondition) && !!function __PRIVATE_fieldTransformsAreEqual(e, t) {
		return void 0 === e && void 0 === t || !(!e || !t) && __PRIVATE_arrayEquals(e, t, ((e, t) => __PRIVATE_fieldTransformEquals(e, t)));
	}(e.fieldTransforms, t.fieldTransforms) && (0 === e.type ? e.value.isEqual(t.value) : 1 !== e.type || e.data.isEqual(t.data) && e.fieldMask.isEqual(t.fieldMask));
}
/**
* A mutation that creates or replaces the document at the given key with the
* object value contents.
*/ var __PRIVATE_SetMutation = class extends Mutation {
	constructor(e, t, n, r = []) {
		super(), this.key = e, this.value = t, this.precondition = n, this.fieldTransforms = r, this.type = 0;
	}
	getFieldMask() {
		return null;
	}
};
var __PRIVATE_PatchMutation = class extends Mutation {
	constructor(e, t, n, r, i = []) {
		super(), this.key = e, this.data = t, this.fieldMask = n, this.precondition = r, this.fieldTransforms = i, this.type = 1;
	}
	getFieldMask() {
		return this.fieldMask;
	}
};
function __PRIVATE_getPatch(e) {
	const t = /* @__PURE__ */ new Map();
	return e.fieldMask.fields.forEach(((n) => {
		if (!n.isEmpty()) {
			const r = e.data.field(n);
			t.set(n, r);
		}
	})), t;
}
/**
* Creates a list of "transform results" (a transform result is a field value
* representing the result of applying a transform) for use after a mutation
* containing transforms has been acknowledged by the server.
*
* @param fieldTransforms - The field transforms to apply the result to.
* @param mutableDocument - The current state of the document after applying all
* previous mutations.
* @param serverTransformResults - The transform results received by the server.
* @returns The transform results list.
*/ function __PRIVATE_serverTransformResults(e, t, n) {
	const r = /* @__PURE__ */ new Map();
	__PRIVATE_hardAssert(e.length === n.length, 32656, {
		Ve: n.length,
		de: e.length
	});
	for (let i = 0; i < n.length; i++) {
		const s = e[i], o = s.transform, _ = t.data.field(s.field);
		r.set(s.field, __PRIVATE_applyTransformOperationToRemoteDocument(o, _, n[i]));
	}
	return r;
}
/**
* Creates a list of "transform results" (a transform result is a field value
* representing the result of applying a transform) for use when applying a
* transform locally.
*
* @param fieldTransforms - The field transforms to apply the result to.
* @param localWriteTime - The local time of the mutation (used to
*     generate ServerTimestampValues).
* @param mutableDocument - The document to apply transforms on.
* @returns The transform results list.
*/ function __PRIVATE_localTransformResults(e, t, n) {
	const r = /* @__PURE__ */ new Map();
	for (const i of e) {
		const e = i.transform, s = n.data.field(i.field);
		r.set(i.field, __PRIVATE_applyTransformOperationToLocalView(e, s, t));
	}
	return r;
}
/** A mutation that deletes the document at the given key. */ var __PRIVATE_DeleteMutation = class extends Mutation {
	constructor(e, t) {
		super(), this.key = e, this.precondition = t, this.type = 2, this.fieldTransforms = [];
	}
	getFieldMask() {
		return null;
	}
};
var __PRIVATE_VerifyMutation = class extends Mutation {
	constructor(e, t) {
		super(), this.key = e, this.precondition = t, this.type = 3, this.fieldTransforms = [];
	}
	getFieldMask() {
		return null;
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* A batch of mutations that will be sent as one unit to the backend.
*/ var MutationBatch = class {
	/**
	* @param batchId - The unique ID of this mutation batch.
	* @param localWriteTime - The original write time of this mutation.
	* @param baseMutations - Mutations that are used to populate the base
	* values when this mutation is applied locally. This can be used to locally
	* overwrite values that are persisted in the remote document cache. Base
	* mutations are never sent to the backend.
	* @param mutations - The user-provided mutations in this mutation batch.
	* User-provided mutations are applied both locally and remotely on the
	* backend.
	*/
	constructor(e, t, n, r) {
		this.batchId = e, this.localWriteTime = t, this.baseMutations = n, this.mutations = r;
	}
	/**
	* Applies all the mutations in this MutationBatch to the specified document
	* to compute the state of the remote document
	*
	* @param document - The document to apply mutations to.
	* @param batchResult - The result of applying the MutationBatch to the
	* backend.
	*/ applyToRemoteDocument(e, t) {
		const n = t.mutationResults;
		for (let t = 0; t < this.mutations.length; t++) {
			const r = this.mutations[t];
			if (r.key.isEqual(e.key)) __PRIVATE_mutationApplyToRemoteDocument(r, e, n[t]);
		}
	}
	/**
	* Computes the local view of a document given all the mutations in this
	* batch.
	*
	* @param document - The document to apply mutations to.
	* @param mutatedFields - Fields that have been updated before applying this mutation batch.
	* @returns A `FieldMask` representing all the fields that are mutated.
	*/ applyToLocalView(e, t) {
		for (const n of this.baseMutations) n.key.isEqual(e.key) && (t = __PRIVATE_mutationApplyToLocalView(n, e, t, this.localWriteTime));
		for (const n of this.mutations) n.key.isEqual(e.key) && (t = __PRIVATE_mutationApplyToLocalView(n, e, t, this.localWriteTime));
		return t;
	}
	/**
	* Computes the local view for all provided documents given the mutations in
	* this batch. Returns a `DocumentKey` to `Mutation` map which can be used to
	* replace all the mutation applications.
	*/ applyToLocalDocumentSet(e, t) {
		const n = __PRIVATE_newMutationMap();
		return this.mutations.forEach(((r) => {
			const i = e.get(r.key), s = i.overlayedDocument;
			let o = this.applyToLocalView(s, i.mutatedFields);
			o = t.has(r.key) ? null : o;
			const _ = __PRIVATE_calculateOverlayMutation(s, o);
			null !== _ && n.set(r.key, _), s.isValidDocument() || s.convertToNoDocument(SnapshotVersion.min());
		})), n;
	}
	keys() {
		return this.mutations.reduce(((e, t) => e.add(t.key)), __PRIVATE_documentKeySet());
	}
	isEqual(e) {
		return this.batchId === e.batchId && __PRIVATE_arrayEquals(this.mutations, e.mutations, ((e, t) => __PRIVATE_mutationEquals(e, t))) && __PRIVATE_arrayEquals(this.baseMutations, e.baseMutations, ((e, t) => __PRIVATE_mutationEquals(e, t)));
	}
};
/** The result of applying a mutation batch to the backend. */ var MutationBatchResult = class MutationBatchResult {
	constructor(e, t, n, r) {
		this.batch = e, this.commitVersion = t, this.mutationResults = n, this.docVersions = r;
	}
	/**
	* Creates a new MutationBatchResult for the given batch and results. There
	* must be one result for each mutation in the batch. This static factory
	* caches a document=&gt;version mapping (docVersions).
	*/ static from(e, t, n) {
		__PRIVATE_hardAssert(e.mutations.length === n.length, 58842, {
			me: e.mutations.length,
			fe: n.length
		});
		let r = function __PRIVATE_documentVersionMap() {
			return Tt;
		}();
		const i = e.mutations;
		for (let e = 0; e < i.length; e++) r = r.insert(i[e].key, n[e].version);
		return new MutationBatchResult(e, t, n, r);
	}
};
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Representation of an overlay computed by Firestore.
*
* Holds information about a mutation and the largest batch id in Firestore when
* the mutation was created.
*/ var Overlay = class {
	constructor(e, t) {
		this.largestBatchId = e, this.mutation = t;
	}
	getKey() {
		return this.mutation.key;
	}
	isEqual(e) {
		return null !== e && this.mutation === e.mutation;
	}
	toString() {
		return `Overlay{\n      largestBatchId: ${this.largestBatchId},\n      mutation: ${this.mutation.toString()}\n    }`;
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var ExistenceFilter = class {
	constructor(e, t) {
		this.count = e, this.unchangedNames = t;
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Error Codes describing the different ways GRPC can fail. These are copied
* directly from GRPC's sources here:
*
* https://github.com/grpc/grpc/blob/bceec94ea4fc5f0085d81235d8e1c06798dc341a/include/grpc%2B%2B/impl/codegen/status_code_enum.h
*
* Important! The names of these identifiers matter because the string forms
* are used for reverse lookups from the webchannel stream. Do NOT change the
* names of these identifiers or change this into a const enum.
*/ var Rt, At;
/**
* Determines whether an error code represents a permanent error when received
* in response to a non-write operation.
*
* See isPermanentWriteError for classifying write errors.
*/
function __PRIVATE_isPermanentError(e) {
	switch (e) {
		case D.OK: return fail(64938);
		case D.CANCELLED:
		case D.UNKNOWN:
		case D.DEADLINE_EXCEEDED:
		case D.RESOURCE_EXHAUSTED:
		case D.INTERNAL:
		case D.UNAVAILABLE:
		case D.UNAUTHENTICATED: return !1;
		case D.INVALID_ARGUMENT:
		case D.NOT_FOUND:
		case D.ALREADY_EXISTS:
		case D.PERMISSION_DENIED:
		case D.FAILED_PRECONDITION:
		case D.ABORTED:
		case D.OUT_OF_RANGE:
		case D.UNIMPLEMENTED:
		case D.DATA_LOSS: return !0;
		default: return fail(15467, { code: e });
	}
}
/**
* Determines whether an error code represents a permanent error when received
* in response to a write operation.
*
* Write operations must be handled specially because as of b/119437764, ABORTED
* errors on the write stream should be retried too (even though ABORTED errors
* are not generally retryable).
*
* Note that during the initial handshake on the write stream an ABORTED error
* signals that we should discard our stream token (i.e. it is permanent). This
* means a handshake error should be classified with isPermanentError, above.
*/
/**
* Maps an error Code from GRPC status code number, like 0, 1, or 14. These
* are not the same as HTTP status codes.
*
* @returns The Code equivalent to the given GRPC status code. Fails if there
*     is no match.
*/
function __PRIVATE_mapCodeFromRpcCode(e) {
	if (void 0 === e) return __PRIVATE_logError("GRPC error has no .code"), D.UNKNOWN;
	switch (e) {
		case Rt.OK: return D.OK;
		case Rt.CANCELLED: return D.CANCELLED;
		case Rt.UNKNOWN: return D.UNKNOWN;
		case Rt.DEADLINE_EXCEEDED: return D.DEADLINE_EXCEEDED;
		case Rt.RESOURCE_EXHAUSTED: return D.RESOURCE_EXHAUSTED;
		case Rt.INTERNAL: return D.INTERNAL;
		case Rt.UNAVAILABLE: return D.UNAVAILABLE;
		case Rt.UNAUTHENTICATED: return D.UNAUTHENTICATED;
		case Rt.INVALID_ARGUMENT: return D.INVALID_ARGUMENT;
		case Rt.NOT_FOUND: return D.NOT_FOUND;
		case Rt.ALREADY_EXISTS: return D.ALREADY_EXISTS;
		case Rt.PERMISSION_DENIED: return D.PERMISSION_DENIED;
		case Rt.FAILED_PRECONDITION: return D.FAILED_PRECONDITION;
		case Rt.ABORTED: return D.ABORTED;
		case Rt.OUT_OF_RANGE: return D.OUT_OF_RANGE;
		case Rt.UNIMPLEMENTED: return D.UNIMPLEMENTED;
		case Rt.DATA_LOSS: return D.DATA_LOSS;
		default: return fail(39323, { code: e });
	}
}
/**
* Converts an HTTP response's error status to the equivalent error code.
*
* @param status - An HTTP error response status ("FAILED_PRECONDITION",
* "UNKNOWN", etc.)
* @returns The equivalent Code. Non-matching responses are mapped to
*     Code.UNKNOWN.
*/ (At = Rt || (Rt = {}))[At.OK = 0] = "OK", At[At.CANCELLED = 1] = "CANCELLED", At[At.UNKNOWN = 2] = "UNKNOWN", At[At.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", At[At.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", At[At.NOT_FOUND = 5] = "NOT_FOUND", At[At.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", At[At.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", At[At.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", At[At.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", At[At.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", At[At.ABORTED = 10] = "ABORTED", At[At.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", At[At.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", At[At.INTERNAL = 13] = "INTERNAL", At[At.UNAVAILABLE = 14] = "UNAVAILABLE", At[At.DATA_LOSS = 15] = "DATA_LOSS";
/**
* @license
* Copyright 2023 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* The global, singleton instance of TestingHooksSpi.
*
* This variable will be `null` in all cases _except_ when running from
* integration tests that have registered callbacks to be notified of events
* that happen during the test execution.
*/
var Vt = null;
/**
* @license
* Copyright 2023 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* An instance of the Platform's 'TextEncoder' implementation.
*/ function __PRIVATE_newTextEncoder() {
	return new TextEncoder();
}
/**
* An instance of the Platform's 'TextDecoder' implementation.
*/
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var dt = new Integer([4294967295, 4294967295], 0);
function __PRIVATE_getMd5HashValue(e) {
	const t = __PRIVATE_newTextEncoder().encode(e), n = new Md5();
	return n.update(t), new Uint8Array(n.digest());
}
function __PRIVATE_get64BitUints(e) {
	const t = new DataView(e.buffer), n = t.getUint32(0, !0), r = t.getUint32(4, !0), i = t.getUint32(8, !0), s = t.getUint32(12, !0);
	return [new Integer([n, r], 0), new Integer([i, s], 0)];
}
var BloomFilter = class BloomFilter {
	constructor(e, t, n) {
		if (this.bitmap = e, this.padding = t, this.hashCount = n, t < 0 || t >= 8) throw new __PRIVATE_BloomFilterError(`Invalid padding: ${t}`);
		if (n < 0) throw new __PRIVATE_BloomFilterError(`Invalid hash count: ${n}`);
		if (e.length > 0 && 0 === this.hashCount) throw new __PRIVATE_BloomFilterError(`Invalid hash count: ${n}`);
		if (0 === e.length && 0 !== t) throw new __PRIVATE_BloomFilterError(`Invalid padding when bitmap length is 0: ${t}`);
		this.ge = 8 * e.length - t, this.pe = Integer.fromNumber(this.ge);
	}
	ye(e, t, n) {
		let r = e.add(t.multiply(Integer.fromNumber(n)));
		return 1 === r.compare(dt) && (r = new Integer([r.getBits(0), r.getBits(1)], 0)), r.modulo(this.pe).toNumber();
	}
	we(e) {
		return !!(this.bitmap[Math.floor(e / 8)] & 1 << e % 8);
	}
	mightContain(e) {
		if (0 === this.ge) return !1;
		const [n, r] = __PRIVATE_get64BitUints(__PRIVATE_getMd5HashValue(e));
		for (let e = 0; e < this.hashCount; e++) {
			const t = this.ye(n, r, e);
			if (!this.we(t)) return !1;
		}
		return !0;
	}
	/** Create bloom filter for testing purposes only. */ static create(e, t, n) {
		const r = e % 8 == 0 ? 0 : 8 - e % 8, s = new BloomFilter(new Uint8Array(Math.ceil(e / 8)), r, t);
		return n.forEach(((e) => s.insert(e))), s;
	}
	insert(e) {
		if (0 === this.ge) return;
		const [n, r] = __PRIVATE_get64BitUints(__PRIVATE_getMd5HashValue(e));
		for (let e = 0; e < this.hashCount; e++) {
			const t = this.ye(n, r, e);
			this.Se(t);
		}
	}
	Se(e) {
		const t = Math.floor(e / 8), n = e % 8;
		this.bitmap[t] |= 1 << n;
	}
};
var __PRIVATE_BloomFilterError = class extends Error {
	constructor() {
		super(...arguments), this.name = "BloomFilterError";
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* An event from the RemoteStore. It is split into targetChanges (changes to the
* state or the set of documents in our watched targets) and documentUpdates
* (changes to the actual documents).
*/ var RemoteEvent = class RemoteEvent {
	constructor(e, t, n, r, i) {
		this.snapshotVersion = e, this.targetChanges = t, this.targetMismatches = n, this.documentUpdates = r, this.resolvedLimboDocuments = i;
	}
	/**
	* HACK: Views require RemoteEvents in order to determine whether the view is
	* CURRENT, but secondary tabs don't receive remote events. So this method is
	* used to create a synthesized RemoteEvent that can be used to apply a
	* CURRENT status change to a View, for queries executed in a different tab.
	*/
	static createSynthesizedRemoteEventForCurrentChange(e, t, n) {
		const r = /* @__PURE__ */ new Map();
		return r.set(e, TargetChange.createSynthesizedTargetChangeForCurrentChange(e, t, n)), new RemoteEvent(SnapshotVersion.min(), r, new SortedMap(__PRIVATE_primitiveComparator), __PRIVATE_mutableDocumentMap(), __PRIVATE_documentKeySet());
	}
};
/**
* A TargetChange specifies the set of changes for a specific target as part of
* a RemoteEvent. These changes track which documents are added, modified or
* removed, as well as the target's resume token and whether the target is
* marked CURRENT.
* The actual changes *to* documents are not part of the TargetChange since
* documents may be part of multiple targets.
*/ var TargetChange = class TargetChange {
	constructor(e, t, n, r, i) {
		this.resumeToken = e, this.current = t, this.addedDocuments = n, this.modifiedDocuments = r, this.removedDocuments = i;
	}
	/**
	* This method is used to create a synthesized TargetChanges that can be used to
	* apply a CURRENT status change to a View (for queries executed in a different
	* tab) or for new queries (to raise snapshots with correct CURRENT status).
	*/ static createSynthesizedTargetChangeForCurrentChange(e, t, n) {
		return new TargetChange(n, t, __PRIVATE_documentKeySet(), __PRIVATE_documentKeySet(), __PRIVATE_documentKeySet());
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Represents a changed document and a list of target ids to which this change
* applies.
*
* If document has been deleted NoDocument will be provided.
*/ var __PRIVATE_DocumentWatchChange = class {
	constructor(e, t, n, r) {
		this.be = e, this.removedTargetIds = t, this.key = n, this.De = r;
	}
};
var __PRIVATE_ExistenceFilterChange = class {
	constructor(e, t) {
		this.targetId = e, this.Ce = t;
	}
};
var __PRIVATE_WatchTargetChange = class {
	constructor(e, t, n = ByteString.EMPTY_BYTE_STRING, r = null) {
		this.state = e, this.targetIds = t, this.resumeToken = n, this.cause = r;
	}
};
/** Tracks the internal state of a Watch target. */ var __PRIVATE_TargetState = class {
	constructor() {
		/**
		* The number of pending responses (adds or removes) that we are waiting on.
		* We only consider targets active that have no pending responses.
		*/
		this.ve = 0, this.Fe = __PRIVATE_snapshotChangesMap(), this.Me = ByteString.EMPTY_BYTE_STRING, this.xe = !1, this.Oe = !0;
	}
	/**
	* Whether this target has been marked 'current'.
	*
	* 'Current' has special meaning in the RPC protocol: It implies that the
	* Watch backend has sent us all changes up to the point at which the target
	* was added and that the target is consistent with the rest of the watch
	* stream.
	*/ get current() {
		return this.xe;
	}
	/** The last resume token sent to us for this target. */ get resumeToken() {
		return this.Me;
	}
	/** Whether this target has pending target adds or target removes. */ get Ne() {
		return 0 !== this.ve;
	}
	/** Whether we have modified any state that should trigger a snapshot. */ get Be() {
		return this.Oe;
	}
	/**
	* Applies the resume token to the TargetChange, but only when it has a new
	* value. Empty resumeTokens are discarded.
	*/ Le(e) {
		e.approximateByteSize() > 0 && (this.Oe = !0, this.Me = e);
	}
	/**
	* Creates a target change from the current set of changes.
	*
	* To reset the document changes after raising this snapshot, call
	* `clearPendingChanges()`.
	*/ ke() {
		let e = __PRIVATE_documentKeySet(), t = __PRIVATE_documentKeySet(), n = __PRIVATE_documentKeySet();
		return this.Fe.forEach(((r, i) => {
			switch (i) {
				case 0:
					e = e.add(r);
					break;
				case 2:
					t = t.add(r);
					break;
				case 1:
					n = n.add(r);
					break;
				default: fail(38017, { changeType: i });
			}
		})), new TargetChange(this.Me, this.xe, e, t, n);
	}
	/**
	* Resets the document changes and sets `hasPendingChanges` to false.
	*/ qe() {
		this.Oe = !1, this.Fe = __PRIVATE_snapshotChangesMap();
	}
	Ke(e, t) {
		this.Oe = !0, this.Fe = this.Fe.insert(e, t);
	}
	Ue(e) {
		this.Oe = !0, this.Fe = this.Fe.remove(e);
	}
	$e() {
		this.ve += 1;
	}
	We() {
		this.ve -= 1, __PRIVATE_hardAssert(this.ve >= 0, 3241, { ve: this.ve });
	}
	Qe() {
		this.Oe = !0, this.xe = !0;
	}
};
/**
* A helper class to accumulate watch changes into a RemoteEvent.
*/
var __PRIVATE_WatchChangeAggregator = class {
	constructor(e) {
		this.Ge = e, this.ze = /* @__PURE__ */ new Map(), this.je = __PRIVATE_mutableDocumentMap(), this.Je = __PRIVATE_documentTargetMap(), this.He = __PRIVATE_documentTargetMap(), this.Ze = new SortedMap(__PRIVATE_primitiveComparator);
	}
	/**
	* Processes and adds the DocumentWatchChange to the current set of changes.
	*/ Xe(e) {
		for (const t of e.be) e.De && e.De.isFoundDocument() ? this.Ye(t, e.De) : this.et(t, e.key, e.De);
		for (const t of e.removedTargetIds) this.et(t, e.key, e.De);
	}
	/** Processes and adds the WatchTargetChange to the current set of changes. */ tt(e) {
		this.forEachTarget(e, ((t) => {
			const n = this.nt(t);
			switch (e.state) {
				case 0:
					this.rt(t) && n.Le(e.resumeToken);
					break;
				case 1:
					n.We(), n.Ne || n.qe(), n.Le(e.resumeToken);
					break;
				case 2:
					n.We(), n.Ne || this.removeTarget(t);
					break;
				case 3:
					this.rt(t) && (n.Qe(), n.Le(e.resumeToken));
					break;
				case 4:
					this.rt(t) && (this.it(t), n.Le(e.resumeToken));
					break;
				default: fail(56790, { state: e.state });
			}
		}));
	}
	/**
	* Iterates over all targetIds that the watch change applies to: either the
	* targetIds explicitly listed in the change or the targetIds of all currently
	* active targets.
	*/ forEachTarget(e, t) {
		e.targetIds.length > 0 ? e.targetIds.forEach(t) : this.ze.forEach(((e, n) => {
			this.rt(n) && t(n);
		}));
	}
	/**
	* Handles existence filters and synthesizes deletes for filter mismatches.
	* Targets that are invalidated by filter mismatches are added to
	* `pendingTargetResets`.
	*/ st(e) {
		const t = e.targetId, n = e.Ce.count, r = this.ot(t);
		if (r) {
			const i = r.target;
			if (__PRIVATE_targetIsDocumentTarget(i)) if (0 === n) {
				const e = new DocumentKey(i.path);
				this.et(t, e, MutableDocument.newNoDocument(e, SnapshotVersion.min()));
			} else __PRIVATE_hardAssert(1 === n, 20013, { expectedCount: n });
			else {
				const r = this._t(t);
				if (r !== n) {
					const n = this.ut(e), i = n ? this.ct(n, e, r) : 1;
					if (0 !== i) {
						this.it(t);
						const e = 2 === i ? "TargetPurposeExistenceFilterMismatchBloom" : "TargetPurposeExistenceFilterMismatch";
						this.Ze = this.Ze.insert(t, e);
					}
					Vt?.o(function __PRIVATE_createExistenceFilterMismatchInfoForTestingHooks(e, t, n, r, i) {
						const s = {
							localCacheCount: e,
							existenceFilterCount: t.count,
							databaseId: n.database,
							projectId: n.projectId
						}, o = t.unchangedNames;
						o && (s.bloomFilter = {
							applied: 0 === i,
							hashCount: o?.hashCount ?? 0,
							bitmapLength: o?.bits?.bitmap?.length ?? 0,
							padding: o?.bits?.padding ?? 0,
							mightContain: (e) => r?.mightContain(e) ?? !1
						});
						return s;
					}(r, e.Ce, this.Ge.ht(), n, i));
				}
			}
		}
	}
	/**
	* Parse the bloom filter from the "unchanged_names" field of an existence
	* filter.
	*/ ut(e) {
		const t = e.Ce.unchangedNames;
		if (!t || !t.bits) return null;
		const { bits: { bitmap: n = "", padding: r = 0 }, hashCount: i = 0 } = t;
		let s, o;
		try {
			s = __PRIVATE_normalizeByteString(n).toUint8Array();
		} catch (e) {
			if (e instanceof __PRIVATE_Base64DecodeError) return __PRIVATE_logWarn("Decoding the base64 bloom filter in existence filter failed (" + e.message + "); ignoring the bloom filter and falling back to full re-query."), null;
			throw e;
		}
		try {
			o = new BloomFilter(s, r, i);
		} catch (e) {
			return __PRIVATE_logWarn(e instanceof __PRIVATE_BloomFilterError ? "BloomFilter error: " : "Applying bloom filter failed: ", e), null;
		}
		return 0 === o.ge ? null : o;
	}
	/**
	* Apply bloom filter to remove the deleted documents, and return the
	* application status.
	*/ ct(e, t, n) {
		return t.Ce.count === n - this.Pt(e, t.targetId) ? 0 : 2;
	}
	/**
	* Filter out removed documents based on bloom filter membership result and
	* return number of documents removed.
	*/ Pt(e, t) {
		const n = this.Ge.getRemoteKeysForTarget(t);
		let r = 0;
		return n.forEach(((n) => {
			const i = this.Ge.ht(), s = `projects/${i.projectId}/databases/${i.database}/documents/${n.path.canonicalString()}`;
			e.mightContain(s) || (this.et(t, n, null), r++);
		})), r;
	}
	/**
	* Converts the currently accumulated state into a remote event at the
	* provided snapshot version. Resets the accumulated changes before returning.
	*/ Tt(e) {
		const t = /* @__PURE__ */ new Map();
		this.ze.forEach(((n, r) => {
			const i = this.ot(r);
			if (i) {
				if (n.current && __PRIVATE_targetIsDocumentTarget(i.target)) {
					const t = new DocumentKey(i.target.path);
					this.Et(t).has(r) || this.It(r, t) || this.et(r, t, MutableDocument.newNoDocument(t, e));
				}
				n.Be && (t.set(r, n.ke()), n.qe());
			}
		}));
		let n = __PRIVATE_documentKeySet();
		this.He.forEach(((e, t) => {
			let r = !0;
			t.forEachWhile(((e) => {
				const t = this.ot(e);
				return !t || "TargetPurposeLimboResolution" === t.purpose || (r = !1, !1);
			})), r && (n = n.add(e));
		})), this.je.forEach(((t, n) => n.setReadTime(e)));
		const r = new RemoteEvent(e, t, this.Ze, this.je, n);
		return this.je = __PRIVATE_mutableDocumentMap(), this.Je = __PRIVATE_documentTargetMap(), this.He = __PRIVATE_documentTargetMap(), this.Ze = new SortedMap(__PRIVATE_primitiveComparator), r;
	}
	/**
	* Adds the provided document to the internal list of document updates and
	* its document key to the given target's mapping.
	*/
	Ye(e, t) {
		if (!this.rt(e)) return;
		const n = this.It(e, t.key) ? 2 : 0;
		this.nt(e).Ke(t.key, n), this.je = this.je.insert(t.key, t), this.Je = this.Je.insert(t.key, this.Et(t.key).add(e)), this.He = this.He.insert(t.key, this.Rt(t.key).add(e));
	}
	/**
	* Removes the provided document from the target mapping. If the
	* document no longer matches the target, but the document's state is still
	* known (e.g. we know that the document was deleted or we received the change
	* that caused the filter mismatch), the new document can be provided
	* to update the remote document cache.
	*/
	et(e, t, n) {
		if (!this.rt(e)) return;
		const r = this.nt(e);
		this.It(e, t) ? r.Ke(t, 1) : r.Ue(t), this.He = this.He.insert(t, this.Rt(t).delete(e)), this.He = this.He.insert(t, this.Rt(t).add(e)), n && (this.je = this.je.insert(t, n));
	}
	removeTarget(e) {
		this.ze.delete(e);
	}
	/**
	* Returns the current count of documents in the target. This includes both
	* the number of documents that the LocalStore considers to be part of the
	* target as well as any accumulated changes.
	*/ _t(e) {
		const t = this.nt(e).ke();
		return this.Ge.getRemoteKeysForTarget(e).size + t.addedDocuments.size - t.removedDocuments.size;
	}
	/**
	* Increment the number of acks needed from watch before we can consider the
	* server to be 'in-sync' with the client's active targets.
	*/ $e(e) {
		this.nt(e).$e();
	}
	nt(e) {
		let t = this.ze.get(e);
		return t || (t = new __PRIVATE_TargetState(), this.ze.set(e, t)), t;
	}
	Rt(e) {
		let t = this.He.get(e);
		return t || (t = new SortedSet(__PRIVATE_primitiveComparator), this.He = this.He.insert(e, t)), t;
	}
	Et(e) {
		let t = this.Je.get(e);
		return t || (t = new SortedSet(__PRIVATE_primitiveComparator), this.Je = this.Je.insert(e, t)), t;
	}
	/**
	* Verifies that the user is still interested in this target (by calling
	* `getTargetDataForTarget()`) and that we are not waiting for pending ADDs
	* from watch.
	*/ rt(e) {
		const t = null !== this.ot(e);
		return t || __PRIVATE_logDebug("WatchChangeAggregator", "Detected inactive target", e), t;
	}
	/**
	* Returns the TargetData for an active target (i.e. a target that the user
	* is still interested in that has no outstanding target change requests).
	*/ ot(e) {
		const t = this.ze.get(e);
		return t && t.Ne ? null : this.Ge.At(e);
	}
	/**
	* Resets the state of a Watch target to its initial state (e.g. sets
	* 'current' to false, clears the resume token and removes its target mapping
	* from all documents).
	*/ it(e) {
		this.ze.set(e, new __PRIVATE_TargetState());
		this.Ge.getRemoteKeysForTarget(e).forEach(((t) => {
			this.et(e, t, null);
		}));
	}
	/**
	* Returns whether the LocalStore considers the document to be part of the
	* specified target.
	*/ It(e, t) {
		return this.Ge.getRemoteKeysForTarget(e).has(t);
	}
};
function __PRIVATE_documentTargetMap() {
	return new SortedMap(DocumentKey.comparator);
}
function __PRIVATE_snapshotChangesMap() {
	return new SortedMap(DocumentKey.comparator);
}
var mt = {
	asc: "ASCENDING",
	desc: "DESCENDING"
}, ft = {
	"<": "LESS_THAN",
	"<=": "LESS_THAN_OR_EQUAL",
	">": "GREATER_THAN",
	">=": "GREATER_THAN_OR_EQUAL",
	"==": "EQUAL",
	"!=": "NOT_EQUAL",
	"array-contains": "ARRAY_CONTAINS",
	in: "IN",
	"not-in": "NOT_IN",
	"array-contains-any": "ARRAY_CONTAINS_ANY"
}, gt = {
	and: "AND",
	or: "OR"
};
/**
* This class generates JsonObject values for the Datastore API suitable for
* sending to either GRPC stub methods or via the JSON/HTTP REST API.
*
* The serializer supports both Protobuf.js and Proto3 JSON formats. By
* setting `useProto3Json` to true, the serializer will use the Proto3 JSON
* format.
*
* For a description of the Proto3 JSON format check
* https://developers.google.com/protocol-buffers/docs/proto3#json
*
* TODO(klimt): We can remove the databaseId argument if we keep the full
* resource name in documents.
*/
var JsonProtoSerializer = class {
	constructor(e, t) {
		this.databaseId = e, this.useProto3Json = t;
	}
};
/**
* Returns a value for a number (or null) that's appropriate to put into
* a google.protobuf.Int32Value proto.
* DO NOT USE THIS FOR ANYTHING ELSE.
* This method cheats. It's typed as returning "number" because that's what
* our generated proto interfaces say Int32Value must be. But GRPC actually
* expects a { value: <number> } struct.
*/
function __PRIVATE_toInt32Proto(e, t) {
	return e.useProto3Json || __PRIVATE_isNullOrUndefined(t) ? t : { value: t };
}
/**
* Returns a number (or null) from a google.protobuf.Int32Value proto.
*/
/**
* Returns a value for a Date that's appropriate to put into a proto.
*/
function toTimestamp(e, t) {
	if (e.useProto3Json) return `${(/* @__PURE__ */ new Date(1e3 * t.seconds)).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + t.nanoseconds).slice(-9)}Z`;
	return {
		seconds: "" + t.seconds,
		nanos: t.nanoseconds
	};
}
/**
* Returns a Timestamp typed object given protobuf timestamp value.
*/
/**
* Returns a value for bytes that's appropriate to put in a proto.
*
* Visible for testing.
*/
function __PRIVATE_toBytes(e, t) {
	return e.useProto3Json ? t.toBase64() : t.toUint8Array();
}
/**
* Returns a ByteString based on the proto string value.
*/ function __PRIVATE_toVersion(e, t) {
	return toTimestamp(e, t.toTimestamp());
}
function __PRIVATE_fromVersion(e) {
	return __PRIVATE_hardAssert(!!e, 49232), SnapshotVersion.fromTimestamp(function fromTimestamp(e) {
		const t = __PRIVATE_normalizeTimestamp(e);
		return new Timestamp(t.seconds, t.nanos);
	}(e));
}
function __PRIVATE_toResourceName(e, t) {
	return __PRIVATE_toResourcePath(e, t).canonicalString();
}
function __PRIVATE_toResourcePath(e, t) {
	const n = function __PRIVATE_fullyQualifiedPrefixPath(e) {
		return new ResourcePath([
			"projects",
			e.projectId,
			"databases",
			e.database
		]);
	}(e).child("documents");
	return void 0 === t ? n : n.child(t);
}
function __PRIVATE_fromResourceName(e) {
	const t = ResourcePath.fromString(e);
	return __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(t), 10190, { key: t.toString() }), t;
}
function __PRIVATE_toName(e, t) {
	return __PRIVATE_toResourceName(e.databaseId, t.path);
}
function fromName(e, t) {
	const n = __PRIVATE_fromResourceName(t);
	if (n.get(1) !== e.databaseId.projectId) throw new FirestoreError(D.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + n.get(1) + " vs " + e.databaseId.projectId);
	if (n.get(3) !== e.databaseId.database) throw new FirestoreError(D.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + n.get(3) + " vs " + e.databaseId.database);
	return new DocumentKey(__PRIVATE_extractLocalPathFromResourceName(n));
}
function __PRIVATE_toQueryPath(e, t) {
	return __PRIVATE_toResourceName(e.databaseId, t);
}
function __PRIVATE_fromQueryPath(e) {
	const t = __PRIVATE_fromResourceName(e);
	return 4 === t.length ? ResourcePath.emptyPath() : __PRIVATE_extractLocalPathFromResourceName(t);
}
function __PRIVATE_getEncodedDatabaseId(e) {
	return new ResourcePath([
		"projects",
		e.databaseId.projectId,
		"databases",
		e.databaseId.database
	]).canonicalString();
}
function __PRIVATE_extractLocalPathFromResourceName(e) {
	return __PRIVATE_hardAssert(e.length > 4 && "documents" === e.get(4), 29091, { key: e.toString() }), e.popFirst(5);
}
/** Creates a Document proto from key and fields (but no create/update time) */ function __PRIVATE_toMutationDocument(e, t, n) {
	return {
		name: __PRIVATE_toName(e, t),
		fields: n.value.mapValue.fields
	};
}
function __PRIVATE_fromWatchChange(e, t) {
	let n;
	if ("targetChange" in t) {
		t.targetChange;
		const r = function __PRIVATE_fromWatchTargetChangeState(e) {
			return "NO_CHANGE" === e ? 0 : "ADD" === e ? 1 : "REMOVE" === e ? 2 : "CURRENT" === e ? 3 : "RESET" === e ? 4 : fail(39313, { state: e });
		}(t.targetChange.targetChangeType || "NO_CHANGE"), i = t.targetChange.targetIds || [], s = function __PRIVATE_fromBytes(e, t) {
			return e.useProto3Json ? (__PRIVATE_hardAssert(void 0 === t || "string" == typeof t, 58123), ByteString.fromBase64String(t || "")) : (__PRIVATE_hardAssert(void 0 === t || t instanceof Buffer || t instanceof Uint8Array, 16193), ByteString.fromUint8Array(t || new Uint8Array()));
		}(e, t.targetChange.resumeToken), o = t.targetChange.cause;
		n = new __PRIVATE_WatchTargetChange(r, i, s, o && function __PRIVATE_fromRpcStatus(e) {
			return new FirestoreError(void 0 === e.code ? D.UNKNOWN : __PRIVATE_mapCodeFromRpcCode(e.code), e.message || "");
		}(o) || null);
	} else if ("documentChange" in t) {
		t.documentChange;
		const r = t.documentChange;
		r.document, r.document.name, r.document.updateTime;
		const i = fromName(e, r.document.name), s = __PRIVATE_fromVersion(r.document.updateTime), o = r.document.createTime ? __PRIVATE_fromVersion(r.document.createTime) : SnapshotVersion.min(), _ = new ObjectValue({ mapValue: { fields: r.document.fields } }), a = MutableDocument.newFoundDocument(i, s, o, _);
		n = new __PRIVATE_DocumentWatchChange(r.targetIds || [], r.removedTargetIds || [], a.key, a);
	} else if ("documentDelete" in t) {
		t.documentDelete;
		const r = t.documentDelete;
		r.document;
		const i = fromName(e, r.document), s = r.readTime ? __PRIVATE_fromVersion(r.readTime) : SnapshotVersion.min(), o = MutableDocument.newNoDocument(i, s);
		n = new __PRIVATE_DocumentWatchChange([], r.removedTargetIds || [], o.key, o);
	} else if ("documentRemove" in t) {
		t.documentRemove;
		const r = t.documentRemove;
		r.document;
		const i = fromName(e, r.document);
		n = new __PRIVATE_DocumentWatchChange([], r.removedTargetIds || [], i, null);
	} else {
		if (!("filter" in t)) return fail(11601, { Vt: t });
		{
			t.filter;
			const e = t.filter;
			e.targetId;
			const { count: r = 0, unchangedNames: i } = e, s = new ExistenceFilter(r, i), o = e.targetId;
			n = new __PRIVATE_ExistenceFilterChange(o, s);
		}
	}
	return n;
}
function toMutation(e, t) {
	let n;
	if (t instanceof __PRIVATE_SetMutation) n = { update: __PRIVATE_toMutationDocument(e, t.key, t.value) };
	else if (t instanceof __PRIVATE_DeleteMutation) n = { delete: __PRIVATE_toName(e, t.key) };
	else if (t instanceof __PRIVATE_PatchMutation) n = {
		update: __PRIVATE_toMutationDocument(e, t.key, t.data),
		updateMask: __PRIVATE_toDocumentMask(t.fieldMask)
	};
	else {
		if (!(t instanceof __PRIVATE_VerifyMutation)) return fail(16599, { dt: t.type });
		n = { verify: __PRIVATE_toName(e, t.key) };
	}
	return t.fieldTransforms.length > 0 && (n.updateTransforms = t.fieldTransforms.map(((e) => function __PRIVATE_toFieldTransform(e, t) {
		const n = t.transform;
		if (n instanceof __PRIVATE_ServerTimestampTransform) return {
			fieldPath: t.field.canonicalString(),
			setToServerValue: "REQUEST_TIME"
		};
		if (n instanceof __PRIVATE_ArrayUnionTransformOperation) return {
			fieldPath: t.field.canonicalString(),
			appendMissingElements: { values: n.elements }
		};
		if (n instanceof __PRIVATE_ArrayRemoveTransformOperation) return {
			fieldPath: t.field.canonicalString(),
			removeAllFromArray: { values: n.elements }
		};
		if (n instanceof __PRIVATE_NumericIncrementTransformOperation) return {
			fieldPath: t.field.canonicalString(),
			increment: n.Ae
		};
		throw fail(20930, { transform: t.transform });
	}(0, e)))), t.precondition.isNone || (n.currentDocument = function __PRIVATE_toPrecondition(e, t) {
		return void 0 !== t.updateTime ? { updateTime: __PRIVATE_toVersion(e, t.updateTime) } : void 0 !== t.exists ? { exists: t.exists } : fail(27497);
	}(e, t.precondition)), n;
}
function __PRIVATE_fromWriteResults(e, t) {
	return e && e.length > 0 ? (__PRIVATE_hardAssert(void 0 !== t, 14353), e.map(((e) => function __PRIVATE_fromWriteResult(e, t) {
		let n = e.updateTime ? __PRIVATE_fromVersion(e.updateTime) : __PRIVATE_fromVersion(t);
		return n.isEqual(SnapshotVersion.min()) && (n = __PRIVATE_fromVersion(t)), new MutationResult(n, e.transformResults || []);
	}(e, t)))) : [];
}
function __PRIVATE_toDocumentsTarget(e, t) {
	return { documents: [__PRIVATE_toQueryPath(e, t.path)] };
}
function __PRIVATE_toQueryTarget(e, t) {
	const n = { structuredQuery: {} }, r = t.path;
	let i;
	null !== t.collectionGroup ? (i = r, n.structuredQuery.from = [{
		collectionId: t.collectionGroup,
		allDescendants: !0
	}]) : (i = r.popLast(), n.structuredQuery.from = [{ collectionId: r.lastSegment() }]), n.parent = __PRIVATE_toQueryPath(e, i);
	const s = function __PRIVATE_toFilters(e) {
		if (0 === e.length) return;
		return __PRIVATE_toFilter(CompositeFilter.create(e, "and"));
	}(t.filters);
	s && (n.structuredQuery.where = s);
	const o = function __PRIVATE_toOrder(e) {
		if (0 === e.length) return;
		return e.map(((e) => function __PRIVATE_toPropertyOrder(e) {
			return {
				field: __PRIVATE_toFieldPathReference(e.field),
				direction: __PRIVATE_toDirection(e.dir)
			};
		}(e)));
	}(t.orderBy);
	o && (n.structuredQuery.orderBy = o);
	const _ = __PRIVATE_toInt32Proto(e, t.limit);
	return null !== _ && (n.structuredQuery.limit = _), t.startAt && (n.structuredQuery.startAt = function __PRIVATE_toStartAtCursor(e) {
		return {
			before: e.inclusive,
			values: e.position
		};
	}(t.startAt)), t.endAt && (n.structuredQuery.endAt = function __PRIVATE_toEndAtCursor(e) {
		return {
			before: !e.inclusive,
			values: e.position
		};
	}(t.endAt)), {
		ft: n,
		parent: i
	};
}
function __PRIVATE_convertQueryTargetToQuery(e) {
	let t = __PRIVATE_fromQueryPath(e.parent);
	const n = e.structuredQuery, r = n.from ? n.from.length : 0;
	let i = null;
	if (r > 0) {
		__PRIVATE_hardAssert(1 === r, 65062);
		const e = n.from[0];
		e.allDescendants ? i = e.collectionId : t = t.child(e.collectionId);
	}
	let s = [];
	n.where && (s = function __PRIVATE_fromFilters(e) {
		const t = __PRIVATE_fromFilter(e);
		if (t instanceof CompositeFilter && __PRIVATE_compositeFilterIsFlatConjunction(t)) return t.getFilters();
		return [t];
	}(n.where));
	let o = [];
	n.orderBy && (o = function __PRIVATE_fromOrder(e) {
		return e.map(((e) => function __PRIVATE_fromPropertyOrder(e) {
			return new OrderBy(__PRIVATE_fromFieldPathReference(e.field), function __PRIVATE_fromDirection(e) {
				switch (e) {
					case "ASCENDING": return "asc";
					case "DESCENDING": return "desc";
					default: return;
				}
			}(e.direction));
		}(e)));
	}(n.orderBy));
	let _ = null;
	n.limit && (_ = function __PRIVATE_fromInt32Proto(e) {
		let t;
		return t = "object" == typeof e ? e.value : e, __PRIVATE_isNullOrUndefined(t) ? null : t;
	}(n.limit));
	let a = null;
	n.startAt && (a = function __PRIVATE_fromStartAtCursor(e) {
		const t = !!e.before;
		return new Bound(e.values || [], t);
	}(n.startAt));
	let u = null;
	return n.endAt && (u = function __PRIVATE_fromEndAtCursor(e) {
		const t = !e.before;
		return new Bound(e.values || [], t);
	}(n.endAt)), __PRIVATE_newQuery(t, i, o, s, _, "F", a, u);
}
function __PRIVATE_toListenRequestLabels(e, t) {
	const n = function __PRIVATE_toLabel(e) {
		switch (e) {
			case "TargetPurposeListen": return null;
			case "TargetPurposeExistenceFilterMismatch": return "existence-filter-mismatch";
			case "TargetPurposeExistenceFilterMismatchBloom": return "existence-filter-mismatch-bloom";
			case "TargetPurposeLimboResolution": return "limbo-document";
			default: return fail(28987, { purpose: e });
		}
	}(t.purpose);
	return null == n ? null : { "goog-listen-tags": n };
}
function __PRIVATE_fromFilter(e) {
	return void 0 !== e.unaryFilter ? function __PRIVATE_fromUnaryFilter(e) {
		switch (e.unaryFilter.op) {
			case "IS_NAN":
				const t = __PRIVATE_fromFieldPathReference(e.unaryFilter.field);
				return FieldFilter.create(t, "==", { doubleValue: NaN });
			case "IS_NULL":
				const n = __PRIVATE_fromFieldPathReference(e.unaryFilter.field);
				return FieldFilter.create(n, "==", { nullValue: "NULL_VALUE" });
			case "IS_NOT_NAN":
				const r = __PRIVATE_fromFieldPathReference(e.unaryFilter.field);
				return FieldFilter.create(r, "!=", { doubleValue: NaN });
			case "IS_NOT_NULL":
				const i = __PRIVATE_fromFieldPathReference(e.unaryFilter.field);
				return FieldFilter.create(i, "!=", { nullValue: "NULL_VALUE" });
			case "OPERATOR_UNSPECIFIED": return fail(61313);
			default: return fail(60726);
		}
	}(e) : void 0 !== e.fieldFilter ? function __PRIVATE_fromFieldFilter(e) {
		return FieldFilter.create(__PRIVATE_fromFieldPathReference(e.fieldFilter.field), function __PRIVATE_fromOperatorName(e) {
			switch (e) {
				case "EQUAL": return "==";
				case "NOT_EQUAL": return "!=";
				case "GREATER_THAN": return ">";
				case "GREATER_THAN_OR_EQUAL": return ">=";
				case "LESS_THAN": return "<";
				case "LESS_THAN_OR_EQUAL": return "<=";
				case "ARRAY_CONTAINS": return "array-contains";
				case "IN": return "in";
				case "NOT_IN": return "not-in";
				case "ARRAY_CONTAINS_ANY": return "array-contains-any";
				case "OPERATOR_UNSPECIFIED": return fail(58110);
				default: return fail(50506);
			}
		}(e.fieldFilter.op), e.fieldFilter.value);
	}(e) : void 0 !== e.compositeFilter ? function __PRIVATE_fromCompositeFilter(e) {
		return CompositeFilter.create(e.compositeFilter.filters.map(((e) => __PRIVATE_fromFilter(e))), function __PRIVATE_fromCompositeOperatorName(e) {
			switch (e) {
				case "AND": return "and";
				case "OR": return "or";
				default: return fail(1026);
			}
		}(e.compositeFilter.op));
	}(e) : fail(30097, { filter: e });
}
function __PRIVATE_toDirection(e) {
	return mt[e];
}
function __PRIVATE_toOperatorName(e) {
	return ft[e];
}
function __PRIVATE_toCompositeOperatorName(e) {
	return gt[e];
}
function __PRIVATE_toFieldPathReference(e) {
	return { fieldPath: e.canonicalString() };
}
function __PRIVATE_fromFieldPathReference(e) {
	return FieldPath$1.fromServerFormat(e.fieldPath);
}
function __PRIVATE_toFilter(e) {
	return e instanceof FieldFilter ? function __PRIVATE_toUnaryOrFieldFilter(e) {
		if ("==" === e.op) {
			if (__PRIVATE_isNanValue(e.value)) return { unaryFilter: {
				field: __PRIVATE_toFieldPathReference(e.field),
				op: "IS_NAN"
			} };
			if (__PRIVATE_isNullValue(e.value)) return { unaryFilter: {
				field: __PRIVATE_toFieldPathReference(e.field),
				op: "IS_NULL"
			} };
		} else if ("!=" === e.op) {
			if (__PRIVATE_isNanValue(e.value)) return { unaryFilter: {
				field: __PRIVATE_toFieldPathReference(e.field),
				op: "IS_NOT_NAN"
			} };
			if (__PRIVATE_isNullValue(e.value)) return { unaryFilter: {
				field: __PRIVATE_toFieldPathReference(e.field),
				op: "IS_NOT_NULL"
			} };
		}
		return { fieldFilter: {
			field: __PRIVATE_toFieldPathReference(e.field),
			op: __PRIVATE_toOperatorName(e.op),
			value: e.value
		} };
	}(e) : e instanceof CompositeFilter ? function __PRIVATE_toCompositeFilter(e) {
		const t = e.getFilters().map(((e) => __PRIVATE_toFilter(e)));
		if (1 === t.length) return t[0];
		return { compositeFilter: {
			op: __PRIVATE_toCompositeOperatorName(e.op),
			filters: t
		} };
	}(e) : fail(54877, { filter: e });
}
function __PRIVATE_toDocumentMask(e) {
	const t = [];
	return e.fields.forEach(((e) => t.push(e.canonicalString()))), { fieldPaths: t };
}
function __PRIVATE_isValidResourceName(e) {
	return e.length >= 4 && "projects" === e.get(0) && "databases" === e.get(2);
}
function __PRIVATE_isProtoValueSerializable(e) {
	return !!e && "function" == typeof e._toProto && "ProtoValue" === e._protoValueType;
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* An immutable set of metadata that the local store tracks for each target.
*/ var TargetData = class TargetData {
	constructor(e, t, n, r, i = SnapshotVersion.min(), s = SnapshotVersion.min(), o = ByteString.EMPTY_BYTE_STRING, _ = null) {
		this.target = e, this.targetId = t, this.purpose = n, this.sequenceNumber = r, this.snapshotVersion = i, this.lastLimboFreeSnapshotVersion = s, this.resumeToken = o, this.expectedCount = _;
	}
	/** Creates a new target data instance with an updated sequence number. */ withSequenceNumber(e) {
		return new TargetData(this.target, this.targetId, this.purpose, e, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, this.expectedCount);
	}
	/**
	* Creates a new target data instance with an updated resume token and
	* snapshot version.
	*/ withResumeToken(e, t) {
		return new TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, t, this.lastLimboFreeSnapshotVersion, e, null);
	}
	/**
	* Creates a new target data instance with an updated expected count.
	*/ withExpectedCount(e) {
		return new TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, e);
	}
	/**
	* Creates a new target data instance with an updated last limbo free
	* snapshot version number.
	*/ withLastLimboFreeSnapshotVersion(e) {
		return new TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, e, this.resumeToken, this.expectedCount);
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/** Serializer for values stored in the LocalStore. */ var __PRIVATE_LocalSerializer = class {
	constructor(e) {
		this.yt = e;
	}
};
/**
* Encodes a `BundledQuery` from bundle proto to a Query object.
*
* This reconstructs the original query used to build the bundle being loaded,
* including features exists only in SDKs (for example: limit-to-last).
*/
function __PRIVATE_fromBundledQuery(e) {
	const t = __PRIVATE_convertQueryTargetToQuery({
		parent: e.parent,
		structuredQuery: e.structuredQuery
	});
	return "LAST" === e.limitType ? __PRIVATE_queryWithLimit(t, t.limit, "L") : t;
}
/**
* @license
* Copyright 2021 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/** Firestore index value writer.  */
var __PRIVATE_FirestoreIndexValueWriter = class {
	constructor() {}
	/** Writes an index value.  */
	Dt(e, t) {
		this.Ct(e, t), t.vt();
	}
	Ct(e, t) {
		if ("nullValue" in e) this.Ft(t, 5);
		else if ("booleanValue" in e) this.Ft(t, 10), t.Mt(e.booleanValue ? 1 : 0);
		else if ("integerValue" in e) this.Ft(t, 15), t.Mt(__PRIVATE_normalizeNumber(e.integerValue));
		else if ("doubleValue" in e) {
			const n = __PRIVATE_normalizeNumber(e.doubleValue);
			isNaN(n) ? this.Ft(t, 13) : (this.Ft(t, 15), __PRIVATE_isNegativeZero(n) ? t.Mt(0) : t.Mt(n));
		} else if ("timestampValue" in e) {
			let n = e.timestampValue;
			this.Ft(t, 20), "string" == typeof n && (n = __PRIVATE_normalizeTimestamp(n)), t.xt(`${n.seconds || ""}`), t.Mt(n.nanos || 0);
		} else if ("stringValue" in e) this.Ot(e.stringValue, t), this.Nt(t);
		else if ("bytesValue" in e) this.Ft(t, 30), t.Bt(__PRIVATE_normalizeByteString(e.bytesValue)), this.Nt(t);
		else if ("referenceValue" in e) this.Lt(e.referenceValue, t);
		else if ("geoPointValue" in e) {
			const n = e.geoPointValue;
			this.Ft(t, 45), t.Mt(n.latitude || 0), t.Mt(n.longitude || 0);
		} else "mapValue" in e ? __PRIVATE_isMaxValue(e) ? this.Ft(t, Number.MAX_SAFE_INTEGER) : __PRIVATE_isVectorValue(e) ? this.kt(e.mapValue, t) : (this.qt(e.mapValue, t), this.Nt(t)) : "arrayValue" in e ? (this.Kt(e.arrayValue, t), this.Nt(t)) : fail(19022, { Ut: e });
	}
	Ot(e, t) {
		this.Ft(t, 25), this.$t(e, t);
	}
	$t(e, t) {
		t.xt(e);
	}
	qt(e, t) {
		const n = e.fields || {};
		this.Ft(t, 55);
		for (const e of Object.keys(n)) this.Ot(e, t), this.Ct(n[e], t);
	}
	kt(e, t) {
		const n = e.fields || {};
		this.Ft(t, 53);
		const r = ut, i = n[r].arrayValue?.values?.length || 0;
		this.Ft(t, 15), t.Mt(__PRIVATE_normalizeNumber(i)), this.Ot(r, t), this.Ct(n[r], t);
	}
	Kt(e, t) {
		const n = e.values || [];
		this.Ft(t, 50);
		for (const e of n) this.Ct(e, t);
	}
	Lt(e, t) {
		this.Ft(t, 37);
		DocumentKey.fromName(e).path.forEach(((e) => {
			this.Ft(t, 60), this.$t(e, t);
		}));
	}
	Ft(e, t) {
		e.Mt(t);
	}
	Nt(e) {
		e.Mt(2);
	}
};
__PRIVATE_FirestoreIndexValueWriter.Wt = new __PRIVATE_FirestoreIndexValueWriter();
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* An in-memory implementation of IndexManager.
*/ var __PRIVATE_MemoryIndexManager = class {
	constructor() {
		this.bn = new __PRIVATE_MemoryCollectionParentIndex();
	}
	addToCollectionParentIndex(e, t) {
		return this.bn.add(t), PersistencePromise.resolve();
	}
	getCollectionParents(e, t) {
		return PersistencePromise.resolve(this.bn.getEntries(t));
	}
	addFieldIndex(e, t) {
		return PersistencePromise.resolve();
	}
	deleteFieldIndex(e, t) {
		return PersistencePromise.resolve();
	}
	deleteAllFieldIndexes(e) {
		return PersistencePromise.resolve();
	}
	createTargetIndexes(e, t) {
		return PersistencePromise.resolve();
	}
	getDocumentsMatchingTarget(e, t) {
		return PersistencePromise.resolve(null);
	}
	getIndexType(e, t) {
		return PersistencePromise.resolve(0);
	}
	getFieldIndexes(e, t) {
		return PersistencePromise.resolve([]);
	}
	getNextCollectionGroupToUpdate(e) {
		return PersistencePromise.resolve(null);
	}
	getMinOffset(e, t) {
		return PersistencePromise.resolve(IndexOffset.min());
	}
	getMinOffsetFromCollectionGroup(e, t) {
		return PersistencePromise.resolve(IndexOffset.min());
	}
	updateCollectionGroup(e, t, n) {
		return PersistencePromise.resolve();
	}
	updateIndexEntries(e, t) {
		return PersistencePromise.resolve();
	}
};
/**
* Internal implementation of the collection-parent index exposed by MemoryIndexManager.
* Also used for in-memory caching by IndexedDbIndexManager and initial index population
* in indexeddb_schema.ts
*/ var __PRIVATE_MemoryCollectionParentIndex = class {
	constructor() {
		this.index = {};
	}
	add(e) {
		const t = e.lastSegment(), n = e.popLast(), r = this.index[t] || new SortedSet(ResourcePath.comparator), i = !r.has(n);
		return this.index[t] = r.add(n), i;
	}
	has(e) {
		const t = e.lastSegment(), n = e.popLast(), r = this.index[t];
		return r && r.has(n);
	}
	getEntries(e) {
		return (this.index[e] || new SortedSet(ResourcePath.comparator)).toArray();
	}
};
/**
* @license
* Copyright 2018 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var bt = {
	didRun: !1,
	sequenceNumbersCollected: 0,
	targetsRemoved: 0,
	documentsRemoved: 0
}, St = 41943040;
var LruParams = class LruParams {
	static withCacheSize(e) {
		return new LruParams(e, LruParams.DEFAULT_COLLECTION_PERCENTILE, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
	}
	constructor(e, t, n) {
		this.cacheSizeCollectionThreshold = e, this.percentileToCollect = t, this.maximumSequenceNumbersToCollect = n;
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/** A mutation queue for a specific user, backed by IndexedDB. */ LruParams.DEFAULT_COLLECTION_PERCENTILE = 10, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3, LruParams.DEFAULT = new LruParams(St, LruParams.DEFAULT_COLLECTION_PERCENTILE, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), LruParams.DISABLED = new LruParams(-1, 0, 0);
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/** Offset to ensure non-overlapping target ids. */
/**
* Generates monotonically increasing target IDs for sending targets to the
* watch stream.
*
* The client constructs two generators, one for the target cache, and one for
* for the sync engine (to generate limbo documents targets). These
* generators produce non-overlapping IDs (by using even and odd IDs
* respectively).
*
* By separating the target ID space, the query cache can generate target IDs
* that persist across client restarts, while sync engine can independently
* generate in-memory target IDs that are transient and can be reused after a
* restart.
*/
var __PRIVATE_TargetIdGenerator = class __PRIVATE_TargetIdGenerator {
	constructor(e) {
		this.sr = e;
	}
	next() {
		return this.sr += 2, this.sr;
	}
	static _r() {
		return new __PRIVATE_TargetIdGenerator(0);
	}
	static ar() {
		return new __PRIVATE_TargetIdGenerator(-1);
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var Dt = "LruGarbageCollector", Ct = 1048576;
function __PRIVATE_bufferEntryComparator([e, t], [n, r]) {
	const i = __PRIVATE_primitiveComparator(e, n);
	return 0 === i ? __PRIVATE_primitiveComparator(t, r) : i;
}
/**
* Used to calculate the nth sequence number. Keeps a rolling buffer of the
* lowest n values passed to `addElement`, and finally reports the largest of
* them in `maxValue`.
*/ var __PRIVATE_RollingSequenceNumberBuffer = class {
	constructor(e) {
		this.Pr = e, this.buffer = new SortedSet(__PRIVATE_bufferEntryComparator), this.Tr = 0;
	}
	Er() {
		return ++this.Tr;
	}
	Ir(e) {
		const t = [e, this.Er()];
		if (this.buffer.size < this.Pr) this.buffer = this.buffer.add(t);
		else {
			const e = this.buffer.last();
			__PRIVATE_bufferEntryComparator(t, e) < 0 && (this.buffer = this.buffer.delete(e).add(t));
		}
	}
	get maxValue() {
		return this.buffer.last()[0];
	}
};
/**
* This class is responsible for the scheduling of LRU garbage collection. It handles checking
* whether or not GC is enabled, as well as which delay to use before the next run.
*/ var __PRIVATE_LruScheduler = class {
	constructor(e, t, n) {
		this.garbageCollector = e, this.asyncQueue = t, this.localStore = n, this.Rr = null;
	}
	start() {
		-1 !== this.garbageCollector.params.cacheSizeCollectionThreshold && this.Ar(6e4);
	}
	stop() {
		this.Rr && (this.Rr.cancel(), this.Rr = null);
	}
	get started() {
		return null !== this.Rr;
	}
	Ar(e) {
		__PRIVATE_logDebug(Dt, `Garbage collection scheduled in ${e}ms`), this.Rr = this.asyncQueue.enqueueAfterDelay("lru_garbage_collection", e, (async () => {
			this.Rr = null;
			try {
				await this.localStore.collectGarbage(this.garbageCollector);
			} catch (e) {
				__PRIVATE_isIndexedDbTransactionError(e) ? __PRIVATE_logDebug(Dt, "Ignoring IndexedDB error during garbage collection: ", e) : await __PRIVATE_ignoreIfPrimaryLeaseLoss(e);
			}
			await this.Ar(3e5);
		}));
	}
};
/**
* Implements the steps for LRU garbage collection.
*/ var __PRIVATE_LruGarbageCollectorImpl = class {
	constructor(e, t) {
		this.Vr = e, this.params = t;
	}
	calculateTargetCount(e, t) {
		return this.Vr.dr(e).next(((e) => Math.floor(t / 100 * e)));
	}
	nthSequenceNumber(e, t) {
		if (0 === t) return PersistencePromise.resolve(__PRIVATE_ListenSequence.ce);
		const n = new __PRIVATE_RollingSequenceNumberBuffer(t);
		return this.Vr.forEachTarget(e, ((e) => n.Ir(e.sequenceNumber))).next((() => this.Vr.mr(e, ((e) => n.Ir(e))))).next((() => n.maxValue));
	}
	removeTargets(e, t, n) {
		return this.Vr.removeTargets(e, t, n);
	}
	removeOrphanedDocuments(e, t) {
		return this.Vr.removeOrphanedDocuments(e, t);
	}
	collect(e, t) {
		return -1 === this.params.cacheSizeCollectionThreshold ? (__PRIVATE_logDebug("LruGarbageCollector", "Garbage collection skipped; disabled"), PersistencePromise.resolve(bt)) : this.getCacheSize(e).next(((n) => n < this.params.cacheSizeCollectionThreshold ? (__PRIVATE_logDebug("LruGarbageCollector", `Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`), bt) : this.gr(e, t)));
	}
	getCacheSize(e) {
		return this.Vr.getCacheSize(e);
	}
	gr(e, t) {
		let n, r, i, s, o, _, a;
		const u = Date.now();
		return this.calculateTargetCount(e, this.params.percentileToCollect).next(((t) => (t > this.params.maximumSequenceNumbersToCollect ? (__PRIVATE_logDebug("LruGarbageCollector", `Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t}`), r = this.params.maximumSequenceNumbersToCollect) : r = t, s = Date.now(), this.nthSequenceNumber(e, r)))).next(((r) => (n = r, o = Date.now(), this.removeTargets(e, n, t)))).next(((t) => (i = t, _ = Date.now(), this.removeOrphanedDocuments(e, n)))).next(((e) => {
			if (a = Date.now(), __PRIVATE_getLogLevel() <= LogLevel.DEBUG) __PRIVATE_logDebug("LruGarbageCollector", `LRU Garbage Collection\n\tCounted targets in ${s - u}ms\n\tDetermined least recently used ${r} in ` + (o - s) + `ms
\tRemoved ${i} targets in ` + (_ - o) + `ms
\tRemoved ${e} documents in ` + (a - _) + `ms
Total Duration: ${a - u}ms`);
			return PersistencePromise.resolve({
				didRun: !0,
				sequenceNumbersCollected: r,
				targetsRemoved: i,
				documentsRemoved: e
			});
		}));
	}
};
function __PRIVATE_newLruGarbageCollector(e, t) {
	return new __PRIVATE_LruGarbageCollectorImpl(e, t);
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* An in-memory buffer of entries to be written to a RemoteDocumentCache.
* It can be used to batch up a set of changes to be written to the cache, but
* additionally supports reading entries back with the `getEntry()` method,
* falling back to the underlying RemoteDocumentCache if no entry is
* buffered.
*
* Entries added to the cache *must* be read first. This is to facilitate
* calculating the size delta of the pending changes.
*
* PORTING NOTE: This class was implemented then removed from other platforms.
* If byte-counting ends up being needed on the other platforms, consider
* porting this class as part of that implementation work.
*/ var RemoteDocumentChangeBuffer = class {
	constructor() {
		this.changes = new ObjectMap(((e) => e.toString()), ((e, t) => e.isEqual(t))), this.changesApplied = !1;
	}
	/**
	* Buffers a `RemoteDocumentCache.addEntry()` call.
	*
	* You can only modify documents that have already been retrieved via
	* `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
	*/ addEntry(e) {
		this.assertNotApplied(), this.changes.set(e.key, e);
	}
	/**
	* Buffers a `RemoteDocumentCache.removeEntry()` call.
	*
	* You can only remove documents that have already been retrieved via
	* `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
	*/ removeEntry(e, t) {
		this.assertNotApplied(), this.changes.set(e, MutableDocument.newInvalidDocument(e).setReadTime(t));
	}
	/**
	* Looks up an entry in the cache. The buffered changes will first be checked,
	* and if no buffered change applies, this will forward to
	* `RemoteDocumentCache.getEntry()`.
	*
	* @param transaction - The transaction in which to perform any persistence
	*     operations.
	* @param documentKey - The key of the entry to look up.
	* @returns The cached document or an invalid document if we have nothing
	* cached.
	*/ getEntry(e, t) {
		this.assertNotApplied();
		const n = this.changes.get(t);
		return void 0 !== n ? PersistencePromise.resolve(n) : this.getFromCache(e, t);
	}
	/**
	* Looks up several entries in the cache, forwarding to
	* `RemoteDocumentCache.getEntry()`.
	*
	* @param transaction - The transaction in which to perform any persistence
	*     operations.
	* @param documentKeys - The keys of the entries to look up.
	* @returns A map of cached documents, indexed by key. If an entry cannot be
	*     found, the corresponding key will be mapped to an invalid document.
	*/ getEntries(e, t) {
		return this.getAllFromCache(e, t);
	}
	/**
	* Applies buffered changes to the underlying RemoteDocumentCache, using
	* the provided transaction.
	*/ apply(e) {
		return this.assertNotApplied(), this.changesApplied = !0, this.applyChanges(e);
	}
	/** Helper to assert this.changes is not null  */ assertNotApplied() {}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Schema Version for the Web client:
* 1.  Initial version including Mutation Queue, Query Cache, and Remote
*     Document Cache
* 2.  Used to ensure a targetGlobal object exists and add targetCount to it. No
*     longer required because migration 3 unconditionally clears it.
* 3.  Dropped and re-created Query Cache to deal with cache corruption related
*     to limbo resolution. Addresses
*     https://github.com/firebase/firebase-ios-sdk/issues/1548
* 4.  Multi-Tab Support.
* 5.  Removal of held write acks.
* 6.  Create document global for tracking document cache size.
* 7.  Ensure every cached document has a sentinel row with a sequence number.
* 8.  Add collection-parent index for Collection Group queries.
* 9.  Change RemoteDocumentChanges store to be keyed by readTime rather than
*     an auto-incrementing ID. This is required for Index-Free queries.
* 10. Rewrite the canonical IDs to the explicit Protobuf-based format.
* 11. Add bundles and named_queries for bundle support.
* 12. Add document overlays.
* 13. Rewrite the keys of the remote document cache to allow for efficient
*     document lookup via `getAll()`.
* 14. Add overlays.
* 15. Add indexing support.
* 16. Parse timestamp strings before creating index entries.
* 17. TODO(tomandersen)
* 18. Encode key safe representations of IndexEntry in DbIndexEntryStore.
*/
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Represents a local view (overlay) of a document, and the fields that are
* locally mutated.
*/
var OverlayedDocument = class {
	constructor(e, t) {
		this.overlayedDocument = e, this.mutatedFields = t;
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* A readonly view of the local state of all documents we're tracking (i.e. we
* have a cached version in remoteDocumentCache or local mutations for the
* document). The view is computed by applying the mutations in the
* MutationQueue to the RemoteDocumentCache.
*/ var LocalDocumentsView = class {
	constructor(e, t, n, r) {
		this.remoteDocumentCache = e, this.mutationQueue = t, this.documentOverlayCache = n, this.indexManager = r;
	}
	/**
	* Get the local view of the document identified by `key`.
	*
	* @returns Local view of the document or null if we don't have any cached
	* state for it.
	*/ getDocument(e, t) {
		let n = null;
		return this.documentOverlayCache.getOverlay(e, t).next(((r) => (n = r, this.remoteDocumentCache.getEntry(e, t)))).next(((e) => (null !== n && __PRIVATE_mutationApplyToLocalView(n.mutation, e, FieldMask.empty(), Timestamp.now()), e)));
	}
	/**
	* Gets the local view of the documents identified by `keys`.
	*
	* If we don't have cached state for a document in `keys`, a NoDocument will
	* be stored for that key in the resulting set.
	*/ getDocuments(e, t) {
		return this.remoteDocumentCache.getEntries(e, t).next(((t) => this.getLocalViewOfDocuments(e, t, __PRIVATE_documentKeySet()).next((() => t))));
	}
	/**
	* Similar to `getDocuments`, but creates the local view from the given
	* `baseDocs` without retrieving documents from the local store.
	*
	* @param transaction - The transaction this operation is scoped to.
	* @param docs - The documents to apply local mutations to get the local views.
	* @param existenceStateChanged - The set of document keys whose existence state
	*   is changed. This is useful to determine if some documents overlay needs
	*   to be recalculated.
	*/ getLocalViewOfDocuments(e, t, n = __PRIVATE_documentKeySet()) {
		const r = __PRIVATE_newOverlayMap();
		return this.populateOverlays(e, r, t).next((() => this.computeViews(e, t, r, n).next(((e) => {
			let t = documentMap();
			return e.forEach(((e, n) => {
				t = t.insert(e, n.overlayedDocument);
			})), t;
		}))));
	}
	/**
	* Gets the overlayed documents for the given document map, which will include
	* the local view of those documents and a `FieldMask` indicating which fields
	* are mutated locally, `null` if overlay is a Set or Delete mutation.
	*/ getOverlayedDocuments(e, t) {
		const n = __PRIVATE_newOverlayMap();
		return this.populateOverlays(e, n, t).next((() => this.computeViews(e, t, n, __PRIVATE_documentKeySet())));
	}
	/**
	* Fetches the overlays for {@code docs} and adds them to provided overlay map
	* if the map does not already contain an entry for the given document key.
	*/ populateOverlays(e, t, n) {
		const r = [];
		return n.forEach(((e) => {
			t.has(e) || r.push(e);
		})), this.documentOverlayCache.getOverlays(e, r).next(((e) => {
			e.forEach(((e, n) => {
				t.set(e, n);
			}));
		}));
	}
	/**
	* Computes the local view for the given documents.
	*
	* @param docs - The documents to compute views for. It also has the base
	*   version of the documents.
	* @param overlays - The overlays that need to be applied to the given base
	*   version of the documents.
	* @param existenceStateChanged - A set of documents whose existence states
	*   might have changed. This is used to determine if we need to re-calculate
	*   overlays from mutation queues.
	* @returns A map represents the local documents view.
	*/ computeViews(e, t, n, r) {
		let i = __PRIVATE_mutableDocumentMap();
		const s = __PRIVATE_newDocumentKeyMap(), o = function __PRIVATE_newOverlayedDocumentMap() {
			return __PRIVATE_newDocumentKeyMap();
		}();
		return t.forEach(((e, t) => {
			const o = n.get(t.key);
			r.has(t.key) && (void 0 === o || o.mutation instanceof __PRIVATE_PatchMutation) ? i = i.insert(t.key, t) : void 0 !== o ? (s.set(t.key, o.mutation.getFieldMask()), __PRIVATE_mutationApplyToLocalView(o.mutation, t, o.mutation.getFieldMask(), Timestamp.now())) : s.set(t.key, FieldMask.empty());
		})), this.recalculateAndSaveOverlays(e, i).next(((e) => (e.forEach(((e, t) => s.set(e, t))), t.forEach(((e, t) => o.set(e, new OverlayedDocument(t, s.get(e) ?? null)))), o)));
	}
	recalculateAndSaveOverlays(e, t) {
		const n = __PRIVATE_newDocumentKeyMap();
		let r = new SortedMap(((e, t) => e - t)), i = __PRIVATE_documentKeySet();
		return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e, t).next(((e) => {
			for (const i of e) i.keys().forEach(((e) => {
				const s = t.get(e);
				if (null === s) return;
				let o = n.get(e) || FieldMask.empty();
				o = i.applyToLocalView(s, o), n.set(e, o);
				const _ = (r.get(i.batchId) || __PRIVATE_documentKeySet()).add(e);
				r = r.insert(i.batchId, _);
			}));
		})).next((() => {
			const s = [], o = r.getReverseIterator();
			for (; o.hasNext();) {
				const r = o.getNext(), _ = r.key, a = r.value, u = __PRIVATE_newMutationMap();
				a.forEach(((e) => {
					if (!i.has(e)) {
						const r = __PRIVATE_calculateOverlayMutation(t.get(e), n.get(e));
						null !== r && u.set(e, r), i = i.add(e);
					}
				})), s.push(this.documentOverlayCache.saveOverlays(e, _, u));
			}
			return PersistencePromise.waitFor(s);
		})).next((() => n));
	}
	/**
	* Recalculates overlays by reading the documents from remote document cache
	* first, and saves them after they are calculated.
	*/ recalculateAndSaveOverlaysForDocumentKeys(e, t) {
		return this.remoteDocumentCache.getEntries(e, t).next(((t) => this.recalculateAndSaveOverlays(e, t)));
	}
	/**
	* Performs a query against the local view of all documents.
	*
	* @param transaction - The persistence transaction.
	* @param query - The query to match documents against.
	* @param offset - Read time and key to start scanning by (exclusive).
	* @param context - A optional tracker to keep a record of important details
	*   during database local query execution.
	*/ getDocumentsMatchingQuery(e, t, n, r) {
		return __PRIVATE_isDocumentQuery$1(t) ? this.getDocumentsMatchingDocumentQuery(e, t.path) : __PRIVATE_isCollectionGroupQuery(t) ? this.getDocumentsMatchingCollectionGroupQuery(e, t, n, r) : this.getDocumentsMatchingCollectionQuery(e, t, n, r);
	}
	/**
	* Given a collection group, returns the next documents that follow the provided offset, along
	* with an updated batch ID.
	*
	* <p>The documents returned by this method are ordered by remote version from the provided
	* offset. If there are no more remote documents after the provided offset, documents with
	* mutations in order of batch id from the offset are returned. Since all documents in a batch are
	* returned together, the total number of documents returned can exceed {@code count}.
	*
	* @param transaction
	* @param collectionGroup - The collection group for the documents.
	* @param offset - The offset to index into.
	* @param count - The number of documents to return
	* @returns A LocalWriteResult with the documents that follow the provided offset and the last processed batch id.
	*/ getNextDocuments(e, t, n, r) {
		return this.remoteDocumentCache.getAllFromCollectionGroup(e, t, n, r).next(((i) => {
			const s = r - i.size > 0 ? this.documentOverlayCache.getOverlaysForCollectionGroup(e, t, n.largestBatchId, r - i.size) : PersistencePromise.resolve(__PRIVATE_newOverlayMap());
			let o = N, _ = i;
			return s.next(((t) => PersistencePromise.forEach(t, ((t, n) => (o < n.largestBatchId && (o = n.largestBatchId), i.get(t) ? PersistencePromise.resolve() : this.remoteDocumentCache.getEntry(e, t).next(((e) => {
				_ = _.insert(t, e);
			}))))).next((() => this.populateOverlays(e, t, i))).next((() => this.computeViews(e, _, t, __PRIVATE_documentKeySet()))).next(((e) => ({
				batchId: o,
				changes: __PRIVATE_convertOverlayedDocumentMapToDocumentMap(e)
			})))));
		}));
	}
	getDocumentsMatchingDocumentQuery(e, t) {
		return this.getDocument(e, new DocumentKey(t)).next(((e) => {
			let t = documentMap();
			return e.isFoundDocument() && (t = t.insert(e.key, e)), t;
		}));
	}
	getDocumentsMatchingCollectionGroupQuery(e, t, n, r) {
		const i = t.collectionGroup;
		let s = documentMap();
		return this.indexManager.getCollectionParents(e, i).next(((o) => PersistencePromise.forEach(o, ((o) => {
			const _ = function __PRIVATE_asCollectionQueryAtPath(e, t) {
				return new __PRIVATE_QueryImpl(t, null, e.explicitOrderBy.slice(), e.filters.slice(), e.limit, e.limitType, e.startAt, e.endAt);
			}(t, o.child(i));
			return this.getDocumentsMatchingCollectionQuery(e, _, n, r).next(((e) => {
				e.forEach(((e, t) => {
					s = s.insert(e, t);
				}));
			}));
		})).next((() => s))));
	}
	getDocumentsMatchingCollectionQuery(e, t, n, r) {
		let i;
		return this.documentOverlayCache.getOverlaysForCollection(e, t.path, n.largestBatchId).next(((s) => (i = s, this.remoteDocumentCache.getDocumentsMatchingQuery(e, t, n, i, r)))).next(((e) => {
			i.forEach(((t, n) => {
				const r = n.getKey();
				null === e.get(r) && (e = e.insert(r, MutableDocument.newInvalidDocument(r)));
			}));
			let n = documentMap();
			return e.forEach(((e, r) => {
				const s = i.get(e);
				void 0 !== s && __PRIVATE_mutationApplyToLocalView(s.mutation, r, FieldMask.empty(), Timestamp.now()), __PRIVATE_queryMatches(t, r) && (n = n.insert(e, r));
			})), n;
		}));
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var __PRIVATE_MemoryBundleCache = class {
	constructor(e) {
		this.serializer = e, this.Nr = /* @__PURE__ */ new Map(), this.Br = /* @__PURE__ */ new Map();
	}
	getBundleMetadata(e, t) {
		return PersistencePromise.resolve(this.Nr.get(t));
	}
	saveBundleMetadata(e, t) {
		return this.Nr.set(
			t.id,
			/** Decodes a BundleMetadata proto into a BundleMetadata object. */
			function __PRIVATE_fromBundleMetadata(e) {
				return {
					id: e.id,
					version: e.version,
					createTime: __PRIVATE_fromVersion(e.createTime)
				};
			}(t)
		), PersistencePromise.resolve();
	}
	getNamedQuery(e, t) {
		return PersistencePromise.resolve(this.Br.get(t));
	}
	saveNamedQuery(e, t) {
		return this.Br.set(t.name, function __PRIVATE_fromProtoNamedQuery(e) {
			return {
				name: e.name,
				query: __PRIVATE_fromBundledQuery(e.bundledQuery),
				readTime: __PRIVATE_fromVersion(e.readTime)
			};
		}(t)), PersistencePromise.resolve();
	}
};
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* An in-memory implementation of DocumentOverlayCache.
*/ var __PRIVATE_MemoryDocumentOverlayCache = class {
	constructor() {
		this.overlays = new SortedMap(DocumentKey.comparator), this.Lr = /* @__PURE__ */ new Map();
	}
	getOverlay(e, t) {
		return PersistencePromise.resolve(this.overlays.get(t));
	}
	getOverlays(e, t) {
		const n = __PRIVATE_newOverlayMap();
		return PersistencePromise.forEach(t, ((t) => this.getOverlay(e, t).next(((e) => {
			null !== e && n.set(t, e);
		})))).next((() => n));
	}
	saveOverlays(e, t, n) {
		return n.forEach(((n, r) => {
			this.St(e, t, r);
		})), PersistencePromise.resolve();
	}
	removeOverlaysForBatchId(e, t, n) {
		const r = this.Lr.get(n);
		return void 0 !== r && (r.forEach(((e) => this.overlays = this.overlays.remove(e))), this.Lr.delete(n)), PersistencePromise.resolve();
	}
	getOverlaysForCollection(e, t, n) {
		const r = __PRIVATE_newOverlayMap(), i = t.length + 1, s = new DocumentKey(t.child("")), o = this.overlays.getIteratorFrom(s);
		for (; o.hasNext();) {
			const e = o.getNext().value, s = e.getKey();
			if (!t.isPrefixOf(s.path)) break;
			s.path.length === i && e.largestBatchId > n && r.set(e.getKey(), e);
		}
		return PersistencePromise.resolve(r);
	}
	getOverlaysForCollectionGroup(e, t, n, r) {
		let i = new SortedMap(((e, t) => e - t));
		const s = this.overlays.getIterator();
		for (; s.hasNext();) {
			const e = s.getNext().value;
			if (e.getKey().getCollectionGroup() === t && e.largestBatchId > n) {
				let t = i.get(e.largestBatchId);
				null === t && (t = __PRIVATE_newOverlayMap(), i = i.insert(e.largestBatchId, t)), t.set(e.getKey(), e);
			}
		}
		const o = __PRIVATE_newOverlayMap(), _ = i.getIterator();
		for (; _.hasNext();) if (_.getNext().value.forEach(((e, t) => o.set(e, t))), o.size() >= r) break;
		return PersistencePromise.resolve(o);
	}
	St(e, t, n) {
		const r = this.overlays.get(n.key);
		if (null !== r) {
			const e = this.Lr.get(r.largestBatchId).delete(n.key);
			this.Lr.set(r.largestBatchId, e);
		}
		this.overlays = this.overlays.insert(n.key, new Overlay(t, n));
		let i = this.Lr.get(t);
		void 0 === i && (i = __PRIVATE_documentKeySet(), this.Lr.set(t, i)), this.Lr.set(t, i.add(n.key));
	}
};
/**
* @license
* Copyright 2024 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var __PRIVATE_MemoryGlobalsCache = class {
	constructor() {
		this.sessionToken = ByteString.EMPTY_BYTE_STRING;
	}
	getSessionToken(e) {
		return PersistencePromise.resolve(this.sessionToken);
	}
	setSessionToken(e, t) {
		return this.sessionToken = t, PersistencePromise.resolve();
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* A collection of references to a document from some kind of numbered entity
* (either a target ID or batch ID). As references are added to or removed from
* the set corresponding events are emitted to a registered garbage collector.
*
* Each reference is represented by a DocumentReference object. Each of them
* contains enough information to uniquely identify the reference. They are all
* stored primarily in a set sorted by key. A document is considered garbage if
* there's no references in that set (this can be efficiently checked thanks to
* sorting by key).
*
* ReferenceSet also keeps a secondary set that contains references sorted by
* IDs. This one is used to efficiently implement removal of all references by
* some target ID.
*/ var __PRIVATE_ReferenceSet = class {
	constructor() {
		this.kr = new SortedSet(__PRIVATE_DocReference.qr), this.Kr = new SortedSet(__PRIVATE_DocReference.Ur);
	}
	/** Returns true if the reference set contains no references. */ isEmpty() {
		return this.kr.isEmpty();
	}
	/** Adds a reference to the given document key for the given ID. */ addReference(e, t) {
		const n = new __PRIVATE_DocReference(e, t);
		this.kr = this.kr.add(n), this.Kr = this.Kr.add(n);
	}
	/** Add references to the given document keys for the given ID. */ $r(e, t) {
		e.forEach(((e) => this.addReference(e, t)));
	}
	/**
	* Removes a reference to the given document key for the given
	* ID.
	*/ removeReference(e, t) {
		this.Wr(new __PRIVATE_DocReference(e, t));
	}
	Qr(e, t) {
		e.forEach(((e) => this.removeReference(e, t)));
	}
	/**
	* Clears all references with a given ID. Calls removeRef() for each key
	* removed.
	*/ Gr(e) {
		const t = new DocumentKey(new ResourcePath([])), n = new __PRIVATE_DocReference(t, e), r = new __PRIVATE_DocReference(t, e + 1), i = [];
		return this.Kr.forEachInRange([n, r], ((e) => {
			this.Wr(e), i.push(e.key);
		})), i;
	}
	zr() {
		this.kr.forEach(((e) => this.Wr(e)));
	}
	Wr(e) {
		this.kr = this.kr.delete(e), this.Kr = this.Kr.delete(e);
	}
	jr(e) {
		const t = new DocumentKey(new ResourcePath([])), n = new __PRIVATE_DocReference(t, e), r = new __PRIVATE_DocReference(t, e + 1);
		let i = __PRIVATE_documentKeySet();
		return this.Kr.forEachInRange([n, r], ((e) => {
			i = i.add(e.key);
		})), i;
	}
	containsKey(e) {
		const t = new __PRIVATE_DocReference(e, 0), n = this.kr.firstAfterOrEqual(t);
		return null !== n && e.isEqual(n.key);
	}
};
var __PRIVATE_DocReference = class {
	constructor(e, t) {
		this.key = e, this.Jr = t;
	}
	/** Compare by key then by ID */ static qr(e, t) {
		return DocumentKey.comparator(e.key, t.key) || __PRIVATE_primitiveComparator(e.Jr, t.Jr);
	}
	/** Compare by ID then by key */ static Ur(e, t) {
		return __PRIVATE_primitiveComparator(e.Jr, t.Jr) || DocumentKey.comparator(e.key, t.key);
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var __PRIVATE_MemoryMutationQueue = class {
	constructor(e, t) {
		this.indexManager = e, this.referenceDelegate = t, this.mutationQueue = [], this.Yn = 1, this.Hr = new SortedSet(__PRIVATE_DocReference.qr);
	}
	checkEmpty(e) {
		return PersistencePromise.resolve(0 === this.mutationQueue.length);
	}
	addMutationBatch(e, t, n, r) {
		const i = this.Yn;
		this.Yn++, this.mutationQueue.length > 0 && this.mutationQueue[this.mutationQueue.length - 1];
		const s = new MutationBatch(i, t, n, r);
		this.mutationQueue.push(s);
		for (const t of r) this.Hr = this.Hr.add(new __PRIVATE_DocReference(t.key, i)), this.indexManager.addToCollectionParentIndex(e, t.key.path.popLast());
		return PersistencePromise.resolve(s);
	}
	lookupMutationBatch(e, t) {
		return PersistencePromise.resolve(this.Zr(t));
	}
	getNextMutationBatchAfterBatchId(e, t) {
		const n = t + 1, r = this.Xr(n), i = r < 0 ? 0 : r;
		return PersistencePromise.resolve(this.mutationQueue.length > i ? this.mutationQueue[i] : null);
	}
	getHighestUnacknowledgedBatchId() {
		return PersistencePromise.resolve(0 === this.mutationQueue.length ? q : this.Yn - 1);
	}
	getAllMutationBatches(e) {
		return PersistencePromise.resolve(this.mutationQueue.slice());
	}
	getAllMutationBatchesAffectingDocumentKey(e, t) {
		const n = new __PRIVATE_DocReference(t, 0), r = new __PRIVATE_DocReference(t, Number.POSITIVE_INFINITY), i = [];
		return this.Hr.forEachInRange([n, r], ((e) => {
			const t = this.Zr(e.Jr);
			i.push(t);
		})), PersistencePromise.resolve(i);
	}
	getAllMutationBatchesAffectingDocumentKeys(e, t) {
		let n = new SortedSet(__PRIVATE_primitiveComparator);
		return t.forEach(((e) => {
			const t = new __PRIVATE_DocReference(e, 0), r = new __PRIVATE_DocReference(e, Number.POSITIVE_INFINITY);
			this.Hr.forEachInRange([t, r], ((e) => {
				n = n.add(e.Jr);
			}));
		})), PersistencePromise.resolve(this.Yr(n));
	}
	getAllMutationBatchesAffectingQuery(e, t) {
		const n = t.path, r = n.length + 1;
		let i = n;
		DocumentKey.isDocumentKey(i) || (i = i.child(""));
		const s = new __PRIVATE_DocReference(new DocumentKey(i), 0);
		let o = new SortedSet(__PRIVATE_primitiveComparator);
		return this.Hr.forEachWhile(((e) => {
			const t = e.key.path;
			return !!n.isPrefixOf(t) && (t.length === r && (o = o.add(e.Jr)), !0);
		}), s), PersistencePromise.resolve(this.Yr(o));
	}
	Yr(e) {
		const t = [];
		return e.forEach(((e) => {
			const n = this.Zr(e);
			null !== n && t.push(n);
		})), t;
	}
	removeMutationBatch(e, t) {
		__PRIVATE_hardAssert(0 === this.ei(t.batchId, "removed"), 55003), this.mutationQueue.shift();
		let n = this.Hr;
		return PersistencePromise.forEach(t.mutations, ((r) => {
			const i = new __PRIVATE_DocReference(r.key, t.batchId);
			return n = n.delete(i), this.referenceDelegate.markPotentiallyOrphaned(e, r.key);
		})).next((() => {
			this.Hr = n;
		}));
	}
	nr(e) {}
	containsKey(e, t) {
		const n = new __PRIVATE_DocReference(t, 0), r = this.Hr.firstAfterOrEqual(n);
		return PersistencePromise.resolve(t.isEqual(r && r.key));
	}
	performConsistencyCheck(e) {
		return this.mutationQueue.length, PersistencePromise.resolve();
	}
	/**
	* Finds the index of the given batchId in the mutation queue and asserts that
	* the resulting index is within the bounds of the queue.
	*
	* @param batchId - The batchId to search for
	* @param action - A description of what the caller is doing, phrased in passive
	* form (e.g. "acknowledged" in a routine that acknowledges batches).
	*/ ei(e, t) {
		return this.Xr(e);
	}
	/**
	* Finds the index of the given batchId in the mutation queue. This operation
	* is O(1).
	*
	* @returns The computed index of the batch with the given batchId, based on
	* the state of the queue. Note this index can be negative if the requested
	* batchId has already been removed from the queue or past the end of the
	* queue if the batchId is larger than the last added batch.
	*/ Xr(e) {
		if (0 === this.mutationQueue.length) return 0;
		return e - this.mutationQueue[0].batchId;
	}
	/**
	* A version of lookupMutationBatch that doesn't return a promise, this makes
	* other functions that uses this code easier to read and more efficient.
	*/ Zr(e) {
		const t = this.Xr(e);
		if (t < 0 || t >= this.mutationQueue.length) return null;
		return this.mutationQueue[t];
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* The smallest value representable by a 64-bit signed integer (long).
*/
/**
* The memory-only RemoteDocumentCache for IndexedDb. To construct, invoke
* `newMemoryRemoteDocumentCache()`.
*/
var __PRIVATE_MemoryRemoteDocumentCacheImpl = class {
	/**
	* @param sizer - Used to assess the size of a document. For eager GC, this is
	* expected to just return 0 to avoid unnecessarily doing the work of
	* calculating the size.
	*/
	constructor(e) {
		this.ti = e, this.docs = function __PRIVATE_documentEntryMap() {
			return new SortedMap(DocumentKey.comparator);
		}(), this.size = 0;
	}
	setIndexManager(e) {
		this.indexManager = e;
	}
	/**
	* Adds the supplied entry to the cache and updates the cache size as appropriate.
	*
	* All calls of `addEntry`  are required to go through the RemoteDocumentChangeBuffer
	* returned by `newChangeBuffer()`.
	*/ addEntry(e, t) {
		const n = t.key, r = this.docs.get(n), i = r ? r.size : 0, s = this.ti(t);
		return this.docs = this.docs.insert(n, {
			document: t.mutableCopy(),
			size: s
		}), this.size += s - i, this.indexManager.addToCollectionParentIndex(e, n.path.popLast());
	}
	/**
	* Removes the specified entry from the cache and updates the cache size as appropriate.
	*
	* All calls of `removeEntry` are required to go through the RemoteDocumentChangeBuffer
	* returned by `newChangeBuffer()`.
	*/ removeEntry(e) {
		const t = this.docs.get(e);
		t && (this.docs = this.docs.remove(e), this.size -= t.size);
	}
	getEntry(e, t) {
		const n = this.docs.get(t);
		return PersistencePromise.resolve(n ? n.document.mutableCopy() : MutableDocument.newInvalidDocument(t));
	}
	getEntries(e, t) {
		let n = __PRIVATE_mutableDocumentMap();
		return t.forEach(((e) => {
			const t = this.docs.get(e);
			n = n.insert(e, t ? t.document.mutableCopy() : MutableDocument.newInvalidDocument(e));
		})), PersistencePromise.resolve(n);
	}
	getDocumentsMatchingQuery(e, t, n, r) {
		let i = __PRIVATE_mutableDocumentMap();
		const s = t.path, o = new DocumentKey(s.child("__id-9223372036854775808__")), _ = this.docs.getIteratorFrom(o);
		for (; _.hasNext();) {
			const { key: e, value: { document: o } } = _.getNext();
			if (!s.isPrefixOf(e.path)) break;
			e.path.length > s.length + 1 || __PRIVATE_indexOffsetComparator(__PRIVATE_newIndexOffsetFromDocument(o), n) <= 0 || (r.has(o.key) || __PRIVATE_queryMatches(t, o)) && (i = i.insert(o.key, o.mutableCopy()));
		}
		return PersistencePromise.resolve(i);
	}
	getAllFromCollectionGroup(e, t, n, r) {
		fail(9500);
	}
	ni(e, t) {
		return PersistencePromise.forEach(this.docs, ((e) => t(e)));
	}
	newChangeBuffer(e) {
		return new __PRIVATE_MemoryRemoteDocumentChangeBuffer(this);
	}
	getSize(e) {
		return PersistencePromise.resolve(this.size);
	}
};
/**
* Creates a new memory-only RemoteDocumentCache.
*
* @param sizer - Used to assess the size of a document. For eager GC, this is
* expected to just return 0 to avoid unnecessarily doing the work of
* calculating the size.
*/
/**
* Handles the details of adding and updating documents in the MemoryRemoteDocumentCache.
*/
var __PRIVATE_MemoryRemoteDocumentChangeBuffer = class extends RemoteDocumentChangeBuffer {
	constructor(e) {
		super(), this.Mr = e;
	}
	applyChanges(e) {
		const t = [];
		return this.changes.forEach(((n, r) => {
			r.isValidDocument() ? t.push(this.Mr.addEntry(e, r)) : this.Mr.removeEntry(n);
		})), PersistencePromise.waitFor(t);
	}
	getFromCache(e, t) {
		return this.Mr.getEntry(e, t);
	}
	getAllFromCache(e, t) {
		return this.Mr.getEntries(e, t);
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var __PRIVATE_MemoryTargetCache = class {
	constructor(e) {
		this.persistence = e, this.ri = new ObjectMap(((e) => __PRIVATE_canonifyTarget(e)), __PRIVATE_targetEquals), this.lastRemoteSnapshotVersion = SnapshotVersion.min(), this.highestTargetId = 0, this.ii = 0, this.si = new __PRIVATE_ReferenceSet(), this.targetCount = 0, this.oi = __PRIVATE_TargetIdGenerator._r();
	}
	forEachTarget(e, t) {
		return this.ri.forEach(((e, n) => t(n))), PersistencePromise.resolve();
	}
	getLastRemoteSnapshotVersion(e) {
		return PersistencePromise.resolve(this.lastRemoteSnapshotVersion);
	}
	getHighestSequenceNumber(e) {
		return PersistencePromise.resolve(this.ii);
	}
	allocateTargetId(e) {
		return this.highestTargetId = this.oi.next(), PersistencePromise.resolve(this.highestTargetId);
	}
	setTargetsMetadata(e, t, n) {
		return n && (this.lastRemoteSnapshotVersion = n), t > this.ii && (this.ii = t), PersistencePromise.resolve();
	}
	lr(e) {
		this.ri.set(e.target, e);
		const t = e.targetId;
		t > this.highestTargetId && (this.oi = new __PRIVATE_TargetIdGenerator(t), this.highestTargetId = t), e.sequenceNumber > this.ii && (this.ii = e.sequenceNumber);
	}
	addTargetData(e, t) {
		return this.lr(t), this.targetCount += 1, PersistencePromise.resolve();
	}
	updateTargetData(e, t) {
		return this.lr(t), PersistencePromise.resolve();
	}
	removeTargetData(e, t) {
		return this.ri.delete(t.target), this.si.Gr(t.targetId), this.targetCount -= 1, PersistencePromise.resolve();
	}
	removeTargets(e, t, n) {
		let r = 0;
		const i = [];
		return this.ri.forEach(((s, o) => {
			o.sequenceNumber <= t && null === n.get(o.targetId) && (this.ri.delete(s), i.push(this.removeMatchingKeysForTargetId(e, o.targetId)), r++);
		})), PersistencePromise.waitFor(i).next((() => r));
	}
	getTargetCount(e) {
		return PersistencePromise.resolve(this.targetCount);
	}
	getTargetData(e, t) {
		const n = this.ri.get(t) || null;
		return PersistencePromise.resolve(n);
	}
	addMatchingKeys(e, t, n) {
		return this.si.$r(t, n), PersistencePromise.resolve();
	}
	removeMatchingKeys(e, t, n) {
		this.si.Qr(t, n);
		const r = this.persistence.referenceDelegate, i = [];
		return r && t.forEach(((t) => {
			i.push(r.markPotentiallyOrphaned(e, t));
		})), PersistencePromise.waitFor(i);
	}
	removeMatchingKeysForTargetId(e, t) {
		return this.si.Gr(t), PersistencePromise.resolve();
	}
	getMatchingKeysForTargetId(e, t) {
		const n = this.si.jr(t);
		return PersistencePromise.resolve(n);
	}
	containsKey(e, t) {
		return PersistencePromise.resolve(this.si.containsKey(t));
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* A memory-backed instance of Persistence. Data is stored only in RAM and
* not persisted across sessions.
*/
var __PRIVATE_MemoryPersistence = class {
	/**
	* The constructor accepts a factory for creating a reference delegate. This
	* allows both the delegate and this instance to have strong references to
	* each other without having nullable fields that would then need to be
	* checked or asserted on every access.
	*/
	constructor(e, t) {
		this._i = {}, this.overlays = {}, this.ai = new __PRIVATE_ListenSequence(0), this.ui = !1, this.ui = !0, this.ci = new __PRIVATE_MemoryGlobalsCache(), this.referenceDelegate = e(this), this.li = new __PRIVATE_MemoryTargetCache(this);
		this.indexManager = new __PRIVATE_MemoryIndexManager(), this.remoteDocumentCache = function __PRIVATE_newMemoryRemoteDocumentCache(e) {
			return new __PRIVATE_MemoryRemoteDocumentCacheImpl(e);
		}(((e) => this.referenceDelegate.hi(e))), this.serializer = new __PRIVATE_LocalSerializer(t), this.Pi = new __PRIVATE_MemoryBundleCache(this.serializer);
	}
	start() {
		return Promise.resolve();
	}
	shutdown() {
		return this.ui = !1, Promise.resolve();
	}
	get started() {
		return this.ui;
	}
	setDatabaseDeletedListener() {}
	setNetworkEnabled() {}
	getIndexManager(e) {
		return this.indexManager;
	}
	getDocumentOverlayCache(e) {
		let t = this.overlays[e.toKey()];
		return t || (t = new __PRIVATE_MemoryDocumentOverlayCache(), this.overlays[e.toKey()] = t), t;
	}
	getMutationQueue(e, t) {
		let n = this._i[e.toKey()];
		return n || (n = new __PRIVATE_MemoryMutationQueue(t, this.referenceDelegate), this._i[e.toKey()] = n), n;
	}
	getGlobalsCache() {
		return this.ci;
	}
	getTargetCache() {
		return this.li;
	}
	getRemoteDocumentCache() {
		return this.remoteDocumentCache;
	}
	getBundleCache() {
		return this.Pi;
	}
	runTransaction(e, t, n) {
		__PRIVATE_logDebug("MemoryPersistence", "Starting transaction:", e);
		const r = new __PRIVATE_MemoryTransaction(this.ai.next());
		return this.referenceDelegate.Ti(), n(r).next(((e) => this.referenceDelegate.Ei(r).next((() => e)))).toPromise().then(((e) => (r.raiseOnCommittedEvent(), e)));
	}
	Ii(e, t) {
		return PersistencePromise.or(Object.values(this._i).map(((n) => () => n.containsKey(e, t))));
	}
};
/**
* Memory persistence is not actually transactional, but future implementations
* may have transaction-scoped state.
*/ var __PRIVATE_MemoryTransaction = class extends PersistenceTransaction {
	constructor(e) {
		super(), this.currentSequenceNumber = e;
	}
};
var __PRIVATE_MemoryEagerDelegate = class __PRIVATE_MemoryEagerDelegate {
	constructor(e) {
		this.persistence = e, this.Ri = new __PRIVATE_ReferenceSet(), this.Ai = null;
	}
	static Vi(e) {
		return new __PRIVATE_MemoryEagerDelegate(e);
	}
	get di() {
		if (this.Ai) return this.Ai;
		throw fail(60996);
	}
	addReference(e, t, n) {
		return this.Ri.addReference(n, t), this.di.delete(n.toString()), PersistencePromise.resolve();
	}
	removeReference(e, t, n) {
		return this.Ri.removeReference(n, t), this.di.add(n.toString()), PersistencePromise.resolve();
	}
	markPotentiallyOrphaned(e, t) {
		return this.di.add(t.toString()), PersistencePromise.resolve();
	}
	removeTarget(e, t) {
		this.Ri.Gr(t.targetId).forEach(((e) => this.di.add(e.toString())));
		const n = this.persistence.getTargetCache();
		return n.getMatchingKeysForTargetId(e, t.targetId).next(((e) => {
			e.forEach(((e) => this.di.add(e.toString())));
		})).next((() => n.removeTargetData(e, t)));
	}
	Ti() {
		this.Ai = /* @__PURE__ */ new Set();
	}
	Ei(e) {
		const t = this.persistence.getRemoteDocumentCache().newChangeBuffer();
		return PersistencePromise.forEach(this.di, ((n) => {
			const r = DocumentKey.fromPath(n);
			return this.mi(e, r).next(((e) => {
				e || t.removeEntry(r, SnapshotVersion.min());
			}));
		})).next((() => (this.Ai = null, t.apply(e))));
	}
	updateLimboDocument(e, t) {
		return this.mi(e, t).next(((e) => {
			e ? this.di.delete(t.toString()) : this.di.add(t.toString());
		}));
	}
	hi(e) {
		return 0;
	}
	mi(e, t) {
		return PersistencePromise.or([
			() => PersistencePromise.resolve(this.Ri.containsKey(t)),
			() => this.persistence.getTargetCache().containsKey(e, t),
			() => this.persistence.Ii(e, t)
		]);
	}
};
var __PRIVATE_MemoryLruDelegate = class __PRIVATE_MemoryLruDelegate {
	constructor(e, t) {
		this.persistence = e, this.fi = new ObjectMap(((e) => __PRIVATE_encodeResourcePath(e.path)), ((e, t) => e.isEqual(t))), this.garbageCollector = __PRIVATE_newLruGarbageCollector(this, t);
	}
	static Vi(e, t) {
		return new __PRIVATE_MemoryLruDelegate(e, t);
	}
	Ti() {}
	Ei(e) {
		return PersistencePromise.resolve();
	}
	forEachTarget(e, t) {
		return this.persistence.getTargetCache().forEachTarget(e, t);
	}
	dr(e) {
		const t = this.pr(e);
		return this.persistence.getTargetCache().getTargetCount(e).next(((e) => t.next(((t) => e + t))));
	}
	pr(e) {
		let t = 0;
		return this.mr(e, ((e) => {
			t++;
		})).next((() => t));
	}
	mr(e, t) {
		return PersistencePromise.forEach(this.fi, ((n, r) => this.wr(e, n, r).next(((e) => e ? PersistencePromise.resolve() : t(r)))));
	}
	removeTargets(e, t, n) {
		return this.persistence.getTargetCache().removeTargets(e, t, n);
	}
	removeOrphanedDocuments(e, t) {
		let n = 0;
		const r = this.persistence.getRemoteDocumentCache(), i = r.newChangeBuffer();
		return r.ni(e, ((r) => this.wr(e, r, t).next(((e) => {
			e || (n++, i.removeEntry(r, SnapshotVersion.min()));
		})))).next((() => i.apply(e))).next((() => n));
	}
	markPotentiallyOrphaned(e, t) {
		return this.fi.set(t, e.currentSequenceNumber), PersistencePromise.resolve();
	}
	removeTarget(e, t) {
		const n = t.withSequenceNumber(e.currentSequenceNumber);
		return this.persistence.getTargetCache().updateTargetData(e, n);
	}
	addReference(e, t, n) {
		return this.fi.set(n, e.currentSequenceNumber), PersistencePromise.resolve();
	}
	removeReference(e, t, n) {
		return this.fi.set(n, e.currentSequenceNumber), PersistencePromise.resolve();
	}
	updateLimboDocument(e, t) {
		return this.fi.set(t, e.currentSequenceNumber), PersistencePromise.resolve();
	}
	hi(e) {
		let t = e.key.toString().length;
		return e.isFoundDocument() && (t += __PRIVATE_estimateByteSize(e.data.value)), t;
	}
	wr(e, t, n) {
		return PersistencePromise.or([
			() => this.persistence.Ii(e, t),
			() => this.persistence.getTargetCache().containsKey(e, t),
			() => {
				const e = this.fi.get(t);
				return PersistencePromise.resolve(void 0 !== e && e > n);
			}
		]);
	}
	getCacheSize(e) {
		return this.persistence.getRemoteDocumentCache().getSize(e);
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* A set of changes to what documents are currently in view and out of view for
* a given query. These changes are sent to the LocalStore by the View (via
* the SyncEngine) and are used to pin / unpin documents as appropriate.
*/
var __PRIVATE_LocalViewChanges = class __PRIVATE_LocalViewChanges {
	constructor(e, t, n, r) {
		this.targetId = e, this.fromCache = t, this.Ts = n, this.Es = r;
	}
	static Is(e, t) {
		let n = __PRIVATE_documentKeySet(), r = __PRIVATE_documentKeySet();
		for (const e of t.docChanges) switch (e.type) {
			case 0:
				n = n.add(e.doc.key);
				break;
			case 1: r = r.add(e.doc.key);
		}
		return new __PRIVATE_LocalViewChanges(e, t.fromCache, n, r);
	}
};
/**
* @license
* Copyright 2023 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* A tracker to keep a record of important details during database local query
* execution.
*/ var QueryContext = class {
	constructor() {
		/**
		* Counts the number of documents passed through during local query execution.
		*/
		this._documentReadCount = 0;
	}
	get documentReadCount() {
		return this._documentReadCount;
	}
	incrementDocumentReadCount(e) {
		this._documentReadCount += e;
	}
};
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* The Firestore query engine.
*
* Firestore queries can be executed in three modes. The Query Engine determines
* what mode to use based on what data is persisted. The mode only determines
* the runtime complexity of the query - the result set is equivalent across all
* implementations.
*
* The Query engine will use indexed-based execution if a user has configured
* any index that can be used to execute query (via `setIndexConfiguration()`).
* Otherwise, the engine will try to optimize the query by re-using a previously
* persisted query result. If that is not possible, the query will be executed
* via a full collection scan.
*
* Index-based execution is the default when available. The query engine
* supports partial indexed execution and merges the result from the index
* lookup with documents that have not yet been indexed. The index evaluation
* matches the backend's format and as such, the SDK can use indexing for all
* queries that the backend supports.
*
* If no index exists, the query engine tries to take advantage of the target
* document mapping in the TargetCache. These mappings exists for all queries
* that have been synced with the backend at least once and allow the query
* engine to only read documents that previously matched a query plus any
* documents that were edited after the query was last listened to.
*
* There are some cases when this optimization is not guaranteed to produce
* the same results as full collection scans. In these cases, query
* processing falls back to full scans. These cases are:
*
* - Limit queries where a document that matched the query previously no longer
*   matches the query.
*
* - Limit queries where a document edit may cause the document to sort below
*   another document that is in the local cache.
*
* - Queries that have never been CURRENT or free of limbo documents.
*/
var __PRIVATE_QueryEngine = class {
	constructor() {
		this.Rs = !1, this.As = !1, this.Vs = 100, this.ds = function __PRIVATE_getDefaultRelativeIndexReadCostPerDocument() {
			return isSafari() ? 8 : __PRIVATE_getAndroidVersion(getUA()) > 0 ? 6 : 4;
		}();
	}
	/** Sets the document view to query against. */ initialize(e, t) {
		this.fs = e, this.indexManager = t, this.Rs = !0;
	}
	/** Returns all local documents matching the specified query. */ getDocumentsMatchingQuery(e, t, n, r) {
		const i = { result: null };
		return this.gs(e, t).next(((e) => {
			i.result = e;
		})).next((() => {
			if (!i.result) return this.ps(e, t, r, n).next(((e) => {
				i.result = e;
			}));
		})).next((() => {
			if (i.result) return;
			const n = new QueryContext();
			return this.ys(e, t, n).next(((r) => {
				if (i.result = r, this.As) return this.ws(e, t, n, r.size);
			}));
		})).next((() => i.result));
	}
	ws(e, t, n, r) {
		return n.documentReadCount < this.Vs ? (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "SDK will not create cache indexes for query:", __PRIVATE_stringifyQuery(t), "since it only creates cache indexes for collection contains", "more than or equal to", this.Vs, "documents"), PersistencePromise.resolve()) : (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Query:", __PRIVATE_stringifyQuery(t), "scans", n.documentReadCount, "local documents and returns", r, "documents as results."), n.documentReadCount > this.ds * r ? (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "The SDK decides to create cache indexes for query:", __PRIVATE_stringifyQuery(t), "as using cache indexes may help improve performance."), this.indexManager.createTargetIndexes(e, __PRIVATE_queryToTarget(t))) : PersistencePromise.resolve());
	}
	/**
	* Performs an indexed query that evaluates the query based on a collection's
	* persisted index values. Returns `null` if an index is not available.
	*/ gs(e, t) {
		if (__PRIVATE_queryMatchesAllDocuments(t)) return PersistencePromise.resolve(null);
		let n = __PRIVATE_queryToTarget(t);
		return this.indexManager.getIndexType(e, n).next(((r) => 0 === r ? null : (null !== t.limit && 1 === r && (t = __PRIVATE_queryWithLimit(t, null, "F"), n = __PRIVATE_queryToTarget(t)), this.indexManager.getDocumentsMatchingTarget(e, n).next(((r) => {
			const i = __PRIVATE_documentKeySet(...r);
			return this.fs.getDocuments(e, i).next(((r) => this.indexManager.getMinOffset(e, n).next(((n) => {
				const s = this.Ss(t, r);
				return this.bs(t, s, i, n.readTime) ? this.gs(e, __PRIVATE_queryWithLimit(t, null, "F")) : this.Ds(e, s, t, n);
			}))));
		})))));
	}
	/**
	* Performs a query based on the target's persisted query mapping. Returns
	* `null` if the mapping is not available or cannot be used.
	*/ ps(e, t, n, r) {
		return __PRIVATE_queryMatchesAllDocuments(t) || r.isEqual(SnapshotVersion.min()) ? PersistencePromise.resolve(null) : this.fs.getDocuments(e, n).next(((i) => {
			const s = this.Ss(t, i);
			return this.bs(t, s, n, r) ? PersistencePromise.resolve(null) : (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Re-using previous result from %s to execute query: %s", r.toString(), __PRIVATE_stringifyQuery(t)), this.Ds(e, s, t, __PRIVATE_newIndexOffsetSuccessorFromReadTime(r, N)).next(((e) => e)));
		}));
	}
	/** Applies the query filter and sorting to the provided documents.  */ Ss(e, t) {
		let n = new SortedSet(__PRIVATE_newQueryComparator(e));
		return t.forEach(((t, r) => {
			__PRIVATE_queryMatches(e, r) && (n = n.add(r));
		})), n;
	}
	/**
	* Determines if a limit query needs to be refilled from cache, making it
	* ineligible for index-free execution.
	*
	* @param query - The query.
	* @param sortedPreviousResults - The documents that matched the query when it
	* was last synchronized, sorted by the query's comparator.
	* @param remoteKeys - The document keys that matched the query at the last
	* snapshot.
	* @param limboFreeSnapshotVersion - The version of the snapshot when the
	* query was last synchronized.
	*/ bs(e, t, n, r) {
		if (null === e.limit) return !1;
		if (n.size !== t.size) return !0;
		const i = "F" === e.limitType ? t.last() : t.first();
		return !!i && (i.hasPendingWrites || i.version.compareTo(r) > 0);
	}
	ys(e, t, n) {
		return __PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Using full collection scan to execute query:", __PRIVATE_stringifyQuery(t)), this.fs.getDocumentsMatchingQuery(e, t, IndexOffset.min(), n);
	}
	/**
	* Combines the results from an indexed execution with the remaining documents
	* that have not yet been indexed.
	*/ Ds(e, t, n, r) {
		return this.fs.getDocumentsMatchingQuery(e, n, r).next(((e) => (t.forEach(((t) => {
			e = e.insert(t.key, t);
		})), e)));
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var Nt = "LocalStore", Bt = 3e8;
/**
* The maximum time to leave a resume token buffered without writing it out.
* This value is arbitrary: it's long enough to avoid several writes
* (possibly indefinitely if updates come more frequently than this) but
* short enough that restarting after crashing will still have a pretty
* recent resume token.
*/
/**
* Implements `LocalStore` interface.
*
* Note: some field defined in this class might have public access level, but
* the class is not exported so they are only accessible from this module.
* This is useful to implement optional features (like bundles) in free
* functions, such that they are tree-shakeable.
*/
var __PRIVATE_LocalStoreImpl = class {
	constructor(e, t, n, r) {
		this.persistence = e, this.Cs = t, this.serializer = r, this.vs = new SortedMap(__PRIVATE_primitiveComparator), this.Fs = new ObjectMap(((e) => __PRIVATE_canonifyTarget(e)), __PRIVATE_targetEquals), this.Ms = /* @__PURE__ */ new Map(), this.xs = e.getRemoteDocumentCache(), this.li = e.getTargetCache(), this.Pi = e.getBundleCache(), this.Os(n);
	}
	Os(e) {
		this.documentOverlayCache = this.persistence.getDocumentOverlayCache(e), this.indexManager = this.persistence.getIndexManager(e), this.mutationQueue = this.persistence.getMutationQueue(e, this.indexManager), this.localDocuments = new LocalDocumentsView(this.xs, this.mutationQueue, this.documentOverlayCache, this.indexManager), this.xs.setIndexManager(this.indexManager), this.Cs.initialize(this.localDocuments, this.indexManager);
	}
	collectGarbage(e) {
		return this.persistence.runTransaction("Collect garbage", "readwrite-primary", ((t) => e.collect(t, this.vs)));
	}
};
function __PRIVATE_newLocalStore(e, t, n, r) {
	return new __PRIVATE_LocalStoreImpl(e, t, n, r);
}
/**
* Tells the LocalStore that the currently authenticated user has changed.
*
* In response the local store switches the mutation queue to the new user and
* returns any resulting document changes.
*/
async function __PRIVATE_localStoreHandleUserChange(e, t) {
	const n = __PRIVATE_debugCast(e);
	return await n.persistence.runTransaction("Handle user change", "readonly", ((e) => {
		let r;
		return n.mutationQueue.getAllMutationBatches(e).next(((i) => (r = i, n.Os(t), n.mutationQueue.getAllMutationBatches(e)))).next(((t) => {
			const i = [], s = [];
			let o = __PRIVATE_documentKeySet();
			for (const e of r) {
				i.push(e.batchId);
				for (const t of e.mutations) o = o.add(t.key);
			}
			for (const e of t) {
				s.push(e.batchId);
				for (const t of e.mutations) o = o.add(t.key);
			}
			return n.localDocuments.getDocuments(e, o).next(((e) => ({
				Ns: e,
				removedBatchIds: i,
				addedBatchIds: s
			})));
		}));
	}));
}
/**
* Acknowledges the given batch.
*
* On the happy path when a batch is acknowledged, the local store will
*
*  + remove the batch from the mutation queue;
*  + apply the changes to the remote document cache;
*  + recalculate the latency compensated view implied by those changes (there
*    may be mutations in the queue that affect the documents but haven't been
*    acknowledged yet); and
*  + give the changed documents back the sync engine
*
* @returns The resulting (modified) documents.
*/
function __PRIVATE_localStoreAcknowledgeBatch(e, t) {
	const n = __PRIVATE_debugCast(e);
	return n.persistence.runTransaction("Acknowledge batch", "readwrite-primary", ((e) => {
		const r = t.batch.keys(), i = n.xs.newChangeBuffer({ trackRemovals: !0 });
		return function __PRIVATE_applyWriteToRemoteDocuments(e, t, n, r) {
			const i = n.batch, s = i.keys();
			let o = PersistencePromise.resolve();
			return s.forEach(((e) => {
				o = o.next((() => r.getEntry(t, e))).next(((t) => {
					const s = n.docVersions.get(e);
					__PRIVATE_hardAssert(null !== s, 48541), t.version.compareTo(s) < 0 && (i.applyToRemoteDocument(t, n), t.isValidDocument() && (t.setReadTime(n.commitVersion), r.addEntry(t)));
				}));
			})), o.next((() => e.mutationQueue.removeMutationBatch(t, i)));
		}(n, e, t, i).next((() => i.apply(e))).next((() => n.mutationQueue.performConsistencyCheck(e))).next((() => n.documentOverlayCache.removeOverlaysForBatchId(e, r, t.batch.batchId))).next((() => n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e, function __PRIVATE_getKeysWithTransformResults(e) {
			let t = __PRIVATE_documentKeySet();
			for (let n = 0; n < e.mutationResults.length; ++n) e.mutationResults[n].transformResults.length > 0 && (t = t.add(e.batch.mutations[n].key));
			return t;
		}(t)))).next((() => n.localDocuments.getDocuments(e, r)));
	}));
}
/**
* Returns the last consistent snapshot processed (used by the RemoteStore to
* determine whether to buffer incoming snapshots from the backend).
*/
function __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e) {
	const t = __PRIVATE_debugCast(e);
	return t.persistence.runTransaction("Get last remote snapshot version", "readonly", ((e) => t.li.getLastRemoteSnapshotVersion(e)));
}
/**
* Updates the "ground-state" (remote) documents. We assume that the remote
* event reflects any write batches that have been acknowledged or rejected
* (i.e. we do not re-apply local mutations to updates from this event).
*
* LocalDocuments are re-calculated if there are remaining mutations in the
* queue.
*/ function __PRIVATE_localStoreApplyRemoteEventToLocalCache(e, t) {
	const n = __PRIVATE_debugCast(e), r = t.snapshotVersion;
	let i = n.vs;
	return n.persistence.runTransaction("Apply remote event", "readwrite-primary", ((e) => {
		const s = n.xs.newChangeBuffer({ trackRemovals: !0 });
		i = n.vs;
		const o = [];
		t.targetChanges.forEach(((s, _) => {
			const a = i.get(_);
			if (!a) return;
			o.push(n.li.removeMatchingKeys(e, s.removedDocuments, _).next((() => n.li.addMatchingKeys(e, s.addedDocuments, _))));
			let u = a.withSequenceNumber(e.currentSequenceNumber);
			null !== t.targetMismatches.get(_) ? u = u.withResumeToken(ByteString.EMPTY_BYTE_STRING, SnapshotVersion.min()).withLastLimboFreeSnapshotVersion(SnapshotVersion.min()) : s.resumeToken.approximateByteSize() > 0 && (u = u.withResumeToken(s.resumeToken, r)), i = i.insert(_, u), function __PRIVATE_shouldPersistTargetData(e, t, n) {
				if (0 === e.resumeToken.approximateByteSize()) return !0;
				if (t.snapshotVersion.toMicroseconds() - e.snapshotVersion.toMicroseconds() >= Bt) return !0;
				return n.addedDocuments.size + n.modifiedDocuments.size + n.removedDocuments.size > 0;
			}(a, u, s) && o.push(n.li.updateTargetData(e, u));
		}));
		let _ = __PRIVATE_mutableDocumentMap(), a = __PRIVATE_documentKeySet();
		if (t.documentUpdates.forEach(((r) => {
			t.resolvedLimboDocuments.has(r) && o.push(n.persistence.referenceDelegate.updateLimboDocument(e, r));
		})), o.push(__PRIVATE_populateDocumentChangeBuffer(e, s, t.documentUpdates).next(((e) => {
			_ = e.Bs, a = e.Ls;
		}))), !r.isEqual(SnapshotVersion.min())) {
			const t = n.li.getLastRemoteSnapshotVersion(e).next(((t) => n.li.setTargetsMetadata(e, e.currentSequenceNumber, r)));
			o.push(t);
		}
		return PersistencePromise.waitFor(o).next((() => s.apply(e))).next((() => n.localDocuments.getLocalViewOfDocuments(e, _, a))).next((() => _));
	})).then(((e) => (n.vs = i, e)));
}
/**
* Populates document change buffer with documents from backend or a bundle.
* Returns the document changes resulting from applying those documents, and
* also a set of documents whose existence state are changed as a result.
*
* @param txn - Transaction to use to read existing documents from storage.
* @param documentBuffer - Document buffer to collect the resulted changes to be
*        applied to storage.
* @param documents - Documents to be applied.
*/ function __PRIVATE_populateDocumentChangeBuffer(e, t, n) {
	let r = __PRIVATE_documentKeySet(), i = __PRIVATE_documentKeySet();
	return n.forEach(((e) => r = r.add(e))), t.getEntries(e, r).next(((e) => {
		let r = __PRIVATE_mutableDocumentMap();
		return n.forEach(((n, s) => {
			const o = e.get(n);
			s.isFoundDocument() !== o.isFoundDocument() && (i = i.add(n)), s.isNoDocument() && s.version.isEqual(SnapshotVersion.min()) ? (t.removeEntry(n, s.readTime), r = r.insert(n, s)) : !o.isValidDocument() || s.version.compareTo(o.version) > 0 || 0 === s.version.compareTo(o.version) && o.hasPendingWrites ? (t.addEntry(s), r = r.insert(n, s)) : __PRIVATE_logDebug(Nt, "Ignoring outdated watch update for ", n, ". Current version:", o.version, " Watch version:", s.version);
		})), {
			Bs: r,
			Ls: i
		};
	}));
}
/**
* Gets the mutation batch after the passed in batchId in the mutation queue
* or null if empty.
* @param afterBatchId - If provided, the batch to search after.
* @returns The next mutation or null if there wasn't one.
*/
function __PRIVATE_localStoreGetNextMutationBatch(e, t) {
	const n = __PRIVATE_debugCast(e);
	return n.persistence.runTransaction("Get next mutation batch", "readonly", ((e) => (void 0 === t && (t = q), n.mutationQueue.getNextMutationBatchAfterBatchId(e, t))));
}
/**
* Reads the current value of a Document with a given key or null if not
* found - used for testing.
*/
/**
* Assigns the given target an internal ID so that its results can be pinned so
* they don't get GC'd. A target must be allocated in the local store before
* the store can be used to manage its view.
*
* Allocating an already allocated `Target` will return the existing `TargetData`
* for that `Target`.
*/
function __PRIVATE_localStoreAllocateTarget(e, t) {
	const n = __PRIVATE_debugCast(e);
	return n.persistence.runTransaction("Allocate target", "readwrite", ((e) => {
		let r;
		return n.li.getTargetData(e, t).next(((i) => i ? (r = i, PersistencePromise.resolve(r)) : n.li.allocateTargetId(e).next(((i) => (r = new TargetData(t, i, "TargetPurposeListen", e.currentSequenceNumber), n.li.addTargetData(e, r).next((() => r)))))));
	})).then(((e) => {
		const r = n.vs.get(e.targetId);
		return (null === r || e.snapshotVersion.compareTo(r.snapshotVersion) > 0) && (n.vs = n.vs.insert(e.targetId, e), n.Fs.set(t, e.targetId)), e;
	}));
}
/**
* Returns the TargetData as seen by the LocalStore, including updates that may
* have not yet been persisted to the TargetCache.
*/
/**
* Unpins all the documents associated with the given target. If
* `keepPersistedTargetData` is set to false and Eager GC enabled, the method
* directly removes the associated target data from the target cache.
*
* Releasing a non-existing `Target` is a no-op.
*/
async function __PRIVATE_localStoreReleaseTarget(e, t, n) {
	const r = __PRIVATE_debugCast(e), i = r.vs.get(t), s = n ? "readwrite" : "readwrite-primary";
	try {
		n || await r.persistence.runTransaction("Release target", s, ((e) => r.persistence.referenceDelegate.removeTarget(e, i)));
	} catch (e) {
		if (!__PRIVATE_isIndexedDbTransactionError(e)) throw e;
		__PRIVATE_logDebug(Nt, `Failed to update sequence numbers for target ${t}: ${e}`);
	}
	r.vs = r.vs.remove(t), r.Fs.delete(i.target);
}
/**
* Runs the specified query against the local store and returns the results,
* potentially taking advantage of query data from previous executions (such
* as the set of remote keys).
*
* @param usePreviousResults - Whether results from previous executions can
* be used to optimize this query execution.
*/ function __PRIVATE_localStoreExecuteQuery(e, t, n) {
	const r = __PRIVATE_debugCast(e);
	let i = SnapshotVersion.min(), s = __PRIVATE_documentKeySet();
	return r.persistence.runTransaction("Execute query", "readwrite", ((e) => function __PRIVATE_localStoreGetTargetData(e, t, n) {
		const r = __PRIVATE_debugCast(e), i = r.Fs.get(n);
		return void 0 !== i ? PersistencePromise.resolve(r.vs.get(i)) : r.li.getTargetData(t, n);
	}(r, e, __PRIVATE_queryToTarget(t)).next(((t) => {
		if (t) return i = t.lastLimboFreeSnapshotVersion, r.li.getMatchingKeysForTargetId(e, t.targetId).next(((e) => {
			s = e;
		}));
	})).next((() => r.Cs.getDocumentsMatchingQuery(e, t, n ? i : SnapshotVersion.min(), n ? s : __PRIVATE_documentKeySet()))).next(((e) => (__PRIVATE_setMaxReadTime(r, __PRIVATE_queryCollectionGroup(t), e), {
		documents: e,
		ks: s
	})))));
}
/** Sets the collection group's maximum read time from the given documents. */
function __PRIVATE_setMaxReadTime(e, t, n) {
	let r = e.Ms.get(t) || SnapshotVersion.min();
	n.forEach(((e, t) => {
		t.readTime.compareTo(r) > 0 && (r = t.readTime);
	})), e.Ms.set(t, r);
}
/**
* Metadata state of the local client. Unlike `RemoteClientState`, this class is
* mutable and keeps track of all pending mutations, which allows us to
* update the range of pending mutation batch IDs as new mutations are added or
* removed.
*
* The data in `LocalClientState` is not read from WebStorage and instead
* updated via its instance methods. The updated state can be serialized via
* `toWebStorageJSON()`.
*/
var __PRIVATE_LocalClientState = class {
	constructor() {
		this.activeTargetIds = __PRIVATE_targetIdSet();
	}
	Qs(e) {
		this.activeTargetIds = this.activeTargetIds.add(e);
	}
	Gs(e) {
		this.activeTargetIds = this.activeTargetIds.delete(e);
	}
	/**
	* Converts this entry into a JSON-encoded format we can use for WebStorage.
	* Does not encode `clientId` as it is part of the key in WebStorage.
	*/ Ws() {
		const e = {
			activeTargetIds: this.activeTargetIds.toArray(),
			updateTimeMs: Date.now()
		};
		return JSON.stringify(e);
	}
};
var __PRIVATE_MemorySharedClientState = class {
	constructor() {
		this.vo = new __PRIVATE_LocalClientState(), this.Fo = {}, this.onlineStateHandler = null, this.sequenceNumberHandler = null;
	}
	addPendingMutation(e) {}
	updateMutationState(e, t, n) {}
	addLocalQueryTarget(e, t = !0) {
		return t && this.vo.Qs(e), this.Fo[e] || "not-current";
	}
	updateQueryState(e, t, n) {
		this.Fo[e] = t;
	}
	removeLocalQueryTarget(e) {
		this.vo.Gs(e);
	}
	isLocalQueryTarget(e) {
		return this.vo.activeTargetIds.has(e);
	}
	clearQueryState(e) {
		delete this.Fo[e];
	}
	getAllActiveQueryTargets() {
		return this.vo.activeTargetIds;
	}
	isActiveQueryTarget(e) {
		return this.vo.activeTargetIds.has(e);
	}
	start() {
		return this.vo = new __PRIVATE_LocalClientState(), Promise.resolve();
	}
	handleUserChange(e, t, n) {}
	setOnlineState(e) {}
	shutdown() {}
	writeSequenceNumber(e) {}
	notifyBundleLoaded(e) {}
};
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var __PRIVATE_NoopConnectivityMonitor = class {
	Mo(e) {}
	shutdown() {}
};
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Ut$1 = "ConnectivityMonitor";
/**
* Browser implementation of ConnectivityMonitor.
*/ var __PRIVATE_BrowserConnectivityMonitor = class {
	constructor() {
		this.xo = () => this.Oo(), this.No = () => this.Bo(), this.Lo = [], this.ko();
	}
	Mo(e) {
		this.Lo.push(e);
	}
	shutdown() {
		window.removeEventListener("online", this.xo), window.removeEventListener("offline", this.No);
	}
	ko() {
		window.addEventListener("online", this.xo), window.addEventListener("offline", this.No);
	}
	Oo() {
		__PRIVATE_logDebug(Ut$1, "Network connectivity changed: AVAILABLE");
		for (const e of this.Lo) e(0);
	}
	Bo() {
		__PRIVATE_logDebug(Ut$1, "Network connectivity changed: UNAVAILABLE");
		for (const e of this.Lo) e(1);
	}
	/** Checks that all used attributes of window are available. */
	static v() {
		return "undefined" != typeof window && void 0 !== window.addEventListener && void 0 !== window.removeEventListener;
	}
};
/**
* @license
* Copyright 2023 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* The value returned from the most recent invocation of
* `generateUniqueDebugId()`, or null if it has never been invoked.
*/ var $t = null;
/**
* Generates and returns an initial value for `lastUniqueDebugId`.
*
* The returned value is randomly selected from a range of integers that are
* represented as 8 hexadecimal digits. This means that (within reason) any
* numbers generated by incrementing the returned number by 1 will also be
* represented by 8 hexadecimal digits. This leads to all "IDs" having the same
* length when converted to a hexadecimal string, making reading logs containing
* these IDs easier to follow. And since the return value is randomly selected
* it will help to differentiate between logs from different executions.
*/
/**
* Generates and returns a unique ID as a hexadecimal string.
*
* The returned ID is intended to be used in debug logging messages to help
* correlate log messages that may be spatially separated in the logs, but
* logically related. For example, a network connection could include the same
* "debug ID" string in all of its log messages to help trace a specific
* connection over time.
*
* @returns the 10-character generated ID (e.g. "0xa1b2c3d4").
*/
function __PRIVATE_generateUniqueDebugId() {
	return null === $t ? $t = function __PRIVATE_generateInitialUniqueDebugId() {
		return 268435456 + Math.round(2147483648 * Math.random());
	}() : $t++, "0x" + $t.toString(16);
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var Wt = "RestConnection", Qt = {
	BatchGetDocuments: "batchGet",
	Commit: "commit",
	RunQuery: "runQuery",
	RunAggregationQuery: "runAggregationQuery",
	ExecutePipeline: "executePipeline"
};
/**
* Maps RPC names to the corresponding REST endpoint name.
*
* We use array notation to avoid mangling.
*/
/**
* Base class for all Rest-based connections to the backend (WebChannel and
* HTTP).
*/
var __PRIVATE_RestConnection = class {
	get qo() {
		return !1;
	}
	constructor(e) {
		this.databaseInfo = e, this.databaseId = e.databaseId;
		const t = e.ssl ? "https" : "http", n = encodeURIComponent(this.databaseId.projectId), r = encodeURIComponent(this.databaseId.database);
		this.Ko = t + "://" + e.host, this.Uo = `projects/${n}/databases/${r}`, this.$o = this.databaseId.database === it ? `project_id=${n}` : `project_id=${n}&database_id=${r}`;
	}
	Wo(e, t, n, r, i) {
		const s = __PRIVATE_generateUniqueDebugId(), o = this.Qo(e, t.toUriEncodedString());
		__PRIVATE_logDebug(Wt, `Sending RPC '${e}' ${s}:`, o, n);
		const _ = {
			"google-cloud-resource-prefix": this.Uo,
			"x-goog-request-params": this.$o
		};
		this.Go(_, r, i);
		const { host: a } = new URL(o), c = isCloudWorkstation(a);
		return this.zo(e, o, _, n, c).then(((t) => (__PRIVATE_logDebug(Wt, `Received RPC '${e}' ${s}: `, t), t)), ((t) => {
			throw __PRIVATE_logWarn(Wt, `RPC '${e}' ${s} failed with error: `, t, "url: ", o, "request:", n), t;
		}));
	}
	jo(e, t, n, r, i, s) {
		return this.Wo(e, t, n, r, i);
	}
	/**
	* Modifies the headers for a request, adding any authorization token if
	* present and any additional headers for the request.
	*/ Go(e, t, n) {
		e["X-Goog-Api-Client"] = function __PRIVATE_getGoogApiClientValue() {
			return "gl-js/ fire/" + b;
		}(), e["Content-Type"] = "text/plain", this.databaseInfo.appId && (e["X-Firebase-GMPID"] = this.databaseInfo.appId), t && t.headers.forEach(((t, n) => e[n] = t)), n && n.headers.forEach(((t, n) => e[n] = t));
	}
	Qo(e, t) {
		const n = Qt[e];
		let r = `${this.Ko}/v1/${t}:${n}`;
		return this.databaseInfo.apiKey && (r = `${r}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`), r;
	}
	/**
	* Closes and cleans up any resources associated with the connection. This
	* implementation is a no-op because there are no resources associated
	* with the RestConnection that need to be cleaned up.
	*/ terminate() {}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Provides a simple helper class that implements the Stream interface to
* bridge to other implementations that are streams but do not implement the
* interface. The stream callbacks are invoked with the callOn... methods.
*/ var __PRIVATE_StreamBridge = class {
	constructor(e) {
		this.Jo = e.Jo, this.Ho = e.Ho;
	}
	Zo(e) {
		this.Xo = e;
	}
	Yo(e) {
		this.e_ = e;
	}
	t_(e) {
		this.n_ = e;
	}
	onMessage(e) {
		this.r_ = e;
	}
	close() {
		this.Ho();
	}
	send(e) {
		this.Jo(e);
	}
	i_() {
		this.Xo();
	}
	s_() {
		this.e_();
	}
	o_(e) {
		this.n_(e);
	}
	__(e) {
		this.r_(e);
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var Gt = "WebChannelConnection", __PRIVATE_unguardedEventListen = (e, t, n) => {
	e.listen(t, ((e) => {
		try {
			n(e);
		} catch (e) {
			setTimeout((() => {
				throw e;
			}), 0);
		}
	}));
};
var __PRIVATE_WebChannelConnection = class __PRIVATE_WebChannelConnection extends __PRIVATE_RestConnection {
	constructor(e) {
		super(e), this.a_ = [], this.forceLongPolling = e.forceLongPolling, this.autoDetectLongPolling = e.autoDetectLongPolling, this.useFetchStreams = e.useFetchStreams, this.longPollingOptions = e.longPollingOptions;
	}
	/**
	* Initialize STAT_EVENT listener once. Subsequent calls are a no-op.
	* getStatEventTarget() returns the same target every time.
	*/ static u_() {
		if (!__PRIVATE_WebChannelConnection.c_) __PRIVATE_unguardedEventListen(getStatEventTarget(), Event.STAT_EVENT, ((e) => {
			e.stat === Stat.PROXY ? __PRIVATE_logDebug(Gt, "STAT_EVENT: detected buffering proxy") : e.stat === Stat.NOPROXY && __PRIVATE_logDebug(Gt, "STAT_EVENT: detected no buffering proxy");
		})), __PRIVATE_WebChannelConnection.c_ = !0;
	}
	zo(e, t, n, r, i) {
		const s = __PRIVATE_generateUniqueDebugId();
		return new Promise(((i, o) => {
			const _ = new XhrIo();
			_.setWithCredentials(!0), _.listenOnce(EventType.COMPLETE, (() => {
				try {
					switch (_.getLastErrorCode()) {
						case ErrorCode.NO_ERROR:
							const t = _.getResponseJson();
							__PRIVATE_logDebug(Gt, `XHR for RPC '${e}' ${s} received:`, JSON.stringify(t)), i(t);
							break;
						case ErrorCode.TIMEOUT:
							__PRIVATE_logDebug(Gt, `RPC '${e}' ${s} timed out`), o(new FirestoreError(D.DEADLINE_EXCEEDED, "Request time out"));
							break;
						case ErrorCode.HTTP_ERROR:
							const n = _.getStatus();
							if (__PRIVATE_logDebug(Gt, `RPC '${e}' ${s} failed with status:`, n, "response text:", _.getResponseText()), n > 0) {
								let e = _.getResponseJson();
								Array.isArray(e) && (e = e[0]);
								const t = e?.error;
								if (t && t.status && t.message) o(new FirestoreError(function __PRIVATE_mapCodeFromHttpResponseErrorStatus(e) {
									const t = e.toLowerCase().replace(/_/g, "-");
									return Object.values(D).indexOf(t) >= 0 ? t : D.UNKNOWN;
								}(t.status), t.message));
								else o(new FirestoreError(D.UNKNOWN, "Server responded with status " + _.getStatus()));
							} else o(new FirestoreError(D.UNAVAILABLE, "Connection failed."));
							break;
						default: fail(9055, {
							l_: e,
							streamId: s,
							h_: _.getLastErrorCode(),
							P_: _.getLastError()
						});
					}
				} finally {
					__PRIVATE_logDebug(Gt, `RPC '${e}' ${s} completed.`);
				}
			}));
			const a = JSON.stringify(r);
			__PRIVATE_logDebug(Gt, `RPC '${e}' ${s} sending request:`, r), _.send(t, "POST", a, n, 15);
		}));
	}
	T_(e, t, n) {
		const r = __PRIVATE_generateUniqueDebugId(), i = [
			this.Ko,
			"/",
			"google.firestore.v1.Firestore",
			"/",
			e,
			"/channel"
		], s = this.createWebChannelTransport(), o = {
			httpSessionIdParam: "gsessionid",
			initMessageHeaders: {},
			messageUrlParams: { database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}` },
			sendRawJson: !0,
			supportsCrossDomainXhr: !0,
			internalChannelParams: { forwardChannelRequestTimeoutMs: 6e5 },
			forceLongPolling: this.forceLongPolling,
			detectBufferingProxy: this.autoDetectLongPolling
		}, _ = this.longPollingOptions.timeoutSeconds;
		void 0 !== _ && (o.longPollingTimeout = Math.round(1e3 * _)), this.useFetchStreams && (o.useFetchStreams = !0), this.Go(o.initMessageHeaders, t, n), o.encodeInitMessageHeaders = !0;
		const a = i.join("");
		__PRIVATE_logDebug(Gt, `Creating RPC '${e}' stream ${r}: ${a}`, o);
		const u = s.createWebChannel(a, o);
		this.E_(u);
		let c = !1, l = !1;
		const h = new __PRIVATE_StreamBridge({
			Jo: (t) => {
				l ? __PRIVATE_logDebug(Gt, `Not sending because RPC '${e}' stream ${r} is closed:`, t) : (c || (__PRIVATE_logDebug(Gt, `Opening RPC '${e}' stream ${r} transport.`), u.open(), c = !0), __PRIVATE_logDebug(Gt, `RPC '${e}' stream ${r} sending:`, t), u.send(t));
			},
			Ho: () => u.close()
		});
		return __PRIVATE_unguardedEventListen(u, WebChannel.EventType.OPEN, (() => {
			l || (__PRIVATE_logDebug(Gt, `RPC '${e}' stream ${r} transport opened.`), h.i_());
		})), __PRIVATE_unguardedEventListen(u, WebChannel.EventType.CLOSE, (() => {
			l || (l = !0, __PRIVATE_logDebug(Gt, `RPC '${e}' stream ${r} transport closed`), h.o_(), this.I_(u));
		})), __PRIVATE_unguardedEventListen(u, WebChannel.EventType.ERROR, ((t) => {
			l || (l = !0, __PRIVATE_logWarn(Gt, `RPC '${e}' stream ${r} transport errored. Name:`, t.name, "Message:", t.message), h.o_(new FirestoreError(D.UNAVAILABLE, "The operation could not be completed")));
		})), __PRIVATE_unguardedEventListen(u, WebChannel.EventType.MESSAGE, ((t) => {
			if (!l) {
				const n = t.data[0];
				__PRIVATE_hardAssert(!!n, 16349);
				const i = n, s = i?.error || i[0]?.error;
				if (s) {
					__PRIVATE_logDebug(Gt, `RPC '${e}' stream ${r} received error:`, s);
					const t = s.status;
					let n = function __PRIVATE_mapCodeFromRpcStatus(e) {
						const t = Rt[e];
						if (void 0 !== t) return __PRIVATE_mapCodeFromRpcCode(t);
					}(t), i = s.message;
					"NOT_FOUND" === t && i.includes("database") && i.includes("does not exist") && i.includes(this.databaseId.database) && __PRIVATE_logWarn(`Database '${this.databaseId.database}' not found. Please check your project configuration.`), void 0 === n && (n = D.INTERNAL, i = "Unknown error status: " + t + " with message " + s.message), l = !0, h.o_(new FirestoreError(n, i)), u.close();
				} else __PRIVATE_logDebug(Gt, `RPC '${e}' stream ${r} received:`, n), h.__(n);
			}
		})), __PRIVATE_WebChannelConnection.u_(), setTimeout((() => {
			h.s_();
		}), 0), h;
	}
	/**
	* Closes and cleans up any resources associated with the connection.
	*/ terminate() {
		this.a_.forEach(((e) => e.close())), this.a_ = [];
	}
	/**
	* Add a WebChannel instance to the collection of open instances.
	* @param webChannel
	*/ E_(e) {
		this.a_.push(e);
	}
	/**
	* Remove a WebChannel instance from the collection of open instances.
	* @param webChannel
	*/ I_(e) {
		this.a_ = this.a_.filter(((t) => t === e));
	}
	/**
	* Modifies the headers for a request, adding the api key if present,
	* and then calling super.modifyHeadersForRequest
	*/ Go(e, t, n) {
		super.Go(e, t, n), this.databaseInfo.apiKey && (e["x-goog-api-key"] = this.databaseInfo.apiKey);
	}
	/**
	* Wrapped for mocking.
	* @protected
	*/ createWebChannelTransport() {
		return createWebChannelTransport();
	}
};
/**
* Track if the STAT_EVENT listener has been initialized.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/** Initializes the WebChannelConnection for the browser. */
function __PRIVATE_newConnection(e) {
	return new __PRIVATE_WebChannelConnection(e);
}
/** The Platform's 'document' implementation or null if not available. */ function getDocument() {
	return "undefined" != typeof document ? document : null;
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ function __PRIVATE_newSerializer(e) {
	return new JsonProtoSerializer(e, !0);
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ __PRIVATE_WebChannelConnection.c_ = !1;
/**
* A helper for running delayed tasks following an exponential backoff curve
* between attempts.
*
* Each delay is made up of a "base" delay which follows the exponential
* backoff curve, and a +/- 50% "jitter" that is calculated and added to the
* base delay. This prevents clients from accidentally synchronizing their
* delays causing spikes of load to the backend.
*/
var __PRIVATE_ExponentialBackoff = class {
	constructor(e, t, n = 1e3, r = 1.5, i = 6e4) {
		this.Ci = e, this.timerId = t, this.R_ = n, this.A_ = r, this.V_ = i, this.d_ = 0, this.m_ = null, this.f_ = Date.now(), this.reset();
	}
	/**
	* Resets the backoff delay.
	*
	* The very next backoffAndWait() will have no delay. If it is called again
	* (i.e. due to an error), initialDelayMs (plus jitter) will be used, and
	* subsequent ones will increase according to the backoffFactor.
	*/ reset() {
		this.d_ = 0;
	}
	/**
	* Resets the backoff delay to the maximum delay (e.g. for use after a
	* RESOURCE_EXHAUSTED error).
	*/ g_() {
		this.d_ = this.V_;
	}
	/**
	* Returns a promise that resolves after currentDelayMs, and increases the
	* delay for any subsequent attempts. If there was a pending backoff operation
	* already, it will be canceled.
	*/ p_(e) {
		this.cancel();
		const t = Math.floor(this.d_ + this.y_()), n = Math.max(0, Date.now() - this.f_), r = Math.max(0, t - n);
		r > 0 && __PRIVATE_logDebug("ExponentialBackoff", `Backing off for ${r} ms (base delay: ${this.d_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`), this.m_ = this.Ci.enqueueAfterDelay(this.timerId, r, (() => (this.f_ = Date.now(), e()))), this.d_ *= this.A_, this.d_ < this.R_ && (this.d_ = this.R_), this.d_ > this.V_ && (this.d_ = this.V_);
	}
	w_() {
		null !== this.m_ && (this.m_.skipDelay(), this.m_ = null);
	}
	cancel() {
		null !== this.m_ && (this.m_.cancel(), this.m_ = null);
	}
	/** Returns a random value in the range [-currentBaseMs/2, currentBaseMs/2] */ y_() {
		return (Math.random() - .5) * this.d_;
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var zt = "PersistentStream";
/** The time a stream stays open after it is marked idle. */
/**
* A PersistentStream is an abstract base class that represents a streaming RPC
* to the Firestore backend. It's built on top of the connections own support
* for streaming RPCs, and adds several critical features for our clients:
*
*   - Exponential backoff on failure
*   - Authentication via CredentialsProvider
*   - Dispatching all callbacks into the shared worker queue
*   - Closing idle streams after 60 seconds of inactivity
*
* Subclasses of PersistentStream implement serialization of models to and
* from the JSON representation of the protocol buffers for a specific
* streaming RPC.
*
* ## Starting and Stopping
*
* Streaming RPCs are stateful and need to be start()ed before messages can
* be sent and received. The PersistentStream will call the onOpen() function
* of the listener once the stream is ready to accept requests.
*
* Should a start() fail, PersistentStream will call the registered onClose()
* listener with a FirestoreError indicating what went wrong.
*
* A PersistentStream can be started and stopped repeatedly.
*
* Generic types:
*  SendType: The type of the outgoing message of the underlying
*    connection stream
*  ReceiveType: The type of the incoming message of the underlying
*    connection stream
*  ListenerType: The type of the listener that will be used for callbacks
*/
var __PRIVATE_PersistentStream = class {
	constructor(e, t, n, r, i, s, o, _) {
		this.Ci = e, this.S_ = n, this.b_ = r, this.connection = i, this.authCredentialsProvider = s, this.appCheckCredentialsProvider = o, this.listener = _, this.state = 0, this.D_ = 0, this.C_ = null, this.v_ = null, this.stream = null, this.F_ = 0, this.M_ = new __PRIVATE_ExponentialBackoff(e, t);
	}
	/**
	* Returns true if start() has been called and no error has occurred. True
	* indicates the stream is open or in the process of opening (which
	* encompasses respecting backoff, getting auth tokens, and starting the
	* actual RPC). Use isOpen() to determine if the stream is open and ready for
	* outbound requests.
	*/ x_() {
		return 1 === this.state || 5 === this.state || this.O_();
	}
	/**
	* Returns true if the underlying RPC is open (the onOpen() listener has been
	* called) and the stream is ready for outbound requests.
	*/ O_() {
		return 2 === this.state || 3 === this.state;
	}
	/**
	* Starts the RPC. Only allowed if isStarted() returns false. The stream is
	* not immediately ready for use: onOpen() will be invoked when the RPC is
	* ready for outbound requests, at which point isOpen() will return true.
	*
	* When start returns, isStarted() will return true.
	*/ start() {
		this.F_ = 0, 4 !== this.state ? this.auth() : this.N_();
	}
	/**
	* Stops the RPC. This call is idempotent and allowed regardless of the
	* current isStarted() state.
	*
	* When stop returns, isStarted() and isOpen() will both return false.
	*/ async stop() {
		this.x_() && await this.close(0);
	}
	/**
	* After an error the stream will usually back off on the next attempt to
	* start it. If the error warrants an immediate restart of the stream, the
	* sender can use this to indicate that the receiver should not back off.
	*
	* Each error will call the onClose() listener. That function can decide to
	* inhibit backoff if required.
	*/ B_() {
		this.state = 0, this.M_.reset();
	}
	/**
	* Marks this stream as idle. If no further actions are performed on the
	* stream for one minute, the stream will automatically close itself and
	* notify the stream's onClose() handler with Status.OK. The stream will then
	* be in a !isStarted() state, requiring the caller to start the stream again
	* before further use.
	*
	* Only streams that are in state 'Open' can be marked idle, as all other
	* states imply pending network operations.
	*/ L_() {
		this.O_() && null === this.C_ && (this.C_ = this.Ci.enqueueAfterDelay(this.S_, 6e4, (() => this.k_())));
	}
	/** Sends a message to the underlying stream. */ q_(e) {
		this.K_(), this.stream.send(e);
	}
	/** Called by the idle timer when the stream should close due to inactivity. */ async k_() {
		if (this.O_()) return this.close(0);
	}
	/** Marks the stream as active again. */ K_() {
		this.C_ && (this.C_.cancel(), this.C_ = null);
	}
	/** Cancels the health check delayed operation. */ U_() {
		this.v_ && (this.v_.cancel(), this.v_ = null);
	}
	/**
	* Closes the stream and cleans up as necessary:
	*
	* * closes the underlying GRPC stream;
	* * calls the onClose handler with the given 'error';
	* * sets internal stream state to 'finalState';
	* * adjusts the backoff timer based on the error
	*
	* A new stream can be opened by calling start().
	*
	* @param finalState - the intended state of the stream after closing.
	* @param error - the error the connection was closed with.
	*/ async close(e, t) {
		this.K_(), this.U_(), this.M_.cancel(), this.D_++, 4 !== e ? this.M_.reset() : t && t.code === D.RESOURCE_EXHAUSTED ? (__PRIVATE_logError(t.toString()), __PRIVATE_logError("Using maximum backoff delay to prevent overloading the backend."), this.M_.g_()) : t && t.code === D.UNAUTHENTICATED && 3 !== this.state && (this.authCredentialsProvider.invalidateToken(), this.appCheckCredentialsProvider.invalidateToken()), null !== this.stream && (this.W_(), this.stream.close(), this.stream = null), this.state = e, await this.listener.t_(t);
	}
	/**
	* Can be overridden to perform additional cleanup before the stream is closed.
	* Calling super.tearDown() is not required.
	*/ W_() {}
	auth() {
		this.state = 1;
		const e = this.Q_(this.D_), t = this.D_;
		Promise.all([this.authCredentialsProvider.getToken(), this.appCheckCredentialsProvider.getToken()]).then((([e, n]) => {
			this.D_ === t && this.G_(e, n);
		}), ((t) => {
			e((() => {
				const e = new FirestoreError(D.UNKNOWN, "Fetching auth token failed: " + t.message);
				return this.z_(e);
			}));
		}));
	}
	G_(e, t) {
		const n = this.Q_(this.D_);
		this.stream = this.j_(e, t), this.stream.Zo((() => {
			n((() => this.listener.Zo()));
		})), this.stream.Yo((() => {
			n((() => (this.state = 2, this.v_ = this.Ci.enqueueAfterDelay(this.b_, 1e4, (() => (this.O_() && (this.state = 3), Promise.resolve()))), this.listener.Yo())));
		})), this.stream.t_(((e) => {
			n((() => this.z_(e)));
		})), this.stream.onMessage(((e) => {
			n((() => 1 == ++this.F_ ? this.J_(e) : this.onNext(e)));
		}));
	}
	N_() {
		this.state = 5, this.M_.p_((async () => {
			this.state = 0, this.start();
		}));
	}
	z_(e) {
		return __PRIVATE_logDebug(zt, `close with error: ${e}`), this.stream = null, this.close(4, e);
	}
	/**
	* Returns a "dispatcher" function that dispatches operations onto the
	* AsyncQueue but only runs them if closeCount remains unchanged. This allows
	* us to turn auth / stream callbacks into no-ops if the stream is closed /
	* re-opened, etc.
	*/ Q_(e) {
		return (t) => {
			this.Ci.enqueueAndForget((() => this.D_ === e ? t() : (__PRIVATE_logDebug(zt, "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve())));
		};
	}
};
/**
* A PersistentStream that implements the Listen RPC.
*
* Once the Listen stream has called the onOpen() listener, any number of
* listen() and unlisten() calls can be made to control what changes will be
* sent from the server for ListenResponses.
*/ var __PRIVATE_PersistentListenStream = class extends __PRIVATE_PersistentStream {
	constructor(e, t, n, r, i, s) {
		super(e, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", t, n, r, s), this.serializer = i;
	}
	j_(e, t) {
		return this.connection.T_("Listen", e, t);
	}
	J_(e) {
		return this.onNext(e);
	}
	onNext(e) {
		this.M_.reset();
		const t = __PRIVATE_fromWatchChange(this.serializer, e), n = function __PRIVATE_versionFromListenResponse(e) {
			if (!("targetChange" in e)) return SnapshotVersion.min();
			const t = e.targetChange;
			return t.targetIds && t.targetIds.length ? SnapshotVersion.min() : t.readTime ? __PRIVATE_fromVersion(t.readTime) : SnapshotVersion.min();
		}(e);
		return this.listener.H_(t, n);
	}
	/**
	* Registers interest in the results of the given target. If the target
	* includes a resumeToken it will be included in the request. Results that
	* affect the target will be streamed back as WatchChange messages that
	* reference the targetId.
	*/ Z_(e) {
		const t = {};
		t.database = __PRIVATE_getEncodedDatabaseId(this.serializer), t.addTarget = function __PRIVATE_toTarget(e, t) {
			let n;
			const r = t.target;
			if (n = __PRIVATE_targetIsDocumentTarget(r) ? { documents: __PRIVATE_toDocumentsTarget(e, r) } : { query: __PRIVATE_toQueryTarget(e, r).ft }, n.targetId = t.targetId, t.resumeToken.approximateByteSize() > 0) {
				n.resumeToken = __PRIVATE_toBytes(e, t.resumeToken);
				const r = __PRIVATE_toInt32Proto(e, t.expectedCount);
				null !== r && (n.expectedCount = r);
			} else if (t.snapshotVersion.compareTo(SnapshotVersion.min()) > 0) {
				n.readTime = toTimestamp(e, t.snapshotVersion.toTimestamp());
				const r = __PRIVATE_toInt32Proto(e, t.expectedCount);
				null !== r && (n.expectedCount = r);
			}
			return n;
		}(this.serializer, e);
		const n = __PRIVATE_toListenRequestLabels(this.serializer, e);
		n && (t.labels = n), this.q_(t);
	}
	/**
	* Unregisters interest in the results of the target associated with the
	* given targetId.
	*/ X_(e) {
		const t = {};
		t.database = __PRIVATE_getEncodedDatabaseId(this.serializer), t.removeTarget = e, this.q_(t);
	}
};
/**
* A Stream that implements the Write RPC.
*
* The Write RPC requires the caller to maintain special streamToken
* state in between calls, to help the server understand which responses the
* client has processed by the time the next request is made. Every response
* will contain a streamToken; this value must be passed to the next
* request.
*
* After calling start() on this stream, the next request must be a handshake,
* containing whatever streamToken is on hand. Once a response to this
* request is received, all pending mutations may be submitted. When
* submitting multiple batches of mutations at the same time, it's
* okay to use the same streamToken for the calls to writeMutations.
*
* TODO(b/33271235): Use proto types
*/ var __PRIVATE_PersistentWriteStream = class extends __PRIVATE_PersistentStream {
	constructor(e, t, n, r, i, s) {
		super(e, "write_stream_connection_backoff", "write_stream_idle", "health_check_timeout", t, n, r, s), this.serializer = i;
	}
	/**
	* Tracks whether or not a handshake has been successfully exchanged and
	* the stream is ready to accept mutations.
	*/ get Y_() {
		return this.F_ > 0;
	}
	start() {
		this.lastStreamToken = void 0, super.start();
	}
	W_() {
		this.Y_ && this.ea([]);
	}
	j_(e, t) {
		return this.connection.T_("Write", e, t);
	}
	J_(e) {
		return __PRIVATE_hardAssert(!!e.streamToken, 31322), this.lastStreamToken = e.streamToken, __PRIVATE_hardAssert(!e.writeResults || 0 === e.writeResults.length, 55816), this.listener.ta();
	}
	onNext(e) {
		__PRIVATE_hardAssert(!!e.streamToken, 12678), this.lastStreamToken = e.streamToken, this.M_.reset();
		const t = __PRIVATE_fromWriteResults(e.writeResults, e.commitTime), n = __PRIVATE_fromVersion(e.commitTime);
		return this.listener.na(n, t);
	}
	/**
	* Sends an initial streamToken to the server, performing the handshake
	* required to make the StreamingWrite RPC work. Subsequent
	* calls should wait until onHandshakeComplete was called.
	*/ ra() {
		const e = {};
		e.database = __PRIVATE_getEncodedDatabaseId(this.serializer), this.q_(e);
	}
	/** Sends a group of mutations to the Firestore backend to apply. */ ea(e) {
		const t = {
			streamToken: this.lastStreamToken,
			writes: e.map(((e) => toMutation(this.serializer, e)))
		};
		this.q_(t);
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Datastore and its related methods are a wrapper around the external Google
* Cloud Datastore grpc API, which provides an interface that is more convenient
* for the rest of the client SDK architecture to consume.
*/ var Datastore = class {};
/**
* An implementation of Datastore that exposes additional state for internal
* consumption.
*/ var __PRIVATE_DatastoreImpl = class extends Datastore {
	constructor(e, t, n, r) {
		super(), this.authCredentials = e, this.appCheckCredentials = t, this.connection = n, this.serializer = r, this.ia = !1;
	}
	sa() {
		if (this.ia) throw new FirestoreError(D.FAILED_PRECONDITION, "The client has already been terminated.");
	}
	/** Invokes the provided RPC with auth and AppCheck tokens. */ Wo(e, t, n, r) {
		return this.sa(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then((([i, s]) => this.connection.Wo(e, __PRIVATE_toResourcePath(t, n), r, i, s))).catch(((e) => {
			throw "FirebaseError" === e.name ? (e.code === D.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e) : new FirestoreError(D.UNKNOWN, e.toString());
		}));
	}
	/** Invokes the provided RPC with streamed results with auth and AppCheck tokens. */ jo(e, t, n, r, i) {
		return this.sa(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then((([s, o]) => this.connection.jo(e, __PRIVATE_toResourcePath(t, n), r, s, o, i))).catch(((e) => {
			throw "FirebaseError" === e.name ? (e.code === D.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e) : new FirestoreError(D.UNKNOWN, e.toString());
		}));
	}
	terminate() {
		this.ia = !0, this.connection.terminate();
	}
};
function __PRIVATE_newDatastore(e, t, n, r) {
	return new __PRIVATE_DatastoreImpl(e, t, n, r);
}
/**
* A component used by the RemoteStore to track the OnlineState (that is,
* whether or not the client as a whole should be considered to be online or
* offline), implementing the appropriate heuristics.
*
* In particular, when the client is trying to connect to the backend, we
* allow up to MAX_WATCH_STREAM_FAILURES within ONLINE_STATE_TIMEOUT_MS for
* a connection to succeed. If we have too many failures or the timeout elapses,
* then we set the OnlineState to Offline, and the client will behave as if
* it is offline (get()s will return cached data, etc.).
*/
var __PRIVATE_OnlineStateTracker = class {
	constructor(e, t) {
		this.asyncQueue = e, this.onlineStateHandler = t, this.state = "Unknown", this.oa = 0, this._a = null, this.aa = !0;
	}
	/**
	* Called by RemoteStore when a watch stream is started (including on each
	* backoff attempt).
	*
	* If this is the first attempt, it sets the OnlineState to Unknown and starts
	* the onlineStateTimer.
	*/ ua() {
		0 === this.oa && (this.ca("Unknown"), this._a = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 1e4, (() => (this._a = null, this.la("Backend didn't respond within 10 seconds."), this.ca("Offline"), Promise.resolve()))));
	}
	/**
	* Updates our OnlineState as appropriate after the watch stream reports a
	* failure. The first failure moves us to the 'Unknown' state. We then may
	* allow multiple failures (based on MAX_WATCH_STREAM_FAILURES) before we
	* actually transition to the 'Offline' state.
	*/ ha(e) {
		"Online" === this.state ? this.ca("Unknown") : (this.oa++, this.oa >= 1 && (this.Pa(), this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`), this.ca("Offline")));
	}
	/**
	* Explicitly sets the OnlineState to the specified state.
	*
	* Note that this resets our timers / failure counters, etc. used by our
	* Offline heuristics, so must not be used in place of
	* handleWatchStreamStart() and handleWatchStreamFailure().
	*/ set(e) {
		this.Pa(), this.oa = 0, "Online" === e && (this.aa = !1), this.ca(e);
	}
	ca(e) {
		e !== this.state && (this.state = e, this.onlineStateHandler(e));
	}
	la(e) {
		const t = `Could not reach Cloud Firestore backend. ${e}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
		this.aa ? (__PRIVATE_logError(t), this.aa = !1) : __PRIVATE_logDebug("OnlineStateTracker", t);
	}
	Pa() {
		null !== this._a && (this._a.cancel(), this._a = null);
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var jt = "RemoteStore";
var __PRIVATE_RemoteStoreImpl = class {
	constructor(e, t, n, r, i) {
		this.localStore = e, this.datastore = t, this.asyncQueue = n, this.remoteSyncer = {}, this.Ta = [], this.Ea = /* @__PURE__ */ new Map(), this.Ia = /* @__PURE__ */ new Set(), this.Ra = [], this.Aa = i, this.Aa.Mo(((e) => {
			n.enqueueAndForget((async () => {
				__PRIVATE_canUseNetwork(this) && (__PRIVATE_logDebug(jt, "Restarting streams for network reachability change."), await async function __PRIVATE_restartNetwork(e) {
					const t = __PRIVATE_debugCast(e);
					t.Ia.add(4), await __PRIVATE_disableNetworkInternal(t), t.Va.set("Unknown"), t.Ia.delete(4), await __PRIVATE_enableNetworkInternal(t);
				}(this));
			}));
		})), this.Va = new __PRIVATE_OnlineStateTracker(n, r);
	}
};
async function __PRIVATE_enableNetworkInternal(e) {
	if (__PRIVATE_canUseNetwork(e)) for (const t of e.Ra) await t(!0);
}
/**
* Temporarily disables the network. The network can be re-enabled using
* enableNetwork().
*/ async function __PRIVATE_disableNetworkInternal(e) {
	for (const t of e.Ra) await t(!1);
}
/**
* Starts new listen for the given target. Uses resume token if provided. It
* is a no-op if the target of given `TargetData` is already being listened to.
*/
function __PRIVATE_remoteStoreListen(e, t) {
	const n = __PRIVATE_debugCast(e);
	n.Ea.has(t.targetId) || (n.Ea.set(t.targetId, t), __PRIVATE_shouldStartWatchStream(n) ? __PRIVATE_startWatchStream(n) : __PRIVATE_ensureWatchStream(n).O_() && __PRIVATE_sendWatchRequest(n, t));
}
/**
* Removes the listen from server. It is a no-op if the given target id is
* not being listened to.
*/ function __PRIVATE_remoteStoreUnlisten(e, t) {
	const n = __PRIVATE_debugCast(e), r = __PRIVATE_ensureWatchStream(n);
	n.Ea.delete(t), r.O_() && __PRIVATE_sendUnwatchRequest(n, t), 0 === n.Ea.size && (r.O_() ? r.L_() : __PRIVATE_canUseNetwork(n) && n.Va.set("Unknown"));
}
/**
* We need to increment the expected number of pending responses we're due
* from watch so we wait for the ack to process any messages from this target.
*/ function __PRIVATE_sendWatchRequest(e, t) {
	if (e.da.$e(t.targetId), t.resumeToken.approximateByteSize() > 0 || t.snapshotVersion.compareTo(SnapshotVersion.min()) > 0) {
		const n = e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;
		t = t.withExpectedCount(n);
	}
	__PRIVATE_ensureWatchStream(e).Z_(t);
}
/**
* We need to increment the expected number of pending responses we're due
* from watch so we wait for the removal on the server before we process any
* messages from this target.
*/ function __PRIVATE_sendUnwatchRequest(e, t) {
	e.da.$e(t), __PRIVATE_ensureWatchStream(e).X_(t);
}
function __PRIVATE_startWatchStream(e) {
	e.da = new __PRIVATE_WatchChangeAggregator({
		getRemoteKeysForTarget: (t) => e.remoteSyncer.getRemoteKeysForTarget(t),
		At: (t) => e.Ea.get(t) || null,
		ht: () => e.datastore.serializer.databaseId
	}), __PRIVATE_ensureWatchStream(e).start(), e.Va.ua();
}
/**
* Returns whether the watch stream should be started because it's necessary
* and has not yet been started.
*/ function __PRIVATE_shouldStartWatchStream(e) {
	return __PRIVATE_canUseNetwork(e) && !__PRIVATE_ensureWatchStream(e).x_() && e.Ea.size > 0;
}
function __PRIVATE_canUseNetwork(e) {
	return 0 === __PRIVATE_debugCast(e).Ia.size;
}
function __PRIVATE_cleanUpWatchStreamState(e) {
	e.da = void 0;
}
async function __PRIVATE_onWatchStreamConnected(e) {
	e.Va.set("Online");
}
async function __PRIVATE_onWatchStreamOpen(e) {
	e.Ea.forEach(((t, n) => {
		__PRIVATE_sendWatchRequest(e, t);
	}));
}
async function __PRIVATE_onWatchStreamClose(e, t) {
	__PRIVATE_cleanUpWatchStreamState(e), __PRIVATE_shouldStartWatchStream(e) ? (e.Va.ha(t), __PRIVATE_startWatchStream(e)) : e.Va.set("Unknown");
}
async function __PRIVATE_onWatchStreamChange(e, t, n) {
	if (e.Va.set("Online"), t instanceof __PRIVATE_WatchTargetChange && 2 === t.state && t.cause) try {
		/** Handles an error on a target */
		await async function __PRIVATE_handleTargetError(e, t) {
			const n = t.cause;
			for (const r of t.targetIds) e.Ea.has(r) && (await e.remoteSyncer.rejectListen(r, n), e.Ea.delete(r), e.da.removeTarget(r));
		}(e, t);
	} catch (n) {
		__PRIVATE_logDebug(jt, "Failed to remove targets %s: %s ", t.targetIds.join(","), n), await __PRIVATE_disableNetworkUntilRecovery(e, n);
	}
	else if (t instanceof __PRIVATE_DocumentWatchChange ? e.da.Xe(t) : t instanceof __PRIVATE_ExistenceFilterChange ? e.da.st(t) : e.da.tt(t), !n.isEqual(SnapshotVersion.min())) try {
		const t = await __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e.localStore);
		n.compareTo(t) >= 0 && await function __PRIVATE_raiseWatchSnapshot(e, t) {
			const n = e.da.Tt(t);
			return n.targetChanges.forEach(((n, r) => {
				if (n.resumeToken.approximateByteSize() > 0) {
					const i = e.Ea.get(r);
					i && e.Ea.set(r, i.withResumeToken(n.resumeToken, t));
				}
			})), n.targetMismatches.forEach(((t, n) => {
				const r = e.Ea.get(t);
				if (!r) return;
				e.Ea.set(t, r.withResumeToken(ByteString.EMPTY_BYTE_STRING, r.snapshotVersion)), __PRIVATE_sendUnwatchRequest(e, t);
				__PRIVATE_sendWatchRequest(e, new TargetData(r.target, t, n, r.sequenceNumber));
			})), e.remoteSyncer.applyRemoteEvent(n);
		}(e, n);
	} catch (t) {
		__PRIVATE_logDebug(jt, "Failed to raise snapshot:", t), await __PRIVATE_disableNetworkUntilRecovery(e, t);
	}
}
/**
* Recovery logic for IndexedDB errors that takes the network offline until
* `op` succeeds. Retries are scheduled with backoff using
* `enqueueRetryable()`. If `op()` is not provided, IndexedDB access is
* validated via a generic operation.
*
* The returned Promise is resolved once the network is disabled and before
* any retry attempt.
*/ async function __PRIVATE_disableNetworkUntilRecovery(e, t, n) {
	if (!__PRIVATE_isIndexedDbTransactionError(t)) throw t;
	e.Ia.add(1), await __PRIVATE_disableNetworkInternal(e), e.Va.set("Offline"), n || (n = () => __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e.localStore)), e.asyncQueue.enqueueRetryable((async () => {
		__PRIVATE_logDebug(jt, "Retrying IndexedDB access"), await n(), e.Ia.delete(1), await __PRIVATE_enableNetworkInternal(e);
	}));
}
/**
* Executes `op`. If `op` fails, takes the network offline until `op`
* succeeds. Returns after the first attempt.
*/ function __PRIVATE_executeWithRecovery(e, t) {
	return t().catch(((n) => __PRIVATE_disableNetworkUntilRecovery(e, n, t)));
}
async function __PRIVATE_fillWritePipeline(e) {
	const t = __PRIVATE_debugCast(e), n = __PRIVATE_ensureWriteStream(t);
	let r = t.Ta.length > 0 ? t.Ta[t.Ta.length - 1].batchId : q;
	for (; __PRIVATE_canAddToWritePipeline(t);) try {
		const e = await __PRIVATE_localStoreGetNextMutationBatch(t.localStore, r);
		if (null === e) {
			0 === t.Ta.length && n.L_();
			break;
		}
		r = e.batchId, __PRIVATE_addToWritePipeline(t, e);
	} catch (e) {
		await __PRIVATE_disableNetworkUntilRecovery(t, e);
	}
	__PRIVATE_shouldStartWriteStream(t) && __PRIVATE_startWriteStream(t);
}
/**
* Returns true if we can add to the write pipeline (i.e. the network is
* enabled and the write pipeline is not full).
*/ function __PRIVATE_canAddToWritePipeline(e) {
	return __PRIVATE_canUseNetwork(e) && e.Ta.length < 10;
}
/**
* Queues additional writes to be sent to the write stream, sending them
* immediately if the write stream is established.
*/ function __PRIVATE_addToWritePipeline(e, t) {
	e.Ta.push(t);
	const n = __PRIVATE_ensureWriteStream(e);
	n.O_() && n.Y_ && n.ea(t.mutations);
}
function __PRIVATE_shouldStartWriteStream(e) {
	return __PRIVATE_canUseNetwork(e) && !__PRIVATE_ensureWriteStream(e).x_() && e.Ta.length > 0;
}
function __PRIVATE_startWriteStream(e) {
	__PRIVATE_ensureWriteStream(e).start();
}
async function __PRIVATE_onWriteStreamOpen(e) {
	__PRIVATE_ensureWriteStream(e).ra();
}
async function __PRIVATE_onWriteHandshakeComplete(e) {
	const t = __PRIVATE_ensureWriteStream(e);
	for (const n of e.Ta) t.ea(n.mutations);
}
async function __PRIVATE_onMutationResult(e, t, n) {
	const r = e.Ta.shift(), i = MutationBatchResult.from(r, t, n);
	await __PRIVATE_executeWithRecovery(e, (() => e.remoteSyncer.applySuccessfulWrite(i))), await __PRIVATE_fillWritePipeline(e);
}
async function __PRIVATE_onWriteStreamClose(e, t) {
	t && __PRIVATE_ensureWriteStream(e).Y_ && await async function __PRIVATE_handleWriteError(e, t) {
		if (function __PRIVATE_isPermanentWriteError(e) {
			return __PRIVATE_isPermanentError(e) && e !== D.ABORTED;
		}(t.code)) {
			const n = e.Ta.shift();
			__PRIVATE_ensureWriteStream(e).B_(), await __PRIVATE_executeWithRecovery(e, (() => e.remoteSyncer.rejectFailedWrite(n.batchId, t))), await __PRIVATE_fillWritePipeline(e);
		}
	}(e, t), __PRIVATE_shouldStartWriteStream(e) && __PRIVATE_startWriteStream(e);
}
async function __PRIVATE_remoteStoreHandleCredentialChange(e, t) {
	const n = __PRIVATE_debugCast(e);
	n.asyncQueue.verifyOperationInProgress(), __PRIVATE_logDebug(jt, "RemoteStore received new credentials");
	const r = __PRIVATE_canUseNetwork(n);
	n.Ia.add(3), await __PRIVATE_disableNetworkInternal(n), r && n.Va.set("Unknown"), await n.remoteSyncer.handleCredentialChange(t), n.Ia.delete(3), await __PRIVATE_enableNetworkInternal(n);
}
/**
* Toggles the network state when the client gains or loses its primary lease.
*/ async function __PRIVATE_remoteStoreApplyPrimaryState(e, t) {
	const n = __PRIVATE_debugCast(e);
	t ? (n.Ia.delete(2), await __PRIVATE_enableNetworkInternal(n)) : t || (n.Ia.add(2), await __PRIVATE_disableNetworkInternal(n), n.Va.set("Unknown"));
}
/**
* If not yet initialized, registers the WatchStream and its network state
* callback with `remoteStoreImpl`. Returns the existing stream if one is
* already available.
*
* PORTING NOTE: On iOS and Android, the WatchStream gets registered on startup.
* This is not done on Web to allow it to be tree-shaken.
*/ function __PRIVATE_ensureWatchStream(e) {
	return e.ma || (e.ma = function __PRIVATE_newPersistentWatchStream(e, t, n) {
		const r = __PRIVATE_debugCast(e);
		return r.sa(), new __PRIVATE_PersistentListenStream(t, r.connection, r.authCredentials, r.appCheckCredentials, r.serializer, n);
	}(e.datastore, e.asyncQueue, {
		Zo: __PRIVATE_onWatchStreamConnected.bind(null, e),
		Yo: __PRIVATE_onWatchStreamOpen.bind(null, e),
		t_: __PRIVATE_onWatchStreamClose.bind(null, e),
		H_: __PRIVATE_onWatchStreamChange.bind(null, e)
	}), e.Ra.push((async (t) => {
		t ? (e.ma.B_(), __PRIVATE_shouldStartWatchStream(e) ? __PRIVATE_startWatchStream(e) : e.Va.set("Unknown")) : (await e.ma.stop(), __PRIVATE_cleanUpWatchStreamState(e));
	}))), e.ma;
}
/**
* If not yet initialized, registers the WriteStream and its network state
* callback with `remoteStoreImpl`. Returns the existing stream if one is
* already available.
*
* PORTING NOTE: On iOS and Android, the WriteStream gets registered on startup.
* This is not done on Web to allow it to be tree-shaken.
*/ function __PRIVATE_ensureWriteStream(e) {
	return e.fa || (e.fa = function __PRIVATE_newPersistentWriteStream(e, t, n) {
		const r = __PRIVATE_debugCast(e);
		return r.sa(), new __PRIVATE_PersistentWriteStream(t, r.connection, r.authCredentials, r.appCheckCredentials, r.serializer, n);
	}(e.datastore, e.asyncQueue, {
		Zo: () => Promise.resolve(),
		Yo: __PRIVATE_onWriteStreamOpen.bind(null, e),
		t_: __PRIVATE_onWriteStreamClose.bind(null, e),
		ta: __PRIVATE_onWriteHandshakeComplete.bind(null, e),
		na: __PRIVATE_onMutationResult.bind(null, e)
	}), e.Ra.push((async (t) => {
		t ? (e.fa.B_(), await __PRIVATE_fillWritePipeline(e)) : (await e.fa.stop(), e.Ta.length > 0 && (__PRIVATE_logDebug(jt, `Stopping write stream with ${e.Ta.length} pending writes`), e.Ta = []));
	}))), e.fa;
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Represents an operation scheduled to be run in the future on an AsyncQueue.
*
* It is created via DelayedOperation.createAndSchedule().
*
* Supports cancellation (via cancel()) and early execution (via skipDelay()).
*
* Note: We implement `PromiseLike` instead of `Promise`, as the `Promise` type
* in newer versions of TypeScript defines `finally`, which is not available in
* IE.
*/
var DelayedOperation = class DelayedOperation {
	constructor(e, t, n, r, i) {
		this.asyncQueue = e, this.timerId = t, this.targetTimeMs = n, this.op = r, this.removalCallback = i, this.deferred = new __PRIVATE_Deferred(), this.then = this.deferred.promise.then.bind(this.deferred.promise), this.deferred.promise.catch(((e) => {}));
	}
	get promise() {
		return this.deferred.promise;
	}
	/**
	* Creates and returns a DelayedOperation that has been scheduled to be
	* executed on the provided asyncQueue after the provided delayMs.
	*
	* @param asyncQueue - The queue to schedule the operation on.
	* @param id - A Timer ID identifying the type of operation this is.
	* @param delayMs - The delay (ms) before the operation should be scheduled.
	* @param op - The operation to run.
	* @param removalCallback - A callback to be called synchronously once the
	*   operation is executed or canceled, notifying the AsyncQueue to remove it
	*   from its delayedOperations list.
	*   PORTING NOTE: This exists to prevent making removeDelayedOperation() and
	*   the DelayedOperation class public.
	*/ static createAndSchedule(e, t, n, r, i) {
		const o = new DelayedOperation(e, t, Date.now() + n, r, i);
		return o.start(n), o;
	}
	/**
	* Starts the timer. This is called immediately after construction by
	* createAndSchedule().
	*/ start(e) {
		this.timerHandle = setTimeout((() => this.handleDelayElapsed()), e);
	}
	/**
	* Queues the operation to run immediately (if it hasn't already been run or
	* canceled).
	*/ skipDelay() {
		return this.handleDelayElapsed();
	}
	/**
	* Cancels the operation if it hasn't already been executed or canceled. The
	* promise will be rejected.
	*
	* As long as the operation has not yet been run, calling cancel() provides a
	* guarantee that the operation will not be run.
	*/ cancel(e) {
		null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new FirestoreError(D.CANCELLED, "Operation cancelled" + (e ? ": " + e : ""))));
	}
	handleDelayElapsed() {
		this.asyncQueue.enqueueAndForget((() => null !== this.timerHandle ? (this.clearTimeout(), this.op().then(((e) => this.deferred.resolve(e)))) : Promise.resolve()));
	}
	clearTimeout() {
		null !== this.timerHandle && (this.removalCallback(this), clearTimeout(this.timerHandle), this.timerHandle = null);
	}
};
/**
* Returns a FirestoreError that can be surfaced to the user if the provided
* error is an IndexedDbTransactionError. Re-throws the error otherwise.
*/ function __PRIVATE_wrapInUserErrorIfRecoverable(e, t) {
	if (__PRIVATE_logError("AsyncQueue", `${t}: ${e}`), __PRIVATE_isIndexedDbTransactionError(e)) return new FirestoreError(D.UNAVAILABLE, `${t}: ${e}`);
	throw e;
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* DocumentSet is an immutable (copy-on-write) collection that holds documents
* in order specified by the provided comparator. We always add a document key
* comparator on top of what is provided to guarantee document equality based on
* the key.
*/ var DocumentSet = class DocumentSet {
	/**
	* Returns an empty copy of the existing DocumentSet, using the same
	* comparator.
	*/
	static emptySet(e) {
		return new DocumentSet(e.comparator);
	}
	/** The default ordering is by key if the comparator is omitted */ constructor(e) {
		this.comparator = e ? (t, n) => e(t, n) || DocumentKey.comparator(t.key, n.key) : (e, t) => DocumentKey.comparator(e.key, t.key), this.keyedMap = documentMap(), this.sortedSet = new SortedMap(this.comparator);
	}
	has(e) {
		return null != this.keyedMap.get(e);
	}
	get(e) {
		return this.keyedMap.get(e);
	}
	first() {
		return this.sortedSet.minKey();
	}
	last() {
		return this.sortedSet.maxKey();
	}
	isEmpty() {
		return this.sortedSet.isEmpty();
	}
	/**
	* Returns the index of the provided key in the document set, or -1 if the
	* document key is not present in the set;
	*/ indexOf(e) {
		const t = this.keyedMap.get(e);
		return t ? this.sortedSet.indexOf(t) : -1;
	}
	get size() {
		return this.sortedSet.size;
	}
	/** Iterates documents in order defined by "comparator" */ forEach(e) {
		this.sortedSet.inorderTraversal(((t, n) => (e(t), !1)));
	}
	/** Inserts or updates a document with the same key */ add(e) {
		const t = this.delete(e.key);
		return t.copy(t.keyedMap.insert(e.key, e), t.sortedSet.insert(e, null));
	}
	/** Deletes a document with a given key */ delete(e) {
		const t = this.get(e);
		return t ? this.copy(this.keyedMap.remove(e), this.sortedSet.remove(t)) : this;
	}
	isEqual(e) {
		if (!(e instanceof DocumentSet)) return !1;
		if (this.size !== e.size) return !1;
		const t = this.sortedSet.getIterator(), n = e.sortedSet.getIterator();
		for (; t.hasNext();) {
			const e = t.getNext().key, r = n.getNext().key;
			if (!e.isEqual(r)) return !1;
		}
		return !0;
	}
	toString() {
		const e = [];
		return this.forEach(((t) => {
			e.push(t.toString());
		})), 0 === e.length ? "DocumentSet ()" : "DocumentSet (\n  " + e.join("  \n") + "\n)";
	}
	copy(e, t) {
		const n = new DocumentSet();
		return n.comparator = this.comparator, n.keyedMap = e, n.sortedSet = t, n;
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* DocumentChangeSet keeps track of a set of changes to docs in a query, merging
* duplicate events for the same doc.
*/ var __PRIVATE_DocumentChangeSet = class {
	constructor() {
		this.ga = new SortedMap(DocumentKey.comparator);
	}
	track(e) {
		const t = e.doc.key, n = this.ga.get(t);
		n ? 0 !== e.type && 3 === n.type ? this.ga = this.ga.insert(t, e) : 3 === e.type && 1 !== n.type ? this.ga = this.ga.insert(t, {
			type: n.type,
			doc: e.doc
		}) : 2 === e.type && 2 === n.type ? this.ga = this.ga.insert(t, {
			type: 2,
			doc: e.doc
		}) : 2 === e.type && 0 === n.type ? this.ga = this.ga.insert(t, {
			type: 0,
			doc: e.doc
		}) : 1 === e.type && 0 === n.type ? this.ga = this.ga.remove(t) : 1 === e.type && 2 === n.type ? this.ga = this.ga.insert(t, {
			type: 1,
			doc: n.doc
		}) : 0 === e.type && 1 === n.type ? this.ga = this.ga.insert(t, {
			type: 2,
			doc: e.doc
		}) : fail(63341, {
			Vt: e,
			pa: n
		}) : this.ga = this.ga.insert(t, e);
	}
	ya() {
		const e = [];
		return this.ga.inorderTraversal(((t, n) => {
			e.push(n);
		})), e;
	}
};
var ViewSnapshot = class ViewSnapshot {
	constructor(e, t, n, r, i, s, o, _, a) {
		this.query = e, this.docs = t, this.oldDocs = n, this.docChanges = r, this.mutatedKeys = i, this.fromCache = s, this.syncStateChanged = o, this.excludesMetadataChanges = _, this.hasCachedResults = a;
	}
	/** Returns a view snapshot as if all documents in the snapshot were added. */ static fromInitialDocuments(e, t, n, r, i) {
		const s = [];
		return t.forEach(((e) => {
			s.push({
				type: 0,
				doc: e
			});
		})), new ViewSnapshot(e, t, DocumentSet.emptySet(t), s, n, r, !0, !1, i);
	}
	get hasPendingWrites() {
		return !this.mutatedKeys.isEmpty();
	}
	isEqual(e) {
		if (!(this.fromCache === e.fromCache && this.hasCachedResults === e.hasCachedResults && this.syncStateChanged === e.syncStateChanged && this.mutatedKeys.isEqual(e.mutatedKeys) && __PRIVATE_queryEquals(this.query, e.query) && this.docs.isEqual(e.docs) && this.oldDocs.isEqual(e.oldDocs))) return !1;
		const t = this.docChanges, n = e.docChanges;
		if (t.length !== n.length) return !1;
		for (let e = 0; e < t.length; e++) if (t[e].type !== n[e].type || !t[e].doc.isEqual(n[e].doc)) return !1;
		return !0;
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Holds the listeners and the last received ViewSnapshot for a query being
* tracked by EventManager.
*/ var __PRIVATE_QueryListenersInfo = class {
	constructor() {
		this.wa = void 0, this.Sa = [];
	}
	ba() {
		return this.Sa.some(((e) => e.Da()));
	}
};
var __PRIVATE_EventManagerImpl = class {
	constructor() {
		this.queries = __PRIVATE_newQueriesObjectMap(), this.onlineState = "Unknown", this.Ca = /* @__PURE__ */ new Set();
	}
	terminate() {
		(function __PRIVATE_errorAllTargets(e, t) {
			const n = __PRIVATE_debugCast(e), r = n.queries;
			n.queries = __PRIVATE_newQueriesObjectMap(), r.forEach(((e, n) => {
				for (const e of n.Sa) e.onError(t);
			}));
		})(this, new FirestoreError(D.ABORTED, "Firestore shutting down"));
	}
};
function __PRIVATE_newQueriesObjectMap() {
	return new ObjectMap(((e) => __PRIVATE_canonifyQuery(e)), __PRIVATE_queryEquals);
}
async function __PRIVATE_eventManagerListen(e, t) {
	const n = __PRIVATE_debugCast(e);
	let r = 3;
	const i = t.query;
	let s = n.queries.get(i);
	s ? !s.ba() && t.Da() && (r = 2) : (s = new __PRIVATE_QueryListenersInfo(), r = t.Da() ? 0 : 1);
	try {
		switch (r) {
			case 0:
				s.wa = await n.onListen(
					i,
					/** enableRemoteListen= */
					!0
				);
				break;
			case 1:
				s.wa = await n.onListen(
					i,
					/** enableRemoteListen= */
					!1
				);
				break;
			case 2: await n.onFirstRemoteStoreListen(i);
		}
	} catch (e) {
		const n = __PRIVATE_wrapInUserErrorIfRecoverable(e, `Initialization of query '${__PRIVATE_stringifyQuery(t.query)}' failed`);
		t.onError(n);
		return;
	}
	if (n.queries.set(i, s), s.Sa.push(t), t.va(n.onlineState), s.wa) t.Fa(s.wa) && __PRIVATE_raiseSnapshotsInSyncEvent(n);
}
async function __PRIVATE_eventManagerUnlisten(e, t) {
	const n = __PRIVATE_debugCast(e), r = t.query;
	let i = 3;
	const s = n.queries.get(r);
	if (s) {
		const e = s.Sa.indexOf(t);
		e >= 0 && (s.Sa.splice(e, 1), 0 === s.Sa.length ? i = t.Da() ? 0 : 1 : !s.ba() && t.Da() && (i = 2));
	}
	switch (i) {
		case 0: return n.queries.delete(r), n.onUnlisten(
			r,
			/** disableRemoteListen= */
			!0
		);
		case 1: return n.queries.delete(r), n.onUnlisten(
			r,
			/** disableRemoteListen= */
			!1
		);
		case 2: return n.onLastRemoteStoreUnlisten(r);
		default: return;
	}
}
function __PRIVATE_eventManagerOnWatchChange(e, t) {
	const n = __PRIVATE_debugCast(e);
	let r = !1;
	for (const e of t) {
		const t = e.query, i = n.queries.get(t);
		if (i) {
			for (const t of i.Sa) t.Fa(e) && (r = !0);
			i.wa = e;
		}
	}
	r && __PRIVATE_raiseSnapshotsInSyncEvent(n);
}
function __PRIVATE_eventManagerOnWatchError(e, t, n) {
	const r = __PRIVATE_debugCast(e), i = r.queries.get(t);
	if (i) for (const e of i.Sa) e.onError(n);
	r.queries.delete(t);
}
function __PRIVATE_raiseSnapshotsInSyncEvent(e) {
	e.Ca.forEach(((e) => {
		e.next();
	}));
}
var Ht$1, Jt;
/** Listen to both cache and server changes */
(Jt = Ht$1 || (Ht$1 = {})).Ma = "default", Jt.Cache = "cache";
/**
* QueryListener takes a series of internal view snapshots and determines
* when to raise the event.
*
* It uses an Observer to dispatch events.
*/
var __PRIVATE_QueryListener = class {
	constructor(e, t, n) {
		this.query = e, this.xa = t, this.Oa = !1, this.Na = null, this.onlineState = "Unknown", this.options = n || {};
	}
	/**
	* Applies the new ViewSnapshot to this listener, raising a user-facing event
	* if applicable (depending on what changed, whether the user has opted into
	* metadata-only changes, etc.). Returns true if a user-facing event was
	* indeed raised.
	*/ Fa(e) {
		if (!this.options.includeMetadataChanges) {
			const t = [];
			for (const n of e.docChanges) 3 !== n.type && t.push(n);
			e = new ViewSnapshot(e.query, e.docs, e.oldDocs, t, e.mutatedKeys, e.fromCache, e.syncStateChanged, !0, e.hasCachedResults);
		}
		let t = !1;
		return this.Oa ? this.Ba(e) && (this.xa.next(e), t = !0) : this.La(e, this.onlineState) && (this.ka(e), t = !0), this.Na = e, t;
	}
	onError(e) {
		this.xa.error(e);
	}
	/** Returns whether a snapshot was raised. */ va(e) {
		this.onlineState = e;
		let t = !1;
		return this.Na && !this.Oa && this.La(this.Na, e) && (this.ka(this.Na), t = !0), t;
	}
	La(e, t) {
		if (!e.fromCache) return !0;
		if (!this.Da()) return !0;
		const n = "Offline" !== t;
		return (!this.options.qa || !n) && (!e.docs.isEmpty() || e.hasCachedResults || "Offline" === t);
	}
	Ba(e) {
		if (e.docChanges.length > 0) return !0;
		const t = this.Na && this.Na.hasPendingWrites !== e.hasPendingWrites;
		return !(!e.syncStateChanged && !t) && !0 === this.options.includeMetadataChanges;
	}
	ka(e) {
		e = ViewSnapshot.fromInitialDocuments(e.query, e.docs, e.mutatedKeys, e.fromCache, e.hasCachedResults), this.Oa = !0, this.xa.next(e);
	}
	Da() {
		return this.options.source !== Ht$1.Cache;
	}
};
/**
* Returns a `LoadBundleTaskProgress` representing the progress that the loading
* has succeeded.
*/
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var __PRIVATE_AddedLimboDocument = class {
	constructor(e) {
		this.key = e;
	}
};
var __PRIVATE_RemovedLimboDocument = class {
	constructor(e) {
		this.key = e;
	}
};
/**
* View is responsible for computing the final merged truth of what docs are in
* a query. It gets notified of local and remote changes to docs, and applies
* the query filters and limits to determine the most correct possible results.
*/ var __PRIVATE_View = class {
	constructor(e, t) {
		this.query = e, this.Za = t, this.Xa = null, this.hasCachedResults = !1, this.current = !1, this.Ya = __PRIVATE_documentKeySet(), this.mutatedKeys = __PRIVATE_documentKeySet(), this.eu = __PRIVATE_newQueryComparator(e), this.tu = new DocumentSet(this.eu);
	}
	/**
	* The set of remote documents that the server has told us belongs to the target associated with
	* this view.
	*/ get nu() {
		return this.Za;
	}
	/**
	* Iterates over a set of doc changes, applies the query limit, and computes
	* what the new results should be, what the changes were, and whether we may
	* need to go back to the local cache for more results. Does not make any
	* changes to the view.
	* @param docChanges - The doc changes to apply to this view.
	* @param previousChanges - If this is being called with a refill, then start
	*        with this set of docs and changes instead of the current view.
	* @returns a new set of docs, changes, and refill flag.
	*/ ru(e, t) {
		const n = t ? t.iu : new __PRIVATE_DocumentChangeSet(), r = t ? t.tu : this.tu;
		let i = t ? t.mutatedKeys : this.mutatedKeys, s = r, o = !1;
		const _ = "F" === this.query.limitType && r.size === this.query.limit ? r.last() : null, a = "L" === this.query.limitType && r.size === this.query.limit ? r.first() : null;
		if (e.inorderTraversal(((e, t) => {
			const u = r.get(e), c = __PRIVATE_queryMatches(this.query, t) ? t : null, l = !!u && this.mutatedKeys.has(u.key), h = !!c && (c.hasLocalMutations || this.mutatedKeys.has(c.key) && c.hasCommittedMutations);
			let P = !1;
			if (u && c) u.data.isEqual(c.data) ? l !== h && (n.track({
				type: 3,
				doc: c
			}), P = !0) : this.su(u, c) || (n.track({
				type: 2,
				doc: c
			}), P = !0, (_ && this.eu(c, _) > 0 || a && this.eu(c, a) < 0) && (o = !0));
			else !u && c ? (n.track({
				type: 0,
				doc: c
			}), P = !0) : u && !c && (n.track({
				type: 1,
				doc: u
			}), P = !0, (_ || a) && (o = !0));
			P && (c ? (s = s.add(c), i = h ? i.add(e) : i.delete(e)) : (s = s.delete(e), i = i.delete(e)));
		})), null !== this.query.limit) for (; s.size > this.query.limit;) {
			const e = "F" === this.query.limitType ? s.last() : s.first();
			s = s.delete(e.key), i = i.delete(e.key), n.track({
				type: 1,
				doc: e
			});
		}
		return {
			tu: s,
			iu: n,
			bs: o,
			mutatedKeys: i
		};
	}
	su(e, t) {
		return e.hasLocalMutations && t.hasCommittedMutations && !t.hasLocalMutations;
	}
	/**
	* Updates the view with the given ViewDocumentChanges and optionally updates
	* limbo docs and sync state from the provided target change.
	* @param docChanges - The set of changes to make to the view's docs.
	* @param limboResolutionEnabled - Whether to update limbo documents based on
	*        this change.
	* @param targetChange - A target change to apply for computing limbo docs and
	*        sync state.
	* @param targetIsPendingReset - Whether the target is pending to reset due to
	*        existence filter mismatch. If not explicitly specified, it is treated
	*        equivalently to `false`.
	* @returns A new ViewChange with the given docs, changes, and sync state.
	*/
	applyChanges(e, t, n, r) {
		const i = this.tu;
		this.tu = e.tu, this.mutatedKeys = e.mutatedKeys;
		const s = e.iu.ya();
		s.sort(((e, t) => function __PRIVATE_compareChangeType(e, t) {
			const order = (e) => {
				switch (e) {
					case 0: return 1;
					case 2:
					case 3: return 2;
					case 1: return 0;
					default: return fail(20277, { Vt: e });
				}
			};
			return order(e) - order(t);
		}(e.type, t.type) || this.eu(e.doc, t.doc))), this.ou(n), r = r ?? !1;
		const o = t && !r ? this._u() : [], _ = 0 === this.Ya.size && this.current && !r ? 1 : 0, a = _ !== this.Xa;
		if (this.Xa = _, 0 !== s.length || a) return {
			snapshot: new ViewSnapshot(this.query, e.tu, i, s, e.mutatedKeys, 0 === _, a, !1, !!n && n.resumeToken.approximateByteSize() > 0),
			au: o
		};
		return { au: o };
	}
	/**
	* Applies an OnlineState change to the view, potentially generating a
	* ViewChange if the view's syncState changes as a result.
	*/ va(e) {
		return this.current && "Offline" === e ? (this.current = !1, this.applyChanges({
			tu: this.tu,
			iu: new __PRIVATE_DocumentChangeSet(),
			mutatedKeys: this.mutatedKeys,
			bs: !1
		}, !1)) : { au: [] };
	}
	/**
	* Returns whether the doc for the given key should be in limbo.
	*/ uu(e) {
		return !this.Za.has(e) && !!this.tu.has(e) && !this.tu.get(e).hasLocalMutations;
	}
	/**
	* Updates syncedDocuments, current, and limbo docs based on the given change.
	* Returns the list of changes to which docs are in limbo.
	*/ ou(e) {
		e && (e.addedDocuments.forEach(((e) => this.Za = this.Za.add(e))), e.modifiedDocuments.forEach(((e) => {})), e.removedDocuments.forEach(((e) => this.Za = this.Za.delete(e))), this.current = e.current);
	}
	_u() {
		if (!this.current) return [];
		const e = this.Ya;
		this.Ya = __PRIVATE_documentKeySet(), this.tu.forEach(((e) => {
			this.uu(e.key) && (this.Ya = this.Ya.add(e.key));
		}));
		const t = [];
		return e.forEach(((e) => {
			this.Ya.has(e) || t.push(new __PRIVATE_RemovedLimboDocument(e));
		})), this.Ya.forEach(((n) => {
			e.has(n) || t.push(new __PRIVATE_AddedLimboDocument(n));
		})), t;
	}
	/**
	* Update the in-memory state of the current view with the state read from
	* persistence.
	*
	* We update the query view whenever a client's primary status changes:
	* - When a client transitions from primary to secondary, it can miss
	*   LocalStorage updates and its query views may temporarily not be
	*   synchronized with the state on disk.
	* - For secondary to primary transitions, the client needs to update the list
	*   of `syncedDocuments` since secondary clients update their query views
	*   based purely on synthesized RemoteEvents.
	*
	* @param queryResult.documents - The documents that match the query according
	* to the LocalStore.
	* @param queryResult.remoteKeys - The keys of the documents that match the
	* query according to the backend.
	*
	* @returns The ViewChange that resulted from this synchronization.
	*/
	cu(e) {
		this.Za = e.ks, this.Ya = __PRIVATE_documentKeySet();
		const t = this.ru(e.documents);
		return this.applyChanges(t, !0);
	}
	/**
	* Returns a view snapshot as if this query was just listened to. Contains
	* a document add for every existing document and the `fromCache` and
	* `hasPendingWrites` status of the already established view.
	*/
	lu() {
		return ViewSnapshot.fromInitialDocuments(this.query, this.tu, this.mutatedKeys, 0 === this.Xa, this.hasCachedResults);
	}
};
var Zt = "SyncEngine";
/**
* QueryView contains all of the data that SyncEngine needs to keep track of for
* a particular query.
*/ var __PRIVATE_QueryView = class {
	constructor(e, t, n) {
		this.query = e, this.targetId = t, this.view = n;
	}
};
/** Tracks a limbo resolution. */ var LimboResolution = class {
	constructor(e) {
		this.key = e, this.hu = !1;
	}
};
/**
* An implementation of `SyncEngine` coordinating with other parts of SDK.
*
* The parts of SyncEngine that act as a callback to RemoteStore need to be
* registered individually. This is done in `syncEngineWrite()` and
* `syncEngineListen()` (as well as `applyPrimaryState()`) as these methods
* serve as entry points to RemoteStore's functionality.
*
* Note: some field defined in this class might have public access level, but
* the class is not exported so they are only accessible from this module.
* This is useful to implement optional features (like bundles) in free
* functions, such that they are tree-shakeable.
*/ var __PRIVATE_SyncEngineImpl = class {
	constructor(e, t, n, r, i, s) {
		this.localStore = e, this.remoteStore = t, this.eventManager = n, this.sharedClientState = r, this.currentUser = i, this.maxConcurrentLimboResolutions = s, this.Pu = {}, this.Tu = new ObjectMap(((e) => __PRIVATE_canonifyQuery(e)), __PRIVATE_queryEquals), this.Eu = /* @__PURE__ */ new Map(), this.Iu = /* @__PURE__ */ new Set(), this.Ru = new SortedMap(DocumentKey.comparator), this.Au = /* @__PURE__ */ new Map(), this.Vu = new __PRIVATE_ReferenceSet(), this.du = {}, this.mu = /* @__PURE__ */ new Map(), this.fu = __PRIVATE_TargetIdGenerator.ar(), this.onlineState = "Unknown", this.gu = void 0;
	}
	get isPrimaryClient() {
		return !0 === this.gu;
	}
};
/**
* Initiates the new listen, resolves promise when listen enqueued to the
* server. All the subsequent view snapshots or errors are sent to the
* subscribed handlers. Returns the initial snapshot.
*/
async function __PRIVATE_syncEngineListen(e, t, n = !0) {
	const r = __PRIVATE_ensureWatchCallbacks(e);
	let i;
	const s = r.Tu.get(t);
	return s ? (r.sharedClientState.addLocalQueryTarget(s.targetId), i = s.view.lu()) : i = await __PRIVATE_allocateTargetAndMaybeListen(
		r,
		t,
		n,
		/** shouldInitializeView= */
		!0
	), i;
}
/** Query has been listening to the cache, and tries to initiate the remote store listen */ async function __PRIVATE_triggerRemoteStoreListen(e, t) {
	await __PRIVATE_allocateTargetAndMaybeListen(
		__PRIVATE_ensureWatchCallbacks(e),
		t,
		/** shouldListenToRemote= */
		!0,
		/** shouldInitializeView= */
		!1
	);
}
async function __PRIVATE_allocateTargetAndMaybeListen(e, t, n, r) {
	const i = await __PRIVATE_localStoreAllocateTarget(e.localStore, __PRIVATE_queryToTarget(t)), s = i.targetId, o = e.sharedClientState.addLocalQueryTarget(s, n);
	let _;
	return r && (_ = await __PRIVATE_initializeViewAndComputeSnapshot(e, t, s, "current" === o, i.resumeToken)), e.isPrimaryClient && n && __PRIVATE_remoteStoreListen(e.remoteStore, i), _;
}
/**
* Registers a view for a previously unknown query and computes its initial
* snapshot.
*/ async function __PRIVATE_initializeViewAndComputeSnapshot(e, t, n, r, i) {
	e.pu = (t, n, r) => async function __PRIVATE_applyDocChanges(e, t, n, r) {
		let i = t.view.ru(n);
		i.bs && (i = await __PRIVATE_localStoreExecuteQuery(e.localStore, t.query, !1).then((({ documents: e }) => t.view.ru(e, i))));
		const s = r && r.targetChanges.get(t.targetId), o = r && null != r.targetMismatches.get(t.targetId), _ = t.view.applyChanges(i, e.isPrimaryClient, s, o);
		return __PRIVATE_updateTrackedLimbos(e, t.targetId, _.au), _.snapshot;
	}(e, t, n, r);
	const s = await __PRIVATE_localStoreExecuteQuery(e.localStore, t, !0), o = new __PRIVATE_View(t, s.ks), _ = o.ru(s.documents), a = TargetChange.createSynthesizedTargetChangeForCurrentChange(n, r && "Offline" !== e.onlineState, i), u = o.applyChanges(_, e.isPrimaryClient, a);
	__PRIVATE_updateTrackedLimbos(e, n, u.au);
	const c = new __PRIVATE_QueryView(t, n, o);
	return e.Tu.set(t, c), e.Eu.has(n) ? e.Eu.get(n).push(t) : e.Eu.set(n, [t]), u.snapshot;
}
/** Stops listening to the query. */ async function __PRIVATE_syncEngineUnlisten(e, t, n) {
	const r = __PRIVATE_debugCast(e), i = r.Tu.get(t), s = r.Eu.get(i.targetId);
	if (s.length > 1) return r.Eu.set(i.targetId, s.filter(((e) => !__PRIVATE_queryEquals(e, t)))), void r.Tu.delete(t);
	if (r.isPrimaryClient) {
		r.sharedClientState.removeLocalQueryTarget(i.targetId);
		r.sharedClientState.isActiveQueryTarget(i.targetId) || await __PRIVATE_localStoreReleaseTarget(r.localStore, i.targetId, !1).then((() => {
			r.sharedClientState.clearQueryState(i.targetId), n && __PRIVATE_remoteStoreUnlisten(r.remoteStore, i.targetId), __PRIVATE_removeAndCleanupTarget(r, i.targetId);
		})).catch(__PRIVATE_ignoreIfPrimaryLeaseLoss);
	} else __PRIVATE_removeAndCleanupTarget(r, i.targetId), await __PRIVATE_localStoreReleaseTarget(r.localStore, i.targetId, !0);
}
/** Unlistens to the remote store while still listening to the cache. */ async function __PRIVATE_triggerRemoteStoreUnlisten(e, t) {
	const n = __PRIVATE_debugCast(e), r = n.Tu.get(t), i = n.Eu.get(r.targetId);
	n.isPrimaryClient && 1 === i.length && (n.sharedClientState.removeLocalQueryTarget(r.targetId), __PRIVATE_remoteStoreUnlisten(n.remoteStore, r.targetId));
}
/**
* Initiates the write of local mutation batch which involves adding the
* writes to the mutation queue, notifying the remote store about new
* mutations and raising events for any changes this write caused.
*
* The promise returned by this call is resolved when the above steps
* have completed, *not* when the write was acked by the backend. The
* userCallback is resolved once the write was acked/rejected by the
* backend (or failed locally for any other reason).
*/ async function __PRIVATE_syncEngineWrite(e, t, n) {
	const r = __PRIVATE_syncEngineEnsureWriteCallbacks(e);
	try {
		const e = await function __PRIVATE_localStoreWriteLocally(e, t) {
			const n = __PRIVATE_debugCast(e), r = Timestamp.now(), i = t.reduce(((e, t) => e.add(t.key)), __PRIVATE_documentKeySet());
			let s, o;
			return n.persistence.runTransaction("Locally write mutations", "readwrite", ((e) => {
				let _ = __PRIVATE_mutableDocumentMap(), a = __PRIVATE_documentKeySet();
				return n.xs.getEntries(e, i).next(((e) => {
					_ = e, _.forEach(((e, t) => {
						t.isValidDocument() || (a = a.add(e));
					}));
				})).next((() => n.localDocuments.getOverlayedDocuments(e, _))).next(((i) => {
					s = i;
					const o = [];
					for (const e of t) {
						const t = __PRIVATE_mutationExtractBaseValue(e, s.get(e.key).overlayedDocument);
						null != t && o.push(new __PRIVATE_PatchMutation(e.key, t, __PRIVATE_extractFieldMask(t.value.mapValue), Precondition.exists(!0)));
					}
					return n.mutationQueue.addMutationBatch(e, r, o, t);
				})).next(((t) => {
					o = t;
					const r = t.applyToLocalDocumentSet(s, a);
					return n.documentOverlayCache.saveOverlays(e, t.batchId, r);
				}));
			})).then((() => ({
				batchId: o.batchId,
				changes: __PRIVATE_convertOverlayedDocumentMapToDocumentMap(s)
			})));
		}(r.localStore, t);
		r.sharedClientState.addPendingMutation(e.batchId), function __PRIVATE_addMutationCallback(e, t, n) {
			let r = e.du[e.currentUser.toKey()];
			r || (r = new SortedMap(__PRIVATE_primitiveComparator));
			r = r.insert(t, n), e.du[e.currentUser.toKey()] = r;
		}(r, e.batchId, n), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(r, e.changes), await __PRIVATE_fillWritePipeline(r.remoteStore);
	} catch (e) {
		const t = __PRIVATE_wrapInUserErrorIfRecoverable(e, "Failed to persist write");
		n.reject(t);
	}
}
/**
* Applies one remote event to the sync engine, notifying any views of the
* changes, and releasing any pending mutation batches that would become
* visible because of the snapshot version the remote event contains.
*/ async function __PRIVATE_syncEngineApplyRemoteEvent(e, t) {
	const n = __PRIVATE_debugCast(e);
	try {
		const e = await __PRIVATE_localStoreApplyRemoteEventToLocalCache(n.localStore, t);
		t.targetChanges.forEach(((e, t) => {
			const r = n.Au.get(t);
			r && (__PRIVATE_hardAssert(e.addedDocuments.size + e.modifiedDocuments.size + e.removedDocuments.size <= 1, 22616), e.addedDocuments.size > 0 ? r.hu = !0 : e.modifiedDocuments.size > 0 ? __PRIVATE_hardAssert(r.hu, 14607) : e.removedDocuments.size > 0 && (__PRIVATE_hardAssert(r.hu, 42227), r.hu = !1));
		})), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e, t);
	} catch (e) {
		await __PRIVATE_ignoreIfPrimaryLeaseLoss(e);
	}
}
/**
* Applies an OnlineState change to the sync engine and notifies any views of
* the change.
*/ function __PRIVATE_syncEngineApplyOnlineStateChange(e, t, n) {
	const r = __PRIVATE_debugCast(e);
	if (r.isPrimaryClient && 0 === n || !r.isPrimaryClient && 1 === n) {
		const e = [];
		r.Tu.forEach(((n, r) => {
			const i = r.view.va(t);
			i.snapshot && e.push(i.snapshot);
		})), function __PRIVATE_eventManagerOnOnlineStateChange(e, t) {
			const n = __PRIVATE_debugCast(e);
			n.onlineState = t;
			let r = !1;
			n.queries.forEach(((e, n) => {
				for (const e of n.Sa) e.va(t) && (r = !0);
			})), r && __PRIVATE_raiseSnapshotsInSyncEvent(n);
		}(r.eventManager, t), e.length && r.Pu.H_(e), r.onlineState = t, r.isPrimaryClient && r.sharedClientState.setOnlineState(t);
	}
}
/**
* Rejects the listen for the given targetID. This can be triggered by the
* backend for any active target.
*
* @param syncEngine - The sync engine implementation.
* @param targetId - The targetID corresponds to one previously initiated by the
* user as part of TargetData passed to listen() on RemoteStore.
* @param err - A description of the condition that has forced the rejection.
* Nearly always this will be an indication that the user is no longer
* authorized to see the data matching the target.
*/ async function __PRIVATE_syncEngineRejectListen(e, t, n) {
	const r = __PRIVATE_debugCast(e);
	r.sharedClientState.updateQueryState(t, "rejected", n);
	const i = r.Au.get(t), s = i && i.key;
	if (s) {
		let e = new SortedMap(DocumentKey.comparator);
		e = e.insert(s, MutableDocument.newNoDocument(s, SnapshotVersion.min()));
		const n = __PRIVATE_documentKeySet().add(s);
		await __PRIVATE_syncEngineApplyRemoteEvent(r, new RemoteEvent(SnapshotVersion.min(), /* @__PURE__ */ new Map(), new SortedMap(__PRIVATE_primitiveComparator), e, n)), r.Ru = r.Ru.remove(s), r.Au.delete(t), __PRIVATE_pumpEnqueuedLimboResolutions(r);
	} else await __PRIVATE_localStoreReleaseTarget(r.localStore, t, !1).then((() => __PRIVATE_removeAndCleanupTarget(r, t, n))).catch(__PRIVATE_ignoreIfPrimaryLeaseLoss);
}
async function __PRIVATE_syncEngineApplySuccessfulWrite(e, t) {
	const n = __PRIVATE_debugCast(e), r = t.batch.batchId;
	try {
		const e = await __PRIVATE_localStoreAcknowledgeBatch(n.localStore, t);
		__PRIVATE_processUserCallback(n, r, null), __PRIVATE_triggerPendingWritesCallbacks(n, r), n.sharedClientState.updateMutationState(r, "acknowledged"), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e);
	} catch (e) {
		await __PRIVATE_ignoreIfPrimaryLeaseLoss(e);
	}
}
async function __PRIVATE_syncEngineRejectFailedWrite(e, t, n) {
	const r = __PRIVATE_debugCast(e);
	try {
		const e = await function __PRIVATE_localStoreRejectBatch(e, t) {
			const n = __PRIVATE_debugCast(e);
			return n.persistence.runTransaction("Reject batch", "readwrite-primary", ((e) => {
				let r;
				return n.mutationQueue.lookupMutationBatch(e, t).next(((t) => (__PRIVATE_hardAssert(null !== t, 37113), r = t.keys(), n.mutationQueue.removeMutationBatch(e, t)))).next((() => n.mutationQueue.performConsistencyCheck(e))).next((() => n.documentOverlayCache.removeOverlaysForBatchId(e, r, t))).next((() => n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e, r))).next((() => n.localDocuments.getDocuments(e, r)));
			}));
		}(r.localStore, t);
		__PRIVATE_processUserCallback(r, t, n), __PRIVATE_triggerPendingWritesCallbacks(r, t), r.sharedClientState.updateMutationState(t, "rejected", n), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(r, e);
	} catch (n) {
		await __PRIVATE_ignoreIfPrimaryLeaseLoss(n);
	}
}
/**
* Triggers the callbacks that are waiting for this batch id to get acknowledged by server,
* if there are any.
*/ function __PRIVATE_triggerPendingWritesCallbacks(e, t) {
	(e.mu.get(t) || []).forEach(((e) => {
		e.resolve();
	})), e.mu.delete(t);
}
/** Reject all outstanding callbacks waiting for pending writes to complete. */ function __PRIVATE_processUserCallback(e, t, n) {
	const r = __PRIVATE_debugCast(e);
	let i = r.du[r.currentUser.toKey()];
	if (i) {
		const e = i.get(t);
		e && (n ? e.reject(n) : e.resolve(), i = i.remove(t)), r.du[r.currentUser.toKey()] = i;
	}
}
function __PRIVATE_removeAndCleanupTarget(e, t, n = null) {
	e.sharedClientState.removeLocalQueryTarget(t);
	for (const r of e.Eu.get(t)) e.Tu.delete(r), n && e.Pu.yu(r, n);
	if (e.Eu.delete(t), e.isPrimaryClient) e.Vu.Gr(t).forEach(((t) => {
		e.Vu.containsKey(t) || __PRIVATE_removeLimboTarget(e, t);
	}));
}
function __PRIVATE_removeLimboTarget(e, t) {
	e.Iu.delete(t.path.canonicalString());
	const n = e.Ru.get(t);
	null !== n && (__PRIVATE_remoteStoreUnlisten(e.remoteStore, n), e.Ru = e.Ru.remove(t), e.Au.delete(n), __PRIVATE_pumpEnqueuedLimboResolutions(e));
}
function __PRIVATE_updateTrackedLimbos(e, t, n) {
	for (const r of n) if (r instanceof __PRIVATE_AddedLimboDocument) e.Vu.addReference(r.key, t), __PRIVATE_trackLimboChange(e, r);
	else if (r instanceof __PRIVATE_RemovedLimboDocument) {
		__PRIVATE_logDebug(Zt, "Document no longer in limbo: " + r.key), e.Vu.removeReference(r.key, t);
		e.Vu.containsKey(r.key) || __PRIVATE_removeLimboTarget(e, r.key);
	} else fail(19791, { wu: r });
}
function __PRIVATE_trackLimboChange(e, t) {
	const n = t.key, r = n.path.canonicalString();
	e.Ru.get(n) || e.Iu.has(r) || (__PRIVATE_logDebug(Zt, "New document in limbo: " + n), e.Iu.add(r), __PRIVATE_pumpEnqueuedLimboResolutions(e));
}
/**
* Starts listens for documents in limbo that are enqueued for resolution,
* subject to a maximum number of concurrent resolutions.
*
* Without bounding the number of concurrent resolutions, the server can fail
* with "resource exhausted" errors which can lead to pathological client
* behavior as seen in https://github.com/firebase/firebase-js-sdk/issues/2683.
*/ function __PRIVATE_pumpEnqueuedLimboResolutions(e) {
	for (; e.Iu.size > 0 && e.Ru.size < e.maxConcurrentLimboResolutions;) {
		const t = e.Iu.values().next().value;
		e.Iu.delete(t);
		const n = new DocumentKey(ResourcePath.fromString(t)), r = e.fu.next();
		e.Au.set(r, new LimboResolution(n)), e.Ru = e.Ru.insert(n, r), __PRIVATE_remoteStoreListen(e.remoteStore, new TargetData(__PRIVATE_queryToTarget(__PRIVATE_newQueryForPath(n.path)), r, "TargetPurposeLimboResolution", __PRIVATE_ListenSequence.ce));
	}
}
async function __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(e, t, n) {
	const r = __PRIVATE_debugCast(e), i = [], s = [], o = [];
	r.Tu.isEmpty() || (r.Tu.forEach(((e, _) => {
		o.push(r.pu(_, t, n).then(((e) => {
			if ((e || n) && r.isPrimaryClient) {
				const t = e ? !e.fromCache : n?.targetChanges.get(_.targetId)?.current;
				r.sharedClientState.updateQueryState(_.targetId, t ? "current" : "not-current");
			}
			if (e) {
				i.push(e);
				const t = __PRIVATE_LocalViewChanges.Is(_.targetId, e);
				s.push(t);
			}
		})));
	})), await Promise.all(o), r.Pu.H_(i), await async function __PRIVATE_localStoreNotifyLocalViewChanges(e, t) {
		const n = __PRIVATE_debugCast(e);
		try {
			await n.persistence.runTransaction("notifyLocalViewChanges", "readwrite", ((e) => PersistencePromise.forEach(t, ((t) => PersistencePromise.forEach(t.Ts, ((r) => n.persistence.referenceDelegate.addReference(e, t.targetId, r))).next((() => PersistencePromise.forEach(t.Es, ((r) => n.persistence.referenceDelegate.removeReference(e, t.targetId, r)))))))));
		} catch (e) {
			if (!__PRIVATE_isIndexedDbTransactionError(e)) throw e;
			__PRIVATE_logDebug(Nt, "Failed to update sequence numbers: " + e);
		}
		for (const e of t) {
			const t = e.targetId;
			if (!e.fromCache) {
				const e = n.vs.get(t), r = e.snapshotVersion, i = e.withLastLimboFreeSnapshotVersion(r);
				n.vs = n.vs.insert(t, i);
			}
		}
	}(r.localStore, s));
}
async function __PRIVATE_syncEngineHandleCredentialChange(e, t) {
	const n = __PRIVATE_debugCast(e);
	if (!n.currentUser.isEqual(t)) {
		__PRIVATE_logDebug(Zt, "User change. New user:", t.toKey());
		const e = await __PRIVATE_localStoreHandleUserChange(n.localStore, t);
		n.currentUser = t, function __PRIVATE_rejectOutstandingPendingWritesCallbacks(e, t) {
			e.mu.forEach(((e) => {
				e.forEach(((e) => {
					e.reject(new FirestoreError(D.CANCELLED, t));
				}));
			})), e.mu.clear();
		}(n, "'waitForPendingWrites' promise is rejected due to a user change."), n.sharedClientState.handleUserChange(t, e.removedBatchIds, e.addedBatchIds), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e.Ns);
	}
}
function __PRIVATE_syncEngineGetRemoteKeysForTarget(e, t) {
	const n = __PRIVATE_debugCast(e), r = n.Au.get(t);
	if (r && r.hu) return __PRIVATE_documentKeySet().add(r.key);
	{
		let e = __PRIVATE_documentKeySet();
		const r = n.Eu.get(t);
		if (!r) return e;
		for (const t of r) {
			const r = n.Tu.get(t);
			e = e.unionWith(r.view.nu);
		}
		return e;
	}
}
function __PRIVATE_ensureWatchCallbacks(e) {
	const t = __PRIVATE_debugCast(e);
	return t.remoteStore.remoteSyncer.applyRemoteEvent = __PRIVATE_syncEngineApplyRemoteEvent.bind(null, t), t.remoteStore.remoteSyncer.getRemoteKeysForTarget = __PRIVATE_syncEngineGetRemoteKeysForTarget.bind(null, t), t.remoteStore.remoteSyncer.rejectListen = __PRIVATE_syncEngineRejectListen.bind(null, t), t.Pu.H_ = __PRIVATE_eventManagerOnWatchChange.bind(null, t.eventManager), t.Pu.yu = __PRIVATE_eventManagerOnWatchError.bind(null, t.eventManager), t;
}
function __PRIVATE_syncEngineEnsureWriteCallbacks(e) {
	const t = __PRIVATE_debugCast(e);
	return t.remoteStore.remoteSyncer.applySuccessfulWrite = __PRIVATE_syncEngineApplySuccessfulWrite.bind(null, t), t.remoteStore.remoteSyncer.rejectFailedWrite = __PRIVATE_syncEngineRejectFailedWrite.bind(null, t), t;
}
var __PRIVATE_MemoryOfflineComponentProvider = class {
	constructor() {
		this.kind = "memory", this.synchronizeTabs = !1;
	}
	async initialize(e) {
		this.serializer = __PRIVATE_newSerializer(e.databaseInfo.databaseId), this.sharedClientState = this.Du(e), this.persistence = this.Cu(e), await this.persistence.start(), this.localStore = this.vu(e), this.gcScheduler = this.Fu(e, this.localStore), this.indexBackfillerScheduler = this.Mu(e, this.localStore);
	}
	Fu(e, t) {
		return null;
	}
	Mu(e, t) {
		return null;
	}
	vu(e) {
		return __PRIVATE_newLocalStore(this.persistence, new __PRIVATE_QueryEngine(), e.initialUser, this.serializer);
	}
	Cu(e) {
		return new __PRIVATE_MemoryPersistence(__PRIVATE_MemoryEagerDelegate.Vi, this.serializer);
	}
	Du(e) {
		return new __PRIVATE_MemorySharedClientState();
	}
	async terminate() {
		this.gcScheduler?.stop(), this.indexBackfillerScheduler?.stop(), this.sharedClientState.shutdown(), await this.persistence.shutdown();
	}
};
__PRIVATE_MemoryOfflineComponentProvider.provider = { build: () => new __PRIVATE_MemoryOfflineComponentProvider() };
var __PRIVATE_LruGcMemoryOfflineComponentProvider = class extends __PRIVATE_MemoryOfflineComponentProvider {
	constructor(e) {
		super(), this.cacheSizeBytes = e;
	}
	Fu(e, t) {
		__PRIVATE_hardAssert(this.persistence.referenceDelegate instanceof __PRIVATE_MemoryLruDelegate, 46915);
		const n = this.persistence.referenceDelegate.garbageCollector;
		return new __PRIVATE_LruScheduler(n, e.asyncQueue, t);
	}
	Cu(e) {
		const t = void 0 !== this.cacheSizeBytes ? LruParams.withCacheSize(this.cacheSizeBytes) : LruParams.DEFAULT;
		return new __PRIVATE_MemoryPersistence(((e) => __PRIVATE_MemoryLruDelegate.Vi(e, t)), this.serializer);
	}
};
/**
* Initializes and wires the components that are needed to interface with the
* network.
*/ var OnlineComponentProvider = class {
	async initialize(e, t) {
		this.localStore || (this.localStore = e.localStore, this.sharedClientState = e.sharedClientState, this.datastore = this.createDatastore(t), this.remoteStore = this.createRemoteStore(t), this.eventManager = this.createEventManager(t), this.syncEngine = this.createSyncEngine(t, !e.synchronizeTabs), this.sharedClientState.onlineStateHandler = (e) => __PRIVATE_syncEngineApplyOnlineStateChange(this.syncEngine, e, 1), this.remoteStore.remoteSyncer.handleCredentialChange = __PRIVATE_syncEngineHandleCredentialChange.bind(null, this.syncEngine), await __PRIVATE_remoteStoreApplyPrimaryState(this.remoteStore, this.syncEngine.isPrimaryClient));
	}
	createEventManager(e) {
		return function __PRIVATE_newEventManager() {
			return new __PRIVATE_EventManagerImpl();
		}();
	}
	createDatastore(e) {
		const t = __PRIVATE_newSerializer(e.databaseInfo.databaseId), n = __PRIVATE_newConnection(e.databaseInfo);
		return __PRIVATE_newDatastore(e.authCredentials, e.appCheckCredentials, n, t);
	}
	createRemoteStore(e) {
		return function __PRIVATE_newRemoteStore(e, t, n, r, i) {
			return new __PRIVATE_RemoteStoreImpl(e, t, n, r, i);
		}(this.localStore, this.datastore, e.asyncQueue, ((e) => __PRIVATE_syncEngineApplyOnlineStateChange(this.syncEngine, e, 0)), function __PRIVATE_newConnectivityMonitor() {
			return __PRIVATE_BrowserConnectivityMonitor.v() ? new __PRIVATE_BrowserConnectivityMonitor() : new __PRIVATE_NoopConnectivityMonitor();
		}());
	}
	createSyncEngine(e, t) {
		return function __PRIVATE_newSyncEngine(e, t, n, r, i, s, o) {
			const _ = new __PRIVATE_SyncEngineImpl(e, t, n, r, i, s);
			return o && (_.gu = !0), _;
		}(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, e.initialUser, e.maxConcurrentLimboResolutions, t);
	}
	async terminate() {
		await async function __PRIVATE_remoteStoreShutdown(e) {
			const t = __PRIVATE_debugCast(e);
			__PRIVATE_logDebug(jt, "RemoteStore shutting down."), t.Ia.add(5), await __PRIVATE_disableNetworkInternal(t), t.Aa.shutdown(), t.Va.set("Unknown");
		}(this.remoteStore), this.datastore?.terminate(), this.eventManager?.terminate();
	}
};
OnlineComponentProvider.provider = { build: () => new OnlineComponentProvider() };
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* On web, a `ReadableStream` is wrapped around by a `ByteStreamReader`.
*/
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var __PRIVATE_AsyncObserver = class {
	constructor(e) {
		this.observer = e, this.muted = !1;
	}
	next(e) {
		this.muted || this.observer.next && this.Ou(this.observer.next, e);
	}
	error(e) {
		this.muted || (this.observer.error ? this.Ou(this.observer.error, e) : __PRIVATE_logError("Uncaught Error in snapshot listener:", e.toString()));
	}
	Nu() {
		this.muted = !0;
	}
	Ou(e, t) {
		setTimeout((() => {
			this.muted || e(t);
		}), 0);
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var Xt = "FirestoreClient";
/**
* FirestoreClient is a top-level class that constructs and owns all of the //
* pieces of the client SDK architecture. It is responsible for creating the //
* async queue that is shared by all of the other components in the system. //
*/
var FirestoreClient = class {
	constructor(e, t, n, r, i) {
		this.authCredentials = e, this.appCheckCredentials = t, this.asyncQueue = n, this._databaseInfo = r, this.user = User.UNAUTHENTICATED, this.clientId = __PRIVATE_AutoId.newId(), this.authCredentialListener = () => Promise.resolve(), this.appCheckCredentialListener = () => Promise.resolve(), this._uninitializedComponentsProvider = i, this.authCredentials.start(n, (async (e) => {
			__PRIVATE_logDebug(Xt, "Received user=", e.uid), await this.authCredentialListener(e), this.user = e;
		})), this.appCheckCredentials.start(n, ((e) => (__PRIVATE_logDebug(Xt, "Received new app check token=", e), this.appCheckCredentialListener(e, this.user))));
	}
	get configuration() {
		return {
			asyncQueue: this.asyncQueue,
			databaseInfo: this._databaseInfo,
			clientId: this.clientId,
			authCredentials: this.authCredentials,
			appCheckCredentials: this.appCheckCredentials,
			initialUser: this.user,
			maxConcurrentLimboResolutions: 100
		};
	}
	setCredentialChangeListener(e) {
		this.authCredentialListener = e;
	}
	setAppCheckTokenChangeListener(e) {
		this.appCheckCredentialListener = e;
	}
	terminate() {
		this.asyncQueue.enterRestrictedMode();
		const e = new __PRIVATE_Deferred();
		return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async () => {
			try {
				this._onlineComponents && await this._onlineComponents.terminate(), this._offlineComponents && await this._offlineComponents.terminate(), this.authCredentials.shutdown(), this.appCheckCredentials.shutdown(), e.resolve();
			} catch (t) {
				const n = __PRIVATE_wrapInUserErrorIfRecoverable(t, "Failed to shutdown persistence");
				e.reject(n);
			}
		})), e.promise;
	}
};
async function __PRIVATE_setOfflineComponentProvider(e, t) {
	e.asyncQueue.verifyOperationInProgress(), __PRIVATE_logDebug(Xt, "Initializing OfflineComponentProvider");
	const n = e.configuration;
	await t.initialize(n);
	let r = n.initialUser;
	e.setCredentialChangeListener((async (e) => {
		r.isEqual(e) || (await __PRIVATE_localStoreHandleUserChange(t.localStore, e), r = e);
	})), t.persistence.setDatabaseDeletedListener((() => e.terminate())), e._offlineComponents = t;
}
async function __PRIVATE_setOnlineComponentProvider(e, t) {
	e.asyncQueue.verifyOperationInProgress();
	const n = await __PRIVATE_ensureOfflineComponents(e);
	__PRIVATE_logDebug(Xt, "Initializing OnlineComponentProvider"), await t.initialize(n, e.configuration), e.setCredentialChangeListener(((e) => __PRIVATE_remoteStoreHandleCredentialChange(t.remoteStore, e))), e.setAppCheckTokenChangeListener(((e, n) => __PRIVATE_remoteStoreHandleCredentialChange(t.remoteStore, n))), e._onlineComponents = t;
}
/**
* Decides whether the provided error allows us to gracefully disable
* persistence (as opposed to crashing the client).
*/ async function __PRIVATE_ensureOfflineComponents(e) {
	if (!e._offlineComponents) if (e._uninitializedComponentsProvider) {
		__PRIVATE_logDebug(Xt, "Using user provided OfflineComponentProvider");
		try {
			await __PRIVATE_setOfflineComponentProvider(e, e._uninitializedComponentsProvider._offline);
		} catch (t) {
			const n = t;
			if (!function __PRIVATE_canFallbackFromIndexedDbError(e) {
				return "FirebaseError" === e.name ? e.code === D.FAILED_PRECONDITION || e.code === D.UNIMPLEMENTED : !("undefined" != typeof DOMException && e instanceof DOMException) || 22 === e.code || 20 === e.code || 11 === e.code;
			}(n)) throw n;
			__PRIVATE_logWarn("Error using user provided cache. Falling back to memory cache: " + n), await __PRIVATE_setOfflineComponentProvider(e, new __PRIVATE_MemoryOfflineComponentProvider());
		}
	} else __PRIVATE_logDebug(Xt, "Using default OfflineComponentProvider"), await __PRIVATE_setOfflineComponentProvider(e, new __PRIVATE_LruGcMemoryOfflineComponentProvider(void 0));
	return e._offlineComponents;
}
async function __PRIVATE_ensureOnlineComponents(e) {
	return e._onlineComponents || (e._uninitializedComponentsProvider ? (__PRIVATE_logDebug(Xt, "Using user provided OnlineComponentProvider"), await __PRIVATE_setOnlineComponentProvider(e, e._uninitializedComponentsProvider._online)) : (__PRIVATE_logDebug(Xt, "Using default OnlineComponentProvider"), await __PRIVATE_setOnlineComponentProvider(e, new OnlineComponentProvider()))), e._onlineComponents;
}
function __PRIVATE_getSyncEngine(e) {
	return __PRIVATE_ensureOnlineComponents(e).then(((e) => e.syncEngine));
}
async function __PRIVATE_getEventManager(e) {
	const t = await __PRIVATE_ensureOnlineComponents(e), n = t.eventManager;
	return n.onListen = __PRIVATE_syncEngineListen.bind(null, t.syncEngine), n.onUnlisten = __PRIVATE_syncEngineUnlisten.bind(null, t.syncEngine), n.onFirstRemoteStoreListen = __PRIVATE_triggerRemoteStoreListen.bind(null, t.syncEngine), n.onLastRemoteStoreUnlisten = __PRIVATE_triggerRemoteStoreUnlisten.bind(null, t.syncEngine), n;
}
/**
* Returns a Promise that resolves when all writes that were pending at the time
* this method was called received server acknowledgement. An acknowledgement
* can be either acceptance or rejection.
*/ function __PRIVATE_firestoreClientListen(e, t, n, r) {
	const i = new __PRIVATE_AsyncObserver(r), s = new __PRIVATE_QueryListener(t, i, n);
	return e.asyncQueue.enqueueAndForget((async () => __PRIVATE_eventManagerListen(await __PRIVATE_getEventManager(e), s))), () => {
		i.Nu(), e.asyncQueue.enqueueAndForget((async () => __PRIVATE_eventManagerUnlisten(await __PRIVATE_getEventManager(e), s)));
	};
}
function __PRIVATE_firestoreClientGetDocumentViaSnapshotListener(e, t, n = {}) {
	const r = new __PRIVATE_Deferred();
	return e.asyncQueue.enqueueAndForget((async () => function __PRIVATE_readDocumentViaSnapshotListener(e, t, n, r, i) {
		const s = new __PRIVATE_AsyncObserver({
			next: (_) => {
				s.Nu(), t.enqueueAndForget((() => __PRIVATE_eventManagerUnlisten(e, o)));
				const a = _.docs.has(n);
				!a && _.fromCache ? i.reject(new FirestoreError(D.UNAVAILABLE, "Failed to get document because the client is offline.")) : a && _.fromCache && r && "server" === r.source ? i.reject(new FirestoreError(D.UNAVAILABLE, "Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to \"server\" to retrieve the cached document.)")) : i.resolve(_);
			},
			error: (e) => i.reject(e)
		}), o = new __PRIVATE_QueryListener(__PRIVATE_newQueryForPath(n.path), s, {
			includeMetadataChanges: !0,
			qa: !0
		});
		return __PRIVATE_eventManagerListen(e, o);
	}(await __PRIVATE_getEventManager(e), e.asyncQueue, t, n, r))), r.promise;
}
function __PRIVATE_firestoreClientWrite(e, t) {
	const n = new __PRIVATE_Deferred();
	return e.asyncQueue.enqueueAndForget((async () => __PRIVATE_syncEngineWrite(await __PRIVATE_getSyncEngine(e), t, n))), n.promise;
}
/**
* @license
* Copyright 2023 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Compares two `ExperimentalLongPollingOptions` objects for equality.
*/
/**
* Creates and returns a new `ExperimentalLongPollingOptions` with the same
* option values as the given instance.
*/
function __PRIVATE_cloneLongPollingOptions(e) {
	const t = {};
	return void 0 !== e.timeoutSeconds && (t.timeoutSeconds = e.timeoutSeconds), t;
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var Yt = "ComponentProvider", en = /* @__PURE__ */ new Map();
/**
* An instance map that ensures only one Datastore exists per Firestore
* instance.
*/ function __PRIVATE_makeDatabaseInfo(e, t, n, r, i) {
	return new DatabaseInfo(e, t, n, i.host, i.ssl, i.experimentalForceLongPolling, i.experimentalAutoDetectLongPolling, __PRIVATE_cloneLongPollingOptions(i.experimentalLongPollingOptions), i.useFetchStreams, i.isUsingEmulator, r);
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var tn = "firestore.googleapis.com", nn = !0;
/**
* A concrete type describing all the values that can be applied via a
* user-supplied `FirestoreSettings` object. This is a separate type so that
* defaults can be supplied and the value can be checked for equality.
*/
var FirestoreSettingsImpl = class {
	constructor(e) {
		if (void 0 === e.host) {
			if (void 0 !== e.ssl) throw new FirestoreError(D.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
			this.host = tn, this.ssl = nn;
		} else this.host = e.host, this.ssl = e.ssl ?? nn;
		if (this.isUsingEmulator = void 0 !== e.emulatorOptions, this.credentials = e.credentials, this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties, this.localCache = e.localCache, void 0 === e.cacheSizeBytes) this.cacheSizeBytes = St;
		else {
			if (-1 !== e.cacheSizeBytes && e.cacheSizeBytes < Ct) throw new FirestoreError(D.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
			this.cacheSizeBytes = e.cacheSizeBytes;
		}
		__PRIVATE_validateIsNotUsedTogether("experimentalForceLongPolling", e.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", e.experimentalAutoDetectLongPolling), this.experimentalForceLongPolling = !!e.experimentalForceLongPolling, this.experimentalForceLongPolling ? this.experimentalAutoDetectLongPolling = !1 : void 0 === e.experimentalAutoDetectLongPolling ? this.experimentalAutoDetectLongPolling = true : this.experimentalAutoDetectLongPolling = !!e.experimentalAutoDetectLongPolling, this.experimentalLongPollingOptions = __PRIVATE_cloneLongPollingOptions(e.experimentalLongPollingOptions ?? {}), function __PRIVATE_validateLongPollingOptions(e) {
			if (void 0 !== e.timeoutSeconds) {
				if (isNaN(e.timeoutSeconds)) throw new FirestoreError(D.INVALID_ARGUMENT, `invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);
				if (e.timeoutSeconds < 5) throw new FirestoreError(D.INVALID_ARGUMENT, `invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);
				if (e.timeoutSeconds > 30) throw new FirestoreError(D.INVALID_ARGUMENT, `invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`);
			}
		}(this.experimentalLongPollingOptions), this.useFetchStreams = !!e.useFetchStreams;
	}
	isEqual(e) {
		return this.host === e.host && this.ssl === e.ssl && this.credentials === e.credentials && this.cacheSizeBytes === e.cacheSizeBytes && this.experimentalForceLongPolling === e.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === e.experimentalAutoDetectLongPolling && function __PRIVATE_longPollingOptionsEqual(e, t) {
			return e.timeoutSeconds === t.timeoutSeconds;
		}(this.experimentalLongPollingOptions, e.experimentalLongPollingOptions) && this.ignoreUndefinedProperties === e.ignoreUndefinedProperties && this.useFetchStreams === e.useFetchStreams;
	}
};
var Firestore$1 = class {
	/** @hideconstructor */
	constructor(e, t, n, r) {
		this._authCredentials = e, this._appCheckCredentials = t, this._databaseId = n, this._app = r, this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new FirestoreSettingsImpl({}), this._settingsFrozen = !1, this._emulatorOptions = {}, this._terminateTask = "notTerminated";
	}
	/**
	* The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
	* instance.
	*/ get app() {
		if (!this._app) throw new FirestoreError(D.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
		return this._app;
	}
	get _initialized() {
		return this._settingsFrozen;
	}
	get _terminated() {
		return "notTerminated" !== this._terminateTask;
	}
	_setSettings(e) {
		if (this._settingsFrozen) throw new FirestoreError(D.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
		this._settings = new FirestoreSettingsImpl(e), this._emulatorOptions = e.emulatorOptions || {}, void 0 !== e.credentials && (this._authCredentials = function __PRIVATE_makeAuthCredentialsProvider(e) {
			if (!e) return new __PRIVATE_EmptyAuthCredentialsProvider();
			switch (e.type) {
				case "firstParty": return new __PRIVATE_FirstPartyAuthCredentialsProvider(e.sessionIndex || "0", e.iamToken || null, e.authTokenFactory || null);
				case "provider": return e.client;
				default: throw new FirestoreError(D.INVALID_ARGUMENT, "makeAuthCredentialsProvider failed due to invalid credential type");
			}
		}(e.credentials));
	}
	_getSettings() {
		return this._settings;
	}
	_getEmulatorOptions() {
		return this._emulatorOptions;
	}
	_freezeSettings() {
		return this._settingsFrozen = !0, this._settings;
	}
	_delete() {
		return "notTerminated" === this._terminateTask && (this._terminateTask = this._terminate()), this._terminateTask;
	}
	async _restart() {
		"notTerminated" === this._terminateTask ? await this._terminate() : this._terminateTask = "notTerminated";
	}
	/** Returns a JSON-serializable representation of this `Firestore` instance. */ toJSON() {
		return {
			app: this._app,
			databaseId: this._databaseId,
			settings: this._settings
		};
	}
	/**
	* Terminates all components used by this client. Subclasses can override
	* this method to clean up their own dependencies, but must also call this
	* method.
	*
	* Only ever called once.
	*/ _terminate() {
		/**
		* Removes all components associated with the provided instance. Must be called
		* when the `Firestore` instance is terminated.
		*/
		return function __PRIVATE_removeComponents(e) {
			const t = en.get(e);
			t && (__PRIVATE_logDebug(Yt, "Removing Datastore"), en.delete(e), t.terminate());
		}(this), Promise.resolve();
	}
};
/**
* Modify this instance to communicate with the Cloud Firestore emulator.
*
* Note: This must be called before this instance has been used to do any
* operations.
*
* @param firestore - The `Firestore` instance to configure to connect to the
* emulator.
* @param host - the emulator host (ex: localhost).
* @param port - the emulator port (ex: 9000).
* @param options.mockUserToken - the mock auth token to use for unit testing
* Security Rules.
*/ function connectFirestoreEmulator(e, t, n, r = {}) {
	e = __PRIVATE_cast(e, Firestore$1);
	const i = isCloudWorkstation(t), s = e._getSettings(), o = {
		...s,
		emulatorOptions: e._getEmulatorOptions()
	}, _ = `${t}:${n}`;
	i && pingServer(`https://${_}`), s.host !== tn && s.host !== _ && __PRIVATE_logWarn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");
	const a = {
		...s,
		host: _,
		ssl: i,
		emulatorOptions: r
	};
	if (!deepEqual(a, o) && (e._setSettings(a), r.mockUserToken)) {
		let t, n;
		if ("string" == typeof r.mockUserToken) t = r.mockUserToken, n = User.MOCK_USER;
		else {
			t = createMockUserToken(r.mockUserToken, e._app?.options.projectId);
			const i = r.mockUserToken.sub || r.mockUserToken.user_id;
			if (!i) throw new FirestoreError(D.INVALID_ARGUMENT, "mockUserToken must contain 'sub' or 'user_id' field!");
			n = new User(i);
		}
		e._authCredentials = new __PRIVATE_EmulatorAuthCredentialsProvider(new __PRIVATE_OAuthToken(t, n));
	}
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* A `Query` refers to a query which you can read or listen to. You can also
* construct refined `Query` objects by adding filters and ordering.
*/ var Query = class Query {
	/** @hideconstructor protected */
	constructor(e, t, n) {
		this.converter = t, this._query = n, this.type = "query", this.firestore = e;
	}
	withConverter(e) {
		return new Query(this.firestore, e, this._query);
	}
};
/**
* A `DocumentReference` refers to a document location in a Firestore database
* and can be used to write, read, or listen to the location. The document at
* the referenced location may or may not exist.
*/ var DocumentReference = class DocumentReference {
	/** @hideconstructor */
	constructor(e, t, n) {
		this.converter = t, this._key = n, this.type = "document", this.firestore = e;
	}
	get _path() {
		return this._key.path;
	}
	/**
	* The document's identifier within its collection.
	*/ get id() {
		return this._key.path.lastSegment();
	}
	/**
	* A string representing the path of the referenced document (relative
	* to the root of the database).
	*/ get path() {
		return this._key.path.canonicalString();
	}
	/**
	* The collection this `DocumentReference` belongs to.
	*/ get parent() {
		return new CollectionReference(this.firestore, this.converter, this._key.path.popLast());
	}
	withConverter(e) {
		return new DocumentReference(this.firestore, e, this._key);
	}
	/**
	* Returns a JSON-serializable representation of this `DocumentReference` instance.
	*
	* @returns a JSON representation of this object.
	*/ toJSON() {
		return {
			type: DocumentReference._jsonSchemaVersion,
			referencePath: this._key.toString()
		};
	}
	static fromJSON(e, t, n) {
		if (__PRIVATE_validateJSON(t, DocumentReference._jsonSchema)) return new DocumentReference(e, n || null, new DocumentKey(ResourcePath.fromString(t.referencePath)));
	}
};
DocumentReference._jsonSchemaVersion = "firestore/documentReference/1.0", DocumentReference._jsonSchema = {
	type: property("string", DocumentReference._jsonSchemaVersion),
	referencePath: property("string")
};
/**
* A `CollectionReference` object can be used for adding documents, getting
* document references, and querying for documents (using {@link (query:1)}).
*/
var CollectionReference = class CollectionReference extends Query {
	/** @hideconstructor */
	constructor(e, t, n) {
		super(e, t, __PRIVATE_newQueryForPath(n)), this._path = n, this.type = "collection";
	}
	/** The collection's identifier. */ get id() {
		return this._query.path.lastSegment();
	}
	/**
	* A string representing the path of the referenced collection (relative
	* to the root of the database).
	*/ get path() {
		return this._query.path.canonicalString();
	}
	/**
	* A reference to the containing `DocumentReference` if this is a
	* subcollection. If this isn't a subcollection, the reference is null.
	*/ get parent() {
		const e = this._path.popLast();
		return e.isEmpty() ? null : new DocumentReference(this.firestore, null, new DocumentKey(e));
	}
	withConverter(e) {
		return new CollectionReference(this.firestore, e, this._path);
	}
};
function collection(e, t, ...n) {
	if (e = getModularInstance(e), __PRIVATE_validateNonEmptyArgument("collection", "path", t), e instanceof Firestore$1) {
		const r = ResourcePath.fromString(t, ...n);
		return __PRIVATE_validateCollectionPath(r), new CollectionReference(e, null, r);
	}
	{
		if (!(e instanceof DocumentReference || e instanceof CollectionReference)) throw new FirestoreError(D.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
		const r = e._path.child(ResourcePath.fromString(t, ...n));
		return __PRIVATE_validateCollectionPath(r), new CollectionReference(e.firestore, null, r);
	}
}
function doc(e, t, ...n) {
	if (e = getModularInstance(e), 1 === arguments.length && (t = __PRIVATE_AutoId.newId()), __PRIVATE_validateNonEmptyArgument("doc", "path", t), e instanceof Firestore$1) {
		const r = ResourcePath.fromString(t, ...n);
		return __PRIVATE_validateDocumentPath(r), new DocumentReference(e, null, new DocumentKey(r));
	}
	{
		if (!(e instanceof DocumentReference || e instanceof CollectionReference)) throw new FirestoreError(D.INVALID_ARGUMENT, "Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
		const r = e._path.child(ResourcePath.fromString(t, ...n));
		return __PRIVATE_validateDocumentPath(r), new DocumentReference(e.firestore, e instanceof CollectionReference ? e.converter : null, new DocumentKey(r));
	}
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var rn = "AsyncQueue";
var __PRIVATE_AsyncQueueImpl = class {
	constructor(e = Promise.resolve()) {
		this.Yu = [], this.ec = !1, this.tc = [], this.nc = null, this.rc = !1, this.sc = !1, this.oc = [], this.M_ = new __PRIVATE_ExponentialBackoff(this, "async_queue_retry"), this._c = () => {
			const e = getDocument();
			e && __PRIVATE_logDebug(rn, "Visibility state changed to " + e.visibilityState), this.M_.w_();
		}, this.ac = e;
		const t = getDocument();
		t && "function" == typeof t.addEventListener && t.addEventListener("visibilitychange", this._c);
	}
	get isShuttingDown() {
		return this.ec;
	}
	/**
	* Adds a new operation to the queue without waiting for it to complete (i.e.
	* we ignore the Promise result).
	*/ enqueueAndForget(e) {
		this.enqueue(e);
	}
	enqueueAndForgetEvenWhileRestricted(e) {
		this.uc(), this.cc(e);
	}
	enterRestrictedMode(e) {
		if (!this.ec) {
			this.ec = !0, this.sc = e || !1;
			const t = getDocument();
			t && "function" == typeof t.removeEventListener && t.removeEventListener("visibilitychange", this._c);
		}
	}
	enqueue(e) {
		if (this.uc(), this.ec) return new Promise((() => {}));
		const t = new __PRIVATE_Deferred();
		return this.cc((() => this.ec && this.sc ? Promise.resolve() : (e().then(t.resolve, t.reject), t.promise))).then((() => t.promise));
	}
	enqueueRetryable(e) {
		this.enqueueAndForget((() => (this.Yu.push(e), this.lc())));
	}
	/**
	* Runs the next operation from the retryable queue. If the operation fails,
	* reschedules with backoff.
	*/ async lc() {
		if (0 !== this.Yu.length) {
			try {
				await this.Yu[0](), this.Yu.shift(), this.M_.reset();
			} catch (e) {
				if (!__PRIVATE_isIndexedDbTransactionError(e)) throw e;
				__PRIVATE_logDebug(rn, "Operation failed with retryable error: " + e);
			}
			this.Yu.length > 0 && this.M_.p_((() => this.lc()));
		}
	}
	cc(e) {
		const t = this.ac.then((() => (this.rc = !0, e().catch(((e) => {
			this.nc = e, this.rc = !1;
			throw __PRIVATE_logError("INTERNAL UNHANDLED ERROR: ", __PRIVATE_getMessageOrStack(e)), e;
		})).then(((e) => (this.rc = !1, e))))));
		return this.ac = t, t;
	}
	enqueueAfterDelay(e, t, n) {
		this.uc(), this.oc.indexOf(e) > -1 && (t = 0);
		const r = DelayedOperation.createAndSchedule(this, e, t, n, ((e) => this.hc(e)));
		return this.tc.push(r), r;
	}
	uc() {
		this.nc && fail(47125, { Pc: __PRIVATE_getMessageOrStack(this.nc) });
	}
	verifyOperationInProgress() {}
	/**
	* Waits until all currently queued tasks are finished executing. Delayed
	* operations are not run.
	*/ async Tc() {
		let e;
		do
			e = this.ac, await e;
		while (e !== this.ac);
	}
	/**
	* For Tests: Determine if a delayed operation with a particular TimerId
	* exists.
	*/ Ec(e) {
		for (const t of this.tc) if (t.timerId === e) return !0;
		return !1;
	}
	/**
	* For Tests: Runs some or all delayed operations early.
	*
	* @param lastTimerId - Delayed operations up to and including this TimerId
	* will be drained. Pass TimerId.All to run all delayed operations.
	* @returns a Promise that resolves once all operations have been run.
	*/ Ic(e) {
		return this.Tc().then((() => {
			this.tc.sort(((e, t) => e.targetTimeMs - t.targetTimeMs));
			for (const t of this.tc) if (t.skipDelay(), "all" !== e && t.timerId === e) break;
			return this.Tc();
		}));
	}
	/**
	* For Tests: Skip all subsequent delays for a timer id.
	*/ Rc(e) {
		this.oc.push(e);
	}
	/** Called once a DelayedOperation is run or canceled. */ hc(e) {
		const t = this.tc.indexOf(e);
		this.tc.splice(t, 1);
	}
};
/**
* Chrome includes Error.message in Error.stack. Other browsers do not.
* This returns expected output of message + stack when available.
* @param error - Error or FirestoreError
*/ function __PRIVATE_getMessageOrStack(e) {
	let t = e.message || "";
	return e.stack && (t = e.stack.includes(e.message) ? e.stack : e.message + "\n" + e.stack), t;
}
/**
* The Cloud Firestore service interface.
*
* Do not call this constructor directly. Instead, use {@link (getFirestore:1)}.
*/ var Firestore = class extends Firestore$1 {
	/** @hideconstructor */
	constructor(e, t, n, r) {
		super(e, t, n, r), this.type = "firestore", this._queue = new __PRIVATE_AsyncQueueImpl(), this._persistenceKey = r?.name || "[DEFAULT]";
	}
	async _terminate() {
		if (this._firestoreClient) {
			const e = this._firestoreClient.terminate();
			this._queue = new __PRIVATE_AsyncQueueImpl(e), this._firestoreClient = void 0, await e;
		}
	}
};
function getFirestore(e, n) {
	const r = "object" == typeof e ? e : getApp(), i = "string" == typeof e ? e : n || it, s = _getProvider(r, "firestore").getImmediate({ identifier: i });
	if (!s._initialized) {
		const e = getDefaultEmulatorHostnameAndPort("firestore");
		e && connectFirestoreEmulator(s, ...e);
	}
	return s;
}
/**
* @internal
*/ function ensureFirestoreConfigured(e) {
	if (e._terminated) throw new FirestoreError(D.FAILED_PRECONDITION, "The client has already been terminated.");
	return e._firestoreClient || __PRIVATE_configureFirestore(e), e._firestoreClient;
}
function __PRIVATE_configureFirestore(e) {
	const t = e._freezeSettings(), n = __PRIVATE_makeDatabaseInfo(e._databaseId, e._app?.options.appId || "", e._persistenceKey, e._app?.options.apiKey, t);
	e._componentsProvider || t.localCache?._offlineComponentProvider && t.localCache?._onlineComponentProvider && (e._componentsProvider = {
		_offline: t.localCache._offlineComponentProvider,
		_online: t.localCache._onlineComponentProvider
	}), e._firestoreClient = new FirestoreClient(e._authCredentials, e._appCheckCredentials, e._queue, n, e._componentsProvider && function __PRIVATE_buildComponentProvider(e) {
		const t = e?._online.build();
		return {
			_offline: e?._offline.build(t),
			_online: t
		};
	}(e._componentsProvider));
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* An immutable object representing an array of bytes.
*/ var Bytes = class Bytes {
	/** @hideconstructor */
	constructor(e) {
		this._byteString = e;
	}
	/**
	* Creates a new `Bytes` object from the given Base64 string, converting it to
	* bytes.
	*
	* @param base64 - The Base64 string used to create the `Bytes` object.
	*/ static fromBase64String(e) {
		try {
			return new Bytes(ByteString.fromBase64String(e));
		} catch (e) {
			throw new FirestoreError(D.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + e);
		}
	}
	/**
	* Creates a new `Bytes` object from the given Uint8Array.
	*
	* @param array - The Uint8Array used to create the `Bytes` object.
	*/ static fromUint8Array(e) {
		return new Bytes(ByteString.fromUint8Array(e));
	}
	/**
	* Returns the underlying bytes as a Base64-encoded string.
	*
	* @returns The Base64-encoded string created from the `Bytes` object.
	*/ toBase64() {
		return this._byteString.toBase64();
	}
	/**
	* Returns the underlying bytes in a new `Uint8Array`.
	*
	* @returns The Uint8Array created from the `Bytes` object.
	*/ toUint8Array() {
		return this._byteString.toUint8Array();
	}
	/**
	* Returns a string representation of the `Bytes` object.
	*
	* @returns A string representation of the `Bytes` object.
	*/ toString() {
		return "Bytes(base64: " + this.toBase64() + ")";
	}
	/**
	* Returns true if this `Bytes` object is equal to the provided one.
	*
	* @param other - The `Bytes` object to compare against.
	* @returns true if this `Bytes` object is equal to the provided one.
	*/ isEqual(e) {
		return this._byteString.isEqual(e._byteString);
	}
	/**
	* Returns a JSON-serializable representation of this `Bytes` instance.
	*
	* @returns a JSON representation of this object.
	*/ toJSON() {
		return {
			type: Bytes._jsonSchemaVersion,
			bytes: this.toBase64()
		};
	}
	/**
	* Builds a `Bytes` instance from a JSON object created by {@link Bytes.toJSON}.
	*
	* @param json - a JSON object represention of a `Bytes` instance
	* @returns an instance of {@link Bytes} if the JSON object could be parsed. Throws a
	* {@link FirestoreError} if an error occurs.
	*/ static fromJSON(e) {
		if (__PRIVATE_validateJSON(e, Bytes._jsonSchema)) return Bytes.fromBase64String(e.bytes);
	}
};
Bytes._jsonSchemaVersion = "firestore/bytes/1.0", Bytes._jsonSchema = {
	type: property("string", Bytes._jsonSchemaVersion),
	bytes: property("string")
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* A `FieldPath` refers to a field in a document. The path may consist of a
* single field name (referring to a top-level field in the document), or a
* list of field names (referring to a nested field in the document).
*
* Create a `FieldPath` by providing field names. If more than one field
* name is provided, the path will point to a nested field in a document.
*/
var FieldPath = class {
	/**
	* Creates a `FieldPath` from the provided field names. If more than one field
	* name is provided, the path will point to a nested field in a document.
	*
	* @param fieldNames - A list of field names.
	*/
	constructor(...e) {
		for (let t = 0; t < e.length; ++t) if (0 === e[t].length) throw new FirestoreError(D.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
		this._internalPath = new FieldPath$1(e);
	}
	/**
	* Returns true if this `FieldPath` is equal to the provided one.
	*
	* @param other - The `FieldPath` to compare against.
	* @returns true if this `FieldPath` is equal to the provided one.
	*/ isEqual(e) {
		return this._internalPath.isEqual(e._internalPath);
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Sentinel values that can be used when writing document fields with `set()`
* or `update()`.
*/ var FieldValue = class {
	/**
	* @param _methodName - The public API endpoint that returns this class.
	* @hideconstructor
	*/
	constructor(e) {
		this._methodName = e;
	}
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* An immutable object representing a geographic location in Firestore. The
* location is represented as latitude/longitude pair.
*
* Latitude values are in the range of [-90, 90].
* Longitude values are in the range of [-180, 180].
*/ var GeoPoint = class GeoPoint {
	/**
	* Creates a new immutable `GeoPoint` object with the provided latitude and
	* longitude values.
	* @param latitude - The latitude as number between -90 and 90.
	* @param longitude - The longitude as number between -180 and 180.
	*/
	constructor(e, t) {
		if (!isFinite(e) || e < -90 || e > 90) throw new FirestoreError(D.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + e);
		if (!isFinite(t) || t < -180 || t > 180) throw new FirestoreError(D.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + t);
		this._lat = e, this._long = t;
	}
	/**
	* The latitude of this `GeoPoint` instance.
	*/ get latitude() {
		return this._lat;
	}
	/**
	* The longitude of this `GeoPoint` instance.
	*/ get longitude() {
		return this._long;
	}
	/**
	* Returns true if this `GeoPoint` is equal to the provided one.
	*
	* @param other - The `GeoPoint` to compare against.
	* @returns true if this `GeoPoint` is equal to the provided one.
	*/ isEqual(e) {
		return this._lat === e._lat && this._long === e._long;
	}
	/**
	* Actually private to JS consumers of our API, so this function is prefixed
	* with an underscore.
	*/ _compareTo(e) {
		return __PRIVATE_primitiveComparator(this._lat, e._lat) || __PRIVATE_primitiveComparator(this._long, e._long);
	}
	/**
	* Returns a JSON-serializable representation of this `GeoPoint` instance.
	*
	* @returns a JSON representation of this object.
	*/ toJSON() {
		return {
			latitude: this._lat,
			longitude: this._long,
			type: GeoPoint._jsonSchemaVersion
		};
	}
	/**
	* Builds a `GeoPoint` instance from a JSON object created by {@link GeoPoint.toJSON}.
	*
	* @param json - a JSON object represention of a `GeoPoint` instance
	* @returns an instance of {@link GeoPoint} if the JSON object could be parsed. Throws a
	* {@link FirestoreError} if an error occurs.
	*/ static fromJSON(e) {
		if (__PRIVATE_validateJSON(e, GeoPoint._jsonSchema)) return new GeoPoint(e.latitude, e.longitude);
	}
};
GeoPoint._jsonSchemaVersion = "firestore/geoPoint/1.0", GeoPoint._jsonSchema = {
	type: property("string", GeoPoint._jsonSchemaVersion),
	latitude: property("number"),
	longitude: property("number")
};
/**
* @license
* Copyright 2024 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Represents a vector type in Firestore documents.
* Create an instance with <code>{@link vector}</code>.
*/
var VectorValue = class VectorValue {
	/**
	* @private
	* @internal
	*/
	constructor(e) {
		this._values = (e || []).map(((e) => e));
	}
	/**
	* Returns a copy of the raw number array form of the vector.
	*/ toArray() {
		return this._values.map(((e) => e));
	}
	/**
	* Returns `true` if the two `VectorValue` values have the same raw number arrays, returns `false` otherwise.
	*/ isEqual(e) {
		return function __PRIVATE_isPrimitiveArrayEqual(e, t) {
			if (e.length !== t.length) return !1;
			for (let n = 0; n < e.length; ++n) if (e[n] !== t[n]) return !1;
			return !0;
		}(this._values, e._values);
	}
	/**
	* Returns a JSON-serializable representation of this `VectorValue` instance.
	*
	* @returns a JSON representation of this object.
	*/ toJSON() {
		return {
			type: VectorValue._jsonSchemaVersion,
			vectorValues: this._values
		};
	}
	/**
	* Builds a `VectorValue` instance from a JSON object created by {@link VectorValue.toJSON}.
	*
	* @param json - a JSON object represention of a `VectorValue` instance.
	* @returns an instance of {@link VectorValue} if the JSON object could be parsed. Throws a
	* {@link FirestoreError} if an error occurs.
	*/ static fromJSON(e) {
		if (__PRIVATE_validateJSON(e, VectorValue._jsonSchema)) {
			if (Array.isArray(e.vectorValues) && e.vectorValues.every(((e) => "number" == typeof e))) return new VectorValue(e.vectorValues);
			throw new FirestoreError(D.INVALID_ARGUMENT, "Expected 'vectorValues' field to be a number array");
		}
	}
};
VectorValue._jsonSchemaVersion = "firestore/vectorValue/1.0", VectorValue._jsonSchema = {
	type: property("string", VectorValue._jsonSchemaVersion),
	vectorValues: property("object")
};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var on = /^__.*__$/;
/** The result of parsing document data (e.g. for a setData call). */ var ParsedSetData = class {
	constructor(e, t, n) {
		this.data = e, this.fieldMask = t, this.fieldTransforms = n;
	}
	toMutation(e, t) {
		return null !== this.fieldMask ? new __PRIVATE_PatchMutation(e, this.data, this.fieldMask, t, this.fieldTransforms) : new __PRIVATE_SetMutation(e, this.data, t, this.fieldTransforms);
	}
};
/** The result of parsing "update" data (i.e. for an updateData call). */ var ParsedUpdateData = class {
	constructor(e, t, n) {
		this.data = e, this.fieldMask = t, this.fieldTransforms = n;
	}
	toMutation(e, t) {
		return new __PRIVATE_PatchMutation(e, this.data, this.fieldMask, t, this.fieldTransforms);
	}
};
function __PRIVATE_isWrite(e) {
	switch (e) {
		case 0:
		case 2:
		case 1: return !0;
		case 3:
		case 4: return !1;
		default: throw fail(40011, { dataSource: e });
	}
}
/** A "context" object passed around while parsing user data. */ var __PRIVATE_ParseContextImpl = class __PRIVATE_ParseContextImpl {
	/**
	* Initializes a ParseContext with the given source and path.
	*
	* @param settings - The settings for the parser.
	* @param databaseId - The database ID of the Firestore instance.
	* @param serializer - The serializer to use to generate the Value proto.
	* @param ignoreUndefinedProperties - Whether to ignore undefined properties
	* rather than throw.
	* @param fieldTransforms - A mutable list of field transforms encountered
	* while parsing the data.
	* @param fieldMask - A mutable list of field paths encountered while parsing
	* the data.
	*
	* TODO(b/34871131): We don't support array paths right now, so path can be
	* null to indicate the context represents any location within an array (in
	* which case certain features will not work and errors will be somewhat
	* compromised).
	*/
	constructor(e, t, n, r, i, s) {
		this.settings = e, this.databaseId = t, this.serializer = n, this.ignoreUndefinedProperties = r, void 0 === i && this.Ac(), this.fieldTransforms = i || [], this.fieldMask = s || [];
	}
	get path() {
		return this.settings.path;
	}
	get dataSource() {
		return this.settings.dataSource;
	}
	/** Returns a new context with the specified settings overwritten. */ i(e) {
		return new __PRIVATE_ParseContextImpl({
			...this.settings,
			...e
		}, this.databaseId, this.serializer, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
	}
	dc(e) {
		const t = this.path?.child(e), n = this.i({
			path: t,
			arrayElement: !1
		});
		return n.mc(e), n;
	}
	fc(e) {
		const t = this.path?.child(e), n = this.i({
			path: t,
			arrayElement: !1
		});
		return n.Ac(), n;
	}
	gc(e) {
		return this.i({
			path: void 0,
			arrayElement: !0
		});
	}
	yc(e) {
		return __PRIVATE_createError(e, this.settings.methodName, this.settings.hasConverter || !1, this.path, this.settings.targetDoc);
	}
	/** Returns 'true' if 'fieldPath' was traversed when creating this context. */ contains(e) {
		return void 0 !== this.fieldMask.find(((t) => e.isPrefixOf(t))) || void 0 !== this.fieldTransforms.find(((t) => e.isPrefixOf(t.field)));
	}
	Ac() {
		if (this.path) for (let e = 0; e < this.path.length; e++) this.mc(this.path.get(e));
	}
	mc(e) {
		if (0 === e.length) throw this.yc("Document fields must not be empty");
		if (__PRIVATE_isWrite(this.dataSource) && on.test(e)) throw this.yc("Document fields cannot begin and end with \"__\"");
	}
};
/**
* Helper for parsing raw user input (provided via the API) into internal model
* classes.
*/ var __PRIVATE_UserDataReader = class {
	constructor(e, t, n) {
		this.databaseId = e, this.ignoreUndefinedProperties = t, this.serializer = n || __PRIVATE_newSerializer(e);
	}
	/** Creates a new top-level parse context. */ I(e, t, n, r = !1) {
		return new __PRIVATE_ParseContextImpl({
			dataSource: e,
			methodName: t,
			targetDoc: n,
			path: FieldPath$1.emptyPath(),
			arrayElement: !1,
			hasConverter: r
		}, this.databaseId, this.serializer, this.ignoreUndefinedProperties);
	}
};
function __PRIVATE_newUserDataReader(e) {
	const t = e._freezeSettings(), n = __PRIVATE_newSerializer(e._databaseId);
	return new __PRIVATE_UserDataReader(e._databaseId, !!t.ignoreUndefinedProperties, n);
}
/** Parse document data from a set() call. */ function __PRIVATE_parseSetData(e, t, n, r, i, s = {}) {
	const o = e.I(s.merge || s.mergeFields ? 2 : 0, t, n, i);
	__PRIVATE_validatePlainObject("Data must be an object, but it was:", o, r);
	const _ = __PRIVATE_parseObject(r, o);
	let a, u;
	if (s.merge) a = new FieldMask(o.fieldMask), u = o.fieldTransforms;
	else if (s.mergeFields) {
		const e = [];
		for (const r of s.mergeFields) {
			const i = __PRIVATE_fieldPathFromArgument(t, r, n);
			if (!o.contains(i)) throw new FirestoreError(D.INVALID_ARGUMENT, `Field '${i}' is specified in your field mask but missing from your input data.`);
			__PRIVATE_fieldMaskContains(e, i) || e.push(i);
		}
		a = new FieldMask(e), u = o.fieldTransforms.filter(((e) => a.covers(e.field)));
	} else a = null, u = o.fieldTransforms;
	return new ParsedSetData(new ObjectValue(_), a, u);
}
var __PRIVATE_DeleteFieldValueImpl = class __PRIVATE_DeleteFieldValueImpl extends FieldValue {
	_toFieldTransform(e) {
		if (2 !== e.dataSource) throw 1 === e.dataSource ? e.yc(`${this._methodName}() can only appear at the top level of your update data`) : e.yc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);
		return e.fieldMask.push(e.path), null;
	}
	isEqual(e) {
		return e instanceof __PRIVATE_DeleteFieldValueImpl;
	}
};
var __PRIVATE_ServerTimestampFieldValueImpl = class __PRIVATE_ServerTimestampFieldValueImpl extends FieldValue {
	_toFieldTransform(e) {
		return new FieldTransform(e.path, new __PRIVATE_ServerTimestampTransform());
	}
	isEqual(e) {
		return e instanceof __PRIVATE_ServerTimestampFieldValueImpl;
	}
};
/** Parse update data from an update() call. */ function __PRIVATE_parseUpdateData(e, t, n, r) {
	const i = e.I(1, t, n);
	__PRIVATE_validatePlainObject("Data must be an object, but it was:", i, r);
	const s = [], o = ObjectValue.empty();
	forEach(r, ((e, r) => {
		const _ = __PRIVATE_fieldPathFromDotSeparatedString(t, e, n);
		r = getModularInstance(r);
		const a = i.fc(_);
		if (r instanceof __PRIVATE_DeleteFieldValueImpl) s.push(_);
		else {
			const e = __PRIVATE_parseData(r, a);
			null != e && (s.push(_), o.set(_, e));
		}
	}));
	return new ParsedUpdateData(o, new FieldMask(s), i.fieldTransforms);
}
/** Parse update data from a list of field/value arguments. */ function __PRIVATE_parseUpdateVarargs(e, t, n, r, i, s) {
	const o = e.I(1, t, n), _ = [__PRIVATE_fieldPathFromArgument(t, r, n)], a = [i];
	if (s.length % 2 != 0) throw new FirestoreError(D.INVALID_ARGUMENT, `Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);
	for (let e = 0; e < s.length; e += 2) _.push(__PRIVATE_fieldPathFromArgument(t, s[e])), a.push(s[e + 1]);
	const u = [], c = ObjectValue.empty();
	for (let e = _.length - 1; e >= 0; --e) if (!__PRIVATE_fieldMaskContains(u, _[e])) {
		const t = _[e];
		let n = a[e];
		n = getModularInstance(n);
		const r = o.fc(t);
		if (n instanceof __PRIVATE_DeleteFieldValueImpl) u.push(t);
		else {
			const e = __PRIVATE_parseData(n, r);
			null != e && (u.push(t), c.set(t, e));
		}
	}
	return new ParsedUpdateData(c, new FieldMask(u), o.fieldTransforms);
}
/**
* Parse a "query value" (e.g. value in a where filter or a value in a cursor
* bound).
*
* @param allowArrays - Whether the query value is an array that may directly
* contain additional arrays (e.g. the operand of an `in` query).
*/ function __PRIVATE_parseQueryValue(e, t, n, r = !1) {
	return __PRIVATE_parseData(n, e.I(r ? 4 : 3, t));
}
/**
* Parses user data to Protobuf Values.
*
* @param input - Data to be parsed.
* @param context - A context object representing the current path being parsed,
* the source of the data being parsed, etc.
* @returns The parsed value, or null if the value was a FieldValue sentinel
* that should not be included in the resulting parsed data.
*/ function __PRIVATE_parseData(e, t) {
	if (__PRIVATE_looksLikeJsonObject(e = getModularInstance(e))) return __PRIVATE_validatePlainObject("Unsupported field value:", t, e), __PRIVATE_parseObject(e, t);
	if (e instanceof FieldValue)
 /**
	* "Parses" the provided FieldValueImpl, adding any necessary transforms to
	* context.fieldTransforms.
	*/
	return function __PRIVATE_parseSentinelFieldValue(e, t) {
		if (!__PRIVATE_isWrite(t.dataSource)) throw t.yc(`${e._methodName}() can only be used with update() and set()`);
		if (!t.path) throw t.yc(`${e._methodName}() is not currently supported inside arrays`);
		const n = e._toFieldTransform(t);
		n && t.fieldTransforms.push(n);
	}(e, t), null;
	if (void 0 === e && t.ignoreUndefinedProperties) return null;
	if (t.path && t.fieldMask.push(t.path), e instanceof Array) {
		if (t.settings.arrayElement && 4 !== t.dataSource) throw t.yc("Nested arrays are not supported");
		return function __PRIVATE_parseArray(e, t) {
			const n = [];
			let r = 0;
			for (const i of e) {
				let e = __PRIVATE_parseData(i, t.gc(r));
				e ??= { nullValue: "NULL_VALUE" }, n.push(e), r++;
			}
			return { arrayValue: { values: n } };
		}(e, t);
	}
	return function __PRIVATE_parseScalarValue(e, t) {
		if (null === (e = getModularInstance(e))) return { nullValue: "NULL_VALUE" };
		if ("number" == typeof e) return toNumber(t.serializer, e);
		if ("boolean" == typeof e) return { booleanValue: e };
		if ("string" == typeof e) return { stringValue: e };
		if (e instanceof Date) {
			const n = Timestamp.fromDate(e);
			return { timestampValue: toTimestamp(t.serializer, n) };
		}
		if (e instanceof Timestamp) {
			const n = new Timestamp(e.seconds, 1e3 * Math.floor(e.nanoseconds / 1e3));
			return { timestampValue: toTimestamp(t.serializer, n) };
		}
		if (e instanceof GeoPoint) return { geoPointValue: {
			latitude: e.latitude,
			longitude: e.longitude
		} };
		if (e instanceof Bytes) return { bytesValue: __PRIVATE_toBytes(t.serializer, e._byteString) };
		if (e instanceof DocumentReference) {
			const n = t.databaseId, r = e.firestore._databaseId;
			if (!r.isEqual(n)) throw t.yc(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);
			return { referenceValue: __PRIVATE_toResourceName(e.firestore._databaseId || t.databaseId, e._key.path) };
		}
		if (e instanceof VectorValue)
 /**
		* Creates a new VectorValue proto value (using the internal format).
		*/
		return function __PRIVATE_parseVectorValue(e, t) {
			const n = e instanceof VectorValue ? e.toArray() : e;
			return { mapValue: { fields: {
				[st]: { stringValue: at },
				[ut]: { arrayValue: { values: n.map(((e) => {
					if ("number" != typeof e) throw t.yc("VectorValues must only contain numeric values.");
					return __PRIVATE_toDouble(t.serializer, e);
				})) } }
			} } };
		}(e, t);
		if (__PRIVATE_isProtoValueSerializable(e)) return e._toProto(t.serializer);
		throw t.yc(`Unsupported field value: ${__PRIVATE_valueDescription(e)}`);
	}(e, t);
}
function __PRIVATE_parseObject(e, t) {
	const n = {};
	return isEmpty(e) ? t.path && t.path.length > 0 && t.fieldMask.push(t.path) : forEach(e, ((e, r) => {
		const i = __PRIVATE_parseData(r, t.dc(e));
		null != i && (n[e] = i);
	})), { mapValue: { fields: n } };
}
function __PRIVATE_looksLikeJsonObject(e) {
	return !("object" != typeof e || null === e || e instanceof Array || e instanceof Date || e instanceof Timestamp || e instanceof GeoPoint || e instanceof Bytes || e instanceof DocumentReference || e instanceof FieldValue || e instanceof VectorValue || __PRIVATE_isProtoValueSerializable(e));
}
function __PRIVATE_validatePlainObject(e, t, n) {
	if (!__PRIVATE_looksLikeJsonObject(n) || !__PRIVATE_isPlainObject(n)) {
		const r = __PRIVATE_valueDescription(n);
		throw "an object" === r ? t.yc(e + " a custom object") : t.yc(e + " " + r);
	}
}
/**
* Helper that calls fromDotSeparatedString() but wraps any error thrown.
*/ function __PRIVATE_fieldPathFromArgument(e, t, n) {
	if ((t = getModularInstance(t)) instanceof FieldPath) return t._internalPath;
	if ("string" == typeof t) return __PRIVATE_fieldPathFromDotSeparatedString(e, t);
	throw __PRIVATE_createError("Field path arguments must be of type string or ", e, !1, void 0, n);
}
/**
* Matches any characters in a field path string that are reserved.
*/ var _n = /* @__PURE__ */ new RegExp("[~\\*/\\[\\]]");
/**
* Wraps fromDotSeparatedString with an error message about the method that
* was thrown.
* @param methodName - The publicly visible method name
* @param path - The dot-separated string form of a field path which will be
* split on dots.
* @param targetDoc - The document against which the field path will be
* evaluated.
*/ function __PRIVATE_fieldPathFromDotSeparatedString(e, t, n) {
	if (t.search(_n) >= 0) throw __PRIVATE_createError(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`, e, !1, void 0, n);
	try {
		return new FieldPath(...t.split("."))._internalPath;
	} catch (r) {
		throw __PRIVATE_createError(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, e, !1, void 0, n);
	}
}
function __PRIVATE_createError(e, t, n, r, i) {
	const s = r && !r.isEmpty(), o = void 0 !== i;
	let _ = `Function ${t}() called with invalid data`;
	n && (_ += " (via `toFirestore()`)"), _ += ". ";
	let a = "";
	return (s || o) && (a += " (found", s && (a += ` in field ${r}`), o && (a += ` in document ${i}`), a += ")"), new FirestoreError(D.INVALID_ARGUMENT, _ + e + a);
}
/** Checks `haystack` if FieldPath `needle` is present. Runs in O(n). */ function __PRIVATE_fieldMaskContains(e, t) {
	return e.some(((e) => e.isEqual(t)));
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Converts Firestore's internal types to the JavaScript types that we expose
* to the user.
*
* @internal
*/ var AbstractUserDataWriter = class {
	convertValue(e, t = "none") {
		switch (__PRIVATE_typeOrder(e)) {
			case 0: return null;
			case 1: return e.booleanValue;
			case 2: return __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue);
			case 3: return this.convertTimestamp(e.timestampValue);
			case 4: return this.convertServerTimestamp(e, t);
			case 5: return e.stringValue;
			case 6: return this.convertBytes(__PRIVATE_normalizeByteString(e.bytesValue));
			case 7: return this.convertReference(e.referenceValue);
			case 8: return this.convertGeoPoint(e.geoPointValue);
			case 9: return this.convertArray(e.arrayValue, t);
			case 11: return this.convertObject(e.mapValue, t);
			case 10: return this.convertVectorValue(e.mapValue);
			default: throw fail(62114, { value: e });
		}
	}
	convertObject(e, t) {
		return this.convertObjectMap(e.fields, t);
	}
	/**
	* @internal
	*/ convertObjectMap(e, t = "none") {
		const n = {};
		return forEach(e, ((e, r) => {
			n[e] = this.convertValue(r, t);
		})), n;
	}
	/**
	* @internal
	*/ convertVectorValue(e) {
		const t = e.fields?.[ut].arrayValue?.values?.map(((e) => __PRIVATE_normalizeNumber(e.doubleValue)));
		return new VectorValue(t);
	}
	convertGeoPoint(e) {
		return new GeoPoint(__PRIVATE_normalizeNumber(e.latitude), __PRIVATE_normalizeNumber(e.longitude));
	}
	convertArray(e, t) {
		return (e.values || []).map(((e) => this.convertValue(e, t)));
	}
	convertServerTimestamp(e, t) {
		switch (t) {
			case "previous":
				const n = __PRIVATE_getPreviousValue(e);
				return null == n ? null : this.convertValue(n, t);
			case "estimate": return this.convertTimestamp(__PRIVATE_getLocalWriteTime(e));
			default: return null;
		}
	}
	convertTimestamp(e) {
		const t = __PRIVATE_normalizeTimestamp(e);
		return new Timestamp(t.seconds, t.nanos);
	}
	convertDocumentKey(e, t) {
		const n = ResourcePath.fromString(e);
		__PRIVATE_hardAssert(__PRIVATE_isValidResourceName(n), 9688, { name: e });
		const r = new DatabaseId(n.get(1), n.get(3)), i = new DocumentKey(n.popFirst(5));
		return r.isEqual(t) || __PRIVATE_logError(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`), i;
	}
};
/**
* @license
* Copyright 2024 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var __PRIVATE_ExpUserDataWriter = class extends AbstractUserDataWriter {
	constructor(e) {
		super(), this.firestore = e;
	}
	convertBytes(e) {
		return new Bytes(e);
	}
	convertReference(e) {
		const t = this.convertDocumentKey(e, this.firestore._databaseId);
		return new DocumentReference(this.firestore, null, t);
	}
};
/**
* Returns a sentinel used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link @firebase/firestore/lite#(updateDoc:1)} to
* include a server-generated timestamp in the written data.
*/ function serverTimestamp() {
	return new __PRIVATE_ServerTimestampFieldValueImpl("serverTimestamp");
}
//#endregion
//#region node_modules/@firebase/firestore/dist/index.esm.js
var Ut = "@firebase/firestore", Ht = "4.14.0";
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function __PRIVATE_isPartialObserver(t) {
	/**
	* Returns true if obj is an object and contains at least one of the specified
	* methods.
	*/
	return function __PRIVATE_implementsAnyMethods(t, e) {
		if ("object" != typeof t || null === t) return !1;
		const n = t;
		for (const t of e) if (t in n && "function" == typeof n[t]) return !0;
		return !1;
	}(t, [
		"next",
		"error",
		"complete"
	]);
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* A `DocumentSnapshot` contains data read from a document in your Firestore
* database. The data can be extracted with `.data()` or `.get(<field>)` to
* get a specific field.
*
* For a `DocumentSnapshot` that points to a non-existing document, any data
* access will return 'undefined'. You can use the `exists()` method to
* explicitly verify a document's existence.
*/ var DocumentSnapshot$1 = class {
	/** @hideconstructor protected */
	constructor(t, e, n, r, s) {
		this._firestore = t, this._userDataWriter = e, this._key = n, this._document = r, this._converter = s;
	}
	/** Property of the `DocumentSnapshot` that provides the document's ID. */ get id() {
		return this._key.path.lastSegment();
	}
	/**
	* The `DocumentReference` for the document included in the `DocumentSnapshot`.
	*/ get ref() {
		return new DocumentReference(this._firestore, this._converter, this._key);
	}
	/**
	* Signals whether or not the document at the snapshot's location exists.
	*
	* @returns true if the document exists.
	*/ exists() {
		return null !== this._document;
	}
	/**
	* Retrieves all fields in the document as an `Object`. Returns `undefined` if
	* the document doesn't exist.
	*
	* @returns An `Object` containing all fields in the document or `undefined`
	* if the document doesn't exist.
	*/ data() {
		if (this._document) {
			if (this._converter) {
				const t = new QueryDocumentSnapshot$1(this._firestore, this._userDataWriter, this._key, this._document, null);
				return this._converter.fromFirestore(t);
			}
			return this._userDataWriter.convertValue(this._document.data.value);
		}
	}
	/**
	* @internal
	* @private
	*
	* Retrieves all fields in the document as a proto Value. Returns `undefined` if
	* the document doesn't exist.
	*
	* @returns An `Object` containing all fields in the document or `undefined`
	* if the document doesn't exist.
	*/ _fieldsProto() {
		return this._document?.data.clone().value.mapValue.fields ?? void 0;
	}
	/**
	* Retrieves the field specified by `fieldPath`. Returns `undefined` if the
	* document or field doesn't exist.
	*
	* @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
	* field.
	* @returns The data at the specified field location or undefined if no such
	* field exists in the document.
	*/
	get(t) {
		if (this._document) {
			const e = this._document.data.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", t));
			if (null !== e) return this._userDataWriter.convertValue(e);
		}
	}
};
/**
* A `QueryDocumentSnapshot` contains data read from a document in your
* Firestore database as part of a query. The document is guaranteed to exist
* and its data can be extracted with `.data()` or `.get(<field>)` to get a
* specific field.
*
* A `QueryDocumentSnapshot` offers the same API surface as a
* `DocumentSnapshot`. Since query results contain only existing documents, the
* `exists` property will always be true and `data()` will never return
* 'undefined'.
*/ var QueryDocumentSnapshot$1 = class extends DocumentSnapshot$1 {
	/**
	* Retrieves all fields in the document as an `Object`.
	*
	* @override
	* @returns An `Object` containing all fields in the document.
	*/
	data() {
		return super.data();
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ function __PRIVATE_validateHasExplicitOrderByForLimitToLast(t) {
	if ("L" === t.limitType && 0 === t.explicitOrderBy.length) throw new FirestoreError(D.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
}
/**
* An `AppliableConstraint` is an abstraction of a constraint that can be applied
* to a Firestore query.
*/ var AppliableConstraint = class {};
/**
* A `QueryConstraint` is used to narrow the set of documents returned by a
* Firestore query. `QueryConstraint`s are created by invoking {@link where},
* {@link orderBy}, {@link (startAt:1)}, {@link (startAfter:1)}, {@link
* (endBefore:1)}, {@link (endAt:1)}, {@link limit}, {@link limitToLast} and
* can then be passed to {@link (query:1)} to create a new query instance that
* also contains this `QueryConstraint`.
*/ var QueryConstraint = class extends AppliableConstraint {};
function query(t, e, ...n) {
	let r = [];
	e instanceof AppliableConstraint && r.push(e), r = r.concat(n), function __PRIVATE_validateQueryConstraintArray(t) {
		const e = t.filter(((t) => t instanceof QueryCompositeFilterConstraint)).length, n = t.filter(((t) => t instanceof QueryFieldFilterConstraint)).length;
		if (e > 1 || e > 0 && n > 0) throw new FirestoreError(D.INVALID_ARGUMENT, "InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.");
	}(r);
	for (const e of r) t = e._apply(t);
	return t;
}
/**
* A `QueryFieldFilterConstraint` is used to narrow the set of documents returned by
* a Firestore query by filtering on one or more document fields.
* `QueryFieldFilterConstraint`s are created by invoking {@link where} and can then
* be passed to {@link (query:1)} to create a new query instance that also contains
* this `QueryFieldFilterConstraint`.
*/ var QueryFieldFilterConstraint = class QueryFieldFilterConstraint extends QueryConstraint {
	/**
	* @internal
	*/
	constructor(t, e, n) {
		super(), this._field = t, this._op = e, this._value = n, this.type = "where";
	}
	static _create(t, e, n) {
		return new QueryFieldFilterConstraint(t, e, n);
	}
	_apply(t) {
		const e = this._parse(t);
		return __PRIVATE_validateNewFieldFilter(t._query, e), new Query(t.firestore, t.converter, __PRIVATE_queryWithAddedFilter(t._query, e));
	}
	_parse(t) {
		const e = __PRIVATE_newUserDataReader(t.firestore);
		return function __PRIVATE_newQueryFilter(t, e, n, r, s, a, o) {
			let i;
			if (s.isKeyField()) {
				if ("array-contains" === a || "array-contains-any" === a) throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid Query. You can't perform '${a}' queries on documentId().`);
				if ("in" === a || "not-in" === a) {
					__PRIVATE_validateDisjunctiveFilterElements(o, a);
					const e = [];
					for (const n of o) e.push(__PRIVATE_parseDocumentIdValue(r, t, n));
					i = { arrayValue: { values: e } };
				} else i = __PRIVATE_parseDocumentIdValue(r, t, o);
			} else "in" !== a && "not-in" !== a && "array-contains-any" !== a || __PRIVATE_validateDisjunctiveFilterElements(o, a), i = __PRIVATE_parseQueryValue(n, e, o, "in" === a || "not-in" === a);
			return FieldFilter.create(s, a, i);
		}(t._query, "where", e, t.firestore._databaseId, this._field, this._op, this._value);
	}
};
/**
* A `QueryCompositeFilterConstraint` is used to narrow the set of documents
* returned by a Firestore query by performing the logical OR or AND of multiple
* {@link QueryFieldFilterConstraint}s or {@link QueryCompositeFilterConstraint}s.
* `QueryCompositeFilterConstraint`s are created by invoking {@link or} or
* {@link and} and can then be passed to {@link (query:1)} to create a new query
* instance that also contains the `QueryCompositeFilterConstraint`.
*/ var QueryCompositeFilterConstraint = class QueryCompositeFilterConstraint extends AppliableConstraint {
	/**
	* @internal
	*/
	constructor(t, e) {
		super(), this.type = t, this._queryConstraints = e;
	}
	static _create(t, e) {
		return new QueryCompositeFilterConstraint(t, e);
	}
	_parse(t) {
		const e = this._queryConstraints.map(((e) => e._parse(t))).filter(((t) => t.getFilters().length > 0));
		return 1 === e.length ? e[0] : CompositeFilter.create(e, this._getOperator());
	}
	_apply(t) {
		const e = this._parse(t);
		return 0 === e.getFilters().length ? t : (function __PRIVATE_validateNewFilter(t, e) {
			let n = t;
			const r = e.getFlattenedFilters();
			for (const t of r) __PRIVATE_validateNewFieldFilter(n, t), n = __PRIVATE_queryWithAddedFilter(n, t);
		}(t._query, e), new Query(t.firestore, t.converter, __PRIVATE_queryWithAddedFilter(t._query, e)));
	}
	_getQueryConstraints() {
		return this._queryConstraints;
	}
	_getOperator() {
		return "and" === this.type ? "and" : "or";
	}
};
/**
* A `QueryOrderByConstraint` is used to sort the set of documents returned by a
* Firestore query. `QueryOrderByConstraint`s are created by invoking
* {@link orderBy} and can then be passed to {@link (query:1)} to create a new query
* instance that also contains this `QueryOrderByConstraint`.
*
* Note: Documents that do not contain the orderBy field will not be present in
* the query result.
*/ var QueryOrderByConstraint = class QueryOrderByConstraint extends QueryConstraint {
	/**
	* @internal
	*/
	constructor(t, e) {
		super(), this._field = t, this._direction = e, this.type = "orderBy";
	}
	static _create(t, e) {
		return new QueryOrderByConstraint(t, e);
	}
	_apply(t) {
		const e = function __PRIVATE_newQueryOrderBy(t, e, n) {
			if (null !== t.startAt) throw new FirestoreError(D.INVALID_ARGUMENT, "Invalid query. You must not call startAt() or startAfter() before calling orderBy().");
			if (null !== t.endAt) throw new FirestoreError(D.INVALID_ARGUMENT, "Invalid query. You must not call endAt() or endBefore() before calling orderBy().");
			return new OrderBy(e, n);
		}(t._query, this._field, this._direction);
		return new Query(t.firestore, t.converter, __PRIVATE_queryWithAddedOrderBy(t._query, e));
	}
};
/**
* Creates a {@link QueryOrderByConstraint} that sorts the query result by the
* specified field, optionally in descending order instead of ascending.
*
* Note: Documents that do not contain the specified field will not be present
* in the query result.
*
* @param fieldPath - The field to sort by.
* @param directionStr - Optional direction to sort by ('asc' or 'desc'). If
* not specified, order will be ascending.
* @returns The created {@link QueryOrderByConstraint}.
*/ function orderBy(t, e = "asc") {
	const n = e, r = __PRIVATE_fieldPathFromArgument("orderBy", t);
	return QueryOrderByConstraint._create(r, n);
}
function __PRIVATE_parseDocumentIdValue(t, e, n) {
	if ("string" == typeof (n = getModularInstance(n))) {
		if ("" === n) throw new FirestoreError(D.INVALID_ARGUMENT, "Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");
		if (!__PRIVATE_isCollectionGroupQuery(e) && -1 !== n.indexOf("/")) throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);
		const r = e.path.child(ResourcePath.fromString(n));
		if (!DocumentKey.isDocumentKey(r)) throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);
		return __PRIVATE_refValue(t, new DocumentKey(r));
	}
	if (n instanceof DocumentReference) return __PRIVATE_refValue(t, n._key);
	throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${__PRIVATE_valueDescription(n)}.`);
}
/**
* Validates that the value passed into a disjunctive filter satisfies all
* array requirements.
*/ function __PRIVATE_validateDisjunctiveFilterElements(t, e) {
	if (!Array.isArray(t) || 0 === t.length) throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid Query. A non-empty array is required for '${e.toString()}' filters.`);
}
/**
* Given an operator, returns the set of operators that cannot be used with it.
*
* This is not a comprehensive check, and this function should be removed in the
* long term. Validations should occur in the Firestore backend.
*
* Operators in a query must adhere to the following set of rules:
* 1. Only one inequality per query.
* 2. `NOT_IN` cannot be used with array, disjunctive, or `NOT_EQUAL` operators.
*/ function __PRIVATE_validateNewFieldFilter(t, e) {
	const n = function __PRIVATE_findOpInsideFilters(t, e) {
		for (const n of t) for (const t of n.getFlattenedFilters()) if (e.indexOf(t.op) >= 0) return t.op;
		return null;
	}(t.filters, function __PRIVATE_conflictingOps(t) {
		switch (t) {
			case "!=": return ["!=", "not-in"];
			case "array-contains-any":
			case "in": return ["not-in"];
			case "not-in": return [
				"array-contains-any",
				"in",
				"not-in",
				"!="
			];
			default: return [];
		}
	}(e.op));
	if (null !== n) throw n === e.op ? new FirestoreError(D.INVALID_ARGUMENT, `Invalid query. You cannot use more than one '${e.op.toString()}' filter.`) : new FirestoreError(D.INVALID_ARGUMENT, `Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`);
}
function __PRIVATE_applyFirestoreDataConverter(t, e, n) {
	let r;
	return r = t ? n && (n.merge || n.mergeFields) ? t.toFirestore(e, n) : t.toFirestore(e) : e, r;
}
/**
* Metadata about a snapshot, describing the state of the snapshot.
*/ var SnapshotMetadata = class {
	/** @hideconstructor */
	constructor(t, e) {
		this.hasPendingWrites = t, this.fromCache = e;
	}
	/**
	* Returns true if this `SnapshotMetadata` is equal to the provided one.
	*
	* @param other - The `SnapshotMetadata` to compare against.
	* @returns true if this `SnapshotMetadata` is equal to the provided one.
	*/ isEqual(t) {
		return this.hasPendingWrites === t.hasPendingWrites && this.fromCache === t.fromCache;
	}
};
/**
* A `DocumentSnapshot` contains data read from a document in your Firestore
* database. The data can be extracted with `.data()` or `.get(<field>)` to
* get a specific field.
*
* For a `DocumentSnapshot` that points to a non-existing document, any data
* access will return 'undefined'. You can use the `exists()` method to
* explicitly verify a document's existence.
*/ var DocumentSnapshot = class DocumentSnapshot extends DocumentSnapshot$1 {
	/** @hideconstructor protected */
	constructor(t, e, n, r, s, a) {
		super(t, e, n, r, a), this._firestore = t, this._firestoreImpl = t, this.metadata = s;
	}
	/**
	* Returns whether or not the data exists. True if the document exists.
	*/ exists() {
		return super.exists();
	}
	/**
	* Retrieves all fields in the document as an `Object`. Returns `undefined` if
	* the document doesn't exist.
	*
	* By default, `serverTimestamp()` values that have not yet been
	* set to their final value will be returned as `null`. You can override
	* this by passing an options object.
	*
	* @param options - An options object to configure how data is retrieved from
	* the snapshot (for example the desired behavior for server timestamps that
	* have not yet been set to their final value).
	* @returns An `Object` containing all fields in the document or `undefined` if
	* the document doesn't exist.
	*/ data(t = {}) {
		if (this._document) {
			if (this._converter) {
				const e = new QueryDocumentSnapshot(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, null);
				return this._converter.fromFirestore(e, t);
			}
			return this._userDataWriter.convertValue(this._document.data.value, t.serverTimestamps);
		}
	}
	/**
	* Retrieves the field specified by `fieldPath`. Returns `undefined` if the
	* document or field doesn't exist.
	*
	* By default, a `serverTimestamp()` that has not yet been set to
	* its final value will be returned as `null`. You can override this by
	* passing an options object.
	*
	* @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
	* field.
	* @param options - An options object to configure how the field is retrieved
	* from the snapshot (for example the desired behavior for server timestamps
	* that have not yet been set to their final value).
	* @returns The data at the specified field location or undefined if no such
	* field exists in the document.
	*/
	get(t, e = {}) {
		if (this._document) {
			const n = this._document.data.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", t));
			if (null !== n) return this._userDataWriter.convertValue(n, e.serverTimestamps);
		}
	}
	/**
	* Returns a JSON-serializable representation of this `DocumentSnapshot` instance.
	*
	* @returns a JSON representation of this object.  Throws a {@link FirestoreError} if this
	* `DocumentSnapshot` has pending writes.
	*/ toJSON() {
		if (this.metadata.hasPendingWrites) throw new FirestoreError(D.FAILED_PRECONDITION, "DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");
		const t = this._document, e = {};
		if (e.type = DocumentSnapshot._jsonSchemaVersion, e.bundle = "", e.bundleSource = "DocumentSnapshot", e.bundleName = this._key.toString(), !t || !t.isValidDocument() || !t.isFoundDocument()) return e;
		this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields, "previous");
		return e.bundle = (this._firestore, this.ref.path, "NOT SUPPORTED"), e;
	}
};
/**
* A `QueryDocumentSnapshot` contains data read from a document in your
* Firestore database as part of a query. The document is guaranteed to exist
* and its data can be extracted with `.data()` or `.get(<field>)` to get a
* specific field.
*
* A `QueryDocumentSnapshot` offers the same API surface as a
* `DocumentSnapshot`. Since query results contain only existing documents, the
* `exists` property will always be true and `data()` will never return
* 'undefined'.
*/ DocumentSnapshot._jsonSchemaVersion = "firestore/documentSnapshot/1.0", DocumentSnapshot._jsonSchema = {
	type: property("string", DocumentSnapshot._jsonSchemaVersion),
	bundleSource: property("string", "DocumentSnapshot"),
	bundleName: property("string"),
	bundle: property("string")
};
var QueryDocumentSnapshot = class extends DocumentSnapshot {
	/**
	* Retrieves all fields in the document as an `Object`.
	*
	* By default, `serverTimestamp()` values that have not yet been
	* set to their final value will be returned as `null`. You can override
	* this by passing an options object.
	*
	* @override
	* @param options - An options object to configure how data is retrieved from
	* the snapshot (for example the desired behavior for server timestamps that
	* have not yet been set to their final value).
	* @returns An `Object` containing all fields in the document.
	*/
	data(t = {}) {
		return super.data(t);
	}
};
/**
* A `QuerySnapshot` contains zero or more `DocumentSnapshot` objects
* representing the results of a query. The documents can be accessed as an
* array via the `docs` property or enumerated using the `forEach` method. The
* number of documents can be determined via the `empty` and `size`
* properties.
*/ var QuerySnapshot = class QuerySnapshot {
	/** @hideconstructor */
	constructor(t, e, n, r) {
		this._firestore = t, this._userDataWriter = e, this._snapshot = r, this.metadata = new SnapshotMetadata(r.hasPendingWrites, r.fromCache), this.query = n;
	}
	/** An array of all the documents in the `QuerySnapshot`. */ get docs() {
		const t = [];
		return this.forEach(((e) => t.push(e))), t;
	}
	/** The number of documents in the `QuerySnapshot`. */ get size() {
		return this._snapshot.docs.size;
	}
	/** True if there are no documents in the `QuerySnapshot`. */ get empty() {
		return 0 === this.size;
	}
	/**
	* Enumerates all of the documents in the `QuerySnapshot`.
	*
	* @param callback - A callback to be called with a `QueryDocumentSnapshot` for
	* each document in the snapshot.
	* @param thisArg - The `this` binding for the callback.
	*/ forEach(t, e) {
		this._snapshot.docs.forEach(((n) => {
			t.call(e, new QueryDocumentSnapshot(this._firestore, this._userDataWriter, n.key, n, new SnapshotMetadata(this._snapshot.mutatedKeys.has(n.key), this._snapshot.fromCache), this.query.converter));
		}));
	}
	/**
	* Returns an array of the documents changes since the last snapshot. If this
	* is the first snapshot, all documents will be in the list as 'added'
	* changes.
	*
	* @param options - `SnapshotListenOptions` that control whether metadata-only
	* changes (i.e. only `DocumentSnapshot.metadata` changed) should trigger
	* snapshot events.
	*/ docChanges(t = {}) {
		const e = !!t.includeMetadataChanges;
		if (e && this._snapshot.excludesMetadataChanges) throw new FirestoreError(D.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
		return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === e || (this._cachedChanges = function __PRIVATE_changesFromSnapshot(t, e) {
			if (t._snapshot.oldDocs.isEmpty()) {
				let e = 0;
				return t._snapshot.docChanges.map(((n) => {
					const r = new QueryDocumentSnapshot(t._firestore, t._userDataWriter, n.doc.key, n.doc, new SnapshotMetadata(t._snapshot.mutatedKeys.has(n.doc.key), t._snapshot.fromCache), t.query.converter);
					return n.doc, {
						type: "added",
						doc: r,
						oldIndex: -1,
						newIndex: e++
					};
				}));
			}
			{
				let n = t._snapshot.oldDocs;
				return t._snapshot.docChanges.filter(((t) => e || 3 !== t.type)).map(((e) => {
					const r = new QueryDocumentSnapshot(t._firestore, t._userDataWriter, e.doc.key, e.doc, new SnapshotMetadata(t._snapshot.mutatedKeys.has(e.doc.key), t._snapshot.fromCache), t.query.converter);
					let s = -1, a = -1;
					return 0 !== e.type && (s = n.indexOf(e.doc.key), n = n.delete(e.doc.key)), 1 !== e.type && (n = n.add(e.doc), a = n.indexOf(e.doc.key)), {
						type: __PRIVATE_resultChangeType(e.type),
						doc: r,
						oldIndex: s,
						newIndex: a
					};
				}));
			}
		}(this, e), this._cachedChangesIncludeMetadataChanges = e), this._cachedChanges;
	}
	/**
	* Returns a JSON-serializable representation of this `QuerySnapshot` instance.
	*
	* @returns a JSON representation of this object. Throws a {@link FirestoreError} if this
	* `QuerySnapshot` has pending writes.
	*/ toJSON() {
		if (this.metadata.hasPendingWrites) throw new FirestoreError(D.FAILED_PRECONDITION, "QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");
		const t = {};
		t.type = QuerySnapshot._jsonSchemaVersion, t.bundleSource = "QuerySnapshot", t.bundleName = __PRIVATE_AutoId.newId(), this._firestore._databaseId.database, this._firestore._databaseId.projectId;
		const e = [], n = [], r = [];
		return this.docs.forEach(((t) => {
			null !== t._document && (e.push(t._document), n.push(this._userDataWriter.convertObjectMap(t._document.data.value.mapValue.fields, "previous")), r.push(t.ref.path));
		})), t.bundle = (this._firestore, this.query._query, t.bundleName, "NOT SUPPORTED"), t;
	}
};
function __PRIVATE_resultChangeType(t) {
	switch (t) {
		case 0: return "added";
		case 2:
		case 3: return "modified";
		case 1: return "removed";
		default: return fail(61501, { type: t });
	}
}
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ QuerySnapshot._jsonSchemaVersion = "firestore/querySnapshot/1.0", QuerySnapshot._jsonSchema = {
	type: property("string", QuerySnapshot._jsonSchemaVersion),
	bundleSource: property("string", "QuerySnapshot"),
	bundleName: property("string"),
	bundle: property("string")
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Reads the document referred to by this `DocumentReference`.
*
* Note: `getDoc()` attempts to provide up-to-date data when possible by waiting
* for data from the server, but it may return cached data or fail if you are
* offline and the server cannot be reached. To specify this behavior, invoke
* {@link getDocFromCache} or {@link getDocFromServer}.
*
* @param reference - The reference of the document to fetch.
* @returns A `Promise` that resolves with a `DocumentSnapshot` containing the
* document contents.
*/ function getDoc(t) {
	t = __PRIVATE_cast(t, DocumentReference);
	const e = __PRIVATE_cast(t.firestore, Firestore);
	return __PRIVATE_firestoreClientGetDocumentViaSnapshotListener(ensureFirestoreConfigured(e), t._key).then(((n) => __PRIVATE_convertToDocSnapshot(e, t, n)));
}
function setDoc(t, e, n) {
	t = __PRIVATE_cast(t, DocumentReference);
	const r = __PRIVATE_cast(t.firestore, Firestore), s = __PRIVATE_applyFirestoreDataConverter(t.converter, e, n);
	return executeWrite(r, [__PRIVATE_parseSetData(__PRIVATE_newUserDataReader(r), "setDoc", t._key, s, null !== t.converter, n).toMutation(t._key, Precondition.none())]);
}
function updateDoc(t, e, n, ...r) {
	t = __PRIVATE_cast(t, DocumentReference);
	const s = __PRIVATE_cast(t.firestore, Firestore), o = __PRIVATE_newUserDataReader(s);
	let i;
	i = "string" == typeof (e = getModularInstance(e)) || e instanceof FieldPath ? __PRIVATE_parseUpdateVarargs(o, "updateDoc", t._key, e, n, r) : __PRIVATE_parseUpdateData(o, "updateDoc", t._key, e);
	return executeWrite(s, [i.toMutation(t._key, Precondition.exists(!0))]);
}
/**
* Deletes the document referred to by the specified `DocumentReference`.
*
* Note that the returned `Promise` does _not_ resolve until the document is
* successfully deleted from the remote Firestore backend and, similarly, is not
* rejected until the remote Firestore backend reports an error deleting the given
* document. So if the client cannot reach the backend (for example, due to being
* offline) then the returned `Promise` will not resolve for a potentially-long
* time (for example, until the client has gone back online). That being said,
* the given data _will_ be immediately deleted from the local cache and will be
* reflected in future "get" operations as if it had been successfully
* deleted from the remote Firestore server, a feature of Firestore called
* "latency compensation". The document will _eventually_ be deleted from the remote
* Firestore backend once a connection can be established. Therefore, it is
* usually undesirable to `await` the `Promise` returned from this function
* because the indefinite amount of time before which the promise resolves or
* rejects can block application logic unnecessarily.
*
* @param reference - A reference to the document to delete.
* @returns A `Promise` that resolves once the document has been successfully
* deleted from the backend or rejects once the backend reports an error
* deleting the document.
*/ function deleteDoc(t) {
	return executeWrite(__PRIVATE_cast(t.firestore, Firestore), [new __PRIVATE_DeleteMutation(t._key, Precondition.none())]);
}
function onSnapshot(t, ...e) {
	t = getModularInstance(t);
	let n = {
		includeMetadataChanges: !1,
		source: "default"
	}, r = 0;
	"object" != typeof e[r] || __PRIVATE_isPartialObserver(e[r]) || (n = e[r++]);
	const s = {
		includeMetadataChanges: n.includeMetadataChanges,
		source: n.source
	};
	if (__PRIVATE_isPartialObserver(e[r])) {
		const t = e[r];
		e[r] = t.next?.bind(t), e[r + 1] = t.error?.bind(t), e[r + 2] = t.complete?.bind(t);
	}
	let o, i, c;
	if (t instanceof DocumentReference) i = __PRIVATE_cast(t.firestore, Firestore), c = __PRIVATE_newQueryForPath(t._key.path), o = {
		next: (n) => {
			e[r] && e[r](__PRIVATE_convertToDocSnapshot(i, t, n));
		},
		error: e[r + 1],
		complete: e[r + 2]
	};
	else {
		const n = __PRIVATE_cast(t, Query);
		i = __PRIVATE_cast(n.firestore, Firestore), c = n._query;
		const s = new __PRIVATE_ExpUserDataWriter(i);
		o = {
			next: (t) => {
				e[r] && e[r](new QuerySnapshot(i, s, n, t));
			},
			error: e[r + 1],
			complete: e[r + 2]
		}, __PRIVATE_validateHasExplicitOrderByForLimitToLast(t._query);
	}
	return __PRIVATE_firestoreClientListen(ensureFirestoreConfigured(i), c, s, o);
}
/**
* Locally writes `mutations` on the async queue.
* @internal
*/ function executeWrite(t, e) {
	return __PRIVATE_firestoreClientWrite(ensureFirestoreConfigured(t), e);
}
/**
* Converts a {@link ViewSnapshot} that contains the single document specified by `ref`
* to a {@link DocumentSnapshot}.
*/ function __PRIVATE_convertToDocSnapshot(t, e, n) {
	const r = n.docs.get(e._key);
	return new DocumentSnapshot(t, new __PRIVATE_ExpUserDataWriter(t), e._key, r, new SnapshotMetadata(n.hasPendingWrites, n.fromCache), e.converter);
}
/**
* Cloud Firestore
*
* @packageDocumentation
*/ (function __PRIVATE_registerFirestore(h, d = !0) {
	__PRIVATE_setSDKVersion(SDK_VERSION), _registerComponent(new Component("firestore", ((t, { instanceIdentifier: e, options: n }) => {
		const r = t.getProvider("app").getImmediate(), s = new Firestore(new __PRIVATE_FirebaseAuthCredentialsProvider(t.getProvider("auth-internal")), new __PRIVATE_FirebaseAppCheckTokenProvider(r, t.getProvider("app-check-internal")), __PRIVATE_databaseIdFromApp(r, e), r);
		return n = {
			useFetchStreams: d,
			...n
		}, s._setSettings(n), s;
	}), "PUBLIC").setMultipleInstances(!0)), registerVersion(Ut, Ht, h), registerVersion(Ut, Ht, "esm2020");
})();
//#endregion
//#region node_modules/firebase/firestore/dist/esm/index.esm.js
var index_esm_exports = /* @__PURE__ */ __exportAll({
	CACHE_SIZE_UNLIMITED: () => -1,
	DocumentSnapshot: () => DocumentSnapshot,
	QueryCompositeFilterConstraint: () => QueryCompositeFilterConstraint,
	QueryConstraint: () => QueryConstraint,
	QueryDocumentSnapshot: () => QueryDocumentSnapshot,
	QueryFieldFilterConstraint: () => QueryFieldFilterConstraint,
	QueryOrderByConstraint: () => QueryOrderByConstraint,
	QuerySnapshot: () => QuerySnapshot,
	SnapshotMetadata: () => SnapshotMetadata,
	collection: () => collection,
	deleteDoc: () => deleteDoc,
	doc: () => doc,
	executeWrite: () => executeWrite,
	getDoc: () => getDoc,
	getFirestore: () => getFirestore,
	onSnapshot: () => onSnapshot,
	orderBy: () => orderBy,
	query: () => query,
	serverTimestamp: () => serverTimestamp,
	setDoc: () => setDoc,
	updateDoc: () => updateDoc
});
//#endregion
export { index_esm_exports$1 as n, index_esm_exports as t };
