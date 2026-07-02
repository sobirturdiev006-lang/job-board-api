from django.db import models
from users.models import User
from django.core.validators import FileExtensionValidator

class Company(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='companies')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Job(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    salary = models.IntegerField()
    location = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# --------------------------------------------------------------------------------------------------------------------------------------------------------



class Application(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ACCEPTED = 'accepted', 'Accepted'
        REJECTED = 'rejected', 'Rejected'

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applicants')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applicants')

    cover_letter = models.TextField(blank=True)
    cv = models.FileField(
        upload_to='cvs/',
        null=True,
        blank=True,
        validators=[
            FileExtensionValidator(['pdf', 'doc', 'docx'])
        ]
    )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.applicant.username} -> {self.job.title}"