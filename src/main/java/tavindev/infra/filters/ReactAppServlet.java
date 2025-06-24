package tavindev.infra.filters;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;

@WebServlet(urlPatterns = { "/*" })
public class ReactAppServlet extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String requestPath = request.getRequestURI();
		String contextPath = request.getContextPath();

		// Remove context path from request path
		if (contextPath != null && !contextPath.isEmpty()) {
			requestPath = requestPath.substring(contextPath.length());
		}

		// Skip API requests - they should be handled by ApiServlet
		if (requestPath.startsWith("/api/")) {
			System.out.println("API request: " + requestPath);

			response.sendError(HttpServletResponse.SC_NOT_FOUND);
			return;
		}

		// Skip static file requests - they should be handled by AppStaticFileServlet
		if (requestPath.startsWith("/static/") ||
				requestPath.equals("/manifest.json") ||
				requestPath.equals("/favicon.ico") ||
				requestPath.equals("/logo192.png")) {
			response.sendError(HttpServletResponse.SC_NOT_FOUND);
			return;
		}

		// For all other requests, serve the React app's index.html
		// This enables client-side routing
		serveReactApp(response);
	}

	private void serveReactApp(HttpServletResponse response) throws IOException {
		// Try to serve from the built React app first
		URL resourceUrl = getServletContext().getResource("/app/index.html");

		if (resourceUrl == null) {
			// Fallback to the development React app
			resourceUrl = getServletContext().getResource("/react-app/public/index.html");
		}

		if (resourceUrl == null) {
			response.sendError(HttpServletResponse.SC_NOT_FOUND, "React app not found");
			return;
		}

		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");

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
}