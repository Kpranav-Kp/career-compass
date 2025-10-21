from django.db import models

class Resume(models.Model):
    file = models.FileField(upload_to='resumes/')
    role = models.CharField(max_length=120, blank=True)
    extracted_skills = models.TextField(blank=True, null=True)  # comma separated
    recommended_skills = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Resume {self.id} - {self.role or 'NoRole'}"
