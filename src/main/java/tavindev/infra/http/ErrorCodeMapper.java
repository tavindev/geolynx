package tavindev.infra.http;

import jakarta.ws.rs.core.Response.Status;
import tavindev.core.errors.Error;

public class ErrorCodeMapper {
    public static Status toHttpStatus(Error error) {
        return switch (error) {
            case NOT_FOUND -> Status.NOT_FOUND;
            case CONFLICT -> Status.CONFLICT;
            case UNAUTHORIZED -> Status.UNAUTHORIZED;
            case FORBIDDEN -> Status.FORBIDDEN;
            case BAD_REQUEST -> Status.BAD_REQUEST;
            case INTERNAL_SERVER_ERROR -> Status.INTERNAL_SERVER_ERROR;
            case SERVICE_UNAVAILABLE -> Status.SERVICE_UNAVAILABLE;
        };
    }
} 