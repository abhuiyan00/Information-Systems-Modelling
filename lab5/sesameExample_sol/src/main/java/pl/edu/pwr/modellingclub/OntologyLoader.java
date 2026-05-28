package pl.edu.pwr.modellingclub;

import org.eclipse.rdf4j.repository.RepositoryConnection;
import org.eclipse.rdf4j.rio.RDFFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;

/**
 * Loads Turtle resources from the classpath into an RDF4J repository.
 */
public final class OntologyLoader {

    private static final Logger LOG = LoggerFactory.getLogger(OntologyLoader.class);

    private OntologyLoader() {}

    public static void loadTurtleFromClasspath(RepositoryConnection conn,
                                               String classpathResource,
                                               String baseUri) throws IOException {
        try (InputStream in = Objects.requireNonNull(
                OntologyLoader.class.getClassLoader().getResourceAsStream(classpathResource),
                "Classpath resource not found: " + classpathResource)) {
            conn.add(in, baseUri, RDFFormat.TURTLE);
            LOG.info("Loaded {} into repository.", classpathResource);
        }
    }
}
