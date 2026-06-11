from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

from .models import Company, Job, Application
from .serializer import CompanySerializer, JobSerializer, ApplicationSerializer

class IsEmployer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'employer'

    def get_queryset(self):
        return Job.objects.filter(company__owner=self.request.user)

class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated, IsEmployer]

    def get_queryset(self):
        return Company.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [DjangoFilterBackend, SearchFilter]

    filterset_fields = ['location', 'salary']
    search_fields = ['title', 'description']

    def get_queryset(self):
        return Job.objects.all()


class IsApplicant(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'applicant'


class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsApplicant]

    def get_queryset(self):
        return Application.objects.filter(applicant=self.request.user)

    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user)


class EmployerApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmployer]

    def get_queryset(self):
        return Application.objects.filter(job__company__owner=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        application = self.get_object()

        status = request.data.get("status")

        if status not in ["accepted", "rejected"]:
            return Response(
                {"error": "Invalid status"},
                status=400
            )

        application.status = status
        application.save()

        return Response(ApplicationSerializer(application).data)