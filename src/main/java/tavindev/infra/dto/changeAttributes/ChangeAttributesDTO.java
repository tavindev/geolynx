package tavindev.infra.dto.changeAttributes;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.Map;

public record ChangeAttributesDTO(
    @NotEmpty(message = "O identificador não pode estar vazio")
    String identificador,
    
    @NotNull(message = "Os atributos não podem ser nulos")
    Map<String, String> atributos
) {} 