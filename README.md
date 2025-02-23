# ESP32/ESP8266 HTTP/HTTPS Server Implementation

This project implements a dual HTTP/HTTPS server on an ESP32/ESP8266 microcontroller using MicroPython. The server provides a web interface to control a door lock mechanism with support for both secure and non-secure connections.

## Buffer Size Configuration

The server uses different buffer sizes for HTTP and HTTPS connections:

```python
# Configuration
HTTP_BUFFER_SIZE = 1024     # Standard buffer for HTTP
HTTPS_BUFFER_SIZE = 4096    # Larger buffer for HTTPS to handle SSL overhead
```

### Why Different Buffer Sizes?

1. **HTTP (1024 bytes)**:
   - Sufficient for basic HTTP requests
   - Most HTTP requests are relatively small
   - Headers are typically minimal

2. **HTTPS (4096 bytes)**:
   - Larger buffer needed due to SSL/TLS overhead
   - Additional security-related headers
   - Client certificates and encryption information
   - Modern browsers send more extensive headers

### Buffer Usage

```python
def handle_connection(conn, client_ip, protocol="HTTP"):
    # Use larger buffer for HTTPS
    buffer_size = HTTPS_BUFFER_SIZE if protocol == "HTTPS" else HTTP_BUFFER_SIZE
    raw_request = conn.recv(buffer_size)
```

The server automatically selects the appropriate buffer size based on the protocol being used.

### Request Size Monitoring

The server logs the actual request size to help monitor buffer usage:

```
==================================================
HTTPS Request from 192.168.1.100
==================================================
Request size: 2048 bytes
==================================================
```

This helps in adjusting buffer sizes if needed.

## Request Decoding

When the request is received:
1. The appropriate buffer size is used to receive the raw bytes
2. The byte array is decoded using UTF-8 encoding
3. The decoded content is parsed and displayed
4. Request size is logged for monitoring

```python
# Decode the byte array using UTF-8
decoded_request = raw_request.decode('utf-8')

# Split and process the request
lines = decoded_request.split('\r\n')
```

## Port Configuration

[Rest of the previous README content about ports remains the same...]

## Security Considerations

1. **Buffer Sizes**:
   - Insufficient buffer size can truncate HTTPS requests
   - Too large buffers may impact memory usage
   - Monitor request sizes to optimize buffer configuration

2. **Memory Usage**:
   - HTTPS connections require more memory
   - Consider available RAM when setting buffer sizes
   - Monitor memory usage on your specific device

3. **SSL/TLS Overhead**:
   - HTTPS adds encryption overhead
   - Headers are typically larger due to security information
   - Client certificates may increase request size

## Important Notes

- Adjust buffer sizes based on your specific needs
- Monitor request sizes in the console output
- Consider memory constraints of your device
- Balance between buffer size and memory usage
