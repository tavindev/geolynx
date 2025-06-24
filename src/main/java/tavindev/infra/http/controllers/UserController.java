package tavindev.infra.http.controllers;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.User;
import tavindev.core.entities.AccountStatus;
import tavindev.core.entities.UserRole;
import tavindev.core.entities.UserProfile;
import tavindev.core.services.UserService;
import tavindev.infra.dto.*;
import tavindev.infra.dto.accountProfile.AccountProfileDTO;
import tavindev.infra.dto.accountProfile.AccountProfileResponseDTO;
import tavindev.infra.dto.changeAccountState.ChangeAccountStateDTO;
import tavindev.infra.dto.changeAccountState.ChangeAccountStateResponseDTO;
import tavindev.infra.dto.removeUser.RemoveUserAccountDTO;
import tavindev.infra.dto.removeUser.RemoveUserAccountResponseDTO;
import tavindev.infra.dto.changeAttributes.ChangeAttributesDTO;
import tavindev.infra.dto.changeAttributes.ChangeAttributesResponseDTO;
import tavindev.infra.dto.changePassword.ChangePasswordDTO;
import tavindev.infra.dto.changePassword.ChangePasswordResponseDTO;
import tavindev.infra.dto.changeRole.ChangeRoleDTO;
import tavindev.infra.dto.changeRole.ChangeRoleResponseDTO;
import tavindev.infra.dto.activateAccount.ActivateAccountDTO;
import tavindev.infra.dto.activateAccount.ActivateAccountResponseDTO;
import tavindev.infra.dto.deactivateAccount.DeactivateAccountDTO;
import tavindev.infra.dto.deactivateAccount.DeactivateAccountResponseDTO;
import tavindev.infra.dto.suspendAccount.SuspendAccountDTO;
import tavindev.infra.dto.suspendAccount.SuspendAccountResponseDTO;
import tavindev.infra.dto.requestRemoval.RequestRemovalDTO;
import tavindev.infra.dto.requestRemoval.RequestRemovalResponseDTO;
import tavindev.infra.dto.changeProfile.ChangeProfileDTO;
import tavindev.infra.dto.changeProfile.ChangeProfileResponseDTO;
import tavindev.infra.dto.accountStatus.AccountStatusDTO;
import tavindev.infra.dto.accountStatus.AccountStatusResponseDTO;
import tavindev.infra.dto.UserInfoDTO;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Path("/user")
@Produces(MediaType.APPLICATION_JSON)
public class UserController {
    @Inject
    private UserService userService;

    private String orNotDefined(Optional<String> field) {
        return field.orElse("NOT DEFINED");
    }

    @GET
    public Response getUserInfo(@CookieParam("session") String sessionToken) {
        User user = userService.getUserInfo(sessionToken);
        UserInfoDTO userInfo = new UserInfoDTO(user.getId(), user.getRole().name(), user.getPersonalInfo().fullName());
        return Response.ok(userInfo).build();
    }

    @POST
    @Path("/change-role")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response changeRole(
            @CookieParam("session") String sessionToken,
            @Valid ChangeRoleDTO request) {
        userService.changeRole(sessionToken, request.username(), UserRole.valueOf(request.novo_role()));

        return Response.ok(ChangeRoleResponseDTO.success(request.username(), request.novo_role())).build();
    }

    @POST
    @Path("/change-account-state")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response changeAccountState(
            @CookieParam("session") String sessionToken,
            @Valid ChangeAccountStateDTO request) {
        userService.changeAccountState(sessionToken, request.username(), AccountStatus.valueOf(request.novo_estado()));

        return Response.ok(ChangeAccountStateResponseDTO.success(request.username(), request.novo_estado())).build();
    }

    @POST
    @Path("/remove")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response removeUserAccount(
            @CookieParam("session") String sessionToken,
            @Valid RemoveUserAccountDTO request) {
        userService.removeAccount(sessionToken, request.identificador());

        return Response.ok(RemoveUserAccountResponseDTO.success(request.identificador())).build();
    }

    @GET
    @Path("/all")
    public Response listUsers(@CookieParam("session") String sessionToken) {
        List<User> users = userService.listUsers(sessionToken);

        List<UserDTO> userDTOs = users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());

