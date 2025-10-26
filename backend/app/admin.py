from django.contrib import admin
from .models import User, Token, Resume

# Register your models here.
admin.site.register(User)
admin.site.register(Token)
admin.site.register(Resume)