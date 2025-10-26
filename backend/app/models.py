from django.db import models

class Resume(models.Model):
    # store only the original filename (no file upload/storage)
    file_name = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(max_length=120, blank=True)
    extracted_skills = models.TextField(blank=True, null=True)  # comma separated
    recommended_skills = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Resume {self.id} - {self.role or 'NoRole'}"

class Token(models.Model):
    id = models.AutoField(primary_key=True)
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField()
    expires_at = models.DateTimeField()
    user_id = models.IntegerField()
    is_used = models.BooleanField(default=False)


class User(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=10, null=True)
    country = models.CharField(max_length=63, blank=True, null=True)

    def __str__(self) -> str:
        return self.name