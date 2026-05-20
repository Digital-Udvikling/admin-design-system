# aortl-admin

Django distribution of the [`@aortl/admin`](https://digital-udvikling.github.io/admin-design-system/) design system. Pairs with [`django-tailwind-cli`](https://github.com/oliverandrich/django-tailwind-cli) so your build pipeline stays Node-free — the Tailwind v4 Oxide standalone binary is downloaded on demand.

## What you get

- The full `admin-css` source vendored into the package's static dir, so Tailwind compiles the design system into your CSS in a single pass.
- Django templates for the app-shell (base, navbar, sidebar) using the same class contract as the React components.
- Template tags for active-state nav/sidebar items.
- An optional [`django-crispy-forms`](https://github.com/django-crispy-forms/django-crispy-forms) template pack (`aortl`) that emits the design-system form DOM.

## Install

```fish
uv add aortl-admin django django-tailwind-cli
# Or with the crispy template pack:
uv add 'aortl-admin[crispy]' django django-tailwind-cli django-crispy-forms
```

Add the apps to `settings.py`:

```python
INSTALLED_APPS = [
    # ...
    "django_tailwind_cli",
    "aortl_admin",
    "crispy_forms",  # optional
]

# django-tailwind-cli
TAILWIND_CLI_SRC_CSS = "assets/css/aortl.input.css"
TAILWIND_CLI_DIST_CSS = "css/aortl.output.css"

# django-crispy-forms (optional)
CRISPY_ALLOWED_TEMPLATE_PACKS = ["aortl"]
CRISPY_TEMPLATE_PACK = "aortl"
```

Scaffold the starter CSS and base template:

```fish
uv run python manage.py aortl_admin_init
```

Then compile (downloads the Tailwind binary on first run):

```fish
uv run python manage.py tailwind build
```

Extend `aortl_admin/base.html` (or the copy at `templates/aortl_base.html` that the init command placed in your project) and you're done.

See the [Django module docs](https://digital-udvikling.github.io/admin-design-system/modules/django/) for the full guide.
