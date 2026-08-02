from django.db import models


class TimeStampedModel(models.Model):
    # base model for time stamping 
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True # this means that this model is only meant to be inherited


class Department(TimeStampedModel): #done
    # for storing departments
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True, help_text="Code representing the department.")  
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.name} ({self.code})"


class Designation(TimeStampedModel): #done
    title = models.CharField(max_length=100)
    code = models.CharField(max_length=20, help_text="Code representing the job title.")
    description = models.TextField(blank=True, null=True)
    department = models.ForeignKey(Department, on_delete=models.PROTECT)
    level = models.PositiveIntegerField(default=1, help_text="Hierarchy/seniority level(1 for Junior, 2 for Mid, 3 for Senior).")

    def __str__(self):
        return f"{self.title} - {self.department.code}"


class EmploymentType(TimeStampedModel): #done
    # for storing employment types fulltime, part time
    name = models.CharField(max_length=50, unique=True)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.code})"


class Branch(TimeStampedModel): #done
    # it tells physical branch of the company
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default="India")
    postal_code = models.CharField(max_length=20)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    is_head_office = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.code})"


class Team(TimeStampedModel): #done
    # for teams within department
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    department = models.ForeignKey(Department, on_delete=models.PROTECT)
    team_lead = models.ForeignKey('Employee', on_delete=models.SET_NULL, null=True, blank=True, related_name='led_teams')
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.department.code})"


class Employee(TimeStampedModel):
    
    class Gender(models.TextChoices):
        MALE = 'MALE', 'Male'
        FEMALE = 'FEMALE', 'Female'
        OTHER = 'OTHER', 'Other'
        PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY', 'Prefer Not to Say'

    class EmploymentStatus(models.TextChoices):
        PROBATION = 'PROBATION', 'Probation'
        ACTIVE = 'ACTIVE', 'Active'
        NOTICE_PERIOD = 'NOTICE_PERIOD', 'Notice Period'
        RESIGNED = 'RESIGNED', 'Resigned'
        TERMINATED = 'TERMINATED', 'Terminated'

    # Primary identification
    employee_id = models.CharField(max_length=20, unique=True)

    # Personal details
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    company_email = models.EmailField(unique=True)
    personal_email = models.EmailField(unique=True, blank=True, null=True)
    phone = models.CharField(max_length=20)
    # profile_photo = models.ImageField(upload_to='employee_photos/', blank=True, null=True)
    joining_date = models.DateField()
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=20, choices=Gender.choices)
    employment_status = models.CharField(
        max_length=20, 
        choices=EmploymentStatus.choices, 
        default=EmploymentStatus.PROBATION
    )
    # Organizational relationships (Protected lookups)
    department = models.ForeignKey(Department, on_delete=models.PROTECT)
    designation = models.ForeignKey(Designation, on_delete=models.PROTECT)
    employment_type = models.ForeignKey(EmploymentType, on_delete=models.PROTECT)
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT)
    team = models.ForeignKey(Team, on_delete=models.PROTECT, null=True, blank=True)

    # Hierarchy relationship
    manager = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.employee_id})"
