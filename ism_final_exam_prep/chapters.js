/* =========================================================================
 * chapters.js — ISM (Information Systems Modeling) question bank
 *
 * Single global `quizData`. Multiple-answer questions: each has 4+ options
 * (lectures use exactly 4; the "Test" section may use 5–7); `correct` is an
 * ARRAY of 0-based indices, length 1..3.
 * `id` is globally sequential across ALL sets (not per-set).
 * Derived from "ISM-TK-all-lectures-combined.md" (Tomasz Kubik lectures);
 * section 15 ("Test", group Testownik) integrates the 220 Testownik questions
 * from the ism-ultimate knowledge base (ISM-SNAPSHOT.md), kept verbatim.
 *
 * EXAM REALISM:
 *   - Correct-answer counts are mixed ~1/3 each of 1, 2 and 3 correct options.
 *   - Correct options are scattered across positions A..D (no fixed pattern).
 *   - 25 questions per lecture (14 lectures, 350) + 220 Test = 570 total.
 *
 * Sets are grouped by theme header (`group`); one set per lecture, plus "Test".
 * ========================================================================= */
const quizData = {
  sets: [
    /* ============================ LECTURE 01 ============================ */
    {
      id: "lec01",
      group: "Foundations & Modeling",
      title: "01 · Overview & Requirements Engineering",
      questions: [
        {
          id: 1,
          question: "Which of these are among the five 'core factors' of information-system design?",
          options: [
            "Funding",
            "People",
            "Tools",
            "Process"
          ],
          correct: [1, 2, 3],
          reasoning: "The five core factors are People, Project, Product, Process and Tools. Funding/budget is an economic concern weighed in a feasibility study, but it is not one of the five core factors."
        },
        {
          id: 2,
          question: "What is the primary purpose of a feasibility study?",
          options: [
            "To decide whether or not the system should be implemented at all",
            "To produce the final source code of the system",
            "To write the complete user manual",
            "To design the relational database schema"
          ],
          correct: [0],
          reasoning: "A feasibility study comes very early and answers a single yes/no question: should we build this system? It weighs technical, economic, legal and scheduling constraints — it produces no code, manual or schema."
        },
        {
          id: 3,
          question: "According to the IEEE definition, a 'requirement' can take which of these forms?",
          options: [
            "A condition or capability needed by a user to solve a problem or reach an objective",
            "A guaranteed defect-free implementation of the system",
            "A documented representation of a needed condition or capability",
            "The compiled binary delivered to the customer"
          ],
          correct: [0, 2],
          reasoning: "IEEE defines a requirement as (1) a user-needed condition/capability, (2) a condition/capability needed to satisfy a contract or standard, or (3) a documented representation of such. A defect-free guarantee and a compiled binary are not part of the definition."
        },
        {
          id: 4,
          question: "Which are listed as desirable characteristics of a requirements definition?",
          options: [
            "Redundancy",
            "Consistency",
            "Verifiability",
            "Completeness"
          ],
          correct: [1, 2, 3],
          reasoning: "Good requirements are consistent, complete, accurate, verifiable and unambiguous. Redundancy (the same requirement stated in several places) is undesirable because it creates maintenance and contradiction risks."
        },
        {
          id: 5,
          question: "Which statements about functional vs non-functional requirements are correct?",
          options: [
            "Functional requirements describe planned services and reactions to particular inputs",
            "Non-functional requirements include constraints such as timing and standards",
            "Non-functional requirements describe the system's reaction to specific user inputs",
            "Functional requirements only concern the choice of programming language"
          ],
          correct: [0, 1],
          reasoning: "Functional = what the system does (services, reactions to inputs). Non-functional = constraints/qualities (timing, standards, reliability). Reacting to specific inputs is functional, and functional requirements have nothing to do with language choice."
        },
        {
          id: 6,
          question: "Which single statement about user requirements is correct?",
          options: [
            "They are forbidden from ever being represented by models",
            "They are produced only after the code is finished",
            "They are identical in detail to system requirements",
            "They are expressed in natural language readable by non-technical users"
          ],
          correct: [3],
          reasoning: "User requirements are plain-language statements (often from client interviews) understandable without a technical background. System requirements are the detailed counterpart and may use models; user requirements are neither code-derived nor as detailed as system requirements."
        },
        {
          id: 7,
          question: "Which are phases of the Unified (Software Development) Process?",
          options: [
            "Inception",
            "Maintenance",
            "Elaboration",
            "Transition"
          ],
          correct: [0, 2, 3],
          reasoning: "The four UP/RUP phases are Inception, Elaboration, Construction and Transition. 'Maintenance' is a lifecycle activity but not one of the four named UP phases."
        },
        {
          id: 8,
          question: "Which statements about the Scrum process are correct?",
          options: [
            "The Product Owner creates and prioritizes the Product Backlog",
            "A Sprint typically lasts 1–4 weeks",
            "The Product Backlog is created during the Sprint Retrospective",
            "A Sprint's end date may be freely moved once the Sprint has started"
          ],
          correct: [0, 1],
          reasoning: "The Product Owner owns and prioritizes the Product Backlog (which exists before sprinting begins), and sprints are time-boxed to 1–4 weeks with a FIXED end date and deliverable. The backlog is not created in the retrospective, and sprint length is not changed mid-sprint."
        },
        {
          id: 9,
          question: "Which of the following are RM-ODP viewpoints?",
          options: [
            "Deployment viewpoint",
            "Information viewpoint",
            "Computational viewpoint",
            "Engineering viewpoint"
          ],
          correct: [1, 2, 3],
          reasoning: "RM-ODP defines exactly five viewpoints: enterprise, information, computational, engineering and technology. 'Deployment' is a UML diagram type, not an RM-ODP viewpoint."
        },
        {
          id: 10,
          question: "How many viewpoints does the RM-ODP reference model define?",
          options: [
            "Three",
            "Four",
            "Five",
            "Seven"
          ],
          correct: [2],
          reasoning: "RM-ODP (Reference Model of Open Distributed Processing) defines five viewpoints — enterprise, information, computational, engineering and technology — each describing the system from a different concern."
        },
        {
          id: 11,
          question: "Which statements about Model-Driven Architecture (MDA) are correct?",
          options: [
            "Models are the primary source for documenting, analyzing, designing and building a system",
            "It separates a system's operation from how it uses its platform's capabilities",
            "It forbids the use of any UML models",
            "Platform independence and model transformation are among its basic concepts"
          ],
          correct: [0, 1, 3],
          reasoning: "MDA treats models as the primary artifact, separates business operation from platform specifics, and is built on platform independence plus model transformation. UML is one of its standard modeling languages, so it is certainly not forbidden."
        },
        {
          id: 12,
          question: "Which statements correctly match a SOLID principle to its meaning?",
          options: [
            "Single-responsibility: a class should have only one reason to change",
            "Open-closed: open for extension, closed for modification",
            "Liskov substitution: a class may freely take on many unrelated responsibilities",
            "Dependency inversion: high-level modules should depend on concrete classes, not abstractions"
          ],
          correct: [0, 1],
          reasoning: "SRP and OCP are stated correctly. Liskov substitution is about subtypes being substitutable for their base type, and dependency inversion says to depend on ABSTRACTIONS, not concretions — both distractors invert the real meaning."
        },
        {
          id: 13,
          question: "Which of these is a real ISO/IEC/IEEE 29148 requirements document?",
          options: [
            "Service Registry Specification",
            "Source Repository Specification",
            "Software Requirements Specification (SRS)",
            "System Runtime Specification"
          ],
          correct: [2],
          reasoning: "ISO/IEC/IEEE 29148 defines the SyRS (System Requirements Spec), StRS (Stakeholder Requirements Spec) and SRS (Software Requirements Spec). The other three names are invented."
        },
        {
          id: 14,
          question: "Which of these are listed as modeling paradigms / languages?",
          options: [
            "UML",
            "Assembly language",
            "Entity-relationship diagrams",
            "Ontology"
          ],
          correct: [0, 2, 3],
          reasoning: "The modeling languages listed include UML, entity-relationship diagrams, XML Schema and Ontology. Assembly is a low-level programming language, not a modeling paradigm."
        },
        {
          id: 15,
          question: "Which abstractions are mentioned under object orientation?",
          options: [
            "Classification",
            "Generalization",
            "Compilation",
            "Association and aggregation"
          ],
          correct: [0, 1, 3],
          reasoning: "Object orientation's abstraction mechanisms are classification, generalization, and association/aggregation. Compilation is a build-time activity, not an OO abstraction."
        },
        {
          id: 16,
          question: "Which of these are recognised categories of requirements (Sommerville)?",
          options: [
            "Financial requirements",
            "Functional requirements",
            "Domain requirements",
            "Non-functional requirements"
          ],
          correct: [1, 2, 3],
          reasoning: "Requirements are commonly split into functional, non-functional and domain requirements. 'Financial requirements' is not a standard category — cost is handled in feasibility/economic analysis."
        },
        {
          id: 17,
          question: "Which single statement best describes a domain requirement?",
          options: [
            "It comes from the application domain and may be functional or non-functional",
            "It is always non-functional by definition",
            "It is the system's compiled source code",
            "It is purely a marketing slogan"
          ],
          correct: [0],
          reasoning: "Domain requirements derive from the field of application (e.g. banking, aviation) and may be either functional or non-functional. They are neither inherently non-functional, nor code, nor marketing."
        },
        {
          id: 18,
          question: "Which of these are activities of the requirements-engineering process?",
          options: [
            "Code compilation",
            "Requirements elicitation",
            "Requirements validation",
            "Penetration testing"
          ],
          correct: [1, 2],
          reasoning: "Requirements engineering covers elicitation, analysis, specification and validation. Compilation and penetration testing belong to later construction/verification phases, not requirements engineering."
        },
        {
          id: 19,
          question: "Which of the following can be stakeholders of a system?",
          options: [
            "End users",
            "The Java compiler",
            "Customers / clients",
            "Developers"
          ],
          correct: [0, 2, 3],
          reasoning: "Stakeholders are people or organisations with an interest in the system — end users, customers and developers all qualify. A compiler is a tool, not a stakeholder."
        },
        {
          id: 20,
          question: "Which of these is a non-functional requirement?",
          options: [
            "The system shall allow a user to log in",
            "The system shall respond to a search within 2 seconds",
            "The system shall let a user transfer funds",
            "The system shall let a user search for products"
          ],
          correct: [1],
          reasoning: "A 2-second response time is a performance constraint — a non-functional (quality) requirement. Logging in, transferring funds and searching are services the system provides, i.e. functional requirements."
        },
        {
          id: 21,
          question: "Which of these are desirable qualities of an individual requirement?",
          options: [
            "Unambiguous",
            "Contradictory",
            "Ambiguous",
            "Verifiable"
          ],
          correct: [0, 3],
          reasoning: "A good requirement is unambiguous and verifiable (you can test whether it is met). Ambiguity and contradiction are exactly the defects requirements engineering tries to remove."
        },
        {
          id: 22,
          question: "Which statements about the Unified Process are correct?",
          options: [
            "It is a strict single-pass waterfall with no iterations",
            "It is iterative and incremental",
            "It is architecture-centric",
            "It is use-case driven"
          ],
          correct: [1, 2, 3],
          reasoning: "The Unified Process is iterative-and-incremental, architecture-centric and use-case driven. Those three traits are precisely what distinguishes it from a single-pass waterfall."
        },
        {
          id: 23,
          question: "Which single item is a Scrum artifact?",
          options: [
            "Product Backlog",
            "Gantt chart",
            "UML deployment diagram",
            "Entity-relationship diagram"
          ],
          correct: [0],
          reasoning: "Scrum's three artifacts are the Product Backlog, the Sprint Backlog and the Increment. Gantt charts, deployment diagrams and ER diagrams come from other methodologies/notations."
        },
        {
          id: 24,
          question: "Beyond hardware, software and networks, an information system also includes which of these?",
          options: [
            "Cooling fans",
            "People",
            "Processes",
            "The marketing budget"
          ],
          correct: [1, 2],
          reasoning: "An information system is broader than its IT subset (hardware/software/networks): it also includes people, processes and data. Cooling fans are hardware detail and a marketing budget is not part of the system."
        },
        {
          id: 25,
          question: "Which of these are MDA model types?",
          options: [
            "Platform-Random Model (PRM)",
            "Computation-Independent Model (CIM)",
            "Platform-Independent Model (PIM)",
            "Platform-Specific Model (PSM)"
          ],
          correct: [1, 2, 3],
          reasoning: "MDA's model hierarchy is CIM → PIM → PSM, refining from a business/computation-independent view down to a platform-specific one. 'Platform-Random Model' is invented."
        }
      ]
    },
    /* ============================ LECTURE 02 ============================ */
    {
      id: "lec02",
      group: "Foundations & Modeling",
      title: "02 · OMG/ISO, SysML & UML Diagrams",
      questions: [
        {
          id: 26,
          question: "Which of these OMG specifications were adopted by ISO?",
          options: [
            "MOF (Meta Object Facility)",
            "JUnit",
            "XMI (XML Metadata Interchange)",
            "BPMN"
          ],
          correct: [0, 2, 3],
          reasoning: "BPMN, MOF, XMI (plus UML, SysML, OCL, CORBA, KDM) are OMG specifications adopted by ISO. JUnit is a Java unit-testing library, not an OMG/ISO standard."
        },
        {
          id: 27,
          question: "Which statements about the UML/SysML relationship are correct?",
          options: [
            "SysML reuses a subset of UML (the UML4SysML overlap)",
            "SysML adds extensions of its own on top of UML",
            "SysML completely replaces and discards UML",
            "SysML and UML have nothing in common"
          ],
          correct: [0, 1],
          reasoning: "SysML is a UML profile: it reuses part of UML (the UML4SysML overlap) and adds systems-engineering extensions. It neither replaces UML wholesale nor is unrelated to it."
        },
        {
          id: 28,
          question: "Which of these are SysML/UML Behavior diagrams?",
          options: [
            "Block Definition Diagram",
            "Activity Diagram",
            "Sequence Diagram",
            "State Machine Diagram"
          ],
          correct: [1, 2, 3],
          reasoning: "Behavior diagrams include Activity, Sequence, State Machine and Use Case diagrams. The Block Definition Diagram is a Structure diagram."
        },
        {
          id: 29,
          question: "Which diagrams are NEW in SysML (not present in UML)?",
          options: [
            "Requirement Diagram",
            "Class Diagram",
            "Sequence Diagram",
            "Parametric Diagram"
          ],
          correct: [0, 3],
          reasoning: "SysML introduces two brand-new diagram types: the Requirement Diagram and the Parametric Diagram. Class and Sequence diagrams are inherited (reused/modified) from UML."
        },
        {
          id: 30,
          question: "What are the four pillars of SysML?",
          options: [
            "Structure",
            "Behavior",
            "Deployment",
            "Requirements"
          ],
          correct: [0, 1, 3],
          reasoning: "SysML's four pillars are Structure, Behavior, Requirements and Parametrics. Deployment is a UML diagram, not a SysML pillar."
        },
        {
          id: 31,
          question: "Which of these are valid SysML requirement-relationship stereotypes?",
          options: [
            "«compile»",
            "«deriveReqt»",
            "«satisfy»",
            "«verify»"
          ],
          correct: [1, 2, 3],
          reasoning: "SysML requirement relationships include containment, trace, copy, deriveReqt, refine, satisfy and verify. «compile» is invented."
        },
        {
          id: 32,
          question: "In SysML, a «verify» relationship links a requirement to which kind of model element?",
          options: [
            "A test case",
            "A block",
            "An actor",
            "A package"
          ],
          correct: [0],
          reasoning: "A «verify» relationship connects a requirement to the Test Case that demonstrates the requirement is met — answering 'what proves this requirement?'. Satisfy, by contrast, links a requirement to the design element (block) that fulfils it."
        },
        {
          id: 33,
          question: "In SysML, a «satisfy» relationship asserts that which element fulfils a requirement?",
          options: [
            "A test case",
            "A use-case actor",
            "A design element such as a block",
            "A diagram frame"
          ],
          correct: [2],
          reasoning: "«satisfy» states that a design/structure element (typically a block) meets a requirement. The element that PROVES it (the test case) is attached with «verify» instead."
        },
        {
          id: 34,
          question: "Which statements about UML class diagrams are correct?",
          options: [
            "They depict a static (structural) view of the model",
            "Each class is a rectangle with name, attributes and operations compartments",
            "Classes may carry stereotypes and constraints",
            "They primarily show the time-ordering of messages between objects"
          ],
          correct: [0, 1, 2],
          reasoning: "Class diagrams give a static view, draw each class as a three-compartment rectangle, and support stereotypes/constraints. The time-ordering of messages is shown by sequence (interaction) diagrams."
        },
        {
          id: 35,
          question: "Which UML relationship-notation mappings are correct?",
          options: [
            "Solid line + hollow triangle arrowhead = generalization (inheritance)",
            "Dashed line + hollow triangle = realization (implements an interface)",
            "Solid line + filled diamond = aggregation",
            "Dashed line + open arrowhead = dependency"
          ],
          correct: [0, 1, 3],
          reasoning: "Hollow-triangle solid = generalization; hollow-triangle dashed = realization; dashed open arrow = dependency. A FILLED diamond is composition; aggregation uses a HOLLOW diamond."
        },
        {
          id: 36,
          question: "Which statements about aggregation vs composition are correct?",
          options: [
            "Aggregation is drawn with a hollow diamond",
            "In aggregation, destroying the container always destroys the contained objects",
            "Composition is drawn with a filled diamond",
            "In composition, destroying the whole destroys its parts"
          ],
          correct: [0, 2, 3],
          reasoning: "Aggregation = hollow diamond (weak 'has-a', parts outlive the whole); composition = filled diamond with a strong lifecycle bond, so destroying the whole destroys the parts. Aggregated parts survive their container."
        },
        {
          id: 37,
          question: "Which single statement about composition is correct?",
          options: [
            "The parts always outlive the whole",
            "The lifetime of the parts is bound to the lifetime of the whole",
            "It is drawn with a hollow diamond",
            "It is identical to a plain dependency"
          ],
          correct: [1],
          reasoning: "Composition is a strong whole-part relationship: the parts cannot exist without the whole, so destroying the whole destroys the parts. It uses a FILLED diamond, unlike aggregation."
        },
        {
          id: 38,
          question: "Which UML access-modifier symbol→meaning pairs are correct?",
          options: [
            "+ means public",
            "~ means public",
            "- means private",
            "# means protected"
          ],
          correct: [0, 2, 3],
          reasoning: "+ public, - private, # protected, ~ package. The tilde '~' denotes package (default) visibility, not public."
        },
        {
          id: 39,
          question: "Which UML visibility symbol denotes package (default) access?",
          options: [
            "+",
            "~",
            "-",
            "#"
          ],
          correct: [1],
          reasoning: "The tilde '~' marks package-level visibility. '+' is public, '-' is private and '#' is protected."
        },
        {
          id: 40,
          question: "A many-to-many association that needs its own attributes is best modelled how?",
          options: [
            "By forbidding multiplicity '*' on both ends",
            "By deleting one of the two associated classes",
            "With an association class holding the link plus its own attributes",
            "By giving the association its own operations/attributes via that class"
          ],
          correct: [2, 3],
          reasoning: "When a link itself carries data (e.g. enrolment date on Student–Course), you model it with an association class that owns those attributes/operations. A many-to-many is exactly '*' on both ends, and you certainly don't delete a class."
        },
        {
          id: 41,
          question: "Which combined fragments can appear in a UML sequence diagram?",
          options: [
            "fork",
            "loop",
            "alt",
            "opt"
          ],
          correct: [1, 2, 3],
          reasoning: "Sequence-diagram combined fragments include loop, alt, opt, par, break, etc. 'fork' is an activity-diagram concurrency node, not a sequence fragment."
        },
        {
          id: 42,
          question: "Which elements belong to a UML activity diagram?",
          options: [
            "A decision node with a guard",
            "A lifeline with activation bars",
            "A fork bar splitting into concurrent flows",
            "A join bar merging concurrent flows"
          ],
          correct: [0, 2, 3],
          reasoning: "Activity diagrams use decision/guard nodes and fork/join bars for concurrency. Lifelines and activation bars belong to sequence diagrams."
        },
        {
          id: 43,
          question: "Which are the two top-level categories of UML diagrams?",
          options: [
            "Structure diagrams",
            "Behavior diagrams",
            "Deployment diagrams",
            "Network diagrams"
          ],
          correct: [0, 1],
          reasoning: "UML diagrams split at the top level into Structure and Behavior diagrams. Deployment is a specific Structure diagram, and 'Network diagram' is not a UML category."
        },
        {
          id: 44,
          question: "Which elements typically appear on a UML use-case diagram?",
          options: [
            "Actors",
            "Use cases (ellipses)",
            "«include» / «extend» relationships",
            "Filled-diamond compositions between classes"
          ],
          correct: [0, 1, 2],
          reasoning: "Use-case diagrams show actors, use cases (ellipses) and «include»/«extend» relationships. Composition (filled diamond) belongs to class diagrams."
        },
        {
          id: 45,
          question: "Which statements about UML state machine diagrams are correct?",
          options: [
            "They model states and the transitions between them",
            "They are primarily used to model the static class structure",
            "They cannot represent an initial or final state",
            "Transitions are typically triggered by events"
          ],
          correct: [0, 3],
          reasoning: "A state machine models an object's states and event-triggered transitions, including initial/final pseudostates. The STATIC class structure is the job of a class diagram, not a state machine."
        },
        {
          id: 46,
          question: "Which UML multiplicity notations are interpreted correctly?",
          options: [
            "1..* = at most one",
            "1 = exactly one",
            "0..1 = optional (zero or one)",
            "* = zero or more"
          ],
          correct: [1, 2, 3],
          reasoning: "1 is exactly one, 0..1 is optional, * is zero-or-more, and 1..* means one OR MORE (at least one) — not 'at most one'."
        },
        {
          id: 47,
          question: "Which organisation maintains the UML and SysML specifications?",
          options: [
            "OMG (Object Management Group)",
            "Oracle",
            "The Apache Foundation",
            "W3C"
          ],
          correct: [0],
          reasoning: "UML, SysML, MOF, OCL and XMI are all maintained by the OMG. Oracle stewards Java, Apache hosts open-source projects, and the W3C governs web standards like XML/RDF."
        },
        {
          id: 48,
          question: "Which single statement about a SysML 'block' is correct?",
          options: [
            "It can only represent software objects",
            "It is the basic structural building block, generalising the UML class for systems engineering",
            "It is a kind of behavior diagram",
            "It replaces the requirement relationship"
          ],
          correct: [1],
          reasoning: "A SysML block is the fundamental structural unit; it generalises the UML class so it can represent hardware, software, data, people or facilities — not just software."
        },
        {
          id: 49,
          question: "What is the SysML parametric diagram primarily used for?",
          options: [
            "Showing the time-ordering of messages",
            "Listing the project's source files",
            "Expressing constraints/equations (via constraint blocks) for engineering analysis",
            "Drawing the network topology"
          ],
          correct: [2],
          reasoning: "Parametric diagrams bind properties to constraint blocks (equations) so the model can support engineering analysis such as performance, reliability or physics calculations. Message ordering is for sequence diagrams."
        },
        {
          id: 50,
          question: "Which of these are Structure diagrams?",
          options: [
            "Block Definition Diagram",
            "Internal Block Diagram",
            "Activity Diagram",
            "Package Diagram"
          ],
          correct: [0, 1, 3],
          reasoning: "Block Definition, Internal Block and Package diagrams describe structure. The Activity diagram describes behavior."
        }
      ]
    },
    /* ============================ LECTURE 03 ============================ */
    {
      id: "lec03",
      group: "Design Patterns",
      title: "03 · Design Patterns, REST & HTTP",
      questions: [
        {
          id: 51,
          question: "Which are the three GoF purpose categories of design patterns?",
          options: [
            "Architectural",
            "Creational",
            "Structural",
            "Behavioral"
          ],
          correct: [1, 2, 3],
          reasoning: "GoF classifies patterns by purpose into Creational, Structural and Behavioral. 'Architectural' patterns exist in other catalogs but are not a GoF purpose category."
        },
        {
          id: 52,
          question: "What does the HTTP status code 204 mean?",
          options: [
            "Moved Permanently",
            "Created",
            "No Content",
            "Not Found"
          ],
          correct: [2],
          reasoning: "204 No Content means the request succeeded but there is no body to return — common after a successful PUT/DELETE. 201 is Created, 301 is Moved Permanently and 404 is Not Found."
        },
        {
          id: 53,
          question: "Which statements about REST are correct?",
          options: [
            "RESTful services should be stateless",
            "REST mandates a binary-only message format",
            "REST requires every request to carry a SOAP envelope",
            "REST defines a uniform interface as a constraint"
          ],
          correct: [0, 3],
          reasoning: "REST is stateless and built around a uniform interface. It is media-type agnostic (JSON, XML, HTML, plain text) — not binary-only — and is an alternative to SOAP, not a user of SOAP envelopes."
        },
        {
          id: 54,
          question: "Which HTTP status-code class denotes a server error?",
          options: [
            "2xx",
            "3xx",
            "4xx",
            "5xx"
          ],
          correct: [3],
          reasoning: "5xx is Server Error. 2xx is Successful, 3xx is Redirection and 4xx is Client Error."
        },
        {
          id: 55,
          question: "Which statements about the Singleton pattern are correct?",
          options: [
            "It guarantees exactly one instance within the system",
            "Its constructor is private and access is via a static getInstance()",
            "getInstance() returns the same instance every time",
            "It creates a brand-new instance on every getInstance() call"
          ],
          correct: [0, 1, 2],
          reasoning: "Singleton ensures a single instance using a private constructor plus a static accessor that always returns that one instance. Returning a new instance each call would defeat the pattern."
        },
        {
          id: 56,
          question: "Which statements distinguish Abstract Factory from Factory Method?",
          options: [
            "Abstract Factory delegates instantiation via composition",
            "Factory Method relies on inheritance (a subclass creates the object)",
            "Both are implemented purely through inheritance",
            "Abstract Factory guarantees a single global instance"
          ],
          correct: [0, 1],
          reasoning: "Abstract Factory composes/delegates to a factory object; Factory Method uses subclass inheritance to decide the concrete product. They are not both inheritance-based, and neither is about single instances (that is Singleton)."
        },
        {
          id: 57,
          question: "Which single statement best describes the Facade pattern?",
          options: [
            "It guarantees a single instance of a class",
            "It creates objects by cloning prototypes",
            "It wraps a complicated subsystem behind a simpler, higher-level interface",
            "It lets two incompatible interfaces work together"
          ],
          correct: [2],
          reasoning: "Facade exposes a simple, unified interface over a complex subsystem (e.g. ComputerFacade.start() hiding CPU/HD/Memory calls). Single-instance is Singleton, cloning is Prototype, and reconciling incompatible interfaces is Adapter."
        },
        {
          id: 58,
          question: "Which HTTP methods were ADDED in HTTP/1.1 (not present in HTTP/1.0)?",
          options: [
            "PUT",
            "GET",
            "HEAD",
            "DELETE"
          ],
          correct: [0, 3],
          reasoning: "HTTP/1.0 already had GET, HEAD and POST. HTTP/1.1 added PUT, DELETE, OPTIONS, TRACE, CONNECT (and later PATCH)."
        },
        {
          id: 59,
          question: "In an OpenAPI/Swagger document, where are reusable DTO/data models typically defined?",
          options: [
            "Under paths",
            "Under components → schemas",
            "Under servers",
            "Under security"
          ],
          correct: [1],
          reasoning: "Reusable data models (DTOs) live under components/schemas and are referenced with $ref. 'paths' holds endpoints, 'servers' holds base URLs and 'security' holds auth schemes."
        },
        {
          id: 60,
          question: "Which HTTP methods are idempotent?",
          options: [
            "POST",
            "PATCH",
            "GET",
            "DELETE"
          ],
          correct: [2, 3],
          reasoning: "GET, PUT and DELETE are idempotent — repeating them yields the same server state. POST (and generally PATCH) are not idempotent: repeating a POST can create duplicate resources."
        },
        {
          id: 61,
          question: "Which option shows the correct general syntax of a URL?",
          options: [
            "scheme://host:port/path?query#fragment",
            "host://scheme/port?fragment#path",
            "path?scheme#host/query",
            "query://host/scheme#path"
          ],
          correct: [0],
          reasoning: "A URL is scheme://host[:port]/path[?query][#fragment], e.g. https://example.com:443/api/items?id=5#top. The other orderings are scrambled."
        },
        {
          id: 62,
          question: "Which patterns are Creational with object scope?",
          options: [
            "Adapter",
            "Abstract Factory",
            "Builder",
            "Singleton"
          ],
          correct: [1, 2, 3],
          reasoning: "Abstract Factory, Builder, Prototype and Singleton are object-scoped creational patterns. Adapter is a structural pattern."
        },
        {
          id: 63,
          question: "Which of these is NOT one of the three GoF purpose categories?",
          options: [
            "Architectural",
            "Creational",
            "Structural",
            "Behavioral"
          ],
          correct: [0],
          reasoning: "The three purpose categories are Creational, Structural and Behavioral. 'Architectural' is not among them."
        },
        {
          id: 64,
          question: "Which statements about the Bridge pattern are correct?",
          options: [
            "It guarantees a single global instance",
            "It is classified as a structural pattern",
            "It decouples an abstraction from its implementation so both vary independently",
            "It creates new objects by cloning prototypes"
          ],
          correct: [1, 2],
          reasoning: "Bridge is a structural pattern that separates an abstraction from its implementation via a bridge interface. Single-instance is Singleton and cloning is Prototype."
        },
        {
          id: 65,
          question: "Which single statement best describes the Prototype pattern?",
          options: [
            "It wraps a subsystem with a simpler interface",
            "It ensures only one instance exists",
            "It builds a complex object step by step",
            "New objects are created by cloning existing, initialized prototypes"
          ],
          correct: [3],
          reasoning: "Prototype clones a pre-initialized object instead of constructing from scratch — handy when initialization is expensive. Wrapping a subsystem is Facade, single-instance is Singleton, and step-by-step construction is Builder."
        },
        {
          id: 66,
          question: "Which of these are REST architectural constraints?",
          options: [
            "Statelessness",
            "Cacheability",
            "Uniform interface",
            "A mandatory per-client server session"
          ],
          correct: [0, 1, 2],
          reasoning: "REST's constraints include client-server, statelessness, cacheability, uniform interface, layered system and code-on-demand. Keeping a per-client session on the server contradicts the stateless constraint."
        },
        {
          id: 67,
          question: "Which HTTP status-code class mappings are correct?",
          options: [
            "2xx = Successful",
            "3xx = Client Error",
            "5xx = Successful",
            "4xx = Client Error"
          ],
          correct: [0, 3],
          reasoning: "2xx Successful and 4xx Client Error are correct. 3xx is Redirection (not Client Error) and 5xx is Server Error (not Successful)."
        },
        {
          id: 68,
          question: "What does the HTTP status code 404 mean?",
          options: [
            "Forbidden",
            "Not Found",
            "Internal Server Error",
            "No Content"
          ],
          correct: [1],
          reasoning: "404 Not Found means the requested resource does not exist. 403 is Forbidden, 500 is Internal Server Error and 204 is No Content."
        },
        {
          id: 69,
          question: "Which statements about Swagger / OpenAPI are correct?",
          options: [
            "Swagger is a relational database engine",
            "Swagger replaces the HTTP protocol",
            "The OpenAPI Specification was donated to the Linux Foundation (2015)",
            "Swagger Codegen can generate server stubs and client SDKs from an API definition"
          ],
          correct: [2, 3],
          reasoning: "OpenAPI was donated to the Linux Foundation in 2015, and Swagger Codegen generates stubs/SDKs from a spec. Swagger is an API-description toolset — neither a database engine nor a replacement for HTTP."
        },
        {
          id: 70,
          question: "Which of these are Java EE / Jakarta EE presentation-layer patterns?",
          options: [
            "MVC (Model–View–Controller)",
            "Front Controller",
            "View Helper",
            "Data Access Object"
          ],
          correct: [0, 1, 2],
          reasoning: "MVC, Front Controller and View Helper are presentation-tier patterns. The Data Access Object (DAO) is a persistence-tier pattern."
        },
        {
          id: 71,
          question: "How is the Facade pattern classified?",
          options: [
            "Creational",
            "Behavioral",
            "Concurrency",
            "Structural"
          ],
          correct: [3],
          reasoning: "Facade is a structural pattern: it composes objects to present a simpler interface over a subsystem. It is not creational, behavioral, or a concurrency pattern."
        },
        {
          id: 72,
          question: "Which statements about a Singleton implementation are correct?",
          options: [
            "The constructor is made private to block external instantiation",
            "It provides a global access point to the single instance",
            "It exposes a public constructor producing many instances",
            "It necessarily creates one instance per thread"
          ],
          correct: [0, 1],
          reasoning: "A Singleton hides its constructor and offers a static global accessor to the one shared instance. A public multi-instance constructor would break it, and a true Singleton is one per application — not one per thread."
        },
        {
          id: 73,
          question: "When is HTTP status 201 Created the appropriate response?",
          options: [
            "When the resource was deleted",
            "When the client must follow a redirect",
            "When a request (typically POST) has resulted in a new resource being created",
            "When the server hit an internal error"
          ],
          correct: [2],
          reasoning: "201 Created signals that a new resource was successfully created, usually after a POST, and often includes a Location header pointing to it. Deletion, redirection and server errors use other codes."
        },
        {
          id: 74,
          question: "Which of these are GoF-defined essential elements of a design pattern?",
          options: [
            "Pattern name",
            "Source-code repository",
            "Marketing plan",
            "Problem"
          ],
          correct: [0, 3],
          reasoning: "GoF's essential elements are pattern name, problem, solution and consequences. A repository or marketing plan is not part of the pattern description."
        },
        {
          id: 75,
          question: "Which of these are valid HTTP/1.1 methods?",
          options: [
            "FETCH",
            "PUT",
            "DELETE",
            "OPTIONS"
          ],
          correct: [1, 2, 3],
          reasoning: "PUT, DELETE and OPTIONS are HTTP/1.1 methods. 'FETCH' is a browser JavaScript API, not an HTTP method."
        }
      ]
    },
    /* ============================ LECTURE 04 ============================ */
    {
      id: "lec04",
      group: "Design Patterns",
      title: "04 · GoF Patterns in Java & Spring intro",
      questions: [
        {
          id: 76,
          question: "Which Java core-library calls are given as Singleton examples?",
          options: [
            "java.lang.Runtime#getRuntime()",
            "java.awt.Desktop#getDesktop()",
            "java.lang.Object#clone()",
            "java.util.Iterator#next()"
          ],
          correct: [0, 1],
          reasoning: "Runtime#getRuntime() and Desktop#getDesktop() return a single shared instance (Singleton). Object#clone() illustrates Prototype and Iterator#next() illustrates the Iterator pattern."
        },
        {
          id: 77,
          question: "Which Java API is the classic Builder-pattern example?",
          options: [
            "java.lang.Object#clone()",
            "java.util.Comparator#compare()",
            "java.lang.StringBuilder#append()",
            "java.lang.reflect.Proxy"
          ],
          correct: [2],
          reasoning: "StringBuilder#append() returns the builder itself so calls can be chained to assemble a result — the Builder pattern. clone() is Prototype, Comparator#compare() is Strategy, and Proxy is the Proxy pattern."
        },
        {
          id: 78,
          question: "Which are given as Java examples of the Decorator pattern?",
          options: [
            "java.io stream wrappers taking same-type instances",
            "java.util.Collections#synchronizedXxx()/unmodifiableXxx()",
            "java.lang.reflect.Proxy",
            "javax.servlet.http.HttpServletRequestWrapper"
          ],
          correct: [0, 1, 3],
          reasoning: "The I/O stream wrappers, Collections' synchronized/unmodifiable wrappers and the servlet request/response wrappers all wrap a same-type object to add behavior (Decorator). java.lang.reflect.Proxy is the Proxy example."
        },
        {
          id: 79,
          question: "Which mappings of a Java API to its design pattern are correct?",
          options: [
            "javax.servlet.Filter#doFilter() → Observer",
            "java.lang.StringBuilder#append() → Observer",
            "java.util.Comparator#compare() → Strategy",
            "java.util.Iterator → Iterator"
          ],
          correct: [2, 3],
          reasoning: "Comparator#compare() is Strategy and Iterator is Iterator. Filter#doFilter() is Chain of Responsibility (not Observer), and StringBuilder#append() is Builder (not Observer)."
        },
        {
          id: 80,
          question: "Which statements about AntiPatterns are correct?",
          options: [
            "They give a vocabulary for common defective processes and implementations",
            "They look easy to follow but have bad side effects",
            "They are GoF patterns guaranteed to improve performance",
            "They are always the recommended solution"
          ],
          correct: [0, 1],
          reasoning: "AntiPatterns name recurring bad practices that seem convenient but cause harm. They are the OPPOSITE of recommended GoF design patterns, not a performance guarantee."
        },
        {
          id: 81,
          question: "Which statements about Java annotations are correct?",
          options: [
            "They were introduced in JDK 1.5",
            "Many frameworks are built on top of them",
            "They have no representation in UML",
            "They can never be read via the reflection API"
          ],
          correct: [0, 1, 2],
          reasoning: "Annotations arrived in JDK 1.5, underpin frameworks like Spring/JPA, and have no native UML notation. They are frequently read THROUGH reflection (when retained at runtime), so the last claim is false."
        },
        {
          id: 82,
          question: "Which are valid java.lang.annotation.RetentionPolicy values?",
          options: [
            "RUNTIME",
            "MODULE",
            "CLASS",
            "SOURCE"
          ],
          correct: [0, 2, 3],
          reasoning: "RetentionPolicy has exactly three values: SOURCE, CLASS and RUNTIME. There is no MODULE retention policy."
        },
        {
          id: 83,
          question: "Which are valid @Target ElementType values?",
          options: [
            "DATABASE",
            "TYPE",
            "METHOD",
            "FIELD"
          ],
          correct: [1, 2, 3],
          reasoning: "ElementType includes TYPE, METHOD, FIELD, PARAMETER, CONSTRUCTOR, PACKAGE and others. DATABASE is not an ElementType."
        },
        {
          id: 84,
          question: "Which RetentionPolicy keeps an annotation readable via reflection at run time?",
          options: [
            "SOURCE",
            "CLASS",
            "COMPILE",
            "RUNTIME"
          ],
          correct: [3],
          reasoning: "Only RetentionPolicy.RUNTIME retains the annotation in the class file AND makes it available to reflection at run time. SOURCE is discarded by the compiler, CLASS is kept in the file but not exposed to reflection, and COMPILE is not a real value."
        },
        {
          id: 85,
          question: "Which of these are Spring core technologies?",
          options: [
            "Dependency injection",
            "Aspect-oriented programming",
            "Manual pointer arithmetic",
            "Direct control of the garbage collector"
          ],
          correct: [0, 1],
          reasoning: "Spring's core technologies include dependency injection, AOP, events and validation. Pointer arithmetic and GC control are not Java/Spring concerns at all."
        },
        {
          id: 86,
          question: "Which statements about Spring vs Spring Boot are correct?",
          options: [
            "Spring Boot is a completely separate framework unrelated to Spring",
            "Plain Spring auto-configures the data source with zero setup",
            "Spring Boot eliminates much of Spring's boilerplate configuration",
            "Spring Boot can auto-configure features by convention"
          ],
          correct: [2, 3],
          reasoning: "Spring Boot is an extension of Spring that removes boilerplate and auto-configures by convention. It is built ON Spring (not unrelated), and plain Spring requires manual data-source/EntityManager setup."
        },
        {
          id: 87,
          question: "Which mechanisms can be used to achieve Inversion of Control?",
          options: [
            "Dependency Injection",
            "Service Locator pattern",
            "Factory pattern",
            "Garbage collection"
          ],
          correct: [0, 1, 2],
          reasoning: "IoC can be realised through Dependency Injection, the Service Locator, the Factory pattern and the Strategy pattern. Garbage collection is automatic memory management, unrelated to IoC."
        },
        {
          id: 88,
          question: "Which single statement best defines a Spring 'bean'?",
          options: [
            "Only an XML configuration file",
            "A row in a relational database",
            "An HTML view template",
            "An object instantiated, assembled and managed by the Spring IoC container"
          ],
          correct: [3],
          reasoning: "A bean is any object whose lifecycle is managed by the Spring IoC container. It is not a config file, a database row, or a view template."
        },
        {
          id: 89,
          question: "Which are responsibilities of the Spring IoC container?",
          options: [
            "Instantiating the beans",
            "Injecting each bean's dependencies",
            "Compiling the Java source code",
            "Automatically running database migrations"
          ],
          correct: [0, 1],
          reasoning: "The container creates beans, wires their dependencies and manages their lifecycle. Compilation is the job of javac, and database migrations are handled by separate tools (e.g. Flyway/Liquibase)."
        },
        {
          id: 90,
          question: "Which are valid forms of dependency injection in Spring?",
          options: [
            "Constructor injection",
            "Global-variable injection",
            "Setter injection",
            "Field injection"
          ],
          correct: [0, 2, 3],
          reasoning: "Spring supports constructor, setter and field injection. 'Global-variable injection' is not a Spring DI mechanism."
        },
        {
          id: 91,
          question: "What does IoC stand for?",
          options: [
            "Injection of Components",
            "Inversion of Control",
            "Instance of Class",
            "Interface or Class"
          ],
          correct: [1],
          reasoning: "IoC = Inversion of Control: the framework, not your code, controls object creation and the flow of dependencies. Dependency injection is one way to implement it."
        },
        {
          id: 92,
          question: "Which of these are Spring stereotype annotations?",
          options: [
            "@Service",
            "@Embeddable",
            "@Repository",
            "@Controller"
          ],
          correct: [0, 2, 3],
          reasoning: "@Component and its specialisations @Service, @Repository and @Controller are Spring stereotypes. @Embeddable is a JPA annotation for embeddable value types."
        },
        {
          id: 93,
          question: "What is the purpose of Spring's @Autowired annotation?",
          options: [
            "It maps a class to a database table",
            "It marks a constructor, setter or field for dependency injection by the container",
            "It declares a REST endpoint path",
            "It defines an AOP pointcut expression"
          ],
          correct: [1],
          reasoning: "@Autowired tells the container to inject a matching bean. Mapping to a table is @Entity/@Table, declaring endpoints is @RequestMapping, and pointcuts use @Pointcut."
        },
        {
          id: 94,
          question: "Which statements about Decorator vs Proxy are correct?",
          options: [
            "Proxy creates new objects by cloning",
            "Decorator guarantees a single instance",
            "Decorator wraps an object to add behavior",
            "java.lang.reflect.Proxy is an example of the Proxy pattern"
          ],
          correct: [2, 3],
          reasoning: "Decorator wraps an instance to extend its behavior, and java.lang.reflect.Proxy exemplifies Proxy. Cloning is Prototype and single-instance is Singleton."
        },
        {
          id: 95,
          question: "java.lang.StringBuilder is a Java example of which pattern?",
          options: [
            "Builder",
            "Singleton",
            "Observer",
            "Adapter"
          ],
          correct: [0],
          reasoning: "StringBuilder assembles a result through chained append() calls — the Builder pattern."
        },
        {
          id: 96,
          question: "Which of these are groups of Spring Framework modules?",
          options: [
            "Mobile GPU rendering",
            "Core Container",
            "Data Access / Integration",
            "AOP"
          ],
          correct: [1, 2, 3],
          reasoning: "Spring modules are grouped into Core Container, Data Access/Integration, Web, AOP, Aspects, Instrumentation and Test. 'Mobile GPU rendering' is not a Spring module group."
        },
        {
          id: 97,
          question: "Which of these are valid Spring bean scopes?",
          options: [
            "singleton",
            "prototype",
            "eternal",
            "static"
          ],
          correct: [0, 1],
          reasoning: "Spring bean scopes include singleton, prototype, request, session and application. 'eternal' and 'static' are not Spring scopes."
        },
        {
          id: 98,
          question: "What is the default scope of a Spring bean?",
          options: [
            "prototype",
            "request",
            "singleton",
            "session"
          ],
          correct: [2],
          reasoning: "By default a Spring bean is a singleton — one shared instance per container. prototype, request and session are opt-in scopes."
        },
        {
          id: 99,
          question: "Which statements about the Adapter pattern are correct?",
          options: [
            "It lets two otherwise incompatible interfaces work together",
            "It guarantees a single instance of a class",
            "It is a behavioral pattern",
            "It is a structural pattern"
          ],
          correct: [0, 3],
          reasoning: "Adapter is a structural pattern that converts one interface into another so incompatible classes can collaborate. It is not about single instances (Singleton) and is structural, not behavioral."
        },
        {
          id: 100,
          question: "Which statements about the Observer pattern are correct?",
          options: [
            "It guarantees only one instance of a class exists",
            "It defines a one-to-many dependency between a subject and its observers",
            "When the subject changes, all observers are notified",
            "It is widely used to build event/notification systems"
          ],
          correct: [1, 2, 3],
          reasoning: "Observer establishes a one-to-many link so that a subject's state change notifies all registered observers — the basis of event systems. Single-instance guarantees come from Singleton."
        }
      ]
    },
    /* ============================ LECTURE 05 ============================ */
    {
      id: "lec05",
      group: "Java / Spring / Web",
      title: "05 · Spring MVC/REST Annotations & AngularJS",
      questions: [
        {
          id: 101,
          question: "Which statements about @RestController are correct?",
          options: [
            "It maps a class directly to a database table",
            "It defines an AOP pointcut",
            "It is shorthand for @Controller + @ResponseBody",
            "Its handler methods return data serialized into the response body"
          ],
          correct: [2, 3],
          reasoning: "@RestController combines @Controller and @ResponseBody, so handler return values are serialized (e.g. to JSON) into the response body rather than resolved to a view. Mapping to a table is @Entity/@Table; pointcuts use @Pointcut."
        },
        {
          id: 102,
          question: "Which syntax does Angular use for text interpolation (string binding) in a template?",
          options: [
            "@{ }",
            "{{ }}",
            "#{ }",
            "%{ }"
          ],
          correct: [1],
          reasoning: "Angular interpolates an expression into template text with double curly braces, e.g. {{ user.name }}. The other delimiters are from other template engines (e.g. #{ } in Thymeleaf/SpEL)."
        },
        {
          id: 103,
          question: "Which of these is NOT a Spring / Spring Boot annotation?",
          options: [
            "@NgModule",
            "@SpringBootApplication",
            "@RestController",
            "@GetMapping"
          ],
          correct: [0],
          reasoning: "@NgModule is an Angular annotation. @SpringBootApplication, @RestController and @GetMapping are all Spring (Boot) annotations."
        },
        {
          id: 104,
          question: "Which of these are real Spring HTTP-method mapping annotations?",
          options: [
            "@FetchMapping",
            "@GetMapping",
            "@PostMapping",
            "@DeleteMapping"
          ],
          correct: [1, 2, 3],
          reasoning: "@GetMapping, @PostMapping, @PutMapping, @DeleteMapping and @PatchMapping are the method-specific shortcuts for @RequestMapping. '@FetchMapping' does not exist."
        },
        {
          id: 105,
          question: "Which statements about @PathVariable vs @RequestParam are correct?",
          options: [
            "@PathVariable binds a value from a URI template segment",
            "@RequestParam binds a value from the query string",
            "@PathVariable reads the raw HTTP request body",
            "@RequestParam maps the method to a database table"
          ],
          correct: [0, 1],
          reasoning: "@PathVariable binds part of the URI path (e.g. /users/{id}); @RequestParam binds a query/form parameter (e.g. ?page=2). The body is bound with @RequestBody, and neither annotation maps to a table."
        },
        {
          id: 106,
          question: "What does @RequestBody do?",
          options: [
            "It binds a URI path segment to a parameter",
            "It declares a bean for injection",
            "It defines a transaction boundary",
            "It deserializes the HTTP request body into a method parameter"
          ],
          correct: [3],
          reasoning: "@RequestBody converts the incoming request body (e.g. JSON) into a Java object via a message converter. Path binding is @PathVariable, injection is @Autowired, and transactions use @Transactional."
        },
        {
          id: 107,
          question: "Which annotations does @SpringBootApplication combine?",
          options: [
            "@Configuration",
            "@Entity",
            "@EnableAutoConfiguration",
            "@ComponentScan"
          ],
          correct: [0, 2, 3],
          reasoning: "@SpringBootApplication is a convenience meta-annotation for @Configuration, @EnableAutoConfiguration and @ComponentScan. @Entity is a JPA annotation, unrelated to bootstrapping."
        },
        {
          id: 108,
          question: "Which of these are genuine AngularJS / Angular directives?",
          options: [
            "ng-compile (compiles Java)",
            "ng-repeat / *ngFor (iterate a list)",
            "ng-model / [(ngModel)] (two-way binding)",
            "ng-database (binds SQL)"
          ],
          correct: [1, 2],
          reasoning: "ng-repeat/*ngFor iterate over a collection and ng-model/[(ngModel)] provide two-way binding. 'ng-compile' and 'ng-database' are invented."
        },
        {
          id: 109,
          question: "Which AngularJS directive provides two-way data binding on a form field?",
          options: [
            "ng-model",
            "ng-click",
            "ng-repeat",
            "ng-show"
          ],
          correct: [0],
          reasoning: "ng-model binds an input's value to a scope property in both directions. ng-click handles events, ng-repeat iterates, and ng-show toggles visibility."
        },
        {
          id: 110,
          question: "Which statements about @Controller vs @RestController are correct?",
          options: [
            "@Controller methods return view names to be resolved by default",
            "@RestController methods return data serialized into the response body",
            "@RestController renders a JSP view by default",
            "@Controller always returns JSON"
          ],
          correct: [0, 1],
          reasoning: "@Controller is for MVC views (returns a logical view name); @RestController serializes return values to the body (e.g. JSON). @RestController does NOT render JSPs, and @Controller does not automatically return JSON."
        },
        {
          id: 111,
          question: "What does Spring's ResponseEntity<T> represent?",
          options: [
            "A JPA entity mapped to a table",
            "An AOP advice",
            "An Angular component",
            "The whole HTTP response: status code, headers and body"
          ],
          correct: [3],
          reasoning: "ResponseEntity lets a handler control the full HTTP response — status line, headers and body. A table mapping is @Entity, advice is AOP, and components belong to Angular."
        },
        {
          id: 112,
          question: "Which of these can a Spring REST controller produce via content negotiation?",
          options: [
            "JSON",
            "XML",
            "Plain text",
            "Compiled JVM bytecode"
          ],
          correct: [0, 1, 2],
          reasoning: "Through HttpMessageConverters (e.g. Jackson) a controller can produce JSON, XML, plain text, etc., chosen by content negotiation. It does not emit JVM bytecode as a response media type."
        },
        {
          id: 113,
          question: "Which statements about @RequestParam are correct?",
          options: [
            "It binds the entire URI path segment",
            "It injects a Spring-managed bean",
            "It binds a query-string or form parameter to a method argument",
            "It supports a default value and a required flag"
          ],
          correct: [2, 3],
          reasoning: "@RequestParam binds query/form parameters and offers defaultValue and required attributes. Binding a path segment is @PathVariable, and injecting a bean is @Autowired."
        },
        {
          id: 114,
          question: "In Angular, what does {{ user.name }} do?",
          options: [
            "Runs a database query named user",
            "Declares a new component",
            "Defines a CSS class",
            "Evaluates the expression against the scope/component and renders the text"
          ],
          correct: [3],
          reasoning: "Interpolation evaluates the bound expression in the current scope/component context and inserts the resulting text into the DOM. It is not a query, a component declaration, or CSS."
        },
        {
          id: 115,
          question: "Which of these are AngularJS application building blocks?",
          options: [
            "Modules",
            "Controllers",
            "Services",
            "Java servlets"
          ],
          correct: [0, 1, 2],
          reasoning: "An AngularJS app is composed of modules, controllers, services/factories and directives. Servlets are a server-side Java technology, not an Angular building block."
        },
        {
          id: 116,
          question: "Which statements about @PostMapping are correct?",
          options: [
            "It handles HTTP POST requests",
            "It is shorthand for @RequestMapping(method = POST)",
            "It handles HTTP GET requests",
            "It maps the class to a database table"
          ],
          correct: [0, 1],
          reasoning: "@PostMapping is the specialised shortcut for @RequestMapping(method = RequestMethod.POST). It does not handle GET, and it does not map to tables."
        },
        {
          id: 117,
          question: "Which annotation marks a class as a REST controller whose methods return response-body data?",
          options: [
            "@Service",
            "@Repository",
            "@RestController",
            "@Entity"
          ],
          correct: [2],
          reasoning: "@RestController designates a web controller whose return values are written to the HTTP response body. @Service/@Repository are other stereotypes and @Entity is JPA."
        },
        {
          id: 118,
          question: "Which statements about Angular expressions inside {{ }} are correct?",
          options: [
            "They can contain simple expressions",
            "They can execute arbitrary operating-system shell commands",
            "They are SQL statements run on the server",
            "They are evaluated against the current scope/component"
          ],
          correct: [0, 3],
          reasoning: "Interpolation evaluates a restricted JavaScript-like expression in the component/scope context. It cannot run shell commands or SQL."
        },
        {
          id: 119,
          question: "For a mapping like /users/{id}, which annotation binds {id} to a method parameter?",
          options: [
            "@RequestBody",
            "@RequestParam",
            "@PathVariable",
            "@Autowired"
          ],
          correct: [2],
          reasoning: "@PathVariable binds a URI template variable such as {id}. @RequestBody is for the body, @RequestParam for query parameters and @Autowired for DI."
        },
        {
          id: 120,
          question: "Which components are part of the Spring MVC request-handling flow?",
          options: [
            "DispatcherServlet (front controller)",
            "Handler mapping",
            "The Java garbage collector",
            "View resolver"
          ],
          correct: [0, 1, 3],
          reasoning: "A request flows through the DispatcherServlet to a handler mapping, then a controller, then a view resolver. The garbage collector is a JVM memory facility, not part of MVC routing."
        },
        {
          id: 121,
          question: "Which statements about the DispatcherServlet are correct?",
          options: [
            "It is a JDBC database driver",
            "It acts as a front controller, routing requests to handlers",
            "It is the central entry point of a Spring MVC application",
            "It is an Angular directive"
          ],
          correct: [1, 2],
          reasoning: "The DispatcherServlet implements the Front Controller pattern and is the single entry point that dispatches requests to controllers. It is neither a JDBC driver nor an Angular directive."
        },
        {
          id: 122,
          question: "Which HTTP request header primarily drives server-side content negotiation?",
          options: [
            "Host",
            "Cookie",
            "User-Agent",
            "Accept"
          ],
          correct: [3],
          reasoning: "The Accept header tells the server which media types the client prefers (e.g. application/json), driving content negotiation. Host, Cookie and User-Agent serve other purposes."
        },
        {
          id: 123,
          question: "Which Angular binding syntaxes are matched correctly?",
          options: [
            "(click) = event binding",
            "[disabled] = property binding",
            "{{ }} = event binding",
            "*ngFor = a dependency-injected service"
          ],
          correct: [0, 1],
          reasoning: "(event) is event binding and [property] is property binding. {{ }} is interpolation (one-way text binding), not event binding, and *ngFor is a structural directive, not a service."
        },
        {
          id: 124,
          question: "What is the role of @EnableAutoConfiguration in Spring Boot?",
          options: [
            "It maps an entity to a table",
            "It declares a REST endpoint",
            "It defines a pointcut",
            "It triggers Spring Boot's automatic configuration based on the classpath"
          ],
          correct: [3],
          reasoning: "@EnableAutoConfiguration switches on Boot's convention-based auto-configuration, wiring beans inferred from the classpath and properties. The other options describe @Entity, @RequestMapping and @Pointcut."
        },
        {
          id: 125,
          question: "Which annotations are used to read inputs from an incoming HTTP request?",
          options: [
            "@PathVariable",
            "@RequestParam",
            "@RequestBody",
            "@Autowired"
          ],
          correct: [0, 1, 2],
          reasoning: "@PathVariable (path), @RequestParam (query/form) and @RequestBody (body) all extract request input. @Autowired injects collaborating beans and has nothing to do with reading the request."
        }
      ]
    },
    /* ============================ LECTURE 06 ============================ */
    {
      id: "lec06",
      group: "Java / Spring / Web",
      title: "06 · DAO Pattern, JDBC & JPA",
      questions: [
        {
          id: 126,
          question: "Which JPA annotation marks a field as the entity's primary key?",
          options: [
            "@Key",
            "@Primary",
            "@Id",
            "@Pk"
          ],
          correct: [2],
          reasoning: "@Id designates the identifier (primary-key) field of a JPA entity. @Primary is a Spring bean-selection annotation, and @Key/@Pk do not exist in JPA."
        },
        {
          id: 127,
          question: "Which statements about the DAO (Data Access Object) pattern are correct?",
          options: [
            "It separates data-access logic from business logic",
            "It is a GoF creational pattern",
            "It is responsible for rendering the user interface",
            "It provides an abstract interface to some persistent store"
          ],
          correct: [0, 3],
          reasoning: "A DAO encapsulates and abstracts access to a data source, decoupling persistence from business logic. It is a Java EE/core-J2EE pattern (not a GoF creational pattern) and has nothing to do with the UI."
        },
        {
          id: 128,
          question: "What does the JPA @Embedded annotation do?",
          options: [
            "It marks a class as a standalone entity with its own table",
            "It defines the primary-key generation strategy",
            "It declares a one-to-many association",
            "It embeds an @Embeddable value object's fields into the owning entity's table"
          ],
          correct: [3],
          reasoning: "@Embedded includes the columns of an @Embeddable value type directly in the owner's table (no separate table or identity). It is not an entity, a key strategy, or an association."
        },
        {
          id: 129,
          question: "Which of these are valid JPA association-mapping annotations?",
          options: [
            "@ManyToNone",
            "@OneToMany",
            "@ManyToOne",
            "@ManyToMany"
          ],
          correct: [1, 2, 3],
          reasoning: "JPA associations are @OneToOne, @OneToMany, @ManyToOne and @ManyToMany. '@ManyToNone' is not a JPA annotation."
        },
        {
          id: 130,
          question: "Which single statement best describes the Value Object / Transfer Object (VO/DTO) pattern?",
          options: [
            "It guarantees a single instance of a class",
            "It defines an AOP advice",
            "It is a serializable object that carries data between layers or processes",
            "It maps a URL to a controller method"
          ],
          correct: [2],
          reasoning: "A Value/Transfer Object is a plain serializable data carrier used to move a bundle of data across tiers (often to reduce remote round-trips). Single-instance is Singleton; advice is AOP; URL mapping is MVC."
        },
        {
          id: 131,
          question: "Which statements about JPA @GeneratedValue are correct?",
          options: [
            "It specifies how the primary-key value is generated",
            "It is used together with @Id",
            "It maps a JPQL query to a method",
            "It defines a transaction boundary"
          ],
          correct: [0, 1],
          reasoning: "@GeneratedValue (e.g. strategy = IDENTITY/SEQUENCE/AUTO) declares the key-generation strategy and is placed alongside @Id. Query mapping uses @Query/@NamedQuery and transactions use @Transactional."
        },
        {
          id: 132,
          question: "Which of these are core JDBC objects/interfaces?",
          options: [
            "Connection",
            "Statement",
            "ResultSet",
            "EntityManager"
          ],
          correct: [0, 1, 2],
          reasoning: "JDBC works through Connection, Statement/PreparedStatement and ResultSet. EntityManager belongs to JPA, a higher-level ORM API."
        },
        {
          id: 133,
          question: "What does the JPA @Entity annotation do?",
          options: [
            "It defines a REST endpoint",
            "It declares a Spring bean scope",
            "It configures logging",
            "It marks a class as a persistent JPA entity mapped to a table"
          ],
          correct: [3],
          reasoning: "@Entity tells JPA the class is a managed, persistable entity (by default mapped to a table of the same name). The other options describe unrelated concerns."
        },
        {
          id: 134,
          question: "Which statements about @Embeddable vs @Embedded are correct?",
          options: [
            "@Embeddable marks the value class that can be embedded",
            "@Embedded marks the field in the owning entity where it is embedded",
            "@Embedded marks a class as a separate table",
            "@Embeddable defines the primary-key generation strategy"
          ],
          correct: [0, 1],
          reasoning: "@Embeddable annotates the reusable value type; @Embedded annotates the owner's field that pulls those columns in. Neither creates a separate table nor sets a key strategy."
        },
        {
          id: 135,
          question: "What is the purpose of the JPA @Column annotation?",
          options: [
            "It marks the primary key",
            "It declares a many-to-many association",
            "It maps a field to a table column (name, nullable, length, etc.)",
            "It registers a Spring controller"
          ],
          correct: [2],
          reasoning: "@Column customises how a field maps to its database column. The primary key is @Id, associations use @ManyToMany etc., and controllers use @Controller/@RestController."
        },
        {
          id: 136,
          question: "Which of these are EntityManager operations?",
          options: [
            "persist()",
            "merge()",
            "compile()",
            "remove()"
          ],
          correct: [0, 1, 3],
          reasoning: "The EntityManager exposes persist(), merge(), remove(), find() and createQuery(), among others. compile() is not an EntityManager method."
        },
        {
          id: 137,
          question: "Which statements about JPA vs JDBC are correct?",
          options: [
            "JPA requires you to hand-write every SQL statement",
            "JDBC is an OMG modeling specification",
            "JPA is an ORM abstraction that typically sits on top of JDBC",
            "JDBC is a lower-level API for executing SQL directly"
          ],
          correct: [2, 3],
          reasoning: "JPA maps objects to relations and usually delegates to JDBC underneath; JDBC is the lower-level SQL API. JPA generates SQL for you (you needn't hand-write it all), and JDBC is a Java API, not an OMG spec."
        },
        {
          id: 138,
          question: "Which interface is the central JPA API for persistence operations?",
          options: [
            "Connection",
            "EntityManager",
            "DispatcherServlet",
            "ResultSet"
          ],
          correct: [1],
          reasoning: "EntityManager manages the persistence context and performs persist/merge/remove/find/query operations. Connection and ResultSet are JDBC, and DispatcherServlet is Spring MVC."
        },
        {
          id: 139,
          question: "Which statements about a typical DAO are correct?",
          options: [
            "It exposes CRUD-style methods (create, read, update, delete)",
            "It contains the application's REST controllers",
            "It hides the underlying data-source details from callers",
            "It is an Angular front-end service"
          ],
          correct: [0, 2],
          reasoning: "A DAO offers CRUD operations and conceals the persistence mechanism behind an interface. Controllers and Angular services live in entirely different layers."
        },
        {
          id: 140,
          question: "Which of these are JPA object-relational mapping annotations?",
          options: [
            "@Entity",
            "@Table",
            "@Bean",
            "@Id"
          ],
          correct: [0, 1, 3],
          reasoning: "@Entity, @Table and @Id are JPA mapping annotations. @Bean is a Spring annotation that declares a bean in a configuration class."
        },
        {
          id: 141,
          question: "What does the JPA @Table annotation specify?",
          options: [
            "The primary-key generation strategy",
            "A REST request mapping",
            "The table name (and optionally schema) an entity maps to",
            "An AOP pointcut"
          ],
          correct: [2],
          reasoning: "@Table overrides the default table name/schema for an entity. Key generation is @GeneratedValue, request mapping is @RequestMapping, and pointcuts are @Pointcut."
        },
        {
          id: 142,
          question: "Which statements about a Transfer Object are correct?",
          options: [
            "It is a serializable object that holds a bundle of data",
            "It always contains rich business logic",
            "It is itself a JDBC driver",
            "It can reduce the number of remote calls by transferring data in one shot"
          ],
          correct: [0, 3],
          reasoning: "A Transfer Object packages data for transport across tiers, cutting down on chatty remote calls. By design it is mostly data with little/no business logic, and it is certainly not a driver."
        },
        {
          id: 143,
          question: "JPQL queries are written against which model?",
          options: [
            "Raw database tables and columns directly",
            "The entity object model (entities and their fields)",
            "HTML DOM elements",
            "HTTP request headers"
          ],
          correct: [1],
          reasoning: "JPQL is object-oriented: it queries entities and their persistent fields, and the provider translates it to SQL. It does not target tables/columns directly (that is native SQL)."
        },
        {
          id: 144,
          question: "Which of these are valid JPA relationship-mapping annotations or attributes?",
          options: [
            "@JoinColumn",
            "*ngFor",
            "@ManyToOne",
            "cascade attribute"
          ],
          correct: [0, 2, 3],
          reasoning: "@JoinColumn names the foreign-key column, @ManyToOne maps the association, and the cascade attribute controls operation propagation. *ngFor is an Angular directive."
        },
        {
          id: 145,
          question: "What does @GeneratedValue(strategy = GenerationType.IDENTITY) mean?",
          options: [
            "The key is a fixed constant",
            "The database auto-increment column generates the key value",
            "No primary key is used",
            "The key is computed by an AOP aspect"
          ],
          correct: [1],
          reasoning: "GenerationType.IDENTITY relies on the database's identity/auto-increment column to produce the key on insert. It is neither a constant, absent, nor aspect-generated."
        },
        {
          id: 146,
          question: "Which statements about the JPA persistence context are correct?",
          options: [
            "It is an HTML view template",
            "It is a raw network socket",
            "It is the set of entity instances currently managed by the EntityManager",
            "It acts as a first-level cache for those entities"
          ],
          correct: [2, 3],
          reasoning: "The persistence context tracks managed entities and serves as a first-level cache within a transaction. It is neither a template nor a socket."
        },
        {
          id: 147,
          question: "In a layered architecture, the DAO pattern belongs to which tier?",
          options: [
            "Presentation tier",
            "Business tier",
            "Persistence / data tier",
            "Network transport tier"
          ],
          correct: [2],
          reasoning: "The DAO sits in the persistence/data-access tier, isolating the rest of the application from the data store. Presentation and business concerns live in their own tiers."
        },
        {
          id: 148,
          question: "Which statements about using @Id together with @GeneratedValue are correct?",
          options: [
            "Together they mark the primary key and have its value auto-generated",
            "They are commonly placed on the entity's identifier field",
            "They declare a many-to-many association",
            "They set a Spring bean scope"
          ],
          correct: [0, 1],
          reasoning: "@Id marks the identifier and @GeneratedValue tells JPA to generate its value automatically — both go on the id field. They do not define associations or bean scopes."
        },
        {
          id: 149,
          question: "What does the acronym ORM stand for?",
          options: [
            "Online Resource Manager",
            "Optimized Record Model",
            "Open Repository Module",
            "Object-Relational Mapping"
          ],
          correct: [3],
          reasoning: "ORM = Object-Relational Mapping: bridging the object world (classes/fields) and the relational world (tables/columns). JPA/Hibernate are ORM technologies."
        },
        {
          id: 150,
          question: "Which of these are JPA implementations/providers?",
          options: [
            "Hibernate",
            "EclipseLink",
            "OpenJPA",
            "Apache Tomcat"
          ],
          correct: [0, 1, 2],
          reasoning: "Hibernate, EclipseLink and OpenJPA are JPA providers. Apache Tomcat is a servlet container/web server, not a JPA provider."
        }
      ]
    },
    /* ============================ LECTURE 07 ============================ */
    {
      id: "lec07",
      group: "Java / Spring / Web",
      title: "07 · Aspect-Oriented Programming (AOP)",
      questions: [
        {
          id: 151,
          question: "Which pointcut expression matches the execution of every method in classes under the com.xyz.service package?",
          options: [
            "within(com.xyz.service)",
            "@annotation(com.xyz.service)",
            "call(service.*)",
            "execution(* com.xyz.service.*.*(..))"
          ],
          correct: [3],
          reasoning: "execution(* com.xyz.service.*.*(..)) reads: any return type, any class in com.xyz.service, any method name, any arguments — matching all service methods. The others are different designators or malformed."
        },
        {
          id: 152,
          question: "Which statements about AOP 'advice' are correct?",
          options: [
            "Advice is the action taken by an aspect at a particular join point",
            "Advice types include before, after and around",
            "Advice is just another word for a pointcut",
            "Advice is a database table"
          ],
          correct: [0, 1],
          reasoning: "Advice is the code an aspect runs at a matched join point, and its kinds are before/after/around (plus after-returning/after-throwing). A pointcut SELECTS join points — it is not the advice itself."
        },
        {
          id: 153,
          question: "Inside an @Around advice, which call actually invokes the underlying target method?",
          options: [
            "target()",
            "invoke()",
            "call()",
            "proceed()"
          ],
          correct: [3],
          reasoning: "An @Around advice receives a ProceedingJoinPoint and calls proceed() to execute the advised target method (optionally before/after extra logic, or skipping it entirely). The other names are not the AOP API."
        },
        {
          id: 154,
          question: "Which of these are core AOP concepts?",
          options: [
            "Aspect",
            "Join point",
            "Advice",
            "Servlet"
          ],
          correct: [0, 1, 2],
          reasoning: "Aspect, join point, pointcut, advice, target, weaving and introduction are AOP concepts. A servlet is a Java EE web component, unrelated to AOP."
        },
        {
          id: 155,
          question: "Which statements about join point vs pointcut are correct?",
          options: [
            "A pointcut is the body of code executed as advice",
            "A join point is a row in a database",
            "A join point is a point during program execution (e.g. a method call)",
            "A pointcut is a predicate that selects join points"
          ],
          correct: [2, 3],
          reasoning: "A join point is a well-defined point in execution; a pointcut is an expression that matches a set of join points. The executed code is the advice, and a join point has nothing to do with database rows."
        },
        {
          id: 156,
          question: "Which advice type runs both before and after a method and can alter or skip the call?",
          options: [
            "@Before",
            "@After",
            "@Around",
            "@AfterThrowing"
          ],
          correct: [2],
          reasoning: "@Around wraps the join point: it runs before and after and decides (via proceed()) whether/how the target executes. @Before/@After only run on one side, and @AfterThrowing runs only on exceptions."
        },
        {
          id: 157,
          question: "Which of these are Spring AOP advice annotations?",
          options: [
            "@Before",
            "@AfterReturning",
            "@Whenever",
            "@AfterThrowing"
          ],
          correct: [0, 1, 3],
          reasoning: "Spring's advice annotations are @Before, @After, @Around, @AfterReturning and @AfterThrowing. '@Whenever' is not one of them."
        },
        {
          id: 158,
          question: "Which of these is a classic cross-cutting concern?",
          options: [
            "Logging applied across many classes",
            "A single getter method",
            "A local loop variable",
            "A constructor parameter"
          ],
          correct: [0],
          reasoning: "Cross-cutting concerns (logging, security, transactions) span many modules — exactly what AOP modularises. A getter, local variable or parameter is local to one place, not cross-cutting."
        },
        {
          id: 159,
          question: "Which statements about Spring AOP are correct?",
          options: [
            "It can only weave by modifying source code before compilation",
            "It is proxy-based",
            "It uses the AspectJ pointcut expression language by default",
            "It needs no proxies and rewrites all bytecode at run time"
          ],
          correct: [1, 2],
          reasoning: "Spring AOP creates runtime proxies and uses AspectJ's pointcut expression language. It does not require compile-time source weaving, and it specifically relies on proxies rather than full bytecode rewriting."
        },
        {
          id: 160,
          question: "What does an @Around advice receive that lets it control whether the target runs?",
          options: [
            "A HttpServletRequest",
            "A ResultSet",
            "An EntityManager",
            "A ProceedingJoinPoint"
          ],
          correct: [3],
          reasoning: "@Around advice takes a ProceedingJoinPoint; calling its proceed() runs the target method. The other types belong to servlets, JDBC and JPA."
        },
        {
          id: 161,
          question: "Which of these are commonly implemented as cross-cutting concerns via AOP?",
          options: [
            "Logging",
            "Security/authorization",
            "Transaction management",
            "Primary-key generation"
          ],
          correct: [0, 1, 2],
          reasoning: "Logging, security and transactions are textbook cross-cutting concerns handled by AOP. Primary-key generation is a persistence detail handled by JPA (@GeneratedValue)."
        },
        {
          id: 162,
          question: "Which statements about @AfterReturning vs @AfterThrowing are correct?",
          options: [
            "@AfterReturning runs after the method returns normally",
            "Both run only when an exception is thrown",
            "Neither can ever access the returned value",
            "@AfterThrowing runs when the method exits by throwing an exception"
          ],
          correct: [0, 3],
          reasoning: "@AfterReturning fires on normal completion (and can bind the return value), while @AfterThrowing fires on an exception (and can bind the thrown exception). So 'both only on exception' and 'never access return value' are false."
        },
        {
          id: 163,
          question: "What does the pointcut execution(* set*(..)) match?",
          options: [
            "Only the method literally named 'set'",
            "All fields starting with 'set'",
            "Any method whose name starts with 'set', with any arguments",
            "Only static initializers"
          ],
          correct: [2],
          reasoning: "'set*' is a name pattern matching any method beginning with 'set', '*' is any return type and '(..)' is any argument list. It matches methods, not fields or initializers."
        },
        {
          id: 164,
          question: "Which statements about weaving are correct?",
          options: [
            "Weaving is exactly the same thing as compiling Java to bytecode",
            "Weaving links aspects with the application code at the matched join points",
            "Weaving is a kind of UML diagram",
            "Weaving can occur at compile time, load time or run time"
          ],
          correct: [1, 3],
          reasoning: "Weaving integrates aspects into the target code and may happen at compile-, load- or run-time. It is a distinct step from ordinary Java compilation and is certainly not a diagram."
        },
        {
          id: 165,
          question: "What is the module that encapsulates a cross-cutting concern called?",
          options: [
            "A controller",
            "A repository",
            "A servlet",
            "An aspect"
          ],
          correct: [3],
          reasoning: "An aspect is the unit that modularises a cross-cutting concern (its pointcuts plus advice). Controllers, repositories and servlets address other layers."
        },
        {
          id: 166,
          question: "Which of these are AspectJ pointcut designators?",
          options: [
            "execution",
            "within",
            "@annotation",
            "selectAll"
          ],
          correct: [0, 1, 2],
          reasoning: "execution, within, @annotation (plus this, target, args, etc.) are AspectJ designators. 'selectAll' is not a designator."
        },
        {
          id: 167,
          question: "Which statements about @Before advice are correct?",
          options: [
            "It runs before the matched join point executes",
            "It cannot stop the method from running unless it throws an exception",
            "It runs only after the method returns",
            "It is identical to @Around"
          ],
          correct: [0, 1],
          reasoning: "@Before runs ahead of the join point and can only prevent execution by throwing. It does not run after return (that is @AfterReturning), and it is not the wrap-around @Around."
        },
        {
          id: 168,
          question: "Which annotation declares a class as an aspect in Spring/AspectJ?",
          options: [
            "@Component",
            "@Service",
            "@Aspect",
            "@Bean"
          ],
          correct: [2],
          reasoning: "@Aspect marks a class as an aspect containing pointcuts and advice. @Component/@Service are general stereotypes and @Bean declares a bean factory method."
        },
        {
          id: 169,
          question: "Which statements about the AOP 'target object' are correct?",
          options: [
            "It is the object being advised by one or more aspects",
            "It is the aspect itself",
            "It is the pointcut expression",
            "It is sometimes called the advised object"
          ],
          correct: [0, 3],
          reasoning: "The target (advised) object is the one whose join points are intercepted by aspects. It is neither the aspect nor the pointcut."
        },
        {
          id: 170,
          question: "On which object is proceed() invoked inside an @Around advice?",
          options: [
            "JoinPoint",
            "ProceedingJoinPoint",
            "Aspect",
            "Pointcut"
          ],
          correct: [1],
          reasoning: "proceed() is a method of ProceedingJoinPoint (a subtype of JoinPoint available only to @Around advice). A plain JoinPoint does not expose proceed()."
        },
        {
          id: 171,
          question: "Which of these are benefits of AOP?",
          options: [
            "It modularises cross-cutting concerns",
            "It guarantees the program contains no bugs",
            "It reduces code duplication of those concerns",
            "It keeps business logic cleaner"
          ],
          correct: [0, 2, 3],
          reasoning: "AOP centralises scattered concerns, removing duplication and decluttering business code. No technique can guarantee bug-free software."
        },
        {
          id: 172,
          question: "Which statements about a pointcut expression are correct?",
          options: [
            "It must be written in SQL",
            "It combines a designator (e.g. execution) with a signature pattern",
            "Several pointcuts can be combined with && || and !",
            "It must be written as an XML document"
          ],
          correct: [1, 2],
          reasoning: "A pointcut pairs a designator with a matching pattern and can be composed with the boolean operators &&, || and !. It is neither SQL nor XML."
        },
        {
          id: 173,
          question: "In execution(* com.app.service.*.*(..)), what does the '..' inside the parentheses mean?",
          options: [
            "Exactly one argument",
            "No arguments allowed",
            "Only String arguments",
            "Any number and type of arguments"
          ],
          correct: [3],
          reasoning: "The '(..)' argument pattern matches any number of parameters of any type. To require zero arguments you would write '()'."
        },
        {
          id: 174,
          question: "Which statements about an AOP introduction (inter-type declaration) are correct?",
          options: [
            "It lets an aspect add new methods or fields to an existing type",
            "It is also known as an inter-type declaration",
            "It deletes methods from a class at run time",
            "It is a kind of pointcut designator"
          ],
          correct: [0, 1],
          reasoning: "An introduction (inter-type declaration) augments a type with new members or interfaces. It adds rather than deletes members, and it is not a pointcut designator."
        },
        {
          id: 175,
          question: "AOP primarily complements OOP by addressing what?",
          options: [
            "Object construction order",
            "Garbage collection tuning",
            "Cross-cutting concerns that span many modules",
            "Compiler optimisation flags"
          ],
          correct: [2],
          reasoning: "AOP targets concerns that cut across many classes (logging, security, transactions) — something plain OOP scatters and tangles. Construction order, GC and compiler flags are unrelated."
        }
      ]
    },
    /* ============================ LECTURE 08 ============================ */
    {
      id: "lec08",
      group: "Semantic Web",
      title: "08 · RDF (Resource Description Framework)",
      questions: [
        {
          id: 176,
          question: "What are the three components of an RDF triple?",
          options: [
            "Verb tense",
            "Subject",
            "Predicate",
            "Object"
          ],
          correct: [1, 2, 3],
          reasoning: "An RDF triple is subject–predicate–object (resource – property – value). 'Verb tense' is a grammar notion, not part of RDF."
        },
        {
          id: 177,
          question: "A single RDF statement is called a what?",
          options: [
            "A 4-tuple",
            "A pair",
            "A quad",
            "A triple"
          ],
          correct: [3],
          reasoning: "RDF statements are triples (subject, predicate, object). Quads add a named-graph component but the basic statement is a triple."
        },
        {
          id: 178,
          question: "Which statements about how RDF identifies things are correct?",
          options: [
            "Resources are identified with URIs/IRIs",
            "A resource can appear as a triple's subject or object",
            "Resources may only be integers",
            "Resources may only be local file paths"
          ],
          correct: [0, 1],
          reasoning: "RDF names resources with URIs/IRIs, and a resource can be the subject or object of triples. They are not restricted to integers or file paths."
        },
        {
          id: 179,
          question: "Which of these is a valid RDF serialization format?",
          options: [
            "INI",
            "CSV",
            "Turtle",
            "YAML"
          ],
          correct: [2],
          reasoning: "Turtle is a standard RDF serialization (alongside RDF/XML, N-Triples, JSON-LD). INI, CSV and YAML are not RDF serializations."
        },
        {
          id: 180,
          question: "Which of these are RDF serialization formats?",
          options: [
            "RDF/XML",
            "Markdown",
            "Turtle",
            "N-Triples"
          ],
          correct: [0, 2, 3],
          reasoning: "RDF/XML, Turtle and N-Triples (plus JSON-LD, N3) serialize RDF. Markdown is a lightweight document markup language, not an RDF format."
        },
        {
          id: 181,
          question: "Which statements about rdf:type and rdfs:subClassOf are correct?",
          options: [
            "rdf:type relates an instance to the class it belongs to",
            "rdfs:subClassOf relates a class to a more general class",
            "rdf:type asserts two individuals are equal",
            "rdfs:subClassOf merges two RDF graphs into one file"
          ],
          correct: [0, 1],
          reasoning: "rdf:type links an individual to its class; rdfs:subClassOf links a class to a superclass. Equality of individuals is owl:sameAs, and subClassOf does not merge files."
        },
        {
          id: 182,
          question: "Is it possible to include subqueries in a SPARQL query?",
          options: [
            "No, never",
            "Only in a pre-1.0 draft",
            "Only when querying CSV data",
            "Yes"
          ],
          correct: [3],
          reasoning: "Yes — SPARQL 1.1 supports nested SELECT subqueries, evaluated bottom-up and projecting results into the outer query. This enables aggregation and limiting within a pattern."
        },
        {
          id: 183,
          question: "Which of these are SPARQL query forms?",
          options: [
            "COMPILE",
            "SELECT",
            "ASK",
            "CONSTRUCT"
          ],
          correct: [1, 2, 3],
          reasoning: "SPARQL's four query forms are SELECT, ASK, CONSTRUCT and DESCRIBE. 'COMPILE' is not a query form."
        },
        {
          id: 184,
          question: "Which statements about blank nodes and literals are correct?",
          options: [
            "A blank node is an anonymous resource without a global IRI",
            "A literal is a value such as a string or number",
            "A blank node is always a full HTTP URI",
            "A literal can be the subject of a triple"
          ],
          correct: [0, 1],
          reasoning: "Blank nodes are anonymous (no IRI), and literals are data values. A blank node is not a URI, and a literal may only be an object — never the subject — of a triple."
        },
        {
          id: 185,
          question: "What may the OBJECT of an RDF triple be?",
          options: [
            "Only a literal",
            "Only a URI",
            "A URI, a blank node, or a literal",
            "Only an integer"
          ],
          correct: [2],
          reasoning: "An object can be a URI/IRI, a blank node, or a literal. The subject, by contrast, may only be a URI or blank node."
        },
        {
          id: 186,
          question: "Which statements about an RDF graph are correct?",
          options: [
            "It is a set of triples",
            "It is fundamentally a relational table",
            "It can be viewed as a directed, labeled graph",
            "Its nodes are the subjects and objects of triples"
          ],
          correct: [0, 2, 3],
          reasoning: "An RDF graph is a set of triples forming a directed, labeled graph whose nodes are subjects/objects and whose edges are predicates. It is not a relational table."
        },
        {
          id: 187,
          question: "Which of these does RDF Schema (RDFS) provide?",
          options: [
            "rdfs:subClassOf",
            "rdfs:domain and rdfs:range",
            "SQL JOIN clauses",
            "AOP pointcuts"
          ],
          correct: [0, 1],
          reasoning: "RDFS adds vocabulary such as rdfs:Class, rdfs:subClassOf, rdfs:domain and rdfs:range. SQL joins and AOP pointcuts come from entirely different technologies."
        },
        {
          id: 188,
          question: "What may the SUBJECT of an RDF triple be?",
          options: [
            "Only a literal",
            "Only an integer",
            "Any data value",
            "A URI or a blank node (not a literal)"
          ],
          correct: [3],
          reasoning: "A triple's subject must be a URI/IRI or a blank node; literals are not allowed as subjects in RDF."
        },
        {
          id: 189,
          question: "Which statements about SPARQL are correct?",
          options: [
            "It matches graph patterns made of triple patterns",
            "Variables are written with a leading ? (or $)",
            "It is a language for building graphical user interfaces",
            "It can only query XML documents"
          ],
          correct: [0, 1],
          reasoning: "SPARQL queries RDF by matching triple/graph patterns and binds variables marked with ? or $. It is a query language, not a GUI toolkit, and it queries RDF graphs rather than only XML."
        },
        {
          id: 190,
          question: "What is a namespace prefix such as foaf: used for?",
          options: [
            "To run a query",
            "To delete triples",
            "To abbreviate long IRIs",
            "To compile RDF to bytecode"
          ],
          correct: [2],
          reasoning: "Prefixes are shorthand for long namespace IRIs (e.g. foaf: → http://xmlns.com/foaf/0.1/), keeping serializations readable. They neither run queries nor compile anything."
        },
        {
          id: 191,
          question: "Which of these are well-known RDF(S) vocabularies?",
          options: [
            "JUnit",
            "FOAF",
            "Dublin Core",
            "RDFS"
          ],
          correct: [1, 2, 3],
          reasoning: "FOAF, Dublin Core and RDFS are common RDF vocabularies. JUnit is a Java testing framework."
        },
        {
          id: 192,
          question: "In the triple ex:Alice foaf:knows ex:Bob, which statements are correct?",
          options: [
            "ex:Alice is the subject",
            "foaf:knows is the predicate",
            "ex:Bob is the predicate",
            "foaf:knows is the object"
          ],
          correct: [0, 1],
          reasoning: "ex:Alice is the subject, foaf:knows is the predicate (property) and ex:Bob is the object. The last two options mislabel the roles."
        },
        {
          id: 193,
          question: "What does IRI stand for?",
          options: [
            "Indexed Resource Item",
            "Internal Reference Identifier",
            "Interface Resource Index",
            "Internationalized Resource Identifier"
          ],
          correct: [3],
          reasoning: "IRI = Internationalized Resource Identifier, a generalisation of URIs that allows non-ASCII (Unicode) characters."
        },
        {
          id: 194,
          question: "Which statements about the RDF data model are correct?",
          options: [
            "It is graph-based",
            "It is strictly tabular with fixed columns",
            "It is schema-flexible (no fixed schema is required up front)",
            "Every resource must have the same fixed set of properties"
          ],
          correct: [0, 2],
          reasoning: "RDF is a flexible, graph-based model where different resources can have different properties. It is not a rigid table with mandatory uniform columns."
        },
        {
          id: 195,
          question: "Which language is used to query RDF data?",
          options: [
            "SQL",
            "XPath",
            "Cypher",
            "SPARQL"
          ],
          correct: [3],
          reasoning: "SPARQL is the W3C query language for RDF. SQL queries relational databases, XPath navigates XML, and Cypher queries property graphs (Neo4j)."
        },
        {
          id: 196,
          question: "Which of these are SPARQL solution modifiers?",
          options: [
            "GROUP JOIN",
            "ORDER BY",
            "LIMIT",
            "OFFSET"
          ],
          correct: [1, 2, 3],
          reasoning: "ORDER BY, LIMIT, OFFSET (and DISTINCT, GROUP BY) shape the solution set. 'GROUP JOIN' is not a SPARQL construct."
        },
        {
          id: 197,
          question: "Which statements about FILTER and OPTIONAL in SPARQL are correct?",
          options: [
            "FILTER restricts results to those satisfying a condition",
            "OPTIONAL allows a pattern to match optionally (left-join semantics)",
            "FILTER permanently deletes triples from the store",
            "OPTIONAL patterns are mandatory and must match"
          ],
          correct: [0, 1],
          reasoning: "FILTER keeps only bindings meeting a boolean condition; OPTIONAL adds bindings when present but does not fail if absent (like a left join). FILTER does not delete data, and OPTIONAL is by definition not mandatory."
        },
        {
          id: 198,
          question: "In Turtle syntax, which token terminates a triple statement?",
          options: [
            ",",
            ";",
            ".",
            "|"
          ],
          correct: [2],
          reasoning: "A full stop '.' ends a statement in Turtle. ';' reuses the subject for another predicate, and ',' reuses subject+predicate for another object."
        },
        {
          id: 199,
          question: "Which statements about rdfs:label and rdfs:comment are correct?",
          options: [
            "rdfs:label provides a human-readable name for a resource",
            "They enforce cardinality constraints",
            "They are SPARQL query forms",
            "rdfs:comment provides a human-readable description"
          ],
          correct: [0, 3],
          reasoning: "rdfs:label and rdfs:comment supply human-readable annotations (name and description). They do not enforce constraints (that is SHACL/OWL) and are not query forms."
        },
        {
          id: 200,
          question: "RDF is a W3C standard intended for which of these?",
          options: [
            "Compiling Java programs",
            "Describing resources",
            "Interchanging data on the web",
            "Providing machine-readable metadata"
          ],
          correct: [1, 2, 3],
          reasoning: "RDF is the W3C framework for describing resources, exchanging data on the web and expressing machine-readable metadata. Compiling Java is unrelated."
        }
      ]
    },
    /* ============================ LECTURE 09 ============================ */
    {
      id: "lec09",
      group: "Semantic Web",
      title: "09 · Semantic Knowledge Modeling / OWL2",
      questions: [
        {
          id: 201,
          question: "Which statements about OWL's foundations are correct?",
          options: [
            "OWL builds on top of RDF",
            "OWL builds on top of RDF Schema (RDFS)",
            "OWL is completely unrelated to RDF",
            "OWL replaces HTML for page layout"
          ],
          correct: [0, 1],
          reasoning: "OWL layers richer semantics on top of RDF and RDFS. It is firmly based on RDF, and it has nothing to do with page layout."
        },
        {
          id: 202,
          question: "What does OWL stand for?",
          options: [
            "Online Web Language",
            "Open Workflow Language",
            "Web Ontology Language",
            "Object Wrapper Library"
          ],
          correct: [2],
          reasoning: "OWL = Web Ontology Language, the W3C standard for authoring ontologies on the Semantic Web."
        },
        {
          id: 203,
          question: "Which of these are kinds of OWL properties?",
          options: [
            "Object property",
            "Join property",
            "Datatype property",
            "Annotation property"
          ],
          correct: [0, 2, 3],
          reasoning: "OWL distinguishes object properties (individual→individual), datatype properties (individual→literal) and annotation properties (metadata). 'Join property' is not an OWL concept."
        },
        {
          id: 204,
          question: "What does owl:sameAs assert?",
          options: [
            "That one class is a subclass of another",
            "That a property is transitive",
            "That two classes are disjoint",
            "That two individuals denote the same thing"
          ],
          correct: [3],
          reasoning: "owl:sameAs states that two individual names refer to the same real-world entity. Subclassing, transitivity and disjointness are expressed by other constructs."
        },
        {
          id: 205,
          question: "Which statements about owl:equivalentClass and owl:disjointWith are correct?",
          options: [
            "owl:equivalentClass says two classes have exactly the same members",
            "owl:disjointWith says two classes share no members",
            "owl:equivalentClass only means one is a subclass of the other",
            "owl:disjointWith merges two classes into one"
          ],
          correct: [0, 1],
          reasoning: "Equivalent classes have identical extensions; disjoint classes cannot share an individual. Equivalence is stronger than one-way subclassing, and disjointness separates rather than merges classes."
        },
        {
          id: 206,
          question: "Which of these are OWL property characteristics?",
          options: [
            "Transitive",
            "Symmetric",
            "Functional",
            "Recursive"
          ],
          correct: [0, 1, 2],
          reasoning: "OWL property characteristics include transitive, symmetric, functional, inverse-functional, reflexive and irreflexive. 'Recursive' is not one of them."
        },
        {
          id: 207,
          question: "Which assumption does OWL adopt about unstated facts?",
          options: [
            "Closed World Assumption",
            "It makes no logical assumptions",
            "Everything unstated is false",
            "Open World Assumption"
          ],
          correct: [3],
          reasoning: "OWL uses the Open World Assumption: what is not stated is unknown, not false. (By default it also does not assume unique names.)"
        },
        {
          id: 208,
          question: "Which statements about object vs datatype properties are correct?",
          options: [
            "An object property links one individual to another individual",
            "A datatype property links an individual to a literal value",
            "An object property links an individual to a plain string literal",
            "A datatype property links two classes together"
          ],
          correct: [0, 1],
          reasoning: "Object properties relate individuals to individuals; datatype properties relate an individual to a literal (string, number, date). They do not link to literals/classes the way the false options claim."
        },
        {
          id: 209,
          question: "Which of these is a real OWL2 profile?",
          options: [
            "OWL2 SQL",
            "OWL2 HTML",
            "OWL2 EL",
            "OWL2 CSS"
          ],
          correct: [2],
          reasoning: "The OWL2 profiles are EL, QL and RL — each trading expressivity for computational guarantees. SQL/HTML/CSS are unrelated technologies."
        },
        {
          id: 210,
          question: "Which of these are OWL2 profiles?",
          options: [
            "OWL2 XL",
            "OWL2 EL",
            "OWL2 QL",
            "OWL2 RL"
          ],
          correct: [1, 2, 3],
          reasoning: "OWL2 defines three profiles: EL (large terminologies), QL (query/database), and RL (rule-based reasoning). There is no 'OWL2 XL'."
        },
        {
          id: 211,
          question: "Which statements about OWL restrictions are correct?",
          options: [
            "owl:Restriction defines an anonymous class via constraints on a property",
            "owl:allValuesFrom means a cardinality of exactly zero",
            "A restriction is a kind of XSD datatype",
            "owl:someValuesFrom expresses an existential constraint"
          ],
          correct: [0, 3],
          reasoning: "An owl:Restriction defines an anonymous class by constraining a property; someValuesFrom is existential (∃). allValuesFrom is the universal (∀) restriction, not zero cardinality, and a restriction is not a datatype."
        },
        {
          id: 212,
          question: "owl:someValuesFrom corresponds to which description-logic quantifier?",
          options: [
            "Universal (∀)",
            "Negation (¬)",
            "Existential (∃)",
            "Conjunction (∧)"
          ],
          correct: [2],
          reasoning: "someValuesFrom is the existential quantifier ∃ — at least one value of the property comes from the given class. The universal ∀ is allValuesFrom."
        },
        {
          id: 213,
          question: "Which statements about owl:allValuesFrom are correct?",
          options: [
            "It is a universal (∀) restriction",
            "It constrains all values of a property to be from a given class",
            "It is an existential (∃) restriction",
            "It sets an exact cardinality of one"
          ],
          correct: [0, 1],
          reasoning: "allValuesFrom is the universal restriction: every value of the property (if any) must come from the named class. It is not existential, nor a cardinality constraint."
        },
        {
          id: 214,
          question: "What does declaring a property 'functional' mean?",
          options: [
            "The property must always have at least one value",
            "The property is transitive",
            "The property is symmetric",
            "Each individual has at most one value for that property"
          ],
          correct: [3],
          reasoning: "A functional property maps each subject to at most one value (like a function). It does not force a minimum, nor imply transitivity or symmetry."
        },
        {
          id: 215,
          question: "Which of these can an OWL reasoner do?",
          options: [
            "Infer implicit subclass relationships",
            "Detect logical inconsistencies in the ontology",
            "Classify individuals under the classes they satisfy",
            "Compile the ontology into JVM bytecode"
          ],
          correct: [0, 1, 2],
          reasoning: "Reasoners perform classification, consistency checking and instance inference. Compiling to bytecode is not a reasoning task."
        },
        {
          id: 216,
          question: "Which statements about TBox vs ABox are correct?",
          options: [
            "The TBox holds terminological knowledge (classes and properties)",
            "The TBox is the SPARQL query engine",
            "The ABox is just the file serialization format",
            "The ABox holds assertional knowledge (individuals and facts)"
          ],
          correct: [0, 3],
          reasoning: "A knowledge base splits into the TBox (concept/role definitions) and the ABox (individual assertions). Neither is a query engine or a serialization format."
        },
        {
          id: 217,
          question: "What does owl:inverseOf relate?",
          options: [
            "Two classes as equivalent",
            "An individual to a literal",
            "Two properties as inverses of each other",
            "A class to its instances"
          ],
          correct: [2],
          reasoning: "owl:inverseOf states that one property is the inverse of another (e.g. hasParent inverseOf hasChild). It relates properties, not classes or individuals."
        },
        {
          id: 218,
          question: "Which of these are OWL class constructors (class expressions)?",
          options: [
            "owl:joinOf",
            "owl:intersectionOf",
            "owl:unionOf",
            "owl:complementOf"
          ],
          correct: [1, 2, 3],
          reasoning: "OWL builds complex classes with intersectionOf (AND), unionOf (OR) and complementOf (NOT). There is no 'owl:joinOf'."
        },
        {
          id: 219,
          question: "Which statements about owl:disjointWith are correct?",
          options: [
            "An individual cannot be a member of both disjoint classes",
            "It is useful for consistency checking",
            "It means the two classes are equivalent",
            "It is identical to rdfs:subClassOf"
          ],
          correct: [0, 1],
          reasoning: "Disjointness forbids shared members and helps detect inconsistencies. It is the opposite of equivalence and is not the same as subclassing."
        },
        {
          id: 220,
          question: "Which statement best characterises a symmetric property?",
          options: [
            "Each subject has at most one value",
            "P(a,b) and P(b,c) imply P(a,c)",
            "The property has no values at all",
            "If P(a,b) holds then P(b,a) must also hold"
          ],
          correct: [3],
          reasoning: "Symmetry means P(a,b) ⇒ P(b,a) (e.g. 'isSiblingOf'). At-most-one is functional, and P(a,b)∧P(b,c)⇒P(a,c) is transitivity."
        },
        {
          id: 221,
          question: "Which statements about OWL individuals are correct?",
          options: [
            "They are instances of classes",
            "They live in the ABox of the knowledge base",
            "They are exactly the same thing as classes",
            "They must always be literal values"
          ],
          correct: [0, 1],
          reasoning: "Individuals are class instances and belong to the ABox. They are distinct from classes (the TBox) and are not literals."
        },
        {
          id: 222,
          question: "OWL2 DL is grounded in which formal foundation?",
          options: [
            "First-order arithmetic",
            "Regular expressions",
            "Description Logics",
            "Relational algebra"
          ],
          correct: [2],
          reasoning: "OWL2 DL corresponds to an expressive Description Logic (SROIQ), giving it decidable, well-defined reasoning. The others are different formalisms."
        },
        {
          id: 223,
          question: "Which features did OWL2 add over OWL1?",
          options: [
            "CSS styling rules",
            "Qualified cardinality restrictions",
            "Property chains",
            "Keys (owl:hasKey)"
          ],
          correct: [1, 2, 3],
          reasoning: "OWL2 introduced qualified cardinality, property chain axioms and keys (among others). CSS styling is unrelated to ontologies."
        },
        {
          id: 224,
          question: "Which statements about owl:Thing and owl:Nothing are correct?",
          options: [
            "owl:Thing is the top class containing every individual",
            "owl:Nothing is the empty class with no members",
            "owl:Thing is the empty class",
            "owl:Nothing contains every individual"
          ],
          correct: [0, 1],
          reasoning: "owl:Thing is the universal superclass (every individual is a Thing) and owl:Nothing is the empty class. The last two options swap their meanings."
        },
        {
          id: 225,
          question: "Which single statement best describes an ontology?",
          options: [
            "A relational database schema",
            "A compiled Java program",
            "A network routing table",
            "A shared, formal specification of a conceptualization (vocabulary plus relationships)"
          ],
          correct: [3],
          reasoning: "An ontology is a formal, shared model of a domain: concepts, properties and the relationships among them. It is not a DB schema, a program, or a routing table."
        }
      ]
    },
    /* ============================ LECTURE 10 ============================ */
    {
      id: "lec10",
      group: "Semantic Web",
      title: "10 · Publishing Resources & SKOS",
      questions: [
        {
          id: 226,
          question: "Which of these are Linked Data principles (Berners-Lee)?",
          options: [
            "Use URIs as names for things",
            "Use FTP file transfer only",
            "Use HTTP URIs so names can be looked up",
            "When a URI is looked up, provide useful information using standards (RDF, SPARQL)"
          ],
          correct: [0, 2, 3],
          reasoning: "The four Linked Data principles are: use URIs as names, use HTTP URIs, provide useful RDF/SPARQL information on lookup, and include links to other URIs. FTP-only contradicts the HTTP principle."
        },
        {
          id: 227,
          question: "What does SKOS stand for?",
          options: [
            "Structured Key Ontology Syntax",
            "Shared Knowledge Object Store",
            "Simple Knowledge Organization System",
            "Semantic Key-Object Schema"
          ],
          correct: [2],
          reasoning: "SKOS = Simple Knowledge Organization System, a W3C vocabulary for thesauri, taxonomies and classification schemes."
        },
        {
          id: 228,
          question: "Which statements about skos:broader and skos:narrower are correct?",
          options: [
            "skos:broader links a concept to a more general concept",
            "skos:narrower links a concept to a more specific concept (inverse of broader)",
            "skos:broader means the two concepts are equivalent",
            "skos:narrower deletes a concept from the scheme"
          ],
          correct: [0, 1],
          reasoning: "broader/narrower form the hierarchy: broader points to a more general concept, narrower to a more specific one, and they are inverses. They express neither equivalence nor deletion."
        },
        {
          id: 229,
          question: "Which property gives the preferred label of a SKOS concept?",
          options: [
            "skos:notation",
            "skos:altLabel",
            "skos:hiddenLabel",
            "skos:prefLabel"
          ],
          correct: [3],
          reasoning: "skos:prefLabel is the preferred human-readable label (one per language). altLabel holds synonyms, hiddenLabel aids search, and notation is a code in a notation system."
        },
        {
          id: 230,
          question: "Which of these are SKOS labelling properties?",
          options: [
            "skos:prefLabel",
            "skos:altLabel",
            "skos:hiddenLabel",
            "skos:codeLabel"
          ],
          correct: [0, 1, 2],
          reasoning: "SKOS lexical labels are prefLabel, altLabel and hiddenLabel. 'skos:codeLabel' does not exist (codes use skos:notation)."
        },
        {
          id: 231,
          question: "Which statements about skos:Concept and skos:ConceptScheme are correct?",
          options: [
            "A skos:Concept is a unit of thought (an idea/meaning)",
            "A skos:Concept is an RDF serialization format",
            "A skos:ConceptScheme is a SPARQL query form",
            "A skos:ConceptScheme groups concepts (e.g. a thesaurus or taxonomy)"
          ],
          correct: [0, 3],
          reasoning: "A Concept is a unit of thought; a ConceptScheme is an aggregation of concepts such as a thesaurus. Neither is a serialization format or a query form."
        },
        {
          id: 232,
          question: "Which property states that a concept is contained in a particular concept scheme?",
          options: [
            "skos:broader",
            "skos:related",
            "skos:inScheme",
            "skos:prefLabel"
          ],
          correct: [2],
          reasoning: "skos:inScheme links a concept to the ConceptScheme it belongs to. broader/related are semantic relations and prefLabel is a label."
        },
        {
          id: 233,
          question: "Which statements about skos:related are correct?",
          options: [
            "It is a hierarchical (broader/narrower) relation",
            "It expresses an associative (non-hierarchical) link between two concepts",
            "It means one concept is broader than the other",
            "It is a symmetric relation"
          ],
          correct: [1, 3],
          reasoning: "skos:related is a symmetric, associative link between concepts at the same level. It is explicitly non-hierarchical, unlike broader/narrower."
        },
        {
          id: 234,
          question: "In the 5-star Linked Open Data scheme, what does the fifth star require?",
          options: [
            "Publishing data as a scanned image",
            "Publishing data in a proprietary spreadsheet",
            "Publishing data as a PDF",
            "Linking your data to other people's data to provide context"
          ],
          correct: [3],
          reasoning: "The 5th star is achieved by linking your RDF to other datasets' URIs, embedding it in the web of data. Images/spreadsheets/PDFs are lower (1–2 star) formats."
        },
        {
          id: 235,
          question: "Which of these are benefits of publishing Linked Data?",
          options: [
            "Easier integration of data across different sources",
            "URIs that can be dereferenced to obtain machine-readable data",
            "Data that machines can interpret and combine",
            "A faster CPU clock speed"
          ],
          correct: [0, 1, 2],
          reasoning: "Linked Data improves cross-source integration, offers dereferenceable URIs and is machine-interpretable. CPU clock speed is a hardware matter, unrelated to data publishing."
        },
        {
          id: 236,
          question: "Which statements about HTTP content negotiation for dereferenceable URIs are correct?",
          options: [
            "A server can return HTML to browsers and RDF to agents based on the Accept header",
            "One URI can serve multiple representations of the same resource",
            "Each format strictly requires a completely different URI",
            "Content negotiation is impossible over HTTP"
          ],
          correct: [0, 1],
          reasoning: "Content negotiation lets a single URI return different representations (HTML, RDF/Turtle, JSON-LD) depending on the Accept header. It does not require separate URIs and is a standard HTTP feature."
        },
        {
          id: 237,
          question: "What is the HTTP Accept header used for in content negotiation?",
          options: [
            "To authenticate the user",
            "To set a cookie",
            "To indicate the client's preferred response representation/format",
            "To compress the response"
          ],
          correct: [2],
          reasoning: "Accept advertises the media types the client prefers (e.g. text/html vs application/rdf+xml), letting the server choose a representation. Auth, cookies and compression use other headers."
        },
        {
          id: 238,
          question: "Which statements about SKOS labels are correct?",
          options: [
            "A concept should have at most one skos:prefLabel per language",
            "skos:prefLabel must be a URI, not a literal",
            "skos:hiddenLabel is meant to be displayed prominently to users",
            "A concept may have many skos:altLabel values"
          ],
          correct: [0, 3],
          reasoning: "prefLabel is limited to one per language while altLabel (synonyms) may be many. Labels are literals (not URIs), and hiddenLabel is for matching/search, not display."
        },
        {
          id: 239,
          question: "What does skos:topConceptOf express?",
          options: [
            "That a concept has a preferred label",
            "That a concept is broader than another",
            "That a concept is related to another",
            "That a concept is a top-level concept of a given scheme"
          ],
          correct: [3],
          reasoning: "skos:topConceptOf marks a concept as an entry point (top concept) of a ConceptScheme (inverse of skos:hasTopConcept). The other options describe labels and other relations."
        },
        {
          id: 240,
          question: "Which of these are SKOS documentation/note properties?",
          options: [
            "skos:definition",
            "skos:scopeNote",
            "skos:example",
            "skos:sqlNote"
          ],
          correct: [0, 1, 2],
          reasoning: "SKOS documentation properties include definition, scopeNote, example, note, historyNote and editorialNote. 'skos:sqlNote' is invented."
        },
        {
          id: 241,
          question: "Which statements about modelling with SKOS are correct?",
          options: [
            "SKOS is a general-purpose programming language",
            "SKOS can represent taxonomies and thesauri",
            "skos:broader/narrower build the concept hierarchy",
            "SKOS replaces full OWL reasoning"
          ],
          correct: [1, 2],
          reasoning: "SKOS is designed for knowledge-organization systems like taxonomies and thesauri, with broader/narrower forming hierarchies. It is neither a programming language nor a substitute for OWL's logical reasoning."
        },
        {
          id: 242,
          question: "In the 'slash URI' strategy, which HTTP status code redirects a non-information resource to a document describing it?",
          options: [
            "200 OK",
            "301 Moved Permanently",
            "404 Not Found",
            "303 See Other"
          ],
          correct: [3],
          reasoning: "303 See Other redirects from a real-world (non-information) resource URI to a document that describes it, avoiding confusion between a thing and its description."
        },
        {
          id: 243,
          question: "Which statements about hash URIs vs slash URIs are correct?",
          options: [
            "Hash URIs identify resources using a # fragment",
            "Slash URIs typically use a 303 redirect to a describing document",
            "Hash URIs require a 303 redirect",
            "Slash URIs are forbidden by HTTP"
          ],
          correct: [0, 1],
          reasoning: "Hash URIs append a #fragment (the fragment is stripped before the HTTP request, so no extra redirect is needed); slash URIs commonly rely on a 303 redirect. Hash URIs do NOT need 303, and slash URIs are perfectly valid."
        },
        {
          id: 244,
          question: "What does skos:notation provide for a concept?",
          options: [
            "A preferred display label",
            "A hierarchical link to a broader concept",
            "A scheme membership statement",
            "A notation/code string from a formal notation system"
          ],
          correct: [3],
          reasoning: "skos:notation carries a typed string code (e.g. a classification number) identifying the concept within a notation system. Display labels use prefLabel and hierarchy uses broader."
        },
        {
          id: 245,
          question: "Which standards underpin Linked Data?",
          options: [
            "SMTP email transport",
            "URIs/IRIs",
            "HTTP",
            "RDF"
          ],
          correct: [1, 2, 3],
          reasoning: "Linked Data rests on URIs/IRIs (names), HTTP (lookup) and RDF (data model), queried with SPARQL. SMTP is an email protocol, not part of Linked Data."
        },
        {
          id: 246,
          question: "Which statements about skos:altLabel are correct?",
          options: [
            "It provides an alternative label (e.g. a synonym)",
            "It is the single preferred display label",
            "It is useful for search and synonym matching",
            "It expresses a broader/narrower hierarchy"
          ],
          correct: [0, 2],
          reasoning: "altLabel holds alternative names/synonyms helpful for search. The preferred display label is prefLabel, and hierarchy is expressed with broader/narrower."
        },
        {
          id: 247,
          question: "What does skos:broader point to?",
          options: [
            "A label literal",
            "A concept scheme",
            "A more general (broader) concept",
            "A SPARQL endpoint"
          ],
          correct: [2],
          reasoning: "skos:broader links a concept to a broader (more general) concept, building the upward hierarchy. It does not point to a label, scheme, or endpoint."
        },
        {
          id: 248,
          question: "Which statements about a dereferenceable URI are correct?",
          options: [
            "Looking it up over HTTP returns useful information (e.g. RDF)",
            "It should use the HTTP(S) scheme",
            "It must use the FTP scheme",
            "It must always return 404"
          ],
          correct: [0, 1],
          reasoning: "A dereferenceable URI yields useful data when resolved over HTTP(S). FTP and a guaranteed 404 would defeat dereferenceability."
        },
        {
          id: 249,
          question: "A skos:ConceptScheme most typically represents what?",
          options: [
            "A Java class",
            "An HTTP server",
            "A relational table",
            "A controlled vocabulary such as a thesaurus or taxonomy"
          ],
          correct: [3],
          reasoning: "A ConceptScheme aggregates related concepts into a controlled vocabulary (thesaurus, taxonomy, classification). It is none of the other software/data artifacts."
        },
        {
          id: 250,
          question: "Which of these are SKOS semantic (hierarchical/associative) relations?",
          options: [
            "skos:compiledWith",
            "skos:broader",
            "skos:narrower",
            "skos:related"
          ],
          correct: [1, 2, 3],
          reasoning: "skos:broader, skos:narrower (hierarchical) and skos:related (associative) are SKOS semantic relations. 'skos:compiledWith' is not a SKOS property."
        }
      ]
    },
    /* ============================ LECTURE 11 ============================ */
    {
      id: "lec11",
      group: "Semantic Web",
      title: "11 · SHACL (Shapes Constraint Language)",
      questions: [
        {
          id: 251,
          question: "What does SHACL stand for?",
          options: [
            "Shapes Constraint Language",
            "Shared Class Library",
            "Semantic Hyperlink Access Control",
            "Schema Annotation Convention Language"
          ],
          correct: [0],
          reasoning: "SHACL = Shapes Constraint Language, a W3C standard for validating RDF graphs against a set of conditions (shapes)."
        },
        {
          id: 252,
          question: "Which statements describe the purpose of SHACL?",
          options: [
            "It validates RDF data graphs against declared conditions",
            "It describes 'shapes' that data must conform to",
            "It is primarily a language for querying relational tables",
            "It compiles Java source code"
          ],
          correct: [0, 1],
          reasoning: "SHACL declares shapes (constraints) and checks whether an RDF graph conforms to them. It is not a relational query language or a compiler."
        },
        {
          id: 253,
          question: "Which of these are SHACL concepts?",
          options: [
            "sh:NodeShape",
            "sh:JoinShape",
            "sh:PropertyShape",
            "focus node"
          ],
          correct: [0, 2, 3],
          reasoning: "SHACL uses node shapes, property shapes and focus nodes (the nodes being validated). 'sh:JoinShape' does not exist."
        },
        {
          id: 254,
          question: "Which property declares the target class whose instances a shape validates?",
          options: [
            "sh:path",
            "sh:datatype",
            "sh:minCount",
            "sh:targetClass"
          ],
          correct: [3],
          reasoning: "sh:targetClass makes every instance of the named class a focus node for the shape. sh:path selects a property, while datatype/minCount are constraint components."
        },
        {
          id: 255,
          question: "Which statements about sh:minCount and sh:maxCount are correct?",
          options: [
            "sh:minCount restricts the datatype of values",
            "sh:minCount sets the minimum number of values a property must have",
            "sh:maxCount sets the maximum number of values allowed",
            "sh:maxCount declares the class of a node"
          ],
          correct: [1, 2],
          reasoning: "minCount/maxCount are cardinality constraints (how many values a property may have). Datatype restriction is sh:datatype and class membership is sh:class."
        },
        {
          id: 256,
          question: "Which SHACL constraint restricts the datatype of a property's literal values?",
          options: [
            "sh:class",
            "sh:nodeKind",
            "sh:datatype",
            "sh:minCount"
          ],
          correct: [2],
          reasoning: "sh:datatype requires values to be literals of a specific XSD datatype (e.g. xsd:string). sh:class checks class membership, sh:nodeKind checks IRI/literal/blank, and sh:minCount is cardinality."
        },
        {
          id: 257,
          question: "Which of these are SHACL Core constraint components?",
          options: [
            "sh:minCount",
            "sh:datatype",
            "sh:orderBy",
            "sh:pattern"
          ],
          correct: [0, 1, 3],
          reasoning: "minCount (cardinality), datatype, and pattern (regex) are SHACL Core constraints. 'sh:orderBy' is not a SHACL constraint."
        },
        {
          id: 258,
          question: "Which statements about NodeShape vs PropertyShape are correct?",
          options: [
            "A NodeShape declares constraints directly about a focus node",
            "A PropertyShape constrains the values reachable via an sh:path",
            "A PropertyShape never has an sh:path",
            "A NodeShape targets database columns"
          ],
          correct: [0, 1],
          reasoning: "A NodeShape constrains the focus node itself; a PropertyShape uses sh:path to target a property's values. PropertyShapes are defined BY their path, and SHACL targets RDF nodes, not columns."
        },
        {
          id: 259,
          question: "In which kind of SHACL shape is sh:path used?",
          options: [
            "A ConceptScheme",
            "A NodeShape only",
            "A ValidationReport",
            "A PropertyShape (to specify the property the constraints apply to)"
          ],
          correct: [3],
          reasoning: "sh:path appears in a PropertyShape to name the property whose values are being constrained. ConceptScheme is SKOS and ValidationReport is the output of validation."
        },
        {
          id: 260,
          question: "Which of these are ways to declare a shape's targets in SHACL?",
          options: [
            "sh:targetClass",
            "sh:targetNode",
            "sh:targetSubjectsOf",
            "sh:targetTable"
          ],
          correct: [0, 1, 2],
          reasoning: "Targets can be specified with sh:targetClass, sh:targetNode, sh:targetSubjectsOf and sh:targetObjectsOf. 'sh:targetTable' is not part of SHACL (there are no tables in RDF)."
        },
        {
          id: 261,
          question: "Which statements about a SHACL validation report are correct?",
          options: [
            "sh:conforms is the focus node that failed",
            "The report is expressed as a SQL result set",
            "sh:conforms is a boolean indicating whether the data conformed",
            "It contains sh:ValidationResult entries describing each violation"
          ],
          correct: [2, 3],
          reasoning: "A validation report carries sh:conforms (true/false) and, when false, one sh:ValidationResult per violation. The failing node is sh:focusNode (not sh:conforms), and the report is itself RDF, not SQL."
        },
        {
          id: 262,
          question: "Which property in a SHACL validation result identifies the node that failed validation?",
          options: [
            "sh:resultMessage",
            "sh:focusNode",
            "sh:resultSeverity",
            "sh:conforms"
          ],
          correct: [1],
          reasoning: "sh:focusNode points to the offending node. resultMessage describes the problem, resultSeverity gives its level, and conforms is the overall boolean."
        },
        {
          id: 263,
          question: "Which statements about SHACL severities are correct?",
          options: [
            "sh:Violation is the default severity",
            "sh:Fatal is the default severity",
            "sh:Warning and sh:Info are also available severities",
            "SHACL has no concept of severity"
          ],
          correct: [0, 2],
          reasoning: "SHACL severities are sh:Violation (default), sh:Warning and sh:Info. There is no sh:Fatal, and severity is very much part of SHACL."
        },
        {
          id: 264,
          question: "What does sh:closed = true mean for a shape?",
          options: [
            "The shape can never be validated",
            "The focus node must have no properties at all",
            "All values must be IRIs",
            "No properties other than those declared (or in sh:ignoredProperties) are allowed on the focus node"
          ],
          correct: [3],
          reasoning: "A closed shape forbids any property on the focus node beyond those covered by its property shapes (plus sh:ignoredProperties). It does not forbid all properties or constrain node kind."
        },
        {
          id: 265,
          question: "Which statements comparing SHACL and OWL are correct?",
          options: [
            "SHACL is oriented toward validating data against constraints",
            "OWL is oriented toward inference/entailment",
            "SHACL validation behaves more like closed-world constraint checking",
            "Both SHACL and OWL are page-styling languages"
          ],
          correct: [0, 1, 2],
          reasoning: "SHACL validates (closed-world-style constraint checking), whereas OWL infers new facts under the open-world assumption. Neither is a styling language."
        },
        {
          id: 266,
          question: "Which statements about sh:nodeKind are correct?",
          options: [
            "It restricts the kind of RDF term (e.g. sh:IRI, sh:Literal, sh:BlankNode)",
            "It sets the cardinality of a property",
            "It only ever allows integer values",
            "It can require values to be IRIs"
          ],
          correct: [0, 3],
          reasoning: "sh:nodeKind constrains whether a value must be an IRI, a literal, a blank node (or allowed combinations). Cardinality is minCount/maxCount, and it is not limited to integers."
        },
        {
          id: 267,
          question: "Which SHACL constraint validates string values against a regular expression?",
          options: [
            "sh:minCount",
            "sh:class",
            "sh:datatype",
            "sh:pattern"
          ],
          correct: [3],
          reasoning: "sh:pattern matches literal values against a regex (optionally with sh:flags). The others handle cardinality, class membership and datatype."
        },
        {
          id: 268,
          question: "Which statements about sh:class vs sh:datatype are correct?",
          options: [
            "sh:class requires each value to be an instance of a given class",
            "sh:datatype requires each value to be a literal of a given datatype",
            "sh:class is used for literal datatypes",
            "sh:datatype is used to check class membership"
          ],
          correct: [0, 1],
          reasoning: "sh:class checks that values are instances of a class (IRIs/resources); sh:datatype checks that values are literals of a datatype. The last two options swap their roles."
        },
        {
          id: 269,
          question: "What does sh:conforms indicate in a validation report?",
          options: [
            "The number of triples in the graph",
            "The IRI of the shapes graph",
            "Whether the data graph conformed to the shapes (true/false)",
            "The execution time of validation"
          ],
          correct: [2],
          reasoning: "sh:conforms is the boolean verdict: true if the data graph satisfied all shapes, false otherwise. It is not a count, an IRI, or a timing."
        },
        {
          id: 270,
          question: "Which of these can appear inside a sh:ValidationResult?",
          options: [
            "sh:sqlState",
            "sh:focusNode",
            "sh:resultPath",
            "sh:resultMessage"
          ],
          correct: [1, 2, 3],
          reasoning: "A validation result reports sh:focusNode, sh:resultPath, sh:resultMessage, sh:resultSeverity and the source constraint. 'sh:sqlState' is a JDBC concept, not SHACL."
        },
        {
          id: 271,
          question: "Which statements about the data graph vs the shapes graph are correct?",
          options: [
            "The data graph contains the RDF to be validated",
            "The shapes graph contains the shapes/constraints",
            "They must always be physically the same graph",
            "The shapes graph is a binary file format"
          ],
          correct: [0, 1],
          reasoning: "SHACL validation takes a data graph (the RDF under test) and a shapes graph (the constraints). They may be separate graphs, and the shapes graph is itself RDF, not binary."
        },
        {
          id: 272,
          question: "What does the sh:in constraint do?",
          options: [
            "Sets a minimum cardinality",
            "Requires a regular-expression match",
            "Requires a specific datatype",
            "Restricts a value to an enumerated list of allowed values"
          ],
          correct: [3],
          reasoning: "sh:in restricts values to a fixed enumeration (an allowed list). Cardinality, regex and datatype are handled by minCount, pattern and datatype respectively."
        },
        {
          id: 273,
          question: "Which statements about sh:minInclusive / sh:maxInclusive are correct?",
          options: [
            "They define inclusive lower/upper bounds on ordered (e.g. numeric) values",
            "They define a string regular expression",
            "They are used to validate that a value falls within a range",
            "They set the cardinality of a property"
          ],
          correct: [0, 2],
          reasoning: "minInclusive/maxInclusive bound ordered values inclusively (range checks). Regex is sh:pattern and cardinality is minCount/maxCount."
        },
        {
          id: 274,
          question: "In SHACL, which graph defines the constraints to validate against?",
          options: [
            "The data graph",
            "The default graph",
            "The named query graph",
            "The shapes graph"
          ],
          correct: [3],
          reasoning: "Constraints (shapes) live in the shapes graph; the data graph holds the instances being validated against it."
        },
        {
          id: 275,
          question: "Which of these are benefits of using SHACL?",
          options: [
            "Validating data quality/structure",
            "Producing machine-readable validation reports",
            "Documenting the expected shape of data",
            "Increasing the CPU clock speed"
          ],
          correct: [0, 1, 2],
          reasoning: "SHACL improves data quality, yields machine-readable reports (themselves RDF) and documents expected structure. CPU clock speed is unrelated."
        }
      ]
    },
    /* ============================ LECTURE 12 ============================ */
    {
      id: "lec12",
      group: "XML & Services",
      title: "12 · XML, Schema, DTD & WSDL",
      questions: [
        {
          id: 276,
          question: "What is WSDL?",
          options: [
            "A relational database query language",
            "A CSS styling framework",
            "A Java build tool",
            "An XML-based language for describing the interface of a web service"
          ],
          correct: [3],
          reasoning: "WSDL (Web Services Description Language) is an XML language that describes a web service: its operations, the messages they exchange, and how/where to invoke them. It is not a query language, stylesheet or build tool."
        },
        {
          id: 277,
          question: "Which of these are top-level WSDL elements?",
          options: [
            "<stylesheet>",
            "<message>",
            "<portType>",
            "<binding>"
          ],
          correct: [1, 2, 3],
          reasoning: "WSDL is built from <types>, <message>, <portType>, <binding>, <service> and <port>. '<stylesheet>' belongs to XSLT, not WSDL."
        },
        {
          id: 278,
          question: "Which tool generates Java (JAXB) classes from an XML Schema?",
          options: [
            "javac",
            "xjc",
            "jaxb-make",
            "mvn"
          ],
          correct: [1],
          reasoning: "xjc (the JAXB binding compiler) converts an XML Schema (XSD) into annotated Java classes. javac compiles Java, and mvn is a build tool."
        },
        {
          id: 279,
          question: "Which statements about well-formed vs valid XML are correct?",
          options: [
            "Well-formed XML obeys the basic XML syntax rules",
            "A valid document is, by definition, not well-formed",
            "Valid XML additionally conforms to a DTD or schema",
            "Being well-formed requires a schema to exist"
          ],
          correct: [0, 2],
          reasoning: "Well-formedness is correct XML syntax; validity adds conformance to a DTD/XSD. Every valid document is also well-formed, and well-formedness needs no schema."
        },
        {
          id: 280,
          question: "What does a WSDL <portType> describe?",
          options: [
            "The concrete network address of the service",
            "The SOAP wire format",
            "The database connection string",
            "The abstract set of operations the service offers"
          ],
          correct: [3],
          reasoning: "A <portType> is the abstract interface — the set of operations and their input/output messages. The concrete protocol/format is in <binding> and the address is in <port>/<service>."
        },
        {
          id: 281,
          question: "Which of these are features of XML Schema (XSD)?",
          options: [
            "Built-in and derived data types",
            "Namespace support",
            "complexType / simpleType definitions",
            "Stored procedures"
          ],
          correct: [0, 1, 2],
          reasoning: "XSD provides rich data typing, namespaces and complex/simple type definitions. Stored procedures are a relational-database feature, not part of XSD."
        },
        {
          id: 282,
          question: "Which statements about DTD vs XSD are correct?",
          options: [
            "Both can define the allowed structure of an XML document",
            "XSD supports data types and namespaces, while a DTD has much weaker typing",
            "A DTD is itself written in XML syntax",
            "XSD cannot declare elements"
          ],
          correct: [0, 1],
          reasoning: "Both constrain document structure, but XSD adds strong typing and namespace support that DTDs lack. A DTD uses its own non-XML syntax, and XSD certainly can declare elements."
        },
        {
          id: 283,
          question: "What does a WSDL <binding> specify?",
          options: [
            "The list of abstract operations only",
            "The human-readable documentation",
            "The database schema",
            "The concrete protocol and message format (e.g. SOAP) for a portType"
          ],
          correct: [3],
          reasoning: "<binding> ties an abstract <portType> to a concrete protocol and encoding (commonly SOAP over HTTP). The abstract operations live in <portType> itself."
        },
        {
          id: 284,
          question: "Which of these are parts of an XML document?",
          options: [
            "The prolog (e.g. <?xml version=\"1.0\"?>)",
            "Exactly one root element",
            "Attributes inside element start tags",
            "A SQL WHERE clause"
          ],
          correct: [0, 1, 2],
          reasoning: "An XML document has an optional prolog, a single root element and elements/attributes. A SQL WHERE clause is from relational databases, not XML."
        },
        {
          id: 285,
          question: "Which statements about JAXB marshalling/unmarshalling are correct?",
          options: [
            "Marshalling converts a Java object into XML",
            "Unmarshalling converts XML into a Java object",
            "Marshalling converts XML into a Java object",
            "JAXB compiles Java source into bytecode"
          ],
          correct: [0, 1],
          reasoning: "Marshalling = Java→XML; unmarshalling = XML→Java. The third option reverses marshalling, and bytecode compilation is javac's job, not JAXB's."
        },
        {
          id: 286,
          question: "Which language is used to select/navigate nodes within an XML document?",
          options: [
            "SQL",
            "DTD",
            "XPath",
            "WSDL"
          ],
          correct: [2],
          reasoning: "XPath addresses and navigates nodes in an XML tree (and underpins XSLT/XQuery). SQL queries relational data, while DTD and WSDL serve other purposes."
        },
        {
          id: 287,
          question: "Which statements about XML namespaces are correct?",
          options: [
            "They are the same thing as SQL schemas",
            "They are forbidden in XML Schema",
            "They avoid naming collisions between elements/attributes from different vocabularies",
            "They are declared using the xmlns attribute"
          ],
          correct: [2, 3],
          reasoning: "Namespaces (declared with xmlns) disambiguate elements/attributes drawn from different vocabularies. They are not SQL schemas and are heavily used by XSD."
        },
        {
          id: 288,
          question: "What does a WSDL <message> represent?",
          options: [
            "The concrete SOAP binding",
            "The network endpoint",
            "The stylesheet",
            "The abstract data exchanged by an operation (its input/output)"
          ],
          correct: [3],
          reasoning: "<message> defines the abstract data communicated (composed of parts), used as the input/output of operations. Binding/endpoint/stylesheet are different concerns."
        },
        {
          id: 289,
          question: "Which WSDL elements belong to the ABSTRACT part of the description?",
          options: [
            "<service>",
            "<types>",
            "<message>",
            "<portType>"
          ],
          correct: [1, 2, 3],
          reasoning: "The abstract part is <types>, <message> and <portType>; the concrete part is <binding>, <port> and <service>. So <service> is concrete, not abstract."
        },
        {
          id: 290,
          question: "Which statements about xjc and JAXB are correct?",
          options: [
            "xjc binds an XML Schema to generated Java classes",
            "The generated classes can be marshalled/unmarshalled to and from XML",
            "xjc compiles the classes directly into .class bytecode",
            "xjc is a relational database administration tool"
          ],
          correct: [0, 1],
          reasoning: "xjc generates JAXB-annotated Java source from an XSD; those classes support marshalling/unmarshalling. It emits source (not bytecode) and has nothing to do with databases."
        },
        {
          id: 291,
          question: "What does a WSDL <service> element do?",
          options: [
            "It defines the abstract operations",
            "It declares the XML data types",
            "It lists the messages",
            "It groups related ports (endpoints) where the service is available"
          ],
          correct: [3],
          reasoning: "<service> aggregates one or more <port> endpoints (each a binding at a network address). Operations, types and messages are defined elsewhere in the document."
        },
        {
          id: 292,
          question: "Which statements about XSLT are correct?",
          options: [
            "It transforms XML into other formats",
            "It is template-based",
            "It can output HTML, text or XML",
            "It executes SQL against a database"
          ],
          correct: [0, 1, 2],
          reasoning: "XSLT is a template-driven language that transforms XML into HTML, text or other XML. It does not execute SQL."
        },
        {
          id: 293,
          question: "Which statements about SOAP are correct?",
          options: [
            "It is an XML-based messaging protocol for web services",
            "It is a relational database engine",
            "It is commonly described using WSDL",
            "It is a CSS layout framework"
          ],
          correct: [0, 2],
          reasoning: "SOAP is an XML messaging protocol whose service contracts are described by WSDL. It is neither a database nor a styling framework."
        },
        {
          id: 294,
          question: "Which single statement about XML elements and attributes is correct?",
          options: [
            "Attributes can contain nested child elements",
            "An element may not contain other elements",
            "Attributes do not need to be inside any tag",
            "An attribute is a name=value pair written inside an element's start tag"
          ],
          correct: [3],
          reasoning: "Attributes are name=value pairs in a start tag and hold simple values only (no nested elements). Elements, by contrast, can nest other elements."
        },
        {
          id: 295,
          question: "Which of these are valid DTD declarations?",
          options: [
            "<!ELEMENT>",
            "<!ATTLIST>",
            "<!ENTITY>",
            "<!TABLE>"
          ],
          correct: [0, 1, 2],
          reasoning: "A DTD uses <!ELEMENT>, <!ATTLIST> and <!ENTITY> declarations. '<!TABLE>' is not a DTD construct."
        },
        {
          id: 296,
          question: "Which statements about well-formed XML rules are correct?",
          options: [
            "A document must have exactly one root element",
            "Attribute values may be left unquoted",
            "Elements are allowed to overlap (improper nesting)",
            "Element tags are case-sensitive and must be properly nested"
          ],
          correct: [0, 3],
          reasoning: "Well-formed XML has a single root and properly nested, case-sensitive tags. Attribute values MUST be quoted, and overlapping (improperly nested) elements are not allowed."
        },
        {
          id: 297,
          question: "Which WSDL element binds a single endpoint (an address for a binding)?",
          options: [
            "<message>",
            "<types>",
            "<portType>",
            "<port>"
          ],
          correct: [3],
          reasoning: "<port> defines a single endpoint by associating a <binding> with a concrete network address; <service> groups ports. <message>/<types>/<portType> are abstract definitions."
        },
        {
          id: 298,
          question: "Which statements about the WSDL <types> element are correct?",
          options: [
            "It contains executable Java code",
            "It defines the data types used by the service (often via XML Schema)",
            "It usually embeds an XSD schema",
            "It is the network endpoint of the service"
          ],
          correct: [1, 2],
          reasoning: "<types> declares the data types (normally with an embedded XSD) used in the messages. It contains schema, not Java code, and is not the endpoint (<port>)."
        },
        {
          id: 299,
          question: "What is the wsimport tool used for?",
          options: [
            "Compiling C++ programs",
            "Importing CSV files into a database",
            "Styling HTML pages",
            "Generating Java client/service artifacts from a WSDL document"
          ],
          correct: [3],
          reasoning: "wsimport reads a WSDL and generates the Java artifacts (stubs/service classes) needed to call or implement the service. The other options are unrelated tasks."
        },
        {
          id: 300,
          question: "Why is XML widely used for data interchange?",
          options: [
            "It is platform-independent",
            "It is self-describing",
            "It is human-readable text",
            "It is the fastest possible binary format"
          ],
          correct: [0, 1, 2],
          reasoning: "XML is platform-independent, self-describing and human-readable, which is why it became a lingua franca for data exchange. It is a verbose text format, not a compact binary one."
        }
      ]
    },
    /* ============================ LECTURE 13 ============================ */
    {
      id: "lec13",
      group: "XML & Services",
      title: "13 · Service-Oriented Architecture (SOA)",
      questions: [
        {
          id: 301,
          question: "Which of these are SOA design principles?",
          options: [
            "Tight coupling to implementations",
            "Loose coupling",
            "Service reusability",
            "Service autonomy"
          ],
          correct: [1, 2, 3],
          reasoning: "SOA promotes loose coupling, reusability and autonomy (among others). Tight coupling to implementations is the opposite of what SOA encourages."
        },
        {
          id: 302,
          question: "Which of these are also recognised SOA principles?",
          options: [
            "A standardized service contract",
            "Sharing internal source code with consumers",
            "Service abstraction",
            "Service discoverability"
          ],
          correct: [0, 2, 3],
          reasoning: "Standardized contract, abstraction and discoverability are core SOA principles. Exposing internal source code violates abstraction/encapsulation."
        },
        {
          id: 303,
          question: "Which statements about a 'service' in SOA are correct?",
          options: [
            "It is a self-contained unit of functionality",
            "It is accessed through a well-defined interface/contract",
            "It must let consumers read its internal database tables directly",
            "It can only ever be a single Java class"
          ],
          correct: [0, 1],
          reasoning: "A service is a self-contained capability exposed via a contract that hides its implementation. Sharing internal tables breaks loose coupling, and a service is a logical capability, not necessarily one class."
        },
        {
          id: 304,
          question: "What does SOA stand for?",
          options: [
            "Stateful Object Architecture",
            "Service Oriented Authentication",
            "Sequential Operation Algorithm",
            "Service-Oriented Architecture"
          ],
          correct: [3],
          reasoning: "SOA = Service-Oriented Architecture: structuring software as a set of interoperable, loosely coupled services."
        },
        {
          id: 305,
          question: "Which technologies form the classic web-services stack used with SOA?",
          options: [
            "SOAP",
            "WSDL",
            "UDDI",
            "JDBC"
          ],
          correct: [0, 1, 2],
          reasoning: "The classic stack is SOAP (messaging), WSDL (description) and UDDI (discovery). JDBC is a Java database-access API, not part of the web-services stack."
        },
        {
          id: 306,
          question: "Which statements about orchestration vs choreography are correct?",
          options: [
            "Orchestration uses a central coordinator that controls the overall flow",
            "Choreography has each service know its part with no central controller",
            "Orchestration has no coordinator at all",
            "Choreography always relies on a single central engine"
          ],
          correct: [0, 1],
          reasoning: "Orchestration centralises control in a coordinator (e.g. a BPEL engine); choreography is decentralised, each service reacting to messages. The last two options invert these definitions."
        },
        {
          id: 307,
          question: "Which of these are benefits of SOA?",
          options: [
            "Service reusability",
            "A guarantee of zero network latency",
            "Interoperability across heterogeneous platforms",
            "Loose coupling between components"
          ],
          correct: [0, 2, 3],
          reasoning: "SOA improves reuse, cross-platform interoperability and loose coupling. No architecture can guarantee zero latency — services still communicate over a network."
        },
        {
          id: 308,
          question: "Which statements about an Enterprise Service Bus (ESB) are correct?",
          options: [
            "It is primarily a front-end UI framework",
            "It is middleware that integrates and connects services",
            "It provides routing, message transformation and messaging",
            "It is a database index structure"
          ],
          correct: [1, 2],
          reasoning: "An ESB is integration middleware offering routing, transformation, protocol mediation and messaging between services. It is neither a UI framework nor a database index."
        },
        {
          id: 309,
          question: "Which language is commonly used to orchestrate web services into business processes?",
          options: [
            "SQL",
            "XSLT",
            "DTD",
            "BPEL"
          ],
          correct: [3],
          reasoning: "BPEL (Business Process Execution Language) orchestrates web services into executable business processes. SQL, XSLT and DTD serve unrelated purposes."
        },
        {
          id: 310,
          question: "Which statements describe loose coupling in SOA?",
          options: [
            "Services interact through contracts rather than implementations",
            "Dependencies between services are minimised",
            "Services can evolve independently of one another",
            "Services share global variables across processes"
          ],
          correct: [0, 1, 2],
          reasoning: "Loose coupling means interacting via stable contracts, minimal dependencies and independent evolution. Sharing global variables is the very opposite of loose coupling."
        },
        {
          id: 311,
          question: "Which statements about a service contract are correct?",
          options: [
            "It describes the service's operations and messages (e.g. via WSDL)",
            "It must expose the service's internal source code",
            "It is just a SQL table schema",
            "It lets consumers use the service without knowing its implementation"
          ],
          correct: [0, 3],
          reasoning: "A contract is the public description (operations, messages, policies) that decouples consumers from the implementation. It does not reveal source code and is not a SQL schema."
        },
        {
          id: 312,
          question: "Which of these are roles in the SOA web-services model?",
          options: [
            "Service compiler",
            "Service provider",
            "Service consumer (requester)",
            "Service registry"
          ],
          correct: [1, 2, 3],
          reasoning: "The SOA triangle is provider (publishes), registry (lists) and consumer/requester (finds and binds). There is no 'service compiler' role."
        },
        {
          id: 313,
          question: "Which statements about statelessness in SOA are correct?",
          options: [
            "Services should minimise the state they retain between requests",
            "Statelessness improves scalability",
            "It requires storing all session data only on the client device",
            "It means services may not return any data"
          ],
          correct: [0, 1],
          reasoning: "Minimising retained state makes services easier to scale and pool. It does not dictate where any necessary state lives, and stateless services certainly still return responses."
        },
        {
          id: 314,
          question: "Which statements contrasting SOA with a monolith are correct?",
          options: [
            "SOA decomposes functionality into separate services",
            "SOA always ships as a single, indivisible deployable binary",
            "SOA enables independent reuse of those services",
            "SOA supports heterogeneous platforms communicating via standards"
          ],
          correct: [0, 2, 3],
          reasoning: "SOA breaks a system into reusable services that interoperate across platforms via open standards. Shipping as one indivisible binary describes a monolith, not SOA."
        },
        {
          id: 315,
          question: "Which statements about discoverability and the registry are correct?",
          options: [
            "The registry compiles the services into machine code",
            "Providers publish service descriptions to a registry",
            "Consumers discover services by querying that registry",
            "The registry stores service metadata/descriptions"
          ],
          correct: [1, 2, 3],
          reasoning: "A registry holds published service metadata that consumers search to discover and bind to services. It does not compile anything."
        },
        {
          id: 316,
          question: "Which statements about service composability are correct?",
          options: [
            "Services can be composed into larger services or processes",
            "Composition supports building higher-level workflows",
            "Composability prevents any reuse of services",
            "Composition requires all services to be written in the same language"
          ],
          correct: [0, 1],
          reasoning: "Composability lets services be assembled into bigger services/workflows, encouraging reuse. It does not block reuse, and standards-based contracts make a shared language unnecessary."
        },
        {
          id: 317,
          question: "Which of these enable interoperability in SOA?",
          options: [
            "Open standards such as XML, SOAP and WSDL",
            "Proprietary vendor lock-in",
            "Platform independence",
            "Standardized service contracts"
          ],
          correct: [0, 2, 3],
          reasoning: "Open standards, platform independence and standardized contracts let heterogeneous systems interoperate. Vendor lock-in works against interoperability."
        },
        {
          id: 318,
          question: "Which middleware component routes and transforms messages between services?",
          options: [
            "A JPA EntityManager",
            "A DispatcherServlet",
            "A SPARQL endpoint",
            "An Enterprise Service Bus (ESB)"
          ],
          correct: [3],
          reasoning: "The ESB mediates between services — routing, transforming and adapting messages. The others are persistence, web-MVC and RDF-query components."
        },
        {
          id: 319,
          question: "Which statements comparing microservices and SOA are correct?",
          options: [
            "Both structure systems as collaborating services",
            "Microservices favour fine-grained, independently deployable services",
            "SOA forbids any kind of service reuse",
            "Microservices require a central ESB by definition"
          ],
          correct: [0, 1],
          reasoning: "Both are service-oriented, but microservices emphasise small, independently deployable units (often without a central ESB). SOA actively encourages reuse, so the last two options are false."
        },
        {
          id: 320,
          question: "Which statements about service autonomy and abstraction are correct?",
          options: [
            "A service publishes its internal database schema to all clients",
            "A service controls its own logic and resources",
            "A service hides its implementation details",
            "A service exposes only its contract to consumers"
          ],
          correct: [1, 2, 3],
          reasoning: "Autonomy and abstraction mean a service governs its own logic/resources and exposes only a contract, hiding internals. Publishing the internal schema would break abstraction."
        },
        {
          id: 321,
          question: "Which statements about contract-first development are correct?",
          options: [
            "The service interface (e.g. WSDL) is defined before the implementation",
            "It means writing all the code before any contract exists",
            "It promotes interoperability and stable contracts",
            "It is identical to having no contract at all"
          ],
          correct: [0, 2],
          reasoning: "Contract-first designs the WSDL/interface up front, improving interoperability and consumer stability. It is the opposite of code-first or no-contract approaches."
        },
        {
          id: 322,
          question: "Which of these are typical SOA governance concerns?",
          options: [
            "Choosing the website's fonts",
            "Service versioning",
            "Security policies",
            "Monitoring and SLAs"
          ],
          correct: [1, 2, 3],
          reasoning: "SOA governance deals with versioning, security/policy enforcement and monitoring/SLAs. Font selection is a visual-design concern, not SOA governance."
        },
        {
          id: 323,
          question: "Which SOA component publishes service descriptions so they can be discovered?",
          options: [
            "The service consumer",
            "The ESB router",
            "The orchestration engine",
            "The service registry"
          ],
          correct: [3],
          reasoning: "The service registry stores and exposes published descriptions for discovery. The consumer finds services, while the ESB and orchestration engine handle integration and process flow."
        },
        {
          id: 324,
          question: "Which statements about message-oriented communication in SOA are correct?",
          options: [
            "Services exchange messages (often XML-based)",
            "It enables asynchronous, decoupled integration",
            "It requires services to share the same memory space",
            "It supports only synchronous calls"
          ],
          correct: [0, 1],
          reasoning: "Messaging lets services communicate via (often XML) messages, supporting asynchronous, decoupled integration. It does not need shared memory and is not restricted to synchronous calls."
        },
        {
          id: 325,
          question: "Which of these are common motivations for adopting SOA?",
          options: [
            "Aligning IT capabilities with business processes",
            "Reusing and integrating existing systems",
            "Integrating heterogeneous applications via standards",
            "Eliminating the need for any software testing"
          ],
          correct: [0, 1, 2],
          reasoning: "SOA aims to align IT with business, reuse existing assets and integrate heterogeneous systems through standards. It does not remove the need for testing."
        }
      ]
    },
    /* ============================ LECTURE 14 ============================ */
    {
      id: "lec14",
      group: "XML & Services",
      title: "14 · UDDI Specification",
      questions: [
        {
          id: 326,
          question: "What does UDDI stand for?",
          options: [
            "Unified Data Definition Interface",
            "Universal Document Distribution Index",
            "User-Driven Discovery Infrastructure",
            "Universal Description, Discovery and Integration"
          ],
          correct: [3],
          reasoning: "UDDI = Universal Description, Discovery and Integration: a specification for registries that let businesses publish and discover web services."
        },
        {
          id: 327,
          question: "Which of these are UDDI core data structures?",
          options: [
            "businessEntity",
            "businessService",
            "bindingTemplate",
            "businessCompiler"
          ],
          correct: [0, 1, 2],
          reasoning: "UDDI's data model is businessEntity, businessService, bindingTemplate and tModel. 'businessCompiler' is invented."
        },
        {
          id: 328,
          question: "In the UDDI 'pages' metaphor, which are the real categories?",
          options: [
            "Red pages",
            "White pages",
            "Yellow pages",
            "Green pages"
          ],
          correct: [1, 2, 3],
          reasoning: "UDDI is described as white pages (contact info), yellow pages (categorization) and green pages (technical/binding info). 'Red pages' is not a UDDI category."
        },
        {
          id: 329,
          question: "Which statements about the purpose of UDDI are correct?",
          options: [
            "It is a registry/directory for publishing and discovering web services",
            "It is a general-purpose programming language",
            "It enables service discovery by consumers",
            "It is a relational SQL database engine"
          ],
          correct: [0, 2],
          reasoning: "UDDI is a registry for publishing and finding services. It is neither a programming language nor a database engine."
        },
        {
          id: 330,
          question: "Which statements about UDDI's APIs are correct?",
          options: [
            "The Inquiry API is used to search/read registry entries",
            "The Publish API is used to register/update entries",
            "It exposes a CSS rendering API",
            "Access is SOAP-based"
          ],
          correct: [0, 1, 3],
          reasoning: "UDDI offers a SOAP-based Inquiry API (find/get) and Publish API (save/delete). There is no CSS rendering API in UDDI."
        },
        {
          id: 331,
          question: "Which statements about a UDDI tModel are correct?",
          options: [
            "It is a reusable technical specification / 'fingerprint'",
            "It stores users' login passwords",
            "It can reference an external WSDL interface",
            "It is used for categorization (taxonomies, namespaces)"
          ],
          correct: [0, 2, 3],
          reasoning: "A tModel is a reusable technical fingerprint that can point to a WSDL and supports categorization. It does not store passwords."
        },
        {
          id: 332,
          question: "Which statements about businessEntity vs businessService are correct?",
          options: [
            "businessEntity is a SOAP message envelope",
            "businessEntity describes the organisation/provider",
            "businessService describes a logical group of services the entity offers",
            "businessService is just another name for a tModel"
          ],
          correct: [1, 2],
          reasoning: "businessEntity is the provider/organisation; businessService is a logical grouping of services it offers. It is not a SOAP envelope, and businessService is distinct from tModel."
        },
        {
          id: 333,
          question: "Which WSDL-to-UDDI mappings are correct?",
          options: [
            "WSDL <message> → UDDI businessEntity",
            "WSDL <portType> → UDDI tModel",
            "WSDL <binding> → UDDI tModel",
            "WSDL <service> → UDDI businessService"
          ],
          correct: [1, 2, 3],
          reasoning: "portType and binding map to tModels, and a WSDL service maps to a UDDI businessService (with ports → bindingTemplates). A WSDL <message> does NOT map to businessEntity."
        },
        {
          id: 334,
          question: "Which statements about a bindingTemplate are correct?",
          options: [
            "It holds the technical information needed to access a service (e.g. the access point/endpoint)",
            "It is the white-pages contact entry",
            "It is a general-purpose programming language",
            "It references one or more tModels"
          ],
          correct: [0, 3],
          reasoning: "A bindingTemplate carries the access point and references the tModels describing how to invoke the service. It is not a contact entry or a language."
        },
        {
          id: 335,
          question: "What do the UDDI 'white pages' contain?",
          options: [
            "A business name",
            "Contact information",
            "A textual description of the business",
            "The service's compiled source code"
          ],
          correct: [0, 1, 2],
          reasoning: "White pages hold identifying/contact data: name, contacts and descriptions. They do not contain compiled source code."
        },
        {
          id: 336,
          question: "What do the UDDI 'yellow pages' provide?",
          options: [
            "Categorization by taxonomies (industry, product, location)",
            "Classification that supports browsing/searching by category",
            "Direct binary downloads of the service implementation",
            "A way to find businesses by their classifications"
          ],
          correct: [0, 1, 3],
          reasoning: "Yellow pages categorise businesses/services using standard taxonomies so consumers can search by classification. They do not host binary downloads."
        },
        {
          id: 337,
          question: "Which statements about the UDDI 'green pages' are correct?",
          options: [
            "They are marketing brochures",
            "They are CSS stylesheets",
            "They hold technical information on how to bind to and invoke a service",
            "They include binding templates and references to tModels"
          ],
          correct: [2, 3],
          reasoning: "Green pages contain the technical/binding details (bindingTemplates, tModel references) needed to invoke a service. They are neither brochures nor stylesheets."
        },
        {
          id: 338,
          question: "Which statements about UDDI's place in the web-services world are correct?",
          options: [
            "It is designed to work alongside SOAP",
            "It can reference services described with WSDL",
            "It is part of the classic web-services stack",
            "It replaces the TCP/IP protocol suite"
          ],
          correct: [0, 1, 2],
          reasoning: "UDDI complements SOAP and WSDL as the discovery layer of the web-services stack. It does not replace TCP/IP (a lower-level transport)."
        },
        {
          id: 339,
          question: "Which statements about public vs private UDDI registries are correct?",
          options: [
            "Public registries were once openly accessible on the internet",
            "UDDI registries cannot be kept private",
            "Registries store no metadata at all",
            "Private/internal registries can be used within a single enterprise"
          ],
          correct: [0, 3],
          reasoning: "UDDI was deployed both as public registries and as private intra-enterprise registries. Private deployment is possible, and registries exist precisely to store service metadata."
        },
        {
          id: 340,
          question: "Which UDDI structure references a reusable technical specification (often a WSDL interface)?",
          options: [
            "businessEntity",
            "businessService",
            "bindingTemplate",
            "tModel"
          ],
          correct: [3],
          reasoning: "The tModel captures a reusable technical fingerprint and typically references a WSDL portType/binding. The other structures describe the provider, service grouping and access point."
        },
        {
          id: 341,
          question: "Which statements describe service discovery via UDDI?",
          options: [
            "A consumer queries the registry to find a suitable service",
            "The consumer retrieves the service's bindingTemplate to learn how to invoke it",
            "The consumer then binds to and calls the provider",
            "The registry compiles the provider's code for the consumer"
          ],
          correct: [0, 1, 2],
          reasoning: "Discovery is: query the registry, obtain the binding details, then bind to and call the provider. The registry never compiles provider code."
        },
        {
          id: 342,
          question: "Which statements about businessService and bindingTemplate are correct?",
          options: [
            "A businessService is contained inside a bindingTemplate",
            "A businessService can contain one or more bindingTemplates",
            "A bindingTemplate provides the service's access point",
            "A bindingTemplate is the top-level UDDI entity"
          ],
          correct: [1, 2],
          reasoning: "A businessService groups bindingTemplates, each giving an access point. The containment is the other way round (service contains templates), and the top-level entity is businessEntity."
        },
        {
          id: 343,
          question: "Which mechanisms does UDDI use for classification/identification of entries?",
          options: [
            "categoryBag",
            "identifierBag",
            "stylesheetBag",
            "taxonomies/value sets"
          ],
          correct: [0, 1, 3],
          reasoning: "UDDI classifies and identifies entries using categoryBag, identifierBag and standard taxonomies/value sets. 'stylesheetBag' is invented."
        },
        {
          id: 344,
          question: "Which statements about the publish–find–bind triangle with UDDI are correct?",
          options: [
            "UDDI itself executes the service's business logic",
            "UDDI stores the service's runtime data rows",
            "The provider publishes its service to the UDDI registry",
            "The requester finds the service via UDDI and then binds to the provider"
          ],
          correct: [2, 3],
          reasoning: "In publish–find–bind, providers publish to UDDI and requesters find then bind directly to the provider. UDDI is a directory: it neither runs the service nor stores its application data."
        },
        {
          id: 345,
          question: "Which are legitimate uses of a UDDI tModel?",
          options: [
            "Representing a WSDL portType/binding interface",
            "Representing a namespace or taxonomy",
            "Serving as a technical fingerprint for compatibility",
            "Holding users' active login sessions"
          ],
          correct: [0, 1, 2],
          reasoning: "tModels represent interfaces (WSDL portType/binding), namespaces/taxonomies and technical fingerprints. They are not session stores."
        },
        {
          id: 346,
          question: "Which statements about a businessEntity are correct?",
          options: [
            "It can contain multiple businessServices",
            "It stores the actual executable service code",
            "It is a set of SQL tables",
            "It holds publisher/contact information"
          ],
          correct: [0, 3],
          reasoning: "A businessEntity describes a provider — its contact details and the businessServices it offers. It does not store executable code or SQL tables."
        },
        {
          id: 347,
          question: "Which statements about UDDI are historically/technically accurate?",
          options: [
            "UDDI is a front-end JavaScript framework",
            "UDDI is a specification for web-service registries",
            "It was designed for the SOAP/WSDL web-services stack",
            "The major public UDDI registries were eventually discontinued"
          ],
          correct: [1, 2, 3],
          reasoning: "UDDI is a registry specification built for the SOAP/WSDL stack; the big public registries (IBM, Microsoft, SAP) were shut down around 2006. It is not a JavaScript framework."
        },
        {
          id: 348,
          question: "Which statements about the Inquiry vs Publish APIs are correct?",
          options: [
            "The Inquiry API finds and reads registry entries",
            "The Publish API saves and deletes entries",
            "The Inquiry API is what deletes entries",
            "The Publish API can only read entries"
          ],
          correct: [0, 1],
          reasoning: "Inquiry reads/searches; Publish creates/updates/deletes. Deletion is a Publish operation, and Publish is not read-only."
        },
        {
          id: 349,
          question: "Which statements about the UDDI data hierarchy are correct?",
          options: [
            "A tModel contains the businessEntity",
            "businessEntity is the top-level structure",
            "businessService groups services under an entity",
            "bindingTemplate holds the technical access details"
          ],
          correct: [1, 2, 3],
          reasoning: "The hierarchy is businessEntity → businessService → bindingTemplate, with tModels referenced by bindingTemplates. A tModel does NOT contain the businessEntity."
        },
        {
          id: 350,
          question: "Which are benefits of a service registry such as UDDI?",
          options: [
            "It enables dynamic discovery of services",
            "It guarantees the services will never have downtime",
            "It acts as a central catalog of available services",
            "It decouples consumers from hard-coded endpoints"
          ],
          correct: [0, 2, 3],
          reasoning: "A registry supports dynamic discovery, centralises a catalog of services and removes hard-coded endpoint dependencies. It cannot guarantee zero downtime of the services themselves."
        }
      ]
    },
    /* ============================ LECTURE 15 ============================ */
    {
      id: "lec15",
      title: "Test",
      group: "Testownik",
      questions: [
        {
          id: 351,
          question: "In the GoF (Gang of Four) classification of design patterns by scope (Class scope vs Object scope), exactly one pattern is listed under BOTH scopes. Which pattern is it?",
          options: [
            "Bridge",
            "Adapter",
            "Factory Method",
            "Proxy"
          ],
          correct: [1],
          reasoning: "In the GoF scope table, Adapter is the single pattern listed under BOTH Class scope (class Adapter, via inheritance) and Object scope (object Adapter, via composition)."
        },
        {
          id: 352,
          question: "According to the GoF classification, which is the ONLY creational pattern that has Class scope (i.e. it defers object creation to subclasses via inheritance rather than to other objects)?",
          options: [
            "Abstract Factory",
            "Singleton",
            "Factory Method",
            "Prototype"
          ],
          correct: [2],
          reasoning: "Factory Method is the only creational pattern with Class scope — it defers instantiation to subclasses through inheritance rather than to another object."
        },
        {
          id: 353,
          question: "Which HTTP methods were already defined in HTTP/1.0 (i.e. were NOT introduced later in HTTP/1.1)? Select all that apply.",
          options: [
            "GET",
            "POST",
            "PUT",
            "HEAD",
            "PATCH",
            "DELETE"
          ],
          correct: [0, 1, 3],
          reasoning: "HTTP/1.0 already defined GET, POST and HEAD. PUT, DELETE and PATCH were added later (PUT/DELETE in HTTP/1.1, PATCH later still)."
        },
        {
          id: 354,
          question: "Among the REST architectural constraints discussed in the course, which one is explicitly OPTIONAL (a service may still be considered RESTful without satisfying it)?",
          options: [
            "Statelessness",
            "Uniform interface",
            "Code on demand",
            "Cacheability"
          ],
          correct: [2],
          reasoning: "Code on demand is the only REST constraint that is explicitly optional; a service is still RESTful without it. The others are mandatory."
        },
        {
          id: 355,
          question: "In Linked Data publishing, a client requests a generic (non-information) resource URI such as /id/john. The server uses content negotiation and redirects the client to a separate document URI (HTML or RDF). Which HTTP status code is used for this redirect?",
          options: [
            "200 OK",
            "301 Moved Permanently",
            "302 Found",
            "303 See Other"
          ],
          correct: [3],
          reasoning: "303 See Other is used so a non-information resource URI redirects the client to a separate document URI (the HTML or RDF representation)."
        },
        {
          id: 356,
          question: "By default, what is the scope of a Spring bean, and what does repeatedly calling getBean() for that bean return?",
          options: [
            "Prototype scope; a brand-new instance on every call",
            "Singleton scope; the same single instance on every call",
            "Request scope; one instance per HTTP request",
            "Singleton scope; but a new instance on every call"
          ],
          correct: [1],
          reasoning: "A Spring bean is singleton-scoped by default, so every getBean() call returns the same single shared instance."
        },
        {
          id: 357,
          question: "The @SpringBootApplication annotation is a convenience annotation that bundles together which of the following annotations? Select all that apply.",
          options: [
            "@Configuration",
            "@EnableAutoConfiguration",
            "@ComponentScan",
            "@RestController",
            "@EnableTransactionManagement"
          ],
          correct: [0, 1, 2],
          reasoning: "@SpringBootApplication bundles @Configuration, @EnableAutoConfiguration and @ComponentScan. @RestController and @EnableTransactionManagement are not included."
        },
        {
          id: 358,
          question: "During Spring bean initialization, which of the following describes the CORRECT order of steps?",
          options: [
            "populate properties (DI) -> BeanPostProcessor.postProcessBeforeInitialization -> custom init-method -> BeanPostProcessor.postProcessAfterInitialization",
            "custom init-method -> populate properties (DI) -> postProcessBeforeInitialization -> postProcessAfterInitialization",
            "postProcessBeforeInitialization -> populate properties (DI) -> custom init-method -> postProcessAfterInitialization",
            "populate properties (DI) -> custom init-method -> postProcessBeforeInitialization -> postProcessAfterInitialization"
          ],
          correct: [0],
          reasoning: "Order: populate properties (DI) → BeanPostProcessor.postProcessBeforeInitialization → custom init-method → BeanPostProcessor.postProcessAfterInitialization."
        },
        {
          id: 359,
          question: "Which Spring AOP advice type runs ONLY when the advised method completes successfully (and is skipped if the method exits by throwing an exception)?",
          options: [
            "after (finally)",
            "after-returning",
            "after-throwing",
            "around"
          ],
          correct: [1],
          reasoning: "after-returning advice runs only when the method completes successfully; it is skipped if the method throws."
        },
        {
          id: 360,
          question: "Which statement about aspect weaving is correct?",
          options: [
            "Spring AOP performs weaving at runtime (via proxies), whereas AspectJ supports compile-time, post-compile and load-time weaving but NOT runtime weaving",
            "Both Spring AOP and AspectJ weave aspects exclusively at compile time",
            "Spring AOP weaves at compile time using the ajc compiler, just like AspectJ",
            "AspectJ supports only runtime weaving, while Spring AOP supports compile-time weaving"
          ],
          correct: [0],
          reasoning: "Spring AOP weaves at runtime via proxies. AspectJ supports compile-time, post-compile and load-time weaving, but not runtime weaving."
        },
        {
          id: 361,
          question: "In proxy-based Spring AOP, a bean method calls another advised method of the SAME class directly through this (a self-invocation). What happens to the advice on the inner method?",
          options: [
            "The advice is still applied, because Spring rewrites the bytecode of the class",
            "The advice is NOT applied, because the self-call does not pass through the proxy",
            "The self-call throws a runtime exception",
            "The advice is applied twice (once for the proxy, once for the self-call)"
          ],
          correct: [1],
          reasoning: "A self-invocation through this does not pass through the proxy, so proxy-based advice on the inner method is not applied."
        },
        {
          id: 362,
          question: "In AOP, the mechanism that declares additional methods or fields for an advised type (e.g. adding a new interface plus its implementation to an existing object) is called an \"introduction\". What is this same mechanism called in the AspectJ community?",
          options: [
            "Inter-type declaration",
            "Pointcut designator",
            "Around advice",
            "Cross-cutting weave"
          ],
          correct: [0],
          reasoning: "An AOP introduction (adding methods/fields to a type) is called an inter-type declaration in the AspectJ community."
        },
        {
          id: 363,
          question: "In a bidirectional JPA association, what does the mappedBy attribute indicate about the entity on which it is declared?",
          options: [
            "That this entity is the owning side and holds the foreign-key (join) column",
            "That this entity is the inverse (non-owning) side; the relationship is owned by the other entity",
            "That the association must always be fetched eagerly",
            "That a separate join table is always created for the association"
          ],
          correct: [1],
          reasoning: "mappedBy marks the entity as the inverse (non-owning) side; the relationship is owned by the other entity, which holds the foreign key."
        },
        {
          id: 364,
          question: "Which statements about the RDF terms allowed in a triple (subject, predicate, object) are TRUE? Select all that apply.",
          options: [
            "A literal may appear only as the object of a triple",
            "The predicate must always be an IRI/URI (never a blank node or a literal)",
            "A blank node may appear as a subject or as an object",
            "A literal may be used as the subject of a triple",
            "The subject may be a literal provided the literal is typed"
          ],
          correct: [0, 1, 2],
          reasoning: "A literal may appear only as an object; the predicate must always be an IRI; a blank node may be subject or object. Literals can never be subjects or predicates."
        },
        {
          id: 365,
          question: "How many datatypes does the RDF specification itself predefine, and which one(s)?",
          options: [
            "None; every datatype must be imported from XML Schema",
            "Exactly one: rdf:XMLLiteral",
            "Three: xsd:string, xsd:integer and xsd:dateTime",
            "Exactly one: rdf:PlainLiteral"
          ],
          correct: [1],
          reasoning: "RDF itself predefines exactly one datatype: rdf:XMLLiteral. All other datatypes come from XML Schema."
        },
        {
          id: 366,
          question: "A property P is declared with rdfs:domain C. Given the triple \"x P y\", what does RDFS semantics license a reasoner to INFER?",
          options: [
            "That y is an instance of C",
            "That x is an instance of C",
            "That the triple is invalid unless x was previously declared an instance of C",
            "That both x and y are instances of C"
          ],
          correct: [1],
          reasoning: "rdfs:domain C on property P means that for any triple x P y, the subject x is inferred to be an instance of C."
        },
        {
          id: 367,
          question: "Which statement about the three OWL 1 sublanguages (OWL Lite, OWL DL, OWL Full) is correct?",
          options: [
            "OWL Lite is undecidable, while OWL Full is decidable",
            "OWL DL retains computational completeness and decidability, whereas OWL Full gives maximum expressiveness with NO computational guarantees (undecidable)",
            "OWL Full is the only one of the three that is decidable",
            "All three sublanguages have exactly the same expressive power"
          ],
          correct: [1],
          reasoning: "OWL DL keeps computational completeness and decidability; OWL Full gives maximum expressiveness but offers no computational guarantees (it is undecidable)."
        },
        {
          id: 368,
          question: "Declaring a property as an owl:InverseFunctionalProperty means a given object (range) value can be linked to at most one subject. What is this most useful for?",
          options: [
            "Using the property as a unique identifier / key for an individual (like a primary key)",
            "Stating that the property is its own inverse",
            "Guaranteeing at most one value of the property per subject",
            "Making the property transitive"
          ],
          correct: [0],
          reasoning: "owl:InverseFunctionalProperty means an object value identifies at most one subject, so it is useful as a unique identifier / key for an individual (like a primary key)."
        },
        {
          id: 369,
          question: "An OWL ontology defines class :Few as \"individuals having at most 2 values of :hasBrother\". Individual :t1 is asserted to have three brothers i1, i2, i3, with no owl:differentFrom or other extra statements. An OWL reasoner does NOT conclude that :t1 violates :Few. Which explanation is correct?",
          options: [
            "Because of the Open World + No-Unique-Names assumptions, i1/i2/i3 are not assumed distinct and unknown extra facts cannot be ruled out; a closed-world count is obtained with a SPARQL query using COUNT / GROUP BY / HAVING",
            "Because OWL immediately rejects the ontology as inconsistent and there is no workaround",
            "Because OWL uses the Closed World Assumption by default, so no additional query is ever needed",
            "Because rdfs:domain blocks the inference and a DTD must be used to validate the data"
          ],
          correct: [0],
          reasoning: "Under the Open World plus No-Unique-Names assumptions, i1/i2/i3 are not assumed distinct and unknown extra facts cannot be excluded; a closed-world count is obtained with a SPARQL query using COUNT/GROUP BY/HAVING."
        },
        {
          id: 370,
          question: "Which statements correctly describe the contrast between OWL and SHACL as taught in the course? Select all that apply.",
          options: [
            "OWL adopts the Open World Assumption, while SHACL adopts the Closed World Assumption",
            "OWL is primarily used to infer new triples, while SHACL validates data against shapes without inferring new facts",
            "SHACL constraints/validation can be expressed using SPARQL (SHACL-SPARQL)",
            "SHACL infers new triples with a tableau reasoner, while OWL only checks structure",
            "OWL performs closed-world structural validation, while SHACL performs open-world inference"
          ],
          correct: [0, 1, 2],
          reasoning: "OWL adopts the Open World Assumption and is used to infer triples; SHACL adopts the Closed World Assumption and validates data against shapes without inferring, and its constraints can be written in SPARQL (SHACL-SPARQL)."
        },
        {
          id: 371,
          question: "According to the IEEE, a \"requirement\" is defined in THREE parts. Which of the following is the THIRD part of that definition?",
          options: [
            "A condition or capability needed by a user to solve a problem or achieve an objective",
            "A condition or capability that must be met or possessed by a system or system component to satisfy a contract, standard, specification, or other formally imposed document",
            "A documented representation of a condition or capability as in definition 1 or 2",
            "A statement of the qualities the system must possess and the constraints its development must satisfy"
          ],
          correct: [2],
          reasoning: "The IEEE three-part definition: (3) is a documented representation of a condition or capability as in definition (1) or (2)."
        },
        {
          id: 372,
          question: "Which requirements artifact \"appears as part of the contract between the customer and the supplier\"?",
          options: [
            "User requirements",
            "System requirements",
            "Domain requirements",
            "Functional requirements",
            "Specification of software project",
            "Non-functional requirements"
          ],
          correct: [1],
          reasoning: "System requirements form part of the contract between customer and supplier."
        },
        {
          id: 373,
          question: "Which of the following are listed among the \"desirable characteristics of the definitions\" of requirements? Select all that apply.",
          options: [
            "Consistency",
            "Modularity",
            "Traceability",
            "Accuracy",
            "Verifiability",
            "Atomicity"
          ],
          correct: [0, 3, 4],
          reasoning: "The desirable characteristics listed are Consistency, Accuracy and Verifiability."
        },
        {
          id: 374,
          question: "According to the lecture, user requirements are formed on the basis of what?",
          options: [
            "An abstract description created for developers",
            "An interview with the client",
            "Models that appear in the contract",
            "The field of application from which they come"
          ],
          correct: [1],
          reasoning: "User requirements are formed on the basis of an interview with the client."
        },
        {
          id: 375,
          question: "The lecture describes the \"Specification of software project\" as which of the following?",
          options: [
            "A collection of functional and nonfunctional requirements expressed in natural language",
            "Detailed descriptions of services and system constraints that can be represented by models",
            "An abstract description of a software project, a core for detailed project description and implementation, created for developers",
            "Expectations for services and constraints under which the system will operate, formed from a client interview"
          ],
          correct: [2],
          reasoning: "The Specification of software project is an abstract description, a core for the detailed project description and implementation, created for developers."
        },
        {
          id: 376,
          question: "According to the lecture, domain requirements have which distinguishing property?",
          options: [
            "They are always non-functional",
            "They form part of the contract between customer and supplier",
            "They are an abstract description created for developers",
            "They come from the field of application and can be functional or non-functional"
          ],
          correct: [3],
          reasoning: "Domain requirements come from the field of application and may be either functional or non-functional."
        },
        {
          id: 377,
          question: "The lecture states that requirements definitions take an \"Open form\" and a \"Closed\" form at two different stages. Which mapping is correct?",
          options: [
            "Open at the implementation stage; Closed at the contracting stage",
            "Open at the contracting stage; Closed at the implementation stage",
            "Open at the feasibility stage; Closed at the contracting stage",
            "Open at the verification stage; Closed at the analysis stage"
          ],
          correct: [1],
          reasoning: "Requirements take an Open form at the contracting stage and a Closed form at the implementation stage."
        },
        {
          id: 378,
          question: "Which of the following are classified by the lecture as NON-functional requirements? Select all that apply.",
          options: [
            "Timing constraints",
            "Reaction to particular inputs",
            "Planned services offered by the system",
            "Constraints on the development process",
            "Behaviors in certain situations",
            "Protected behaviors and limits"
          ],
          correct: [0, 3],
          reasoning: "Timing constraints and constraints on the development process are non-functional. Planned services and reactions to inputs are functional."
        },
        {
          id: 379,
          question: "The SyRS, StRS and SRS document templates shown in the lecture are all based on which standard?",
          options: [
            "ISO/IEC 10746-1:1998",
            "ISO/IEC 19505-2:2012",
            "ISO/IEC/IEEE 29148:2011(E)",
            "ISO/IEC 19514:2017"
          ],
          correct: [2],
          reasoning: "The SyRS, StRS and SRS templates are all based on ISO/IEC/IEEE 29148:2011(E)."
        },
        {
          id: 380,
          question: "In the Stakeholder Requirements Specification (StRS) template, which top-level section contains the subsections \"Operational concept\" and \"Operational scenario\"?",
          options: [
            "Business operational requirements",
            "Business management requirements",
            "User requirements",
            "Concept of proposed system"
          ],
          correct: [3],
          reasoning: "In the StRS, the 'Concept of proposed system' section contains the Operational concept and Operational scenario subsections."
        },
        {
          id: 381,
          question: "In the System Requirements Specification (SyRS) template, Section 4 is dedicated to which activity, organized in parallel to the subsections of Section 3?",
          options: [
            "Specific requirements",
            "Verification",
            "References",
            "Appendices"
          ],
          correct: [1],
          reasoning: "In the SyRS, Section 4 is dedicated to Verification, organized in parallel with the subsections of Section 3."
        },
        {
          id: 382,
          question: "Which of the following sections appear under \"3. Business management requirements\" in the StRS template? Select all that apply.",
          options: [
            "Business environment",
            "Business processes",
            "Business operational policies and rules",
            "Information environment",
            "Operational scenario"
          ],
          correct: [0, 3],
          reasoning: "Under StRS 'Business management requirements' fall Business environment and Information environment."
        },
        {
          id: 383,
          question: "According to the lecture, each class in a class diagram is represented by a rectangle with exactly three compartments. Which set names them correctly?",
          options: [
            "name, stereotype, constraints",
            "attributes, operations, associations",
            "name, attributes, operations",
            "name, fields, relationships"
          ],
          correct: [2],
          reasoning: "A class rectangle has exactly three compartments: name, attributes and operations."
        },
        {
          id: 384,
          question: "The lecture states that navigability is which kind of concept?",
          options: [
            "A compile-time concept",
            "A run-time concept",
            "A design-time-only concept",
            "An ownership concept"
          ],
          correct: [1],
          reasoning: "The lecture states that navigability is a run-time concept."
        },
        {
          id: 385,
          question: "Regarding association end ownership and navigability, which statements match the lecture's rules? Select all that apply.",
          options: [
            "All class-owned association ends are navigable by definition",
            "All class-owned association ends are not navigable by convention",
            "All association-owned ends are not navigable by convention",
            "An association with neither end marked by navigability arrows is navigable in only one direction"
          ],
          correct: [0, 2],
          reasoning: "All class-owned association ends are navigable by definition, while all association-owned ends are not navigable by convention."
        },
        {
          id: 386,
          question: "When the dot notation is used on an association, what does the ABSENCE of the dot at an end signify?",
          options: [
            "That the end is navigable in both directions",
            "That the end is owned by the class at that end",
            "That the end (association end) is owned by the association",
            "That the multiplicity at that end is unknown"
          ],
          correct: [2],
          reasoning: "With the dot notation, the absence of a dot at an end means that end is owned by the association (not by the class)."
        },
        {
          id: 387,
          question: "According to the lecture, an association is owned by a class under which condition?",
          options: [
            "If the class is at the navigable end of the association",
            "If there is a pass between the association ends",
            "If the association has operations and attributes of its own",
            "If the definition of that class has a feature that is typed by the class at the opposite end"
          ],
          correct: [3],
          reasoning: "An association is owned by a class when the definition of that class has a feature typed by the class at the opposite end."
        },
        {
          id: 388,
          question: "The lecture notes that the navigability concept has effectively been deprecated in which version(s) of UML?",
          options: [
            "In UML 1 only",
            "In UML 2, and even more so in later revisions such as UML 2.5",
            "Only starting from UML 2.5.1",
            "It has never been deprecated, only renamed to ownership"
          ],
          correct: [1],
          reasoning: "Navigability was effectively deprecated in UML 2, and even more so in later revisions such as UML 2.5."
        },
        {
          id: 389,
          question: "When an association itself has operations and attributes, how is it modelled according to the lecture?",
          options: [
            "As a composition",
            "As a navigable bidirectional association",
            "As an association class",
            "As an aggregation"
          ],
          correct: [2],
          reasoning: "When an association has its own operations and attributes it is modelled as an association class."
        },
        {
          id: 390,
          question: "What distinguishes Composition from Aggregation, according to the lecture's Dictionary/DictEntry example?",
          options: [
            "In aggregation the hosted objects are finalized together with the container",
            "Composition allows the hosted objects to keep persistent after the container is killed",
            "Aggregation requires a bidirectional association while composition is one-directional",
            "In composition, finalization of the container causes finalization of the hosted objects"
          ],
          correct: [3],
          reasoning: "In composition, finalizing (destroying) the container causes finalization of the hosted objects; aggregation does not."
        },
        {
          id: 391,
          question: "In the UML access modifier table, which symbol denotes the \"package\" visibility (accessible for objects of other classes within the same package)?",
          options: [
            "#",
            "-",
            "~",
            "+"
          ],
          correct: [2],
          reasoning: "The tilde ~ denotes package visibility (accessible to objects of other classes within the same package)."
        },
        {
          id: 392,
          question: "The lecture's UML modifier table describes \"accessible from within the owning class or a subclass of that class\". Which symbol is this?",
          options: [
            "~",
            "#",
            "+",
            "-"
          ],
          correct: [1],
          reasoning: "The hash # denotes protected visibility: accessible from within the owning class or a subclass of it."
        },
        {
          id: 393,
          question: "The lecture states the UML taxonomy comprises how many diagrams in how many categories?",
          options: [
            "14 diagrams, 2 categories",
            "13 diagrams, 4 categories",
            "13 diagrams, 3 categories",
            "9 diagrams, 3 categories"
          ],
          correct: [2],
          reasoning: "Per the lecture, the UML taxonomy comprises 13 diagrams in 3 categories."
        },
        {
          id: 394,
          question: "In the UML diagram taxonomy shown, which of the following are STRUCTURE diagrams? Select all that apply.",
          options: [
            "Component Diagram",
            "Activity Diagram",
            "Object Diagram",
            "Use Case Diagram",
            "Deployment Diagram",
            "State Machine Diagram"
          ],
          correct: [0, 2, 4],
          reasoning: "Component, Object and Deployment diagrams are Structure diagrams. Activity, Use Case and State Machine are Behavior diagrams."
        },
        {
          id: 395,
          question: "In the SysML diagram taxonomy, the Requirement Diagram is classified under which top-level category?",
          options: [
            "Behavior Diagram",
            "Structure Diagram",
            "It is its own top-level category (Requirement Diagram)",
            "Parametric Diagram"
          ],
          correct: [2],
          reasoning: "In SysML the Requirement Diagram is its own top-level category, separate from Structure and Behavior."
        },
        {
          id: 396,
          question: "The lecture's SysML requirements relationship table gives the \"Derive\" relationship which stereotype?",
          options: [
            "«refine»",
            "«trace»",
            "«satisfy»",
            "«deriveReqt»"
          ],
          correct: [3],
          reasoning: "The Derive requirements relationship uses the stereotype «deriveReqt»."
        },
        {
          id: 397,
          question: "Which SysML relationship is used to assert that a model element (e.g. a test case) checks that a requirement is met?",
          options: [
            "«satisfy»",
            "«verify»",
            "«refine»",
            "«deriveReqt»"
          ],
          correct: [1],
          reasoning: "«verify» asserts that a model element (such as a test case) checks that a requirement is met."
        },
        {
          id: 398,
          question: "Which of the following are SysML requirements relationships listed in the lecture's relationship table (left column)? Select all that apply.",
          options: [
            "Containment",
            "Copy",
            "Generalization",
            "Dependency",
            "Refine",
            "Aggregation"
          ],
          correct: [0, 1, 4],
          reasoning: "The SysML requirements relationships listed include Containment, Copy and Refine."
        },
        {
          id: 399,
          question: "In the SysML requirements diagram, the «satisfy» relationship is shown going FROM which element TO which element?",
          options: [
            "From a requirement to a test case",
            "From a requirement (Client) to a requirement (Supplier)",
            "From a NamedElement to a requirement (Supplier)",
            "From a requirement to a NamedElement"
          ],
          correct: [2],
          reasoning: "«satisfy» runs from a NamedElement (the design element) to a requirement (the Supplier)."
        },
        {
          id: 400,
          question: "According to the lecture, a SysML Rationale is a stereotype of which base element?",
          options: [
            "Requirement",
            "NamedElement",
            "Comment",
            "TestCase"
          ],
          correct: [2],
          reasoning: "A SysML Rationale is a stereotype of the base element Comment."
        },
        {
          id: 401,
          question: "In the GoF classification table, into which Purpose category does the Prototype pattern fall?",
          options: [
            "Structural",
            "Behavioral",
            "Creational",
            "Concurrency"
          ],
          correct: [2],
          reasoning: "Prototype is a Creational pattern."
        },
        {
          id: 402,
          question: "According to the GoF classification table, the Interpreter pattern has which Scope?",
          options: [
            "Object",
            "Class",
            "Both class and object",
            "Component"
          ],
          correct: [1],
          reasoning: "Interpreter has Class scope in the GoF table."
        },
        {
          id: 403,
          question: "Which of the following patterns are classified as Object-scope Behavioral patterns in the GoF table? Select all that apply.",
          options: [
            "Chain of Responsibility",
            "Template Method",
            "Observer",
            "Strategy"
          ],
          correct: [0, 2, 3],
          reasoning: "Chain of Responsibility, Observer and Strategy are Object-scope Behavioral patterns; Template Method is Class-scope."
        },
        {
          id: 404,
          question: "In the GoF table, the two Class-scope Behavioral patterns are Template Method and which other?",
          options: [
            "Strategy",
            "Interpreter",
            "Mediator",
            "Visitor"
          ],
          correct: [1],
          reasoning: "The two Class-scope Behavioral patterns are Template Method and Interpreter."
        },
        {
          id: 405,
          question: "Which of the following are listed as Object-scope Structural patterns in the GoF classification? Select all that apply.",
          options: [
            "Bridge",
            "Composite",
            "Interpreter",
            "Flyweight"
          ],
          correct: [0, 1, 3],
          reasoning: "Bridge, Composite and Flyweight are Object-scope Structural patterns; Interpreter is Behavioral."
        },
        {
          id: 406,
          question: "According to the GoF table, all of the following Creational patterns have Object scope EXCEPT one. Which one is the exception (has Class scope)?",
          options: [
            "Abstract Factory",
            "Factory Method",
            "Builder",
            "Prototype"
          ],
          correct: [1],
          reasoning: "Among creational patterns, Factory Method is the exception with Class scope; the rest have Object scope."
        },
        {
          id: 407,
          question: "Which of the following patterns appear in the Object-scope Behavioral cell of the GoF classification table? Select all that apply.",
          options: [
            "Interpreter",
            "Memento",
            "Template Method",
            "State"
          ],
          correct: [1, 3],
          reasoning: "The Object-scope Behavioral cell includes Memento and State; Interpreter and Template Method are Class-scope."
        },
        {
          id: 408,
          question: "According to the GoF essential elements, which element captures \"the results and trade-offs of applying the pattern, the costs and benefits\"?",
          options: [
            "The pattern name",
            "The problem",
            "The solution",
            "The consequences"
          ],
          correct: [3],
          reasoning: "The Consequences element captures the results, trade-offs, costs and benefits of applying the pattern."
        },
        {
          id: 409,
          question: "According to the GoF, how many essential elements describe a design pattern?",
          options: [
            "Three",
            "Four",
            "Five",
            "Ten"
          ],
          correct: [1],
          reasoning: "GoF describes a design pattern with four essential elements: name, problem, solution, consequences."
        },
        {
          id: 410,
          question: "In the GoF essential elements, which element \"describes the elements that make up the design, their relationships, responsibilities, and collaborations\"?",
          options: [
            "The problem",
            "The consequences",
            "The solution",
            "The pattern name"
          ],
          correct: [2],
          reasoning: "The Solution element describes the elements making up the design, their relationships, responsibilities and collaborations."
        },
        {
          id: 411,
          question: "Per the lecture, the key distinction is that the Abstract Factory pattern delegates object instantiation to another object via composition, whereas the Factory Method pattern relies on which mechanism?",
          options: [
            "Aggregation",
            "Inheritance (a subclass handles instantiation)",
            "Cloning of prototypes",
            "A static registry of products"
          ],
          correct: [1],
          reasoning: "Abstract Factory delegates instantiation to another object via composition; Factory Method relies on inheritance, where a subclass handles instantiation."
        },
        {
          id: 412,
          question: "Which GoF pattern \"relies on creation of new objects through cloning and modifying existing initialized prototypes\", being especially productive when initialization is expensive?",
          options: [
            "Prototype",
            "Builder",
            "Abstract Factory",
            "Flyweight"
          ],
          correct: [0],
          reasoning: "Prototype creates new objects by cloning and modifying existing initialized prototypes, useful when initialization is expensive."
        },
        {
          id: 413,
          question: "According to the lecture, which pattern is used \"when you need to decouple an abstraction from its implementation so that the two can vary independently\"?",
          options: [
            "Adapter",
            "Proxy",
            "Bridge",
            "Decorator"
          ],
          correct: [2],
          reasoning: "Bridge decouples an abstraction from its implementation so the two can vary independently."
        },
        {
          id: 414,
          question: "Which Java core class is an example of the Singleton pattern?",
          options: [
            "java.util.Calendar (via getInstance)",
            "java.lang.Runtime",
            "java.lang.StringBuilder",
            "java.lang.reflect.Proxy"
          ],
          correct: [1],
          reasoning: "java.lang.Runtime is a classic Singleton in the Java core library."
        },
        {
          id: 415,
          question: "Match the Java core class to the pattern it exemplifies. Which of the following pairings are correct? Select all that apply.",
          options: [
            "java.lang.StringBuilder — Builder",
            "java.util.Calendar.getInstance() — Singleton",
            "Integer.valueOf() — Flyweight",
            "java.io.InputStream subclasses — Proxy"
          ],
          correct: [0, 2],
          reasoning: "java.lang.StringBuilder exemplifies Builder and Integer.valueOf() exemplifies Flyweight (cached small Integers)."
        },
        {
          id: 416,
          question: "The subclasses of java.io.InputStream (e.g. BufferedInputStream wrapping another stream) are a classic example of which pattern?",
          options: [
            "Proxy",
            "Composite",
            "Adapter",
            "Decorator"
          ],
          correct: [3],
          reasoning: "InputStream subclasses such as BufferedInputStream wrapping another stream are a classic Decorator example."
        },
        {
          id: 417,
          question: "Which Java EE design pattern provides a single entry point (usually a servlet) that handles all incoming requests and routes them, exemplified by Spring's DispatcherServlet?",
          options: [
            "Session Facade",
            "Front Controller",
            "Business Delegate",
            "View Helper"
          ],
          correct: [1],
          reasoning: "Front Controller provides a single entry point handling all requests, exemplified by Spring's DispatcherServlet."
        },
        {
          id: 418,
          question: "According to the lecture's Java EE patterns, which pattern \"acts as a proxy between the presentation and business layer\" and hides the complexity of remote calls?",
          options: [
            "Service Locator",
            "Session Facade",
            "Business Delegate",
            "Transfer Object Assembler"
          ],
          correct: [2],
          reasoning: "Business Delegate acts as a proxy between the presentation and business layers, hiding the complexity of remote calls."
        },
        {
          id: 419,
          question: "Which statements about the Java EE Service Locator and Session Facade patterns are correct per the lecture? Select all that apply.",
          options: [
            "Service Locator provides a centralized lookup of services (like JNDI resources)",
            "Service Locator handles asynchronous JMS messaging",
            "Session Facade provides a simplified interface to complex business logic",
            "Session Facade combines multiple entities into a single DTO"
          ],
          correct: [0, 2],
          reasoning: "Service Locator provides centralized lookup of services (e.g. JNDI resources); Session Facade provides a simplified interface to complex business logic."
        },
        {
          id: 420,
          question: "According to the lecture, the Repository pattern is described how relative to the DAO pattern?",
          options: [
            "It handles asynchronous JMS messaging",
            "It is the presentation-layer counterpart of DAO",
            "It is similar to DAO but more domain-driven, common in JPA / Spring Data",
            "It combines multiple entities into a single DTO"
          ],
          correct: [2],
          reasoning: "The Repository pattern is similar to DAO but more domain-driven, common in JPA / Spring Data."
        },
        {
          id: 421,
          question: "According to the lecture, which statements about the DTO (Data Transfer Object) pattern are correct? Select all that apply.",
          options: [
            "It transfers data between layers",
            "It abstracts database access and keeps SQL/JPA separate from business logic",
            "It reduces the number of remote calls",
            "It provides a centralized lookup of JNDI services"
          ],
          correct: [0, 2],
          reasoning: "The DTO pattern transfers data between layers and reduces the number of remote calls."
        },
        {
          id: 422,
          question: "In the lecture's Integration patterns, which pattern \"combines multiple entities into a DTO\"?",
          options: [
            "Service Activator",
            "Transfer Object Assembler",
            "Message Broker",
            "Business Delegate"
          ],
          correct: [1],
          reasoning: "Transfer Object Assembler combines multiple entities into a single DTO."
        },
        {
          id: 423,
          question: "Per the lecture, in the Java EE Business Layer the Session Facade pattern is \"often implemented as EJBs\" and serves what main purpose?",
          options: [
            "Handles asynchronous messaging via JMS",
            "Abstracts database access from business logic",
            "Centralizes service lookup to avoid costly lookups",
            "Provides a simplified interface to complex business logic and reduces network calls in distributed systems"
          ],
          correct: [3],
          reasoning: "Session Facade (often implemented as EJBs) provides a simplified interface to complex business logic and reduces network calls in distributed systems."
        },
        {
          id: 424,
          question: "In the lecture, which Java EE Integration pattern \"handles asynchronous messaging (JMS)\"?",
          options: [
            "Transfer Object Assembler",
            "Service Activator",
            "Front Controller",
            "View Helper"
          ],
          correct: [1],
          reasoning: "Service Activator handles asynchronous messaging (JMS)."
        },
        {
          id: 425,
          question: "According to the lecture, Dependency Injection (DI) in Java EE is managed by which technology?",
          options: [
            "JMS (Java Message Service)",
            "JNDI (Java Naming and Directory Interface)",
            "CDI (Contexts and Dependency Injection)",
            "JPA (Java Persistence API)"
          ],
          correct: [2],
          reasoning: "Dependency Injection in Java EE is managed by CDI (Contexts and Dependency Injection)."
        },
        {
          id: 426,
          question: "Per the lecture's \"Modern Reality\" insight, which of the following replacements are stated for legacy Java EE patterns? Select all that apply.",
          options: [
            "DAO is often replaced by Spring Data repositories",
            "Service Locator is replaced by DI",
            "Front Controller is replaced by JMS",
            "MVC is replaced by Service Locator"
          ],
          correct: [0, 1],
          reasoning: "In modern practice DAO is replaced by Spring Data repositories and Service Locator is replaced by DI."
        },
        {
          id: 427,
          question: "According to the lecture, what does the HTTP status code class 3xx signify?",
          options: [
            "Informational — request received, continuing process",
            "Redirection — further action needs to be taken to complete the request",
            "Client Error — the request contains bad syntax or cannot be fulfilled",
            "Server Error — the server failed to fulfill an apparently valid request"
          ],
          correct: [1],
          reasoning: "HTTP status class 3xx means Redirection — further action is needed to complete the request."
        },
        {
          id: 428,
          question: "The HTTP/1.1 method set adds several methods on top of HTTP/1.0. Which of the following were introduced with HTTP/1.1 (not present in HTTP/1.0)? Select all that apply.",
          options: [
            "PUT",
            "DELETE",
            "POST",
            "HEAD"
          ],
          correct: [0, 1],
          reasoning: "HTTP/1.1 introduced PUT and DELETE; POST and HEAD already existed in HTTP/1.0."
        },
        {
          id: 429,
          question: "According to the lecture, who authored the work that introduced REST (Representational State Transfer)?",
          options: [
            "Roy Fielding in the HTTP/1.1 RFC of 1999",
            "Gang of Four in \"Design Patterns\" (1994)",
            "Roy Fielding in his PhD thesis \"Architectural Styles and the Design of Network-based Software Architectures\" (2000)",
            "Tomasz Kubik in the ISM lecture notes"
          ],
          correct: [2],
          reasoning: "REST was introduced by Roy Fielding in his 2000 PhD thesis 'Architectural Styles and the Design of Network-based Software Architectures'."
        },
        {
          id: 430,
          question: "According to the lecture, the OpenAPI Specification was donated to the Linux Foundation under which initiative, and in which year?",
          options: [
            "The W3C Web Services Initiative, in 2000",
            "The OpenAPI Initiative, in 2015",
            "The Swagger Foundation, in 2011",
            "The Apache Software Foundation, in 2017"
          ],
          correct: [1],
          reasoning: "The OpenAPI Specification was donated to the Linux Foundation under the OpenAPI Initiative in 2015."
        },
        {
          id: 431,
          question: "According to the lecture, which statement BEST distinguishes Spring Boot from the Spring framework?",
          options: [
            "Spring Boot replaces the Spring framework with a completely independent codebase",
            "Spring Boot is an extension of Spring that eliminates the boilerplate configurations required for setting up a Spring application",
            "Spring Boot is a low-level dependency injection container while Spring only adds web support on top",
            "Spring Boot forbids the use of Java annotations and relies exclusively on XML configuration"
          ],
          correct: [1],
          reasoning: "Spring Boot is an extension of Spring that eliminates the boilerplate configuration needed to set up a Spring application."
        },
        {
          id: 432,
          question: "According to the lecture, through which mechanisms can Inversion of Control (IoC) be achieved? (select all that apply)",
          options: [
            "Service Locator pattern",
            "Decorator pattern",
            "Factory pattern",
            "Dependency Injection (DI)"
          ],
          correct: [0, 2, 3],
          reasoning: "IoC can be achieved via the Service Locator pattern, the Factory pattern and Dependency Injection."
        },
        {
          id: 433,
          question: "The Spring container creates objects, wires them together, configures them and manages their full life cycle. According to the lecture, in which three forms can the configuration metadata be supplied?",
          options: [
            "Only in XML format",
            "Only as Java annotations or Java code",
            "In XML format, as Java annotations, or as Java code",
            "In XML, YAML, or Properties files"
          ],
          correct: [2],
          reasoning: "Spring configuration metadata can be supplied in XML, as Java annotations, or as Java code."
        },
        {
          id: 434,
          question: "According to the lecture, Spring's dependency injection can be performed through which of the following? (select all that apply)",
          options: [
            "Constructors",
            "Setters",
            "Static initializer blocks",
            "Fields"
          ],
          correct: [0, 1, 3],
          reasoning: "Spring dependency injection can be performed through constructors, setters and fields."
        },
        {
          id: 435,
          question: "In the DI example, the @Autowired annotation is placed directly on a private field of the Store class. Which type of dependency injection does this illustrate?",
          options: [
            "Constructor-based DI",
            "Field-based DI",
            "Setter-based DI",
            "Service Locator based DI"
          ],
          correct: [1],
          reasoning: "@Autowired placed directly on a private field illustrates field-based dependency injection."
        },
        {
          id: 436,
          question: "Which ApplicationContext implementation loads a context definition from one or more XML files located in the classpath, treating the context-definition files as classpath resources?",
          options: [
            "FileSystemXmlApplicationContext",
            "AnnotationConfigApplicationContext",
            "ClassPathXmlApplicationContext",
            "XmlWebApplicationContext"
          ],
          correct: [2],
          reasoning: "ClassPathXmlApplicationContext loads a context definition from XML files on the classpath."
        },
        {
          id: 437,
          question: "Which ApplicationContext flavor loads a Spring application context from one or more Java-based configuration classes?",
          options: [
            "ClassPathXmlApplicationContext",
            "AnnotationConfigApplicationContext",
            "FileSystemXmlApplicationContext",
            "XmlWebApplicationContext"
          ],
          correct: [1],
          reasoning: "AnnotationConfigApplicationContext loads the context from Java-based configuration classes."
        },
        {
          id: 438,
          question: "A developer needs to load a context definition from XML files located on the filesystem (not on the classpath). Which ApplicationContext implementation is appropriate?",
          options: [
            "AnnotationConfigApplicationContext",
            "ClassPathXmlApplicationContext",
            "AnnotationConfigWebApplicationContext",
            "FileSystemXmlApplicationContext"
          ],
          correct: [3],
          reasoning: "FileSystemXmlApplicationContext loads a context definition from XML files on the filesystem."
        },
        {
          id: 439,
          question: "According to the lecture, what is the exact role of the @Required annotation?",
          options: [
            "It is applied on fields and constructors to implicitly inject an object dependency",
            "It is applied on bean setter methods and indicates that the affected bean must be populated at configuration time with the required property, otherwise a BeanInitializationException is thrown",
            "It is used along with @Autowired to choose between several beans of the same type",
            "It declares lazy initialization of a bean so that the property is only set when first accessed"
          ],
          correct: [1],
          reasoning: "@Required is applied on bean setter methods; the bean must be populated at configuration time, otherwise a BeanInitializationException is thrown."
        },
        {
          id: 440,
          question: "Two beans of the same type have been created and only one of them should be wired with a property. According to the lecture, which annotation is used together with @Autowired to avoid this confusion?",
          options: [
            "@Required",
            "@Value",
            "@Qualifier",
            "@Bean"
          ],
          correct: [2],
          reasoning: "@Qualifier is used together with @Autowired to choose between several beans of the same type."
        },
        {
          id: 441,
          question: "According to the lecture, on which of the following can the @Autowired annotation be applied? (select all that apply)",
          options: [
            "Fields",
            "Packages",
            "Constructors",
            "Annotation type declarations"
          ],
          correct: [0, 2],
          reasoning: "@Autowired can be applied to fields and to constructors."
        },
        {
          id: 442,
          question: "A class is annotated with @Configuration and contains a method annotated with @Bean called itemService(). According to the lecture, what serves as the bean's ID?",
          options: [
            "The return type of the method",
            "The name of the method (itemService)",
            "The fully qualified name of the @Configuration class",
            "A randomly generated UUID assigned by the container"
          ],
          correct: [1],
          reasoning: "For a @Bean method named itemService(), the method name (itemService) serves as the bean's ID."
        },
        {
          id: 443,
          question: "According to the lecture, which annotation is used together with @Configuration to let Spring know which packages to scan for annotated components?",
          options: [
            "@Bean",
            "@Autowired",
            "@ComponentScan",
            "@EnableAutoConfiguration"
          ],
          correct: [2],
          reasoning: "@ComponentScan is used with @Configuration to tell Spring which packages to scan for annotated components."
        },
        {
          id: 444,
          question: "By default in Spring, when are autowired dependencies created and configured? Which annotation changes this behavior?",
          options: [
            "Lazily on first access by default; @Eager forces startup creation",
            "At startup by default; @Lazy declares lazy initialization of a bean",
            "Never automatically; @Autowired must be paired with @Value",
            "At startup by default; @Required declares lazy initialization of a bean"
          ],
          correct: [1],
          reasoning: "By default autowired beans are created and configured at startup; @Lazy declares lazy initialization."
        },
        {
          id: 445,
          question: "According to the lecture, which annotation indicates a default value expression used to initialize a field or parameter, and can be used at the field, constructor parameter, and method parameter level?",
          options: [
            "@Qualifier",
            "@Required",
            "@Value",
            "@Bean"
          ],
          correct: [2],
          reasoning: "@Value indicates a default value expression and can be used at field, constructor-parameter and method-parameter level."
        },
        {
          id: 446,
          question: "According to the lecture, which stereotype annotation is used on Java classes which directly access the database and works as a marker for any class fulfilling the role of repository or Data Access Object?",
          options: [
            "@Service",
            "@Controller",
            "@Repository",
            "@Component"
          ],
          correct: [2],
          reasoning: "@Repository marks classes that directly access the database, serving as a marker for the repository / DAO role."
        },
        {
          id: 447,
          question: "A class executes business logic, performs calculations and calls external APIs. According to the lecture, which stereotype annotation best marks this class?",
          options: [
            "@Repository",
            "@Service",
            "@Controller",
            "@Configuration"
          ],
          correct: [1],
          reasoning: "@Service best marks a class that executes business logic, performs calculations and calls external APIs."
        },
        {
          id: 448,
          question: "According to the lecture, what does @EnableAutoConfiguration do?",
          options: [
            "It is placed on bean setter methods to mark required properties",
            "It is usually placed on the main application class; it implicitly defines a base search package and tells Spring Boot to start adding beans based on classpath settings, other beans, and various property settings",
            "It marks a class as a controller in which every method returns a domain object instead of a view",
            "It is used together with @Configuration to specify the packages to scan"
          ],
          correct: [1],
          reasoning: "@EnableAutoConfiguration, usually on the main class, defines a base search package and tells Spring Boot to add beans based on classpath settings, other beans and properties."
        },
        {
          id: 449,
          question: "According to the lecture's list of design patterns used by Spring, which pattern is used extensively to deal with boilerplate repeated code (such as closing connections cleanly) and is exemplified by JdbcTemplate, JmsTemplate and JpaTemplate?",
          options: [
            "Factory",
            "Proxy",
            "Template method",
            "Front Controller"
          ],
          correct: [2],
          reasoning: "The Template method pattern handles boilerplate repeated code (such as clean resource closing), exemplified by JdbcTemplate, JmsTemplate and JpaTemplate."
        },
        {
          id: 450,
          question: "According to the lecture, which statements about design patterns used by Spring are correct? (select all that apply)",
          options: [
            "Spring uses the Factory pattern to create objects of beans using an ApplicationContext reference",
            "Spring uses the Memento pattern heavily in AOP and remoting",
            "Spring provides a Dispatcher-Servlet acting as a Front Controller to dispatch incoming requests to controllers",
            "Spring controllers in Spring MVC must be implemented as servlets rather than POJOs"
          ],
          correct: [0, 2],
          reasoning: "Spring uses the Factory pattern (creating beans via ApplicationContext) and provides a DispatcherServlet acting as a Front Controller dispatching requests to controllers."
        },
        {
          id: 451,
          question: "During bean construction, if the bean implements the BeanFactoryAware interface, what does the factory do according to the lecture?",
          options: [
            "It calls setBeanName(), passing the bean's ID",
            "It calls setBeanFactory(), passing an instance of itself",
            "It invokes postProcessAfterInitialization() on all BeanPostProcessors",
            "It calls the destroy() method of the DisposableBean interface"
          ],
          correct: [1],
          reasoning: "If a bean implements BeanFactoryAware, the factory calls setBeanFactory(), passing an instance of itself."
        },
        {
          id: 452,
          question: "According to the lecture, the @RestController annotation is a convenience annotation that combines which two annotations?",
          options: [
            "@Controller and @RequestBody",
            "@ControllerAdvice and @ResponseBody",
            "@Controller and @ResponseBody",
            "@RestControllerAdvice and @ExceptionHandler"
          ],
          correct: [2],
          reasoning: "@RestController is a convenience annotation combining @Controller and @ResponseBody."
        },
        {
          id: 453,
          question: "According to the lecture, what does @ResponseBody indicate?",
          options: [
            "That the result type should be written straight in the response body in whatever format you specify (like JSON or XML), with Spring converting the returned object using the HttpMessageConverter",
            "That a method parameter should be bound to the value of the HTTP request body",
            "That a method parameter should be mapped to a request header value",
            "That the URL parameter should be retrieved and mapped to the method argument"
          ],
          correct: [0],
          reasoning: "@ResponseBody means the result is written straight into the response body in the chosen format (JSON/XML), with Spring converting via an HttpMessageConverter."
        },
        {
          id: 454,
          question: "A handler method argument must be bound to the value of the HTTP request body. According to the lecture, which annotation indicates this?",
          options: [
            "@ResponseBody",
            "@RequestBody",
            "@RequestParam",
            "@RequestHeader"
          ],
          correct: [1],
          reasoning: "@RequestBody binds a handler method argument to the value of the HTTP request body."
        },
        {
          id: 455,
          question: "A handler method needs to retrieve a URL parameter and map it to a method argument. According to the lecture, which annotation does this?",
          options: [
            "@PathVariable",
            "@CookieValue",
            "@RequestParam",
            "@RequestHeader"
          ],
          correct: [2],
          reasoning: "@RequestParam retrieves a URL query parameter and maps it to a method argument."
        },
        {
          id: 456,
          question: "According to the lecture, @GetMapping is described as a shortcut for which of the following?",
          options: [
            "@RequestMapping(method = RequestMethod.POST)",
            "@RequestMapping(method = RequestMethod.GET)",
            "@RequestMapping(method = RequestMethod.PUT)",
            "@ResponseBody combined with @RequestMapping"
          ],
          correct: [1],
          reasoning: "@GetMapping is a shortcut for @RequestMapping(method = RequestMethod.GET)."
        },
        {
          id: 457,
          question: "According to the lecture, which annotation is used both at class and method level to enable cross origin requests (helpful when different servers serve data and scripts, related to CORS)?",
          options: [
            "@ControllerAdvice",
            "@CrossOrigin",
            "@RequestHeader",
            "@CookieValue"
          ],
          correct: [1],
          reasoning: "@CrossOrigin is used at class and method level to enable cross-origin requests (CORS)."
        },
        {
          id: 458,
          question: "According to the lecture, which AngularJS directive binds the value of HTML controls (input, select, textarea) to application data?",
          options: [
            "ng-bind",
            "ng-model",
            "ng-app",
            "ng-repeat"
          ],
          correct: [1],
          reasoning: "The ng-model directive binds the value of HTML controls (input, select, textarea) to application data."
        },
        {
          id: 459,
          question: "According to the lecture's description of AngularJS directives, which statements are correct? (select all that apply)",
          options: [
            "The ng-app directive defines an AngularJS application",
            "The ng-bind directive binds the value of HTML controls to application data",
            "The ng-bind directive binds application data to the HTML view",
            "The ng-controller directive binds an input field's value back to the model"
          ],
          correct: [0, 2],
          reasoning: "ng-app defines an AngularJS application and ng-bind binds application data into the HTML view."
        },
        {
          id: 460,
          question: "According to the lecture, which statements about the AngularJS MVC mapping and the Protractor test framework are correct? (select all that apply)",
          options: [
            "In AngularJS, the Model corresponds to scope properties ($scope)",
            "In AngularJS, the Controller is the template (HTML with data bindings) rendered into the View",
            "Protractor is a unit test framework that runs entirely without a browser",
            "Protractor runs tests against your application running in a real browser, interacting with it as a user would"
          ],
          correct: [0, 3],
          reasoning: "In AngularJS the Model corresponds to $scope properties, and Protractor runs tests against the application in a real browser, interacting as a user would."
        },
        {
          id: 461,
          question: "In raw JDBC (DAO), which step comes immediately AFTER obtaining the Connection from DriverManager.getConnection(...)?",
          options: [
            "Load the JDBC driver with Class.forName(...)",
            "Create a Statement from the connection",
            "Process the ResultSet with rs.getInt(...)",
            "Execute the query with stmt.executeQuery(sql)"
          ],
          correct: [1],
          reasoning: "In raw JDBC, after obtaining the Connection you create a Statement from it."
        },
        {
          id: 462,
          question: "What is the very FIRST step in the raw JDBC sequence shown for the DAO pattern?",
          options: [
            "Load the driver via Class.forName(\"oracle.jdbc.driver.OracleDriver\")",
            "Get a Connection via DriverManager.getConnection(URL, USER, PASS)",
            "Create a Statement object",
            "Build the SQL string for the SELECT"
          ],
          correct: [0],
          reasoning: "The first JDBC step is loading the driver via Class.forName(\"oracle.jdbc.driver.OracleDriver\")."
        },
        {
          id: 463,
          question: "JPA was defined as part of which specification, and what did it replace?",
          options: [
            "Part of JDBC 4.0, replacing the DAO pattern",
            "Part of Spring Data, replacing JdbcTemplate",
            "Part of EJB 3.0, replacing the EJB 2 CMP Entity Beans specification",
            "Part of Hibernate Core, replacing the JPQL query language"
          ],
          correct: [2],
          reasoning: "JPA was defined as part of EJB 3.0, replacing the EJB 2 CMP Entity Beans specification."
        },
        {
          id: 464,
          question: "According to the lecture, what is a key advantage of JPA regarding the classes being persisted?",
          options: [
            "Persisted classes must implement a special Entity interface",
            "Persisted classes must extend an abstract CMP base class",
            "POJOs can be persisted without requiring the classes to implement any interfaces or methods",
            "Persisted classes must be deployed inside an EJB container"
          ],
          correct: [1],
          reasoning: "A key JPA advantage is that POJOs can be persisted without implementing any special interface or method."
        },
        {
          id: 465,
          question: "Which of the following are listed in the lecture as JPA providers (implementations)? (select all that apply)",
          options: [
            "Hibernate",
            "TopLink",
            "Spring JdbcTemplate",
            "H2",
            "KodoJDO",
            "Oracle Thin Driver",
            "AspectJ"
          ],
          correct: [0, 1, 3],
          reasoning: "The lecture lists Hibernate, TopLink and H2 among JPA providers/implementations."
        },
        {
          id: 466,
          question: "In the Pet entity, the relationship to Owner is annotated with @ManyToOne and @JoinColumn(name = \"owner_id\"). What does this tell us about the mapping?",
          options: [
            "Pet is the inverse side; the foreign key lives in the owner table",
            "The association is bidirectional and Owner is the owning side",
            "Pet is the owning side and the owner_id foreign key column is in the pet table",
            "@JoinColumn here creates a separate join table named owner_id"
          ],
          correct: [2],
          reasoning: "@ManyToOne with @JoinColumn(name=\"owner_id\") makes Pet the owning side, with the owner_id foreign-key column in the pet table."
        },
        {
          id: 467,
          question: "On a @OneToMany association, what does the mappedBy attribute indicate?",
          options: [
            "That this side owns the relationship and holds the foreign key",
            "The name of the join table used for the relationship",
            "That this side is the inverse (non-owning) side, naming the field that owns the mapping on the other entity",
            "The database column name where the foreign key is stored on this entity"
          ],
          correct: [1],
          reasoning: "On @OneToMany, mappedBy marks this side as the inverse (non-owning) side, naming the field that owns the mapping on the other entity."
        },
        {
          id: 468,
          question: "Which annotation marks a class as a JPA entity to be mapped to a database table?",
          options: [
            "@Repository",
            "@Table",
            "@Entity",
            "@Column"
          ],
          correct: [2],
          reasoning: "@Entity marks a class as a JPA entity mapped to a database table."
        },
        {
          id: 469,
          question: "In the Owner entity the phone field is declared as @Column(name = \"phone_no\") private String phoneNumber. What is the purpose of @Column(name = ...) here?",
          options: [
            "It marks phoneNumber as the primary key of the table",
            "It maps the Java field phoneNumber to a table column named phone_no",
            "It declares a foreign key from owner to a phone_no table",
            "It generates the phone_no value automatically on insert"
          ],
          correct: [1],
          reasoning: "@Column(name=\"phone_no\") maps the Java field phoneNumber to a table column named phone_no."
        },
        {
          id: 470,
          question: "In the entities shown, the primary key field is annotated with @Id and @GeneratedValue(strategy=GenerationType.AUTO). What does GenerationType.AUTO mean?",
          options: [
            "The application must always set the id manually before persisting",
            "The id is computed from a hash of the other column values",
            "The persistence provider picks an appropriate generation strategy for the underlying database",
            "The id is always generated by a dedicated TABLE generator only"
          ],
          correct: [2],
          reasoning: "GenerationType.AUTO lets the persistence provider pick an appropriate id-generation strategy for the underlying database."
        },
        {
          id: 471,
          question: "In the Spring Boot example, UserRepository.findAll() is annotated @Transactional(readOnly=true). What does readOnly=true signal?",
          options: [
            "That the method may only be called once per application start",
            "That the transaction is a hint for a read-only operation (no data modification expected)",
            "That the underlying H2 database is mounted as a read-only file",
            "That the returned List<User> is immutable"
          ],
          correct: [1],
          reasoning: "@Transactional(readOnly=true) signals that the transaction is a hint for a read-only operation with no data modification expected."
        },
        {
          id: 472,
          question: "In the JdbcTemplate example, UserRowMapper implements RowMapper<User>. What is the role of its mapRow(ResultSet rs, int rowNum) method?",
          options: [
            "It opens the database connection and starts the query",
            "It commits the surrounding transaction after each row",
            "It maps a single row of the ResultSet into one User object",
            "It defines the SQL SELECT statement that JdbcTemplate executes"
          ],
          correct: [2],
          reasoning: "RowMapper.mapRow(rs, rowNum) maps a single row of the ResultSet into one User object."
        },
        {
          id: 473,
          question: "Which statements about the H2 database, as described in the lecture, are correct? (select all that apply)",
          options: [
            "It supports embedded and server modes and in-memory databases",
            "It is a closed-source commercial database with a large multi-hundred-MB footprint",
            "It provides a browser-based Console application",
            "It can only persist to disk and has no in-memory option"
          ],
          correct: [0, 2],
          reasoning: "H2 supports embedded and server modes and in-memory databases, and provides a browser-based Console application."
        },
        {
          id: 474,
          question: "For the H2 console connection in the example, what is the JDBC URL and default user name?",
          options: [
            "jdbc:mysql://localhost:3306/test, user root",
            "jdbc:h2:mem:testdb, user sa (password left empty)",
            "jdbc:oracle:thin:@localhost:1521:xe, user system",
            "jdbc:h2:file:./prod, user admin"
          ],
          correct: [1],
          reasoning: "The H2 console example uses the JDBC URL jdbc:h2:mem:testdb with user sa and an empty password."
        },
        {
          id: 475,
          question: "What is the PURPOSE of the DAO (Data Access Object) pattern?",
          options: [
            "To weave cross-cutting concerns such as logging into business methods",
            "To generate primary key values for entities automatically",
            "To isolate the application/business layer from the persistence layer using an abstract API",
            "To map Java objects directly to JSON for transport"
          ],
          correct: [2],
          reasoning: "The DAO pattern isolates the application/business layer from the persistence layer using an abstract API."
        },
        {
          id: 476,
          question: "Which AOP advice type runs the advice both before and after the advised method is invoked (and can control whether it proceeds)?",
          options: [
            "before",
            "after-returning",
            "around",
            "after-throwing"
          ],
          correct: [2],
          reasoning: "around advice runs both before and after the method and can control whether it proceeds."
        },
        {
          id: 477,
          question: "What distinguishes \"after\" advice from \"after-returning\" advice?",
          options: [
            "after runs only on exception; after-returning runs only on success",
            "after and after-returning are identical in behavior",
            "after runs regardless of the method outcome; after-returning runs only if the method completes successfully",
            "after runs before the method; after-returning runs after it"
          ],
          correct: [1],
          reasoning: "after runs regardless of the method outcome; after-returning runs only if the method completes successfully."
        },
        {
          id: 478,
          question: "Which advice type runs ONLY if the advised method exits by throwing an exception?",
          options: [
            "after-throwing",
            "after-returning",
            "after",
            "before"
          ],
          correct: [0],
          reasoning: "after-throwing advice runs only if the method exits by throwing an exception."
        },
        {
          id: 479,
          question: "According to the AOP vocabulary, what is a \"join point\"?",
          options: [
            "An expression that locates where advice will be applied",
            "A point in program execution where an aspect can be plugged in (e.g. a method execution)",
            "The action performed at a selected location in the code",
            "The modularization of a cross-cutting concern"
          ],
          correct: [1],
          reasoning: "A join point is a point in program execution where an aspect can be plugged in (e.g. a method execution)."
        },
        {
          id: 480,
          question: "How does the lecture define a \"pointcut\" (as distinct from a join point)?",
          options: [
            "The action (code) to be executed at a join point",
            "An object created by the AOP framework to implement aspect contracts",
            "An expression that locates / matches the join points to which the advice will be applied",
            "Linking aspects with application objects to produce an advised object"
          ],
          correct: [2],
          reasoning: "A pointcut is an expression that matches the join points to which advice is applied."
        },
        {
          id: 481,
          question: "What is \"weaving\" in AOP terminology?",
          options: [
            "The expression language used to match join points",
            "The chain of interceptors maintained around a join point",
            "Linking aspects with other application types/objects to create an advised object",
            "Declaring additional methods and attributes for a particular type"
          ],
          correct: [2],
          reasoning: "Weaving is linking aspects with other application types/objects to create an advised object."
        },
        {
          id: 482,
          question: "Weaving can be performed at several times. Which weaving time does Spring AOP use?",
          options: [
            "Compile time, using the AspectJ compiler (ajc)",
            "Post-compile (binary) weaving",
            "Load time, via a load-time weaver",
            "Runtime"
          ],
          correct: [3],
          reasoning: "Spring AOP performs weaving at runtime."
        },
        {
          id: 483,
          question: "According to the Spring AOP vs AspectJ comparison, which weaving times does AspectJ support (but Spring AOP does NOT)? (select all that apply)",
          options: [
            "Compile-time weaving",
            "Post-compile weaving",
            "Load-time weaving",
            "Runtime weaving"
          ],
          correct: [0, 1, 2],
          reasoning: "AspectJ supports compile-time, post-compile and load-time weaving, which Spring AOP does not."
        },
        {
          id: 484,
          question: "The Spring AOP vs AspectJ join point table lists many join point kinds. Which kind does Spring AOP actually support?",
          options: [
            "Constructor execution",
            "Field reference and field assignment",
            "Method execution",
            "Method call"
          ],
          correct: [2],
          reasoning: "Spring AOP supports only the method-execution join point."
        },
        {
          id: 485,
          question: "Per the comparison table, which join point kinds are supported by AspectJ but NOT by Spring AOP? (select all that apply)",
          options: [
            "Method call",
            "Constructor execution",
            "Method execution",
            "Field assignment"
          ],
          correct: [0, 1, 3],
          reasoning: "Method call, constructor execution and field assignment join points are supported by AspectJ but not Spring AOP."
        },
        {
          id: 486,
          question: "In the Spring Framework, an AOP proxy will be created as one of which two kinds?",
          options: [
            "A static-initializer weaver or a bytecode patcher",
            "A JDK dynamic proxy or a CGLIB proxy",
            "An ajc-compiled aspect or a load-time weaver",
            "A reflection handler or a serialization proxy"
          ],
          correct: [1],
          reasoning: "A Spring AOP proxy is created as either a JDK dynamic proxy or a CGLIB proxy."
        },
        {
          id: 487,
          question: "In Spring AOP's proxy-based model, how do the pointcut designators this and target differ?",
          options: [
            "this binds to the target object behind the proxy; target binds to the proxy",
            "this binds to the proxy object itself; target binds to the target object behind the proxy",
            "Both this and target always refer to the same object, as in AspectJ",
            "this matches by argument type; target matches by return type"
          ],
          correct: [1],
          reasoning: "In proxy-based Spring AOP, this binds to the proxy object itself while target binds to the target object behind the proxy."
        },
        {
          id: 488,
          question: "Which pointcut designators are supported in Spring AOP (as opposed to being AspectJ-only)? (select all that apply)",
          options: [
            "execution",
            "call",
            "within",
            "@annotation",
            "get",
            "set",
            "cflow"
          ],
          correct: [0, 2, 3],
          reasoning: "Spring AOP supports execution, within and @annotation; call, get, set and cflow are AspectJ-only."
        },
        {
          id: 489,
          question: "In @AfterReturning(pointcut = \"businessService()\", returning = \"retVal\"), what is the role of the returning attribute?",
          options: [
            "It names the exception thrown by the advised method",
            "It binds the value returned by the advised method to the named advice parameter (retVal)",
            "It specifies the pointcut signature method to reuse",
            "It declares that the advice should run even when the method throws"
          ],
          correct: [1],
          reasoning: "The returning attribute binds the value returned by the advised method to the named advice parameter."
        },
        {
          id: 490,
          question: "In @AfterThrowing(pointcut = \"businessService()\", throwing = \"ex\"), what does the throwing attribute do?",
          options: [
            "It causes the advice itself to throw the named exception",
            "It re-binds the method's normal return value to ex",
            "It binds the exception thrown by the advised method to the advice parameter named ex",
            "It suppresses the exception so callers never see it"
          ],
          correct: [2],
          reasoning: "The throwing attribute binds the exception thrown by the advised method to the named advice parameter."
        },
        {
          id: 491,
          question: "In an RDF triple, which combination of term types is permitted for the OBJECT position?",
          options: [
            "Only URIRefs",
            "A URIRef, a blank node, or a literal",
            "A URIRef or a blank node, but never a literal",
            "Only literals, since the object is always a property value"
          ],
          correct: [1],
          reasoning: "The object of a triple may be a URIRef, a blank node, or a literal."
        },
        {
          id: 492,
          question: "A blank node (b-node) in an RDF graph may appear in which triple positions?",
          options: [
            "Subject or object, but never predicate (in standard RDF)",
            "Subject, predicate or object",
            "Object only, like a literal",
            "Predicate only, to represent anonymous properties"
          ],
          correct: [0],
          reasoning: "A blank node may appear as subject or object, but never as a predicate in standard RDF."
        },
        {
          id: 493,
          question: "Which statements about RDF literals are correct? (select all that apply)",
          options: [
            "A plain literal may carry an optional language tag (e.g. @en)",
            "Literals can be used both as subjects and as objects of statements",
            "A typed literal ends with a ^^ suffix followed by a datatype URI reference",
            "A single literal may carry both a language tag and a datatype URI at the same time"
          ],
          correct: [0, 2],
          reasoning: "A plain literal may carry an optional language tag, and a typed literal ends with ^^ followed by a datatype URI; a literal cannot carry both a language tag and a datatype at once, and literals are never subjects."
        },
        {
          id: 494,
          question: "Which RDF container type represents an UNORDERED collection in which duplicate members are allowed?",
          options: [
            "rdf:Seq",
            "rdf:Bag",
            "rdf:Alt",
            "rdf:List"
          ],
          correct: [1],
          reasoning: "rdf:Bag is an unordered collection in which duplicate members are allowed."
        },
        {
          id: 495,
          question: "The rdf:Alt container is intended to model which kind of grouping?",
          options: [
            "An ordered sequence of elements",
            "An unordered set with duplicates",
            "A recursive head/tail linked list",
            "A set of alternatives, possibly with a preference ordering, from which one is selected"
          ],
          correct: [3],
          reasoning: "rdf:Alt models a set of alternatives (with optional preference ordering) from which one is selected."
        },
        {
          id: 496,
          question: "Which terms belong to the RDF vocabulary used to build an rdf:List (collection) structure? (select all that apply)",
          options: [
            "rdf:_1",
            "rdf:first",
            "rdf:rest",
            "rdf:Bag"
          ],
          correct: [1, 2],
          reasoning: "rdf:first and rdf:rest are the RDF terms used to build an rdf:List structure."
        },
        {
          id: 497,
          question: "In an rdf:List, what role does rdf:nil play?",
          options: [
            "It is the head element of the list",
            "It is a property linking each element to the next",
            "It is an instance of rdf:List representing the empty list, appearing as the object of the final rdf:rest",
            "It is the datatype assigned to list members"
          ],
          correct: [2],
          reasoning: "rdf:nil is an instance of rdf:List representing the empty list, appearing as the object of the final rdf:rest."
        },
        {
          id: 498,
          question: "Which properties form the RDF reification vocabulary used to make statements about statements? (select all that apply)",
          options: [
            "rdf:subject",
            "rdf:value",
            "rdf:predicate",
            "rdf:object"
          ],
          correct: [0, 2, 3],
          reasoning: "The reification vocabulary is rdf:subject, rdf:predicate and rdf:object (with rdf:Statement)."
        },
        {
          id: 499,
          question: "What is the purpose of reification in RDF?",
          options: [
            "To compress an RDF graph into a binary serialization",
            "To build higher-order statements, i.e. statements about other RDF statements, turning them into accessible resources",
            "To validate a graph syntactically against an XML schema",
            "To define new datatypes for literal values"
          ],
          correct: [1],
          reasoning: "Reification builds higher-order statements — statements about other RDF statements — turning them into accessible resources."
        },
        {
          id: 500,
          question: "How does validation against an RDF Schema differ from validation against an XML Schema?",
          options: [
            "RDFS performs a stricter syntactic check than XML Schema",
            "RDFS validation rejects any document that is not well-formed XML",
            "RDFS does no syntax check; consistency is a graph-consistency check done on demand by a reasoning engine, so inconsistent triples may be added unnoticed until a check runs",
            "RDFS and XML Schema validation are identical in mechanism and effect"
          ],
          correct: [2],
          reasoning: "RDFS does no syntax check; consistency is a graph-consistency check run on demand by a reasoner, so inconsistent triples can be added unnoticed until a check runs."
        },
        {
          id: 501,
          question: "For a property P, the triple \"P rdfs:range C\" constrains which part of triples that use P as predicate?",
          options: [
            "The objects of those triples are inferred to be instances of class C",
            "The subjects of those triples are inferred to be instances of class C",
            "The predicates of those triples are inferred to be instances of class C",
            "It checks that C is syntactically well-formed XML"
          ],
          correct: [0],
          reasoning: "rdfs:range C on P means the objects of triples using P are inferred to be instances of class C."
        },
        {
          id: 502,
          question: "A property P is given more than one rdfs:range, e.g. \"P rdfs:range C1\" and \"P rdfs:range C2\". What does this mean for an object o of a triple using P?",
          options: [
            "o must be an instance of either C1 or C2, the reasoner picks one",
            "o is inferred to be an instance of ALL the classes stated by the rdfs:range properties (C1 and C2)",
            "The two range statements conflict and make the graph inconsistent",
            "Only the last declared range, C2, applies"
          ],
          correct: [1],
          reasoning: "Multiple rdfs:range declarations all apply: the object is inferred to be an instance of all the stated range classes (C1 and C2)."
        },
        {
          id: 503,
          question: "Which statements about rdfs:Resource and the RDFS class system are correct? (select all that apply)",
          options: [
            "rdfs:Resource is the class of everything; all other classes are subclasses of it",
            "rdfs:Resource is itself an instance of rdfs:Resource only and never of rdfs:Class",
            "rdfs:Resource is an instance of rdfs:Class",
            "rdfs:Literal is a subclass of rdfs:Resource"
          ],
          correct: [0, 2, 3],
          reasoning: "rdfs:Resource is the class of everything and is itself an instance of rdfs:Class; rdfs:Literal is a subclass of rdfs:Resource."
        },
        {
          id: 504,
          question: "In RDF/XML, how is the SUBJECT of the statements grouped inside an rdf:Description element declared?",
          options: [
            "By the rdf:resource attribute",
            "By the rdf:nodeID attribute only",
            "By the rdf:about attribute",
            "By the rdf:datatype attribute"
          ],
          correct: [2],
          reasoning: "In RDF/XML the subject is declared by the rdf:about attribute on the rdf:Description element."
        },
        {
          id: 505,
          question: "In RDF/XML, when the object of a statement is a resource expressed through a predicate element, which attribute carries that object's URI?",
          options: [
            "rdf:about",
            "rdf:ID",
            "rdf:resource",
            "rdf:nodeID"
          ],
          correct: [2],
          reasoning: "When the object is a resource expressed through a predicate element, the rdf:resource attribute carries that object's URI."
        },
        {
          id: 506,
          question: "How does the rdf:ID attribute on a node element behave with respect to the base URI?",
          options: [
            "It gives an absolute URI used verbatim, ignoring xml:base",
            "It gives a relative RDF URI reference equivalent to \"#\" concatenated with the rdf:ID value, resolved against the base URI",
            "It is identical to rdf:resource and may appear on property elements",
            "It declares a blank node identifier, like rdf:nodeID"
          ],
          correct: [1],
          reasoning: "rdf:ID gives a relative RDF URI reference equal to '#' concatenated with the rdf:ID value, resolved against the base URI."
        },
        {
          id: 507,
          question: "What is the role of the rdf:nodeID attribute in RDF/XML?",
          options: [
            "It declares a typed literal datatype",
            "It sets the base URI for relative references",
            "It allows the same blank node to be used in several places, replacing rdf:about (on a Description) or rdf:resource (on a property element)",
            "It marks a property value as an XML literal"
          ],
          correct: [2],
          reasoning: "rdf:nodeID lets the same blank node be referenced in several places, replacing rdf:about (on a Description) or rdf:resource (on a property element)."
        },
        {
          id: 508,
          question: "In RDF/XML, which rdf:parseType value is used so that the content of a property node is treated as an XML literal?",
          options: [
            "rdf:parseType=\"Resource\"",
            "rdf:parseType=\"Collection\"",
            "rdf:parseType=\"Literal\"",
            "rdf:parseType=\"XML\""
          ],
          correct: [2],
          reasoning: "rdf:parseType=\"Literal\" makes the property node's content be treated as an XML literal."
        },
        {
          id: 509,
          question: "Which statements about Turtle syntax are correct? (select all that apply)",
          options: [
            "The keyword \"a\" is shorthand for rdf:type",
            "A comma separates multiple objects that share the same subject AND predicate",
            "A semicolon groups several predicate-object pairs that share the same subject",
            "Square brackets [ ] are used to define a named container of type rdf:Seq"
          ],
          correct: [0, 1, 2],
          reasoning: "In Turtle, 'a' is shorthand for rdf:type, a comma separates objects sharing the same subject and predicate, and a semicolon groups predicate-object pairs sharing the same subject."
        },
        {
          id: 510,
          question: "In Turtle, what do round parentheses ( ) denote?",
          options: [
            "A blank node with no explicit identifier",
            "A language-tagged literal",
            "An RDF collection (list) written in shorthand",
            "A comment running to the end of the line"
          ],
          correct: [2],
          reasoning: "In Turtle, round parentheses ( ) denote an RDF collection (list) written in shorthand."
        },
        {
          id: 511,
          question: "According to the lecture, from which earlier language did OWL descend, and when did the original OWL become a W3C Recommendation?",
          options: [
            "From SHOE, becoming a Recommendation in October 2009",
            "From DAML+OIL (an amalgamation of DAML and OIL), becoming a Recommendation in February 2004",
            "From SPARQL, becoming a Recommendation in December 2006",
            "From Turtle, becoming a Recommendation in May 2024"
          ],
          correct: [1],
          reasoning: "OWL descended from DAML+OIL (an amalgamation of DAML and OIL) and became a W3C Recommendation in February 2004."
        },
        {
          id: 512,
          question: "The \"type separation\" restriction that distinguishes OWL DL from OWL Full means that:",
          options: [
            "Datatype properties and object properties may freely overlap",
            "Classes must be serialized separately from individuals in distinct files",
            "A class cannot also be an individual or a property, and a property cannot also be an individual or a class",
            "Every class must be declared disjoint from every other class"
          ],
          correct: [2],
          reasoning: "Type separation (OWL DL vs OWL Full) means a class cannot also be an individual or property, and a property cannot also be an individual or class."
        },
        {
          id: 513,
          question: "Which OWL 2 profile enables conjunctive queries to be answered in LogSpace (more precisely AC0) using standard relational database technology?",
          options: [
            "OWL 2 EL",
            "OWL 2 RL",
            "OWL 2 Full",
            "OWL 2 QL"
          ],
          correct: [3],
          reasoning: "OWL 2 QL enables conjunctive queries to be answered in LogSpace (AC0) using standard relational database technology."
        },
        {
          id: 514,
          question: "Which OWL 2 profiles are described as enabling polynomial-time reasoning algorithms? (select all that apply)",
          options: [
            "OWL 2 EL",
            "OWL 2 QL",
            "OWL 2 RL",
            "OWL 2 Full"
          ],
          correct: [0, 2],
          reasoning: "OWL 2 EL and OWL 2 RL enable polynomial-time reasoning algorithms."
        },
        {
          id: 515,
          question: "According to the lecture, which of the following are standard OWL reasoning tasks? (select all that apply)",
          options: [
            "Consistency check (are there contradictions in the model?)",
            "Classification (what are all the inferred types of a resource?)",
            "Canonicalization of the RDF dataset into N-Quads",
            "Satisfiability check (are there classes that cannot possibly have members?)"
          ],
          correct: [0, 1, 3],
          reasoning: "Standard OWL reasoning tasks include consistency checking, classification and satisfiability checking."
        },
        {
          id: 516,
          question: "Which disjointness rules does the lecture state for OWL entity typing? (select all that apply)",
          options: [
            "A single URI may never be typed as both a class and an individual",
            "Object, datatype and annotation properties must be disjoint; no URI may be typed as more than one kind of property",
            "Classes and datatypes must be disjoint; no URI may be typed as both a class and a datatype",
            "Individuals and literals must be disjoint, so no individual may have a literal property value"
          ],
          correct: [1, 2],
          reasoning: "Property kinds (object, datatype, annotation) must be pairwise disjoint, and classes and datatypes must be disjoint — no URI may be typed as more than one."
        },
        {
          id: 517,
          question: "An owl:InverseFunctionalProperty differs from an owl:FunctionalProperty in that:",
          options: [
            "Both guarantee at most one domain value per range value",
            "Inverse functional means the property is also symmetric",
            "Functional means a given domain (subject) value has only a single range value, while inverse functional means a given range (object) value has only a single domain value",
            "Functional applies only to datatype properties and inverse functional only to object properties"
          ],
          correct: [2],
          reasoning: "Functional means a subject has at most one value of the property; inverse functional means a given object value is linked to at most one subject."
        },
        {
          id: 518,
          question: "What is the difference between owl:allValuesFrom and owl:someValuesFrom on a restriction?",
          options: [
            "Both require at least one value from the specified range",
            "allValuesFrom requires that all values of the property come only from the specified range; someValuesFrom requires at least one value from the specified range",
            "allValuesFrom fixes a single specific value; someValuesFrom counts the cardinality",
            "someValuesFrom requires all values from the range; allValuesFrom requires exactly one"
          ],
          correct: [1],
          reasoning: "allValuesFrom requires that all values of the property come only from the specified range; someValuesFrom requires at least one value from it."
        },
        {
          id: 519,
          question: "Under the Open World Assumption and the No Unique Names Assumption used in OWL, which is true?",
          options: [
            "Anything not known to be true is taken to be false, and distinct URIs always denote distinct resources",
            "Anything not known to be true is taken to be false, but distinct URIs may denote the same resource",
            "Not knowing a statement is explicitly true does not imply it is false, and two different URIs cannot be assumed to denote different resources unless stated",
            "Every statement is either provably true or provably false, and each resource has exactly one URI"
          ],
          correct: [2],
          reasoning: "Under OWA and No-Unique-Names, not knowing a statement is true does not make it false, and two different URIs are not assumed to denote different resources unless stated."
        },
        {
          id: 520,
          question: "Regarding the XSD facets supported by OWL, which statements are correct? (select all that apply)",
          options: [
            "xsd:minInclusive requires values strictly greater than N",
            "xsd:minExclusive requires values strictly greater than N",
            "xsd:fractionDigits gives the maximum number of decimal places allowed",
            "xsd:totalDigits gives the maximum number of decimal places allowed"
          ],
          correct: [1, 2],
          reasoning: "xsd:minExclusive requires values strictly greater than N, and xsd:fractionDigits gives the maximum number of decimal places allowed."
        },
        {
          id: 521,
          question: "In RDFa, which attribute is used to indicate the subject IRI reference of a triple?",
          options: [
            "@about",
            "@property",
            "@resource",
            "@content"
          ],
          correct: [0],
          reasoning: "In RDFa, @about indicates the subject IRI reference of a triple."
        },
        {
          id: 522,
          question: "In RDFa, which attributes represent objects that are IRI references (rather than predicates or literals)? (select all that apply)",
          options: [
            "@property",
            "@resource",
            "@href",
            "@content"
          ],
          correct: [1, 2],
          reasoning: "In RDFa, @resource and @href represent objects that are IRI references."
        },
        {
          id: 523,
          question: "Which statements about SHACL Rules (an advanced feature) are correct according to the lecture? (select all that apply)",
          options: [
            "rules are values of the property sh:target at a shape",
            "supported rule types include Triple rules and SPARQL rules, each identified by an IRI through rdf:type",
            "sh:order and sh:deactivated are constraint components, not rule properties",
            "sh:condition specifies shapes that the focus nodes must conform to before the rule gets executed"
          ],
          correct: [1, 3],
          reasoning: "SHACL rule types include Triple rules and SPARQL rules, each identified by an IRI via rdf:type; sh:condition specifies shapes the focus nodes must conform to before the rule runs."
        },
        {
          id: 524,
          question: "According to the lecture, how are the DASH and TOSH vocabularies described?",
          options: [
            "DASH is the core W3C SHACL namespace; TOSH is its OWL counterpart",
            "both DASH and TOSH are alternative names for the sh: core namespace",
            "DASH is an extension to SHACL developed by TopQuadrant; TOSH is a standard include of all asset collections in TopBraid",
            "DASH validates XML while TOSH validates JSON-LD"
          ],
          correct: [2],
          reasoning: "DASH is an extension to SHACL developed by TopQuadrant; TOSH is a standard include of all asset collections in TopBraid."
        },
        {
          id: 525,
          question: "When mapping Microdata to RDF (RDFa), how is the Microdata @itemprop attribute handled?",
          options: [
            "it is dropped",
            "it is replaced with @typeof",
            "it is replaced with @about",
            "it is replaced with @property"
          ],
          correct: [3],
          reasoning: "When mapping Microdata to RDFa, the @itemprop attribute is replaced with @property."
        },
        {
          id: 526,
          question: "According to the lecture, exactly two features of Microdata are NOT supported by RDFa Lite. Which two are they? (select all that apply)",
          options: [
            "@itemref",
            "@itemprop",
            "@itemtype",
            "@itemscope"
          ],
          correct: [0, 3],
          reasoning: "RDFa Lite does not support the Microdata features @itemref and @itemscope."
        },
        {
          id: 527,
          question: "In SHACL, what is a focus node?",
          options: [
            "a node in the shapes graph that declares which constraint components are mandatory",
            "an RDF term that is validated against a shape using the triples from a data graph",
            "the IRI of a constraint component that has been violated during validation",
            "the root node of the SPARQL query produced from a SHACL-SPARQL constraint"
          ],
          correct: [1],
          reasoning: "In SHACL a focus node is an RDF term that is validated against a shape using the triples from a data graph."
        },
        {
          id: 528,
          question: "According to the lecture's OWL vs SHACL comparison, which statements correctly characterize the two technologies? (select all that apply)",
          options: [
            "OWL uses the closed-world assumption while SHACL uses the open-world assumption",
            "OWL works under the open-world assumption, uses a tableau reasoner and infers new triples",
            "SHACL uses the closed-world assumption and validates data against declared shapes using SPARQL",
            "SHACL infers new triples via a tableau reasoner instead of validating"
          ],
          correct: [1, 2],
          reasoning: "OWL works under the open-world assumption, uses a tableau reasoner and infers new triples; SHACL uses the closed-world assumption and validates data against shapes using SPARQL."
        },
        {
          id: 529,
          question: "According to the lecture, what is the role of the Webmention standard?",
          options: [
            "it defines the HTTP 303 redirect used in content negotiation",
            "it uses microformats to let messages and comments be sent from one site to another",
            "it is the JSON-LD serialization format for semantic graphs",
            "it is the registry of all schema.org vocabulary terms"
          ],
          correct: [1],
          reasoning: "Webmention uses microformats to let messages and comments be sent from one site to another."
        },
        {
          id: 530,
          question: "According to the lecture, what is one of the simplest methods for embedding structured data (JSON-LD) inside web pages?",
          options: [
            "using @prefix and @vocab attributes on the <body> element",
            "using the rel and class attributes on anchor elements",
            "using a <script> node as a placeholder of the whole graph encoded in JSON-LD",
            "using a <link rel=\"meta\"> element pointing at the JSON-LD file"
          ],
          correct: [2],
          reasoning: "One of the simplest ways to embed JSON-LD is a <script> node holding the whole graph encoded in JSON-LD."
        },
        {
          id: 531,
          question: "In the content-negotiation example, after a 303 redirect to a generic document the server returns 200 OK with the RDF representation. Which header carries the URI of the specific representation actually returned (e.g. http://example.com/doc/jan.rdf)?",
          options: [
            "Location",
            "Accept",
            "Content-Location",
            "Content-Language"
          ],
          correct: [2],
          reasoning: "The Content-Location header carries the URI of the specific representation actually returned."
        },
        {
          id: 532,
          question: "In content negotiation between an RDF and an HTML representation of a resource, which request header does the server inspect to decide which representation to serve?",
          options: [
            "Content-Location",
            "Accept",
            "Location",
            "Content-Type"
          ],
          correct: [1],
          reasoning: "The server inspects the Accept request header to decide which representation to serve."
        },
        {
          id: 533,
          question: "According to the SKOS axioms, what OWL characteristic does skos:related have?",
          options: [
            "it is an owl:TransitiveProperty",
            "it is an owl:SymmetricProperty",
            "it is an owl:FunctionalProperty",
            "it is an owl:AnnotationProperty"
          ],
          correct: [1],
          reasoning: "skos:related is an owl:SymmetricProperty."
        },
        {
          id: 534,
          question: "Which of the following SKOS axioms are stated correctly? (select all that apply)",
          options: [
            "skos:broaderTransitive and skos:narrowerTransitive are each instances of owl:TransitiveProperty",
            "skos:broader is an instance of owl:SymmetricProperty",
            "skos:narrower is owl:inverseOf the property skos:broader",
            "skos:related is a sub-property of skos:broader"
          ],
          correct: [0, 2],
          reasoning: "skos:broaderTransitive and skos:narrowerTransitive are owl:TransitiveProperty instances, and skos:narrower is owl:inverseOf skos:broader."
        },
        {
          id: 535,
          question: "According to the SKOS axioms, what is the relationship between skos:prefLabel, skos:altLabel, skos:hiddenLabel and rdfs:label?",
          options: [
            "they are each owl:equivalentProperty of rdfs:label",
            "they are each instances of rdfs:label",
            "they are each sub-properties of rdfs:label and instances of owl:AnnotationProperty",
            "rdfs:label is a sub-property of each of them"
          ],
          correct: [2],
          reasoning: "skos:prefLabel, skos:altLabel and skos:hiddenLabel are sub-properties of rdfs:label and instances of owl:AnnotationProperty."
        },
        {
          id: 536,
          question: "What does the SKOS axiom about skos:prefLabel state regarding labels per language?",
          options: [
            "a resource must have at least one skos:prefLabel per language",
            "a resource has no more than one value of skos:prefLabel per language",
            "a resource may have any number of skos:prefLabel values in the same language",
            "skos:prefLabel may carry both a language tag and a datatype URI"
          ],
          correct: [1],
          reasoning: "The axiom states a resource has no more than one skos:prefLabel value per language."
        },
        {
          id: 537,
          question: "Which of the following SKOS disjointness/uniqueness axioms are stated in the lecture? (select all that apply)",
          options: [
            "skos:ConceptScheme is disjoint with skos:Concept",
            "skos:Concept is disjoint with rdfs:Class",
            "skos:prefLabel is disjoint with skos:related",
            "skos:related is disjoint with the property skos:broaderTransitive"
          ],
          correct: [0, 3],
          reasoning: "skos:ConceptScheme is disjoint with skos:Concept, and skos:related is disjoint with skos:broaderTransitive."
        },
        {
          id: 538,
          question: "In the OWL cardinality worked example, the class :Average is defined as an owl:intersectionOf of two restrictions on :hasBrother. Which restrictions?",
          options: [
            "owl:someValuesFrom owl:Thing and owl:allValuesFrom :Person",
            "owl:minCardinality \"1\" and owl:maxCardinality \"2\"",
            "owl:minCardinality \"3\" and owl:maxCardinality \"4\"",
            "owl:cardinality \"3\" only"
          ],
          correct: [2],
          reasoning: ":Average is the owl:intersectionOf of owl:minCardinality 3 and owl:maxCardinality 4 on :hasBrother."
        },
        {
          id: 539,
          question: "In the \"closing the world in SPARQL\" example, the count of brothers is computed in a sub-SELECT with GROUP BY, and the result is restricted to those grouped counts. Which clause performs that restriction on the aggregated count?",
          options: [
            "a FILTER clause inside the inner WHERE",
            "an ORDER BY clause on the count",
            "a HAVING clause on the aggregated count",
            "a LIMIT clause on the outer query"
          ],
          correct: [2],
          reasoning: "A HAVING clause restricts the aggregated count produced by GROUP BY."
        },
        {
          id: 540,
          question: "In the \"closing the world in SPARQL\" example that classifies individuals as cnt:Few, which SPARQL query form is used at the top level to produce the new classifying triples?",
          options: [
            "CONSTRUCT",
            "ASK",
            "DESCRIBE",
            "SELECT"
          ],
          correct: [0],
          reasoning: "The CONSTRUCT query form is used at the top level to produce the new classifying triples."
        },
        {
          id: 541,
          question: "According to the lecture, why are SPARQL endpoints described as NOT being RESTful? (select all that apply)",
          options: [
            "they require all queries to be sent in the URI path segments",
            "they accept GET requests with the query in a query attribute (not in the path), so queries must be HTML-encoded",
            "responses can only ever be returned as application/rdf+xml",
            "update/delete requests are not handled with PUT/DELETE HTTP methods"
          ],
          correct: [1, 3],
          reasoning: "SPARQL endpoints are not RESTful: queries go in a query attribute (HTML-encoded) rather than the path, and update/delete are not done with PUT/DELETE HTTP methods."
        },
        {
          id: 542,
          question: "The lecture states that SPARQL is not only an RDF query language but also a protocol built on top of HTTP. Which two operations does that protocol offer?",
          options: [
            "GET and POST",
            "read and write",
            "PUT and DELETE",
            "query and update"
          ],
          correct: [3],
          reasoning: "The SPARQL protocol over HTTP offers two operations: query and update."
        },
        {
          id: 543,
          question: "In SHACL, the targets of a shape are normally used to select focus nodes. What does the lecture say happens to those target declarations when a focus node is provided directly as input to the validation process for that shape?",
          options: [
            "the targets take precedence over the supplied focus node",
            "the targets are ignored",
            "validation fails because targets and a focus node cannot coexist",
            "the supplied focus node is intersected with the target set"
          ],
          correct: [1],
          reasoning: "When a focus node is supplied directly to validation, the shape's target declarations are ignored."
        },
        {
          id: 544,
          question: "Which statements about SHACL constraint components are correct according to the lecture? (select all that apply)",
          options: [
            "a constraint component has no parameters; it is referenced directly by its IRI in the data graph",
            "a constraint component is an IRI and has one or more mandatory parameters and zero or more optional parameters, each parameter being a property",
            "constraint components are associated with validators, and their properties are used in shapes without explicitly mentioning the component IRIs",
            "a focus node is validated against a shape using triples from the shapes graph, never the data graph"
          ],
          correct: [1, 2],
          reasoning: "A SHACL constraint component is an IRI with one or more mandatory and zero or more optional parameters (each a property); components are associated with validators, and their properties are used in shapes without naming the component IRIs."
        },
        {
          id: 545,
          question: "Which of the following are valid values of sh:nodeKind among the SHACL Core constraints listed? (select all that apply)",
          options: [
            "sh:BlankNodeOrLiteral",
            "sh:LiteralOrClass",
            "sh:IRIOrLiteral",
            "sh:IRIOrBlankNodeOrLiteral"
          ],
          correct: [0, 2],
          reasoning: "Valid sh:nodeKind values include sh:BlankNodeOrLiteral, sh:IRIOrLiteral and sh:IRIOrBlankNodeOrLiteral."
        },
        {
          id: 546,
          question: "Which of the following is NOT required for an XML document to be merely WELL-FORMED (as opposed to valid)?",
          options: [
            "There is exactly one root element",
            "The document conforms to a predefined schema",
            "All other elements are cleanly nested, with no overlapping",
            "All attribute values are enclosed in quotation marks and assigned with the = operator"
          ],
          correct: [1],
          reasoning: "A merely well-formed XML document need not conform to a predefined schema — conformance to a schema is what makes it valid, not well-formed."
        },
        {
          id: 547,
          question: "According to the lecture, how many \"flavours\" of XML tag exist, and what are they?",
          options: [
            "Two: start-tag and end-tag",
            "Four: start-tag, end-tag, empty-element tag and comment tag",
            "Three: start-tag, end-tag and empty-element tag",
            "Three: start-tag, end-tag and processor directive"
          ],
          correct: [2],
          reasoning: "There are three flavours of XML tag: start-tag, end-tag and empty-element tag."
        },
        {
          id: 548,
          question: "Select all TRUE statements about DTD primitive/data types as described in the lecture.",
          options: [
            "PCDATA can be used for an element's content but not for an attribute",
            "An NMTOKEN may contain spaces and whitespace as long as it is escaped",
            "An attribute declared of type ID must be unique across all ID values in the XML document",
            "CDATA places strict numeric-only restrictions on the textual data it holds"
          ],
          correct: [0, 2],
          reasoning: "PCDATA can be used for element content but not for an attribute, and an ID-typed attribute value must be unique across all IDs in the document."
        },
        {
          id: 549,
          question: "In the DTD syntax glossary, which cardinality symbol denotes \"One to Many (1-n)\" for an element?",
          options: [
            "The asterisk *",
            "The plus sign +",
            "The question mark ?",
            "The comma ,"
          ],
          correct: [1],
          reasoning: "The plus sign + denotes One to Many (1-n) cardinality for an element."
        },
        {
          id: 550,
          question: "In a DTD, what does the attribute property #FIXED specify?",
          options: [
            "The attribute is optional (0-1)",
            "The attribute is required",
            "The attribute must have a specific value",
            "The attribute value is loaded from a URI"
          ],
          correct: [2],
          reasoning: "In a DTD, #FIXED specifies that the attribute must have a specific value."
        },
        {
          id: 551,
          question: "In the lecture's DTD-based validation example, the document type was declared with `<!DOCTYPE Message SYSTEM \"message.dtd\">`. What does the SYSTEM keyword indicate?",
          options: [
            "The entity/DTD value is to be loaded from a URI",
            "The entity value is referred to by a public identifier only",
            "The element has mixed content",
            "The attribute must conform to the ID naming rules"
          ],
          correct: [0],
          reasoning: "The SYSTEM keyword indicates the entity/DTD value is to be loaded from a URI."
        },
        {
          id: 552,
          question: "In the XML Schema validation example, the instance document referenced a schema with NO target namespace. Which attribute was used in the `<Message>` element for that?",
          options: [
            "xsi:schemaLocation",
            "xsi:noNamespaceSchemaLocation",
            "targetNamespace",
            "elementFormDefault"
          ],
          correct: [1],
          reasoning: "For a schema with no target namespace, the instance uses the xsi:noNamespaceSchemaLocation attribute."
        },
        {
          id: 553,
          question: "Select all statements that are TRUE about XML Schema (XSD) as presented in the lecture material.",
          options: [
            "An XSD can declare named complexType and simpleType constructs",
            "A DTD, unlike XSD, is itself written using XML Schema instance syntax",
            "An XSD may use attributes such as targetNamespace and elementFormDefault",
            "XML Schema cannot provide datatypes such as xs:date or xs:string"
          ],
          correct: [0, 2],
          reasoning: "An XSD can declare named complexType and simpleType constructs and may use attributes such as targetNamespace and elementFormDefault."
        },
        {
          id: 554,
          question: "According to the SOA \"basic scenario\" in the lecture, where does a client learn about the operations provided and data types used by a web service?",
          options: [
            "From the UDDI yellow pages classification",
            "From the service's WSDL document description",
            "From the SOAP Envelope header",
            "From the BPEL orchestration process"
          ],
          correct: [1],
          reasoning: "A client learns the operations provided and data types used from the service's WSDL document description."
        },
        {
          id: 555,
          question: "Which statement about WSDL versions is correct according to the lecture?",
          options: [
            "WSDL 1.1 binds to all HTTP request methods, making it better suited for REST",
            "WSDL 2.0 accepts binding to all HTTP request methods, not only GET and POST as in WSDL 1.1",
            "WSDL 2.0 was renamed from WSDL 1.0 with no substantial differences",
            "WSDL 1.1 is the current W3C recommendation, while WSDL 2.0 is only a draft"
          ],
          correct: [1],
          reasoning: "WSDL 2.0 accepts binding to all HTTP request methods, not only GET and POST as in WSDL 1.1."
        },
        {
          id: 556,
          question: "Select all elements that belong to the ABSTRACT section of a WSDL 1.1 document.",
          options: [
            "portType",
            "message",
            "types",
            "service"
          ],
          correct: [0, 1, 2],
          reasoning: "The abstract section of a WSDL 1.1 document contains portType, message and types; service is concrete."
        },
        {
          id: 557,
          question: "When moving from WSDL 1.1 to WSDL 2.0, the `<portType>` element was renamed and the root element changed. Which mapping is correct?",
          options: [
            "portType becomes service; root definitions becomes description",
            "portType becomes interface; root definitions becomes description",
            "portType becomes binding; root description becomes definitions",
            "portType becomes endpoint; root definitions stays as definitions"
          ],
          correct: [1],
          reasoning: "In WSDL 2.0 portType becomes interface and the root definitions element becomes description."
        },
        {
          id: 558,
          question: "In WSDL 1.1, what is the role of the `<binding>` element?",
          options: [
            "It is a container for data type definitions used in messages",
            "It defines the abstract format of exchanged messages via parts",
            "It specifies a concrete protocol binding and data encoding for a given portType",
            "It defines a concrete endpoint with the URL to the service location"
          ],
          correct: [2],
          reasoning: "In WSDL 1.1 the binding element specifies a concrete protocol binding and data encoding for a given portType."
        },
        {
          id: 559,
          question: "In a WSDL 1.1 `<service>` element, what does a single nested `<port>` element represent?",
          options: [
            "A container for one or more schema type definitions",
            "An abstract collection of supported operations",
            "A reusable protocol binding shared by interfaces",
            "An endpoint (access point) to a web service"
          ],
          correct: [3],
          reasoning: "A nested port element in a WSDL 1.1 service represents an endpoint (access point) to a web service."
        },
        {
          id: 560,
          question: "In WSDL 2.0, the `<service>` element contains `<endpoint>` elements. Which two attributes of `<endpoint>` are REQUIRED?",
          options: [
            "name and address",
            "name and binding",
            "interface and binding",
            "binding and address"
          ],
          correct: [1],
          reasoning: "In WSDL 2.0 the required attributes of endpoint are name and binding."
        },
        {
          id: 561,
          question: "In WSDL 2.0, what is the difference between `<include>` and `<import>`?",
          options: [
            "include may bring in a document with a different target namespace; import requires a matching one",
            "include requires the attached document's target namespace to match the base; import allows a different one",
            "Both require identical target namespaces; they differ only in the location attribute",
            "include works only for DTDs while import works only for XML Schema"
          ],
          correct: [1],
          reasoning: "In WSDL 2.0 include requires the attached document's target namespace to match the base, while import allows a different one."
        },
        {
          id: 562,
          question: "Select all statements that correctly describe ORCHESTRATION (as opposed to choreography) per the lecture.",
          options: [
            "There is one particular element that oversees and directs the other elements",
            "It refers to coordination of a single participant's process from a local, subjective perspective",
            "It is not an executable process and serves only as a contract between parties",
            "It can be expressed using an execution language such as BPEL"
          ],
          correct: [0, 2],
          reasoning: "Orchestration has one element overseeing and directing the others and can be expressed in an execution language such as BPEL."
        },
        {
          id: 563,
          question: "Which statement about CHOREOGRAPHY is TRUE according to the lecture?",
          options: [
            "It describes the internal actions occurring within each participant",
            "It is not an executable process and serves as a contract between parties from a global view",
            "It defines a new service from existing services from a single controller's perspective",
            "It is synonymous with collaboration, where members follow no predefined pattern of behavior"
          ],
          correct: [1],
          reasoning: "Choreography is not an executable process; it serves as a contract between parties from a global view."
        },
        {
          id: 564,
          question: "The lecture distinguishes choreography from \"collaboration\". What characterizes COLLABORATION specifically?",
          options: [
            "One element directs all others as a central coordinator",
            "Members interact in a non-directed fashion but follow a predefined pattern of behavior",
            "Members interact in a non-directed fashion, each according to their own plans without a predefined pattern",
            "It is always implemented as an executable BPEL process"
          ],
          correct: [2],
          reasoning: "Collaboration has members interacting in a non-directed fashion, each according to their own plans, without a predefined pattern of behavior."
        },
        {
          id: 565,
          question: "Select all TRUE statements about the SOA Integration Layer (e.g., an ESB) as described in the lecture.",
          options: [
            "Each service interface is exposed only via the Integration Layer, never directly",
            "Consumers and providers must be tightly coupled and aware of each other's locations",
            "The Integration Layer prevents any orchestration of activities across applications",
            "Point-to-point integration is done at the Integration Layer instead of by the consumers themselves"
          ],
          correct: [0, 3],
          reasoning: "In an ESB Integration Layer each service interface is exposed only via the layer, and point-to-point integration is done at the layer instead of by the consumers."
        },
        {
          id: 566,
          question: "Among the Core J2EE patterns in the lecture, which Integration Layer pattern \"exposes and brokers one or more services in your application to external clients as a web service using XML and standard web protocols\"?",
          options: [
            "Data Access Object",
            "Web Service Broker",
            "Service Activator",
            "Session Facade"
          ],
          correct: [1],
          reasoning: "The Web Service Broker pattern exposes and brokers services to external clients as a web service using XML and standard web protocols."
        },
        {
          id: 567,
          question: "In the UDDI \"phone book metaphor\", which pages provide a technical description of the service and its URL reference?",
          options: [
            "White pages",
            "Green pages",
            "Yellow pages",
            "Blue pages"
          ],
          correct: [1],
          reasoning: "In the UDDI phone-book metaphor, the Green pages provide the technical description of the service and its URL reference."
        },
        {
          id: 568,
          question: "Select all TRUE statements about UDDI registries and nodes per the lecture's \"General rules\" and concepts.",
          options: [
            "A UDDI registry MUST have at least one node offering a Web service compliant Inquiry API set",
            "The Subscription and Value Set API sets are MANDATORY for every node and registry",
            "A node is a member of exactly one UDDI registry",
            "UDDI is maintained by the W3C rather than OASIS"
          ],
          correct: [0, 2],
          reasoning: "A UDDI registry must have at least one node offering the Inquiry API set, and a node is a member of exactly one UDDI registry."
        },
        {
          id: 569,
          question: "In the UDDI core data model, which structure \"represents a technical model of a reusable concept, such as a Web service type or a protocol, and eliminates duplication of the same information in different places\"?",
          options: [
            "businessEntity",
            "bindingTemplate",
            "tModel",
            "publisherAssertion"
          ],
          correct: [2],
          reasoning: "A tModel represents a technical model of a reusable concept (such as a web service type or protocol) and eliminates duplication of the same information across places."
        },
        {
          id: 570,
          question: "In the UDDI API sets, which operation belongs to the Security (Policy) API Set and is \"equivalent to login to the system\"?",
          options: [
            "find_business",
            "get_authToken",
            "save_business",
            "get_transferToken"
          ],
          correct: [1],
          reasoning: "get_authToken belongs to the Security (Policy) API set and is equivalent to logging into the system."
        }
      ]
    }
  ]
};

/* allow the QA harness (node) to require this file */
if (typeof module !== 'undefined' && module.exports) module.exports = quizData;
