package tavindev.infra.dto;

public record UserDTO(
    String username,
    String email,
    String nome,
    String telefone,
    String estado,
    String perfil,
    String role,
    String morada,
    String nif,
    String entidade_empregadora,
    String funcao,
    String nif_entidade_empregadora,
    String foto
) {} 