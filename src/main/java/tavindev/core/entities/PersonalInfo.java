package tavindev.core.entities;

import java.time.LocalDate;
import java.util.Optional;

public record PersonalInfo(
                String email,
                String username,
                String fullName,
                String phone,
                String password,
                String nationality,
                String residence,
                String address,
                String postalCode,
                LocalDate birthDate) {
        public PersonalInfo updatePassword(String newPassword) {
                return new PersonalInfo(this.email, this.username, this.fullName, this.phone, newPassword,
                                this.nationality, this.residence, this.address, this.postalCode, this.birthDate);
        }

        public PersonalInfo updateFullName(String newFullName) {
                return new PersonalInfo(this.email, this.username, newFullName, this.phone, this.password,
                                this.nationality, this.residence, this.address, this.postalCode, this.birthDate);
        }

        public PersonalInfo updatePhone(String newPhone) {
                return new PersonalInfo(this.email, this.username, this.fullName, newPhone, this.password,
                                this.nationality, this.residence, this.address, this.postalCode, this.birthDate);
        }

        public PersonalInfo updateAddress(String newAddress) {
                return new PersonalInfo(this.email, this.username, this.fullName, this.phone, this.password,
                                this.nationality, this.residence, newAddress, this.postalCode, this.birthDate);
        }

        public PersonalInfo updatePostalCode(String newPostalCode) {
                return new PersonalInfo(this.email, this.username, this.fullName, this.phone, this.password,
                                this.nationality, this.residence, this.address, newPostalCode, this.birthDate);
        }

}