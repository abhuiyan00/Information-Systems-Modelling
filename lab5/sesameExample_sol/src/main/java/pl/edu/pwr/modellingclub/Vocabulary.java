package pl.edu.pwr.modellingclub;

import org.eclipse.rdf4j.model.IRI;
import org.eclipse.rdf4j.model.ValueFactory;
import org.eclipse.rdf4j.model.impl.SimpleValueFactory;

/**
 * Constants for IRIs and namespaces used by the ModellingClub ontology.
 * Mirrors prefixes declared in {@code ontology.ttl}.
 */
public final class Vocabulary {

    public static final String ONTOLOGY_NS = "http://modellingclub.local/ontology#";
    public static final String RESOURCE_NS = "http://modellingclub.local/resource/";

    public static final String PREFIX_MC  = "PREFIX mc:   <" + ONTOLOGY_NS + ">\n";
    public static final String PREFIX_MCR = "PREFIX mcr:  <" + RESOURCE_NS + ">\n";
    public static final String PREFIX_RDF  = "PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n";
    public static final String PREFIX_RDFS = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n";
    public static final String PREFIX_OWL  = "PREFIX owl:  <http://www.w3.org/2002/07/owl#>\n";
    public static final String PREFIX_XSD  = "PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>\n";

    public static final String ALL_PREFIXES =
            PREFIX_MC + PREFIX_MCR + PREFIX_RDF + PREFIX_RDFS + PREFIX_OWL + PREFIX_XSD;

    private static final ValueFactory VF = SimpleValueFactory.getInstance();

    // Classes
    public static final IRI USER         = VF.createIRI(ONTOLOGY_NS, "User");
    public static final IRI BUILD        = VF.createIRI(ONTOLOGY_NS, "Build");
    public static final IRI DRONE_BUILD  = VF.createIRI(ONTOLOGY_NS, "DroneBuild");

    // Properties
    public static final IRI USERNAME    = VF.createIRI(ONTOLOGY_NS, "username");
    public static final IRI EMAIL       = VF.createIRI(ONTOLOGY_NS, "email");
    public static final IRI REGISTERED  = VF.createIRI(ONTOLOGY_NS, "registeredAt");
    public static final IRI BUILD_TITLE = VF.createIRI(ONTOLOGY_NS, "buildTitle");
    public static final IRI CREATED_BY  = VF.createIRI(ONTOLOGY_NS, "createdBy");
    public static final IRI HAS_SCORE   = VF.createIRI(ONTOLOGY_NS, "hasScore");
    public static final IRI HAS_STATUS  = VF.createIRI(ONTOLOGY_NS, "hasStatus");
    public static final IRI APPROVED    = VF.createIRI(ONTOLOGY_NS, "ApprovedStatus");
    public static final IRI KNOWS       = VF.createIRI(ONTOLOGY_NS, "knows");

    private Vocabulary() {}
}
