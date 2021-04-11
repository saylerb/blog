---
path: "/spring-boot-part-one-gradle"
date: "2021-02-10"
title: "TDD a Spring Boot App with Java - Part One - Gradle"
excerpt: "Starting a new Spring Boot Application, using Gradle"
published: true
slug: "spring-boot-part-one-gradle"
---

This post is the first in a series that walks through building a small RESTful
API for a Todo application using a test driven approach.

The first steps to starting a new Spring Boot application typically involve
configuration and dependency management. This post will review using Gradle as
a build tool for a new Spring project. Future posts in the series will continue
by starting to build a simple RESTful API by reviewing Spring Boot's
architecture, and how to test different components of a Spring Boot web
application.

If you're looking for a quick introduction to Spring, the excellent [official
Spring guide to building a REST service
](http://spring.io/guides/gs/rest-service/#) is a great place to start. If
you're interested in seeing a Test-First approach to writing Spring
applications, come back here and follow this series. While we'll create
everything from scratch as an exercise for teaching concepts, for real-world
Spring projects, I recommend using [Spring
Initializr](https://start.spring.io/), a handy website from Spring, to generate
a starter repository.

## Prerequisites

Make sure you have Java and Gradle installed. For this post, I'll use Java 8,
and Gradle 6. One of my favorite websites for learning new programming
languages, exercism.io, has excellent documentation for [how to install
Java](https://exercism.io/tracks/java/installation) across many platforms.

## Project Creation

Create a directory called `hello-spring` and navigate into that directory.

```bash
mkdir hello-spring && cd hello-spring
```

Create the directory structure:

```bash
mkdir -p src/main/java/hello
```

We'll use Gradle as our build tool. We'll create a file called `build.gradle`
to define our dependencies and configure tasks that we can run to build the
application.

```bash
touch build.gradle
```

## Gradle Plugins

The `build.gradle` file is written in Groovey, a language that borrows concepts
from Ruby and Java. At the top of the `build.gradle` file, create a `plugins`
block. Within it, we'll add some Gradle plugins that will give us access to
some tasks to make it easy to build and test our Spring app.

```groovey
plugins {
    id 'java'
    id 'org.springframework.boot' version '2.4.3'
    id 'io.spring.dependency-management' version '1.0.11.RELEASE'
}
```

In this case, using `id 'java'` syntax will apply the
[`JavaPlugin`](https://docs.gradle.org/current/userguide/java_plugin.html),
which gives you access to a collection of tasks including ones to compile Java
source files (`assemble`), produce an executable _jar_ files (`jar`), and run
your tests (`test`).

The next line, `id 'org.springframework.boot' version '2.4.3'`, defines the
Spring Boot Gradle plugin. This plugin gives us even more convenience tasks to
build Spring Boot applications. For example, when the `java` plugin is applied
along with the Spring Boot Gradle plugin, the Spring Boot Gradle plugin
_responds_ by creating the `bootRun` task, which allows us to build a _jar_
file and run the app locally in one step. (more info
[here](https://www.baeldung.com/spring-boot-gradle-plugin)).

And finally we have the [Spring Dependency management
plugin](https://docs.spring.io/dependency-management-plugin/docs/current/reference/html/).
Similar to the `java` Gradle plugin, when the Spring `dependency-management`
Gradle plugin is applied it affects how the Spring Boot plugin works: the
Spring Boot plugin will automatically import the `spring-boot-dependencies`
"Bill of Manifest" (also known as BOM), which is a curated list of dependencies
used to build Spring Boot applications. This means all of Spring Boot's
dependencies for the given version of Spring Boot are automatically imported,
and it further allows us to the omit version numbers for any declared
dependencies that are managed by Spring Boot. More on this later.

In summary, the combination of the `java`, Spring Boot, and Spring Dependency
Management plugins give you some tasks to build and run Spring applications
while making it easy to manage dependencies. Run `gradle tasks` and it'll print
out all the available tasks you can run.

Next we will add a line with the key `sourceCompatibility`, which declares the
Java version your source code is compatible with, which tells the compiler how
to handle parsing your code. For this example, I'll stick to Java 8, so the
value in the gradle config is `1.8`.

```groovey
sourceCompatibility = '1.8'
```

## Declaring Dependencies

Next we'll add a `repositories` and `dependencies` section to our `build.gradle` file:

```groovey
repositories {
    mavenCentral()
}

dependencies {
  implementation 'org.springframework.boot:spring-boot-starter-web'
  testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```

Declaring `mavenCentral` with the repositories block allows us to specify
dependencies within the `dependencies` block that are published to the maven
central repository.

Within the `dependencies` block, we declare external dependencies required for
our application at runtime with the keyword `implementation`. The
`spring-boot-starter-web` is a dependency published [on
maven](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-web)
that bundles together many dependencies for building a RESTful web application.
For example, it adds a Tomcat server and Spring MVC, so everything we need to
start writing an app exposing a RESTful API.

We also declare `spring-boot-starter-test` as a `testImplementation` dependency
which bundles together a collection of libraries for testing our app, including
`JUnit`, `AssertJ`, `Hamcrest`, `Mockito` and `MockMvc`. `testImplementation`
tells Gradle that these dependencies are required for compiling and running
tests, but not our production application.

Notice that we can declare `spring-boot-starter-web` and
`spring-boot-starter-test` _without_ version numbers because we are using the
`dependency-management` plugin. The plugin will ensure that both of those
dependencies versions are compatible with the version number of Spring Boot
declared with the Spring boot plugin, which is `2.4.3` for this example. There
are ways to override this behavior, but one of the advantages of using Spring
Boot is that we can delegate much of the dependency management to the framework
itself, so we spend less time worrying about dependencies and more time
building applications.

And lastly, the `test` task type with `useJunitPlatform()` gives Gradle native
support to run our tests with JUnit. We can also add a `testLogging` block to
configure more detailed logging on the command line when tests fail due to an
exception:

```groovey
test {
    useJUnitPlatform()
    testLogging {
        exceptionFormat = TestExceptionFormat.FULL
    }
}
```

Putting it all together, you will have a `build.gradle` file that looks like
this:

```groovey
plugins {
    id 'java'
    id 'org.springframework.boot' version '2.4.3'
    id 'io.spring.dependency-management' version '1.0.11.RELEASE'
}

sourceCompatibility = '1.8'

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

test {
    useJUnitPlatform()
    testLogging {
        exceptionFormat = TestExceptionFormat.FULL
    }
}
```

Now, we should be ready to write our very first test of the application. First,
we can create a test directory. Gradle expects this directory structure to
match the source code directory structure we created previously, which is the
Maven convention:

```
mkdir -p src/test/java/main/hello
```

Now we should have an empty directory structure that looks like this:

```
src
├── main
│   └── java
│       └── hello
└── test
    └── java
        └── hello
```

And inside of the `/src/test/java/hello` directory, create a file called
`ApplicationTest.java` that looks like this:

```java
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ApplicationTest {

    @Test
    void contextLoads() {
    }

}
```

The `@SpringBootTest` annotation gives us a bunch of features, mainly it allows
us to start a Spring context, which the framework uses to create instances of
classes and wire them up with their dependencies using Dependency Injection.
Here, we can test that we can start up a Spring context by writing an empty
test within a test class annotated with `@SpringBootTest`.

Running this test with `gradle clean test` should fail, giving us
a`java.lang.IllegalStateException: Unable to find a @SpringBootConfiguration`

To make this test pass, we just need to create a class that uses the
convenience annotation `@SpringBootApplication`, which in turn sets up the
missing `@SpringBootConfiguration`. Inside the the `src/main/java/hello`
directory, create a new file called `Application.java` with the code:

```java
@SpringBootApplication
public class Application {
}
```

Now run `gradle clean test`. Your test should pass! So we successfully have
started a Spring context, but our application still doesn't do anything yet. In
the next post we'll start writing a simple web application that stores Todo
tasks.

All of the source code for this post is located [here](https://github.com/saylerb/hello-spring). Thanks for reading!
