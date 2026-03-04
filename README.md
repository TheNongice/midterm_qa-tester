# Midterm Project
This is my midterm project assignment for course 2119583 Section 119 (CEDT Special Practitioner Topics in Digital Technology II - Practical Software Testing and Quality Assurance).

The latest and full-progress version is hosted on my [GitLab](https://gitlab.com/TheNongice/midterm-as-test), while the GitHub upload is for summary commits and sent to myCourseVille purposes only.

## Acceptance Criteria
1. Verify that a user can successfully submit the form with all valid data.
2. Verify that the form cannot be submitted if mandatory fields (First Name, Last Name, Gender, Mobile)
are blank.
3. Verify that the "City" dropdown options change based on the selected "State".
4. Verify that the "Subjects" field allows multiple entries and displays them as removable tags.
5. Verify that the submission modal correctly displays the exact data entered in the form.
6. Field Validation:
    - **Mobile:** Must be exactly 10 digits. Alphabetic characters or special symbols are not permitted.
    - **Email:** Must contain "@" and a valid domain extension.
    - **Date of Birth:** The field should default to the current system date but allow manual
selection via a calendar widget.
7. Dynamic Dropdowns: The "City" dropdown must remain disabled or empty until a "State" is selected.
Upon state selection, only cities belonging to that state shall be displayed.

## Result of tests
You can visit my Playwright report by [clicking this link](https://midterm-as-test-6b5a45.gitlab.io/).
