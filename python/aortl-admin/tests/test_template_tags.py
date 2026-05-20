from django.template import Context, Template


def render(template: str, **ctx) -> str:
    return Template("{% load aortl_admin %}" + template).render(Context(ctx))


def test_nav_item_inactive(request_at):
    out = render(
        '{% nav_item url="/users/" label="Users" %}',
        request=request_at("/dashboard/"),
    )
    assert 'class="navbar-item"' in out
    assert 'href="/users/"' in out
    assert ">Users</a>" in out
    assert "aria-current" not in out


def test_nav_item_active_exact(request_at):
    out = render(
        '{% nav_item url="/users/" label="Users" %}',
        request=request_at("/users/"),
    )
    assert 'aria-current="page"' in out


def test_nav_item_active_prefix(request_at):
    out = render(
        '{% nav_item url="/users/" label="Users" %}',
        request=request_at("/users/42/edit/"),
    )
    assert 'aria-current="page"' in out


def test_nav_item_root_does_not_match_everything(request_at):
    out = render(
        '{% nav_item url="/" label="Home" %}',
        request=request_at("/users/"),
    )
    assert "aria-current" not in out


def test_sidebar_item_with_icon_and_badge(request_at):
    out = render(
        '{% sidebar_item url="/inbox/" label="Inbox" icon="ti-mail" badge="7" %}',
        request=request_at("/inbox/"),
    )
    assert 'class="sidebar-item"' in out
    assert 'aria-current="page"' in out
    assert 'class="sidebar-icon"' in out
    assert 'class="ti ti-mail"' in out
    assert 'class="sidebar-label">Inbox' in out
    assert 'class="sidebar-badge">7' in out


def test_sidebar_item_without_optional_slots(request_at):
    out = render(
        '{% sidebar_item url="/settings/" label="Settings" %}',
        request=request_at("/"),
    )
    assert "sidebar-icon" not in out
    assert "sidebar-badge" not in out
    assert "aria-current" not in out


def test_is_active_filter():
    out = Template(
        "{% load aortl_admin %}{{ '/users/42/'|is_active:'/users/' }}",
    ).render(Context({}))
    assert out.strip() == "True"
