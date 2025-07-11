package tavindev.infra.http.exception;

import com.google.gson.Gson;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.logging.Logger;
import java.util.logging.Level;

@Provider
public class RuntimeExceptionMapper implements ExceptionMapper<RuntimeException> {
	private final Gson gson = new Gson();
	private static final Logger logger = Logger.getLogger(RuntimeExceptionMapper.class.getName());

	@Override
	public Response toResponse(RuntimeException exception) {
		// Log the exception for debugging
		logger.log(Level.SEVERE, "Runtime exception occurred", exception);

		String errorMessage = exception.getMessage();
		String jsonResponse = gson.toJson(new ErrorResponse(errorMessage));

		return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
				.entity(jsonResponse)
				.type("application/json")
				.build();
	}

	private record ErrorResponse(String error) {
	}
}