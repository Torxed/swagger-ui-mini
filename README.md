# <img src="https://hvornum.se/SwaggerUI-Mini.png" height="80">

A minimal version of swagger-ui (No NodeJS &amp; No dependencies)

# Example

A [Live Demo](https://hvornum.se/swagger-ui-mini/examples/example.html) can be viewed online.<br>
For more complete examples, check under `/examples` and see what's in store.

### Manifest
```json
{
    "urls" : {
        "/pet" : {
            "POST" : {
                "description" : "Add a new pet to the store",
                "payloads" : {
                    "body" : {
                        "flags" : "REQUIRED",
                        "description" : "Pet object that needs to be added to the store",
                        "data" : {
                            "name" : "Cat name",
                            "type" : "CAT"
                        },
                        "responses" : {
                            "405" : {
                                "description" : "Invalid input"
                            }
                        }
                    }
                }
            }
        }
    }
}
```

### HTML Page
```html
<html>
    <head>
        <!-- Import the CSS -->
        <link rel="stylesheet" type="text/css" href="swagger.css">
    
        <!-- Define the manifest (null if you want it loaded later) -->
        <script type="text/javascript">
            let manifest = null;
        </script>
    
        <!-- Import the swagger module -->
        <script type="module">
            import * as swagger from '/swagger.js';

            window.onload = function() {
                // Load a manifest, and once it's loaded - call a function().
                swagger.load_manifest('/manifest.json', function() {
                    swagger.load_urls(manifest['urls'], document.getElementById('table'));
                });
            }
        </script>
    </head>
    <body>
        <div class="table" id="table">
        </div>
    </body>
</html>
```