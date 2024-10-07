from django import forms
from django.contrib.auth.forms import AuthenticationForm


class LoginUserForm(AuthenticationForm):
    username = forms.CharField(max_length=20, label='Логін',
                               widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Логін'}))
    password = forms.CharField(max_length=8, label='Пароль',
                               widget=forms.PasswordInput(attrs={'class': 'form-input', 'placeholder': 'Пароль'}))
