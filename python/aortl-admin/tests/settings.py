SECRET_KEY = "test-key"
DEBUG = True
ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.auth",
    "django.contrib.staticfiles",
    "aortl_admin",
]

try:
    import crispy_forms  # noqa: F401

    INSTALLED_APPS.append("crispy_forms")
    CRISPY_ALLOWED_TEMPLATE_PACKS = ["aortl"]
    CRISPY_TEMPLATE_PACK = "aortl"
except ImportError:
    pass

DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}}

ROOT_URLCONF = "tests.urls"
STATIC_URL = "/static/"
USE_TZ = True

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
            ],
        },
    },
]

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
