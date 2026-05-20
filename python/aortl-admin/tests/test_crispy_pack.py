import pytest

pytest.importorskip("crispy_forms")

from crispy_forms.helper import FormHelper  # noqa: E402
from crispy_forms.layout import Layout, Submit  # noqa: E402
from crispy_forms.utils import render_crispy_form  # noqa: E402
from django import forms  # noqa: E402


class DemoForm(forms.Form):
    name = forms.CharField(label="Name", help_text="Your full name.")
    bio = forms.CharField(widget=forms.Textarea, required=False)
    color = forms.ChoiceField(
        choices=[("r", "Red"), ("g", "Green")],
        widget=forms.RadioSelect,
    )
    pick = forms.MultipleChoiceField(
        choices=[("a", "Alpha"), ("b", "Beta")],
        widget=forms.CheckboxSelectMultiple,
    )
    subscribe = forms.BooleanField(required=False, label="Subscribe to newsletter")
    size = forms.ChoiceField(choices=[("s", "Small"), ("l", "Large")])


@pytest.fixture
def helper():
    helper = FormHelper()
    helper.layout = Layout("name", "bio", "color", "pick", "subscribe", "size", Submit("go", "Go"))
    return helper


def test_text_field_emits_input_class(helper):
    html = render_crispy_form(DemoForm(), helper=helper)
    assert 'class="field' in html
    assert 'class="field-label"' in html
    assert "input input-bordered" in html


def test_textarea_emits_textarea_class(helper):
    html = render_crispy_form(DemoForm(), helper=helper)
    assert "textarea textarea-bordered" in html


def test_radio_select_emits_radio_group(helper):
    html = render_crispy_form(DemoForm(), helper=helper)
    assert 'class="radio-group radio-group-vertical" role="radiogroup"' in html
    assert 'class="radio"' in html


def test_checkbox_select_multiple(helper):
    import re

    html = render_crispy_form(DemoForm(), helper=helper)
    # CheckboxSelectMultiple renders 2 inputs; BooleanField renders 1. All get the .checkbox class
    # (sometimes with a crispy-prepended widget class like "checkboxinput checkbox").
    assert len(re.findall(r'class="(?:[^"]*\s)?checkbox(?:\s|")', html)) >= 3


def test_native_select_emits_select_class(helper):
    html = render_crispy_form(DemoForm(), helper=helper)
    assert "select select-bordered" in html


def test_help_text_emits_field_description(helper):
    html = render_crispy_form(DemoForm(), helper=helper)
    assert 'class="field-description"' in html
    assert "Your full name." in html


def test_submit_button_emits_btn_class(helper):
    html = render_crispy_form(DemoForm(), helper=helper)
    assert 'class="btn btn-primary"' in html


def test_required_marker(helper):
    html = render_crispy_form(DemoForm(), helper=helper)
    assert "data-required" in html


def test_errors_marked_invalid(helper):
    form = DemoForm(data={"bio": "x"})  # required `name`, `color`, `pick`, `size` missing
    assert not form.is_valid()
    html = render_crispy_form(form, helper=helper)
    assert "data-invalid" in html
    assert 'class="field-error"' in html
