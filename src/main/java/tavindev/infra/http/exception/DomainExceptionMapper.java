package tavindev.infra.http.exception;

import com.google.gson.Gson;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import tavindev.core.errors.Error;
import tavindev.core.errors.ErrorCodeMapper;
import tavindev.core.exceptions.DomainException;

@Provider
public class DomainExceptionMapper implements ExceptionMapper<DomainException> {
    private final Gson gson = new Gson();

    @Override
    public Response toResponse(DomainException exception) {
        Error error = exception.getErrorCode();
        Response.Status status = ErrorCodeMapper.toHttpStatus(error);
        String errorMessage = exception.getMessage();
        String jsonResponse = gson.toJson(new ErrorResponse(errorMessage));

        return Response.status(status)
                .entity(jsonResponse)
                .type("application/json")
                .build();
    }

    private record ErrorResponse(String error) {}
}