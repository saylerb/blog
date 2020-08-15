---
path: "/hello-spring-boot"
date: "2019-01-07"
title: "Hello, Spring Boot"
excerpt: "The first steps of a Spring Boot application, explained!"
published: false
slug: "spring-boot-todo"
---

This is a walkthrough of the first steps to starting a new Spring Boot
application.

Most of this is based on [the official Spring guide to building a REST
service.](http://spring.io/guides/gs/rest-service/#) I'm someone who likes to
know what every line of configuration is doing, so I've added some more detail
compared to the official guides. I hope some people find this useful!

Create a directory called `hello-spring` and cd into that directory.

```bash
mkdir hello-spring && cd hello-spring
```

Create the Maven-like directory structure:

```bash
mkdir -p src/main/java/main/hello
```

We'll use Gradle as our buildtool. We'll create a file called `build.gradle`.
This will help us with building our application and managaging dependencies.

```bash
touch build.gradle
```

At the top of the file create this block:

```groovey
buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath("org.springframework.boot:spring-boot-gradle-plugin:2.0.5.RELEASE")
    }
}
```

The
[`buildscript`](https://docs.gradle.org/current/userguide/tutorial_using_tasks.html#sec:build_script_external_dependencies)
block allows us to add external dependencies to our class path _that we can use
later in the `build.gradle` file_. Without this `buildscript` block, we only
have access to stuff that comes with gradle out of the box (more info
[here](https://stackoverflow.com/questions/17773817/purpose-of-buildscript-block-in-gradle)).

Within that method we can use the `repositories` method to specify specific
external source for packages. See [declaring
repositories](https://docs.gradle.org/current/userguide/declaring_repositories.html).

We use `dependencies` method to declare a dependency for a configuration. Here
we've defined the [Spring Boot Gradle
plugin](https://docs.spring.io/spring-boot/docs/current/gradle-plugin/reference/html/)
as a dependency. This contains some useful features, for example bundling up
all the jars on the classpath into a single jar for convenience, searching for
`public static void main()` method to flag as a runnable class, and a
dependency manager. [More details
here.](http://spring.io/guides/gs/rest-service/#_create_the_directory_structure)

Next, we're going to add a bunch of plugins. This is using a [legacy plugin
application
syntax](https://docs.gradle.org/current/userguide/plugins.html#sec:old_plugin_application)
in place of a new plugin DSL.

In this case, using `apply plugin: 'java'` syntax will apply the
[`JavaPlugin`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaPlugin.html),
which allows Gradle to compile Java source files and produce an executable _jar_ file.

The `apply plugin: 'eclipse'` and `apply plugin: 'idea'` lines apply the editor
plugins. For example, the [IntelliJ
plugin](https://docs.gradle.org/current/userguide/idea_plugin.html).

And finally we're adding the Spring Boot plugin and [Spring Dependency
management
plugins](https://docs.spring.io/dependency-management-plugin/docs/current-SNAPSHOT/reference/html5/)

```
buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath("org.springframework.boot:spring-boot-gradle-plugin:2.0.5.RELEASE")
    }
}

apply plugin: 'java'
apply plugin: 'eclipse'
apply plugin: 'idea'
apply plugin: 'org.springframework.boot'
apply plugin: 'io.spring.dependency-management'
```

What is this part? bootJar? In Spring Boot 2.x, the `bootJar` task creates the
executable _jar_ file. When the `java` plugin is applied along with the Spring
Boot Gradle plugin, the Spring boot plugin _responds_ by creating the `bootJar`
task, along with `bootRun`, which allows us to run the app directly. (more info
[here](https://www.baeldung.com/spring-boot-gradle-plugin)). The `baseName`
and `version` allow us to set the _jar_ filename.

Now you'll see another instance of the `repositories` and `dependencies`
methods. What's the difference between these the ones we previously saw inside
the `buildscript` block?

The `repositories` and `dependencies` previously was scoped to the
`buildscript`, which was for specifying dependencies for this file itself, but
not for building and running our application. This `repositories` and
`dependencies` sections are at the global level, so they are for our
application. Within the dependencies block, we declare `compile` an external
dependency for building our application. The `spring-boot-starter-web` is a
dependency that bundles together many dependencies for building a RESTful web
application. For example, it adds a Tomcat server and Spring MVC, so everything
we need to start writing a RESTful API.

We also declare `spring-boot-starter-test` as a `testCompile` dependency to
give us some useful libraries for testing our app, including `JUnit`,
`AssertJ`, `Hamcrest`, `Mockito` and `MockMvc`.

Next we have `sourceCompatibility` and `targetCompatibility`. What's the
[difference](https://stackoverflow.com/questions/16654951/gradle-sourcecompatibility-vs-targetcompatibility)?
[This post is a good explaination](https://discuss.gradle.org/t/sourcecompatibility-targetcompatibility-usage-reasons/25133/4)
`sourceCompatibility` declares the version of Java your source code is
compatible with, which tells the compiler how to handle parsing your code,
while `targetCompatibility` tells the compiler what version of bytecode to
produce. Most of the time, these two should be the same.

```
bootJar {
    baseName = 'gs-spring-boot'
    version =  '0.1.0'
}

repositories {
    mavenCentral()
}

sourceCompatibility = 1.8
targetCompatibility = 1.8

dependencies {
    compile("org.springframework.boot:spring-boot-starter-web")
    testCompile("junit:junit")
}
```

Spring Boot tries to help you with adding and removing
