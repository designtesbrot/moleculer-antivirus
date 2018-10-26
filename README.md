[![Moleculer logo](http://moleculer.services/images/banner.png)](https://github.com/moleculerjs/moleculer)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdesigntesbrot%2Fmoleculer-antivirus.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdesigntesbrot%2Fmoleculer-antivirus?ref=badge_shield)

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

## Requirements

This service relies on [clamscan](https://www.npmjs.com/package/clamscan) which itself relies on clamav being installed.
This repository includes a Dockerfile which installes clamav. The examples folder includes a docker-compose file which
includes launching clamd as a separate connected container and making use of a shared mount and tcp connectivity between 
the clamav deamon and client. 

## Compability
This service is not expected to work on a windows host.

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
| `temporaryStorage` | `String` | `null` | In case you pass a redable stream, we have to store the stream somewhere. This path is to location of this storage. |
| `scan_log` | `String` | `null` | Path to a writeable log file to write scan results into |
| `debug_mode` | `Boolean` | `null` | Whether or not to log info/debug/error msgs to the console |
| `clamscan` | `Object` | `null` | clamdcan configuration |
| `clamscan.path` | `String` | `null` | Path to the clamscan binary |
| `clamscan.db` | `String` | `null` | Path to a custom virus definition database |
| `clamscan.scan_archives` | `Boolean` | `null` | If true, scan archives (ex. zip, rar, tar, dmg, iso, etc...) |
| `clamscan.active` | `Boolean` | `null` | If true, this service will consider using the clamscan binary |
| `clamdscan` | `Object` | `null` | clamdscan configuration |
| `clamdscan.path` | `String` | `null` | Path to the clamdscan binary |
| `clamdscan.config_file` | `String` | `null` | Path to the clamdscan configuration |
| `clamdscan.multiscan` | `Boolean` | `null` | Scan using all available cores! Yay! |
| `clamdscan.reload_db` | `Boolean` | `null` | If true, will re-load the DB on every call (slow) |
| `clamdscan.active` | `Boolean` | `null` | If true, this service will consider using the clamdscan binary |
| `preference` | `String` | `null` | Which scan client to prefer (clamdscan or clamscan) |

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

Scans a given file or stream

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `the` | `String`, `ReadableStream` | **required** | file to scan, can be a path or a
        stream |

### Results
**Type:** `Object`

The Scan result.


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
## `scanFile` 

Scan a file for a virus

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `path` | `String` | **required** | The stream or file to scan |

### Results
**Type:** `Promise.<(AntiVirusScanError|{file: {String}, infected: {Boolean}})>`




## `persistStream` 

Persists a stream to the file system before scanning it (clamav has
no interface for nodejs streams) The location can be configured via
the `temporaryStorage` setting. In case of clamdscan being used, it
is your responsiblility that the temporary storage location is
available to the clamd host. Check the examples folder, where docker
mounts are used.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `data` | `ReadableStream` | **required** | the stream to persist |

### Results
**Type:** `PromiseLike.<(String|AntiVirusScanError)>`

resolved promise
        contains the path of the file.


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


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdesigntesbrot%2Fmoleculer-antivirus.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdesigntesbrot%2Fmoleculer-antivirus?ref=badge_large)