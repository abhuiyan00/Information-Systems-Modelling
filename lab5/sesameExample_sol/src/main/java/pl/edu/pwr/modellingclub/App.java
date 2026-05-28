package pl.edu.pwr.modellingclub;

import org.eclipse.rdf4j.repository.Repository;
import org.eclipse.rdf4j.repository.RepositoryConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Entry point for the ModellingClub ontology demo.
 *
 * Steps performed:
 *   1. Build an in-memory RDF4J repository with an RDFS inferencer.
 *   2. Load the ontology (TBox) and sample instance data (ABox).
 *   3. Add a few extra triples programmatically.
 *   4. Run a small suite of SPARQL SELECT queries against the store.
 */
public final class App {

    private static final Logger LOG = LoggerFactory.getLogger(App.class);

    private static final String ONTOLOGY_RESOURCE    = "ontology.ttl";
    private static final String SAMPLE_DATA_RESOURCE = "sample-data.ttl";

    public static void main(String[] args) {
        Repository repo = RepositoryFactory.inMemoryWithRdfs();
        try (RepositoryConnection conn = repo.getConnection()) {

            OntologyLoader.loadTurtleFromClasspath(conn, ONTOLOGY_RESOURCE,    Vocabulary.ONTOLOGY_NS);
            OntologyLoader.loadTurtleFromClasspath(conn, SAMPLE_DATA_RESOURCE, Vocabulary.RESOURCE_NS);

            SampleDataWriter.addAdditionalUser(conn);

            LOG.info("Repository size after load: {} statements", conn.size());

            QueryRunner.listAllBuildsWithCreators(conn);
            QueryRunner.listApprovedBuildsSortedByScore(conn);
            QueryRunner.listDroneTelemetry(conn);
            QueryRunner.countVotesPerBuild(conn);
            QueryRunner.listInferredKnowsLinks(conn);
            QueryRunner.listTransitiveCommunityMembership(conn);
            QueryRunner.listMarketplaceListings(conn);
            QueryRunner.listTestRunAttendees(conn);

        } catch (Exception e) {
            LOG.error("Demo failed", e);
        } finally {
            repo.shutDown();
        }
    }
}
