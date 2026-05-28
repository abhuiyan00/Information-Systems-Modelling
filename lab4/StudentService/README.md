# StudentService — ModellingClub API

**Course project:** vlab3
**Technology:** Spring Boot 3.5.6, Java 21, H2 Database
**Base URL:** `http://localhost:8080/StudentsApp`
**API base path:** `http://localhost:8080/StudentsApp/api/v1`

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Building the Application](#2-building-the-application)
3. [Running the Application](#3-running-the-application)
4. [Resetting the Database](#4-resetting-the-database)
5. [Verifying the Application](#5-verifying-the-application)
6. [API Testing via Swagger UI](#6-api-testing-via-swagger-ui)
7. [Database Access via H2 Console](#7-database-access-via-h2-console)
8. [Authentication — JWT Bearer Tokens](#8-authentication--jwt-bearer-tokens)
9. [Test Scenario — Swagger UI](#9-test-scenario--swagger-ui)
10. [Test Scenario — Direct SQL via H2](#10-test-scenario--direct-sql-via-h2)
11. [Final Verification Query](#11-final-verification-query)
12. [Changelog — vlab3](#12-changelog--vlab3)

---

## 1. Prerequisites

Before building or running the application, ensure the following tools are installed and available on your system:

- **Java 21** (JDK) — verify with `java -version`
- **Maven 3.9+** — verify with `mvn -version`, or use the included Maven Wrapper (`./mvnw`)

No external database installation is required. The application uses an embedded H2 database stored as a file in the project root directory.

---

## 2. Building the Application

Navigate to the project root directory (the folder containing `pom.xml`) and run:

```bash
mvn clean compile
```

This command cleans any previous build output and compiles the source code, including generating the API model classes from the OpenAPI specification (`src/main/resources/openapi/openapi.yaml`).

To produce a standalone JAR file:

```bash
mvn clean package -DskipTests
```

The packaged JAR will be placed in the `target/` directory.

---

## 3. Running the Application

To start the application using the Maven Spring Boot plugin:

```bash
mvn spring-boot:run
```

Alternatively, if you have built the JAR:

```bash
java -jar target/StudentService-0.0.1-SNAPSHOT.jar
```

Wait until the following messages appear in the console output:

```
Started StudentServiceApplication
Tomcat started on port 8080
```

The application is ready to accept requests once these lines appear.

---

## 4. Resetting the Database

The application uses a file-based H2 database. The database files are created in the project root directory when the application starts for the first time.

To start with a clean, empty database:

1. Stop the application.
2. Delete the following files from the project root:
   - `modellingclubdb.mv.db`
   - `modellingclubdb.trace.db`
   - `test.db` (if present)
3. Restart the application.

The database schema is recreated automatically on the next startup.

---

## 5. Verifying the Application

After startup, confirm that the application is running correctly by checking the following endpoints in a browser or HTTP client:

| Resource    | URL                                                              | Expected Result         |
|-------------|------------------------------------------------------------------|-------------------------|
| Health check | `http://localhost:8080/StudentsApp/api/v1/health`              | `{ "status": "ok" }`   |
| Swagger UI   | `http://localhost:8080/StudentsApp/swagger-ui/index.html`       | Interactive API browser |
| H2 Console   | `http://localhost:8080/StudentsApp/h2-ui`                       | Database web interface  |

### Verify the System User

On every startup, the application automatically seeds a system user with a fixed UUID. To confirm this was created, open the H2 console and run:

```sql
SELECT id, username, role
FROM USERS
WHERE id = '00000000-0000-0000-0000-000000000001';
```

Expected result:

| username    | role  |
|-------------|-------|
| system_user | admin |

---

## 6. API Testing via Swagger UI

Open the Swagger UI at:

```
http://localhost:8080/StudentsApp/swagger-ui/index.html
```

All API endpoints are documented and can be executed directly from the browser. No separate HTTP client is required for basic testing.

---

## 7. Database Access via H2 Console

Open the H2 console at:

```
http://localhost:8080/StudentsApp/h2-ui
```

Use the following connection settings:

| Field     | Value                           |
|-----------|---------------------------------|
| JDBC URL  | `jdbc:h2:file:./modellingclubdb` |
| User Name | `sa`                            |
| Password  | *(leave blank)*                 |

Click **Connect** to access the database browser.

---

## 8. Authentication — JWT Bearer Tokens

The API uses stateless JWT bearer-token authentication.

1. Register a user with `POST /auth/register` (one-time, plaintext password is accepted in the request and stored as a bcrypt hash).
2. Log in with `POST /auth/login`. The response is:
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiJ9....",
     "user": { "id": "...", "username": "...", "email": "...", "role": "member" }
   }
   ```
3. Send the token on every protected request:
   ```
   Authorization: Bearer <token>
   ```
4. Tokens are signed with HS256 and expire after **24 hours**. The signing key is generated per JVM start, so restarting the application invalidates all outstanding tokens.

### Authorising in Swagger UI

Click the **Authorize** button (top-right), paste the token (no `Bearer ` prefix needed — Swagger adds it), and **Authorize**. Subsequent calls from the UI will include the header automatically.

### Endpoints that require a token

All endpoints marked with `bearerAuth` in `openapi.yaml`. Notably:
- `POST /builds`, `PUT /builds/{id}`, `DELETE /builds/{id}`, `POST /builds/{id}/submit`
- `POST /builds/{id}/comments`, `POST /builds/{id}/vote`
- `POST /builds/{id}/media`, `DELETE /builds/{id}/media/{mediaId}`
- `POST /builds/{id}/flight-logs`, `GET /builds/{id}/flight-logs`
- `POST /builds/{id}/collaborators`, `GET /builds/{id}/collaborators`
- `GET /account/export`, `POST /account/delete`
- `GET /admin/queue`, `GET /admin/users`, `POST /builds/{id}/review` (these additionally require `role = admin`)

The system seeds an `admin` user (`system_user`) on startup, but that user has no password (it cannot log in). To exercise admin endpoints, manually set a registered user's `role` to `admin` via the H2 console:

```sql
UPDATE USERS SET role = 'admin' WHERE email = 'your-account@example.com';
```

then log in again to obtain a fresh token containing the `admin` claim.

---

## 9. Test Scenario — Swagger UI

The following scenario demonstrates the full feature set of the API through a sequence of requests performed via Swagger UI.

> **Before each protected request**, click **Authorize** and paste the JWT returned by `/auth/login` (Step 2a).

### Step 1 — Register User: alex_fpv

`POST /auth/register`

```json
{
  "username": "alex_fpv",
  "email": "alex@modelclub.local",
  "password": "SecurePass123"
}
```

Expected response: `201 Created`. Copy the returned `id` for use in later steps.

---

### Step 2 — Register User: maria_models

`POST /auth/register`

```json
{
  "username": "maria_models",
  "email": "maria@modelclub.local",
  "password": "SecurePass456"
}
```

Expected response: `201 Created`. Copy Maria's `id` for use in the collaborator step.

Verify in H2:

```sql
SELECT username, email FROM USERS ORDER BY created_at;
```

Expected order: `system_user`, `alex_fpv`, `maria_models`.

---

### Step 2a — Log in as alex_fpv and authorise Swagger

`POST /auth/login`

```json
{
  "email": "alex@modelclub.local",
  "password": "SecurePass123"
}
```

Expected response: `200 OK` with body:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9....",
  "user": { "id": "...", "username": "alex_fpv", "email": "alex@modelclub.local", "role": "member" }
}
```

Copy the `token` value, click **Authorize** in Swagger UI, paste it, and click **Authorize**. From now on every protected request you make in Swagger is performed as `alex_fpv`.

---

### Step 3 — Create a Build

`POST /builds`

```json
{
  "title": "5-inch FPV Racing Quad",
  "type": "drone",
  "description": "Custom freestyle racing drone with DJI O3 Air Unit.",
  "frame_size_mm": 225,
  "num_motors": 4,
  "flight_controller": "SpeedyBee F405 V4",
  "max_takeoff_weight_g": 685
}
```

The `type` field must be `"drone"` for flight log support. Expected response: `201 Created` with `status: draft` and `owner_id` equal to alex_fpv's id. Copy the returned build `id` (referred to as `{BUILD_ID}` in the steps below).

---

### Step 4 — Add a Comment

`POST /builds/{BUILD_ID}/comments`

```json
{
  "content": "First flight was smooth — DJI O3 feed is rock solid."
}
```

Expected response: `201 Created`. The comment author is the user identified by the bearer token (`alex_fpv` in this scenario).

---

### Step 5 — Cast a Vote

Self-voting is rejected (`400`), so log in as `maria_models` first (repeat Step 2a with Maria's credentials and re-authorise Swagger with her token), then:

`POST /builds/{BUILD_ID}/vote`

```json
{
  "vote": "up"
}
```

Expected response:

```json
{
  "upvotes": 1,
  "downvotes": 0,
  "user_vote": "up"
}
```

After this step, switch back to alex_fpv's token (re-run Step 2a) for the remaining steps, since alex owns the build and only owners (or admins) can manage it.

---

### Step 6 — Add a Collaborator

`POST /builds/{BUILD_ID}/collaborators`

```json
{
  "email": "maria@modelclub.local"
}
```

Expected response: `202 Accepted`. Maria is automatically resolved by email and added as a collaborator.

---

### Step 7 — Add a Flight Log

`POST /builds/{BUILD_ID}/flight-logs`

```json
{
  "flight_date": "2026-04-14",
  "location_name": "Wroclaw FPV field",
  "duration_min": 8,
  "max_altitude_m": 95,
  "drone_identifier": "PL-ABC12345",
  "conditions": "SUNNY",
  "notebook": "Maiden flight, tuned PIDs, no issues."
}
```

Validation rules:

- `max_altitude_m` must be 120 or below (EU regulation)
- `drone_identifier` must match the format `CC-ABC12345`
- `conditions` must be one of: `SUNNY`, `CLOUDY`, `WINDY`, `RAIN`
- The build must be of type `drone`

---

### Step 8 — Submit and Approve the Build

Submit the build for review (as the owner, alex_fpv):

`POST /builds/{BUILD_ID}/submit`

Expected response: `200 OK`. Status changes to `pending_review`.

Approving requires `role = admin`. Promote alex via H2 console and re-login to refresh the JWT (the role is encoded in the token):

```sql
UPDATE USERS SET role = 'admin' WHERE email = 'alex@modelclub.local';
```

Then `POST /auth/login` again and re-authorise Swagger with the new token. Now:

`POST /builds/{BUILD_ID}/review`

```json
{
  "action": "approve"
}
```

Expected response: `200 OK`. Status changes to `published`.

---

### Step 9 — Upload a Media File

`POST /builds/{BUILD_ID}/media`

Use `multipart/form-data` to upload a file. Constraints:

- Maximum file size: 20 MB
- Maximum files per build: 50
- Allowed types: JPEG, PNG, GIF, PDF, STL

---

### Step 10 — Download Personal Data Export (ZIP)

`GET /account/export`

Returns a ZIP archive (`Content-Type: application/zip`, `Content-Disposition: attachment; filename="my-data.zip"`) containing:

- `profile.json` — the caller's user record
- `builds.json` — builds owned by the caller
- `comments.json` — comments authored by the caller

Swagger UI shows a **Download file** link in the response. The data is generated synchronously from the live database — there is no background job or external download URL.

---

## 10. Test Scenario — Direct SQL via H2

The following steps demonstrate inserting and verifying data directly through the H2 console, bypassing the REST API.

> **Note:** users inserted directly via SQL cannot log in to the API because the `password` column expects a bcrypt hash. SQL-inserted users are useful for testing the data layer (foreign keys, constraints) but not the auth flow. To create a user that can log in, use `POST /auth/register`.

### Insert Two New Users

```sql
-- Insert User 1: john_builder
INSERT INTO users (id, username, email, password, role)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'john_builder',
    'john@modelclub.local',
    'SecurePass789',
    'user'
);

-- Insert User 2: emma_scale
INSERT INTO users (id, username, email, password, role)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'emma_scale',
    'emma@modelclub.local',
    'SecurePass999',
    'user'
);
```

### Verify Users

```sql
SELECT id, username, email, role
FROM users
ORDER BY created_at;
```

Expected order: `system_user`, `alex_fpv`, `maria_models`, `john_builder`, `emma_scale`.

### Check for Duplicate Emails

```sql
SELECT email, COUNT(*)
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```

Expected result: 0 rows (no duplicates).

### Verify Role Assignments

```sql
SELECT username, role FROM users;
```

### Insert a Build via SQL

```sql
INSERT INTO builds (id, title, type, status, owner_id)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    'Beginner RC Car',
    'car',
    'draft',
    '11111111-1111-1111-1111-111111111111'
);
```

### Verify the Build-to-User Relationship

```sql
SELECT b.title, u.username AS owner
FROM builds b
JOIN users u ON b.owner_id = u.id;
```

Expected: `john_builder` is shown as the owner of `Beginner RC Car`, confirming that the foreign key relationship is working correctly.

---

## 11. Final Verification Query

Run the following query to see a complete summary of all builds and their associated data counts:

```sql
SELECT
    b.title,
    b.status,
    u.username AS owner,
    (SELECT COUNT(*) FROM COMMENTS c     WHERE c.build_id = b.id) AS comments,
    (SELECT COUNT(*) FROM VOTES v        WHERE v.build_id = b.id AND v.vote = 'up') AS upvotes,
    (SELECT COUNT(*) FROM FLIGHT_LOGS f  WHERE f.build_id = b.id) AS flight_logs,
    (SELECT COUNT(*) FROM MEDIA_FILES m  WHERE m.build_id = b.id) AS media_files,
    (SELECT COUNT(*) FROM COLLABORATORS k WHERE k.build_id = b.id) AS collaborators
FROM BUILDS b
LEFT JOIN USERS u ON b.owner_id = u.id;
```

After completing the full Swagger scenario, the expected result for the FPV Racing Quad build is:

| title                  | status    | owner    | comments | upvotes | flight_logs | media_files | collaborators |
|------------------------|-----------|----------|----------|---------|-------------|-------------|---------------|
| 5-inch FPV Racing Quad | published | alex_fpv | 1        | 1       | 1           | 1           | 1             |

### List All Tables Dynamically

To generate a set of `SELECT` statements for every table in the database schema, run:

```sql
SELECT 'SELECT * FROM ' || TABLE_NAME || ';'
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'PUBLIC';
```

This produces one query per table, which can be copy-pasted to inspect the full contents of the database.

---

## 12. Changelog — vlab3

This iteration replaces the placeholder authentication that the controllers used in vlab2 with a real JWT bearer-token flow, and prunes endpoints that the layered design did not actually need.

### Authentication

- **JWT bearer tokens.** `POST /auth/login` verifies the bcrypt-hashed password and returns a signed HS256 JWT (24 h expiry) plus the user profile. Clients send the token back as `Authorization: Bearer <token>`.
- **`AuthInterceptor`** parses the header on every request and exposes the caller via a request-scoped `CurrentUser` bean. Controllers read `currentUser.getUserId()` instead of the hard-coded `00000000-0000-0000-0000-000000000001` placeholder used previously.
- **bcrypt hashing.** Passwords are now hashed on registration (`PasswordEncoder` bean in `WebMvcConfig`) and verified during login.
- **Admin role enforcement.** `/admin/*` and `POST /builds/{id}/review` now reject callers whose token does not carry `role = admin` with `403 Forbidden`.
- **Self-vote rejection.** `POST /builds/{id}/vote` returns `400` if the caller is the build owner.

### Endpoints removed

| Endpoint | Reason |
|---|---|
| `GET /auth/me` | Redundant with JWT — clients already received the user profile in the login response. |
| `POST /auth/logout` | Stateless tokens require nothing server-side; clients simply discard them. |
| `POST /invitations/{token}/accept` | The `POST /builds/{id}/collaborators` flow already adds the collaborator synchronously in this lab — the email round-trip endpoint was dead weight. |
| `POST /admin/users/{id}/ban` | The previous implementation deleted the user (semantically a different action) and was unreachable through any documented flow. |
| `POST /account/export` | Replaced with synchronous ZIP delivery on `GET /account/export` — see below. |

### Endpoints fixed

- **`GET /account/export`** now streams a real ZIP (`profile.json`, `builds.json`, `comments.json`) generated synchronously from the database. The previous version returned a hard-coded fake URL and a static `exportRequested` flag shared across all users.
- **`POST /account/delete`** now deletes the user identified by the JWT instead of "the first user in the database".
- **`POST /builds`, `POST /builds/{id}/comments`, `POST /builds/{id}/vote`** now use the JWT user as owner / author / voter instead of a hard-coded UUID.
- **`POST /auth/login`** now actually verifies the password (the previous version accepted any password as long as the email existed).
- **`PUT /builds/{id}`, `DELETE /builds/{id}`, `POST /builds/{id}/submit`** now require the caller to be the build's owner (or an admin); previously any caller could mutate any build.

### Files added

- `security/JwtService.java` — issue and parse HS256 JWTs.
- `security/CurrentUser.java` — request-scoped bean holding the authenticated user.
- `security/AuthInterceptor.java` — populates `CurrentUser` from the `Authorization` header.
- `config/WebMvcConfig.java` — registers the interceptor and exposes the `BCryptPasswordEncoder` bean.
- `service/AccountService.java` + `service/AccountServiceImpl.java` — builds the personal-data ZIP.