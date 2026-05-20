"""Form helpers for projects that don't want crispy-forms.

`AortlFormMixin` walks `self.fields` at instantiation and applies the
design-system class names to each widget's `attrs["class"]` based on its
widget type. The result is that plain `{{ form.field }}` renders with the
right `.input` / `.textarea` / `.select` / `.checkbox` / `.radio` classes.

Existing user-supplied classes are preserved (appended, not overwritten).
"""

from __future__ import annotations

from typing import Any

from django import forms

WIDGET_CLASSES: dict[type[forms.Widget], str] = {
    forms.TextInput: "input input-bordered",
    forms.EmailInput: "input input-bordered",
    forms.URLInput: "input input-bordered",
    forms.NumberInput: "input input-bordered",
    forms.PasswordInput: "input input-bordered",
    forms.DateInput: "input input-bordered",
    forms.DateTimeInput: "input input-bordered",
    forms.TimeInput: "input input-bordered",
    forms.SearchInput: "input input-bordered",
    forms.HiddenInput: "",
    forms.Textarea: "textarea textarea-bordered",
    forms.Select: "select select-bordered",
    forms.NullBooleanSelect: "select select-bordered",
    forms.SelectMultiple: "select select-bordered",
    forms.CheckboxInput: "checkbox",
    forms.CheckboxSelectMultiple: "checkbox",
    forms.RadioSelect: "radio",
    forms.FileInput: "input input-bordered",
    forms.ClearableFileInput: "input input-bordered",
}


def class_for(widget: forms.Widget) -> str:
    for widget_cls, css in WIDGET_CLASSES.items():
        if isinstance(widget, widget_cls):
            return css
    return ""


class AortlFormMixin:
    """Apply design-system widget classes when the form is instantiated."""

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        for field in self.fields.values():  # type: ignore[attr-defined]
            css = class_for(field.widget)
            if not css:
                continue
            existing = field.widget.attrs.get("class", "")
            field.widget.attrs["class"] = (existing + " " + css).strip() if existing else css
