from django.db import models

class Resume(models.Model):
    file = models.FileField(upload_to='resumes/')
    role = models.CharField(max_length=100)
    extracted_skills = models.TextField(blank=True, null=True)
