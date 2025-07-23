package tavindev.core.services;

import jakarta.inject.Inject;
import jakarta.ws.rs.CookieParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.authorization.PermissionAuthorizationHandler;
import tavindev.core.entities.Corporation;
import tavindev.core.entities.Permission;
import tavindev.core.entities.User;
import tavindev.core.exceptions.CorporationNotFoundException;
import tavindev.core.exceptions.UserNotFoundException;
import tavindev.core.repositories.AuthTokenRepository;
import tavindev.core.utils.AuthUtils;
import tavindev.infra.repositories.DatastoreCorporationRepository;
import tavindev.infra.repositories.DatastoreUserRepository;

import java.util.List;

@Service
public class CorporationService {

    @Inject
    private DatastoreCorporationRepository corporationRepository;

    @Inject
    private AuthUtils authUtils;

    public Corporation getCorporationById(String tokenId, String corporationId) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        // Check if user has permission to view user details
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.VIEW_CORPORATION);

        Corporation targetCorporation = corporationRepository.findById(corporationId);
        if (targetCorporation == null) {
            throw new CorporationNotFoundException(corporationId);
        }

        return targetCorporation;
    }
    public List<Corporation> listCorporations(String tokenId) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        // Check if user has permission to view user details
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.LIST_ALL_CORPORATIONS);
        List<Corporation> allCorporations = corporationRepository.findAllColaborators();

        return allCorporations;
    }


}
