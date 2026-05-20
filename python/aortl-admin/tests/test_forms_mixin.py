from django import forms

from aortl_admin.forms import AortlFormMixin


class SampleForm(AortlFormMixin, forms.Form):
    name = forms.CharField()
    bio = forms.CharField(widget=forms.Textarea)
    color = forms.ChoiceField(choices=[("r", "Red"), ("g", "Green")])
    color_radio = forms.ChoiceField(
        choices=[("r", "Red")],
        widget=forms.RadioSelect,
    )
    subscribe = forms.BooleanField(required=False)


def test_mixin_applies_classes():
    form = SampleForm()
    assert form.fields["name"].widget.attrs["class"] == "input input-bordered"
    assert form.fields["bio"].widget.attrs["class"] == "textarea textarea-bordered"
    assert form.fields["color"].widget.attrs["class"] == "select select-bordered"
    assert form.fields["color_radio"].widget.attrs["class"] == "radio"
    assert form.fields["subscribe"].widget.attrs["class"] == "checkbox"


def test_mixin_preserves_existing_class():
    class WithExtra(AortlFormMixin, forms.Form):
        name = forms.CharField(widget=forms.TextInput(attrs={"class": "my-custom"}))

    form = WithExtra()
    assert form.fields["name"].widget.attrs["class"] == "my-custom input input-bordered"
