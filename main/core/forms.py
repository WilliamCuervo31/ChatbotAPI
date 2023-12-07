from django.contrib.auth.forms import AuthenticationForm, UsernameField
from django import forms
from .models import User

class CustomSigninForm(AuthenticationForm):
    username = UsernameField(
        widget=forms.TextInput(
            attrs={
                'name': 'username',
                'id': 'username',
                'tabindex': '1',
                'placeholder': 'Usuario',
                'class': 'form-control',
                }
            )
        )

    password = forms.CharField(
        strip=False,
        widget=forms.PasswordInput(
            attrs={
                'name': 'password',
                'id': 'password',
                'tabindex': '2',
                'placeholder': 'Contraseña',
                'class': 'form-control',
            }
        )
    )

class CustomUserForm(forms.ModelForm):
    '''
    Formulario de registro
    '''
    first_name = forms.CharField(
        label='Nombre',
        max_length=15, 
        min_length=2, 
        required=True,
        widget=forms.TextInput(
            attrs={
                    'pattern': '^(?! )[\p{L}áéíóúüÁÉÍÓÚÜñÑ]+(?:\s[\p{L}áéíóúüÁÉÍÓÚÜñÑ]+)*(?! )$',
                    'title': 'Verifica que no tengas espacios en blanco al principio, al final o más de dos en medio',
                    'class':'form-control',
                    'name': 'first_name',
                    'id': 'first_name', 
                    'tabindex': '1',
                    'placeholder': 'Nombre',
                    'autofocus': 'autofocus',
                    }
                ),
    )

    last_name = forms.CharField(
        label='Apellido',
        widget=forms.TextInput(attrs={
                                      'pattern':'^(?! )[\p{L}áéíóúüÁÉÍÓÚÜñÑ]+(?:\s[\p{L}áéíóúüÁÉÍÓÚÜñÑ]+)*(?! )$',
                                      'title': 'Verifica que no tengas espacios en blanco al principio, al final o más de dos en medio',
                                      'class':'form-control',
                                        'name': 'last_name',
                                        'id': 'last_name', 
                                        'tabindex': '2',
                                        'placeholder': 'Apellido',
                                      }), 
        max_length=15, 
        min_length=2, 
        required=True,
    )

    username = forms.CharField(
        max_length=254,
        widget=forms.TextInput(attrs={
                'class':'form-control',
                'name': 'username',
                'id': 'username', 
                'tabindex': '3',
                'placeholder': 'Usuario',
                                      }),
    )

    password = forms.CharField(
        label='Contraseña',
        min_length=6,
        max_length=40,
        widget=forms.PasswordInput(attrs={
                                        'title':'No puedes poner espacios en blanco al principio o al final ni en medio', 
                                        'class':'form-control',
                                        'name': 'password',
                                        'id': 'password', 
                                        'tabindex': '5',
                                        'placeholder': 'Contraseña',
                                          }),
        required=True,
    )

    email = forms.EmailField (
        label='Correo',
        widget=forms.EmailInput(attrs={
            'pattern':'^(?!.*\s)[\w\s]*[\w]+@(?:[\w]+\.)+[a-zA-Z]{2,}$',
            'title':'Quita los espacios en blanco al principio, al final o en medio', 'class':'form-control',
            'name': 'email',
            'id': 'email', 
            'tabindex': '4',
            'placeholder': 'Correo',
            }),
        required=True,
    )

    password2 = forms.CharField(
        label='Confirmar contraseña',
        max_length=40,
        widget=forms.PasswordInput(attrs={
            'class':'form-control',
            'name': 'password2',
            'id': 'password2', 
            'tabindex': '6',
            'placeholder': 'Confirmar contraseña',
            }),
    )

    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'email',
            'username',
            'password',
        ]