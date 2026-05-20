"""Template tags for the aortl_admin app-shell.

Three helpers, all emitting design-system class names verbatim:

- `nav_item`     — top navbar link, marks `aria-current="page"` on match.
- `sidebar_item` — sidebar link with optional Tabler icon + badge.
- `is_active`    — boolean filter for ad-hoc active-state logic in templates.

Active matching is path-prefix based: a link is active if `request.path`
starts with `url` (and the link's URL is not the root path, in which case
exact match is required so "/" doesn't claim every page).
"""

from __future__ import annotations

from django import template
from django.urls import NoReverseMatch, reverse
from django.utils.html import format_html
from django.utils.safestring import SafeString, mark_safe

register = template.Library()


def _resolve_url(url: str) -> str:
    """Accept either a literal path or a URL name; return a path."""
    if url.startswith(("/", "http://", "https://", "#")):
        return url
    try:
        return reverse(url)
    except NoReverseMatch:
        return url


def _is_active(request_path: str, url: str) -> bool:
    if url == "/":
        return request_path == "/"
    return request_path == url or request_path.startswith(url.rstrip("/") + "/")


@register.simple_tag(takes_context=True)
def nav_item(context, url: str, label: str) -> SafeString:
    resolved = _resolve_url(url)
    request = context.get("request")
    active = bool(request and _is_active(request.path, resolved))
    return format_html(
        '<a class="navbar-item"{aria} href="{href}">{label}</a>',
        aria=mark_safe(' aria-current="page"') if active else "",
        href=resolved,
        label=label,
    )


@register.simple_tag(takes_context=True)
def sidebar_item(
    context,
    url: str,
    label: str,
    icon: str = "",
    badge: str = "",
) -> SafeString:
    """Render a sidebar item.

    `icon` is a Tabler icon class name (e.g. "ti-home"). Pass an empty string
    to omit the icon slot. `badge` is text shown right-aligned (e.g. unread count).
    """
    resolved = _resolve_url(url)
    request = context.get("request")
    active = bool(request and _is_active(request.path, resolved))

    icon_html = (
        format_html('<span class="sidebar-icon"><i class="ti {}"></i></span>', icon)
        if icon
        else mark_safe("")
    )
    badge_html = (
        format_html('<span class="sidebar-badge">{}</span>', badge) if badge else mark_safe("")
    )

    return format_html(
        '<a class="sidebar-item"{aria} href="{href}">{icon}'
        '<span class="sidebar-label">{label}</span>{badge}</a>',
        aria=mark_safe(' aria-current="page"') if active else "",
        href=resolved,
        icon=icon_html,
        label=label,
        badge=badge_html,
    )


@register.filter
def is_active(request_path: str, url: str) -> bool:
    return _is_active(request_path, _resolve_url(url))
