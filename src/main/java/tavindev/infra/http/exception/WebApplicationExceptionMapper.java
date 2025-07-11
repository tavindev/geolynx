package tavindev.infra.http.exception;

import com.google.gson.Gson;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class WebApplicationExceptionMapper implements ExceptionMapper<WebApplicationException> {
	private final Gson gson = new Gson();

	@Override
	public Response toResponse(WebApplicationException exception) {
		String errorMessage = exception.getMessage();
		String jsonResponse = gson.toJson(new ErrorResponse(errorMessage));

		return Response.status(exception.getResponse().getStatus())
				.entity(jsonResponse)
				.type("application/json")
				.build();
	}

	private record ErrorResponse(String error) {
	}
}