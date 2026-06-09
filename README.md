# Information Systems Modelling - Lab Guide

This repo contains six labs based on the ModellingClub domain. Labs 2 to 4 build a working web app, lab 5 models the domain as an ontology, and lab 6 publishes semantic annotations (RDFa + JSON-LD) in web pages. Lab 1 is a requirements PDF.

## Quick map
- Lab 1: PDF requirements (no code)
- Lab 2: API contract + backend skeleton (Java + Spring Boot)
- Lab 3: Full backend with authentication
- Lab 4: Full stack app (backend + Angular frontend)
- Lab 5: Ontology demo (RDF4J)
- Lab 6: Semantic web embedding in HTML pages (RDFa + JSON-LD)

## What you need (simple list)
- Git
- Java 21 for labs 2 to 4
- Java 11 or newer for lab 5
- Maven 3.9+ (or use the Maven wrapper: mvnw)
- Node.js 20 and npm 10+ for lab 4 frontend
- A terminal (PowerShell on Windows is fine)

## If you are new, do this first
1. Open a terminal.
2. Check your tools:
   - java -version
   - mvn -version (optional if you will use mvnw)
   - node -v (lab 4 only)
   - npm -v (lab 4 only)
3. If a command is missing, install that tool and reopen the terminal.

## Ports used
- Backend (labs 2 to 4): http://localhost:8080
- Frontend (lab 4): http://localhost:4200

## Common fixes (beginner friendly)
- If mvn is not found, use the Maven wrapper:
  - Windows: mvnw.cmd
  - macOS/Linux: ./mvnw
- If port 8080 is busy, stop the other app or change server.port.
- If npm install fails, delete node_modules and package-lock.json, then run npm ci.
- If Java version is wrong, set JAVA_HOME and open a new terminal.

## Lab 1 - PDF requirements

### What it contains
- PDF handout: lab1/ISM_a_lab01_pop.pdf
- No runnable code

### How to use it
1. Read the PDF.
2. Use it as the domain reference for labs 2 to 5.
3. Submit any deliverables required by your course.

### Lab 1 summary
- The PDF defines a self-hosted ModellingClub platform for hobbyists to share builds.
- Users are Guests (read-only), Members (create and collaborate), and Admins (moderate).
- Core features: accounts, build lifecycle (draft to review to published), media uploads,
  collaboration invites, flight logs for UAV builds, public browsing, comments, and voting.
- It lists system limits such as upload size, max files per build, and flight log rules.
- Quality goals include fast pages, secure auth, backups, accessibility, and mobile-friendly UI.
- It also covers GDPR and EU drone compliance, plus moderation and takedown rules.
- The PDF proposes a Linux stack (Python, PostgreSQL, Nginx) for deployment, but the labs
  implement the same requirements using Java and Angular.

## Lab 2 - API contract + backend skeleton

### What it contains
- lab2/file.yaml: OpenAPI contract
- lab2/StudentService: Spring Boot 3.5.6, Java 21
- SQLite database (test.db) created on startup

### Run it
1. cd lab2/StudentService
2. Start the app:
   - Windows: mvnw.cmd spring-boot:run
   - macOS/Linux: ./mvnw spring-boot:run
3. Open Swagger UI:
   - http://localhost:8080/StudentsApp/swagger-ui/index.html

### Reset the database
1. Stop the app.
2. Delete test.db in lab2/StudentService.
3. Restart the app.

## Lab 3 - Full backend with authentication

### What it contains
- lab3/StudentService_vlab3: Spring Boot 3.5.6, Java 21
- H2 database (file-based)
- JWT authentication

### Run it
1. cd lab3/StudentService_vlab3
2. Build: mvn clean compile
3. Start: mvn spring-boot:run
4. Verify:
   - Health: http://localhost:8080/StudentsApp/api/v1/health
   - Swagger UI: http://localhost:8080/StudentsApp/swagger-ui/index.html
   - H2 console: http://localhost:8080/StudentsApp/h2-ui
     - JDBC URL: jdbc:h2:file:./modellingclubdb
     - User: sa
     - Password: (blank)

### Basic login flow
1. POST /auth/register
2. POST /auth/login to get a JWT
3. Send Authorization: Bearer <token> for protected endpoints

### Reset the database
1. Stop the app.
2. Delete modellingclubdb.mv.db and modellingclubdb.trace.db.
3. Restart the app.

## Lab 4 - Full stack app (backend + frontend)

