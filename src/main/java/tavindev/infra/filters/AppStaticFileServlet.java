package tavindev.infra.filters;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;

public class AppStaticFileServlet extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String requestPath = request.getRequestURI();
		String contextPath = request.getContextPath();

		// Remove context path from request path
		if (contextPath != null && !contextPath.isEmpty()) {
			requestPath = requestPath.substring(contextPath.length());
		}

		// Map root paths to /app directory
		String appPath = "/app" + requestPath;

		System.out.println("AppStaticFileServlet requestPath: " + requestPath);

		// Get the resource from the /app directory
		URL resourceUrl = getServletContext().getResource(appPath);

		if (resourceUrl == null) {
			response.sendError(HttpServletResponse.SC_NOT_FOUND);
			return;
		}

		// Set appropriate content type based on file extension
		String contentType = getContentType(requestPath);
		response.setContentType(contentType);

		// Copy the file content to the response
		try (InputStream inputStream = resourceUrl.openStream();
				OutputStream outputStream = response.getOutputStream()) {

			byte[] buffer = new byte[4096];
			int bytesRead;
			while ((bytesRead = inputStream.read(buffer)) != -1) {
				outputStream.write(buffer, 0, bytesRead);
			}
		}
	}

	private String getContentType(String path) {
		if (path.endsWith(".css")) {
			return "text/css";
		} else if (path.endsWith(".js")) {
			return "application/javascript";
		} else if (path.endsWith(".json")) {
			return "application/json";
		} else if (path.endsWith(".ico")) {
			return "image/x-icon";
		} else if (path.endsWith(".png")) {
			return "image/png";
		} else if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
			return "image/jpeg";
		} else if (path.endsWith(".gif")) {
			return "image/gif";
		} else if (path.endsWith(".svg")) {
			return "image/svg+xml";
		} else {
			return "application/octet-stream";
		}
	}
}