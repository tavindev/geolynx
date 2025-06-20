package tavindev.core.entities;

public record ProfessionalInfo(
        String employer,
        String jobTitle,
        String employerTaxId) {
    public ProfessionalInfo updateEmployer(String newEmployer) {
        return new ProfessionalInfo(newEmployer, this.jobTitle, this.employerTaxId);
    }

    public ProfessionalInfo updateJobTitle(String newJobTitle) {
        return new ProfessionalInfo(this.employer, newJobTitle, this.employerTaxId);
    }

    public ProfessionalInfo updatePhoto(String newEmployerTaxId) {
        return new ProfessionalInfo(this.employer, this.jobTitle, newEmployerTaxId);
    }
}