### What it contains
- lab4/StudentService: Spring Boot backend with seed data
- lab4/angular-rest-client-student-crud: Angular 21 frontend
- lab4/guide.txt: detailed demo guide
- AOP usage stats + service logging + performance timing + security audit
- Global API error handler that returns clean ProblemDetail responses
- Dev config (H2) and production profile (application-prod.properties)

### Run it
1. Backend terminal:
   - cd lab4/StudentService
   - mvn spring-boot:run
2. Frontend terminal:
   - cd lab4/angular-rest-client-student-crud
   - npm ci
   - npm start
3. Open:
   - Backend API: http://localhost:8080/StudentsApp/api/v1
   - H2 console: http://localhost:8080/StudentsApp/h2-ui
   - Frontend UI: http://localhost:4200

### Configuration notes (simple)
- Media uploads are limited to 20 MB per file and 50 files per build.
- Uploads are served at http://localhost:8080/StudentsApp/uploads/...
- JWT tokens use a random key in dev; set jwt.secret for stable tokens in prod.
- CORS allows http://localhost:4200 by default (change cors.allowed-origins for prod).

### Production profile (optional)
1. Set env vars: JWT_SECRET, CORS_ORIGINS, APP_PUBLIC_BASE_URL
2. Start with: mvn spring-boot:run -Dspring-boot.run.profiles=prod

### Demo accounts
| Role   | Email                      | Password  | Username   |
|--------|----------------------------|-----------|------------|
| admin  | admin@modellingclub.local  | admin123  | admin      |
| member | demo@modellingclub.local   | DemoUser1 | demo_pilot |

### Reseed data
1. Stop the backend.
2. Delete modellingclubdb.mv.db and modellingclubdb.trace.db.
3. Delete lab4/StudentService/uploads if present.
4. Restart the backend.

### Note on the Angular folder layout
There are two Angular project copies:
- lab4/angular-rest-client-student-crud (use this one)
- lab4/angular-rest-client-student-crud/angular-rest-client-student-crud

## Lab 5 - Ontology demo (RDF4J)

### What it contains
- lab5/sesameExample_sol: Java 11, RDF4J 3.6.3
- ontology.ttl and sample-data.ttl

### Run it
Option A - IntelliJ
1. Open lab5/sesameExample_sol as a Maven project.
2. Ensure Project SDK is Java 11 or newer.
3. Run App.java (pl.edu.pwr.modellingclub.App).

Option B - Maven
1. cd lab5/sesameExample_sol
2. mvn compile exec:java

### Expected output
- Logs that the ontology and sample data loaded
- SPARQL query results printed in the console

## Lab 6 - Embedding semantic data in web pages (RDFa + JSON-LD)

### What it contains
- lab6/index.html, builds.html, build-falcon.html, marketplace.html, member-alice.html, testrun.html
- lab6/styles.css (theme snapshot aligned with lab4 look)
- lab6/vocabulary/ontology.ttl (custom ontology delivered with the lab)
- lab6/vocabulary/mc-context.jsonld (JSON-LD context for custom vocabulary)
- lab6/verify_jsonld.py (local parsing helper)

### Goal
- Annotate page content with schema.org terms where possible.
- Use custom `mc:` terms where schema.org lacks equivalent classes/properties.
- Publish each snapshot using both RDFa attributes in HTML and a JSON-LD script in `<head>`.

### Why static snapshots are used
- The live Angular app renders client-side, which can hide semantic data from parsers that only inspect initial HTML.
- Lab 6 provides server-rendered style snapshots that expose semantic markup directly in source.

### Run it
1. Open the HTML pages directly in a browser, or serve `lab6` locally.
2. Optional local server:
   - cd lab6
   - python -m http.server 8000
   - open http://localhost:8000

### Verify
1. Use RDFa Play (http://rdfa.info/play/) by pasting page source.
2. Use Schema Markup Validator (https://validator.schema.org/) or Rich Results Test.
3. Optionally run local JSON-LD parsing checks with `verify_jsonld.py`.

## How the labs connect
- Lab 1 defines the requirements and rules for the ModellingClub domain.
- Lab 2 turns that domain into an OpenAPI contract and a starter backend.
- Lab 3 implements a working backend with authentication and a real database.
- Lab 4 adds the frontend and a complete user experience.
- Lab 5 models the same domain as an ontology for semantic queries.
- Lab 6 publishes that domain data in HTML snapshots using RDFa and JSON-LD.

## License
No license specified.
