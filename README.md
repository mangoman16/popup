# popup

## Debug Mode

To activate debug mode, open `popup.html` and find the configuration section at the top of the `<script>` block:

```javascript
var showDelay = 2000;
var oncePerSession = true;
var slideInterval = 5000;
```

Change it to:

```javascript
var showDelay = 0;
var oncePerSession = false;
var slideInterval = 5000;
```

- **`showDelay = 0`** — The popup appears immediately instead of after a 2-second delay.
- **`oncePerSession = false`** — The popup shows on every page load instead of only once per browser session.

Remember to revert these values before deploying to production.

## Apache Setup

No custom VirtualHost directives are needed for access control. The `src/` and `storage/` directories are protected by `.htaccess` files that deny all web access. Just make sure `AllowOverride All` is enabled for your DocumentRoot (or at least `AllowOverride Limit`).

A minimal VirtualHost is sufficient:

```apache
<VirtualHost *:80>
    ServerName kindergarten.example.com
    DocumentRoot /path/to/kindergartenctl/public

    <Directory /path/to/kindergartenctl/public>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```
