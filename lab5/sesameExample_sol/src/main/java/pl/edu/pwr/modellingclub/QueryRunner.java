package pl.edu.pwr.modellingclub;

import org.eclipse.rdf4j.query.BindingSet;
import org.eclipse.rdf4j.query.QueryLanguage;
import org.eclipse.rdf4j.query.TupleQuery;
import org.eclipse.rdf4j.query.TupleQueryResult;
import org.eclipse.rdf4j.repository.RepositoryConnection;

import java.util.List;

/**
 * Reusable SPARQL helpers and the demo's preset queries.
 */
public final class QueryRunner {

    private QueryRunner() {}

    /** Execute a SPARQL SELECT and pretty-print bindings to stdout. */
    public static void runSelect(RepositoryConnection conn, String label, String sparql, List<String> vars) {
        System.out.println();
        System.out.println("----------------------------------------------");
        System.out.println("Query: " + label);
        System.out.println("----------------------------------------------");

        TupleQuery query = conn.prepareTupleQuery(QueryLanguage.SPARQL, sparql);
        int row = 0;
        try (TupleQueryResult result = query.evaluate()) {
            while (result.hasNext()) {
                BindingSet bs = result.next();
                StringBuilder sb = new StringBuilder().append(String.format("%3d | ", ++row));
                for (String v : vars) {
                    sb.append(v).append('=').append(bs.getValue(v)).append("  ");
                }
                System.out.println(sb);
            }
        }
        if (row == 0) {
            System.out.println("(no results)");
        }
    }

    // ─────────────────────────────────────────────
    //  Demo queries
    // ─────────────────────────────────────────────

    public static void listAllBuildsWithCreators(RepositoryConnection conn) {
        String sparql = Vocabulary.ALL_PREFIXES +
                "SELECT DISTINCT ?title ?username WHERE {\n" +
                "  ?build a mc:Build ;\n" +
                "         mc:buildTitle ?title ;\n" +
                "         mc:createdBy  ?creator .\n" +
                "  ?creator mc:username ?username .\n" +
                "} ORDER BY ?title";
        runSelect(conn, "All builds and their creators (RDFS subclass inference)",
                sparql, List.of("title", "username"));
    }

    public static void listApprovedBuildsSortedByScore(RepositoryConnection conn) {
        String sparql = Vocabulary.ALL_PREFIXES +
                "SELECT ?title ?score WHERE {\n" +
                "  ?b mc:hasStatus mcr:status-approved ;\n" +
                "     mc:buildTitle ?title ;\n" +
                "     mc:hasScore   ?score .\n" +
                "} ORDER BY DESC(?score)";
        runSelect(conn, "Approved builds ranked by score",
                sparql, List.of("title", "score"));
    }

    public static void listDroneTelemetry(RepositoryConnection conn) {
        String sparql = Vocabulary.ALL_PREFIXES +
                "SELECT ?title ?topSpeed ?maxRange ?crashes WHERE {\n" +
                "  ?b a mc:DroneBuild ;\n" +
                "     mc:buildTitle  ?title ;\n" +
                "     mc:hasTelemetry ?t .\n" +
                "  ?t mc:topSpeed   ?topSpeed ;\n" +
                "     mc:maxRange   ?maxRange ;\n" +
                "     mc:crashCount ?crashes .\n" +
                "}";
        runSelect(conn, "Drone telemetry",
                sparql, List.of("title", "topSpeed", "maxRange", "crashes"));
    }

    public static void countVotesPerBuild(RepositoryConnection conn) {
        String sparql = Vocabulary.ALL_PREFIXES +
                "SELECT ?title (COUNT(?up) AS ?upVotes) (COUNT(?down) AS ?downVotes) WHERE {\n" +
                "  ?b mc:buildTitle ?title .\n" +
                "  OPTIONAL { ?b mc:hasVote ?up   . ?up   a mc:UpVote   . }\n" +
                "  OPTIONAL { ?b mc:hasVote ?down . ?down a mc:DownVote . }\n" +
                "} GROUP BY ?title ORDER BY ?title";
        runSelect(conn, "Vote counts per build",
                sparql, List.of("title", "upVotes", "downVotes"));
    }

    public static void listInferredKnowsLinks(RepositoryConnection conn) {
        // mc:knows is owl:SymmetricProperty in the ontology. The RDFS
        // inferencer does NOT materialise OWL symmetry, so we surface
        // it explicitly here with a UNION pattern.
        String sparql = Vocabulary.ALL_PREFIXES +
                "SELECT DISTINCT ?a ?b WHERE {\n" +
                "  { ?a mc:knows ?b } UNION { ?b mc:knows ?a }\n" +
                "} ORDER BY ?a ?b";
        runSelect(conn, "knows links (symmetric closure via UNION)",
                sparql, List.of("a", "b"));
    }

    public static void listTransitiveCommunityMembership(RepositoryConnection conn) {
        // mc:isSubCommunityOf is owl:TransitiveProperty; computed via SPARQL+.
        String sparql = Vocabulary.ALL_PREFIXES +
                "SELECT ?user ?community WHERE {\n" +
                "  ?user mc:isMemberOf/mc:isSubCommunityOf* ?community .\n" +
                "} ORDER BY ?user ?community";
        runSelect(conn, "User community membership (transitive isSubCommunityOf)",
                sparql, List.of("user", "community"));
    }

    public static void listMarketplaceListings(RepositoryConnection conn) {
        String sparql = Vocabulary.ALL_PREFIXES +
                "SELECT ?part ?price ?seller WHERE {\n" +
                "  ?l mc:partName    ?part ;\n" +
                "     mc:askingPrice ?price ;\n" +
                "     mc:listedBy    ?u .\n" +
                "  ?u mc:username    ?seller .\n" +
                "} ORDER BY ?price";
        runSelect(conn, "Marketplace listings (ascending price)",
                sparql, List.of("part", "price", "seller"));
    }

    public static void listTestRunAttendees(RepositoryConnection conn) {
        String sparql = Vocabulary.ALL_PREFIXES +
                "SELECT ?location ?date ?attendee WHERE {\n" +
                "  ?tr a mc:TestRun ;\n" +
                "      mc:testRunLocation ?location ;\n" +
                "      mc:testRunDate     ?date ;\n" +
                "      mc:attendedBy      ?u .\n" +
                "  ?u mc:username ?attendee .\n" +
                "} ORDER BY ?date ?attendee";
        runSelect(conn, "Test run attendees",
                sparql, List.of("location", "date", "attendee"));
    }
}
