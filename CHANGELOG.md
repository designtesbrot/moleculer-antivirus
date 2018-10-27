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
