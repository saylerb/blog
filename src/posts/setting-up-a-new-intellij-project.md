---
path: "/set-up-a-new-intellj-project-with-gradle"
date: "2018-08-26"
title: "How to Set Up a New IntelliJ Project with Gradle"
published: true
slug: setting-up-a-new-intellij-project
---

## Step 1: Install things

### Install IntelliJ CE

- Download IntelliJ Community Edition and copy to Applications folder.
- Open, don't import any settings.
- You can skip the rest of the initial configuration process.

### Make sure you have Java installed

- Java 1.8, which is the current version of Java in Long Term
  Support as of this article, has most of the modern features that
  anyone new to Java will need.
- [Exercism has a pretty good page for instructions on
  installation](http://exercism.io/languages/java/installation#mac-os-x). If
  you want to download an older version of Java, you'll have to make some
  adjustments to the installation instructions. For example, if you want to
  download Java 8 on a Mac with the Homebrew package manager. You can do:

```
brew tap caskroom/versions
brew cask install java8
```

See [this StackOverflow
post](https://stackoverflow.com/questions/24342886/how-to-install-java-8-on-mac)
for more details.

- You don't need to install Gradle, since IntelliJ has a Gradle wrapper out of
  the box.

## Step 2: Create a project

- When you open up IntelliJ, there should be a dialog that is open.
- Select **Create a Project**.
- The Left panel will show different types of projects. Select `Gradel`.
  Gradle is a build tool and dependency manager. Build scripts are written in
  Groovy, a dynamic langauge that feels like a mix of Ruby and Java.
- Select your project SDK in the top drop down menu. The version of Java you
  installed should be there.
- On the next screen, you'll see GroupID, ArtifactID, and Version. These are
  maven artifacts (Maven is another build tool that uses an XML configuration
  file) These aren't that important to us, but we have to fill them out.
  _ GroupID - usually identifies the organization/team for a particular
  project. E.g. `com.companyname.project`. If it's a personal project, you
  can just use your name.
  _ ArtifactID - the name to give to your jar without a version number. E.g.
  `MyFirstProject`. \* Version - the version number. This would increment with each release if
  you were distributing the software. e.g. `1.0`
- On the next screen, make sure to check `Create separate module per source set`, and `Use default gradle wrapper`. You can use the Project JVM for
  Gradle JVM (the same one you specified earlier)
- On the next screen select the location of the project to save
- It will prompt you that the file is going to be created by IntelliJ, click
  yes.
- Intially, your Gradle build will start syncing.

### What is the `build.gradle`?

- In the root of the project, you should see file called `build.gradle` that
  was generated for you. Gradle makes it really easy to build your project
  (compile your Java source files). It can also do many other things, including
  running your tests, and creating a JAR file containing your classes. The
  `build.gradle` file is written in Groovey, a dynamic language that feels like a
  mix of Java and Ruby.
- If you step into the `build.gradle`, you'll see that it already has jUnit
  specified as a dependency, which is great.

### Things to add to your `.gitignore`

A simple `.gitignore` for this project could be:

```
.idea/
build
.gradle
!gradle-wrapper.jar
```

- Ignoring the `.idea/` directory is optional. JetBrains would probably
  recomend publishing it, because it contains metadata about your IDE setup
  which can be useful for others working on the same team. If you think it's valuable
  to publish, by all means go ahead and do it.
- Ignore the `build` directory. This is where gradle will put the compiled Java
  classes. Since anyone who downloads your source code can build the project
  themselves, there's no need to publish this directory.
- Ignore the `.gradle` directory.
- Don't ignore the gradle-wrapper.jar. This can allow anyone to pull the
  project down and build without having to install Gradle manually.

### Basic directory structure

By default, Gradle expects the following directory structure:

```
src
├── main
│   └── java
│       └── hello
│           └── Hello.java
└── test
    └── java
        └── hello
            └── HelloTest.java
```

And that's pretty much it to get started with a new project. The next post will
describe you how to wire up some simple JUnit tests so you can start
developing TDD-style!
