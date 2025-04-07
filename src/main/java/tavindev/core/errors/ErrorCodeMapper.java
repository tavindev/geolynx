package tavindev.core.errors;

import jakarta.ws.rs.core.Response.Status;

public class ErrorCodeMapper {
    
    private ErrorCodeMapper() {
        // Private constructor to prevent instantiation
    }

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