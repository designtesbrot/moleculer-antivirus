-----------------------------
<a name="1.2.0"></a>
# 1.2.0 (2018-10-27)

## New

### MimeType Detection
The `scan` action replicates the streams and performs mimetype detection on it. If detectable, the resolved object will include `ext` and `mime` properties.

### Size Detection
The `scan` action replicates the streams and performs size detection on it. If detectable, the resolved object will include a `size` property which contains the total number of bytes in the stream.

-----------------------------
<a name="1.1.0"></a>
# 1.1.0 (2018-10-27)

## New

### Remote scan support
The `scan` action now accepts not only paths and streams, but also plain objects. Plain objects will be used together with node-fetch to acquire a stream for a file available with http(s) and to scan 
the response body stream. This allows for scanning files available remotely without persisting them anywhere on your system. 

-----------------------------
<a name="1.0.0"></a>
# 1.0.0 (2018-10-27)

## New

### End-To-End Stream support
The underlying clamav package has been exchanged, allowing files to be streamed to the clamav daemon. In addition, having a local installation of clamav is not a requirement of this service anymore.
This is a **breaking change**, as the service settings have changed. Read the `README` for the updated documentation on the service settings and checkout the updated `/examples`.

-----------------------------
<a name="0.1.0"></a>
# 0.1.0 (2018-10-14)

## New

### Single File scan
The service exposes an **scan** action, which accepts either a readble stream or a file path.
Added documentation and extensive example, including remote clamd host with network shared storage.
