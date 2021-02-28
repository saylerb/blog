---
path: "/owasp"
date: "2020-12-16"
title: ""
excerpt: ""
published: false
slug: "owasp"
---

# OWASP Top 10 Notes

## Injection

- Injection - when untrusted malicious input is accepted, which can alter the
  intent of original query
- processed by application, leading to unwanted results
- SQL, LDAP, OS, or any intermediary that passes command to another system
- SQL Injection is commmon vulnerability
- Error Messages can describe what when wrong in detail
  - Don't make error message
  - Blind SQL attack is when an attacker cannot see the error details, but
    still uses the present of an error to glean something
- Code inject (remote code execution)
  - An attacker injects application code
  - occurs when an application accepts code that has not been validated
- OS command injection attacks
- LDAP command to modify LDAP trees (User information)
- JSON - manipulating output
- XPATH injection
- Injection through file upload tools. Malware, DDOS, etc can be resulted
- Make sure to restrict dangerous file types
- Defensive against SQL injection
  - Use bind parameters (BEST)
  - Use an allow list for input (not very flexible)
  - Escaping special characters
  - SQL controls (prevent mass disclosure)
  - Fuzzers and scanners ???
  - File upload protection
    - files maximum size
    - scanning for virus/malware
    - check filetype
    - check file magic bytes for data type

## Broken Authentication

- Weaknesses in common authentication mechanisms

  - Unencrypted traffic
  - Authentication
    - Knowlege (password)
    - Possession (keycard)
    - Physical (fingerprint)
  - Single factor authentication is vulnerable to a single factor
  - Forgot password page can be used as an attack vector

- The relationship between a login and a session

  - HTTP is important to understand
  - session id's identify a user
  - unencrypted traffic allows an attacker to hijack the sessionid
  - _session Fixation_ - when an attacker fixes a session for another user.
    Wait what? How do you force someone else to use a specific session
  - Defenses
    - Use multiple factors
    - _Forgotton password features_ - Treat the feature with the same important as normal authentication
    - _Session Timeout_ - Setting a reasonable timeout. 15-30 is reasonable. (1 year timout not
      good?) - maximum length to make
    - Any before new user session is created, make sure to close existing
      sessions for that user to prevent session fixation
    - Encrypt traffic to prevent session hijacking
    - _Account lockout_ or _increasing time delays_
      - limit number of attempts to prevent brute-force.
      - However, attackers can create DOS if they lock out all users. Best to
      - increase timeout after each unsuccessful login attempt

- How hackers eavesdrop and perform man-in-the-middle attacks - what this was not covered??

## Sensitive Data Exposure

- Describe the consequences of handling sensitive data
  - clear text communication is when data is sent without encryption
  - More data is transmitted through HTTP requests including Session IDs, cookie data, form data, transaction
  - _insecure storage_: applications frequently store data un-encrypted
- Defenses

  - Important of understanding the data to secure it
    - What should be secured?
    - Where does data move?
    - Where is the data stored?
  - level of sensitivity of the data helps determine how to protect it (private, sensitive, confidential, public)
  - _Cryptography defenses_: strong cryptography produces ciphertext that is difficult for attackers to understand
  - _Encrypt data in transit_: Use Transport layer security (SSL/TLS) to encyrpt date in transit.
    - Disable ciphers that are under 128-bit encyption
    - Remove v1, v2, and v3 versions of SSL (known vulnerabilities).
      - Use TLS with Perfect Forward Secrecy (PFS) ciphers (frequently use
        new keys to prevent past sessions from being compromised).
  - Hashing for confidentiality
    - Hashing is not encryption
    - Hashing can protect confidentiality
    - Good practice to hash passwords with salt

- Determine which cryptographic algo to use
- Some Algos with known vulnerabilities:
  - DES: Use AES instead
  - MD5: use SHA256 or SHA512 (okay, but maybe showing its age)
- The Importance of cryptographic key management

## XML External Entities

- Can lead to XML injection vulnerabilities

- How attackers can use XXE's to access sensitive data
  _ applications frequently use XML for structuring data in transit
  _ XML parsers are frequently have vulnerability
  _ XXE is a form of server-side request forgery.
  _ XML does not have a defined structure: The Document Type Definition
  _ DTD defines the structure of the XML
  _ When XML parser parses the file, the DTD is used to figure out how to parse
  _ For example, an attacker can manipulate the DTD to run malicious code
  _ Can manipulate the DTD to cause denial of service attacks
  (exponential expansion) \* Can manipulate the DTD to probe internal networks (SSRF). By
  manipulating the DTD to perform a HTTP/FTP request, attackers can
  make a request that appears to come from the compromised application

- Defend against common XXE attack \* _Best Defense_- Don't use XML. Use JSON \* _Defense_- Disable DTD parsing, review XML parsers you use to disable XXE/DTD \* _Defense_- Validate the XML
  _ input validation controls (e.g. allow list) and/or XSD validation (checks XML against a schema)
  _ XSD schemas describe the structure of XML and make sure that XML can be parsed prior to checking for errors \* _Defense_- Update your libraries regularly (and automate if possible)

## Broken Access Control

- Common weaknesses that let users bypass authorization
- Implement validation for user input that affects business logic
- Prevent people in a system from using unauthorized functionality

- Privledge escalation can be a serious security breach
- Horizontal privledge escalation - different user, same level of access
- Vertical privledge escalation - same user, higher level of access

