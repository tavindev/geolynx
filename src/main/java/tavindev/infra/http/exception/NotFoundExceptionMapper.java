package tavindev.infra.http.exception;

import com.google.gson.Gson;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class NotFoundExceptionMapper implements ExceptionMapper<NotFoundException> {
	private final Gson gson = new Gson();

	@Override
	public Response toResponse(NotFoundException exception) {
		String errorMessage = exception.getMessage();
		String jsonResponse = gson.toJson(new ErrorResponse(errorMessage));

		return Response.status(Response.Status.NOT_FOUND)
				.entity(jsonResponse)
				.type("application/json")
				.build();
	}

	private record ErrorResponse(String error) {
	}
}