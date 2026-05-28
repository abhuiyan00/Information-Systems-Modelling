# Information Systems Modelling

## Overview
This repository contains lab exercises for Information Systems Modelling. Each lab is self-contained; follow the instructions inside the lab folder.

## Repository Structure
- lab1: Lab 1 materials
- lab2: Student service (Java/Maven)
- lab3: Student service (Java/Maven)
- lab4: Student service (Java/Maven) and Angular REST client
- lab5: Java/Maven project

## Prerequisites
- Git
- JDK (use the version required by each lab's pom.xml)
- Maven (or the Maven wrapper where provided)
- Node.js and npm (for the Angular client in lab4)

## Getting Started
1. Open this repository in VS Code.
2. Choose a lab folder.
3. Read the lab-specific README or guide file.
4. Follow the lab's setup and run instructions.

## Build And Run (Typical)
### Java/Maven Labs
- Windows: mvnw.cmd spring-boot:run
- macOS/Linux: ./mvnw spring-boot:run
- If no wrapper exists: mvn spring-boot:run

### Angular Client (Lab 4)
- npm install
- npm start (or ng serve; see package.json)

## Tests
- mvn test
- npm test

## Notes
Generated artifacts (for example target/, node_modules/, dist/) are ignored by .gitignore files within each lab where applicable.

## License
No license specified.
