package pl.edu.pwr.modellingclub;

import org.eclipse.rdf4j.repository.Repository;
import org.eclipse.rdf4j.repository.http.HTTPRepository;
import org.eclipse.rdf4j.repository.sail.SailRepository;
import org.eclipse.rdf4j.sail.inferencer.fc.SchemaCachingRDFSInferencer;
import org.eclipse.rdf4j.sail.memory.MemoryStore;

/**
 * Factory for building RDF4J repositories used by the demo.
 * Defaults to an in-memory store with an RDFS inferencer so that
 * subclass / subproperty inference is available out of the box.
 */
public final class RepositoryFactory {

    private RepositoryFactory() {}

    /** In-memory repository with RDFS inferencing enabled. */
    public static Repository inMemoryWithRdfs() {
        Repository repo = new SailRepository(
                new SchemaCachingRDFSInferencer(new MemoryStore()));
        repo.init();
        return repo;
    }

    /** Plain in-memory repository, no inferencing. */
    public static Repository inMemory() {
        Repository repo = new SailRepository(new MemoryStore());
        repo.init();
        return repo;
    }

    /**
     * Connection to a remote RDF4J server (e.g. one running inside Apache
     * Tomcat). The repository must already exist on the server.
     */
    public static Repository remote(String serverUrl, String repositoryId) {
        Repository repo = new HTTPRepository(serverUrl, repositoryId);
        repo.init();
        return repo;
    }
}