        return Response.ok(userDTOs).build();
    }

    @POST
    @Path("/change-attributes")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response changeAttributes(
            @CookieParam("session") String sessionToken,
            @Valid ChangeAttributesDTO request) {
        userService.changeAttributes(sessionToken, request.identificador(), request.atributos());

        return Response.ok(ChangeAttributesResponseDTO.success(request.identificador())).build();
    }

    @POST
    @Path("/change-password")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response changePassword(
            @CookieParam("session") String sessionToken,
            @Valid ChangePasswordDTO request) {
        if (request.isPasswordNotMatch()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ChangePasswordResponseDTO("As senhas não coincidem."))
                    .build();
        }

        userService.changePassword(sessionToken, request.senha_atual(), request.nova_senha());

        return Response.ok(ChangePasswordResponseDTO.success()).build();
    }

    @POST
    @Path("/activate")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response activateAccount(
            @CookieParam("session") String sessionToken,
            @Valid ActivateAccountDTO request) {
        userService.activateAccount(sessionToken, request.identificador());

        return Response.ok(ActivateAccountResponseDTO.success(request.identificador())).build();
    }

    @POST
    @Path("/deactivate")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response deactivateAccount(
            @CookieParam("session") String sessionToken,
            @Valid DeactivateAccountDTO request) {
        userService.deactivateAccount(sessionToken, request.identificador());

        return Response.ok(DeactivateAccountResponseDTO.success(request.identificador())).build();
    }

    @POST
    @Path("/suspend")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response suspendAccount(
            @CookieParam("session") String sessionToken,
            @Valid SuspendAccountDTO request) {
        userService.suspendAccount(sessionToken, request.identificador());

        return Response.ok(SuspendAccountResponseDTO.success(request.identificador())).build();
    }

    @POST
    @Path("/request-removal")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response requestAccountRemoval(
            @CookieParam("session") String sessionToken,
            @Valid RequestRemovalDTO request) {
        userService.requestAccountRemoval(sessionToken, request.identificador());

        return Response.ok(RequestRemovalResponseDTO.success(request.identificador())).build();
    }

    @POST
    @Path("/accounts-for-removal")
    public Response getAccountsForRemoval(@CookieParam("session") String sessionToken) {
        List<User> users = userService.getAccountsForRemoval(sessionToken);

        List<UserDTO> userDTOs = users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());

        return Response.ok(userDTOs).build();
    }

    @POST
    @Path("/account-status")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getAccountStatus(
            @CookieParam("session") String sessionToken,
            @Valid AccountStatusDTO request) {
        AccountStatus status = userService.getAccountStatus(sessionToken, request.identificador());

        return Response.ok(AccountStatusResponseDTO.success(request.identificador(), status.name())).build();
    }

    @POST
    @Path("/account-profile")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getAccountProfile(
            @CookieParam("session") String sessionToken,
            @Valid AccountProfileDTO request) {
        UserProfile profile = userService.getAccountProfile(sessionToken, request.identificador());

        return Response.ok(AccountProfileResponseDTO.success(request.identificador(), profile.name())).build();
    }

    @POST
    @Path("/change-profile")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response changeProfile(
            @CookieParam("session") String sessionToken,
            @Valid ChangeProfileDTO request) {
        userService.changeProfile(sessionToken, request.identificador(), UserProfile.valueOf(request.novo_perfil()));

        return Response.ok(ChangeProfileResponseDTO.success(request.identificador(), request.novo_perfil())).build();
    }

    @GET
    @Path("/list-accs/registered")
    public Response listAccountsRegistered(
            @CookieParam("session") String sessionToken) {
        List<User> users = userService.listRegisteredUsers(sessionToken);

        List<UserDTO> userDTOs = users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());

        return Response.ok(userDTOs).build();
    }

    @GET
    @Path("/list-accs/active")
    public Response listAccountsActive(
            @CookieParam("session") String sessionToken) {
        List<User> users = userService.listActiveUsers(sessionToken);

        List<UserDTO> userDTOs = users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());

        return Response.ok(userDTOs).build();
    }

    @GET
    @Path("/list-accs/deactivated")
    public Response listAccountsDeactivated(
            @CookieParam("session") String sessionToken) {
        List<User> users = userService.listDeactivatedUsers(sessionToken);

        List<UserDTO> userDTOs = users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());

        return Response.ok(userDTOs).build();
    }

    @GET
    @Path("/list-accs/removable")
    public Response listAccountsToRemove(
            @CookieParam("session") String sessionToken) {
        List<User> users = userService.listToRemoveUsers(sessionToken);

        List<UserDTO> userDTOs = users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());

        return Response.ok(userDTOs).build();
    }

    @GET
    @Path("/list-accs/suspended")
    public Response listAccountsSuspended(
            @CookieParam("session") String sessionToken) {
        List<User> users = userService.listSuspendedUsers(sessionToken);

        List<UserDTO> userDTOs = users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());

        return Response.ok(userDTOs).build();
    }

    @GET
    @Path("/list-accs/public")
    public Response listAccountsPublic(
            @CookieParam("session") String sessionToken) {
        List<User> users = userService.listPublicUsers(sessionToken);

        List<UserDTO> userDTOs = users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());

        return Response.ok(userDTOs).build();
    }

    @GET
    @Path("/list-accs/private")
    public Response listAccountsPrivate(
            @CookieParam("session") String sessionToken) {
        List<User> users = userService.listPrivateUsers(sessionToken);

        List<UserDTO> userDTOs = users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());

        return Response.ok(userDTOs).build();
    }

    @GET
    @Path("/list-accs/{role}")
    public Response listUsersByRole(
            @CookieParam("session") String sessionToken,
            @PathParam("role") String role) {
        List<User> users = userService.listUsersByRole(sessionToken, UserRole.valueOf(role));

        List<UserDTO> userDTOs = users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());

        return Response.ok(userDTOs).build();
    }

}
