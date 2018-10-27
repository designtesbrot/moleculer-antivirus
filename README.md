[![Moleculer logo](http://moleculer.services/images/banner.png)](https://github.com/moleculerjs/moleculer)

[![Build Status](https://travis-ci.com/designtesbrot/moleculer-antivirus.svg?branch=master)](https://travis-ci.com/designtesbrot/moleculer-antivirus)
[![Coverage Status](https://coveralls.io/repos/github/designtesbrot/moleculer-antivirus/badge.svg?branch=master)](https://coveralls.io/github/designtesbrot/moleculer-antivirus?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7f8245b6a42249a7b3f5de62d88a9ef4)](https://www.codacy.com/app/designtesbrot/moleculer-antivirus?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=designtesbrot/moleculer-antivirus&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/92a1e223f18762feb513/maintainability)](https://codeclimate.com/github/designtesbrot/moleculer-antivirus/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/designtesbrot/moleculer-antivirus/badge.svg)](https://snyk.io/test/github/designtesbrot/moleculer-antivirus)
[![npm version](https://badge.fury.io/js/moleculer-antivirus.svg)](https://badge.fury.io/js/moleculer-antivirus)
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/053ba442b3e3b186825d)

# Antivirus Service for the Moleculer framework

This Services provides actions for testing files for malicious virus threats using [ClamAV](https://www.clamav.net/). It 
utilizes the file streaming capabilities of the moleculer framework

## Features

The following List details which features are implemented

- Scan a file for malicious virus content

## Roadmap

The following List details which features are potentially implemented in the future

- Scan a file at a remote location

## Requirements

This service relies on [clamav.js](https://www.npmjs.com/package/clamav.js) which itself relies on a clam daemon available to connect to in the network.
 Files to be scanned are streamed to the clam daemon being installed. If the `scan` action is invoked with a string as an argument,
 it is assumed that the string is path to a valid location and a `ReadStream` from that location is created. If you plan to scan large files
 (> 100M), make sure to properly configure the clam daemon for accepting bigger files on the stream interface. This repository includes a Dockerfile which installes clamav. The examples folder includes a docker-compose file which
includes an example, which itself includes a docker-compose file connecting to the antivirus service to a daemon configured for larger
stream payloads. A configuration example for the clam daemon is included in the examples folder.

## Install

This package is available in the npm-registry. In order to use it simply install it with yarn (or npm):

```bash
yarn add moleculer-antivirus
```

## Usage

To make use of this Service, simply require it and create a new service:

```js
const fs = require("fs");
let { ServiceBroker } = require("moleculer");
let AVService = require("moleculer-antivirus");

let broker = new ServiceBroker({ logger: console });

// Create a service
broker.createService({
    mixins: AVService
});

// Start server
broker.start().then(() => {
    const data = fs.createReadStream('./suspicious.exe');
    broker.call('antivirus.scan', data);
    broker.call('antivirus.scan', './this/suspicious.exe');
});
```

For a more indepth example checkout out the `examples folder`. It includes a docker-compose file, running `docker-compose up` will boot a broker with an antivirus service, a connected clamav deamon
and an API Gateway to upload files to. This project includes a [published postman collection](https://app.getpostman.com/run-collection/053ba442b3e3b186825d) enabling you to quickly explore the service in your local environment.
EICAR signatures for testing are available [here](http://www.eicar.org/85-0-Download.html).

## Settings

<!-- AUTO-CONTENT-START:SETTINGS -->
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `clamdPort` | `Number` | `null` | The port that clamd is listening on |
| `clamdHost` | `String` | `null` | The ip that clamd is listening on |
| `clamdTimeout` | `Number` | `null` | The timeout when communicating with clamd for pinging and acquireing the clamd version |
| `clamdHealthCheckInterval` | `Number` | `null` | This service will perform a periodic healthcheck of clamd. Use this setting to configure the inverval in which the healthcheck is performed. Set to `0` to turn healthcheks of |

<!-- AUTO-CONTENT-END:SETTINGS -->

<!-- AUTO-CONTENT-TEMPLATE:SETTINGS
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
{{#each this}}
| `{{name}}` | {{type}} | {{defaultValue}} | {{description}} |
{{/each}}
{{^this}}
*No settings.*
{{/this}}

-->

## Actions

<!-- AUTO-CONTENT-START:ACTIONS -->
## `scan` 

Scans a given file or stream.
Not that this action does not reject, if a virus signature was detected! It will only reject if an error was
encoutered during the scan. If a signature was found (and the file therefore is malicious) the resolved
object of this action will contain the signature

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `the` | `String`, `ReadableStream` | **required** | file to scan, can be a path or a
        stream. If a path is given, this action will try to acquire a readable stream for the path |

### Results
**Type:** `PromiseLike.<({signature: (String|undefined)}|AntiVirusScanError)>`




<!-- AUTO-CONTENT-END:ACTIONS -->

<!-- AUTO-CONTENT-TEMPLATE:ACTIONS
{{#each this}}
## `{{name}}` {{#each badges}}{{this}} {{/each}}
{{#since}}
_<sup>Since: {{this}}</sup>_
{{/since}}

{{description}}

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
{{#each params}}
| `{{name}}` | {{type}} | {{defaultValue}} | {{description}} |
{{/each}}
{{^params}}
*No input parameters.*
{{/params}}

{{#returns}}
### Results
**Type:** {{type}}

{{description}}
{{/returns}}

{{#hasExamples}}
### Examples
{{#each examples}}
{{this}}
{{/each}}
{{/hasExamples}}

{{/each}}
-->

# Methods

<!-- AUTO-CONTENT-START:METHODS -->
## `ping` 

Pings the configured clamd backend

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `port` | `Number` | **required** | The port clamd is listening on. Defaults to `settings.clamdPort` |
| `host` | `string` | **required** | The host clamd is listening on. Defaults to `settings.clamdHost` |
| `timeout` | `Number` | **required** | The timeout for this operation. Defaults to `settings.clamdTimeout` |

### Results
**Type:** `PromiseLike.<(undefined|AntiVirusPingError)>`




## `clamdVersion` 

Acquires the version of the configured clamd backend

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `port` | `Number` | **required** | The port clamd is listening on. Defaults to `settings.clamdPort` |
| `host` | `string` | **required** | The host clamd is listening on. Defaults to `settings.clamdHost` |
| `timeout` | `Number` | **required** | The timeout for this operation. Defaults to `settings.clamdTimeout` |

### Results
**Type:** `PromiseLike.<(String|AntiVirusVersionError)>`




## `createScanner` 

Creates and returns a new clamd scanner

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `port` | `Number` | **required** | The port clamd is listening on. Defaults to `settings.clamdPort` |
| `host` | `string` | **required** | The host clamd is listening on. Defaults to `settings.clamdHost` |

### Results
**Type:** `Object`




## `scan` 

Scan a stream for malicious content. Resolves with an object. If a virus signature was found in the
stream, the `signature` property of the resolve object contains the name of the signature found.
If the property is not undefined, you should consider the scanned stream malicious.
This method rejects when an error was encountered during the scan, not when the scan found a signature!

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `stream` | `ReadableStream` | **required** |  |

### Results
**Type:** `PromiseLike.<({signature: (String|undefined)}|AntiVirusScanError)>`




<!-- AUTO-CONTENT-END:METHODS -->

<!-- AUTO-CONTENT-TEMPLATE:METHODS
{{#each this}}
## `{{name}}` {{#each badges}}{{this}} {{/each}}
{{#since}}
_<sup>Since: {{this}}</sup>_
{{/since}}

{{description}}

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
{{#each params}}
| `{{name}}` | {{type}} | {{defaultValue}} | {{description}} |
{{/each}}
{{^params}}
*No input parameters.*
{{/params}}

{{#returns}}
### Results
**Type:** {{type}}

{{description}}
{{/returns}}

{{#hasExamples}}
### Examples
{{#each examples}}
{{this}}
{{/each}}
{{/hasExamples}}

{{/each}}
-->

## Test
```
$ docker-compose exec package yarn test
```

In development with watching

```
$ docker-compose up
```

## License
moleculer-antivirus is available under the [MIT license](https://tldrlegal.com/license/mit-license).
