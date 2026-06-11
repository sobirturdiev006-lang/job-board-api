from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Roles(models.TextChoices):
        APPLICANT = "applicant", "Applicant",
        EMPLOYER = "employer", "Employer"

    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.APPLICANT
    )

    def __str__(self):
        return self.username