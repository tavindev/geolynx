package tavindev.infra.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import jakarta.ws.rs.ext.ContextResolver;
import jakarta.ws.rs.ext.Provider;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Provider
public class JacksonConfig implements ContextResolver<ObjectMapper> {
	private final ObjectMapper objectMapper;

	public JacksonConfig() {
		objectMapper = new ObjectMapper();

		// Create JavaTimeModule for JSR310 support
		JavaTimeModule javaTimeModule = new JavaTimeModule();

		// Configure LocalDate serialization/deserialization
		DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
		javaTimeModule.addSerializer(LocalDate.class, new LocalDateSerializer(formatter));
		javaTimeModule.addDeserializer(LocalDate.class, new LocalDateDeserializer(formatter));

		// Register the module
		objectMapper.registerModule(javaTimeModule);
	}

	@Override
	public ObjectMapper getContext(Class<?> type) {
		return objectMapper;
	}
}