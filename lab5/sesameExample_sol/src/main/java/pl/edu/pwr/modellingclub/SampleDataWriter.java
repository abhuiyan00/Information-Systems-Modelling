package pl.edu.pwr.modellingclub;

import org.eclipse.rdf4j.model.IRI;
import org.eclipse.rdf4j.model.ValueFactory;
import org.eclipse.rdf4j.model.vocabulary.RDF;
import org.eclipse.rdf4j.model.vocabulary.XMLSchema;
import org.eclipse.rdf4j.repository.RepositoryConnection;

/**
 * Demonstrates adding new triples programmatically (in addition to
 * the bulk-loaded {@code sample-data.ttl}).
 */
public final class SampleDataWriter {

    private SampleDataWriter() {}

    public static void addAdditionalUser(RepositoryConnection conn) {
        ValueFactory vf = conn.getValueFactory();

        IRI eve = vf.createIRI(Vocabulary.RESOURCE_NS, "user-eve");
        conn.add(eve, RDF.TYPE, Vocabulary.USER);
        conn.add(eve, Vocabulary.USERNAME,   vf.createLiteral("eve"));
        conn.add(eve, Vocabulary.EMAIL,      vf.createLiteral("eve@modellingclub.local"));
        conn.add(eve, Vocabulary.REGISTERED, vf.createLiteral("2026-01-05T11:00:00Z", XMLSchema.DATETIME));

        IRI alice = vf.createIRI(Vocabulary.RESOURCE_NS, "user-alice");
        conn.add(eve, Vocabulary.KNOWS, alice);
    }
}