- _insecure direct object reference_:
  _ results from *not* validating user input
  _ attackers can modify urls that to access records that should be unauthorized \* when we expose the database record that should be behind authorization(e.g. through pk) to the user with validation
- _missing function level access control_
  _ function level - functions available to tsomeone based on their role
  _ Authorization issue because the application doesn't properly restrict access to priviledged functions
  _ Two examples
  _ Forced browsering -guessing the url of a privleged action \* Parameter manipulation - modifying a parameter for a hidden action

- _Server side request forgery (SSRF)_
  _ The running server is compromised in a way that allows the attacker
  to make requests from the server-side application
  _ Can grant access to internal services (e.g. dbs, aws, or other
  applications) \* Can use HTTP or other legacy URL schemas e.g. file:// to access data on disk or on internal network
- _CSRF_
  _ "See-Surf"
  _ exploiting requests that are not verified (authenticated/authorized)
  _ E.g. without validations
  _ attackers can trick other users from making requests to sites that they are authenticated to \* e.g. an attacker put a link in a comment on reddit to hit an api endpoint within reddit to delete their account

- Defenses
  _ *Server side checks*,
  _ Client side validation should only be used for UX (not only validation)
  _ assume all input is malicious
  _ Protect against url parameter manipulation, then avoid using parameters
  _ *Server side sessions* to store user-specific information (instead of URLs)
  _ _Page-level authorization_ Use routing to allow certain pages
  _ *Programmed authorization* limit access to certain programming logic based on role
  _ Use poth page-level and programmed authorization
  _ internal services authentication (protect against CSRF)
  _ Is your application suseptible to CSRF?
  Does the app...
  _ performs state-changing operations on backend (logins and storing data)
  _ relies on authentication/session management (such as cookies)
  Then use these defenses
  _ *anti-CSRF tokens* these tokens can be added to forms that the server can use to verify
  _ _CORS policy_
  _ defines what resources shared across different origin
  _ defines HTTP headers
  _ Don't send CORS headers on private resources
  _ _SameSite Cookies_ \* When app only needs to accept requests from the same domain

## Security Misconfiguration

- Describe common vulnerabilities associated with misconfiguring security
- How error messages and stack traces acan leak information to attackers
- Identify systems with weak configuration

- Hardening
- Environment Configuration
- Bootstrapping - is the startup process secure

* Common problem is using insecure default configuration
* Verbose error messages can give attackers too much information about the application

#### Defenses

- Configuration - disable test accounts, use principle of least privilege - remove network services that are not used (e.g. FTP transfer service,
  telnet service) - access rights should be defined by default, granted selectively, and
  applied the same in nonprod and prod environments - configuration database
- Hardening OS - lock down to the most restrictive possible (Minimum Security Baseline) MSB - OS's have unneeded services, so disable them - remove access to default test account
- Standardizing builds - Creating a standard build that has a standard security practices - reduces the chance of human error
- Patch management & audits - centralized patch management server - periodic audits
- Generic error message - provide the least amount of information about the system in error messages
- Maintenance - remove default accounts - remove unnecessary ports - unused applications should be disabled

## Cross-Site Scripting (XSS)

- XSS is the most common problems affecting organisation's web pages
- A client-facing attack
- Reflected XSS - Reflected XSS happens when an application feature reflects a user's input back to them - One example is a search feature, where user search term is reflected back to the user - If user enters a script, when the script is 'reflected' back to the
  user, the application could run malicious code - Typically the reflected XSS attack is initiated by tricking other
  users into clicking a link that trigger a reflected feature - Attackers can encode malicious URLs to make them look harmless, then
  include them in phishing emails
- Stored XSS - e.g. embedding a script into a comment on a application's page - the malicious code is stored on the comments table in the database - insidious because the script could run without direct user interaction, e.g.
  any user that visits a page with the affect comment would run malicious code
- DOM-based XSS - DOM-based XSS takes advantage of client-side vulnerabilities - Taking advantage of browser vulnerabilities to execute malicious scripts - e.g. could make an ajax request with a malicious script that gets
  returned back to the browser in an error message and excuted - document.URL, document.URLUnencoded, document.location document.referrer, window.location, location.hash

### Defenses

- _Input Validation_
- _Allow/Block lists_
- _Canonicalization_: convert input into the simplist form
- _Output Escaping_: escape input so that it's treated as text instead of code).
  Challenging since the correct escaping depends on context
- _HTTPOnly cookie setting_ - prevents the browser from accessing a cookie via JavaScript
- _Content security policy_ - - separate code from content - inline javascript in files (not embedded in html) - X-XSS-Protection can be used for browsers that don't support CSP - For example a CSP could declare that all content comes from a
  specific domain, images can come from anywhere, and media content can
  come from some domains but not subdomains, and scripts can be executed only
  from this domain

## Insecure Deserialisation

- Serialization: convert an object for storage
- De-serialization: rebuilding objects from data
- _Unsafe deserialization_: if data is _rebuilt_ incorrectly, it could possibly
- Defenses - don't allow untrusted, user-supplied data to get serialized - avoid allowing users to alter untrusted objects (e.g. allowing the
  user to modify the prices of items in a shopping cart) - user safe deserialization - type checking and checking file types - limit and verify the size of input data - integrity checks - log and monitor the process of deserialisation

## Using Components with Known Vulnerabilities

- Risks with librarys and dependencies
- Challenge organizations face with using these components
- Common vulnerabilities
