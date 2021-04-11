---
path: "/gradle-notes"
date: "2021-02-10"
title: "Gradle Notes"
excerpt: ""
published: false
slug: "gradle-noes"
---

## Using the Legacy buildscript

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

## Editor Plugin Notes

The `id 'eclipse'` and `id 'idea'` lines apply plugins for the Eclipse and IntelliJ IDE's, respectively. plugins. If you are using another IDE, try searching around to see if a Gradle plugin exists.

The `baseName`
and `version` allow us to set the _jar_ filename.

## Difference between `sourceCapatibility` and `targetCompatibility`

Next we have `sourceCompatibility` and `targetCompatibility`. What's the difference?
[This post is a good explanation](https://discuss.gradle.org/t/sourcecompatibility-targetcompatibility-usage-reasons/25133/4)
`sourceCompatibility` declares the version of Java your source code is
compatible with, which tells the compiler how to handle parsing your code,
while `targetCompatibility` tells the compiler what version of bytecode to
produce. Most of the time, these two should be the same.
